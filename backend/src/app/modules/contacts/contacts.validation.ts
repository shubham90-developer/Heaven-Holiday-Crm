import { z } from "zod";

export const createContactSchema = z.object({
    body: z.object({
        leadId: z.string(),

        leadModel: z.enum(["B2CLead", "B2BLead"]),

        relation: z.string().min(1),

        crmLeadSource: z.string().optional(),

        salutation: z
            .enum(["Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof."])
            .optional(),

        firstName: z.string().min(1),

        lastName: z.string().optional(),

        email: z.string().email().optional(),

        alternateEmail: z.string().email().optional(),

        mobileNumber: z.string().min(5),

        alternateMobile: z.string().optional(),

        country: z.string().min(1),

        state: z.string().optional(),

        city: z.string().min(1),

        pinZipCode: z.string().optional(),

        visaCountry: z
            .array(
                z.object({
                    country: z.string(),

                    date: z.string().optional(),
                })
            )
            .optional(),
    }),
});

export const updateContactSchema = z.object({
    body: z.object({
        relation: z.string().optional(),

        crmLeadSource: z.string().optional(),

        salutation: z
            .enum(["Mr.", "Mrs.", "Ms.", "Miss", "Dr.", "Prof."])
            .optional(),

        firstName: z.string().optional(),

        lastName: z.string().optional(),

        email: z.string().email().optional(),

        alternateEmail: z.string().email().optional(),

        mobileNumber: z.string().optional(),

        alternateMobile: z.string().optional(),

        country: z.string().optional(),

        state: z.string().optional(),

        city: z.string().optional(),

        pinZipCode: z.string().optional(),

        visaCountry: z.array(z.string()).optional(),
    }),
});

export type CreateContactInput = z.infer<
    typeof createContactSchema
>;

export type UpdateContactInput = z.infer<
    typeof updateContactSchema
>;