import { Request, Response } from "express";
import { DriverModel } from "./driver.model";
import { TransportModel } from "../transport/transport.model";
import {
    createDriverSchema,
    updateDriverSchema,
} from "./driver.validation";

// CREATE DRIVER
export const createDriver = async (req: Request, res: Response) => {
    try {
        const parsed = createDriverSchema.safeParse(req.body);

        // Validation fail
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        // 1. Check if vehicle exists (recommended)
        if (parsed.data.primaryVehicle) {
            const vehicleExists = await TransportModel.findById(
                parsed.data.primaryVehicle
            );

            if (!vehicleExists) {
                return res.status(400).json({
                    message: "Invalid vehicle selected",
                });
            }
        }

        // 2. CHECK DUPLICATE ASSIGNMENT (PUT IT HERE)
        if (parsed.data.primaryVehicle) {
            const alreadyAssigned = await DriverModel.findOne({
                primaryVehicle: parsed.data.primaryVehicle,
            });

            if (alreadyAssigned) {
                return res.status(400).json({
                    message: "Vehicle already assigned to another driver",
                });
            }
        }

        //3. CREATE DRIVER (ONLY AFTER ALL CHECKS PASS)
        const driver = await DriverModel.create(parsed.data);

        return res.status(201).json({
            message: "Driver created successfully",
            data: driver,
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// GET ALL
export const getDrivers = async (req: Request, res: Response) => {
    try {
        const {
            driverName,
            mobileNumber,
            email,
            country,
            city,
        } = req.query;

        let filter: any = {};

        // Apply filters ONLY if present
        if (driverName) {
            filter.driverName = { $regex: driverName, $options: "i" };
        }

        if (mobileNumber) {
            filter.mobileNumber = mobileNumber;
        }

        if (email) {
            filter.email = { $regex: email, $options: "i" };
        }

        if (country) {
            filter.country = country;
        }

        if (city) {
            filter.city = city;
        }

        const drivers = await DriverModel.find(filter)
            .populate("primaryVehicle", "transportName carType vehicleNo")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: drivers.length,
            data: drivers,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET BY ID
export const getDriverById = async (req: Request, res: Response) => {
    try {
        const driver = await DriverModel.findById(req.params.id).populate("primaryVehicle", "transportName carType vehicleNo");;

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        return res.json(driver);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// UPDATE
export const updateDriver = async (req: Request, res: Response) => {
    try {
        const parsed = updateDriverSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const driver = await DriverModel.findByIdAndUpdate(
            req.params.id,
            parsed.data,
            { new: true }
        );

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        return res.json(driver);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// DELETE
export const deleteDriver = async (req: Request, res: Response) => {
    try {
        const driver = await DriverModel.findByIdAndDelete(req.params.id);

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        return res.json({ message: "Deleted successfully" });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};