import { Schema, model } from "mongoose";
import { IEmailTemplate } from "./emailTemplate.interface";

const emailTemplateSchema = new Schema<IEmailTemplate>(
    {
        templateName: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Active", "InActive"],
            default: "Active",
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const emailTemplate = model<IEmailTemplate>("emailTemplate", emailTemplateSchema);

