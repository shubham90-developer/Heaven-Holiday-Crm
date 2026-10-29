import { Request, Response } from "express";
import { StaffModel } from "./staff.model";
import {
    createStaffSchema,
    updateStaffSchema,
} from "./staff.validation";

// CREATE
export const createStaff = async (req: Request, res: Response) => {
    try {
        const parsed = createStaffSchema.parse(req.body);

        const existing = await StaffModel.findOne({ email: parsed.email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const staff = await StaffModel.create(parsed);

        res.status(201).json({
            success: true,
            message: "Staff created successfully",
            data: staff,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.errors || error.message,
        });
    }
};

// GET ALL
export const getStaff = async (_req: Request, res: Response) => {

    try {

        const staff = await StaffModel.find({ isActive: true })
            .populate("role")
            .populate("department")

        res.status(200).json({
            success: true,
            data: staff,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.errors || error.message,
        });
    }
};

// GET SINGLE
export const getStaffById = async (req: Request, res: Response) => {

    try {

        const staff = await StaffModel.findById(req.params.id)
            .populate("role")
            .populate("department")
            .populate("reportingManager");

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found",
            });
        }

        res.status(200).json({
            success: true,
            data: staff,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.errors || error.message,
        });
    }
};

// UPDATE
export const updateStaff = async (req: Request, res: Response) => {
    try {
        const parsed = updateStaffSchema.parse(req.body);

        const staff = await StaffModel.findByIdAndUpdate(
            req.params.id,
            parsed,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Staff updated successfully",
            data: staff,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.errors || error.message,
        });
    }
};

// DELETE (Soft)
export const deleteStaff = async (req: Request, res: Response) => {

    try {
        const staff = await StaffModel.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Staff deactivated successfully",
            data: staff,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.errors || error.message,
        });
    }
};