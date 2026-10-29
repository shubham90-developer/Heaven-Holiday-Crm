import mongoose, { Schema, Document } from "mongoose";
import { ILeadRemark } from "./remark.interface";

export interface ILeadRemarkDocument extends ILeadRemark, Document {}

const LeadRemarkSchema = new Schema<ILeadRemarkDocument>(
    {
        leadId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "leadModel",
        },

        leadModel: {
            type: String,
            required: true,
            enum: ["B2CLead", "B2BLead"],
        },

        remarkType: {
            type: String,
            required: true,
            enum: [
                "Customer",
                "Follow Up",
                "Interested",
                "Not Interested",
                "Callback",
                "Meeting",
                "Closed",
            ],
            default: "Customer",
        },

        remark: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

LeadRemarkSchema.index({ leadId: 1, createdAt: -1 });

export default mongoose.model<ILeadRemarkDocument>(
    "LeadRemark",
    LeadRemarkSchema
);