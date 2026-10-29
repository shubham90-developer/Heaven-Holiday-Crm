import { z } from "zod";

export const createTransportSchema = z.object({
    carType: z.enum(["Luxury", "Standard"]),
    transportName: z.string().min(1, "Transport name is required"),
    seatingCapacity: z.number().min(1),
    ac: z.boolean(),
    vehicleNo: z.string().min(1),
    numberOfVehicles: z.number().min(1),
    image: z.string().optional(),
});

export const updateTransportSchema = createTransportSchema.partial();