import mongoose, { Schema } from "mongoose";
import {
  IContact,
  LeadModelType,
} from "./contacts.interface";

const VisaCountrySchema = new Schema(
  {
    country: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
    },
  },
  {
    _id: false,
  }
);

const ContactSchema = new Schema<IContact>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      required: true,

      refPath: "leadModel",
    },

    leadModel: {
      type: String,

      required: true,

      enum: ["B2CLead", "B2BLead"],
    },

    relation: {
      type: String,
      required: true,
      trim: true,
    },

    crmLeadSource: {
      type: String,
      trim: true,
    },

    salutation: {
      type: String,

      enum: [
        "Mr.",
        "Mrs.",
        "Ms.",
        "Miss",
        "Dr.",
        "Prof.",
      ],
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    alternateEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    alternateMobile: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    pinZipCode: {
      type: String,
      trim: true,
    },

    visaCountry: {
      type: [VisaCountrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContact>(
  "Contact",
  ContactSchema
);