import { Schema, model, Document } from "mongoose";
import { getNextSequence } from "../../../utils/counter.model";
import { LeadSourceStatus } from "./leadSource.interface";

export interface ILeadSourceDocument extends Document {
    leadId: number;
    title: string;
    isDefaultAssignLead: boolean;
    enabled: boolean;
    status: LeadSourceStatus;
    isDeleted: boolean
    createdAt: Date;
    updatedAt: Date;
}

const leadSourceSchema = new Schema<ILeadSourceDocument>(
    {
        leadId: { type: Number, unique: true, index: true },
        title: { type: String, required: true, trim: true },
        isDefaultAssignLead: { type: Boolean, default: false },
        enabled: { type: Boolean, default: true },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

leadSourceSchema.pre("save", async function () {
    if (this.isNew && !this.leadId) {
        this.leadId = await getNextSequence("leadSource");
    }
});

export const LeadSourceModel = model<ILeadSourceDocument>("LeadSource", leadSourceSchema);