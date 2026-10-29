import { z } from "zod";

// Create validation
export const createEmailTemplateValidationSchema = z.object({
    templateName: z
        .string()
        .min(1, "Template name is required")
        .max(100, "Template name cannot exceed 100 characters"),

    subject: z
        .string()
        .min(1, "Subject is required")
        .max(200, "Subject cannot exceed 200 characters"),

    message: z
        .string()
        .min(1, "Message body is required"),

    status: z
        .enum(["Active", "InActive"])
        .default("Active"),

    isDeleted: z
        .boolean()
        .default(false),
});

// Update validation — all fields optional
export const updateEmailTemplateValidationSchema = z.object({
    templateName: z
        .string()
        .min(1, "Template name is required")
        .max(100, "Template name cannot exceed 100 characters")
        .optional(),

    subject: z
        .string()
        .min(1, "Subject is required")
        .max(200, "Subject cannot exceed 200 characters")
        .optional(),

    message: z
        .string()
        .min(1, "Message body is required")
        .optional(),

    status: z
        .enum(["Active", "InActive"])
        .optional(),

    isDeleted: z
        .boolean()
        .optional(),
});

// Inferred types
export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateValidationSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateValidationSchema>;