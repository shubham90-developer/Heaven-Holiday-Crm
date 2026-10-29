import { Schema, model, Document } from "mongoose";
import { InclusionStatus } from "./inclusion.interface";

export interface IInclusionDocument extends Document {
    title: string;
    status: InclusionStatus;
    enabled: boolean;
    sortOrder: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const inclusionSchema = new Schema<IInclusionDocument>(
    {
        title: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        enabled: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

inclusionSchema.index({ title: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
inclusionSchema.index({ sortOrder: 1, title: 1 });

export const InclusionModel = model<IInclusionDocument>(
    "Inclusion",
    inclusionSchema
);
