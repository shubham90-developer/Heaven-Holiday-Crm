import { z } from "zod";

export const restaurantSchema = z.object({
  city: z.string().min(1, "City is required"),

  address: z.string().min(1, "Address is required"),

  restaurantArea: z.string().min(1, "Restaurant Area is required"),

  supplierName: z.string().min(1, "Supplier Name is required"),

  currency: z.enum(["INR", "USD"]),

  mealName: z.string().min(1, "Meal Name is required"),

  preferred: z.boolean().optional(),

  veg: z.boolean().optional(),

  nonVeg: z.boolean().optional(),

  ai: z.boolean().optional(),
});