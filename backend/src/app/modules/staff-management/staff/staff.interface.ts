import { Types } from "mongoose";

export interface IAddress {
  country?: string;
  city?: string;
  postalCode?: string;
  fullAddress?: string;
}

export interface IStaff {
  // 🔹 Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // 🔹 Organization
  role: Types.ObjectId;
  department: Types.ObjectId;

  // 🔹 Reporting Manager
  reportingManager?: Types.ObjectId;

  // 🔹 Sender Config
  isSelfSender: boolean;
  senderEmail?: string;

  // 🔹 Permissions
  permissions: string[];

  // 🔹 Address
  address?: IAddress;

  // 🔹 Profile
  profileImage?: string;

  // 🔹 Signature
  signatureType: "default" | "custom";
  signature?: string;

  // 🔹 Status
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}