import { Schema, model } from "mongoose";
import { ITouchPointDocument } from "./touchPoint.interface";

const TouchPointSchema = new Schema<ITouchPointDocument>(
    {
        queryId: {
            type: Schema.Types.ObjectId,
            ref: "Query",
            index: true,
        },
        leadId: {
            type: Schema.Types.ObjectId,
            refPath: "leadModel",
            index: true,
        },
        leadModel: {
            type: String,
            enum: ["B2CLead", "B2BLead"],
        },
        type: {
            type: String,
            enum: [
                "Status",
                "Remarks",
                "Email",
                "Call",
                "Todo",
                "Meeting",
                "SMS",
                "Proposal",
                "Follow Up",
                "Query Created",
                "Payment",
                "Booking",
            ],
            required: true,
            index: true,
        },
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        createdBy: { type: String, default: "" },
        meta: { type: Schema.Types.Mixed, default: {} },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

TouchPointSchema.index({ queryId: 1, createdAt: -1 });
TouchPointSchema.index({ leadId: 1, createdAt: -1 });

export const TouchPointModel = model<ITouchPointDocument>(
    "TouchPoint",
    TouchPointSchema
);
