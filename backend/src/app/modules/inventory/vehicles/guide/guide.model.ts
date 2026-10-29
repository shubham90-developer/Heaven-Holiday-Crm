import { Schema, model } from "mongoose";
import { IGuide } from "./guide.interface";

const rateSchema = new Schema(
    {
        currency: { type: String, required: true },
        perDayRate: { type: Number, required: true },
        overnightCharges: { type: Number, required: true },
        markupType: {
            type: String,
            enum: ["Percentage", "Flat"],
            required: true,
        },
        markup: { type: Number, required: true },
        taxes: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    { _id: false }
);

const guideSchema = new Schema<IGuide>(
    {
        guideName: { type: String, required: true, trim: true },
        destination: { type: String, required: true },
        mobileNumber: { type: String, required: true, unique: true },
        email: { type: String },
        languages: { type: String, required: true },
        image: { type: String },
        description: { type: String },
        rates: { type: rateSchema, required: true },
    },
    { timestamps: true }
);

export const GuideModel = model<IGuide>("Vehicle_Guide", guideSchema);