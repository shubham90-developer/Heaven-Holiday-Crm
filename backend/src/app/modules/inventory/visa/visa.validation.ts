import { z } from "zod";

export const createVisaSchema = z.object({
    travelerNationality: z.string().min(1, "Nationality is required"),
    countriesCovered: z.string().min(1, "Countries covered is required"),

    visaName: z.string().min(1, "Visa name is required"),
    visaType: z.enum(["e Visa", "Sticker Visa"]),
    visaCategory: z.enum(["Tourism", "Business"]),
    entryType: z.enum(["Single Entry", "Multiple Entry"]),

    processingTime: z.string().optional(),
    passportExpireDays: z.number().optional(),
    validityDays: z.number().optional(),
    duration: z.string().optional(),

    supplier: z.string().optional(),
    embassyFeeCurrency: z.string().optional(),

    adultFee: z.number().optional(),
    childFee: z.number().optional(),
    childAge: z.number().optional(),
    infantFee: z.number().optional(),

    markup: z.array(
        z.object({
            marketPlace: z.enum(["B2C", "B2B"]),
            currency: z.string(),
            markUpType: z.enum(["Amount", "Percentage"]),
            adult: z.number(),
            child: z.number(),
            infant: z.number(),
        })
    ).optional(),

    serviceProviders: z.array(
        z.object({
            display: z.boolean(),
            serviceName: z.string(),
            currency: z.string(),
            fees: z.number(),
            markup: z.number(),
            taxable: z.boolean(),
        })
    ).optional(),
});

export const updateVisaSchema = createVisaSchema.partial();