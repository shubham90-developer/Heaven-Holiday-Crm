import { Request, Response } from "express";
import { emailTemplate } from "./emailTemplate.model";
import {
    createEmailTemplateValidationSchema,
    updateEmailTemplateValidationSchema
} from "./emailTemplate.validation";

export const AddEmailTemplate = async (req: Request, res: Response) => {

    try {

        const parsed = createEmailTemplateValidationSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(200).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors
            })
        }

        const { templateName, subject, message, status } = parsed.data;

        const result = await emailTemplate.create({
            templateName,
            subject,
            message,
            status
        })

        return res.status(200).json({
            success: true,
            message: "Email Template created successfully",
            data: result
        })

    } catch (err: any) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });

    }
}

export const updateEmailTemplate = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const parsed = updateEmailTemplateValidationSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const updatedData = await emailTemplate.findByIdAndUpdate(
            id,
            parsed.data,
            { new: true, runValidators: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                success: false,
                message: "Email template not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email template updated successfully",
            data: updatedData,
        });

    } catch (err: any) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });

    }
}

export const getAllEmailTemplates = async (req: Request, res: Response) => {

    try {

        const result = await emailTemplate.find({ isDeleted: false });

        if (!result) {
            return res.status(200).json({
                success: false,
                message: "Data does not exists"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email Templates fetched successfully",
            data: result
        })

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

export const getEmailTemplateById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const result = await emailTemplate.findById(id);

        if (!result) {

            return res.status(400).json({
                success: false,
                message: "Data not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Email Template fetched successfully",
            data: result
        })

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

export const deleteEmailTemplateById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const deletedData = await emailTemplate.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        )

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                message: "Email template not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email template deleted successfully",
            data: deletedData,
        });

    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}