import { Schema, model } from "mongoose";
import { ITermsConditions } from "./termsConditions.interface";
import { TERMS_CONDITION_KEYS } from "./termsConditions.constants";

const schemaDefinition = {
    ...Object.fromEntries(
        TERMS_CONDITION_KEYS.map((key) => [key, { type: String, default: "" }])
    ),
    defaultSelected: { type: Schema.Types.Mixed, default: {} },
};

const termsConditionsSchema = new Schema(schemaDefinition, {
    timestamps: true,
});

export const termsConditions = model<ITermsConditions>(
    "TermsConditions",
    termsConditionsSchema
);
