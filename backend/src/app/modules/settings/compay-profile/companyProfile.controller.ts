import { Request, Response } from "express";
import { CompanyProfile } from "./companyProfile.model";
import {
    companyProfileValidationSchema
} from "./compayProfile.validation";

export const createOrUpdateCompanyProfile = async (req: Request, res: Response) => {

    try {

        const validatedData =
            companyProfileValidationSchema.parse(
                req.body
            );

        const userId = req.user.userId;

        const profile =
            await CompanyProfile.findOneAndUpdate(
                { userId },

                {
                    userId,
                    ...validatedData
                },

                {
                    new: true,
                    upsert: true
                }
            );

        res.status(200).json({
            success: true,
            message:
                "Company profile saved successfully",
            data: profile
        });

    } catch (error) {

        const err = error as Error;

        res.status(500).json({
            success: false,
            message:
                "Internal server error",
            error: err.message
        });
    }
};

export const getCompanyProfile = async (req: Request, res: Response) => {

    try {

        const userId = req.user.userId;

        const profile =
            await CompanyProfile.findOne({
                userId
            });

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {

        const err = error as Error;

        res.status(500).json({
            success: false,
            message:
                "Internal server error",
            error: err.message
        });
    }
};