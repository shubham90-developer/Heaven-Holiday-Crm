import { z } from "zod";

export const createHotelValidation = z.object({
    body: z.object({
        hotelName: z.string().min(1),
        cityName: z.string().min(1),
        contactEmail: z.string().email().optional(),
        countryCode: z.string().default("+91"),
        contactNo: z.string().min(8),

        starRating: z.number().min(1).max(5).optional(),
        propertyType: z.string(),

        checkInTime: z.string(),
        checkOutTime: z.string(),

        weekend: z.object({
            saturday: z.boolean(),
            sunday: z.boolean(),
        }),

        roomType: z.string().optional(),
        childAge: z.number().optional(),
    }),
});

export const updateHotelValidation = z.object({
    body: createHotelValidation.shape.body.partial(),
});