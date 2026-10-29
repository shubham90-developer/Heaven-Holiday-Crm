import { Request, Response } from "express";
import { RoleModel } from "./roles.model";
import { createRoleSchema, updateRoleSchema } from "./roles.validation";

export const createRole = async (req: Request, res: Response) => {
    try {

        const parsed = createRoleSchema.parse(req.body);
        const role = await RoleModel.create(parsed);

        res.status(200).json({
            success: true,
            message: "Role created successfully",
            data: role
        })

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const getAllRoles = async (req: Request, res: Response) => {
    try {

        const role = await RoleModel.find({ isActive: true });

        res.status(200).json({
            success: true,
            message: "Role Data fetched successfully",
            data: role
        })

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
}

export const getRoleById = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const role = await RoleModel.findById(id);

        res.status(200).json({
            success: true,
            message: "Role Data fetched successfully",
            data: role
        })

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const parsed = updateRoleSchema.parse(req.body);

        const role = await RoleModel.findByIdAndUpdate(
            id,
            parsed,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: role,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteRole = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const role = await RoleModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Role deactivated successfully",
            data: role,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};