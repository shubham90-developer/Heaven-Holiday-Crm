import { z } from "zod";

export const createProposalImageSchema = z.object({
    category: z.enum(["destination", "sightseeing"]),
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
    city: z.string().trim().max(120).optional().default(""),
    status: z.enum(["Active", "Inactive"]).optional().default("Active"),
    enabled: z.union([z.boolean(), z.string()]).optional().default(true),
});

export const updateProposalImageSchema = createProposalImageSchema.partial();
