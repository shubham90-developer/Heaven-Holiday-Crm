import { Schema, model, Document } from "mongoose";
import { FoodPreferenceStatus } from "./foodPreference.interface";

export interface IFoodPreferenceDocument extends Document {
    title: string;
    status: FoodPreferenceStatus;
    enabled: boolean;
    sortOrder: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const foodPreferenceSchema = new Schema<IFoodPreferenceDocument>(
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

foodPreferenceSchema.index({ title: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
foodPreferenceSchema.index({ sortOrder: 1, title: 1 });

export const FoodPreferenceModel = model<IFoodPreferenceDocument>(
    "FoodPreference",
    foodPreferenceSchema
);
