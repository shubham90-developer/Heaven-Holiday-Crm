import { Request, Response } from "express";
import { termsConditions } from "./termsConditions.model";
import { termsConditionsValidationSchema } from "./termsConditions.validation";
import {
    TERMS_CONDITION_KEYS,
    buildEmptyTerms,
    normalizeTermsDocument,
} from "./termsConditions.constants";

export const createOrUpdateTermsConditions = async (req: Request, res: Response) => {
    try {
        const parsed = termsConditionsValidationSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(200).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const parsedData = parsed.data as Record<string, unknown>;
        const payload: Record<string, unknown> = {
            defaultSelected: parsedData.defaultSelected || {},
        };

        for (const key of TERMS_CONDITION_KEYS) {
            payload[key] = parsedData[key] ?? "";
        }

        const result = await termsConditions.findOneAndUpdate(
            {},
            { $set: payload },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Terms & Conditions saved successfully",
            data: normalizeTermsDocument(result),
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const getTermsConditions = async (req: Request, res: Response) => {
    try {
        const result = await termsConditions.findOne({});

        return res.status(200).json({
            success: true,
            message: result
                ? "Terms & Conditions fetched successfully"
                : "No terms saved yet",
            data: result ? normalizeTermsDocument(result) : buildEmptyTerms(),
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};
