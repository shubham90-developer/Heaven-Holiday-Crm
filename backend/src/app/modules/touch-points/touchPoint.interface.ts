import { Document, Types } from "mongoose";

export type TouchPointType =
    | "Status"
    | "Remarks"
    | "Email"
    | "Call"
    | "Todo"
    | "Meeting"
    | "SMS"
    | "Proposal"
    | "Follow Up"
    | "Query Created"
    | "Payment"
    | "Booking";

export interface ITouchPoint {
    queryId?: Types.ObjectId;
    leadId?: Types.ObjectId;
    leadModel?: "B2CLead" | "B2BLead";
    type: TouchPointType;
    title: string;
    description?: string;
    createdBy?: string;
    meta?: Record<string, unknown>;
    isDeleted: boolean;
}

export interface ITouchPointDocument extends ITouchPoint, Document {
    createdAt: Date;
    updatedAt: Date;
}

export interface ITouchPointSummary {
    customerName: string;
    currentStage: string;
    leadQuality: string;
    totalCall: number;
    totalTodo: number;
    totalMeeting: number;
    totalSMS: number;
}
