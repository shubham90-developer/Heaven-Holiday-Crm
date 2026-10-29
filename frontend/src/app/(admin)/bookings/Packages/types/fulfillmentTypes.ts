import {
    DayItinerary,
    PackageBookingFormData,
    formatDisplayDate,
    getCustomerName,
} from "./packageBooking";

export type ServiceCategoryKey =
    | "flights"
    | "guide"
    | "hotel"
    | "insurance"
    | "meals"
    | "others"
    | "sightseeing"
    | "transfers"
    | "visa";

export interface TravellerRow {
    id: string;
    type: "Adult" | "Child" | "Infant";
    salutation: string;
    firstMiddleName: string;
    lastName: string;
    passportNo: string;
    issueDate: string;
    expiryDate: string;
    dob: string;
    panNo: string;
    nationality: string;
}

export interface SupplierPaymentRow {
    id: string;
    supplierName: string;
    serviceCost: number;
    discount: number;
    extra: number;
    totalCost: number;
    paidAmount: number;
    balance: number;
}

export interface NetProfitRow {
    id: string;
    sourcing: string;
    roe: number;
    cost: number;
    paidAmount: number;
    averageRoe: number;
    paid: number;
    bankCharges: number;
    totalPaid: number;
}

export interface FulfillmentServiceItem {
    id: string;
    dayNumber?: number;
    label: string;
    supplier: string;
    cost: number;
    markup: number;
    total: number;
    remark?: string;
    sightseeingType?: "SIC" | "PVT" | "Entry Only" | "NA";
}

export interface ServicesIncluded {
    flights: boolean;
    guide: boolean;
    hotel: boolean;
    insurance: boolean;
    meals: boolean;
    others: boolean;
    sightseeing: boolean;
    transfers: boolean;
    visa: boolean;
}

export interface FulfillmentData {
    lockFile: boolean;
    voucherType: "Only Voucher" | "With Itinerary";
    travellers: TravellerRow[];
    supplierPayments: SupplierPaymentRow[];
    netProfitRows: NetProfitRow[];
    cashIn: number;
    cashOut: number;
    servicesIncluded: ServicesIncluded;
    hotels: FulfillmentServiceItem[];
    flights: FulfillmentServiceItem[];
    transfers: FulfillmentServiceItem[];
    sightseeings: FulfillmentServiceItem[];
    meals: FulfillmentServiceItem[];
    visa: FulfillmentServiceItem[];
    others: FulfillmentServiceItem[];
}

export interface FulfillmentSummary {
    oldCost: number;
    newCost: number;
    billedToCustomer: number;
    opsProfit: number;
    originalProfit: number;
    netProfit: number;
    cashIn: number;
    cashOut: number;
    netBalance: number;
}

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const defaultServicesIncluded = (): ServicesIncluded => ({
    flights: true,
    guide: false,
    hotel: true,
    insurance: false,
    meals: true,
    others: false,
    sightseeing: true,
    transfers: true,
    visa: false,
});

export const defaultFulfillment = (): FulfillmentData => ({
    lockFile: false,
    voucherType: "Only Voucher",
    travellers: [],
    supplierPayments: [],
    netProfitRows: [],
    cashIn: 0,
    cashOut: 0,
    servicesIncluded: defaultServicesIncluded(),
    hotels: [],
    flights: [],
    transfers: [],
    sightseeings: [],
    meals: [],
    visa: [],
    others: [],
});

export const formatFulfillmentCurrency = (
    amount: number,
    currency = "INR"
) => `${currency} ${Number(amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const createTravellerRows = (count: number): TravellerRow[] =>
    Array.from({ length: Math.max(count, 1) }, (_, i) => ({
        id: uid(),
        type: "Adult",
        salutation: "",
        firstMiddleName: "",
        lastName: "",
        passportNo: "",
        issueDate: "",
        expiryDate: "",
        dob: "",
        panNo: "",
        nationality: "",
    }));

const extractServicesFromDays = (days: DayItinerary[]) => {
    const hotels: FulfillmentServiceItem[] = [];
    const flights: FulfillmentServiceItem[] = [];
    const transfers: FulfillmentServiceItem[] = [];
    const sightseeings: FulfillmentServiceItem[] = [];
    const meals: FulfillmentServiceItem[] = [];
    const visa: FulfillmentServiceItem[] = [];
    const others: FulfillmentServiceItem[] = [];

    days.forEach((day) => {
        if (day.accommodation) {
            hotels.push({
                id: uid(),
                dayNumber: day.dayNumber,
                label: day.accommodation.hotelName || `Hotel - Day ${day.dayNumber}`,
                supplier: day.accommodation.supplier || "",
                cost: Number(day.accommodation.totalCost || 0),
                markup: Number(day.accommodation.markup || 0),
                total: Number(day.accommodation.finalPrice || 0),
            });
        }
        if (day.flight) {
            flights.push({
                id: uid(),
                dayNumber: day.dayNumber,
                label: `${day.flight.airline || "Flight"} ${day.flight.flightNo || ""}`.trim(),
                supplier: day.flight.supplier || "",
                cost: Number(day.flight.total || 0),
                markup: Number(day.flight.totalMarkup || 0),
                total: Number(day.flight.finalPrice || 0),
            });
        }
        if (day.transport) {
            transfers.push({
                id: uid(),
                dayNumber: day.dayNumber,
                label: `${day.transport.pickupCity || ""} → ${day.transport.dropCity || ""}`.trim(),
                supplier: day.transport.supplier || "",
                cost: Number(day.transport.totalPrice || 0),
                markup: Number(day.transport.totalMarkup || 0),
                total: Number(day.transport.finalPrice || 0),
            });
        }
        if (day.sightseeing) {
            const items = day.sightseeing.items || [];
            items.forEach((item) => {
                sightseeings.push({
                    id: uid(),
                    dayNumber: day.dayNumber,
                    label: item.name || `Sightseeing - Day ${day.dayNumber}`,
                    supplier: day.sightseeing?.supplier || "",
                    cost: Number(item.costAdult || 0) + Number(item.costChild || 0),
                    markup: Number(item.markupAdult || 0) + Number(item.markupChild || 0),
                    total: Number(item.total || 0),
                    sightseeingType: (item.type as FulfillmentServiceItem["sightseeingType"]) || "NA",
                });
            });
        }
        if (day.mealsItinerary?.items?.length) {
            day.mealsItinerary.items.forEach((item) => {
                meals.push({
                    id: uid(),
                    dayNumber: day.dayNumber,
                    label: item.meal || `Meals - Day ${day.dayNumber}`,
                    supplier: "",
                    cost: Number(item.cost || 0),
                    markup: 0,
                    total: Number(item.cost || 0),
                });
            });
        }
        if (day.visaItinerary?.items?.length) {
            day.visaItinerary.items.forEach((item) => {
                visa.push({
                    id: uid(),
                    dayNumber: day.dayNumber,
                    label: item.visaName || `Visa - Day ${day.dayNumber}`,
                    supplier: day.visaItinerary?.supplier || "",
                    cost: Number(item.total || 0),
                    markup: 0,
                    total: Number(item.total || 0),
                });
            });
        }
        if (day.others?.items?.length) {
            day.others.items.forEach((item) => {
                others.push({
                    id: uid(),
                    dayNumber: day.dayNumber,
                    label: item.serviceName || `Others - Day ${day.dayNumber}`,
                    supplier: day.others?.supplier || "",
                    cost: Number(item.total || 0),
                    markup: 0,
                    total: Number(item.total || 0),
                });
            });
        }
    });

    return { hotels, flights, transfers, sightseeings, meals, visa, others };
};

export const buildSupplierPaymentsFromServices = (
    fulfillment: FulfillmentData
): SupplierPaymentRow[] => {
    const allServices = [
        ...fulfillment.hotels,
        ...fulfillment.flights,
        ...fulfillment.transfers,
        ...fulfillment.sightseeings,
        ...fulfillment.meals,
        ...fulfillment.visa,
        ...fulfillment.others,
    ];

    const bySupplier = new Map<string, number>();
    allServices.forEach((item) => {
        const key = item.supplier || "Unassigned";
        bySupplier.set(key, (bySupplier.get(key) || 0) + Number(item.cost || 0));
    });

    return Array.from(bySupplier.entries()).map(([supplierName, serviceCost]) => ({
        id: uid(),
        supplierName,
        serviceCost,
        discount: 0,
        extra: 0,
        totalCost: serviceCost,
        paidAmount: 0,
        balance: serviceCost,
    }));
};

export const computeFulfillmentSummary = (
    booking: PackageBookingFormData,
    fulfillment: FulfillmentData
): FulfillmentSummary => {
    const oldCost =
        Number(booking.flightCost?.cost || 0) +
        Number(booking.visaCost?.cost || 0) +
        Number(booking.landPackageCost?.cost || 0);

    const allServices = [
        ...fulfillment.hotels,
        ...fulfillment.flights,
        ...fulfillment.transfers,
        ...fulfillment.sightseeings,
        ...fulfillment.meals,
        ...fulfillment.visa,
        ...fulfillment.others,
    ];
    const newCost = allServices.reduce((sum, item) => sum + Number(item.cost || 0), 0);

    const billedToCustomer = Number(
        booking.sellingPrice || booking.totalSalesPrice || 0
    );
    const supplierPaid = fulfillment.supplierPayments.reduce(
        (sum, row) => sum + Number(row.paidAmount || 0),
        0
    );
    const originalProfit = billedToCustomer - oldCost;
    const opsProfit = billedToCustomer - newCost;
    const netProfit = billedToCustomer - supplierPaid;

    const cashIn = Number(fulfillment.cashIn || booking.received || 0);
    const cashOut = Number(fulfillment.cashOut || supplierPaid);
    const netBalance = cashIn - cashOut;

    return {
        oldCost,
        newCost,
        billedToCustomer,
        opsProfit,
        originalProfit,
        netProfit,
        cashIn,
        cashOut,
        netBalance,
    };
};

export const buildFulfillmentFromBooking = (
    booking: PackageBookingFormData
): FulfillmentData => {
    const stored = booking.fulfillment as FulfillmentData | undefined;
    const extracted = extractServicesFromDays(booking.days || []);

    const base = defaultFulfillment();
    const travellers =
        stored?.travellers?.length
            ? stored.travellers
            : createTravellerRows(booking.travelers || 1);

    const merged: FulfillmentData = {
        ...base,
        ...stored,
        travellers,
        servicesIncluded: {
            ...base.servicesIncluded,
            ...(stored?.servicesIncluded || {}),
        },
        hotels: stored?.hotels?.length ? stored.hotels : extracted.hotels,
        flights: stored?.flights?.length ? stored.flights : extracted.flights,
        transfers: stored?.transfers?.length ? stored.transfers : extracted.transfers,
        sightseeings: stored?.sightseeings?.length
            ? stored.sightseeings
            : extracted.sightseeings,
        meals: stored?.meals?.length ? stored.meals : extracted.meals,
        visa: stored?.visa?.length ? stored.visa : extracted.visa,
        others: stored?.others?.length ? stored.others : extracted.others,
        cashIn: stored?.cashIn ?? Number(booking.received || 0),
    };

    if (!merged.supplierPayments.length) {
        merged.supplierPayments = buildSupplierPaymentsFromServices(merged);
    }

    return merged;
};

export const getPackageDisplayName = (booking: PackageBookingFormData) => {
    if (booking.masterPackageName) return booking.masterPackageName;
    return `trip details for ${getCustomerName(booking.customerDetails)}`;
};

export const getTravelDateRange = (booking: PackageBookingFormData) => {
    if (!booking.travelDate) return "—";
    const start = formatDisplayDate(booking.travelDate);
    if (!booking.noOfDays || booking.noOfDays <= 1) return start;
    const endDate = new Date(booking.travelDate);
    endDate.setDate(endDate.getDate() + booking.noOfDays - 1);
    const end = endDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    return `${start} - ${end}`;
};

export const getDestinationsList = (booking: PackageBookingFormData) => {
    if (booking.hotelStayCities?.length) {
        return booking.hotelStayCities.map((c) => c.cityName).filter(Boolean).join(", ");
    }
    return booking.goingTo || "";
};
