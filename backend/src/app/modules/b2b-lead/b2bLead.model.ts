import mongoose, { Schema, Document } from "mongoose";
import { IB2BLead } from "./b2bLead.interface";

// Extend mongoose Document with our interface
export interface IB2BLeadDocument extends IB2BLead, Document { }

const StaffSnapshotSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const AddressSchema = new Schema(
    {
        country: { type: String, default: null },
        state: { type: String, default: null },
        city: { type: String, default: null },
        area: { type: String, default: null },
        pincode: { type: String, default: null },
        addressLine: { type: String, default: null },
    },
    { _id: false }
);

const PersonalInfoSchema = new Schema(
    {
        relation: { type: String, default: null },
        dob: { type: Date, default: null },
        anniversary: { type: Date, default: null },
        passport: {
            hasPassport: { type: Boolean, default: false },
            passportNumber: { type: String, default: null },
            expiryDate: { type: Date, default: null },
        },
    },
    { _id: false }
);

const B2BLeadSchema: Schema = new Schema<IB2BLeadDocument>(
    {
        leadModel: {
            type: String,
            default: "B2BLead",
            immutable: true,
        },

        type: {
            type: String,
            enum: ["agency", "corporate"],
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        salutation: {
            type: String,
            enum: ["Mr.", "Mrs.", "Ms.", "Miss.", "Dr.", "Prof."],
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
            default: null,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        alternateEmail: {
            type: String,
            trim: true,
            lowercase: true,
            default: null,
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
        },
        alternateMobile: {
            type: String,
            trim: true,
            default: null,
        },

        address: {
            type: AddressSchema,
            default: () => ({}),
        },

        personalInfo: {
            type: PersonalInfoSchema,
            default: () => ({}),
        },

        rm:         { type: String, default: null },
        leadSource: { type: String, default: null },
        leadStage: {
            type: String,
            enum: [
                "New", "Follow Up", "Call Back", "Wrong Number",
                "Cannot Be Contacted", "Not Interested", "Junk Lead",
                "Lost Lead", "Duplicate", "Destination Closed",
                "Unanswered", "Not Reachable", "Contacted",
            ],
            default: "New",
        },
        leadStatus: {
            type: String,
            enum: ["In Process", "Un-Assigned", "Archived", "Callback"],
            default: "Un-Assigned",
        },

        assignedOwner: {
            type: StaffSnapshotSchema,
            default: null,
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// ── indexes ──────────────────────────────────────────────

B2BLeadSchema.index({ mobile: 1 });
B2BLeadSchema.index({ email: 1 });
B2BLeadSchema.index({ leadStage: 1 });
B2BLeadSchema.index({ leadStatus: 1 });
B2BLeadSchema.index({ "assignedOwner._id": 1 });
B2BLeadSchema.index({ isDeleted: 1, leadStatus: 1 });
B2BLeadSchema.index({ createdAt: -1 });
B2BLeadSchema.index({ tags: 1 });
B2BLeadSchema.index({ "address.city": 1 });

export default mongoose.model<IB2BLeadDocument>("B2BLead", B2BLeadSchema);
// export default mongoose.model<IB2BLeadDocument>("B2BLead", B2BLeadSchema);