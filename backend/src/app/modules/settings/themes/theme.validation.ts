import { z } from "zod";

export const createThemeSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Theme name must be at least 2 characters")
        .max(120),
    status: z.enum(["Active", "Inactive"]).optional().default("Active"),
    enabled: z.boolean().optional().default(true),
    sortOrder: z.number().optional().default(0),
});

export const updateThemeSchema = createThemeSchema.partial();
