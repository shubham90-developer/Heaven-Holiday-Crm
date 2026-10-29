import { z } from "zod";

export const createBankDetailValidation = z.object({
  accountHolderName: z.string().min(1),
  accountNumber: z.string().min(1),
  ifscCode: z.string().min(1),

  accountType: z.enum([
    "Saving",
    "Current"
  ]),

  bankName: z.string().min(1),
  branch: z.string().min(1),

  country: z.string().min(1),
  city: z.string().min(1)
});

export const updateBankDetailValidation =
  createBankDetailValidation.partial();