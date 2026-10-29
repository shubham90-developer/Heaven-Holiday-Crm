import { Types } from "mongoose";

export type LeadModelType =
    | "B2CLead"
    | "B2BLead";

export interface ILeadExtraInfo {

    leadId: Types.ObjectId;

    leadModel: LeadModelType;

    dob?: Date;

    anniversary?: Date;

    createdAt?: Date;

    updatedAt?: Date;
}