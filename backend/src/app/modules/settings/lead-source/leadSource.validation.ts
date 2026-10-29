import { z } from "zod";

export const createLeadSourceSchema = z.object({
    title: z.string().trim().min(2, "Lead source name must be at least 2 characters").max(100),
    isDefaultAssignLead: z.boolean().optional().default(false),
    enabled: z.boolean().optional().default(true),
    status: z.enum(["Active", "Inactive"]).optional().default("Active"),
    isDeleted: z.boolean().optional().default(false)
});

export const updateLeadSourceSchema = createLeadSourceSchema.partial();

export type CreateLeadSourceDTO = z.infer<typeof createLeadSourceSchema>;
export type UpdateLeadSourceDTO = z.infer<typeof updateLeadSourceSchema>;