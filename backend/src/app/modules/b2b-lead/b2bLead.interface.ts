import { Types } from "mongoose";

export interface IStaffSnapshot {
    _id: Types.ObjectId;
    name: string;
}

export interface IAddress {
    country?: string | null;
    state?: string | null;
    city?: string | null;
    area?: string | null;
    pincode?: string | null;
    addressLine?: string | null;
}

export interface IPersonalInfo {
    relation?: string | null;
    dob?: Date | null;
    anniversary?: Date | null;
    passport?: {
        hasPassport?: boolean;
        passportNumber?: string | null;
        expiryDate?: Date | null;
    };
}

export interface IB2BLead {
    leadModel: string;

    // ── core identity ────────────────────────────────────
    type: "agency" | "corporate";
    companyName: string;
    salutation?: "Mr." | "Mrs." | "Ms." | "Miss." | "Dr." | "Prof.";
    firstName: string;
    lastName?: string | null;

    // ── contact ──────────────────────────────────────────
    email: string;
    alternateEmail?: string | null;
    mobile: string;
    alternateMobile?: string | null;

    // ── address ──────────────────────────────────────────
    address?: IAddress;

    // ── personal info ─────────────────────────────────────
    personalInfo?: IPersonalInfo;

    // ── pipeline ─────────────────────────────────────────
    rm?: string | null;
    leadSource?: string | null;
    leadStage?:
    | "New"
    | "Follow Up"
    | "Call Back"
    | "Wrong Number"
    | "Cannot Be Contacted"
    | "Not Interested"
    | "Junk Lead"
    | "Lost Lead"
    | "Duplicate"
    | "Destination Closed"
    | "Unanswered"
    | "Not Reachable"
    | "Contacted";
    leadStatus?: "In Process" | "Un-Assigned" | "Archived" | "Callback";

    // ── assignment ───────────────────────────────────────
    assignedOwner?: IStaffSnapshot | null;

    // ── misc ─────────────────────────────────────────────
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
