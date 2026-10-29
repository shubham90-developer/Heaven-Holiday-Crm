"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useGetQueryByIdQuery } from "@/store/services/queriesApi";
import { useGetCompanyProfileQuery } from "@/store/services/settings/company-profile/companyProfileApi";
import { useGetBankDetailsQuery } from "@/store/services/settings/company-profile/bankDetailsApi";
import { useGetTermsConditionsQuery } from "@/store/services/settings/terms-and-conditions/termsConditionsApi";
import { useGenerateProposalContentMutation } from "@/store/services/proposalApi";
import QueryDetailSection, { QueryPrefill } from "./components/QueryDetailSection";
import HotelAndActivitiesSection from "./components/HotelAndActivitiesSection";
import TransportFlightVisaSection from "./components/TransportFlightVisaSection";
import type { FlightProposalSnapshot } from "./components/FlightDetailsPanel";
import PricingAndItemsSection from "./components/PricingAndItemsSection";
import PolicySections from "./components/PolicySections";
import ProposalPreviewModal from "./components/ProposalPreviewModal";
import { SUPPLIER_TYPES } from "./supplierTypes";
import {
  CustomProposalFormSnapshot,
  CustomProposalPdfModel,
  PdfFlightLeg,
  PdfPolicies,
  buildCustomProposalPdfHtml,
  downloadCustomProposalPdf,
} from "./utils/customProposalPdf";
import "./create-custom-proposal.scss";
import defaultCompanyLogo from "@/assets/images/logo.png";
import {
  adultCountFromPax,
  formatPaxEnquirySummary,
  normalizePaxDetails,
} from "../../../../utils/paxDetails";

const defaultLogoSrc =
  typeof defaultCompanyLogo === "string"
    ? defaultCompanyLogo
    : defaultCompanyLogo.src;

const resolveCompanyLogo = (raw?: unknown) => {
  const stored = typeof raw === "string" ? raw.trim() : "";
  const src = stored || defaultLogoSrc;
  if (!src) return undefined;
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith("/uploads")) {
    const api = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    return api ? `${api}${src}` : src;
  }
  if (src.startsWith("/") && typeof window !== "undefined") {
    return `${window.location.origin}${src}`;
  }
  return src;
};

const embedImageSrc = async (src?: string) => {
  if (!src || src.startsWith("data:")) return src;
  try {
    const response = await fetch(src);
    if (!response.ok) return src;
    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || src));
      reader.onerror = () => resolve(src);
      reader.readAsDataURL(blob);
    });
  } catch {
    return src;
  }
};

const addDays = (dateStr: string, days: number) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const addDaysIso = (dateStr: string, days: number) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (date?: string | Date | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const parsePrice = (value?: string) => {
  const numbers = (value || "")
    .match(/[\d,]+(?:\.\d+)?/g)
    ?.map((item) => Number(item.replace(/,/g, "")))
    .filter((item) => Number.isFinite(item) && item > 0) || [];
  if (!numbers.length) return 0;
  if (numbers.length === 1) return numbers[0];
  return (numbers[0] + numbers[1]) / 2;
};

const joinAddress = (address?: {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  pinCode?: string;
}) =>
  [
    address?.addressLine1,
    address?.addressLine2,
    address?.city,
    address?.country,
    address?.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

const stripHtml = (html?: string) =>
  (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const EMPTY_SNAPSHOT: CustomProposalFormSnapshot = {
  hotels: [],
  hotelTotal: 0,
  days: [],
  flights: [],
  flightTotal: 0,
};

const segmentHasFlightDetails = (
  segment?: FlightProposalSnapshot["outbound"]
) =>
  Boolean(
    segment?.airlineName?.trim() ||
      segment?.airlineNo?.trim() ||
      segment?.fareClass?.trim() ||
      Number(segment?.costPP) > 0
  );

const mapPackageFlightSnapshot = (
  snapshot: FlightProposalSnapshot | null
): PdfFlightLeg[] => {
  if (!snapshot) return [];
  const mapLeg = (segment: FlightProposalSnapshot["outbound"]): PdfFlightLeg => ({
    airlineName: segment.airlineName,
    airlineNo: segment.airlineNo,
    departureDate: segment.departureDate,
    arrivalDate: segment.arrivalDate,
    from: segment.from,
    to: segment.to,
    stops: segment.stops,
  });
  const outboundReady = segmentHasFlightDetails(snapshot.outbound);
  const inboundReady =
    snapshot.tripType === "Round Trip" &&
    segmentHasFlightDetails(snapshot.inbound);
  if (!outboundReady && !inboundReady) return [];
  const legs: PdfFlightLeg[] = [];
  if (outboundReady) legs.push(mapLeg(snapshot.outbound));
  if (inboundReady) legs.push(mapLeg(snapshot.inbound));
  return legs;
};

const EMPTY_POLICIES: PdfPolicies = {
  notes: "",
  inclusions: "",
  exclusions: "",
  cancellationPolicy: "",
  termsAndConditions: "",
  bookingTerms: "",
  paymentTerms: "",
};

const CreateCustomProposal = () => {
  const params = useParams();
  const queryId = params?.id as string;

  const { data: queryResponse, isLoading, isError } = useGetQueryByIdQuery(
    queryId,
    { skip: !queryId }
  );
  const { data: companyResponse } = useGetCompanyProfileQuery(undefined);
  const { data: bankResponse } = useGetBankDetailsQuery(undefined);
  const { data: termsResponse } = useGetTermsConditionsQuery(null);
  const [generateProposalContent, { isLoading: generating }] =
    useGenerateProposalContentMutation();

  const query = queryResponse?.data;
  const lead = query?.leadId || {};
  const firstQuery = query?.queries?.[0] || {};
  const packageDetails = firstQuery?.packageDetails || {};

  const [overview, setOverview] = useState("");
  const [destinationsCovered, setDestinationsCovered] = useState("");
  const [packageSupplier, setPackageSupplier] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [supplierType, setSupplierType] = useState<string>(
    SUPPLIER_TYPES.THIRD_PARTY_PACKAGE
  );
  const [dayWiseItinerary, setDayWiseItinerary] = useState(true);
  const [proposalData, setProposalData] =
    useState<CustomProposalFormSnapshot>(EMPTY_SNAPSHOT);
  const [packageFlightSnapshot, setPackageFlightSnapshot] =
    useState<FlightProposalSnapshot | null>(null);
  const [policies, setPolicies] = useState<PdfPolicies>(EMPTY_POLICIES);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    if (packageDetails.goingTo) {
      setDestinationsCovered(packageDetails.goingTo);
    }
  }, [packageDetails.goingTo]);

  const prefill: QueryPrefill | null = useMemo(() => {
    if (!query) return null;

    const travelDate = packageDetails.specificDate || "";
    const nights = Number(packageDetails.noOfDays) || 2;
    const pax = normalizePaxDetails(
      packageDetails.paxDetails,
      packageDetails.travelers
    );
    const adults =
      adultCountFromPax(pax) || Number(packageDetails.travelers) || 2;
    const paxSummary = formatPaxEnquirySummary(
      packageDetails.paxDetails,
      packageDetails.travelers
    );
    const customerName = [
      lead?.salutation,
      lead?.firstName,
      lead?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || "Customer";

    return {
      queryId,
      customerName,
      enquiryId: query._id?.slice(-7)?.toUpperCase() || "N/A",
      enquiryFor: firstQuery?.requirementType || "Package",
      checkIn: formatDate(travelDate),
      checkInRaw: travelDate ? String(travelDate).split("T")[0] : "",
      checkOut: travelDate ? addDays(travelDate, nights) : "",
      noOfNights: nights,
      destination: packageDetails.goingTo || "N/A",
      adults,
      paxSummary:
        paxSummary || `Adults: ${adults}\nRoom 1: Adults: ${adults}`,
      goingFrom: packageDetails.goingFrom || "NA",
      priceRange: packageDetails.priceRange || "NA",
      hotel: packageDetails.hotelPreference
        ? `${packageDetails.hotelPreference} Star`
        : "3 Star",
      food: packageDetails.foodPreference || "NA",
      inclusions: packageDetails.inclusions || "Hotel, All Meals, Gala Dinner",
      themes: packageDetails.theme || "NA",
      remark: packageDetails.remark || firstQuery?.remark || "",
      leadType: query?.leadModel === "B2BLead" ? "B2B" : "B2C",
    };
  }, [query, queryId, lead, firstQuery, packageDetails]);

  const itineraryDays = useMemo(() => {
    const startDate = packageDetails.specificDate
      ? new Date(packageDetails.specificDate)
      : new Date();
    const count = Number(packageDetails.noOfDays) || 2;

    return Array.from({ length: count }, (_, index) => {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + index);
      const label = dayDate.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return { dayNumber: index + 1, label };
    });
  }, [packageDetails]);

  const buildPdfModel = (ai?: CustomProposalPdfModel["ai"]): CustomProposalPdfModel | null => {
    if (!prefill) return null;

    const dests = destinationsCovered || prefill.destination;
    const destList = dests
      .split(/[,/|]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    const mainDest = destList[0] || dests;
    const from = (prefill.goingFrom || "").replace(/^NA$/i, "").trim() || "Origin";
    const profile = companyResponse?.data?.data || companyResponse?.data;
    const banks = bankResponse?.data?.data || bankResponse?.data || [];
    const bank =
      (Array.isArray(banks) ? banks : []).find(
        (item: { isActive?: boolean }) => item.isActive
      ) || (Array.isArray(banks) ? banks[0] : {}) || {};
    const terms = termsResponse?.data?.data || termsResponse?.data || {};
    const isInternational = !/india|bharat/i.test(`${dests} ${prefill.destination}`);

    const days =
      proposalData.days.length > 0
        ? proposalData.days
        : itineraryDays.map((day, index) => ({
            dayNumber: day.dayNumber,
            label: day.label,
            city: destList[Math.min(index, destList.length - 1)] || mainDest,
            title: index === 0 ? `${from} TO ${mainDest}` : `${mainDest} SIGHTSEEING`,
            description: "",
          }));

    const packageFlights = mapPackageFlightSnapshot(packageFlightSnapshot);
    let flights: PdfFlightLeg[] = packageFlights.length
      ? packageFlights
      : proposalData.flights.filter(
          (leg) => leg.from || leg.to || leg.airlineName
        );
    if (!flights.length && prefill.checkInRaw) {
      const returnDate = addDaysIso(prefill.checkInRaw, prefill.noOfNights);
      flights = [
        {
          airlineName: "",
          airlineNo: "",
          departureDate: `${prefill.checkInRaw}T00:55`,
          arrivalDate: `${prefill.checkInRaw}T06:50`,
          from,
          to: mainDest,
          stops: "Non Stop",
        },
        {
          airlineName: "",
          airlineNo: "",
          departureDate: `${returnDate}T21:05`,
          arrivalDate: `${returnDate}T23:50`,
          from: destList[destList.length - 1] || mainDest,
          to: from,
          stops: "Non Stop",
        },
      ];
    }

    const adults = Math.max(1, prefill.adults);
    const hotelTotal = Number(proposalData.hotelTotal) || 0;
    const flightTotal = packageFlights.length
      ? Number(packageFlightSnapshot?.totalCost) || 0
      : Number(proposalData.flightTotal) || 0;
    const pricedTotal = hotelTotal + flightTotal;
    const rangePrice = parsePrice(prefill.priceRange);
    const totalCost =
      pricedTotal > 0 ? pricedTotal : rangePrice > 0 ? rangePrice * adults : 0;
    const pricePerPerson = adults ? totalCost / adults : totalCost;
    const gstAmount = totalCost * 0.05;
    const consultantName =
      query?.assignedToSales?.name ||
      [profile?.personalDetails?.firstName, profile?.personalDetails?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      "Consultant";
    const consultantPhone =
      profile?.personalDetails?.mobileNumber ||
      profile?.companyDetails?.companyNumber ||
      "";
    const companyLogo = resolveCompanyLogo(profile?.companyDetails?.companyLogo);

    const mergedPolicies: PdfPolicies = {
      notes: policies.notes || "",
      inclusions:
        policies.inclusions ||
        (isInternational ? terms.inclusionsInternational : terms.inclusionsDomestic) ||
        "",
      exclusions:
        policies.exclusions ||
        (isInternational ? terms.exclusionsInternational : terms.exclusionsDomestic) ||
        "",
      cancellationPolicy:
        policies.cancellationPolicy ||
        (isInternational
          ? terms.cancellationPolicyInternational
          : terms.cancellationPolicy) ||
        "",
      termsAndConditions:
        policies.termsAndConditions ||
        (isInternational ? terms.internationalHolidays : terms.domesticHolidays) ||
        "",
      bookingTerms: policies.bookingTerms || terms.bookingTermsHolidays || "",
      paymentTerms: policies.paymentTerms || terms.termsPaymentGateway || "",
    };

    return {
      customerName: prefill.customerName,
      destinations: dests,
      goingFrom: from,
      checkIn: prefill.checkIn,
      checkOut: prefill.checkOut,
      nights: prefill.noOfNights,
      daysCount: itineraryDays.length || prefill.noOfNights + 1,
      adults,
      currency,
      overview,
      hotels: proposalData.hotels,
      flights,
      days,
      policies: mergedPolicies,
      companyName:
        profile?.companyDetails?.companyName || "A HEAVEN HOSPITALITY PVT LTD",
      consultantName,
      consultantPhone,
      companyLogo,
      companyAddress: joinAddress(profile?.companyDetails?.registeredAddress),
      companyEmail:
        profile?.companyDetails?.companyEmail || profile?.personalDetails?.email || "",
      companyWebsite:
        profile?.moreAboutCompany?.socialLinks?.google ||
        "https://www.aheavenholiday.in/",
      companyPhone: consultantPhone,
      bank: {
        accountHolderName: bank.accountHolderName,
        bankName: bank.bankName,
        branch: bank.branch,
        accountNumber: bank.accountNumber,
        ifscCode: bank.ifscCode,
      },
      googlePay: consultantPhone,
      phonePay: consultantPhone,
      pricePerPerson,
      totalCost,
      gstAmount,
      grandTotal: totalCost + gstAmount,
      ai,
    };
  };

  const handleViewProposal = async () => {
    const base = buildPdfModel();
    if (!base) return;

    setPreviewOpen(true);
    setPreviewHtml("");

    try {
      const result = await generateProposalContent({
        customerName: base.customerName,
        goingFrom: base.goingFrom,
        destinations: base.destinations
          .split(/[,/|]+/)
          .map((item: string) => item.trim())
          .filter(Boolean),
        nights: base.nights,
        days: base.daysCount,
        adults: base.adults,
        travelDate: prefill?.checkInRaw,
        overview: stripHtml(overview),
        hotels: base.hotels.map((hotel) => ({
          city: hotel.hotelCity,
          hotelName: hotel.hotelName,
          nights: hotel.nights,
        })),
        sightseeing: base.days
          .map((day) => day.sicSightseeing || day.pvtSightseeing || day.title)
          .filter(Boolean),
        dayTitles: base.days.map((day) => ({
          dayNumber: day.dayNumber,
          title: day.title,
          city: day.city,
          date: day.label,
        })),
      }).unwrap();

      const ai = result?.data;
      const model = buildPdfModel(
        ai
          ? {
              coverImageUrl: ai.coverImageUrl,
              days: ai.days,
              activities: ai.activities,
            }
          : undefined
      ) as CustomProposalPdfModel;
      setPreviewHtml(
        buildCustomProposalPdfHtml({
          ...model,
          companyLogo: await embedImageSrc(model.companyLogo),
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Could not generate AI content. Showing proposal from form data.");
      setPreviewHtml(
        buildCustomProposalPdfHtml({
          ...base,
          companyLogo: await embedImageSrc(base.companyLogo),
        })
      );
    }
  };

  const handleDownload = () => {
    if (!previewHtml) return;
    try {
      downloadCustomProposalPdf(
        previewHtml,
        `${prefill?.customerName || "proposal"}-trip-proposal.pdf`
      );
    } catch (error: any) {
      toast.error(error?.message || "Unable to open the PDF print dialog.");
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading proposal form...</div>;
  }

  if (isError || !query || !prefill) {
    return (
      <div className="p-4 text-danger text-center">
        Failed to load query details for custom proposal.
      </div>
    );
  }

  return (
    <div className="create-custom-proposal pb-5">
      <QueryDetailSection
        data={prefill}
        overview={overview}
        onOverviewChange={setOverview}
        destinationsCovered={destinationsCovered}
        onDestinationsChange={setDestinationsCovered}
        packageSupplier={packageSupplier}
        onPackageSupplierChange={setPackageSupplier}
        currency={currency}
        onCurrencyChange={setCurrency}
        supplierType={supplierType}
        onSupplierTypeChange={setSupplierType}
        dayWiseItinerary={dayWiseItinerary}
        onDayWiseItineraryChange={setDayWiseItinerary}
      />

      <HotelAndActivitiesSection
        checkIn={prefill.checkIn}
        checkInRaw={prefill.checkInRaw}
        adults={prefill.adults}
        days={itineraryDays}
        supplierType={supplierType}
        destinationsCovered={destinationsCovered}
        currency={currency}
        noOfNights={prefill.noOfNights}
        goingFrom={prefill.goingFrom}
        onProposalDataChange={setProposalData}
      />

      <TransportFlightVisaSection
        adults={prefill.adults}
        checkInRaw={prefill.checkInRaw}
        currency={currency}
        destinationsCovered={destinationsCovered}
        goingFrom={prefill.goingFrom}
        onFlightSnapshotChange={setPackageFlightSnapshot}
      />

      <PricingAndItemsSection />

      <PolicySections onPoliciesChange={setPolicies} />

      <div className="ccp-footer-actions">
        <button type="button" className="ccp-outline-orange-btn">
          Save as Draft
        </button>
        <button
          type="button"
          className="ccp-orange-btn"
          onClick={handleViewProposal}
          disabled={generating}
        >
          {generating ? "Generating..." : "View & Share Proposal"}
        </button>
      </div>

      <ProposalPreviewModal
        open={previewOpen}
        loading={generating && !previewHtml}
        html={previewHtml}
        onClose={() => setPreviewOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default CreateCustomProposal;
