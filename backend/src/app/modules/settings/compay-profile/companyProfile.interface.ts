import { Types } from "mongoose";

export interface IPersonalDetails {
    firstName: string;
    lastName: string;
    designation: string;
    mobileNumber: string;
    email: string;
    senderEmail: string;
}

export interface IAddress {
    addressLine1: string;
    addressLine2?: string;
    country: string;
    city: string;
    pinCode: string;
}

export interface ICompanyDetails {
    companyName: string;
    companyDisplayName: string;
    gstNumber?: string;
    companyLogo?: string;
    companyNumber?: string;
    companyEmail?: string;
    transactionCurrency: string;

    registeredAddress: IAddress;

    expertiseCountry?: string;
    expertiseCity?: string;

    agencySignature?: string;
    agencySignatureImage?: string;
    invoiceSignatureImage?: string;
    addressProof?: string;
}

export interface ISocialLinks {
    facebook?: string;
    google?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
    pinterest?: string;
    googleFeedback?: string;
}

export interface IMoreAboutCompany {
    aboutCompany?: string;

    certificationOfTrade?: string[];

    recognitionFromGovernment?: string[];

    socialLinks?: ISocialLinks;
}

export interface ICompanyProfile {
    userId: Types.ObjectId;

    personalDetails: IPersonalDetails;

    companyDetails: ICompanyDetails;

    moreAboutCompany: IMoreAboutCompany;
}