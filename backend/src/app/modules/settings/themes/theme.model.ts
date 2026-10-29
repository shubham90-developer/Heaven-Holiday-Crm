import { Schema, model, Document } from "mongoose";
import { ThemeStatus } from "./theme.interface";

export interface IThemeDocument extends Document {
    title: string;
    status: ThemeStatus;
    enabled: boolean;
    sortOrder: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const themeSchema = new Schema<IThemeDocument>(
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

themeSchema.index({ title: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
themeSchema.index({ sortOrder: 1, title: 1 });

export const ThemeModel = model<IThemeDocument>(
    "Theme",
    themeSchema
);
