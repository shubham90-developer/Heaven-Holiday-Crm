import { Request, Response } from "express";
import { DepartmentModel } from "./department.model";
import {
    createDepartmentSchema,
    updateDepartmentSchema,
} from "./department.validation";

export const createDepartment = async (req: Request, res: Response) => {
    try {
        const parsed = createDepartmentSchema.parse(req.body);

        const department = await DepartmentModel.create(parsed);

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// GET ALL
export const getDepartments = async (_req: Request, res: Response) => {

    try {

        const departments = await DepartmentModel.find({ isActive: true });

        res.status(200).json({
            success: true,
            data: departments,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getDepartmentById = async (req: Request, res: Response) => {

    try {
        const department = await DepartmentModel.findById(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        res.status(200).json({
            success: true,
            data: department,
        });

    } catch (error: any) {

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateDepartment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const parsed = updateDepartmentSchema.parse(req.body);

        const department = await DepartmentModel.findByIdAndUpdate(
            id,
            parsed,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: department,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Soft delete
export const deleteDepartment = async (req: Request, res: Response) => {

    try {
        const department = await DepartmentModel.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Department deactivated successfully",
            data: department,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};