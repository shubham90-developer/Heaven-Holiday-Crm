export const TERMS_SECTIONS = [
  { key: "domesticHolidays", label: "Terms & Conditions (Domestic Holidays)" },
  { key: "internationalHolidays", label: "Terms & Conditions (International Holidays)" },
  { key: "cancellationPolicy", label: "Cancellation Policy (Domestic Holidays)" },
  { key: "cancellationPolicyInternational", label: "Cancellation Policy (International Holidays)" },
  { key: "inclusionsDomestic", label: "Inclusions (Domestic Holidays)" },
  { key: "inclusionsInternational", label: "Inclusions (International Holidays)" },
  { key: "exclusionsDomestic", label: "Exclusions (Domestic Holidays)" },
  { key: "exclusionsInternational", label: "Exclusions (International Holidays)" },
  { key: "generalInformationHolidays", label: "General information For Holidays" },
  { key: "bookingTermsHolidays", label: "Booking Terms For Holidays" },
  { key: "whyUseUsHolidays", label: "Why Use Us?(Holidays)" },
  { key: "paymentDetails", label: "Payment Details (Bank Info etc.)" },
  { key: "termsPaymentGateway", label: "Terms & Conditions For Payment Gateway" },
  { key: "bookingTermsVisa", label: "Booking Terms For Visa" },
  { key: "travelBasicsVisa", label: "Travel Basics For Visa" },
  { key: "termsVisa", label: "Terms & Conditions For Visa" },
  { key: "cancellationPolicyVisa", label: "Cancellation Policy For Visa" },
  { key: "refundPolicy", label: "Refund Policy" },
  { key: "termsHolidayVouchers", label: "Terms & Conditions for Holiday Vouchers" },
  { key: "termsInvoice", label: "Term & Conditions For Invoice" },
  { key: "termsTransferProposals", label: "Terms & Conditions for Transfer Proposals" },
  { key: "termsTransferVouchers", label: "Terms & Conditions for Transfer Vouchers" },
  { key: "termsFlightTickets", label: "Terms & Conditions for Flight Tickets" },
  { key: "termsSightseeingProposal", label: "Terms & Conditions for Sightseeing Proposal" },
  { key: "termsSightseeingVouchers", label: "Terms & Conditions for Sightseeing Vouchers" },
  { key: "termsHotelProposals", label: "Terms & Conditions for Hotel Proposals" },
  { key: "termsHotelVouchers", label: "Terms & Conditions for Hotel Vouchers" },
  { key: "termsForex", label: "Terms & Conditions for Forex" },
  { key: "termsFlightBooking", label: "Terms & Conditions for Flight Booking" },
  { key: "termsHotelBooking", label: "Terms & Conditions for Hotel Booking" },
] as const;

export type TermsSectionKey = (typeof TERMS_SECTIONS)[number]["key"];

export type TermsFormValues = Record<TermsSectionKey, string> & {
  defaultSelected: Record<TermsSectionKey, boolean>;
};

export const getEmptyTermsFormValues = (): TermsFormValues => {
  const values = {
    defaultSelected: {} as Record<TermsSectionKey, boolean>,
  } as TermsFormValues;

  TERMS_SECTIONS.forEach(({ key }) => {
    values[key] = "";
    values.defaultSelected[key] = true;
  });

  return values;
};

export const mapApiDataToFormValues = (data?: Record<string, unknown> | null): TermsFormValues => {
  const values = getEmptyTermsFormValues();
  if (!data) return values;

  const selected = (data.defaultSelected || {}) as Record<string, boolean>;

  TERMS_SECTIONS.forEach(({ key }) => {
    const value = data[key];
    values[key] = typeof value === "string" ? value : "";
    values.defaultSelected[key] =
      typeof selected[key] === "boolean" ? selected[key] : true;
  });

  return values;
};
