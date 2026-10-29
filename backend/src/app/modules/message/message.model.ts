// import mongoose, { Schema, Document } from "mongoose";
// import { IMessage } from "./message.interface";

// // Extend mongoose Document with our interface
// export interface IMessageDocument extends IMessage, Document { }

// const MessageSchema: Schema<IMessage> = new Schema(
//     {
//         leadId: {
//             type: Schema.Types.ObjectId,
//             required: true,
//             refPath: "leadModel", // ✅ FIXED
//         },

//         leadModel: {
//             type: String,
//             required: true,
//             enum: ["B2CLead", "B2BLead"], // ✅ MUST match model names
//         },

//         messageType: {
//             type: String,
//             required: true,
//             enum: ["sms", "whatsapp", "email"],
//         },

//         subject: {
//             type: String,
//         },

//         content: {
//             type: String,
//             required: true,
//         },

//         status: {
//             type: String,
//             enum: ["pending", "sent", "failed"],
//             default: "pending",
//         },

//         sentBy: {
//             type: Schema.Types.ObjectId,
//             ref: "User", // optional (if you have users)
//         },

//         sentAt: {
//             type: Date,
//         },

//         error: {
//             type: String,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// export const Message = mongoose.model<IMessage>("Message", MessageSchema);

import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "./message.interface";

export interface IMessageDocument extends IMessage, Document { }

const MessageSchema: Schema<IMessageDocument> = new Schema(
    {
        leadId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "leadModel",
        },

        leadModel: {
            type: String,
            required: true,
            enum: ["B2CLead", "B2BLead"],
        },

        // ✅ Renamed from messageType → channel to match frontend payload
        channel: {
            type: String,
            required: true,
            enum: ["sms", "whatsapp", "email"],
        },

        // ✅ New: stores which preset template was used (or "custom")
        templateType: {
            type: String,
            enum: ["phone_not_picked", "callback", "feedback", "custom"],
            default: "custom",
        },

        subject: {
            type: String,
            // ✅ Required only for email — enforced at service layer, not schema layer
        },

        content: {
            type: String,
            required: true, // ✅ Always store final resolved content, never raw template name
        },

        status: {
            type: String,
            enum: ["pending", "sent", "failed"],
            default: "pending",
        },

        sentBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        // ✅ Auto-set when status becomes "sent"
        sentAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // gives createdAt + updatedAt automatically
    }
);

MessageSchema.pre("save", async function () {
    if (this.isModified("status") && this.status === "sent") {
        this.sentAt = new Date();
    }
});

// ✅ Index for fast lookups by leadId (you'll query this constantly)
MessageSchema.index({ leadId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessageDocument>("Message", MessageSchema);