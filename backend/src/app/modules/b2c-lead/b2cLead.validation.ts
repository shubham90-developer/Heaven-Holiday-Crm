import { z } from "zod";

// ── reusable schemas ─────────────────────────────────────

export const staffSnapshotSchema = z.object({
  _id: z.string(),
  name: z.string().min(1),
});

export const addressSchema = z.object({
  country: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  pincode: z.string().nullable().optional(),
  addressLine: z.string().nullable().optional(),
});

export const personalInfoSchema = z.object({
  maritalStatus: z
    .enum(["Married", "Unmarried", "Divorced"])
    .nullable()
    .optional(),

  kids: z
    .object({
      count: z.number().min(0).optional(),
      details: z
        .array(
          z.object({
            name: z.string().optional(),
            age: z.number().optional(),
          })
        )
        .optional(),
    })
    .optional(),

  passport: z
    .object({
      hasPassport: z.boolean().optional(),
      passportNumber: z.string().nullable().optional(),
      expiryDate: z.coerce.date().nullable().optional(),
    })
    .optional(),

  companyName: z.string().nullable().optional(),
  gstNumber: z.string().nullable().optional(),
  panCard: z.string().nullable().optional(),
});

export const preferencesSchema = z.object({
  hotelStars: z.array(z.number()).optional(),

  food: z
    .enum(["Veg", "Non-Veg", "Jain", "Eggetarian"])
    .nullable()
    .optional(),

  seatPreference: z
    .enum(["Window", "Aisle", "Middle"])
    .nullable()
    .optional(),

  themes: z.array(z.string()).optional(),
  preferredAirlines: z.array(z.string()).optional(),

  visa: z
    .object({
      country: z.string().nullable().optional(),
      expiryDate: z.coerce.date().nullable().optional(),
      hasVisa: z.boolean().optional(),
    })
    .optional(),

  category: z
    .enum(["VIP", "Regular", "Corporate", "Premium"])
    .optional(),
});

// export const paymentSummarySchema = z.object({
//   totalBilled: z.number().optional(),
//   totalPaid:   z.number().optional(),
//   pending:     z.number().optional(),
// });

// ── main create schema ────────────────────────────────────

export const createB2CLeadSchema = z.object({
  leadModel: z.string().default("B2CLead"),

  // core identity
  salutation: z
    .enum(["Mr.", "Ms.", "Mrs.", "Miss", "Dr.", "Prof."])
    .optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),

  email: z
    .string()
    .email("Invalid email address")
    .optional(),
  alternateEmail: z
    .string()
    .email("Invalid alternate email address")
    .nullable()
    .optional(),

  mobile: z
    .string()
    .min(1, "Mobile number is required"),
  alternateMobile: z
    .string()
    .nullable()
    .optional(),

  // personal dates
  dob: z.coerce.date().nullable().optional(),
  anniversary: z.coerce.date().nullable().optional(),
  activeSince: z.coerce.date().optional(),

  // nested objects
  address: addressSchema.optional(),
  personalInfo: personalInfoSchema.optional(),
  preferences: preferencesSchema.optional(),

  // pipeline
  leadSource: z.string().optional(),

  leadStage: z
    .enum([
      "New",
      "Follow Up",
      "Call Back",
      "Wrong Number",
      "Cannot Be Contacted",
      "Not Interested",
      "Junk Lead",
      "Lost Lead",
      "Duplicate",
      "Destination Closed",
      "Unanswered",
      "Not Reachable",
      "Contacted",
    ])
    .optional(),

  leadStatus: z
    .enum(["In Process", "Un-Assigned", "Archived", "Callback"])
    .optional(),

  // assignment
  assignedOwner: staffSnapshotSchema.nullable().optional(),

  // tags
  tags: z.array(z.string()).optional(),
  remarks: z.string().nullable().optional(),

  // payments
  // paymentSummary: paymentSummarySchema.optional(),

  // system
  isDeleted: z.boolean().optional(),
});

// ── update schema (all fields partial) ───────────────────

export const updateB2CLeadSchema = createB2CLeadSchema
  .omit({ leadModel: true })   // never allow updating the model discriminator
  .partial();

// ── inferred types ────────────────────────────────────────

export type CreateB2CLeadInput = z.infer<typeof createB2CLeadSchema>;
export type UpdateB2CLeadInput = z.infer<typeof updateB2CLeadSchema>;