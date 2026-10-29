import { Request, Response } from "express";
import mongoose from "mongoose";
import B2CLead from "../b2c-lead/b2cLead.model";
import B2BLead from "../b2b-lead/b2bLead.model";
import FollowUp from '../follow-up/followUp.model';
import { getStageFromFollowUp } from "../../utils/getLeadStage";
import { StaffModel } from "../staff-management/staff/staff.model";

interface ILeadBase {
    _id: mongoose.Types.ObjectId;
    leadModel: string;
    createdAt: Date;
    isDeleted: boolean;
}

export const filterLeads = async (req: Request, res: Response): Promise<void> => {
    try {
        const { leadStage, leadType } = req.query;

        const baseQuery: any = { isDeleted: false };

        let b2cLeads: any[] = [];
        let b2bLeads: any[] = [];

        if (!leadType || leadType === "B2C") {
            b2cLeads = await B2CLead.find(baseQuery).lean();
        }

        if (!leadType || leadType === "B2B") {
            b2bLeads = await B2BLead.find(baseQuery).lean();
        }

        const allLeads = [...b2cLeads, ...b2bLeads];

        // ✅ Attach latest follow-up + computed stage
        const leadsWithStage = await Promise.all(
            allLeads.map(async (lead) => {
                const latestFU = await FollowUp.findOne({
                    leadId: lead._id,
                }).sort({ createdAt: -1 });

                const computedStage = getStageFromFollowUp(latestFU);

                return {
                    ...lead,
                    latestFollowUp: latestFU,
                    computedStage,
                };
            })
        );

        // ✅ Apply filter HERE
        const filtered = leadStage
            ? leadsWithStage.filter((l) => l.computedStage === leadStage)
            : leadsWithStage;

        const sorted = filtered.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

        res.status(200).json({
            success: true,
            count: sorted.length,
            data: sorted,
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getLeadsByTab = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tab } = req.query;

        // ── 1. fetch all non-deleted leads in parallel ────────────────────
        const [b2cLeads, b2bLeads] = await Promise.all([
            B2CLead.find({ isDeleted: false, leadStatus: { $ne: "Archived" }, }).lean(),
            B2BLead.find({ isDeleted: false, leadStatus: { $ne: "Archived" }, }).lean(),
        ]);

        const allLeads = [...b2cLeads, ...b2bLeads];

        // ── 2. collect all lead IDs in one shot ───────────────────────────
        const allLeadIds = allLeads.map((l) => l._id);

        // ── 3. single aggregation — latest follow-up per lead ─────────────
        // replaces N individual FollowUp.findOne() calls
        const latestFollowUps = await FollowUp.aggregate([
            { $match: { leadId: { $in: allLeadIds } } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$leadId",           // one bucket per lead
                    doc: { $first: "$$ROOT" } // first doc = latest (sorted desc)
                }
            }
        ]);

        // ── 4. build O(1) lookup map: leadId → latest follow-up doc ───────
        const followUpMap = new Map(
            latestFollowUps.map((fu) => [fu._id.toString(), fu.doc])
        );

        // ── 5. attach follow-up + computedStage to each lead ─────────────
        const leadsWithStage = allLeads.map((lead) => {
            const latestFU = followUpMap.get(lead._id.toString()) ?? null;
            const computedStage = getStageFromFollowUp(latestFU);

            return {
                ...lead,
                latestFollowUp: latestFU,
                computedStage,
            };
        });

        // ── 6. filter by tab ──────────────────────────────────────────────
        let filtered = leadsWithStage;

        if (tab === "callback") {
            filtered = leadsWithStage.filter(
                (l) => l.computedStage === "Call Back"
            );
        }

        if (tab === "inprocess") {
            filtered = leadsWithStage.filter(
                (l) => l.computedStage !== "Call Back"
            );
        }

        // ── 7. sort newest first ──────────────────────────────────────────
        const sorted = filtered.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        res.status(200).json({
            success: true,
            count: sorted.length,
            data: sorted,
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getArchivedLeads = async (req: Request, res: Response): Promise<void> => {
    try {
        const [b2cLeads, b2bLeads] = await Promise.all([
            B2CLead.find({ isDeleted: false, leadStatus: "Archived" }).lean(),
            B2BLead.find({ isDeleted: false, leadStatus: "Archived" }).lean(),
        ]);

        const allLeads = [...b2cLeads, ...b2bLeads];

        const sorted = allLeads.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        res.status(200).json({
            success: true,
            count: sorted.length,
            data: sorted,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const assignLeads = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { leadIds, staffId } = req.body;

        if (!leadIds?.length || !staffId) {
            res.status(400).json({
                success: false,
                message: "leadIds and staffId are required",
            });
            return;
        }

        const staff = await StaffModel.findById(staffId);

        if (!staff) {
            res.status(404).json({
                success: false,
                message: "Staff not found",
            });
            return;
        }

        const ownerSnapshot = {
            _id: staff._id,
            name: `${staff.firstName} ${staff.lastName}`,
        };

        await Promise.all([
            B2CLead.updateMany(
                { _id: { $in: leadIds } },
                {
                    assignedOwner: ownerSnapshot,
                    leadStatus: "In Process",
                }
            ),

            B2BLead.updateMany(
                { _id: { $in: leadIds } },
                {
                    assignedOwner: ownerSnapshot,
                    leadStatus: "In Process",
                }
            ),
        ]);

        res.status(200).json({
            success: true,
            message: "Leads assigned successfully",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const archiveLeads = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { leadIds } = req.body;

        if (!leadIds?.length) {
            res.status(400).json({
                success: false,
                message: "leadIds are required",
            });
            return;
        }

        await Promise.all([
            B2CLead.updateMany(
                { _id: { $in: leadIds } },
                {
                    leadStatus: "Archived",
                    assignedOwner: null,    // ← unassign owner when archiving
                }
            ),

            B2BLead.updateMany(
                { _id: { $in: leadIds } },
                {
                    leadStatus: "Archived",
                    assignedOwner: null,    // ← unassign owner when archiving
                }
            ),
        ]);

        res.status(200).json({
            success: true,
            message: "Leads archived successfully",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUnassignedLeads = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const [b2cLeads, b2bLeads] = await Promise.all([
            B2CLead.find({ isDeleted: false, assignedOwner: null }).lean(),
            B2BLead.find({ isDeleted: false, assignedOwner: null }).lean(),
        ]);

        const allLeads = [...b2cLeads, ...b2bLeads];

        const sorted = allLeads.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        res.status(200).json({
            success: true,
            count: sorted.length,
            data: sorted,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// export const getLeadById = async (
//     req: Request,
//     res: Response
// ): Promise<void> => {
//     try {
//         const { id } = req.params;

//         // Search in both collections
//         const lead =
//             (await B2CLead.findById(id).lean()) ||
//             (await B2BLead.findById(id).lean());

//         if (!lead) {
//             res.status(404).json({
//                 success: false,
//                 message: "Lead not found",
//             });
//             return;
//         }

//         // latest followup
//         const latestFollowUp = await FollowUp.findOne({
//             leadId: lead._id,
//         }).sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             data: {
//                 ...lead,
//                 latestFollowUp,
//             },
//         });
//     } catch (error: any) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

export const getLeadById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        // Search in both collections
        const lead =
            (await B2CLead.findById(id).lean()) ||
            (await B2BLead.findById(id).lean());

        if (!lead) {
            res.status(404).json({
                success: false,
                message: "Lead not found",
            });
            return;
        }

        // latest followup
        const latestFollowUp = await FollowUp.findOne({
            leadId: lead._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                ...lead,
                latestFollowUp,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};