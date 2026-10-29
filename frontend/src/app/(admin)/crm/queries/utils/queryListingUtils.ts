import { formatPaxCountFromDetails } from "../../utils/paxDetails";

export const STAGE_OPTIONS = [
  { value: "", label: "Select Status" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "query_created", label: "Query Created" },
  { value: "interested", label: "Interested" },
  { value: "call_back", label: "Call Back" },
  { value: "follow_up", label: "Follow Up" },
  { value: "follow_up_changes", label: "Follow Up - Changes Required" },
  { value: "requirement", label: "Requirement" },
  { value: "destination_finalized", label: "Follow Up - Destination Finalized" },
  { value: "negotiation", label: "Follow Up - Negotiation" },
  { value: "visa_process", label: "Follow Up - Visa In Process" },
  { value: "proposal_requested", label: "Proposal Requested" },
  { value: "booking_requested", label: "Confirmed Booking Requested" },
  { value: "verbal_confirmed", label: "Verbal Confirmed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "lost_wrong_number", label: "Lost - Wrong Number" },
  { value: "lost_not_interested", label: "Lost - Not Interested" },
  { value: "lost_plan_changed", label: "Lost - Plan Changed" },
  { value: "lost_budget_issue", label: "Lost - Budget Issue" },
  { value: "lost_language_issue", label: "Lost - Language Issue" },
  { value: "lost_booked_elsewhere", label: "Lost - Booked Elsewhere" },
  { value: "lost_plan_postponed", label: "Lost - Plan Postponed" },
  { value: "lost_duplicate_lead", label: "Lost - Duplicate Lead" },
  { value: "lost_destination_changed", label: "Lost - Destination Changed" },
  { value: "lost_different_trip", label: "Lost - Different Trip Booked" },
  { value: "query_expired", label: "Query Expired" },
];

export const QUALITY_FILTERS = [
  { key: "archive", label: "Archive", variant: "secondary" },
  { key: "hot", label: "Hot", variant: "danger" },
  { key: "warm", label: "Warm", variant: "warning" },
  { key: "cold", label: "Cold", variant: "primary" },
  { key: "no_status", label: "No Status", variant: "dark" },
] as const;

export type QualityFilterKey = (typeof QUALITY_FILTERS)[number]["key"] | null;

const STAGE_LABELS: Record<string, string> = Object.fromEntries(
  STAGE_OPTIONS.filter((opt) => opt.value).map((opt) => [opt.value, opt.label])
);

export const formatListingDate = (dateStr?: string | Date) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

export const formatAgeDays = (dateStr?: string | Date) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 86_400_000)
  );
  if (days === 0) return "Today";
  return `${days} Day${days === 1 ? "" : "s"}`;
};

const detailsOf = (q: any) =>
  q?.packageDetails ??
  q?.flightDetails ??
  q?.transferDetails ??
  q?.visaDetails ??
  q?.hotelDetails ??
  q?.sightseeingDetails ??
  q?.miscellaneousDetails;

export const getFromDestination = (q: any): string => {
  const p = q?.packageDetails;
  if (p?.goingFrom) return p.goingFrom;
  const f = q?.flightDetails;
  if (f?.sourceCity) return f.sourceCity;
  const t = q?.transferDetails;
  if (t?.goingFrom) return t.goingFrom;
  if (t?.from) return t.from;
  return "";
};

export const getToDestination = (q: any): string => {
  const p = q?.packageDetails;
  if (p?.goingTo) return p.goingTo;
  const f = q?.flightDetails;
  if (f?.destinationCity) return f.destinationCity;
  const t = q?.transferDetails;
  if (t?.goingTo) return t.goingTo;
  if (t?.to) return t.to;
  const v = q?.visaDetails;
  if (v?.country) return v.country;
  const h = q?.hotelDetails;
  if (h?.destination) return h.destination;
  const s = q?.sightseeingDetails;
  if (s?.destination) return s.destination;
  const misc = q?.miscellaneousDetails;
  if (misc?.destination) return misc.destination;
  return "";
};

export const getDestination = (q: any): string => {
  const from = getFromDestination(q);
  const to = getToDestination(q);
  if (from && to) return `${from} → ${to}`;
  return to || from || "—";
};

export const getTravelDate = (q: any): string => {
  const candidates = [
    q?.packageDetails?.specificDate,
    q?.flightDetails?.departureDate,
    q?.transferDetails?.pickupDateTime ?? q?.transferDetails?.departureDate,
    q?.visaDetails?.dateOfTravel,
    q?.hotelDetails?.checkIn,
    q?.miscellaneousDetails?.date,
  ];
  const found = candidates.find(Boolean);
  return found ? formatListingDate(found) : "";
};

export const getPax = (q: any): string => {
  const d = detailsOf(q);
  if (!d) return "NA";
  const label = formatPaxCountFromDetails(d);
  return label === "N/A" ? "NA" : label;
};

export const getLeadSource = (q: any): string => {
  const d = detailsOf(q);
  return d?.leadSource || q?.leadSource || "";
};

export const getStageLabel = (stage?: string) => {
  if (!stage) return "";
  return STAGE_LABELS[stage] || stage;
};

export const getLeadQualityLabel = (quality?: string, archived?: boolean) => {
  if (archived) return "Archive";
  switch (quality) {
    case "hot":
      return "Hot";
    case "warm":
      return "Warm";
    case "cold":
      return "Cold";
    default:
      return "No Status";
  }
};

export const getQueryCode = (query: any) =>
  (query?.queryItemId ?? query?._id)?.toString().slice(-7).toUpperCase() ?? "";

export const getLeadId = (query: any): string => {
  const lead = query?.leadId;
  if (!lead) return "";
  if (typeof lead === "string") return lead;
  return lead._id || "";
};

export const matchesQuality = (query: any, filter: QualityFilterKey) => {
  const archived = Boolean(query?.isArchived);
  if (filter === "archive") return archived;
  if (archived) return false;
  if (!filter) return true;
  const quality = query?.leadQuality || "no_status";
  return quality === filter;
};

export const matchesSearch = (query: any, term: string) => {
  if (!term) return true;
  const lead = query?.leadId ?? {};
  const item = query?.queries?.[0];
  const haystack = [
    lead.firstName,
    lead.lastName,
    lead.name,
    lead.companyName,
    lead.email,
    lead.mobile,
    lead.phone,
    query?.assignedToSales?.name,
    item?.requirementType,
    getFromDestination(item),
    getToDestination(item),
    getQueryCode(query),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(term.toLowerCase());
};

const csvEscape = (value: unknown) => {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

export const CSV_HEADERS = [
  "Query Date/Age",
  "Query ID",
  "Name",
  "Company Name",
  "Mobile",
  "Email",
  "Type",
  "Description",
  "Travel Date",
  "No. of Pax",
  "From Destinations",
  "Destinations",
  "Proposal",
  "Query Stage",
  "Lead Quality",
  "Lead Source",
  "Lead Campaign",
  "Lead Medium",
  "Last Updated",
  "Is Archived",
  "Owner",
];

export const mapQueryToCsvRow = (query: any): string[] => {
  const lead = query.leadId ?? {};
  const item = query.queries?.[0];
  const createdAt = query.queryCreatedAt ?? item?.createdAt ?? query.createdAt;
  const updatedAt = query.queryUpdatedAt ?? item?.updatedAt ?? query.updatedAt;
  const date = formatListingDate(createdAt);
  const age = formatAgeDays(createdAt);
  const name =
    lead.name ||
    lead.contactPerson ||
    [lead.firstName, lead.lastName].filter(Boolean).join(" ") ||
    "";
  const type = query.leadModel === "B2BLead" ? "B2B" : "B2C";

  return [
    date && age ? `${date} - ${age}` : date || age,
    getQueryCode(query).replace(/\D/g, "") || getQueryCode(query),
    name,
    lead.companyName ?? lead.company ?? lead.personalInfo?.companyName ?? "",
    lead.phone ?? lead.mobile ?? "",
    lead.email ?? "",
    type,
    item?.requirementType ?? "",
    getTravelDate(item),
    getPax(item),
    getFromDestination(item),
    getToDestination(item),
    String(query.proposalCount ?? 0),
    getStageLabel(query.stage),
    getLeadQualityLabel(query.leadQuality, query.isArchived),
    getLeadSource(item),
    query.leadCampaign || "Default",
    query.leadMedium || "",
    formatListingDate(updatedAt),
    query.isArchived ? "Yes" : "",
    query.assignedToSales?.name ?? "",
  ];
};

export const buildQueriesCsv = (queries: any[]) => {
  const lines = [
    CSV_HEADERS.map(csvEscape).join(","),
    ...queries.map((query) => mapQueryToCsvRow(query).map(csvEscape).join(",")),
  ];
  return `\uFEFF${lines.join("\n")}`;
};

export const downloadCsvFile = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const tabToCategory = (tab: string) => {
  switch (tab) {
    case "inprocess":
      return "in-progress";
    case "confirmed":
      return "confirmed";
    case "rejected":
      return "rejected";
    case "unassigned":
      return "unassigned";
    case "callback":
      return "callback";
    case "recent":
      return "recent";
    default:
      return "overall";
  }
};
