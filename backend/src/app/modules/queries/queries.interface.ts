import { Types } from "mongoose";

// Staff snapshot
export interface IStaffSnapshot {
    _id: Types.ObjectId;
    name: string;
}

// Requirement types
export type RequirementType =
    | "Package"
    | "Flight"
    | "Transfer"
    | "Visa"
    | "Hotel"
    | "Sightseeing"
    | "Miscellaneous";

// Query stage (includes both display labels and snake_case values used by CRM UI)
export type QueryStage =
    | "Query Created"
    | "Interested"
    | "Call Back"
    | "Proposal Sent"
    | "Follow Up"
    | "Follow Up - Changes Required"
    | "Follow Up - Destination Finalized"
    | "Follow Up - Flight Booked"
    | "Follow Up - Negotiation"
    | "Follow Up - Visa in Process"
    | "Proposal Requested"
    | "Confirmed - Booking Request"
    | "Verbal Confirmed"
    | "Lost - Wrong No."
    | "Lost - Not Interested"
    | "Lost - Plan Cancelled"
    | "Lost - Budget Issue"
    | "Lost - Language Issue"
    | "Lost - Booked Elsewhere Confirmed"
    | "Lost - Planned Postponed"
    | "Lost - Duplicate Lead"
    | "Lost - Destinaion Changed"
    | "Lost - Different Trip Booked"
    | "Query Expired"
    | "query_created"
    | "interested"
    | "call_back"
    | "proposal_sent"
    | "follow_up"
    | "follow_up_changes"
    | "negotiation"
    | "booking_requested"
    | "verbal_confirmed"
    | "confirmed"
    | "confirmed_booking_requested"
    | "query_expired";

// Lead model type
export type LeadModel = "B2CLead" | "B2BLead";

// Type-specific query details
export interface IPaxDetails {
    twinSharing?: number;
    tripleSharing?: number;
    singleOccupancy?: number;
    quadOccupancy?: number;
    quintOccupancy?: number;
    hexaOccupancy?: number;
    childWithBed?: number;
    childWithoutBed?: number;
    infant?: number;
}

export interface IPackageDetails { goingTo: string; goingFrom?: string; specificDate: Date; travelers: number; paxDetails?: IPaxDetails; /*...*/ }
export interface IFlightDetails { sourceCity: string; destinationCity: string; departureDate: Date; adults: number; children: number; infants: number; /*...*/ }
export interface ITransferDetails { goingFrom: string; goingTo: string; pickupDateTime: Date; travelers: number; paxDetails?: IPaxDetails; /*...*/ }
export interface IVisaDetails { country: string; dateOfTravel: Date; adults: number; children: number; infants: number; /*...*/ }
export interface IHotelDetails { destination: string; checkIn: Date; checkOut: Date; travelers: number; paxDetails?: IPaxDetails; /*...*/ }
export interface ISightseeingDetails { destination: string; tourDate: Date; adults: number; children: number; /*...*/ }
export interface IMiscellaneousDetails { service: string; destination: string; date: Date; count: number; }

// Individual query stored in the array
export interface IQueryItem {
    requirementType: RequirementType;
    packageDetails?: IPackageDetails;
    flightDetails?: IFlightDetails;
    transferDetails?: ITransferDetails;
    visaDetails?: IVisaDetails;
    hotelDetails?: IHotelDetails;
    sightseeingDetails?: ISightseeingDetails;
    miscellaneousDetails?: IMiscellaneousDetails;
}

// Full Query document for a lead
export interface IQuery {
    leadId: Types.ObjectId;
    leadModel: LeadModel;

    queries: IQueryItem[];
    stage: QueryStage | "Query Created";
    remark?: string;
    assignedToSales?: IStaffSnapshot;
    leadQuality?: "hot" | "warm" | "cold" | "no_status";
    isArchived?: boolean;
    leadCampaign?: string;
    leadMedium?: string;

    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}