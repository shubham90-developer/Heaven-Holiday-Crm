import { Document, Types } from "mongoose";

export type CustomerType = "B2C" | "B2B";
export type PackageBookingStatus = "draft" | "shared" | "confirmed" | "cancelled";
export type PackagePaymentStatus = "none" | "pending" | "partial" | "paid";
export type PackageMode = "buildYourOwn" | "readymade";
export type PackageTypeOption = "Domestic" | "International";
export type PricingType = "Total Pricing" | "Per Person Pricing";

export interface IHotelStayCity {
    cityName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
}

export interface IDayItinerary {
    dayNumber: number;
    date: string;
    location: string;
    title: string;
    description: string;
    saveAsMaster: boolean;
    meals: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
    };
    itineraryType?: string;
}

export interface ITermsSection {
    inclusions: string;
    exclusions: string;
    termsAndConditions: string;
    cancellationPolicy: string;
    travelBasics: string;
    bookingTerms: string;
    whyUseUs: string;
    refundPolicy: string;
}

export interface ICostBreakdown {
    cost: number;
    markup: number;
    tax: string;
    total: number;
}

export interface IVisaCostBreakdown extends ICostBreakdown {
    costPerAdult: number;
}

export interface ISharePriceBreakup {
    flight: boolean;
    hotel: boolean;
    transfer: boolean;
    sightseeing: boolean;
    visa: boolean;
}

export interface ICustomerDetails {
    customerType: CustomerType;
    leadId?: Types.ObjectId;
    email?: string;
    mobile?: string;
    salutation?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    type?: string;
    rm?: string;
    leadSource?: string;
    leadStage?: string;
    remarks?: string;
}

export interface IPackageBooking {
    proposalId: number;
    enquiryId: number;
    queryId?: Types.ObjectId;
    customerDetails: ICustomerDetails;
    goingTo: string;
    goingFrom: string;
    endDestination?: string;
    travelDate: string;
    noOfDays: number;
    travelers: number;
    noOfRooms: number;
    leadSource: string;
    remark: string;
    packageMode: PackageMode;
    modifyMasterPackage: boolean;
    masterPackageName?: string;
    packageType: PackageTypeOption;
    hotelStayCities: IHotelStayCity[];
    days: IDayItinerary[];
    terms: ITermsSection;
    markupType: string;
    pricingType: PricingType;
    currency: string;
    flightCost: ICostBreakdown;
    visaCost: IVisaCostBreakdown;
    landPackageCost: ICostBreakdown;
    discount: number;
    totalSalesPrice: number;
    advanceRequiredPercent: number;
    advance: number;
    totalBalance: number;
    shareCombinedFlight: boolean;
    shareCombinedVisa: boolean;
    tcsPackage: boolean;
    tcsFlight: boolean;
    tcsVisa: boolean;
    displayOnProposal: boolean;
    paymentMode: string;
    sharePriceBreakup: ISharePriceBreakup;
    sellingPrice: number;
    received: number;
    balance: number;
    paymentStatus: PackagePaymentStatus;
    owner: string;
    bookingStage: string;
    voucherStatus: string;
    status: PackageBookingStatus;
    currentStep: number;
    invoice?: Record<string, unknown> | null;
    fulfillment?: Record<string, unknown> | null;
    isDeleted: boolean;
}

export interface IPackageBookingDocument extends IPackageBooking, Document {
    createdAt: Date;
    updatedAt: Date;
}
