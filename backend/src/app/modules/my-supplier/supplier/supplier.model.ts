import mongoose, { Document, Schema } from "mongoose";
import { ISupplier } from "./supplier.interface";

const supplierSchema = new Schema<ISupplier>(
    {
        companyName: {
            type: String,
            required: true,
        },
        currencyType: {
            type: String,
            required: true,
        },
        gstRegister: {
            type: Boolean,
            default: false
        },
        panNumber: {
            type: String,
            required: true
        },
        salutation: {
            type: String,
            enum: [
                "Mr.",
                "Ms.",
                "Mrs.",
                "Dr.",
                "Miss",
                "Prof.",
            ],
            default: "Mr.",
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
        },
        addressLine2: {
            type: String,
        },
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        },
        city2: {
            type: String,
        },
        category: {
            type: String,
            required: true,
        },
        services: {
            type: String,
            required: true,
        },
        comments: {
            type: String,
        },
        destinationOffered: {
            type: [String],
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

export default mongoose.model<ISupplier>("Supplier", supplierSchema);