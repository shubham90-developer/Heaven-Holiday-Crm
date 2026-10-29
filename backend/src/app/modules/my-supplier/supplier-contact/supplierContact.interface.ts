import mongoose, { Schema, Document } from "mongoose";

export interface ISupplierContact extends Document {
    supplierId: mongoose.Types.ObjectId;

    salutation?: string;
    firstName: string;
    lastName: string;

    designation?: string;
    department?: string;

    email: string;
    mobileNumber: string;

    country?: string;
    state?: string;
    city?: string;

    comments?: string;
    destinations?: string[];
}