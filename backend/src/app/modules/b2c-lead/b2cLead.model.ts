"use client";
import mongoose, { Document, Schema } from "mongoose";
import { IB2CLead } from "./b2cLead.interface";

export interface IB2CLeadDocument extends IB2CLead, Document { }

// ── sub-schemas ──────────────────────────────────────────

const StaffSnapshotSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const PersonalInfoSchema = new Schema(
  {
    maritalStatus: {
      type: String,
      enum: ["Married", "Unmarried", "Divorced"],
      default: null,
    },
    kids: {
      count: { type: Number, default: 0, min: 0 },
      details: [
        {
          name: { type: String },
          age: { type: Number },
          _id: false,
        },
      ],
    },
    passport: {
      hasPassport: { type: Boolean, default: false },
      passportNumber: { type: String, default: null },
      expiryDate: { type: Date, default: null },
    },
    companyName: { type: String, default: null },
    gstNumber: { type: String, default: null },
    panCard: { type: String, default: null },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: String, default: null },
    addressLine: { type: String, default: null },
  },
  { _id: false }
);

// ── main schema ──────────────────────────────────────────

const B2CLeadSchema: Schema = new Schema<IB2CLeadDocument>(
  {
    leadModel: {
      type: String,
      default: "B2CLead",
      immutable: true,
    },

    // ── core identity ────────────────────────────────────
    salutation: {
      type: String,
      enum: ["Mr.", "Ms.", "Mrs.", "Miss", "Dr.", "Prof."],
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: { type: String, trim: true },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    alternateEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      unique: true,
    },
    alternateMobile: {
      type: String,
      trim: true,
      default: null,
    },

    // ── personal dates ───────────────────────────────────
    dob: { type: Date, default: null },
    anniversary: { type: Date, default: null },
    activeSince: { type: Date, default: Date.now },

    // ── address ──────────────────────────────────────────
    address: {
      type: AddressSchema,
      default: () => ({}),
    },

    // ── personal info ────────────────────────────────────
    personalInfo: {
      type: PersonalInfoSchema,
      default: () => ({}),
    },

    // ── preferences ──────────────────────────────────────
    preferences: {
      hotelStars: { type: [Number], default: [] },

      food: {
        type: String,
        enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "Eggetarian"],
        default: null,
      },

      seatPreference: {
        type: String,
        enum: ["Window", "Aisle", "Middle"],
        default: null,
      },

      themes: { type: [String], default: [] },
      preferredAirlines: { type: [String], default: [] },

      visa: {
        country: { type: String, default: null },
        expiryDate: { type: Date, default: null },
        hasVisa: { type: Boolean, default: false },
      },

      category: {
        type: String,
        enum: ["VIP", "Regular", "Corporate", "Premium"],
        default: "Regular",
      },
    },

    // ── pipeline ─────────────────────────────────────────
    leadSource: { type: String, default: null },
    leadStage: {
      type: String,
      enum: [
        "New", "Follow Up", "Call Back", "Wrong Number",
        "Cannot Be Contacted", "Not Interested", "Junk Lead",
        "Lost Lead", "Duplicate", "Destination Closed",
        "Unanswered", "Not Reachable", "Contacted",
      ],
      default: "New",
    },
    leadStatus: {
      type: String,
      enum: ["In Process", "Un-Assigned", "Archived", "Callback"],
      default: "Un-Assigned",
    },

    // ── assignment ───────────────────────────────────────
    assignedOwner: {
      type: StaffSnapshotSchema,
      default: null,
    },

    // ── tags ─────────────────────────────────────────────
    tags: { type: [String], default: [] },
    remarks: { type: String, default: null },

    // ── payments (summary only — detail in separate collection) ──
    // paymentSummary: {
    //   totalBilled: { type: Number, default: 0 },
    //   totalPaid: { type: Number, default: 0 },
    //   pending: { type: Number, default: 0 },
    // },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ── indexes ──────────────────────────────────────────────

// mobile unique + email sparse indexes come from field definitions above
B2CLeadSchema.index({ leadStage: 1 });
B2CLeadSchema.index({ leadStatus: 1 });
B2CLeadSchema.index({ "assignedOwner._id": 1 });
B2CLeadSchema.index({ activeSince: -1 });
B2CLeadSchema.index({ isDeleted: 1, leadStatus: 1 });
B2CLeadSchema.index({ createdAt: -1 });
B2CLeadSchema.index({ tags: 1 });
B2CLeadSchema.index({ "address.city": 1 });

// ── virtual ──────────────────────────────────────────────

B2CLeadSchema.virtual("fullName").get(function () {
  return `${this.salutation ?? ""} ${this.firstName} ${this.lastName ?? ""}`.trim();
});

// ── middleware ───────────────────────────────────────────

// B2CLeadSchema.pre("save", function (this: IB2CLeadDocument) {
//   const s = this.paymentSummary;
//   if (s) s.pending = (s.totalBilled ?? 0) - (s.totalPaid ?? 0);
// });

B2CLeadSchema.pre("findOneAndUpdate", function () {
  const update: any = this.getUpdate();
  if (update?.paymentSummary) {
    const s = update.paymentSummary;
    s.pending = (s.totalBilled ?? 0) - (s.totalPaid ?? 0);
  }
});

export default mongoose.model<IB2CLeadDocument>("B2CLead", B2CLeadSchema);