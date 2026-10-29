import mongoose, { Schema } from "mongoose";
import { IBankDetail } from "./bankDetail.interface";

const bankDetailSchema = new Schema<IBankDetail>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    companyProfileId: {
      type: Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true
    },

    accountHolderName: {
      type: String,
      required: true
    },

    accountNumber: {
      type: String,
      required: true
    },

    ifscCode: {
      type: String,
      required: true
    },

    accountType: {
      type: String,
      enum: ["Saving", "Current"],
      required: true
    },

    bankName: {
      type: String,
      required: true
    },

    branch: {
      type: String,
      required: true
    },

    country: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const BankDetail = mongoose.model<IBankDetail>("BankDetail", bankDetailSchema);