import mongoose,
{ Schema, Document } from "mongoose";
import { ILeadExtraInfo } from "./leadsExtraInfo.interface";
export interface ILeadExtraInfoDocument extends ILeadExtraInfo, Document { }

const LeadExtraInfoSchema = new Schema<ILeadExtraInfoDocument>(
    {

        leadId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "leadModel",
        },

        leadModel: {
            type: String,
            required: true,
            enum: [
                "B2CLead",
                "B2BLead",
            ],
        },

        dob: {
            type: Date,
        },

        anniversary: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ILeadExtraInfoDocument>(
    "LeadExtraInfo",
    LeadExtraInfoSchema
);