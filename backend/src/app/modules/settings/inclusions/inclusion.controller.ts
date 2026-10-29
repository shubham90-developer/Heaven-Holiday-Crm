import { Request, Response } from "express";
import { InclusionModel } from "./inclusion.model";
import {
    createInclusionSchema,
    updateInclusionSchema,
} from "./inclusion.validation";

const DEFAULT_INCLUSIONS = [
    "Flight",
    "Hotel",
    "Breakfast",
    "Breakfast & Lunch",
    "Breakfast & Dinner",
    "All Meals",
    "Gala Dinner",
    "Welcome Drink",
    "Airport Transfers",
    "Train Station Transfers",
    "Intercity Transfers",
    "All Transfers",
    "Cab",
    "Self Driven Car/Jeep",
    "Guided Tours",
    "Activity",
    "Yacht",
    "Inner Line Permit",
    "Sightseeing",
    "Transfer",
];

export const createInclusion = async (req: Request, res: Response) => {
    try {
        const parsed = createInclusionSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const existing = await InclusionModel.findOne({
            title: parsed.data.title,
            isDeleted: false,
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Inclusion with this title already exists",
            });
        }

        const result = await InclusionModel.create(parsed.data);
        return res.status(201).json({
            success: true,
            message: "Inclusion created successfully",
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

export const getInclusions = async (req: Request, res: Response) => {
    try {
        const onlyActive = req.query.active === "true";
        const filter: Record<string, unknown> = { isDeleted: false };
        if (onlyActive) {
            filter.status = "Active";
            filter.enabled = true;
        }

        const total = await InclusionModel.countDocuments({ isDeleted: false });
        if (total === 0) {
            await InclusionModel.insertMany(
                DEFAULT_INCLUSIONS.map((title, index) => ({
                    title,
                    status: "Active",
                    enabled: true,
                    sortOrder: index + 1,
                }))
            );
        }

        const data = await InclusionModel.find(filter).sort({
            sortOrder: 1,
            title: 1,
        });

        return res.status(200).json({
            success: true,
            message: "Inclusions fetched successfully",
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

export const getInclusionById = async (req: Request, res: Response) => {
    try {
        const result = await InclusionModel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Inclusion not found",
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

export const updateInclusion = async (req: Request, res: Response) => {
    try {
        const parsed = updateInclusionSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        if (parsed.data.title) {
            const duplicate = await InclusionModel.findOne({
                _id: { $ne: req.params.id as string },
                title: parsed.data.title,
                isDeleted: false,
            });
            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Inclusion with this title already exists",
                });
            }
        }

        const result = await InclusionModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            parsed.data,
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Inclusion not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inclusion updated successfully",
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

export const deleteInclusion = async (req: Request, res: Response) => {
    try {
        const result = await InclusionModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Inclusion not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inclusion deleted successfully",
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
