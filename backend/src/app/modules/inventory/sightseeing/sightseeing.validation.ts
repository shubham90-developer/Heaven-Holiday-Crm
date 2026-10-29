import { z } from "zod";

export const sightseeingSchema = z.object({
    country: z.string().min(1),
    city: z.string().min(1),
    sightseeingName: z.string().min(1),

    latitude: z.string(),
    longitude: z.string(),

    image: z.string().optional(),

    address: z.string(),

    isUnique: z.boolean(),

    details: z.string(),

    category: z.string(),
    activities: z.string(),
    difficultyLevel: z.string(),
    season: z.string(),
    daysOfWeek: z.string(),
    popularity: z.string(),
    thingsToCarry: z.string(),
    pickupPoint: z.string(),
    pickupTime: z.string(),

    minPax: z.number(),
    maxPax: z.number(),

    durationDays: z.number(),
    durationMinutes: z.number(),

    minAge: z.number(),
    maxAge: z.number(),

    operatingTime: z.array(
        z.object({
            from: z.string(),
            to: z.string(),
        })
    ),

    otherInclusions: z.string(),
    advisory: z.string(),
    cancellationPolicy: z.string(),
    refundPolicy: z.string(),
    confirmationPolicy: z.string(),
    termsConditions: z.string(),
});