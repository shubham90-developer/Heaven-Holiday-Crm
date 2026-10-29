import mongoose, { Schema, Document } from "mongoose";

export interface ISupplier extends Document {
    companyName: string;
    currencyType: string;
    gstRegister: boolean;
    panNumber?: string;
    salutation?: "Mr." | "Ms." | "Mrs." | "Miss";

    firstName: string;
    lastName?: string;
    designation?: string;

    email: string;
    mobileNumber: string;

    addressLine1?: string;
    addressLine2?: string;
    country: string;
    state?: string;
    city: string;
    city2: string;

    category: string;
    services: string;

    comments?: string;
    destinationOffered?: string[];
    isDeleted?: Boolean;
}