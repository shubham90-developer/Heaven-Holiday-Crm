import { Request, Response } from "express";
import { AreaModel } from "./areaMaster.model";
import { createAreaSchema, updateAreaSchema } from "./areaMaster.validation";

// CREATE
export const createArea = async (req: Request, res: Response) => {
    try {
        // ZOD validation INSIDE controller
        const parsedData = createAreaSchema.parse({
            body: req.body,
        });

        const { city, area, status } = parsedData.body;

        const newArea = await AreaModel.create({
            city,
            area,
            status,
        });

        return res.status(201).json({
            success: true,
            message: "Area created successfully",
            data: newArea,
        });
    } catch (error: any) {
        // Zod error handling
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET ALL
export const getAllAreas = async (req: Request, res: Response) => {
    try {
        const { city, area } = req.query;

        const filters: any = {};

        // Filter by city
        if (city) {
            filters.city = {
                $regex: city,
                $options: "i",
            };
        }

        // Filter by area
        if (area) {
            filters.area = {
                $regex: area,
                $options: "i",
            };
        }

        const areas = await AreaModel.find(filters).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: areas.length,
            data: areas,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET BY ID
export const getAreaById = async (req: Request, res: Response) => {
    try {
        const area = await AreaModel.findById(req.params.id);

        if (!area) {
            return res.status(404).json({
                success: false,
                message: "Area not found",
            });
        }

        return res.json({
            success: true,
            data: area,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// UPDATE
export const updateArea = async (req: Request, res: Response) => {
    try {
        // ZOD validation INSIDE controller
        const parsedData = updateAreaSchema.parse({
            body: req.body,
        });

        const updatedArea = await AreaModel.findByIdAndUpdate(
            req.params.id,
            parsedData.body,
            { new: true }
        );

        if (!updatedArea) {
            return res.status(404).json({
                success: false,
                message: "Area not found",
            });
        }

        return res.json({
            success: true,
            message: "Area updated successfully",
            data: updatedArea,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE
export const deleteArea = async (req: Request, res: Response) => {
    try {
        const deleted = await AreaModel.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Area not found",
            });
        }

        return res.json({
            success: true,
            message: "Area deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};