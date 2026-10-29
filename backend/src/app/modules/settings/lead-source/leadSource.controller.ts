import { Request, Response } from "express";
import { LeadSourceModel } from "./leadSource.model";
import { createLeadSourceSchema, updateLeadSourceSchema } from "./leadSource.validation";

export const createLeadSource = async (req: Request, res: Response) => {

    try {

        const parsed = createLeadSourceSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(200).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors
            })
        }

        const { title, status, enabled } = parsed.data;

        const result = await LeadSourceModel.create({
            title,
            status,
            enabled
        })

        return res.status(200).json({
            success: true,
            message: "Lead Source created successfully",
            data: result
        })

    } catch (err: any) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const getLeadSources = async (_req: Request, res: Response) => {

    try {

        const data = await LeadSourceModel.find({ isDeleted: false });

        return res.status(200).json({
            success: true,
            message: "Fecthed lead source successfully",
            data: data
        })

    } catch (err: any) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });

    }

};

export const getLeadSourceById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const result = await LeadSourceModel.findById(id);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "No data found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Lead source fetched successfully",
            data: result
        })

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const updateLeadSource = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const parsed = updateLeadSourceSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(200).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors
            })
        }

        const leadSource = await LeadSourceModel.findByIdAndUpdate(
            id,
            parsed.data,
            { new: true }
        );

        if (!leadSource) {
            return res.status(404).json({
                success: false,
                message: "Lead source not found"
            });
        }

        return res.status(200).json({ success: true, data: leadSource });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }

};

export const deleteLeadSource = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const result = await LeadSourceModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        )

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Lead Source not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead Source deleted successfully",
            data: result,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }

}; 