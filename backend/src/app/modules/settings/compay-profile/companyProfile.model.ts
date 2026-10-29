import { Schema, model } from "mongoose";
import { ICompanyProfile } from "./companyProfile.interface";

const companyProfileSchema = new Schema<ICompanyProfile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        personalDetails: {
            firstName: String,
            lastName: String,
            designation: String,
            mobileNumber: String,
            email: String,
            senderEmail: String
        },

        companyDetails: {
            companyName: String,
            companyDisplayName: String,
            gstNumber: String,
            companyLogo: String,
            companyNumber: String,
            companyEmail: String,

            transactionCurrency: {
                type: String,
                enum: ["INR", "USD"],
                default: "INR"
            },

            registeredAddress: {
                addressLine1: String,
                addressLine2: String,
                country: String,
                city: String,
                pinCode: String
            },

            expertiseCountry: String,
            expertiseCity: String,

            agencySignature: String,
            agencySignatureImage: String,
            invoiceSignatureImage: String,
            addressProof: String
        },

        moreAboutCompany: {
            aboutCompany: String,

            certificationOfTrade: [String],

            recognitionFromGovernment: [String],

            socialLinks: {
                facebook: String,
                google: String,
                youtube: String,
                twitter: String,
                instagram: String,
                pinterest: String,
                googleFeedback: String
            }
        }
    },
    {
        timestamps: true
    }
);

export const CompanyProfile = model<ICompanyProfile>("CompanyProfile", companyProfileSchema);