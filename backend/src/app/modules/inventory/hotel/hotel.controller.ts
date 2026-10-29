import { Request, Response } from "express";
import { Hotel } from "./hotel.model";
import {
    createHotelValidation,
    updateHotelValidation,
} from "./hotel.validation";

// CREATE
export const createHotel = async (req: Request, res: Response) => {
    try {
        const validatedData = createHotelValidation.parse({
            body: req.body,
        });

        const hotel = await Hotel.create(validatedData.body);

        res.status(201).json({
            success: true,
            message: "Hotel created successfully",
            data: hotel,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Validation or creation failed",
            error: error.errors || error.message,
        });
    }
};

// GET ALL
export const getAllHotels = async (_req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            results: hotels.length,
            data: hotels,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch hotels",
            error: error.message,
        });
    }
};

// GET SINGLE
export const getHotelById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }

        res.status(200).json({
            success: true,
            data: hotel,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch hotel",
            error: error.message,
        });
    }
};

// UPDATE
export const updateHotel = async (req: Request, res: Response) => {
    try {
        const validatedData = updateHotelValidation.parse({
            body: req.body,
        });

        const { id } = req.params;

        const updatedHotel = await Hotel.findByIdAndUpdate(
            id,
            validatedData.body,
            { new: true, runValidators: true }
        );

        if (!updatedHotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            data: updatedHotel,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Validation or update failed",
            error: error.errors || error.message,
        });
    }
};

// DELETE
export const deleteHotel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await Hotel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Hotel deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete hotel",
            error: error.message,
        });
    }
};