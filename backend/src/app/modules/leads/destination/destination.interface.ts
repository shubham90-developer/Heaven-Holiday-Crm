// ======================================================
// FILE: interfaces/destination.interface.ts
// ======================================================

import { Types } from "mongoose";

export type LeadModelType =
    | "B2CLead"
    | "B2BLead";

export interface IDestination {

    leadId: Types.ObjectId;

    leadModel: LeadModelType;

    country: string;
    city: string;

    //   createdBy?: {
    //     _id: Types.ObjectId;
    //     name: string;
    //   };

    createdAt?: Date;

    updatedAt?: Date;
}