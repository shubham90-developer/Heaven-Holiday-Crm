// ======================================================
// FILE: interfaces/travelHistory.interface.ts
// ======================================================

import { Types } from "mongoose";

export type TravelType =
  | "⭐"
  | "⭐⭐"
  | "⭐⭐⭐"
  | "⭐⭐⭐⭐"
  | "⭐⭐⭐⭐⭐";

export interface ITravelHistory {

  leadId: Types.ObjectId;

  leadModel:
  | "B2CLead"
  | "B2BLead";

  country: string;

  city: string;

  type: TravelType;

  lastVisited: Date;

  // createdBy?: {
  //   _id: Types.ObjectId;
  //   name: string;
  // };

  createdAt?: Date;

  updatedAt?: Date;
}