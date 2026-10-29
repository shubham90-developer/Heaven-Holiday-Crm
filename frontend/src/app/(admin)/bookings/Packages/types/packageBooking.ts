import {
    FlightItinerary,
    TransportItinerary,
    AccommodationItinerary,
    SightseeingItinerary,
    CruiseItinerary,
    GuideItinerary,
    MealsItinerary,
    VisaItinerary,
    OthersItinerary,
    ItineraryTypeOption,
} from "./itineraryTypes";

export type { ItineraryTypeOption };

export type CustomerType = "B2C" | "B2B";

export interface CustomerDetails {
    customerType: CustomerType;
    leadId?: string;
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

export interface HotelStayCity {
    cityName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
}

export interface DayItinerary {
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
    itineraryType: ItineraryTypeOption;
    flight?: FlightItinerary;
    transport?: TransportItinerary;
    accommodation?: AccommodationItinerary;
    sightseeing?: SightseeingItinerary;
    cruise?: CruiseItinerary;
    guide?: GuideItinerary;
    mealsItinerary?: MealsItinerary;
    visaItinerary?: VisaItinerary;
    others?: OthersItinerary;
}

export interface TermsSection {
    inclusions: string;
    exclusions: string;
    termsAndConditions: string;
    cancellationPolicy: string;
    travelBasics: string;
    bookingTerms: string;
    whyUseUs: string;
    refundPolicy: string;
}

export interface CostBreakdown {
    cost: number;
    markup: number;
    tax: string;
    total: number;
}

export interface VisaCostBreakdown extends CostBreakdown {
    costPerAdult: number;
}

export interface SharePriceBreakup {
    flight: boolean;
    hotel: boolean;
    transfer: boolean;
    sightseeing: boolean;
    visa: boolean;
}

export interface PackageBookingFormData {
    _id?: string;
    proposalId?: number;
    enquiryId?: number;
    customerDetails: CustomerDetails;
    goingTo: string;
    goingFrom: string;
    endDestination: string;
    travelDate: string;
    noOfDays: number;
    travelers: number;
    noOfRooms: number;
    leadSource: string;
    remark: string;
    packageMode: "buildYourOwn" | "readymade";
    modifyMasterPackage: boolean;
    masterPackageName: string;
    packageType: "Domestic" | "International";
    hotelStayCities: HotelStayCity[];
    days: DayItinerary[];
    terms: TermsSection;
    markupType: string;
    pricingType: "Total Pricing" | "Per Person Pricing";
    currency: string;
    flightCost: CostBreakdown;
    visaCost: VisaCostBreakdown;
    landPackageCost: CostBreakdown;
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
    sharePriceBreakup: SharePriceBreakup;
    sellingPrice: number;
    received: number;
    balance: number;
    owner: string;
    bookingStage: string;
    voucherStatus: string;
    status: "draft" | "shared" | "confirmed" | "cancelled";
    paymentStatus?: "none" | "pending" | "partial" | "paid";
    queryId?: string;
    currentStep: number;
    invoice?: import("./invoiceTypes").InvoiceData;
    fulfillment?: import("./fulfillmentTypes").FulfillmentData;
}

export const defaultTerms = (): TermsSection => ({
    inclusions: "",
    exclusions: "",
    termsAndConditions: "",
    cancellationPolicy: "",
    travelBasics: "",
    bookingTerms: "",
    whyUseUs: "",
    refundPolicy: "",
});

export const defaultCostBreakdown = (): CostBreakdown => ({
    cost: 0,
    markup: 0,
    tax: "Tax Extra with text",
    total: 0,
});

export const defaultVisaCost = (): VisaCostBreakdown => ({
    costPerAdult: 0,
    cost: 0,
    markup: 0,
    tax: "Tax Extra with text",
    total: 0,
});

export const defaultSharePriceBreakup = (): SharePriceBreakup => ({
    flight: false,
    hotel: false,
    transfer: false,
    sightseeing: false,
    visa: false,
});

export const createInitialFormData = (
    customerDetails: CustomerDetails
): PackageBookingFormData => ({
    customerDetails,
    goingTo: "",
    goingFrom: "",
    endDestination: "",
    travelDate: "",
    noOfDays: 0,
    travelers: 2,
    noOfRooms: 1,
    leadSource: customerDetails.leadSource || "",
    remark: customerDetails.remarks || "",
    packageMode: "buildYourOwn",
    modifyMasterPackage: false,
    masterPackageName: "",
    packageType: "Domestic",
    hotelStayCities: [],
    days: [],
    terms: defaultTerms(),
    markupType: "Build with Single mark Up",
    pricingType: "Total Pricing",
    currency: "INR",
    flightCost: defaultCostBreakdown(),
    visaCost: defaultVisaCost(),
    landPackageCost: defaultCostBreakdown(),
    discount: 0,
    totalSalesPrice: 0,
    advanceRequiredPercent: 10,
    advance: 0,
    totalBalance: 0,
    shareCombinedFlight: false,
    shareCombinedVisa: false,
    tcsPackage: false,
    tcsFlight: false,
    tcsVisa: false,
    displayOnProposal: false,
    paymentMode: "Cheque",
    sharePriceBreakup: defaultSharePriceBreakup(),
    sellingPrice: 0,
    received: 0,
    balance: 0,
    paymentStatus: "none",
    owner: customerDetails.rm || "",
    bookingStage: "Proposal",
    voucherStatus: "Pending",
    status: "draft",
    currentStep: 1,
});

export const computePricing = (form: PackageBookingFormData) => {
    const flightTotal =
        Number(form.flightCost.cost || 0) + Number(form.flightCost.markup || 0);
    const visaTotal =
        Number(form.visaCost.cost || 0) + Number(form.visaCost.markup || 0);
    const landTotal =
        Number(form.landPackageCost.cost || 0) +
        Number(form.landPackageCost.markup || 0);

    const totalSalesPrice = flightTotal + visaTotal + landTotal - Number(form.discount || 0);
    const advance = Math.round(
        (totalSalesPrice * Number(form.advanceRequiredPercent || 10)) / 100
    );
    const totalBalance = totalSalesPrice - advance;

    return {
        flightCost: { ...form.flightCost, total: flightTotal },
        visaCost: { ...form.visaCost, total: visaTotal },
        landPackageCost: { ...form.landPackageCost, total: landTotal },
        totalSalesPrice,
        advance,
        totalBalance,
        sellingPrice: totalSalesPrice,
        balance: totalBalance,
    };
};

export const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });
};

export const getCustomerName = (customer: CustomerDetails) => {
    if (customer.customerType === "B2B") {
        return customer.companyName || "Agency";
    }
    return `${customer.salutation || ""} ${customer.firstName || ""} ${customer.lastName || ""}`.trim();
};

export const CUSTOMER_STORAGE_KEY = "packageBookingCustomer";
export const QUERY_PACKAGE_STORAGE_KEY = "packageBookingFromQuery";

/** Prefill payload when starting Build Pro Package from a CRM query */
export interface QueryPackagePrefill {
    customerDetails: CustomerDetails;
    queryId?: string;
    goingTo?: string;
    goingFrom?: string;
    travelDate?: string;
    noOfDays?: number;
    travelers?: number;
    leadSource?: string;
    remark?: string;
}

const toDateInputValue = (value?: string | Date | null): string => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
};

export const createFormDataFromQueryPrefill = (
    prefill: QueryPackagePrefill
): PackageBookingFormData => ({
    ...createInitialFormData(prefill.customerDetails),
    queryId: prefill.queryId,
    goingTo: prefill.goingTo || "",
    goingFrom: prefill.goingFrom || "",
    endDestination: "",
    travelDate: toDateInputValue(prefill.travelDate) || prefill.travelDate || "",
    noOfDays: Number(prefill.noOfDays) || 0,
    travelers: Number(prefill.travelers) || 2,
    leadSource: prefill.leadSource || prefill.customerDetails.leadSource || "",
    remark: prefill.remark || prefill.customerDetails.remarks || "",
    packageMode: "buildYourOwn",
});

/** Map a CRM query document into package-builder prefill values */
export const buildPrefillFromQuery = (query: any): QueryPackagePrefill => {
    const lead = query?.leadId || {};
    const item = query?.queries?.[0] || {};
    const pkg = item.packageDetails || {};
    const flight = item.flightDetails || {};
    const hotel = item.hotelDetails || {};
    const transfer = item.transferDetails || {};
    const visa = item.visaDetails || {};
    const sightseeing = item.sightseeingDetails || {};
    const misc = item.miscellaneousDetails || {};

    const travelers =
        pkg.travelers ??
        hotel.travelers ??
        transfer.travelers ??
        (flight.adults != null
            ? Number(flight.adults || 0) +
              Number(flight.children || 0) +
              Number(flight.infants || 0)
            : undefined) ??
        (visa.adults != null
            ? Number(visa.adults || 0) + Number(visa.children || 0)
            : undefined) ??
        sightseeing.adults ??
        misc.count ??
        2;

    const leadSource =
        pkg.leadSource ||
        flight.leadSource ||
        transfer.leadSource ||
        visa.leadSource ||
        hotel.leadSource ||
        sightseeing.leadSource ||
        misc.leadSource ||
        "";

    const remark =
        query?.remark ||
        flight.remark ||
        transfer.remark ||
        visa.remark ||
        hotel.remark ||
        sightseeing.remark ||
        misc.remark ||
        "";

    return {
        queryId: query?._id,
        goingTo:
            pkg.goingTo ||
            flight.destinationCity ||
            hotel.destination ||
            transfer.goingTo ||
            transfer.to ||
            visa.country ||
            sightseeing.destination ||
            misc.destination ||
            "",
        goingFrom:
            pkg.goingFrom ||
            flight.sourceCity ||
            transfer.goingFrom ||
            transfer.from ||
            "",
        travelDate: toDateInputValue(
            pkg.specificDate ||
                flight.departureDate ||
                hotel.checkIn ||
                transfer.pickupDateTime ||
                transfer.departureDate ||
                visa.dateOfTravel ||
                misc.date
        ),
        noOfDays: Number(pkg.noOfDays || transfer.noOfDays || hotel.nights || 0),
        travelers: Number(travelers) || 2,
        leadSource,
        remark,
        customerDetails: {
            customerType: query?.leadModel === "B2BLead" ? "B2B" : "B2C",
            leadId: lead?._id,
            email: lead?.email || "",
            mobile: lead?.mobile || lead?.phone || "",
            salutation: lead?.salutation || "",
            firstName: lead?.firstName || "",
            lastName: lead?.lastName || "",
            companyName: lead?.companyName || lead?.personalInfo?.companyName || "",
            type: lead?.type || "",
            rm: query?.assignedToSales?.name || "",
            leadSource,
            leadStage: query?.stage || "",
            remarks: remark,
        },
    };
};
