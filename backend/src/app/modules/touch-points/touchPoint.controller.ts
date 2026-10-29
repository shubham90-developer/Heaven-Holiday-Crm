import { Request, Response } from "express";
import mongoose from "mongoose";
import { TouchPointModel } from "./touchPoint.model";
import { logTouchPoint } from "./touchPoint.service";
import Query from "../queries/queries.model";
import LeadRemark from "../leads/remark/remark.model";
import FollowUp from "../follow-up/followUp.model";
import { PackageBookingModel } from "../booking/packages/packages.model";

const getLeadName = (lead: any) => {
    if (!lead) return "Customer";
    if (lead.companyName) return lead.companyName;
    const name = `${lead.salutation || ""} ${lead.firstName || ""} ${lead.lastName || ""}`.trim();
    return name || lead.mobile || lead.email || "Customer";
};

export const createTouchPoint = async (req: Request, res: Response) => {
    try {
        const { queryId, leadId, leadModel, type, title, description, createdBy, meta } =
            req.body;

        if (!type || !title) {
            return res.status(400).json({
                success: false,
                message: "type and title are required",
            });
        }

        const created = await logTouchPoint({
            queryId,
            leadId,
            leadModel,
            type,
            title,
            description,
            createdBy,
            meta,
        });

        if (!created) {
            return res.status(400).json({
                success: false,
                message: "queryId or leadId is required",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Touch point recorded",
            data: created,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};

export const getTouchPointsByQuery = async (req: Request, res: Response) => {
    try {
        const { queryId } = req.params;

        if (!mongoose.isValidObjectId(queryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid queryId",
            });
        }

        const query = await Query.findOne({
            _id: queryId,
            isDeleted: false,
        }).populate("leadId");

        if (!query) {
            return res.status(404).json({
                success: false,
                message: "Query not found",
            });
        }

        const leadId = query.leadId?._id || query.leadId;
        const lead = query.leadId as any;

        const [logged, remarks, followUps, packages] = await Promise.all([
            TouchPointModel.find({
                isDeleted: false,
                $or: [
                    { queryId: query._id },
                    ...(leadId
                        ? [{ leadId: new mongoose.Types.ObjectId(String(leadId)) }]
                        : []),
                ],
            }).sort({ createdAt: -1 }),
            leadId
                ? LeadRemark.find({ leadId }).sort({ createdAt: -1 }).limit(100)
                : Promise.resolve([]),
            leadId
                ? FollowUp.find({ leadId }).sort({ createdAt: -1 }).limit(100)
                : Promise.resolve([]),
            PackageBookingModel.find({
                queryId: query._id,
                isDeleted: false,
            })
                .sort({ createdAt: -1 })
                .limit(50),
        ]);

        type TimelineItem = {
            _id: string;
            type: string;
            title: string;
            description?: string;
            createdBy?: string;
            createdAt: Date | string;
            source: string;
        };

        const timeline: TimelineItem[] = [];
        const seenKeys = new Set<string>();
        const loggedProposalIds = new Set<string>();

        logged.forEach((tp) => {
            const proposalId = tp.meta?.proposalId || tp.meta?.bookingId;
            if (proposalId) loggedProposalIds.add(String(proposalId));
        });

        const pushUnique = (item: TimelineItem) => {
            const key = `${item.type}|${item.title}|${new Date(item.createdAt).getTime()}`;
            if (seenKeys.has(key)) return;
            seenKeys.add(key);
            timeline.push(item);
        };

        logged.forEach((tp) => {
            pushUnique({
                _id: String(tp._id),
                type: tp.type,
                title: tp.title,
                description: tp.description || "",
                createdBy: tp.createdBy || "",
                createdAt: tp.createdAt,
                source: "touchpoint",
            });
        });

        remarks.forEach((remark: any) => {
            pushUnique({
                _id: `remark-${remark._id}`,
                type: "Remarks",
                title: `Remarks (by: Staff)`,
                description: remark.remark || "",
                createdBy: "",
                createdAt: remark.createdAt,
                source: "remark",
            });
        });

        followUps.forEach((fu: any) => {
            const isCall = fu.type === "Call";
            pushUnique({
                _id: `followup-${fu._id}`,
                type: isCall ? "Call" : "Todo",
                title: isCall
                    ? `Call (${fu.direction || "Outgoing"}) — ${fu.outcome || fu.status || "Pending"}`
                    : `ToDo — ${fu.status || "Pending"}`,
                description: fu.details || "",
                createdBy: "",
                createdAt: fu.createdAt,
                source: "followup",
            });
        });

        packages.forEach((pkg: any) => {
            const pkgKey = String(pkg._id);
            const proposalKey = String(pkg.proposalId || "");
            if (
                loggedProposalIds.has(pkgKey) ||
                (proposalKey && loggedProposalIds.has(proposalKey))
            ) {
                return;
            }

            const customerName = getLeadName(pkg.customerDetails || lead);
            const destination =
                pkg.goingTo?.split("(")[0]?.trim() || pkg.goingTo || "";
            const owner = pkg.owner || "";
            const travelers = pkg.travelers || 1;
            const travelDate = pkg.travelDate
                ? new Date(pkg.travelDate).toLocaleDateString("en-GB")
                : "";

            const emailTitle = `${pkg.proposalId || pkg.enquiryId} - ${customerName} /${travelers}/${travelDate}/${owner}/${destination}`;

            if (pkg.status === "shared" || pkg.bookingStage === "Proposal Shared") {
                pushUnique({
                    _id: `proposal-email-${pkg._id}`,
                    type: "Email",
                    title: emailTitle,
                    description: "Proposal shared with customer",
                    createdBy: owner,
                    createdAt: pkg.updatedAt || pkg.createdAt,
                    source: "package",
                });
                pushUnique({
                    _id: `proposal-status-${pkg._id}`,
                    type: "Status",
                    title: "Proposal Sent",
                    description: `Proposal #${pkg.proposalId || pkg.enquiryId}`,
                    createdBy: owner,
                    createdAt: pkg.updatedAt || pkg.createdAt,
                    source: "package",
                });
            } else {
                pushUnique({
                    _id: `proposal-draft-${pkg._id}`,
                    type: "Proposal",
                    title: `Proposal #${pkg.proposalId || pkg.enquiryId} (${pkg.status || "draft"})`,
                    description: emailTitle,
                    createdBy: owner,
                    createdAt: pkg.createdAt,
                    source: "package",
                });
            }
        });

        // Query created / current stage as fallback status if empty
        if (query.createdAt) {
            pushUnique({
                _id: `query-created-${query._id}`,
                type: "Query Created",
                title: "Query Created",
                description: query.stage || "Query Created",
                createdBy: query.assignedToSales?.name || "",
                createdAt: query.createdAt,
                source: "query",
            });
        }

        timeline.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const summary = {
            customerName: getLeadName(lead),
            currentStage: query.stage || "—",
            leadQuality: (query as { leadQuality?: string }).leadQuality
                ? String((query as { leadQuality?: string }).leadQuality)
                : "No Status",
            totalCall: timeline.filter((t) => t.type === "Call").length,
            totalTodo: timeline.filter((t) => t.type === "Todo").length,
            totalMeeting: timeline.filter((t) => t.type === "Meeting").length,
            totalSMS: timeline.filter((t) => t.type === "SMS").length,
        };

        return res.json({
            success: true,
            data: {
                summary,
                timeline,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};
