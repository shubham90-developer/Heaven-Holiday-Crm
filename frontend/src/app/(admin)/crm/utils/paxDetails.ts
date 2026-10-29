export const PAX_FIELDS = [
  { label: "ADULTS (Twin sharing)", key: "twinSharing" },
  { label: "ADULTS (Triple sharing)", key: "tripleSharing" },
  { label: "ADULTS (Single occupancy)", key: "singleOccupancy" },
  { label: "ADULTS (Quad occupancy)", key: "quadOccupancy" },
  { label: "ADULTS (Quint occupancy)", key: "quintOccupancy" },
  { label: "ADULTS (Hexa occupancy)", key: "hexaOccupancy" },
  { label: "CHILD (WITH BED (2 - 11YRS))", key: "childWithBed" },
  { label: "CHILD (W/O BED (2 - 11YRS))", key: "childWithoutBed" },
  { label: "INFANT (0 - 2YRS)", key: "infant" },
] as const;

export type PaxFieldKey = (typeof PAX_FIELDS)[number]["key"];

export type PaxDetails = Record<PaxFieldKey, number>;

export const ADULT_PAX_KEYS: PaxFieldKey[] = [
  "twinSharing",
  "tripleSharing",
  "singleOccupancy",
  "quadOccupancy",
  "quintOccupancy",
  "hexaOccupancy",
];

export const emptyPaxDetails = (): PaxDetails =>
  Object.fromEntries(PAX_FIELDS.map((field) => [field.key, 0])) as PaxDetails;

export const defaultPaxDetails = (): PaxDetails => ({
  ...emptyPaxDetails(),
  twinSharing: 2,
});

export const paxTotal = (pax?: Partial<PaxDetails> | null) =>
  PAX_FIELDS.reduce((sum, field) => sum + (Number(pax?.[field.key]) || 0), 0);

export const adultCountFromPax = (pax?: Partial<PaxDetails> | null) =>
  ADULT_PAX_KEYS.reduce((sum, key) => sum + (Number(pax?.[key]) || 0), 0);

export const normalizePaxDetails = (
  paxDetails?: Partial<PaxDetails> | null,
  travelers?: number,
  options?: { fallbackTwin?: number }
): PaxDetails => {
  const next = emptyPaxDetails();
  if (paxDetails && typeof paxDetails === "object") {
    PAX_FIELDS.forEach(({ key }) => {
      next[key] = Math.max(0, Number(paxDetails[key]) || 0);
    });
  }
  if (paxTotal(next) > 0) return next;

  const total = Math.max(0, Number(travelers) || 0);
  if (total > 0) {
    next.twinSharing = total;
    return next;
  }

  if (options?.fallbackTwin) {
    next.twinSharing = options.fallbackTwin;
  }
  return next;
};

const childCount = (pax: PaxDetails) =>
  (Number(pax.childWithBed) || 0) + (Number(pax.childWithoutBed) || 0);

export const formatPaxCountLabel = (
  paxDetails?: Partial<PaxDetails> | null,
  travelers?: number
): string => {
  const pax = normalizePaxDetails(paxDetails, travelers);
  const adults = adultCountFromPax(pax);
  const children = childCount(pax);
  const infants = Number(pax.infant) || 0;
  if (!adults && !children && !infants) return "N/A";

  const parts = [`${adults} Adult${adults === 1 ? "" : "s"}`];
  if (children) parts.push(`${children} Child`);
  if (infants) parts.push(`${infants} Infant`);
  return parts.join(", ");
};

export const formatRoomLabel = (
  paxDetails?: Partial<PaxDetails> | null,
  travelers?: number
): string => {
  const adults = adultCountFromPax(normalizePaxDetails(paxDetails, travelers));
  if (!adults) return "N/A";
  return `1 [Adults: ${adults}]`;
};

export const formatPaxEnquirySummary = (
  paxDetails?: Partial<PaxDetails> | null,
  travelers?: number
): string => {
  const pax = normalizePaxDetails(paxDetails, travelers);
  const adults = adultCountFromPax(pax);
  const children = childCount(pax);
  const infants = Number(pax.infant) || 0;
  if (!adults && !children && !infants) return "";

  const head = [`Adults: ${adults}`];
  if (children) head.push(`${children} Child`);
  if (infants) head.push(`${infants} Infant`);
  return `${head.join(", ")}\nRoom 1: Adults: ${adults}`;
};

export const detailsFromQueryItem = (item: any = {}) =>
  item?.packageDetails ||
  item?.flightDetails ||
  item?.transferDetails ||
  item?.visaDetails ||
  item?.hotelDetails ||
  item?.sightseeingDetails ||
  item?.miscellaneousDetails ||
  {};

export const formatPaxCountFromDetails = (details: any = {}): string => {
  if (!details || typeof details !== "object") return "N/A";
  if (details.paxDetails || details.travelers != null) {
    return formatPaxCountLabel(details.paxDetails, details.travelers);
  }
  if (details.adults != null) {
    const parts = [
      `${details.adults} Adult${Number(details.adults) === 1 ? "" : "s"}`,
    ];
    if (details.children) parts.push(`${details.children} Child`);
    if (details.infants) parts.push(`${details.infants} Infant`);
    return parts.join(", ");
  }
  if (details.count != null) return `${details.count} Traveler(s)`;
  return "N/A";
};
