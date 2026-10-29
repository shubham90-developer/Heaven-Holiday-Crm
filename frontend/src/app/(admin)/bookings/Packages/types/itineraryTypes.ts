export type ItineraryTypeOption =
    | "Flight"
    | "Transport"
    | "Accommodation"
    | "Sightseeings"
    | "Cruise"
    | "Guide"
    | "Meals"
    | "Visa"
    | "Others";

export interface FlightPaxRow {
    paxType: string;
    noOfPax: number;
    currency: string;
    pricePerPax: number;
    markupPerPax: number;
    taxType: string;
    taxAmt: number;
    total: number;
}

export interface FlightItinerary {
    inputMode: string;
    supplier: string;
    tripType: string;
    airline: string;
    flightNo: string;
    refundableStatus: string;
    departureAirport: string;
    departureDate: string;
    departureTime: string;
    stop: string;
    stopOver: string;
    arrivalAirport: string;
    arrivalDate: string;
    arrivalTime: string;
    duration: string;
    showBaggageDetails: boolean;
    adultCabin: number;
    adultCheckIn: number;
    childCabin: number;
    childCheckIn: number;
    infantCabin: number;
    infantCheckIn: number;
    paxRows: FlightPaxRow[];
    total: number;
    totalMarkup: number;
    totalTax: number;
    finalPrice: number;
}

export interface TransportVehicleRow {
    vehicleName: string;
    ac: string;
    currency: string;
    noOfVehicle: number;
    capacity: string;
    totalCostPerVehicle: number;
    totalMarkupPerVehicle: number;
    total: number;
}

export interface TransportItinerary {
    pickupCity: string;
    pickupLocation: string;
    pickupDate: string;
    pickupTime: string;
    duration: string;
    dropCity: string;
    dropLocation: string;
    dropDate: string;
    dropTime: string;
    remark: string;
    transportMode: string;
    supplier: string;
    vehicles: TransportVehicleRow[];
    totalDays: number;
    totalPrice: number;
    totalMarkup: number;
    finalPrice: number;
}

export interface AccommodationRoomRow {
    roomType: string;
    mealPlan: string;
    noOfRooms: number;
    noOfAdult: number;
    costPerNight: number;
    extraBedAdult: number;
    extraBedCost: number;
    hotelTax: string;
    totalCost: number;
}

export interface AccommodationItinerary {
    hotelName: string;
    inventoryHotel: boolean;
    currency: string;
    supplier: string;
    checkIn: string;
    nights: number;
    city: string;
    rooms: AccommodationRoomRow[];
    totalCost: number;
    markupType: string;
    markup: number;
    finalPrice: number;
}

export interface SightseeingItemRow {
    type: string;
    adult: number;
    child: number;
    name: string;
    time: string;
    currency: string;
    costAdult: number;
    costChild: number;
    markupAdult: number;
    markupChild: number;
    optional: boolean;
    supplier: string;
    total: number;
}

export interface SightseeingItinerary {
    supplier: string;
    destinationCovered: string;
    sightseeing: string;
    showOptionalSection: boolean;
    items: SightseeingItemRow[];
}

export interface CruiseCabinRow {
    cabin: string;
    noOfCabin: number;
    mealPlan: string;
    adults: number;
    kids: number;
    currency: string;
    priceAdult: number;
    priceChild: number;
    markupPP: number;
    total: number;
}

export interface CruiseItinerary {
    supplier: string;
    startCity: string;
    embarkPort: string;
    departureDate: string;
    departureTime: string;
    shipline: string;
    shiplineNumber: string;
    endCity: string;
    debarkPort: string;
    arrivalDate: string;
    arrivalTime: string;
    duration: string;
    cabins: CruiseCabinRow[];
    total: number;
    totalMarkup: number;
    finalPrice: number;
}

export interface GuideItinerary {
    supplier: string;
    guideName: string;
    currency: string;
    totalCost: number;
}

export interface MealsRow {
    meal: string;
    type: string;
    options: string;
    currency: string;
    cost: number;
}

export interface MealsItinerary {
    items: MealsRow[];
    totalCost: number;
}

export interface VisaRow {
    adultPax: number;
    childPax: number;
    infantPax: number;
    visaName: string;
    rate: string;
    currency: string;
    costAdult: number;
    costChild: number;
    costInfant: number;
    total: number;
    comment: string;
}

export interface VisaItinerary {
    supplier: string;
    items: VisaRow[];
    totalCost: number;
}

export interface OthersRow {
    adultPax: number;
    childPax: number;
    infantPax: number;
    serviceName: string;
    serviceType: string;
    rate: string;
    currency: string;
    costAdult: number;
    costChild: number;
    costInfant: number;
    total: number;
    comment: string;
}

export interface OthersItinerary {
    supplier: string;
    items: OthersRow[];
    totalCost: number;
}

export const defaultFlightPaxRow = (noOfPax = 2): FlightPaxRow => ({
    paxType: "Adult",
    noOfPax,
    currency: "INR",
    pricePerPax: 0,
    markupPerPax: 0,
    taxType: "On Markup",
    taxAmt: 0,
    total: 0,
});

export const computeFlightTotals = (data: FlightItinerary): FlightItinerary => {
    const paxRows = data.paxRows.map((row) => {
        const total =
            (Number(row.pricePerPax) +
                Number(row.markupPerPax) +
                Number(row.taxAmt)) *
            Number(row.noOfPax);
        return { ...row, total };
    });

    const total = paxRows.reduce((sum, row) => sum + row.total, 0);
    const totalMarkup = paxRows.reduce(
        (sum, row) => sum + Number(row.markupPerPax) * Number(row.noOfPax),
        0
    );
    const totalTax = paxRows.reduce(
        (sum, row) => sum + Number(row.taxAmt) * Number(row.noOfPax),
        0
    );

    return {
        ...data,
        paxRows,
        total,
        totalMarkup,
        totalTax,
        finalPrice: total,
    };
};

export const defaultFlightItinerary = (
    travelers = 2,
    departureDate = "",
    goingFrom = "",
    goingTo = ""
): FlightItinerary =>
    computeFlightTotals({
        inputMode: "Detailed",
        supplier: "",
        tripType: "One Way",
        airline: "",
        flightNo: "",
        refundableStatus: "Non Refundable",
        departureAirport: goingFrom,
        departureDate,
        departureTime: "",
        stop: "Non Stop",
        stopOver: "",
        arrivalAirport: goingTo,
        arrivalDate: departureDate,
        arrivalTime: "",
        duration: "",
        showBaggageDetails: true,
        adultCabin: 7,
        adultCheckIn: 15,
        childCabin: 7,
        childCheckIn: 15,
        infantCabin: 0,
        infantCheckIn: 0,
        paxRows: [defaultFlightPaxRow(travelers)],
        total: 0,
        totalMarkup: 0,
        totalTax: 0,
        finalPrice: 0,
    });

export const computeTransportTotals = (
    data: TransportItinerary
): TransportItinerary => {
    const vehicles = data.vehicles.map((row) => ({
        ...row,
        total:
            (Number(row.totalCostPerVehicle) + Number(row.totalMarkupPerVehicle)) *
            Number(row.noOfVehicle),
    }));

    const totalPrice = vehicles.reduce((sum, row) => sum + row.total, 0);
    const totalMarkup = vehicles.reduce(
        (sum, row) =>
            sum + Number(row.totalMarkupPerVehicle) * Number(row.noOfVehicle),
        0
    );

    return {
        ...data,
        vehicles,
        totalPrice,
        totalMarkup,
        finalPrice: totalPrice,
    };
};

export const defaultTransportVehicleRow = (): TransportVehicleRow => ({
    vehicleName: "",
    ac: "Yes",
    currency: "INR",
    noOfVehicle: 1,
    capacity: "",
    totalCostPerVehicle: 0,
    totalMarkupPerVehicle: 0,
    total: 0,
});

export const defaultTransportItinerary = (
    pickupCity = "",
    pickupDate = "",
    dropDate = ""
): TransportItinerary =>
    computeTransportTotals({
        pickupCity,
        pickupLocation: "",
        pickupDate,
        pickupTime: "",
        duration: "0 D 0 H 0 M",
        dropCity: "",
        dropLocation: "",
        dropDate,
        dropTime: "",
        remark: "",
        transportMode: "Normal",
        supplier: "",
        vehicles: [defaultTransportVehicleRow()],
        totalDays: 1,
        totalPrice: 0,
        totalMarkup: 0,
        finalPrice: 0,
    });

export const computeAccommodationTotals = (
    data: AccommodationItinerary
): AccommodationItinerary => {
    const rooms = data.rooms.map((row) => {
        const roomCost =
            Number(row.costPerNight) * Number(row.noOfRooms) * Number(data.nights || 1);
        const extraCost =
            Number(row.extraBedCost) * Number(row.extraBedAdult) * Number(data.nights || 1);
        return { ...row, totalCost: roomCost + extraCost };
    });

    const totalCost = rooms.reduce((sum, row) => sum + row.totalCost, 0);
    const finalPrice = totalCost + Number(data.markup || 0);

    return { ...data, rooms, totalCost, finalPrice };
};

export const defaultAccommodationRoomRow = (noOfAdult = 2): AccommodationRoomRow => ({
    roomType: "Standard",
    mealPlan: "CP",
    noOfRooms: 1,
    noOfAdult,
    costPerNight: 0,
    extraBedAdult: 0,
    extraBedCost: 0,
    hotelTax: "Included",
    totalCost: 0,
});

export const defaultAccommodationItinerary = (
    city = "",
    checkIn = "",
    nights = 1,
    noOfAdult = 2
): AccommodationItinerary =>
    computeAccommodationTotals({
        hotelName: "",
        inventoryHotel: false,
        currency: "INR",
        supplier: "",
        checkIn,
        nights,
        city,
        rooms: [defaultAccommodationRoomRow(noOfAdult)],
        totalCost: 0,
        markupType: "Fixed",
        markup: 0,
        finalPrice: 0,
    });

export const computeSightseeingItemTotal = (row: SightseeingItemRow) => {
    const adultTotal =
        (Number(row.costAdult) + Number(row.markupAdult)) * Number(row.adult);
    const childTotal =
        (Number(row.costChild) + Number(row.markupChild)) * Number(row.child);
    return adultTotal + childTotal;
};

export const defaultSightseeingItemRow = (adult = 2): SightseeingItemRow => ({
    type: "SIC",
    adult,
    child: 0,
    name: "",
    time: "",
    currency: "INR",
    costAdult: 0,
    costChild: 0,
    markupAdult: 0,
    markupChild: 0,
    optional: false,
    supplier: "",
    total: 0,
});

export const defaultSightseeingItinerary = (
    destination = "",
    adult = 2
): SightseeingItinerary => ({
    supplier: "",
    destinationCovered: destination,
    sightseeing: "",
    showOptionalSection: true,
    items: [defaultSightseeingItemRow(adult)],
});

export const computeCruiseCabinTotal = (row: CruiseCabinRow) => {
    const paxTotal =
        Number(row.priceAdult) * Number(row.adults) +
        Number(row.priceChild) * Number(row.kids) +
        Number(row.markupPP) * (Number(row.adults) + Number(row.kids));
    return paxTotal * Number(row.noOfCabin);
};

export const computeCruiseTotals = (data: CruiseItinerary): CruiseItinerary => {
    const cabins = data.cabins.map((row) => ({
        ...row,
        total: computeCruiseCabinTotal(row),
    }));
    const total = cabins.reduce((sum, row) => sum + row.total, 0);
    const totalMarkup = cabins.reduce(
        (sum, row) =>
            sum +
            Number(row.markupPP) *
                (Number(row.adults) + Number(row.kids)) *
                Number(row.noOfCabin),
        0
    );
    return { ...data, cabins, total, totalMarkup, finalPrice: total };
};

export const defaultCruiseCabinRow = (adults = 2): CruiseCabinRow => ({
    cabin: "",
    noOfCabin: 1,
    mealPlan: "EP",
    adults,
    kids: 0,
    currency: "INR",
    priceAdult: 0,
    priceChild: 0,
    markupPP: 0,
    total: 0,
});

export const defaultCruiseItinerary = (
    goingFrom = "",
    goingTo = "",
    travelDate = "",
    travelers = 2
): CruiseItinerary =>
    computeCruiseTotals({
        supplier: "",
        startCity: goingFrom,
        embarkPort: "",
        departureDate: travelDate,
        departureTime: "",
        shipline: "",
        shiplineNumber: "",
        endCity: goingTo,
        debarkPort: "",
        arrivalDate: travelDate,
        arrivalTime: "",
        duration: "",
        cabins: [defaultCruiseCabinRow(travelers)],
        total: 0,
        totalMarkup: 0,
        finalPrice: 0,
    });

export const defaultGuideItinerary = (): GuideItinerary => ({
    supplier: "",
    guideName: "",
    currency: "INR",
    totalCost: 0,
});

export const computeMealsTotals = (data: MealsItinerary): MealsItinerary => ({
    ...data,
    totalCost: data.items.reduce((sum, row) => sum + Number(row.cost || 0), 0),
});

export const defaultMealsRow = (): MealsRow => ({
    meal: "",
    type: "",
    options: "",
    currency: "INR",
    cost: 0,
});

export const defaultMealsItinerary = (): MealsItinerary =>
    computeMealsTotals({ items: [defaultMealsRow()], totalCost: 0 });

export const computePaxRowTotal = (row: {
    adultPax: number;
    childPax: number;
    infantPax: number;
    costAdult: number;
    costChild: number;
    costInfant: number;
}) =>
    Number(row.adultPax) * Number(row.costAdult) +
    Number(row.childPax) * Number(row.costChild) +
    Number(row.infantPax) * Number(row.costInfant);

export const computeVisaTotals = (data: VisaItinerary): VisaItinerary => {
    const items = data.items.map((row) => ({
        ...row,
        total: computePaxRowTotal(row),
    }));
    return {
        ...data,
        items,
        totalCost: items.reduce((sum, row) => sum + row.total, 0),
    };
};

export const defaultVisaRow = (travelers = 2): VisaRow => ({
    adultPax: travelers,
    childPax: 0,
    infantPax: 0,
    visaName: "",
    rate: "Per Pax",
    currency: "INR",
    costAdult: 0,
    costChild: 0,
    costInfant: 0,
    total: 0,
    comment: "",
});

export const defaultVisaItinerary = (travelers = 2): VisaItinerary =>
    computeVisaTotals({
        supplier: "",
        items: [defaultVisaRow(travelers)],
        totalCost: 0,
    });

export const computeOthersTotals = (data: OthersItinerary): OthersItinerary => {
    const items = data.items.map((row) => ({
        ...row,
        total: computePaxRowTotal(row),
    }));
    return {
        ...data,
        items,
        totalCost: items.reduce((sum, row) => sum + row.total, 0),
    };
};

export const defaultOthersRow = (travelers = 2): OthersRow => ({
    adultPax: travelers,
    childPax: 0,
    infantPax: 0,
    serviceName: "",
    serviceType: "",
    rate: "Per Pax",
    currency: "INR",
    costAdult: 0,
    costChild: 0,
    costInfant: 0,
    total: 0,
    comment: "",
});

export const defaultOthersItinerary = (travelers = 2): OthersItinerary =>
    computeOthersTotals({
        supplier: "",
        items: [defaultOthersRow(travelers)],
        totalCost: 0,
    });

export const ITINERARY_TYPES: ItineraryTypeOption[] = [
    "Flight",
    "Transport",
    "Accommodation",
    "Sightseeings",
    "Cruise",
    "Guide",
    "Meals",
    "Visa",
    "Others",
];

export const IMPLEMENTED_ITINERARY_TYPES: ItineraryTypeOption[] = [
    "Flight",
    "Transport",
    "Accommodation",
    "Sightseeings",
    "Cruise",
    "Guide",
    "Meals",
    "Visa",
    "Others",
];
