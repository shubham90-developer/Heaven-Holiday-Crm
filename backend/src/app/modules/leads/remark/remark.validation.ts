import { z } from "zod";

export const REMARK_TYPES = [
    "Customer",
    "Follow Up",
    "Interested",
    "Not Interested",
    "Callback",
    "Meeting",
    "Closed",
] as const;

export const createLeadRemarkValidation = z.object({

    leadId: z
        .string()
        .min(1, "leadId is required"),

    remarkType: z
        .enum(REMARK_TYPES)
        .default("Customer"),

    remark: z
        .string()
        .min(1, "Remark cannot be empty")
        .max(1000, "Remark cannot exceed 1000 characters")
        .trim(),
});

export const updateLeadRemarkValidation = z.object({

    remarkType: z
        .enum(REMARK_TYPES)
        .optional(),

    remark: z
        .string()
        .min(1, "Remark cannot be empty")
        .max(1000, "Remark cannot exceed 1000 characters")
        .trim()
        .optional(),
});

export type CreateLeadRemarkInput = z.infer<typeof createLeadRemarkValidation>;
export type UpdateLeadRemarkInput = z.infer<typeof updateLeadRemarkValidation>;