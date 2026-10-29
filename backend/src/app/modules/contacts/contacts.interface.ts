import { Document, Types } from "mongoose";

export type LeadModelType =
  | "B2CLead"
  | "B2BLead";

export interface IVisaCountry {
  country: string;
  date?: Date;
}

export interface IContact extends Document {
  leadId: Types.ObjectId;

  leadModel: LeadModelType;

  relation: string;

  crmLeadSource?: string;

  salutation?: string;

  firstName: string;

  lastName?: string;

  email?: string;

  alternateEmail?: string;

  mobileNumber: string;

  alternateMobile?: string;

  country: string;

  state?: string;

  city: string;

  pinZipCode?: string;

  visaCountry?: IVisaCountry[];

  createdAt: Date;

  updatedAt: Date;
}