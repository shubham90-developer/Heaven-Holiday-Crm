import { z } from "zod";

export const createRoleSchema = z.object({
    name: z.string().min(2, "Role name required"),
    roleType: z.enum(["ADMIN", "SALES", "MANAGER", "BACK_OFFICE"]),
    description: z.string().optional(),
});

export const updateRoleSchema = z.object({
    name: z.string().min(2).optional(),
    roleType: z.enum(["ADMIN", "SALES", "MANAGER", "BACK_OFFICE"]).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
});