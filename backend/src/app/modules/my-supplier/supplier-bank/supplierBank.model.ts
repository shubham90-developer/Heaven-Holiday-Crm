import mongoose, { Schema, Document } from "mongoose";
import { ISupplierBank } from "./supplierBank.interface";

const SupplierBankSchema = new Schema<ISupplierBank>(
    {
        // supplierId: {
        //     type: Schema.Types.ObjectId,
        //     ref: "Supplier",
        //     required: true,
        // },

        accountName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        bankName: String,
        ifscCode: String,
        swiftCode: String,

        isPrimary: { type: Boolean, default: false },

        country: String,
        city: String,

        comments: String,
    },
    { timestamps: true }
);

export default mongoose.model<ISupplierBank>(
    "SupplierBank",
    SupplierBankSchema
);