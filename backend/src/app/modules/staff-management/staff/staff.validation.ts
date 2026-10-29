import { z } from "zod";

export const createStaffSchema = z.object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(8, "Phone required"),

    role: z.string().min(1, "Role required"),
    department: z.string().min(1, "Department required"),

    reportingManager: z.string().optional(),

    isSelfSender: z.boolean().optional(),
    senderEmail: z.string().email().optional(),

    permissions: z.array(z.string()).optional(),

    address: z
        .object({
            country: z.string().optional(),
            city: z.string().optional(),
            postalCode: z.string().optional(),
            fullAddress: z.string().optional(),
        })
        .optional(),

    profileImage: z.string().optional(),

    signatureType: z.enum(["default", "custom"]).optional(),
    signature: z.string().optional(),

    isActive: z.boolean().optional(),
});

export const updateStaffSchema = createStaffSchema.partial();