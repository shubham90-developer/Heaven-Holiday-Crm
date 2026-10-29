import { Request, Response } from "express";
import { ThemeModel } from "./theme.model";
import {
    createThemeSchema,
    updateThemeSchema,
} from "./theme.validation";

const DEFAULT_THEMES = [
    "Adventure",
    "Beach",
    "Honeymoon",
    "Family",
    "Luxury",
    "Wildlife",
    "Spiritual",
    "Hill Station",
    "Weekend Getaway",
    "Cultural",
];

export const createTheme = async (req: Request, res: Response) => {
    try {
        const parsed = createThemeSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const existing = await ThemeModel.findOne({
            title: parsed.data.title,
            isDeleted: false,
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Theme with this title already exists",
            });
        }

        const result = await ThemeModel.create(parsed.data);
        return res.status(201).json({
            success: true,
            message: "Theme created successfully",
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

export const getThemes = async (req: Request, res: Response) => {
    try {
        const onlyActive = req.query.active === "true";
        const filter: Record<string, unknown> = { isDeleted: false };
        if (onlyActive) {
            filter.status = "Active";
            filter.enabled = true;
        }

        const total = await ThemeModel.countDocuments({ isDeleted: false });
        if (total === 0) {
            await ThemeModel.insertMany(
                DEFAULT_THEMES.map((title, index) => ({
                    title,
                    status: "Active",
                    enabled: true,
                    sortOrder: index + 1,
                }))
            );
        }

        const data = await ThemeModel.find(filter).sort({
            sortOrder: 1,
            title: 1,
        });

        return res.status(200).json({
            success: true,
            message: "Themes fetched successfully",
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

export const getThemeById = async (req: Request, res: Response) => {
    try {
        const result = await ThemeModel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Theme not found",
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

export const updateTheme = async (req: Request, res: Response) => {
    try {
        const parsed = updateThemeSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        if (parsed.data.title) {
            const duplicate = await ThemeModel.findOne({
                _id: { $ne: req.params.id as string },
                title: parsed.data.title,
                isDeleted: false,
            });
            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Theme with this title already exists",
                });
            }
        }

        const result = await ThemeModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            parsed.data,
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Theme not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Theme updated successfully",
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

export const deleteTheme = async (req: Request, res: Response) => {
    try {
        const result = await ThemeModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Theme not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Theme deleted successfully",
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
