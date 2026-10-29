import { Request, Response } from "express";
import { FoodPreferenceModel } from "./foodPreference.model";
import {
    createFoodPreferenceSchema,
    updateFoodPreferenceSchema,
} from "./foodPreference.validation";

const DEFAULT_FOOD_PREFERENCES = [
    "Veg",
    "Non Veg",
    "Jain/Satwik",
    "Pure Veg",
    "Eggetarian",
    "Vegan",
    "No Preference",
];

export const createFoodPreference = async (req: Request, res: Response) => {
    try {
        const parsed = createFoodPreferenceSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const existing = await FoodPreferenceModel.findOne({
            title: parsed.data.title,
            isDeleted: false,
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Food preference with this title already exists",
            });
        }

        const result = await FoodPreferenceModel.create(parsed.data);
        return res.status(201).json({
            success: true,
            message: "FoodPreference created successfully",
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

export const getFoodPreferences = async (req: Request, res: Response) => {
    try {
        const onlyActive = req.query.active === "true";
        const filter: Record<string, unknown> = { isDeleted: false };
        if (onlyActive) {
            filter.status = "Active";
            filter.enabled = true;
        }

        const total = await FoodPreferenceModel.countDocuments({ isDeleted: false });
        if (total === 0) {
            await FoodPreferenceModel.insertMany(
                DEFAULT_FOOD_PREFERENCES.map((title, index) => ({
                    title,
                    status: "Active",
                    enabled: true,
                    sortOrder: index + 1,
                }))
            );
        }

        const data = await FoodPreferenceModel.find(filter).sort({
            sortOrder: 1,
            title: 1,
        });

        return res.status(200).json({
            success: true,
            message: "Food preferences fetched successfully",
            data,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const getFoodPreferenceById = async (req: Request, res: Response) => {
    try {
        const result = await FoodPreferenceModel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "FoodPreference not found",
            });
        }
        return res.status(200).json({
            success: true,
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

export const updateFoodPreference = async (req: Request, res: Response) => {
    try {
        const parsed = updateFoodPreferenceSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        if (parsed.data.title) {
            const duplicate = await FoodPreferenceModel.findOne({
                _id: { $ne: req.params.id as string },
                title: parsed.data.title,
                isDeleted: false,
            });
            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Food preference with this title already exists",
                });
            }
        }

        const result = await FoodPreferenceModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            parsed.data,
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "FoodPreference not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "FoodPreference updated successfully",
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

export const deleteFoodPreference = async (req: Request, res: Response) => {
    try {
        const result = await FoodPreferenceModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "FoodPreference not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "FoodPreference deleted successfully",
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
