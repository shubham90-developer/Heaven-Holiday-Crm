import { z } from "zod";

export const createTransportSchema = z.object({
    category: z.string(),
    transportType: z.string().optional(),
    startCity: z.string().optional(),
    destinationCity: z.string().optional(),
    routeName: z.string().optional(),

    description: z.string(),

    pickupPointArea: z.string().optional(),
    dropPointArea: z.string().optional(),

    regionType: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),

    vehicleCostType: z.string(),

    currency: z.string(),

    website: z.boolean(),

    seasons: z.array(
        z.object({
            from: z.string(),
            to: z.string(),
            markUpType: z.string(),
            b2c: z.number(),
            b2b: z.number(),
        })
    ),
});

export const updateTransportSchema =
    createTransportSchema.partial();