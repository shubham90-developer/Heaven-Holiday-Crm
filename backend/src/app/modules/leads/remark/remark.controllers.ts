import { Request, Response } from "express";
import mongoose from "mongoose";
import LeadRemark from "./remark.model";
import B2CLead from "../../b2c-lead/b2cLead.model";
import B2BLead from "../../b2b-lead/b2bLead.model";
import {
    createLeadRemarkValidation,
    updateLeadRemarkValidation,
} from "./remark.validation";


// ─── HELPER: Resolve leadModel from leadId ────────────────────────────────────

const resolveLeadModel = async (
    leadId: string
): Promise<"B2CLead" | "B2BLead" | null> => {

    const [b2cLead, b2bLead] = await Promise.all([
        B2CLead.findById(leadId).select("_id"),
        B2BLead.findById(leadId).select("_id"),
    ]);

    if (b2cLead) return "B2CLead";
    if (b2bLead) return "B2BLead";
    return null;
};


// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createLeadRemark = async (req: Request, res: Response) => {

    try {

        const validatedData = createLeadRemarkValidation.parse(req.body);
        const { leadId } = validatedData;

        if (!mongoose.isValidObjectId(leadId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leadId",
            });
        }

        const leadModel = await resolveLeadModel(leadId);

        if (!leadModel) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        const remark = await LeadRemark.create({
            ...validatedData,
            leadModel,
        });

        const { logTouchPoint } = await import("../../touch-points/touchPoint.service");
        await logTouchPoint({
            leadId,
            leadModel,
            queryId: req.body.queryId || undefined,
            type: "Remarks",
            title: `Remarks (by: ${req.body.createdBy || "Staff"})`,
            description: validatedData.remark,
            createdBy: req.body.createdBy || "",
            meta: { remarkType: validatedData.remarkType, remarkId: remark._id },
        });

        return res.status(201).json({
            success: true,
            message: "Remark added successfully",
            data: remark,
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ─── GET ALL REMARKS BY LEAD ID ───────────────────────────────────────────────

export const getRemarksByLeadId = async (req: Request, res: Response) => {

    try {

        const { leadId } = req.params;

        const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
        const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
        const skip  = (page - 1) * limit;

        if (!mongoose.isValidObjectId(leadId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid leadId",
            });
        }

        const [remarks, total] = await Promise.all([
            LeadRemark.find({ leadId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            LeadRemark.countDocuments({ leadId }),
        ]);

        return res.status(200).json({
            success: true,
            data: remarks,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ─── GET SINGLE REMARK BY ID ──────────────────────────────────────────────────

export const getRemarkById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid remark id",
            });
        }

        const remark = await LeadRemark.findById(id);

        if (!remark) {
            return res.status(404).json({
                success: false,
                message: "Remark not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: remark,
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateLeadRemark = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid remark id",
            });
        }

        const validatedData = updateLeadRemarkValidation.parse(req.body);

        const updatedRemark = await LeadRemark.findByIdAndUpdate(
            id,
            validatedData,
            { new: true }
        );

        if (!updatedRemark) {
            return res.status(404).json({
                success: false,
                message: "Remark not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Remark updated successfully",
            data: updatedRemark,
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ─── DELETE ───────────────────────────────────────────────────────────────────

export const deleteLeadRemark = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid remark id",
            });
        }

        const deletedRemark = await LeadRemark.findByIdAndDelete(id);

        if (!deletedRemark) {
            return res.status(404).json({
                success: false,
                message: "Remark not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Remark deleted successfully",
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};