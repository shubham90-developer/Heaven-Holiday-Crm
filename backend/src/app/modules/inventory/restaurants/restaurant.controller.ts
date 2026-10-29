import { Request, Response } from "express";
import Restaurant from "./restaurant.model";
import { restaurantSchema } from "./restaurant.validation";

export const createRestaurant = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Zod validation inside controller
        const validatedData = restaurantSchema.parse(req.body);

        const restaurant = await Restaurant.create(validatedData);

        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            data: restaurant,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.errors || error.message,
        });
    }
};

export const getRestaurants = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const restaurants = await Restaurant.find();

        res.status(200).json({
            success: true,
            data: restaurants,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getRestaurantById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: restaurant,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateRestaurant = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        const { id } = req.params;
        const validatedData = restaurantSchema.parse(req.body);

        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            validatedData,
            { new: true }
        );

        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Restaurant updated successfully",
            data: restaurant,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.errors || error.message,
        });
    }
};

export const deleteRestaurant = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        const { id } = req.params;
        const restaurant = await Restaurant.findByIdAndDelete(id);

        if (!restaurant) {
            res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};