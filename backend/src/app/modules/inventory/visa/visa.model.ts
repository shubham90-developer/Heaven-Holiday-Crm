import { Schema, model } from "mongoose";
import { IVisa } from "./visa.interface";

const markupSchema = new Schema(
    {
        marketPlace: { type: String, enum: ["B2C", "B2B"], required: true },
        currency: String,
        markUpType: { type: String, enum: ["Amount", "Percentage"] },
        adult: Number,
        child: Number,
        infant: Number,
    },
    { _id: false }
);

const serviceProviderSchema = new Schema(
    {
        display: Boolean,
        serviceName: String,
        currency: String,
        fees: Number,
        markup: Number,
        taxable: Boolean,
    },
    { _id: false }
);

const visaSchema = new Schema<IVisa>(
    {
        travelerNationality: { type: String, required: true },
        countriesCovered: { type: String, required: true },

        visaName: { type: String, required: true },
        visaType: { type: String, enum: ["e Visa", "Sticker Visa"] },
        visaCategory: { type: String, enum: ["Tourism", "Business"] },
        entryType: { type: String, enum: ["Single Entry", "Multiple Entry"] },

        processingTime: String,
        passportExpireDays: Number,
        validityDays: Number,
        duration: String,

        supplier: String,
        embassyFeeCurrency: String,

        adultFee: Number,
        childFee: Number,
        childAge: Number,
        infantFee: Number,

        markup: [markupSchema],
        serviceProviders: [serviceProviderSchema],
    },
    { timestamps: true }
);

export const VisaModel = model<IVisa>("Visa", visaSchema);