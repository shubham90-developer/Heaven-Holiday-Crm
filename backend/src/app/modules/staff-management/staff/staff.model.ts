import mongoose, { Schema } from "mongoose";
import { IStaff } from "./staff.interface";

const addressSchema = new Schema(
  {
    country: String,
    city: String,
    postalCode: String,
    fullAddress: String,
  },
  { _id: false }
);

const staffSchema = new Schema<IStaff>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    reportingManager: {
      type: String,
      required: true,
    },

    isSelfSender: {
      type: Boolean,
      default: false,
    },

    senderEmail: {
      type: String,
    },

    permissions: {
      type: [String],
      default: [],
    },

    address: addressSchema,

    profileImage: String,

    signatureType: {
      type: String,
      enum: ["default", "custom"],
      default: "default",
    },

    signature: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const StaffModel = mongoose.model<IStaff>("Staff", staffSchema);