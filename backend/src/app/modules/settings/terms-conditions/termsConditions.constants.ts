export const TERMS_CONDITION_KEYS = [
    "domesticHolidays",
    "internationalHolidays",
    "cancellationPolicy",
    "cancellationPolicyInternational",
    "inclusionsDomestic",
    "inclusionsInternational",
    "exclusionsDomestic",
    "exclusionsInternational",
    "generalInformationHolidays",
    "bookingTermsHolidays",
    "whyUseUsHolidays",
    "paymentDetails",
    "termsPaymentGateway",
    "bookingTermsVisa",
    "travelBasicsVisa",
    "termsVisa",
    "cancellationPolicyVisa",
    "refundPolicy",
    "termsHolidayVouchers",
    "termsInvoice",
    "termsTransferProposals",
    "termsTransferVouchers",
    "termsFlightTickets",
    "termsSightseeingProposal",
    "termsSightseeingVouchers",
    "termsHotelProposals",
    "termsHotelVouchers",
    "termsForex",
    "termsFlightBooking",
    "termsHotelBooking",
] as const;

export type TermsConditionKey = (typeof TERMS_CONDITION_KEYS)[number];

export const buildEmptyTerms = () => {
    const content = Object.fromEntries(
        TERMS_CONDITION_KEYS.map((key) => [key, ""])
    ) as Record<TermsConditionKey, string>;

    const defaultSelected = Object.fromEntries(
        TERMS_CONDITION_KEYS.map((key) => [key, true])
    ) as Record<TermsConditionKey, boolean>;

    return { ...content, defaultSelected };
};

export const normalizeTermsDocument = (doc: unknown) => {
    const empty = buildEmptyTerms();
    if (!doc || typeof doc !== "object") return empty;

    const raw =
        typeof (doc as { toObject?: () => Record<string, unknown> }).toObject === "function"
            ? (doc as { toObject: () => Record<string, unknown> }).toObject()
            : (doc as Record<string, unknown>);

    const defaultSelected = {
        ...empty.defaultSelected,
        ...((raw.defaultSelected as Record<string, boolean> | undefined) || {}),
    };

    const content = { ...empty };

    for (const key of TERMS_CONDITION_KEYS) {
        const value = raw[key];
        if (typeof value === "string") {
            content[key] = value;
        } else if (
            value &&
            typeof value === "object" &&
            typeof (value as { content?: unknown }).content === "string"
        ) {
            const section = value as { content: string; defaultSelected?: boolean };
            content[key] = section.content;
            if (typeof section.defaultSelected === "boolean") {
                defaultSelected[key] = section.defaultSelected;
            }
        }
    }

    return { ...raw, ...content, defaultSelected };
};
