// ── shared snapshots ─────────────────────────────────────

export interface IStaffSnapshot {
  _id: string;
  name: string;
}

// ── address ──────────────────────────────────────────────

export interface IAddress {
  country?: string | null;
  state?: string | null;
  city?: string | null;
  pincode?: string | null;
  addressLine?: string | null;
}

// ── personal info ─────────────────────────────────────────

export interface IPersonalInfo {
  maritalStatus?: "Married" | "Unmarried" | "Divorced" | null;
  kids?: {
    count?: number;
    details?: { name?: string; age?: number }[];
  };
  passport?: {
    hasPassport?: boolean;
    passportNumber?: string | null;
    expiryDate?: Date | null;
  };
  companyName?: string | null;
  gstNumber?: string | null;
  panCard?: string | null;
}

// ── preferences ───────────────────────────────────────────

export interface IPreferences {
  hotelStars?: number[];
  food?: "Veg" | "Non-Veg" | "Jain" | "Eggetarian" | null;
  seatPreference?: "Window" | "Aisle" | "Middle" | null;
  themes?: string[];
  preferredAirlines?: string[];
  visa?: {
    country?: string | null;
    expiryDate?: Date | null;
    hasVisa?: boolean;
  };
  category?: "VIP" | "Regular" | "Corporate" | "Premium";
}

// ── payment summary ───────────────────────────────────────

// export interface IPaymentSummary {
//   totalBilled?: number;
//   totalPaid?:   number;
//   pending?:     number;
// }

// ── main interface ────────────────────────────────────────

export interface IB2CLead {
  leadModel: string;

  // core identity
  salutation?: "Mr." | "Ms." | "Mrs." | "Miss" | "Dr." | "Prof.";
  firstName: string;
  lastName?: string;
  email?: string;
  alternateEmail?: string | null;
  mobile: string;
  alternateMobile?: string | null;

  // personal dates
  dob?: Date | null;
  anniversary?: Date | null;
  activeSince?: Date;

  // address
  address?: IAddress;

  // personal info
  personalInfo?: IPersonalInfo;

  // preferences
  preferences?: IPreferences;

  // pipeline
  leadSource?: string;
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

  // assignment
  assignedOwner?: IStaffSnapshot | null;

  // tags
  tags?: string[];
  remarks?: string | null;

  // payments (summary only — detail lives in separate collection)
  // paymentSummary?: IPaymentSummary;

  // system
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}