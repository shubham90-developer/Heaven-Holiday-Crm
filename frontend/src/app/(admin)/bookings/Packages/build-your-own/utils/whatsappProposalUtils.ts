import {
    PackageBookingFormData,
    DayItinerary,
    formatDisplayDate,
    getCustomerName,
} from "../../types/packageBooking";

const COMPANY = {
    name: "A HEAVEN HOSPITALITY PVT LTD",
    shortName: "A Heaven Holiday",
    phone: "+91 8602410707",
    phoneDigits: "8602410707",
    accountName: "AHEAVEN HOSPITALITY PVT LTD",
    bankName: "YES BANK",
    branch: "SHIVAJI PARK",
    accountNumber: "004363300003005",
    ifsc: "YESB0000043",
    googlePay: "9960793700",
    phonePay: "9960793700",
};

const DEFAULT_CANCELLATION = `In the event of cancellation of tour / travel services due to any avoidable / unavoidable reason/s we must be notified of the same in writing. Cancellation charges will be effective from the date we receive advice in writing, and cancellation charges would be as follows:

If you Cancel your Tour (cancellation Charges as per person)

121 To 900 or more days before: 10% of the total amount
91 to 120 days before: 15% of the total amount
61 To 90 days before: 20% of the total amount
46 To 60 days before: 30% of the total amount
31 To 45 days before: 40% of the total amount
16 To 30 days before: 50% of the total amount
11 To 15 days before: 75% of the total amount
0 To 10 days before: 100% (full amount applicable, no refund).`;

const DEFAULT_TERMS = `All correspondence(s) in respect of Tours/Travel Service bookings should be addressed to a Heaven holiday.

Payments: For all the services contracted, certain advance payment should be made to hold the booking, on confirmed basis & the balance amount can be paid before 45 days of your departure. In case if tour is booked within 45 days of the departure date, guests must make full payment of the tour price at the time of booking itself. When you pay the advance amount, it means you accept our terms and conditions.

Customer Confirmation Policy: Once a booking form is sent to the customer via SMS or WhatsApp, the customer is requested to review all details. If no corrections or objections are received within 24 hours, the booking details will be considered correct and confirmed.

Note: Written cancellation will accept on all working days, except Sunday, any cancellation sent on Sunday's will be considered on next working day (Monday).
For the X-mas and new year period from 20 Dec to 05 Jan the payment is non-refundable.
For unused hotel accommodation, chartered transportation & missed meals etc. we do not bear any responsibility to refund.

Wildlife Safaris cancellation: All the wildlife safaris booked into any of Indian Wildlife National Park/Sanctuaries are non-refundable.

Our Liabilities & Limitations: Please note that after the finalization of the Tour/service Cost, if there are any Hike in entrance fees monuments/museums, Taxes, fuel cost or guide charges-by Govt. of India, the same would be charged as extra.
A Heaven Holiday act only in the capacity of agent for the hotels, airlines, transporters, railways & contractors providing other services & all exchange orders, receipts, contracts & tickets issued by us are issued subject to terms & conditions under which these services are provided by them.
All itineraries are sample itineraries, intended to give you a general idea of the likely trip schedule. Numerous factors such as weather, road conditions, the physical ability of the participants etc. may dictate itinerary changes either before the tour or while on the trail. We reserve the right to change any schedule in the interest of the trip participants' safety, comfort & general wellbeing.

Please Note: We will not be responsible for any costs arising out of unforeseen circumstances like landslides, road blocks, bad weather, Natural Disaster etc.
As per airline rule A heaven holiday is not responsible for any additional costs due to delay in flight or cancellation of flight or missed the flight.`;

const DEFAULT_REFUND = `Refund Policy

Thank you for your interest in ${COMPANY.name}. If you have any questions, wish to make changes to the itinerary or confirm this booking please call us at ${COMPANY.phone}`;

const addDays = (dateStr: string, days: number) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
};

const stripHtml = (html?: string) =>
    (html || "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<\/div>/gi, "\n")
        .replace(/<\/li>/gi, "\n")
        .replace(/<li[^>]*>/gi, "• ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&rsquo;/gi, "'")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/gi, '"')
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]+/g, " ")
        .trim();

const formatMoney = (currency: string, amount: number) =>
    `${currency} ${Number(amount || 0).toLocaleString("en-IN")}`;

/** e.g. Thu, 12 Nov, 2026 */
const formatLongWeekdayDate = (dateStr?: string) => {
    if (!dateStr) return "NA";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

/** e.g. 12-Nov-26 */
const formatDayHeaderDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    const dd = String(date.getDate()).padStart(2, "0");
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const yy = String(date.getFullYear()).slice(-2);
    return `${dd}-${months[date.getMonth()]}-${yy}`;
};

const buildQueryCode = (booking: PackageBookingFormData) => {
    const yy = String(new Date().getFullYear()).slice(-2);
    const proposal = booking.proposalId || booking.enquiryId || "000000";
    const enquiry = booking.enquiryId || booking.proposalId || "000000";
    return `QS/${yy}/${proposal} (${enquiry})`;
};

const getDestinationsCovered = (booking: PackageBookingFormData) => {
    const cities = (booking.hotelStayCities || [])
        .map((c) => c.cityName?.trim())
        .filter(Boolean);
    if (cities.length) return cities.join(", ");

    const dayLocations = (booking.days || [])
        .map((d) => d.location?.trim())
        .filter(Boolean);
    const unique = [...new Set(dayLocations)];
    if (unique.length) return unique.join(", ");

    return (
        booking.goingTo?.split("(")[0]?.trim() ||
        booking.endDestination ||
        "NA"
    );
};

const getMealLine = (day: DayItinerary) => {
    const meals: string[] = [];
    if (day.meals?.breakfast) meals.push("Breakfast");
    if (day.meals?.lunch) meals.push("Lunch");
    if (day.meals?.dinner) meals.push("Dinner");

    if (day.mealsItinerary?.items?.length) {
        day.mealsItinerary.items.forEach((item) => {
            if (item.meal && !meals.includes(item.meal)) {
                meals.push(item.meal);
            }
        });
    }

    return meals.length ? meals.join(", ") : "";
};

const getSightseeingLine = (day: DayItinerary) => {
    const names: string[] = [];

    if (day.sightseeing?.items?.length) {
        day.sightseeing.items.forEach((item) => {
            if (item.name?.trim()) names.push(item.name.trim());
        });
    }

    if (day.sightseeing?.sightseeing?.trim()) {
        names.push(day.sightseeing.sightseeing.trim());
    }

    if (day.sightseeing?.destinationCovered?.trim()) {
        names.push(day.sightseeing.destinationCovered.trim());
    }

    const unique = [...new Set(names.filter(Boolean))];
    return unique.length ? unique.join(", ") : "";
};

const getDayTitle = (day: DayItinerary, booking: PackageBookingFormData) => {
    if (day.title?.trim()) return day.title.trim();
    if (day.location?.trim()) return day.location.trim();

    const from = booking.goingFrom?.split("(")[0]?.trim();
    const to = booking.goingTo?.split("(")[0]?.trim();
    if (day.dayNumber === 1 && from && to) return `${from} to ${to}`;
    return `Day ${day.dayNumber}`;
};

const getDayDescription = (day: DayItinerary) => {
    const parts: string[] = [];

    if (day.description?.trim()) {
        parts.push(stripHtml(day.description));
    }

    if (day.flight) {
        const f = day.flight;
        const flightBits = [
            f.airline,
            f.flightNo,
            f.departureAirport && f.arrivalAirport
                ? `${f.departureAirport} → ${f.arrivalAirport}`
                : "",
            f.departureDate ? formatDisplayDate(f.departureDate) : "",
        ].filter(Boolean);
        if (flightBits.length) parts.push(`Flight: ${flightBits.join(" | ")}`);
    }

    if (day.accommodation) {
        const a = day.accommodation;
        const hotelBits = [
            a.hotelName,
            a.city,
            a.checkIn ? `Check-in ${formatDisplayDate(a.checkIn)}` : "",
            a.nights ? `${a.nights} night(s)` : "",
        ].filter(Boolean);
        if (hotelBits.length) parts.push(`Stay: ${hotelBits.join(" | ")}`);
    }

    if (day.transport) {
        const t = day.transport;
        const vehicleName = t.vehicles?.[0]?.vehicleName;
        const transferBits = [
            vehicleName || t.transportMode,
            t.pickupCity && t.dropCity ? `${t.pickupCity} → ${t.dropCity}` : "",
            t.pickupLocation && t.dropLocation
                ? `${t.pickupLocation} → ${t.dropLocation}`
                : "",
        ].filter(Boolean);
        if (transferBits.length) parts.push(`Transfer: ${transferBits.join(" | ")}`);
    }

    return parts.filter(Boolean).join("\n\n") || "Itinerary details will be shared.";
};

const buildItinerarySection = (booking: PackageBookingFormData) => {
    const days =
        booking.days?.length > 0
            ? [...booking.days].sort((a, b) => a.dayNumber - b.dayNumber)
            : [];

    if (!days.length) {
        const totalDays = Math.max(booking.noOfDays || 1, 1);
        return Array.from({ length: totalDays }, (_, i) => {
            const dayDate = addDays(booking.travelDate, i);
            return `Day ${i + 1}: ${formatDayHeaderDate(dayDate)}\t${
                booking.goingTo?.split("(")[0]?.trim() || "Destination"
            }\n\nItinerary details will be updated.`;
        }).join("\n\n\n");
    }

    return days
        .map((day) => {
            const dayDate =
                day.date || addDays(booking.travelDate, day.dayNumber - 1);
            const title = getDayTitle(day, booking);
            const description = getDayDescription(day);
            const sightseeing = getSightseeingLine(day);
            const meals = getMealLine(day);

            const lines = [
                `Day ${day.dayNumber}: ${formatDayHeaderDate(dayDate)}\t${title}`,
                "",
                description,
            ];

            if (sightseeing) {
                lines.push("");
                lines.push(
                    `Sightseeing(s): ${sightseeing} | (click here to view package details)`
                );
            }

            if (meals) {
                lines.push("");
                lines.push(`Meal: ${meals}`);
            }

            return lines.join("\n");
        })
        .join("\n\n\n");
};

const sectionOrFallback = (value: string | undefined, fallback: string) => {
    const cleaned = stripHtml(value);
    return cleaned || fallback;
};

export type WhatsAppProposalOptions = {
    customerFirstName?: string;
    customerLastName?: string;
    taxIncl?: boolean;
    tripManagerName?: string;
    tripManagerPhone?: string;
    proposalType?: "summary" | "detailed";
    viewDetailsUrl?: string;
};

/**
 * Builds a WhatsApp-ready plain-text proposal message from package booking data.
 */
export const buildWhatsAppProposalMessage = (
    booking: PackageBookingFormData,
    options: WhatsAppProposalOptions = {}
): string => {
    const customerName =
        [options.customerFirstName, options.customerLastName]
            .filter(Boolean)
            .join(" ")
            .trim() ||
        getCustomerName(booking.customerDetails) ||
        "Guest";

    const tripManager =
        options.tripManagerName ||
        booking.owner ||
        booking.customerDetails?.rm ||
        "RAJENDRA BUGADE";
    const tripManagerPhone = options.tripManagerPhone || COMPANY.phone;

    const destination =
        booking.goingTo?.split("(")[0]?.trim() ||
        booking.goingTo ||
        "your destination";
    const startCity =
        booking.goingFrom?.split("(")[0]?.trim() ||
        booking.goingFrom ||
        "NA";
    const totalDays = Math.max(booking.noOfDays || booking.days?.length || 1, 1);
    const nights = Math.max(totalDays - 1, 0);
    const travelers = Number(booking.travelers || 1);
    const currency = booking.currency || "INR";
    const packagePrice = Number(
        booking.sellingPrice || booking.totalSalesPrice || 0
    );
    const taxIncl = options.taxIncl !== false;
    const endDate =
        booking.hotelStayCities?.[booking.hotelStayCities.length - 1]?.checkOut ||
        addDays(booking.travelDate, Math.max(totalDays - 1, 0));
    const destinationsCovered = getDestinationsCovered(booking);
    const queryCode = buildQueryCode(booking);
    const viewUrl =
        options.viewDetailsUrl ||
        `https://heavenholidays.in/proposal/${booking.proposalId || booking._id || ""}`;

    const priceLabel = taxIncl
        ? `Package Price (Incl. GST) = ${formatMoney(currency, packagePrice)}`
        : `Package Price (Excl. GST) = ${formatMoney(currency, packagePrice)}`;

    const inclusions = sectionOrFallback(
        booking.terms?.inclusions,
        "Hotel nights accommodation as per itinerary\nMeals as mentioned in the itinerary\nTransfers and sightseeing as per the itinerary"
    );
    const exclusions = sectionOrFallback(
        booking.terms?.exclusions,
        "GST if not mentioned in the rates\nLunch during the tour (unless mentioned)\nPersonal expenses\nAnything not mentioned under Package Inclusions\nEntrance fees at monuments (unless mentioned)"
    );
    const bookingTerms = sectionOrFallback(
        booking.terms?.bookingTerms,
        `${booking.advanceRequiredPercent || 75}% advance to be paid at the time of booking.\nAir fare is calculated at the time of proposal creation and is subject to change at the time of booking.\n100% payment within 7 Days of booking date.\nIn case of cancellation standard cancellation policies will be applicable.`
    );
    const cancellation = sectionOrFallback(
        booking.terms?.cancellationPolicy,
        DEFAULT_CANCELLATION
    );
    const terms = sectionOrFallback(
        booking.terms?.termsAndConditions,
        DEFAULT_TERMS
    );
    const refund = sectionOrFallback(booking.terms?.refundPolicy, DEFAULT_REFUND);

    const header = [
        `Dear ${customerName},`,
        `This is ${tripManager} and I will be working with you to plan your trip to ${destination}.`,
        `Please find below details for your trip and feel free to call me at ${tripManagerPhone} or click here to view more details about this trip.`,
        "",
        "Query Details",
        `#Code :\t${queryCode}\tTotal Guests :\t${travelers}`,
        `No. of Nights :\t${nights} Nights & ${totalDays} Days\tChild :\t0`,
        `Start City :\t${startCity}\tStart Date:\t${formatLongWeekdayDate(booking.travelDate)}`,
        `Destination covered :\t${destinationsCovered}\tEnd Date :\t${formatLongWeekdayDate(endDate)}`,
        "",
        "",
        "",
        priceLabel,
        "Click here to view details and book now",
        viewUrl,
    ].join("\n");

    const itinerary =
        options.proposalType === "summary"
            ? [
                  "",
                  "Itinerary Summary",
                  "",
                  ...(booking.days?.length
                      ? [...booking.days]
                            .sort((a, b) => a.dayNumber - b.dayNumber)
                            .map((day) => {
                                const dayDate =
                                    day.date ||
                                    addDays(booking.travelDate, day.dayNumber - 1);
                                return `Day ${day.dayNumber}: ${formatDayHeaderDate(dayDate)} — ${getDayTitle(day, booking)}`;
                            })
                      : [`${nights} Nights / ${totalDays} Days ${destination} package`]),
              ].join("\n")
            : ["", "Itinerary Details", "", buildItinerarySection(booking)].join(
                  "\n"
              );

    const footer = [
        "",
        "INCLUSIONS",
        inclusions,
        "",
        "EXCLUSIONS",
        exclusions,
        "",
        "PAYMENT DETAILS",
        `Payment needs to be made in the company name ${COMPANY.name} you can deposit cheque or DD in our current account as below:`,
        "",
        `Account Name: ${COMPANY.accountName}`,
        "",
        `Bank Name: ${COMPANY.bankName}`,
        "",
        `Branch: ${COMPANY.branch}`,
        "",
        `Account Number: ${COMPANY.accountNumber}`,
        "",
        `IFSC CODE : ${COMPANY.ifsc}`,
        "",
        `GOOGLE PAY : ${COMPANY.googlePay}`,
        "",
        `PHONE PAY : ${COMPANY.phonePay}`,
        "",
        "BOOKING TERMS",
        bookingTerms,
        "",
        "CANCELLATION POLICY",
        cancellation,
        "",
        "TERMS AND CONDITIONS",
        terms,
        "",
        "REFUND POLICY",
        refund,
        "",
        "Your personal trip manager,",
        "",
        tripManager,
        tripManagerPhone,
        "",
        "",
        COMPANY.name,
        "\tTechnology By - ATIS",
    ].join("\n");

    return `${header}\n${itinerary}\n${footer}`.trim();
};
