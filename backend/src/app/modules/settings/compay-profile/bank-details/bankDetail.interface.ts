import { Document, Types } from "mongoose";

export interface IBankDetail extends Document {
  userId: Types.ObjectId;
  companyProfileId: Types.ObjectId;

  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;

  accountType: "Saving" | "Current";

  bankName: string;
  branch: string;

  country: string;
  city: string;

  isActive: boolean;
}