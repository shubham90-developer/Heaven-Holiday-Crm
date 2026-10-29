import { Schema, model } from "mongoose";
import { IPackageBookingDocument } from "./packages.interface";

const HotelStayCitySchema = new Schema(
    {
        cityName: { type: String, default: "" },
        checkIn: { type: String, default: "" },
        checkOut: { type: String, default: "" },
        nights: { type: Number, default: 1 },
    },
    { _id: false }
);

const DayItinerarySchema = new Schema(
    {
        dayNumber: { type: Number, required: true },
        date: { type: String, default: "" },
        location: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        saveAsMaster: { type: Boolean, default: false },
        meals: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false },
        },
        itineraryType: { type: String, default: "Flight" },
        flight: { type: Schema.Types.Mixed, default: null },
        transport: { type: Schema.Types.Mixed, default: null },
        accommodation: { type: Schema.Types.Mixed, default: null },
        sightseeing: { type: Schema.Types.Mixed, default: null },
        cruise: { type: Schema.Types.Mixed, default: null },
        guide: { type: Schema.Types.Mixed, default: null },
        mealsItinerary: { type: Schema.Types.Mixed, default: null },
        visaItinerary: { type: Schema.Types.Mixed, default: null },
        others: { type: Schema.Types.Mixed, default: null },
    },
    { _id: false }
);

const TermsSchema = new Schema(
    {
        inclusions: { type: String, default: "" },
        exclusions: { type: String, default: "" },
        termsAndConditions: { type: String, default: "" },
        cancellationPolicy: { type: String, default: "" },
        travelBasics: { type: String, default: "" },
        bookingTerms: { type: String, default: "" },
        whyUseUs: { type: String, default: "" },
        refundPolicy: { type: String, default: "" },
    },
    { _id: false }
);

const CostBreakdownSchema = new Schema(
    {
        cost: { type: Number, default: 0 },
        markup: { type: Number, default: 0 },
        tax: { type: String, default: "Tax Extra with text" },
        total: { type: Number, default: 0 },
    },
    { _id: false }
);

const VisaCostBreakdownSchema = new Schema(
    {
        costPerAdult: { type: Number, default: 0 },
        cost: { type: Number, default: 0 },
        markup: { type: Number, default: 0 },
        tax: { type: String, default: "Tax Extra with text" },
        total: { type: Number, default: 0 },
    },
    { _id: false }
);

const SharePriceBreakupSchema = new Schema(
    {
        flight: { type: Boolean, default: false },
        hotel: { type: Boolean, default: false },
        transfer: { type: Boolean, default: false },
        sightseeing: { type: Boolean, default: false },
        visa: { type: Boolean, default: false },
    },
    { _id: false }
);

const CustomerDetailsSchema = new Schema(
    {
        customerType: { type: String, enum: ["B2C", "B2B"], required: true },
        leadId: { type: Schema.Types.ObjectId },
        email: { type: String, default: "" },
        mobile: { type: String, default: "" },
        salutation: { type: String, default: "" },
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        companyName: { type: String, default: "" },
        type: { type: String, default: "" },
        rm: { type: String, default: "" },
        leadSource: { type: String, default: "" },
        leadStage: { type: String, default: "" },
        remarks: { type: String, default: "" },
    },
    { _id: false }
);

const PackageBookingSchema = new Schema<IPackageBookingDocument>(
    {
        proposalId: { type: Number, required: true, unique: true },
        enquiryId: { type: Number, required: true, unique: true },
        queryId: { type: Schema.Types.ObjectId, ref: "Query", index: true },
        customerDetails: { type: CustomerDetailsSchema, required: true },
        goingTo: { type: String, default: "" },
        goingFrom: { type: String, default: "" },
        endDestination: { type: String, default: "" },
        travelDate: { type: String, default: "" },
        noOfDays: { type: Number, default: 0 },
        travelers: { type: Number, default: 2 },
        noOfRooms: { type: Number, default: 1 },
        leadSource: { type: String, default: "" },
        remark: { type: String, default: "" },
        packageMode: {
            type: String,
            enum: ["buildYourOwn", "readymade"],
            default: "buildYourOwn",
        },
        modifyMasterPackage: { type: Boolean, default: false },
        masterPackageName: { type: String, default: "" },
        packageType: {
            type: String,
            enum: ["Domestic", "International"],
            default: "Domestic",
        },
        hotelStayCities: { type: [HotelStayCitySchema], default: [] },
        days: { type: [DayItinerarySchema], default: [] },
        terms: { type: TermsSchema, default: () => ({}) },
        markupType: { type: String, default: "Build with Single mark Up" },
        pricingType: {
            type: String,
            enum: ["Total Pricing", "Per Person Pricing"],
            default: "Total Pricing",
        },
        currency: { type: String, default: "INR" },
        flightCost: { type: CostBreakdownSchema, default: () => ({}) },
        visaCost: { type: VisaCostBreakdownSchema, default: () => ({}) },
        landPackageCost: { type: CostBreakdownSchema, default: () => ({}) },
        discount: { type: Number, default: 0 },
        totalSalesPrice: { type: Number, default: 0 },
        advanceRequiredPercent: { type: Number, default: 10 },
        advance: { type: Number, default: 0 },
        totalBalance: { type: Number, default: 0 },
        shareCombinedFlight: { type: Boolean, default: false },
        shareCombinedVisa: { type: Boolean, default: false },
        tcsPackage: { type: Boolean, default: false },
        tcsFlight: { type: Boolean, default: false },
        tcsVisa: { type: Boolean, default: false },
        displayOnProposal: { type: Boolean, default: false },
        paymentMode: { type: String, default: "Cheque" },
        sharePriceBreakup: { type: SharePriceBreakupSchema, default: () => ({}) },
        sellingPrice: { type: Number, default: 0 },
        received: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
        paymentStatus: {
            type: String,
            enum: ["none", "pending", "partial", "paid"],
            default: "none",
        },
        owner: { type: String, default: "" },
        bookingStage: { type: String, default: "Proposal" },
        voucherStatus: { type: String, default: "Pending" },
        status: {
            type: String,
            enum: ["draft", "shared", "confirmed", "cancelled"],
            default: "draft",
        },
        currentStep: { type: Number, default: 1 },
        invoice: { type: Schema.Types.Mixed, default: null },
        fulfillment: { type: Schema.Types.Mixed, default: null },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

PackageBookingSchema.index({ travelDate: 1 });
PackageBookingSchema.index({ status: 1 });
PackageBookingSchema.index({ "customerDetails.customerType": 1 });

export const PackageBookingModel = model<IPackageBookingDocument>(
    "PackageBooking",
    PackageBookingSchema
);
