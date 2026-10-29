import { Request, Response } from "express";
import Query from "./queries.model";
import B2CLead from "../b2c-lead/b2cLead.model";
import B2BLead from "../b2b-lead/b2bLead.model";
import mongoose from "mongoose";
import { RequirementType } from "./queries.interface";
import { StaffModel } from "../staff-management/staff/staff.model";

const detailFieldMap: Record<RequirementType, string> = {
    Package: "packageDetails",
    Flight: "flightDetails",
    Transfer: "transferDetails",
    Visa: "visaDetails",
    Hotel: "hotelDetails",
    Sightseeing: "sightseeingDetails",
    Miscellaneous: "miscellaneousDetails",
};

const escapeRegex = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildQueryListMatch = (query: Request["query"]) => {
    const {
        stage,
        leadId,
        assigned,
        category,
        leadQuality,
        isArchived,
    } = query;

    const filter: Record<string, unknown> = { isDeleted: false };

    if (leadId && mongoose.isValidObjectId(leadId as string)) {
        filter.leadId = new mongoose.Types.ObjectId(leadId as string);
    }
    if (stage) filter.stage = stage;

    if (assigned === "true") {
        filter.assignedToSales = { $ne: null };
    }
    if (assigned === "false") {
        filter.assignedToSales = null;
    }

    if (isArchived === "true") {
        filter.isArchived = true;
    } else {
        filter.isArchived = { $ne: true };
    }

    if (leadQuality === "no_status") {
        filter.$or = [
            { leadQuality: "no_status" },
            { leadQuality: { $exists: false } },
            { leadQuality: null },
            { leadQuality: "" },
        ];
    } else if (typeof leadQuality === "string" && leadQuality) {
        filter.leadQuality = leadQuality;
    }

    if (category) {
        switch (category) {
            case "in-progress":
                filter.stage = {
                    $in: [
                        "Interested",
                        "Call Back",
                        "Follow Up",
                        "Follow Up - Changes Required",
                        "Follow Up - Negotiation",
                        "interested",
                        "call_back",
                        "follow_up",
                        "follow_up_changes",
                        "negotiation",
                        "query_created",
                        "proposal_sent",
                    ],
                };
                break;
            case "confirmed":
                filter.stage = {
                    $in: [
                        "Confirmed - Booking Request",
                        "Verbal Confirmed",
                        "confirmed",
                        "verbal_confirmed",
                        "confirmed_booking_requested",
                        "booking_requested",
                    ],
                };
                break;
            case "rejected":
                filter.stage = {
                    $in: [
                        "Lost - Not Interested",
                        "Lost - Budget Issue",
                        "Lost - Booked Elsewhere Confirmed",
                        "Lost - Plan Cancelled",
                        "lost_wrong_number",
                        "lost_not_interested",
                        "lost_plan_changed",
                        "lost_budget_issue",
                        "lost_language_issue",
                        "lost_booked_elsewhere",
                        "lost_plan_postponed",
                        "lost_duplicate_lead",
                        "lost_destination_changed",
                        "lost_different_trip",
                        "query_expired",
                    ],
                };
                break;
            case "callback":
                filter.stage = { $in: ["Call Back", "call_back"] };
                break;
            case "unassigned":
                filter.assignedToSales = null;
                break;
            default:
                break;
        }
    }

    return filter;
};

const buildFlattenedQueryPipeline = (
    reqQuery: Request["query"],
    options: { skip?: number; limit?: number; includeProposalCount?: boolean } = {}
) => {
    const { requirementType, category, search } = reqQuery;
    const filter = buildQueryListMatch(reqQuery);
    const pipeline: Record<string, unknown>[] = [
        { $match: filter },
        { $unwind: { path: "$queries", preserveNullAndEmptyArrays: false } },
    ];

    if (requirementType) {
        pipeline.push({
            $match: { "queries.requirementType": requirementType },
        });
    }

    if (category === "recent") {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        pipeline.push({
            $match: {
                $or: [
                    { "queries.createdAt": { $gte: since } },
                    { createdAt: { $gte: since } },
                ],
            },
        });
    }

    pipeline.push(
        {
            $lookup: {
                from: B2CLead.collection.name,
                localField: "leadId",
                foreignField: "_id",
                as: "_b2cLead",
            },
        },
        {
            $lookup: {
                from: B2BLead.collection.name,
                localField: "leadId",
                foreignField: "_id",
                as: "_b2bLead",
            },
        },
        {
            $addFields: {
                leadId: {
                    $ifNull: [
                        { $arrayElemAt: ["$_b2cLead", 0] },
                        { $arrayElemAt: ["$_b2bLead", 0] },
                    ],
                },
            },
        }
    );

    const searchText = typeof search === "string" ? search.trim() : "";
    if (searchText) {
        const rx = new RegExp(escapeRegex(searchText), "i");
        pipeline.push({
            $match: {
                $or: [
                    { "leadId.firstName": rx },
                    { "leadId.lastName": rx },
                    { "leadId.email": rx },
                    { "leadId.mobile": rx },
                    { "leadId.phone": rx },
                    { "leadId.companyName": rx },
                    { "leadId.contactPerson": rx },
                    { "assignedToSales.name": rx },
                    { "queries.requirementType": rx },
                    { "queries.packageDetails.goingTo": rx },
                    { "queries.packageDetails.goingFrom": rx },
                ],
            },
        });
    }

    if (options.includeProposalCount) {
        pipeline.push(
            {
                $lookup: {
                    from: "packagebookings",
                    let: { qid: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$queryId", "$$qid"] },
                                isDeleted: { $ne: true },
                                status: { $ne: "cancelled" },
                            },
                        },
                        { $count: "n" },
                    ],
                    as: "_proposals",
                },
            },
            {
                $addFields: {
                    proposalCount: {
                        $ifNull: [{ $arrayElemAt: ["$_proposals.n", 0] }, 0],
                    },
                },
            }
        );
    }

    pipeline.push(
        { $sort: { "queries.createdAt": -1, createdAt: -1 } },
        {
            $project: {
                _b2cLead: 0,
                _b2bLead: 0,
                _proposals: 0,
            },
        }
    );

    const dataStages: Record<string, unknown>[] = [];
    if (typeof options.skip === "number") dataStages.push({ $skip: options.skip });
    if (typeof options.limit === "number") dataStages.push({ $limit: options.limit });
    dataStages.push({
        $addFields: {
            queryItemId: "$queries._id",
            queryCreatedAt: "$queries.createdAt",
            queryUpdatedAt: "$queries.updatedAt",
            queries: ["$queries"],
        },
    });

    pipeline.push({
        $facet: {
            metadata: [{ $count: "total" }],
            data: dataStages,
        },
    });

    return pipeline;
};

export const createQuery = async (req: Request, res: Response) => {
    try {
        const { leadId } = req.query; // leadId from query params
        const { requirementType } = req.body as { requirementType: RequirementType };

        if (!leadId || !mongoose.isValidObjectId(leadId as string)) {
            return res.status(400).json({ success: false, message: "Invalid or missing leadId" });
        }

        if (!requirementType || !detailFieldMap[requirementType]) {
            return res.status(400).json({ success: false, message: "Invalid or missing requirementType" });
        }

        const requiredField = detailFieldMap[requirementType];

        if (!req.body[requiredField]) {
            return res.status(400).json({ success: false, message: `${requiredField} is required` });
        }

        // Resolve lead
        const [b2cLead, b2bLead] = await Promise.all([
            B2CLead.findById(leadId).select("_id"),
            B2BLead.findById(leadId).select("_id"),
        ]);

        let leadModel: "B2CLead" | "B2BLead" | null = null;
        if (b2cLead) leadModel = "B2CLead";
        else if (b2bLead) leadModel = "B2BLead";

        if (!leadModel) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        // Check if a Query document exists for this lead
        let queryDoc = await Query.findOne({ leadId, isDeleted: false });

        // Build new query object
        const newQueryItem: any = {
            requirementType,
            [requiredField]: req.body[requiredField],
        };

        if (!queryDoc) {
            // Create a new Query document with the first query
            queryDoc = new Query({
                leadId,
                leadModel,
                queries: [newQueryItem],
                stage: req.body.stage || "Query Created",
                remark: req.body.remark || "",
                assignedToSales: req.body.assignedToSales || null,
            });
        } else {
            // Push new query into existing queries array
            queryDoc.queries.push(newQueryItem);
        }

        await queryDoc.save();

        const { logTouchPoint } = await import("../touch-points/touchPoint.service");
        await logTouchPoint({
            queryId: queryDoc._id,
            leadId: queryDoc.leadId,
            leadModel: queryDoc.leadModel,
            type: "Query Created",
            title: "Query Created",
            description: `${requirementType} enquiry created`,
            createdBy: req.body.createdBy || "",
            meta: { requirementType },
        });

        res.status(201).json({
            success: true,
            message: "Query created successfully",
            data: queryDoc,
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllQueries = async (req: Request, res: Response) => {
    try {
        const pageNum = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(String(req.query.limit || "10"), 10) || 10));
        const skip = (pageNum - 1) * limitNum;

        const pipeline = buildFlattenedQueryPipeline(req.query, { skip, limit: limitNum });
        const [result] = await Query.aggregate(pipeline as unknown as mongoose.PipelineStage[]);
        const total = result?.metadata?.[0]?.total ?? 0;
        const data = result?.data ?? [];

        res.json({
            success: true,
            count: total,
            page: pageNum,
            limit: limitNum,
            hasMore: skip + data.length < total,
            data,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const exportQueries = async (req: Request, res: Response) => {
    try {
        const pipeline = buildFlattenedQueryPipeline(req.query, {
            limit: 5000,
            includeProposalCount: true,
        });
        const [result] = await Query.aggregate(pipeline as unknown as mongoose.PipelineStage[]);
        const data = result?.data ?? [];

        return res.json({
            success: true,
            count: result?.metadata?.[0]?.total ?? data.length,
            data,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const bulkUpdateQueries = async (req: Request, res: Response) => {
    try {
        const { queryIds, leadQuality, isArchived } = req.body as {
            queryIds?: string[];
            leadQuality?: string;
            isArchived?: boolean;
        };

        if (!queryIds?.length) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one query",
            });
        }

        const update: Record<string, unknown> = {};
        if (leadQuality) {
            if (!["hot", "warm", "cold", "no_status"].includes(leadQuality)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid lead quality",
                });
            }
            update.leadQuality = leadQuality;
        }
        if (typeof isArchived === "boolean") {
            update.isArchived = isArchived;
        }

        if (!Object.keys(update).length) {
            return res.status(400).json({
                success: false,
                message: "Nothing to update",
            });
        }

        const result = await Query.updateMany(
            { _id: { $in: queryIds }, isDeleted: false },
            { $set: update }
        );

        return res.json({
            success: true,
            message: "Queries updated successfully",
            modifiedCount: result.modifiedCount,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getRecentQueriesByLeadId = async (req: Request, res: Response) => {
    try {
        const { leadId } = req.params;

        if (!leadId || !mongoose.isValidObjectId(leadId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing leadId",
            });
        }

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const results = await Query.aggregate([
            {
                $match: {
                    isDeleted: false,
                    leadId: new mongoose.Types.ObjectId(leadId as string),
                }
            },

            { $unwind: "$queries" },

            {
                $match: {
                    "queries.createdAt": { $gte: since }
                }
            },

            { $sort: { "queries.createdAt": -1 } },

            {
                $group: {
                    _id: "$_id",
                    leadId: { $first: "$leadId" },
                    leadModel: { $first: "$leadModel" },
                    stage: { $first: "$stage" },
                    remark: { $first: "$remark" },
                    assignedToSales: { $first: "$assignedToSales" },
                    createdAt: { $first: "$createdAt" },
                    recentQueries: { $push: "$queries" },
                }
            },
        ]);

        if (!results.length) {
            return res.status(404).json({
                success: false,
                message: "No recent queries found for this lead",
            });
        }

        return res.status(200).json({
            success: true,
            count: results[0].recentQueries.length,
            data: results[0],
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getQueryById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const query = await Query.findById(id)
            .populate("leadId", "salutation firstName lastName email phone mobile companyName")
        // .populate("assignedToOwner", "name email");

        res.status(200).json({
            success: true,
            message: "Query fetched succesfully",
            data: query
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getAllConfirmedQueries = async (req: Request, res: Response) => {
    try {
        const queries = await Query.find({
            isDeleted: false,
            isArchived: { $ne: true },
            stage: {
                $in: [
                    "confirmed",
                    "verbal_confirmed",
                    "confirmed_booking_requested",
                    "Confirmed - Booking Request",
                    "Verbal Confirmed",
                ],
            },
        })
            .populate("leadId")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: queries });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// export const getCallBackQueries = async (req: Request, res: Response) => {
//     try {
//         const queries = await Query.find({
//             isDeleted: false,
//             stage: { $in: ["call_back"] }
//         })
//             .populate("leadId")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({ data: queries });
//     } catch (error) {
//         return res.status(500).json({ message: "Server error", error });
//     }
// };

// export const getInProcessQueries = async (req: Request, res: Response) => {
//     try {
//         const queries = await Query.find({
//             isDeleted: false,
//             stage: { $in: ["proposal_sent", "query_created", "interested", "follow_up", 
//                 "follow_up_changes", "requirement", "destination_finalized", 
//                 "negotiation", "visa_process",
//                 "proposal_requested"
//             ] }
//         })
//             .populate("leadId")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({ data: queries });
//     } catch (error) {
//         return res.status(500).json({ message: "Server error", error });
//     }
// };

// export const getRejectedQueries = async (req: Request, res: Response) => {
//     try {
//         const queries = await Query.find({
//             isDeleted: false,
//             stage: { $in: ["lost_wrong_number", "lost_not_interested", "lost_plan_changed", "lost_budget_issue", 
//                 "lost_language_issue", "lost_booked_elsewhere", "lost_plan_postponed", 
//                 "lost_duplicate_lead", "lost_destination_changed",
//                 "lost_different_trip", "query_expired"
//             ] }
//         })
//             .populate("leadId")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({ data: queries });
//     } catch (error) {
//         return res.status(500).json({ message: "Server error", error });
//     }
// };

// export const getUnAssignedQueries = async (req: Request, res: Response) => {
//     try {
//         const queries = await Query.find({
//             isDeleted: false,
//             assignedToSales: null
//         })
//             .populate("leadId")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({ data: queries });
//     } catch (error) {
//         return res.status(500).json({ message: "Server error", error });
//     }
// };

// export const getRecentQueries = async (req: Request, res: Response) => {
//     try {
//         // ── 1. calculate 24 hour window ───────────────────────────────────
//         const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

//         // ── 2. fetch all queries created in last 24 hours ─────────────────
//         const queries = await Query.find({
//             isDeleted: false,
//             createdAt: { $gte: since },
//         })
//             .populate("leadId")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             success: true,
//             count: queries.length,
//             data: queries,
//         });

//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

export const deleteQueryById = async (req: Request, res: Response) => {
    try {

        const { id } = req.query;

        const query = await Query.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true });

        res.status(200).json({
            success: true,
            message: "Query deleted successfully",
            data: query
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const assignQueries = async (req: Request, res: Response): Promise<void> => {
    try {
        const { queryIds, staffId } = req.body;

        // ── 1. validate request body ──────────────────────────────────────
        if (!queryIds?.length || !staffId) {
            res.status(400).json({
                success: false,
                message: "queryIds and staffId are required",
            });
            return;
        }

        // ── 2. verify staff exists ────────────────────────────────────────
        const staff = await StaffModel.findById(staffId);

        if (!staff) {
            res.status(404).json({
                success: false,
                message: "Staff not found",
            });
            return;
        }

        // ── 3. build snapshot — matches StaffSnapshotSchema in Query model ─
        // Query model expects: { _id: ObjectId, name: String }
        const salesSnapshot = {
            _id: staff._id,
            name: `${staff.firstName} ${staff.lastName}`,
        };

        // ── 4. update all selected queries in one shot ────────────────────
        await Query.updateMany(
            { _id: { $in: queryIds }, isDeleted: false },
            {
                assignedToSales: salesSnapshot,
                // stage: "Query Created",      // reset stage on fresh assignment
            }
        );

        res.status(200).json({
            success: true,
            message: "Queries assigned successfully",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateQueryStage = async (req: Request, res: Response) => {
    try {
        const { queryId } = req.params;
        const { stage } = req.body;

        if (!stage) {
            return res.status(400).json({ message: "Stage is required" });
        }

        const updated = await Query.findByIdAndUpdate(
            queryId,
            { stage },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Query not found" });
        }

        const { logTouchPoint } = await import("../touch-points/touchPoint.service");
        await logTouchPoint({
            queryId: updated._id,
            leadId: updated.leadId,
            leadModel: updated.leadModel,
            type: "Status",
            title: stage,
            description: `Stage updated to ${stage}`,
            createdBy: req.body.updatedBy || updated.assignedToSales?.name || "",
        });

        return res.status(200).json({ message: "Stage updated", data: updated });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const getWIP_PackagesQueries = async (req: Request, res: Response) => {
    try {
        const queries = await Query.find({
            isDeleted: false,
            stage: { $nin: ["confirmed", "verbal_confirmed", "confirmed_booking_requested"] }
        })
            .populate("leadId")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: queries });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const getQueryStatusReportOverall = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const match: any = { isDeleted: false };

        if (startDate && endDate) {
            match.createdAt = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
            };
        }

        const result = await Query.aggregate([
            { $match: { isDeleted: { $ne: true } } },

            {
                $unwind: {
                    path: "$queries",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $group: {
                    _id: null,

                    totalQueries: { $sum: 1 },

                    // Correct mapping based on YOUR DB
                    noStatus: {
                        $sum: {
                            $cond: [{ $eq: ["$stage", "Query Created"] }, 1, 0]
                        }
                    },

                    // You currently don't have "in process" stages → keep 0 or map later
                    inProcess: { $sum: 0 },

                    // You don't have hot/warm/cold → will be 0
                    hot: { $sum: 0 },
                    warm: { $sum: 0 },
                    cold: { $sum: 0 },

                    // THIS IS YOUR MAIN FIX
                    verbalConfirmed: {
                        $sum: {
                            $cond: [{ $eq: ["$stage", "confirmed"] }, 1, 0]
                        }
                    },

                    won: {
                        $sum: {
                            $cond: [{ $eq: ["$stage", "confirmed"] }, 1, 0]
                        }
                    },

                    lost: { $sum: 0 }
                }
            },

            { $project: { _id: 0 } }
        ]);

        res.json({
            success: true,
            data: result[0] || {
                totalQueries: 0,
                inProcess: 0,
                noStatus: 0,
                hot: 0,
                warm: 0,
                cold: 0,
                verbalConfirmed: 0,
                lost: 0,
                won: 0
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET QUERIES BY LEAD ID
export const getQueriesByLeadId = async (req: Request, res: Response) => {
    try {

        const { leadId } = req.params;

        // VALIDATION
        if (
            !leadId ||
            !mongoose.isValidObjectId(leadId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid Lead ID",
            });
        }

        // FETCH QUERIES
        const queries = await Query.find({
            leadId,
            isDeleted: false,
        })
            .populate("leadId")
            .sort({ updatedAt: -1, createdAt: -1 });

        // Newest enquiry items first within each document
        const data = queries.map((doc) => {
            const obj = doc.toObject();
            obj.queries = [...(obj.queries || [])].sort((a: any, b: any) => {
                const aTime = new Date(a.createdAt || 0).getTime();
                const bTime = new Date(b.createdAt || 0).getTime();
                return bTime - aTime;
            });
            return obj;
        });

        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });

    } catch (error: any) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getCallBackQueries = async (req: Request, res: Response) => {
    try {
        const queries = await Query.find({
            isDeleted: false,
            isArchived: { $ne: true },
            stage: { $in: ["call_back"] }
        })
            .populate("leadId")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: queries });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const getInProcessQueries = async (req: Request, res: Response) => {
    try {
        const queries = await Query.find({
            isDeleted: false,
            isArchived: { $ne: true },
            stage: { $in: ["proposal_sent", "query_created", "interested", "follow_up", 
                "follow_up_changes", "requirement", "destination_finalized", 
                "negotiation", "visa_process",
                "proposal_requested"
            ] }
        })
            .populate("leadId")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: queries });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const getRejectedQueries = async (req: Request, res: Response) => {
    try {
        const queries = await Query.find({
            isDeleted: false,
            isArchived: { $ne: true },
            stage: { $in: ["lost_wrong_number", "lost_not_interested", "lost_plan_changed", "lost_budget_issue", 
                "lost_language_issue", "lost_booked_elsewhere", "lost_plan_postponed", 
                "lost_duplicate_lead", "lost_destination_changed",
                "lost_different_trip", "query_expired"
            ] }
        })
            .populate("leadId")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: queries });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const getUnAssignedQueries = async (req: Request, res: Response) => {
    try {
        const queries = await Query.find({
            isDeleted: false,
            isArchived: { $ne: true },
            assignedToSales: null
        })
            .populate("leadId")
            .sort({ createdAt: -1 });

        return res.status(200).json({ data: queries });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const getRecentQueries = async (req: Request, res: Response) => {
    try {
        // ── 1. calculate 24 hour window ───────────────────────────────────
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // ── 2. fetch all queries created in last 24 hours ─────────────────
        const queries = await Query.find({
            isDeleted: false,
            isArchived: { $ne: true },
            createdAt: { $gte: since },
        })
            .populate("leadId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: queries.length,
            data: queries,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};