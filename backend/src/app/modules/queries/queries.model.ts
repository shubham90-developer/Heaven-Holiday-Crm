import mongoose, { Schema, Document } from "mongoose";
import { IQuery } from "./queries.interface";

export interface IQueryDocument extends IQuery, Document { }

// Sub-schemas for details
const PaxDetailsSchema = new Schema({
    twinSharing: { type: Number, default: 0 },
    tripleSharing: { type: Number, default: 0 },
    singleOccupancy: { type: Number, default: 0 },
    quadOccupancy: { type: Number, default: 0 },
    quintOccupancy: { type: Number, default: 0 },
    hexaOccupancy: { type: Number, default: 0 },
    childWithBed: { type: Number, default: 0 },
    childWithoutBed: { type: Number, default: 0 },
    infant: { type: Number, default: 0 },
}, { _id: false });

const PackageDetailsSchema = new Schema({
    goingTo: String,
    goingFrom: String,
    specificDate: Date,
    travelers: Number,
    paxDetails: { type: PaxDetailsSchema, default: undefined },
    noOfDays: Number,
    priceRange: String,
    inclusions: { type: [String], default: [] },
    theme: { type: [String], default: [] },
    hotelPreference: { type: [Number], default: [] },
    foodPreference: { type: [String], default: [] },
    leadSource: String,
    remark: String,
    assignToSales: String,
    queryType: String,
    assignToOps: Boolean,
    opsPerson: String,
}, { _id: false });

const FlightDetailsSchema = new Schema({
    flightType: String,        // One Way / Round Trip / Multi City
    isGroup: Boolean,          // Group checkbox
    sourceCity: String,
    destinationCity: String,
    departureDate: Date,
    adults: Number,
    children: Number,
    infants: Number,
    fareType: String,          // Regular / Student / Senior Citizen
    directFlight: Boolean,
    flightClass: String,       // Economy / Business
    preferredAirline: String,
    leadSource: String,
    assignToSales: String,
    assignToOps: Boolean,
    opsPerson: String,
    remark: String,
}, { _id: false });

const TransferDetailsSchema = new Schema({
    transferType: String,        // Cab / Train

    // Cab fields
    queryType: String,           // One Way / Round Trip
    goingTo: String,
    goingFrom: String,
    pickupDateTime: Date,
    noOfDays: Number,
    travelers: Number,
    paxDetails: { type: PaxDetailsSchema, default: undefined },
    pickupLocation: String,
    preference: String,          // Luxury / Standard / SUV

    // Train fields
    from: String,
    to: String,
    departureDate: Date,
    adults: Number,
    children: Number,
    infants: Number,
    trainClass: String,          // AC First Class / ALL CLASSES
    category: String,            // General / Tatkal

    // Common
    leadSource: String,
    remark: String,
    assignToSales: String,
    assignToOps: Boolean,
    opsPerson: String,
}, { _id: false });

const VisaDetailsSchema = new Schema({
    country: String,
    visaCategory: String,        // Tourism / Business / Student
    entryType: String,           // Single / Multi / Double Entry
    dateOfTravel: Date,
    adults: Number,
    children: Number,
    childWithFamily: Number,
    infants: Number,
    duration: String,
    nationality: String,
    leadSource: String,
    remark: String,
    assignToSales: String,
    assignToOps: Boolean,
    opsPerson: String,
}, { _id: false });

const HotelDetailsSchema = new Schema({
    destination: String,
    checkIn: Date,
    checkOut: Date,
    nights: Number,
    nationality: String,
    travelers: Number,
    paxDetails: { type: PaxDetailsSchema, default: undefined },
    starRating: String,
    foodPreference: { type: [String], default: [] },
    leadSource: String,
    remark: String,
    assignToSales: String,
    assignToOps: Boolean,
    opsPerson: String,
}, { _id: false });

const SightseeingDetailsSchema = new Schema({
    destination: String,
    duration: String,
    adults: Number,
    children: Number,
    nationality: String,
    leadSource: String,
    remark: String,
    assignToSales: String,
    assignToOps: Boolean,
    opsPerson: String,
}, { _id: false });

const MiscellaneousDetailsSchema = new Schema({
    service: String,
    destination: String,
    date: Date,
    count: Number,
    leadSource: String,
    remark: String,
    assignToSales: String,
    assignToOps: Boolean,
    opsPerson: String,
}, { _id: false });

const StaffSnapshotSchema = new Schema({ _id: Schema.Types.ObjectId, name: String }, { _id: false });

// Each query item in the array
const QueryItemSchema = new Schema(
    {
        requirementType: {
            type: String,
            required: true,
            enum: ["Package", "Flight", "Transfer", "Visa", "Hotel", "Sightseeing", "Miscellaneous"],
        },
        packageDetails: PackageDetailsSchema,
        flightDetails: FlightDetailsSchema,
        transferDetails: TransferDetailsSchema,
        visaDetails: VisaDetailsSchema,
        hotelDetails: HotelDetailsSchema,
        sightseeingDetails: SightseeingDetailsSchema,
        miscellaneousDetails: MiscellaneousDetailsSchema,
    },
    { timestamps: true, _id: true, minimize: true } // ✅ minimize removes empty objects
);

// Main Query schema (one document per lead)
const QuerySchema = new Schema<IQueryDocument>({
    leadId: { type: Schema.Types.ObjectId, required: true, refPath: "leadModel" },
    leadModel: { type: String, required: true, enum: ["B2CLead", "B2BLead"] },
    queries: { type: [QueryItemSchema], default: [] },
    assignedToSales: { type: StaffSnapshotSchema },
    stage: { type: String, default: "Query Created" },
    remark: { type: String },
    leadQuality: {
        type: String,
        enum: ["hot", "warm", "cold", "no_status"],
        default: "no_status",
        index: true,
    },
    isArchived: { type: Boolean, default: false, index: true },
    leadCampaign: { type: String, default: "Default" },
    leadMedium: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IQueryDocument>("Query", QuerySchema);