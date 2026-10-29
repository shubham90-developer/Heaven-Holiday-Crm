import { z } from "zod";

export const createItinerarySchema = z.object({
  startCity: z
    .string()
    .min(1, "Start city is required")
    .trim(),

  destinationCity: z
    .string()
    .min(1, "Destination city is required")
    .trim(),

  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
});

export const updateItinerarySchema = z.object({
  startCity: z.string().optional(),
  destinationCity: z.string().optional(),
  title: z.string().max(100).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});