import { Types } from "mongoose";

export type RemarkType =
    | "Customer"
    | "Follow Up"
    | "Interested"
    | "Not Interested"
    | "Callback"
    | "Meeting"
    | "Closed";

export interface ILeadRemark {
    leadId: Types.ObjectId;
    leadModel: "B2CLead" | "B2BLead";
    remarkType: RemarkType;
    remark: string;
    createdAt?: Date;
    updatedAt?: Date;
}