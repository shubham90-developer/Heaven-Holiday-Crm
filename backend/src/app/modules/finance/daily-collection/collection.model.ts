import { Schema, model } from "mongoose";
import { IDailyCollectionDocument } from "./collection.interface";

const DailyCollectionSchema = new Schema<IDailyCollectionDocument>(
    {
        receiptNo: { type: Number, required: true, unique: true },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "PackageBooking",
            required: true,
            index: true,
        },
        queryId: {
            type: Schema.Types.ObjectId,
            ref: "Query",
            index: true,
        },
        proposalId: { type: Number },
        enquiryId: { type: Number },
        customerName: { type: String, required: true, default: "" },
        customerEmail: { type: String, default: "" },
        customerMobile: { type: String, default: "" },
        amount: { type: Number, required: true, min: 0 },
        currency: { type: String, default: "INR" },
        mode: {
            type: String,
            enum: [
                "Offline - Cash",
                "Offline - UPI",
                "Offline - Cheque",
                "Offline - Bank Transfer",
                "Offline - Card",
                "Online - Razorpay",
            ],
            required: true,
        },
        paymentChannel: {
            type: String,
            enum: ["offline", "online"],
            default: "offline",
        },
        reference: { type: String, default: "" },
        transactionNo: { type: String, default: "" },
        remarks: { type: String, default: "" },
        particulars: { type: String, default: "Package Booking Payment" },
        owner: { type: String, default: "" },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },
        receivedBy: { type: String, default: "" },
        approvedBy: { type: String, default: "" },
        approvedAt: { type: Date },
        rejectedBy: { type: String, default: "" },
        rejectedAt: { type: Date },
        rejectionReason: { type: String, default: "" },
        bookingDate: { type: String, default: "" },
        collectionDate: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

DailyCollectionSchema.index({ collectionDate: -1 });
DailyCollectionSchema.index({ status: 1, collectionDate: -1 });

export const DailyCollectionModel = model<IDailyCollectionDocument>(
    "DailyCollection",
    DailyCollectionSchema
);
