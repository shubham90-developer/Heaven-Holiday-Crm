import { z } from "zod";

export const createGuideSchema = z.object({
  guideName: z.string().min(1, "Guide name is required"),
  destination: z.string().min(1, "Destination is required"),
  mobileNumber: z.string().min(10, "Mobile number is required"),
  email: z.string().email().optional(),
  languages: z.string().min(1, "Languages are required"),
  description: z.string().optional(),

  rates: z.object({
    currency: z.string().min(1, "Currency is required"),
    perDayRate: z.number(),
    overnightCharges: z.number(),
    markupType: z.enum(["Percentage", "Flat"]),
    markup: z.number(),
    taxes: z.number(),
    total: z.number(),
  }),
});

export const updateGuideSchema = createGuideSchema.partial();