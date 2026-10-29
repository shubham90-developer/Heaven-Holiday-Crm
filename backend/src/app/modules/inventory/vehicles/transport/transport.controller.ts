import { Request, Response } from "express";
import { TransportModel } from "./transport.model";
import {
    createTransportSchema,
    updateTransportSchema,
} from "./transport.validation";

export const createTransport = async (req: Request, res: Response) => {
    try {
        const {
            carType,
            transportName,
            seatingCapacity,
            ac,
            vehicleNo,
            numberOfVehicles,
        } = req.body;

        if (
            !carType ||
            !transportName ||
            seatingCapacity === undefined ||
            seatingCapacity === null ||
            ac === undefined ||
            ac === null ||
            !vehicleNo ||
            numberOfVehicles === undefined ||
            numberOfVehicles === null
        ) {
            return res.status(400).json({
                message: "All fields except are required",
            });
        }

        const parsedData = createTransportSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsedData.error.flatten().fieldErrors,
            });
        }

        const transport = await TransportModel.create(parsedData.data);

        return res.status(201).json({
            message: "Transport created successfully",
            data: transport,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// GET ALL TRANSPORTS
export const getTransports = async (req: Request, res: Response) => {
    try {
        const { transportName, carType } = req.query;

        let filter: any = {};

        // Vehicle Name (partial search)
        if (transportName?.toString().trim()) {
            filter.transportName = {
                $regex: transportName,
                $options: "i",
            };
        }

        // 🔍 Car Type (exact match)
        if (carType?.toString().trim()) {
            filter.carType = carType;
        }

        const transports = await TransportModel.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: transports.length,
            data: transports,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET SINGLE TRANSPORT
export const getTransportById = async (req: Request, res: Response) => {
    try {
        const transport = await TransportModel.findById(req.params.id);

        if (!transport) {
            return res.status(404).json({
                message: "Transport not found",
            });
        }

        return res.status(200).json({
            message: "Fetched successfully",
            data: transport,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// UPDATE TRANSPORT
export const updateTransport = async (req: Request, res: Response) => {
    try {
        const parsedData = updateTransportSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsedData.error.flatten(),
            });
        }

        const updatedTransport = await TransportModel.findByIdAndUpdate(
            req.params.id,
            parsedData.data,
            { new: true }
        );

        if (!updatedTransport) {
            return res.status(404).json({
                message: "Transport not found",
            });
        }

        return res.status(200).json({
            message: "Updated successfully",
            data: updatedTransport,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// DELETE TRANSPORT
export const deleteTransport = async (req: Request, res: Response) => {
    try {
        const deleted = await TransportModel.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Transport not found",
            });
        }

        return res.status(200).json({
            message: "Deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message,
        });
    }
};