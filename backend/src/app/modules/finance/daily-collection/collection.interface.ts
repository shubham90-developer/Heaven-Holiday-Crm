import { Document, Types } from "mongoose";

export type CollectionPaymentChannel = "offline" | "online";
export type CollectionPaymentStatus = "pending" | "approved" | "rejected";

export type CollectionPaymentMode =
    | "Offline - Cash"
    | "Offline - UPI"
    | "Offline - Cheque"
    | "Offline - Bank Transfer"
    | "Offline - Card"
    | "Online - Razorpay";

export interface IDailyCollection {
    receiptNo: number;
    bookingId: Types.ObjectId;
    queryId?: Types.ObjectId;
    proposalId?: number;
    enquiryId?: number;
    customerName: string;
    customerEmail?: string;
    customerMobile?: string;
    amount: number;
    currency: string;
    mode: CollectionPaymentMode;
    paymentChannel: CollectionPaymentChannel;
    reference?: string;
    transactionNo?: string;
    remarks?: string;
    particulars?: string;
    owner?: string;
    status: CollectionPaymentStatus;
    receivedBy?: string;
    approvedBy?: string;
    approvedAt?: Date;
    rejectedBy?: string;
    rejectedAt?: Date;
    rejectionReason?: string;
    bookingDate?: string;
    collectionDate: Date;
    isDeleted: boolean;
}

export interface IDailyCollectionDocument extends IDailyCollection, Document {
    createdAt: Date;
    updatedAt: Date;
}
