import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(2, "Department name required"),
  isOperations: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().optional(),
  isOperations: z.boolean().optional(),
  isActive: z.boolean().optional(),
});