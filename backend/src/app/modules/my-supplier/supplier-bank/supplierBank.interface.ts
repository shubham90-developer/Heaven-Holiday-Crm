import mongoose, { Schema, Document } from "mongoose";

export interface ISupplierBank extends Document {
  supplierId: mongoose.Types.ObjectId;

  accountName: string;
  accountNumber: string;
  bankName?: string;
  ifscCode?: string;
  swiftCode?: string;

  isPrimary: boolean;

  country?: string;
  city?: string;

  comments?: string;
}