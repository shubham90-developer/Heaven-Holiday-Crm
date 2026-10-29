import { Request, Response } from "express";
import TransportRoute from "./transportRoute.model";
import { createTransportSchema, updateTransportSchema } from "./transportRoute.validation";

export const createTransportRoute = async (
    req: Request,
    res: Response
) => {
    try {
        const validatedData = createTransportSchema.parse(req.body);

        const {
            category,
            startCity,
            destinationCity,
            routeName,
            description,
            regionType,
            state,
            country,
            seasons,
        } = validatedData;

        // Common validation
        if (!description?.trim()) {
            res.status(400).json({ message: "Description is required" });
            return;
        }

        // Point to Point validation
        if (category === "Point to Point Transfers") {
            if (!startCity?.trim()) {
                res.status(400).json({ message: "Start city is required" });
                return;
            }

            if (!destinationCity?.trim()) {
                res.status(400).json({ message: "Destination city is required" });
                return;

            }

            if (!routeName?.trim()) {
                res.status(400).json({ message: "Route name is required" });
                return;
            }
        }

        // Per Day Cost validation
        if (category === "Per Day Cost") {
            if (!regionType) {
                res.status(400).json({ message: "Region type is required" });
                return;
            }

            if (
                regionType === "State" &&
                !state?.trim()
            ) {
                res.status(400).json({ message: "State is required" });
                return;
            }

            if (
                regionType === "Country" &&
                !country?.trim()
            ) {
                res.status(400).json({ message: "Country is required" });
                return;
            }
        }

        // Season validation
        if (!seasons || seasons.length === 0) {
            res.status(400).json({ message: "At least one season is required" });
            return;
        }

        const data = await TransportRoute.create(validatedData);

        res.status(201).json({
            success: true,
            message: "Transport route created",
            data,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.errors || error.message,
        });
    }
};

export const getTransportRoutes = async (
    req: Request,
    res: Response
) => {
    try {
        const data = await TransportRoute.find();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getTransportRouteById = async (
    req: Request,
    res: Response
) => {
    try {
        const data = await TransportRoute.findById(req.params.id);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateTransportRoute = async (
    req: Request,
    res: Response
) => {
    try {
        const validatedData = updateTransportSchema.parse(req.body);

        const data = await TransportRoute.findByIdAndUpdate(
            req.params.id,
            validatedData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Updated successfully",
            data,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.errors || error.message,
        });
    }
};

export const deleteTransportRoute = async (
    req: Request,
    res: Response
) => {
    try {
        await TransportRoute.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};