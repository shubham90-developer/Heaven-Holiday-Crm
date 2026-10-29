import { Request, Response } from "express";
import Itinerary from "./itineraryDescription.model";

import {
    createItinerarySchema,
    updateItinerarySchema,
} from "./itineraryDescription.validation";

// CREATE
export const createItinerary = async (req: Request, res: Response) => {
    try {
        const validatedData = createItinerarySchema.parse(req.body);

        const itinerary = await Itinerary.create(validatedData);

        return res.status(201).json({
            success: true,
            message: "Itinerary created successfully",
            data: itinerary,
        });

    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message:
                error?.issues?.[0]?.message ||
                error?.errors?.[0]?.message ||
                error.message ||
                "Validation failed",
        });
    }
};

// GET ALL
export const getItineraries = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            startCity,
            destinationCity,
        } = req.query;

        const filters: any = {};

        // Start City filter
        if (startCity) {
            filters.startCity = {
                $regex: startCity,
                $options: "i",
            };
        }

        // Destination City filter
        if (destinationCity) {
            filters.destinationCity = {
                $regex: destinationCity,
                $options: "i",
            };
        }

        const itineraries = await Itinerary.find(filters).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: itineraries.length,
            data: itineraries,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET BY ID
export const getItineraryById = async (req: Request, res: Response) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found",
            });
        }

        return res.json({
            success: true,
            data: itinerary,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// UPDATE
export const updateItinerary = async (req: Request, res: Response) => {
    try {
        const validatedData = updateItinerarySchema.parse(req.body);

        const updated = await Itinerary.findByIdAndUpdate(
            req.params.id,
            validatedData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found",
            });
        }

        return res.json({
            success: true,
            message: "Updated successfully",
            data: updated,
        });

    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.errors?.[0]?.message || error.message,
        });
    }
};


// DELETE
export const deleteItinerary = async (req: Request, res: Response) => {
    try {
        const deleted = await Itinerary.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found",
            });
        }

        return res.json({
            success: true,
            message: "Deleted successfully",
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};