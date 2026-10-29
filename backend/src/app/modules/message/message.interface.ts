import mongoose from "mongoose";

// export interface IMessage {
//     leadId: mongoose.Types.ObjectId;

//     // ✅ MUST match schema + model names
//     leadModel: "B2CLead" | "B2BLead";

//     messageType: "sms" | "whatsapp" | "email";

//     subject?: string; // for email
//     content: string;

//     status: "pending" | "sent" | "failed";

//     sentBy?: mongoose.Types.ObjectId; // admin/user id
//     sentAt?: Date;

//     error?: string; // store failure reason if any

//     createdAt: Date;
//     updatedAt: Date;
// }

// message.interface.ts
export interface IMessage {
  leadId: mongoose.Types.ObjectId;
  leadModel: "B2CLead" | "B2BLead";
  channel: "sms" | "whatsapp" | "email";           // ✅ was messageType
  templateType?: "phone_not_picked" | "callback" | "feedback" | "custom";  // ✅ new
  subject?: string;
  content: string;
  status: "pending" | "sent" | "failed";
  sentBy?: mongoose.Types.ObjectId;
  sentAt?: Date | null;
  error?: string | null;
}