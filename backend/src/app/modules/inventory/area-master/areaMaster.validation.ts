import { z } from "zod";

export const createAreaSchema = z.object({
  body: z.object({
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    status: z.enum(["Active", "Inactive"]).optional(),
  }),
});

export const updateAreaSchema = z.object({
  body: z.object({
    city: z.string().optional(),
    area: z.string().optional(),
    status: z.enum(["Active", "Inactive"]).optional(),
  }),
});