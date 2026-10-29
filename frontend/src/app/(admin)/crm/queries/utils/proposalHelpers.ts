import { PackageBookingFormData, getCustomerName } from "../../../bookings/Packages/types/packageBooking";

export type ProposalBooking = PackageBookingFormData & {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
};

export const formatProposalDate = (value?: string | Date) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });
};

export const formatProposalAge = (value?: string | Date) => {
    if (!value) return "";
    const created = new Date(value).getTime();
    if (Number.isNaN(created)) return "";
    const diffMs = Math.max(Date.now() - created, 0);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours >= 48) {
        const days = Math.floor(hours / 24);
        return `${days}D ${hours % 24}H`;
    }
    return `${String(hours).padStart(2, "0")}H ${String(mins).padStart(2, "0")}M`;
};

export const formatProposalCode = (booking: ProposalBooking, index = 0) => {
    const yy = String(new Date().getFullYear()).slice(-2);
    const proposal = booking.proposalId || booking.enquiryId || "000000";
    return `QS/${yy}/${proposal}/V${index + 1}`;
};

export const formatQueryRef = (booking: ProposalBooking, queryCode?: string) => {
    if (queryCode) return `Q:${queryCode}`;
    const fromQuery = booking.queryId
        ? String(booking.queryId).slice(-7).toUpperCase()
        : "";
    if (fromQuery) return `Q:${fromQuery}`;
    return booking.enquiryId ? `Q:${booking.enquiryId}` : "";
};

export const formatTravelRange = (booking: ProposalBooking) => {
    const start = formatProposalDate(booking.travelDate);
    const endCity =
        booking.hotelStayCities?.[booking.hotelStayCities.length - 1]?.checkOut;
    const end = endCity
        ? formatProposalDate(endCity)
        : booking.noOfDays
          ? formatProposalDate(
                (() => {
                    if (!booking.travelDate) return "";
                    const d = new Date(booking.travelDate);
                    d.setDate(d.getDate() + Math.max(booking.noOfDays - 1, 0));
                    return d.toISOString().split("T")[0];
                })()
            )
          : "";
    if (start !== "—" && end && end !== "—") return `${start} - ${end}`;
    return start;
};

export const formatPackageType = (booking: ProposalBooking) => {
    if (booking.packageMode === "readymade") return "Readymade Package";
    return "Build Your Own Package";
};

export const formatOfferPrice = (booking: ProposalBooking) => {
    const currency = booking.currency || "INR";
    const amount = Number(booking.sellingPrice || booking.totalSalesPrice || 0);
    return `${currency} ${amount.toLocaleString("en-IN")}`;
};

export const formatProposalStage = (booking: ProposalBooking) => {
    if (booking.status === "confirmed") return "Confirmed";
    if (booking.status === "cancelled") return "Discarded";
    if (booking.status === "shared" || booking.bookingStage === "Proposal Shared") {
        return "Proposal Sent";
    }
    if (booking.bookingStage === "Booking Requested") return "Booking Requested";
    if (booking.paymentStatus === "pending") return "Payment Pending";
    if (booking.paymentStatus === "paid") return "Paid";
    return booking.bookingStage || booking.status || "Draft";
};

export const formatOwner = (booking: ProposalBooking) =>
    booking.owner ||
    booking.customerDetails?.rm ||
    getCustomerName(booking.customerDetails) ||
    "—";

export const formatDestination = (booking: ProposalBooking) => {
    const cities = (booking.hotelStayCities || [])
        .map((c) => c.cityName)
        .filter(Boolean);
    if (cities.length) return cities.join(", ");
    return booking.goingTo?.split("(")[0]?.trim() || booking.goingTo || "—";
};

export const PROPOSAL_SELECT_ACTIONS = [
    { value: "", label: "Select" },
    { value: "view", label: "View Proposal" },
    { value: "modify", label: "Modify Proposal" },
    { value: "resend", label: "Resend Proposal" },
    { value: "whatsapp", label: "Share on Whatsapp" },
    { value: "pdf", label: "Download PDF" },
    { value: "book", label: "Book" },
    { value: "discard", label: "Discard" },
] as const;

export type ProposalSelectAction =
    (typeof PROPOSAL_SELECT_ACTIONS)[number]["value"];
