import { z } from "zod";

export const createDriverSchema = z.object({
    driverName: z
        .string()
        .min(1, "Driver name is required")
        .refine((val) => val.trim() !== "", {
            message: "Driver name cannot be empty",
        }),

    mobileNumber: z
        .string()
        .min(10, "Mobile number is required")
        .refine((val) => val.trim() !== "", {
            message: "Mobile number cannot be empty",
        }),

    email: z.string().email("Invalid email").optional().or(z.literal("")),

    languages: z
        .string()
        .min(1, "Languages are required")
        .refine((val) => val.trim() !== "", {
            message: "Languages cannot be empty",
        }),

    address: z.string().optional().or(z.literal("")),

    country: z
        .string()
        .min(1, "Country is required")
        .refine((val) => val.trim() !== "", {
            message: "Country cannot be empty",
        }),

    city: z
        .string()
        .min(1, "City is required")
        .refine((val) => val.trim() !== "", {
            message: "City cannot be empty",
        }),

    drivingLicense: z.string().optional().or(z.literal("")),

    primaryVehicle: z.string().optional().or(z.literal("")),

    remark: z.string().optional().or(z.literal("")),
});

export const updateDriverSchema = createDriverSchema.partial();