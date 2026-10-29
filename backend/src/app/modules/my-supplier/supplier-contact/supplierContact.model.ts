import mongoose, { Schema, Document } from "mongoose";
import { ISupplierContact } from "./supplierContact.interface";

const SupplierContactSchema = new Schema<ISupplierContact>(
    {
        // supplierId: {
        //     type: Schema.Types.ObjectId,
        //     ref: "Supplier",
        //     required: true,
        // },

        salutation: String,
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },

        designation: String,
        department: String,

        email: { type: String, required: true },
        mobileNumber: { type: String, required: true },

        country: String,
        state: String,
        city: String,

        comments: String,
        destinations: [String],
    },
    { timestamps: true }
);

export default mongoose.model<ISupplierContact>(
    "SupplierContact",
    SupplierContactSchema
);