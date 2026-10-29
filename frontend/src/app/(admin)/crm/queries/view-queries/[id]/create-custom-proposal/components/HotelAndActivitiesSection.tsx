"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetSightseeingQuery } from "@/store/services/inventory/sightseeing/sightSeeingApi";
import {
  useCreateItineraryMutation,
  useGetItinerariesQuery,
} from "@/store/services/inventory/itinerary-description/itineraryDescriptionApi";
import CollapsibleSection from "./CollapsibleSection";
import HotelOptionSection, { HotelOption } from "./HotelOptionSection";
import ProposalRichTextEditor from "./ProposalRichTextEditor";
import {
  FlightDetailsPanel,
  GuideDetailsPanel,
  ITINERARY_PANELS,
  ItineraryPanelKey,
  MealDetailsPanel,
  SightseeingPanel,
  TransferDetailsPanel,
} from "./DayItineraryPanels";
import type { FlightProposalSnapshot } from "./FlightDetailsPanel";
import type {
  CustomProposalFormSnapshot,
  PdfDay,
  PdfFlightLeg,
  PdfHotelCity,
} from "../utils/customProposalPdf";

type HotelAndActivitiesProps = {
  checkIn: string;
  checkInRaw?: string;
  adults: number;
  days: { dayNumber: number; label: string }[];
  supplierType: string;
  destinationsCovered: string;
  currency: string;
  noOfNights: number;
  goingFrom?: string;
  onProposalDataChange?: (data: CustomProposalFormSnapshot) => void;
};

type DayItineraryState = {
  title: string;
  saveAsMaster: boolean;
  description: string;
  sicSightseeing: string;
  pvtSightseeing: string;
};

type SightseeingRecord = {
  _id: string;
  sightseeingName?: string;
  city?: string;
};

type MasterItinerary = {
  _id: string;
  title?: string;
  startCity?: string;
  destinationCity?: string;
};

const panelKey = (dayNumber: number, panel: ItineraryPanelKey) =>
  `${dayNumber}-${panel}`;

const parseDestinations = (value: string) =>
  value
    .split(/[,/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const buildDayTitle = (from: string, city: string) => {
  const start = (from || "").replace(/^NA$/i, "").trim();
  const dest = (city || "").trim();
  if (start && dest) return `${start} TO ${dest}`.toUpperCase();
  return dest.toUpperCase();
};

const cityMatches = (left: string, right: string) => {
  if (!left || !right) return true;
  const a = left.split("(")[0].trim().toLowerCase();
  const b = right.split("(")[0].trim().toLowerCase();
  return a === b || a.includes(b) || b.includes(a);
};

const DayItineraryContent = ({
  dayNumber,
  city,
  goingFrom,
  checkIn,
  checkInRaw,
  adults,
  itinerary,
  onItineraryChange,
  sightseeingOptions,
  masterTitles,
  openPanels,
  onTogglePanel,
  onFlightSnapshotChange,
}: {
  dayNumber: number;
  city: string;
  goingFrom: string;
  checkIn: string;
  checkInRaw?: string;
  adults: number;
  itinerary: DayItineraryState;
  onItineraryChange: (patch: Partial<DayItineraryState>) => void;
  sightseeingOptions: SightseeingRecord[];
  masterTitles: MasterItinerary[];
  openPanels: Record<string, boolean>;
  onTogglePanel: (dayNumber: number, panel: ItineraryPanelKey) => void;
  onFlightSnapshotChange?: (snapshot: FlightProposalSnapshot) => void;
}) => {
  const [itineraryExpanded, setItineraryExpanded] = useState(true);
  const [createItinerary, { isLoading: savingMaster }] =
    useCreateItineraryMutation();
  const isOpen = (panel: ItineraryPanelKey) =>
    Boolean(openPanels[panelKey(dayNumber, panel)]);

  const handleSaveAsMaster = async (checked: boolean) => {
    if (!checked) {
      onItineraryChange({ saveAsMaster: false });
      return;
    }

    const title = itinerary.title.trim();
    if (!title) {
      toast.error("Enter an itinerary title first");
      return;
    }

    try {
      await createItinerary({
        startCity: goingFrom.replace(/^NA$/i, "").trim() || city || "NA",
        destinationCity: city || "NA",
        title: title.slice(0, 100),
      }).unwrap();
      onItineraryChange({ saveAsMaster: true });
      toast.success("Saved as master itinerary");
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
          ? String((error.data as { message?: string }).message)
          : "Failed to save itinerary";
      toast.error(message);
    }
  };

  return (
    <div className="border border-top-0">
      <div
        className="ccp-itinerary-subheader"
        onClick={() => setItineraryExpanded(!itineraryExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setItineraryExpanded(!itineraryExpanded);
          }
        }}
      >
        <span>Itinerary Details</span>
        <IconifyIcon
          icon={
            itineraryExpanded ? "mdi:chevron-up" : "mdi:chevron-down"
          }
        />
      </div>

      {itineraryExpanded && (
        <div className="p-3">
          <div className="ccp-itinerary-title-row">
            <Form.Control
              size="sm"
              className="ccp-input ccp-itinerary-title-input"
              list={`day-${dayNumber}-master-titles`}
              placeholder="Day title"
              value={itinerary.title}
              maxLength={100}
              onChange={(e) =>
                onItineraryChange({
                  title: e.target.value,
                  saveAsMaster: false,
                })
              }
            />
            <datalist id={`day-${dayNumber}-master-titles`}>
              {masterTitles.map((item) => (
                <option key={item._id} value={item.title || ""} />
              ))}
            </datalist>
            <Form.Check
              type="checkbox"
              id={`day-${dayNumber}-save-master`}
              label="Save as Master"
              checked={itinerary.saveAsMaster}
              disabled={savingMaster}
              onChange={(e) => handleSaveAsMaster(e.target.checked)}
              className="ccp-save-master-check mb-0"
            />
          </div>

          <div className="mb-3">
            <ProposalRichTextEditor
              value={itinerary.description}
              onChange={(value) => onItineraryChange({ description: value })}
              placeholder="Write the day itinerary description..."
              minHeight={140}
            />
          </div>

          <Row className="g-2 mb-3">
            <Col md={6}>
              <label className="ccp-field-label">SIC Sightseeings</label>
              <Form.Control
                size="sm"
                className="ccp-input"
                list={`day-${dayNumber}-sic-sightseeing`}
                placeholder="Type or select sightseeing"
                value={itinerary.sicSightseeing}
                onChange={(e) =>
                  onItineraryChange({ sicSightseeing: e.target.value })
                }
              />
              <datalist id={`day-${dayNumber}-sic-sightseeing`}>
                {sightseeingOptions.map((item) => (
                  <option
                    key={`sic-${item._id}`}
                    value={item.sightseeingName || ""}
                  />
                ))}
              </datalist>
            </Col>
            <Col md={6}>
              <label className="ccp-field-label">PVT Sightseeings</label>
              <Form.Control
                size="sm"
                className="ccp-input"
                list={`day-${dayNumber}-pvt-sightseeing`}
                placeholder="Type or select sightseeing"
                value={itinerary.pvtSightseeing}
                onChange={(e) =>
                  onItineraryChange({ pvtSightseeing: e.target.value })
                }
              />
              <datalist id={`day-${dayNumber}-pvt-sightseeing`}>
                {sightseeingOptions.map((item) => (
                  <option
                    key={`pvt-${item._id}`}
                    value={item.sightseeingName || ""}
                  />
                ))}
              </datalist>
            </Col>
          </Row>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {ITINERARY_PANELS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`ccp-action-pill ${isOpen(item.key) ? "active" : ""}`}
                onClick={() => onTogglePanel(dayNumber, item.key)}
              >
                {item.label} <span className="tag">{item.tag}</span>
              </button>
            ))}
          </div>

          <div className="d-flex flex-column gap-2">
            {isOpen("flight") && (
              <FlightDetailsPanel
                adults={adults}
                goingFrom={goingFrom}
                goingTo={city}
                checkIn={checkInRaw || checkIn}
                onSnapshotChange={onFlightSnapshotChange}
              />
            )}
            {isOpen("transfer") && (
              <TransferDetailsPanel checkIn={checkIn} />
            )}
            {isOpen("sightseeing") && (
              <SightseeingPanel
                adults={adults}
                options={sightseeingOptions}
                listId={`day-${dayNumber}-paid-sightseeing`}
              />
            )}
            {isOpen("meal") && <MealDetailsPanel adults={adults} />}
            {isOpen("guide") && <GuideDetailsPanel />}
          </div>
        </div>
      )}
    </div>
  );
};

const mapFlightLeg = (segment: FlightProposalSnapshot["outbound"]): PdfFlightLeg => ({
  airlineName: segment.airlineName,
  airlineNo: segment.airlineNo,
  departureDate: segment.departureDate,
  arrivalDate: segment.arrivalDate,
  from: segment.from,
  to: segment.to,
  stops: segment.stops,
});

const HotelAndActivitiesSection = ({
  checkIn,
  checkInRaw,
  adults,
  days,
  supplierType,
  destinationsCovered,
  currency,
  noOfNights,
  goingFrom = "",
  onProposalDataChange,
}: HotelAndActivitiesProps) => {
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
  });
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});
  const [dayItineraries, setDayItineraries] = useState<
    Record<number, DayItineraryState>
  >({});
  const [hotelOptions, setHotelOptions] = useState<HotelOption[]>([]);
  const [flightsByDay, setFlightsByDay] = useState<
    Record<number, PdfFlightLeg[]>
  >({});
  const [flightTotal, setFlightTotal] = useState(0);
  const onProposalDataChangeRef = useRef(onProposalDataChange);
  onProposalDataChangeRef.current = onProposalDataChange;

  const { data: sightseeingResponse } = useGetSightseeingQuery({});
  const { data: itinerariesResponse } = useGetItinerariesQuery({});

  const sightseeings: SightseeingRecord[] = sightseeingResponse?.data || [];
  const masterTitles: MasterItinerary[] = itinerariesResponse?.data || [];

  const daysWithCity = useMemo(() => {
    const dests = parseDestinations(destinationsCovered);
    return days.map((day, index) => ({
      ...day,
      city: dests.length ? dests[Math.min(index, dests.length - 1)] : "",
    }));
  }, [days, destinationsCovered]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const togglePanel = (dayNumber: number, panel: ItineraryPanelKey) => {
    const key = panelKey(dayNumber, panel);
    setOpenPanels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAllDays = () => {
    const allExpanded = days.reduce(
      (acc, day) => ({ ...acc, [day.dayNumber]: true }),
      {} as Record<number, boolean>
    );
    setExpandedDays(allExpanded);
  };

  const getDayItinerary = (dayNumber: number, city: string): DayItineraryState =>
    dayItineraries[dayNumber] || {
      title: buildDayTitle(goingFrom, city),
      saveAsMaster: false,
      description: "",
      sicSightseeing: "",
      pvtSightseeing: "",
    };

  const updateDayItinerary = (
    dayNumber: number,
    city: string,
    patch: Partial<DayItineraryState>
  ) => {
    setDayItineraries((prev) => {
      const current = prev[dayNumber] || {
        title: buildDayTitle(goingFrom, city),
        saveAsMaster: false,
        description: "",
        sicSightseeing: "",
        pvtSightseeing: "",
      };
      return {
        ...prev,
        [dayNumber]: {
          ...current,
          ...patch,
        },
      };
    });
  };

  useEffect(() => {
    if (!onProposalDataChangeRef.current) return;

    const hotels: PdfHotelCity[] = (hotelOptions[0]?.cities || []).map((city) => ({
      hotelCity: city.hotelCity,
      hotelName: city.hotelName,
      checkIn: city.checkIn,
      nights: city.nights,
      finalCost: city.finalCost,
      rooms: (city.rooms || []).map((room) => ({
        sharing: room.sharing,
        roomType: room.roomType,
        mealPlan: room.mealPlan,
      })),
    }));

    const mappedDays: PdfDay[] = daysWithCity.map((day) => {
      const itinerary = getDayItinerary(day.dayNumber, day.city);
      return {
        dayNumber: day.dayNumber,
        label: day.label,
        city: day.city,
        title: itinerary.title,
        description: itinerary.description,
        sicSightseeing: itinerary.sicSightseeing,
        pvtSightseeing: itinerary.pvtSightseeing,
      };
    });

    const flights = Object.values(flightsByDay).flat().filter(
      (leg) => leg.from || leg.to || leg.airlineName
    );

    onProposalDataChangeRef.current({
      hotels,
      hotelTotal: hotels.reduce((sum, hotel) => sum + (hotel.finalCost || 0), 0),
      days: mappedDays,
      flights,
      flightTotal,
    });
  }, [
    hotelOptions,
    daysWithCity,
    dayItineraries,
    flightsByDay,
    flightTotal,
    goingFrom,
  ]);

  return (
    <>
      <HotelOptionSection
        supplierType={supplierType}
        destinationsCovered={destinationsCovered}
        checkIn={checkIn}
        checkInRaw={checkInRaw}
        adults={adults}
        noOfNights={noOfNights}
        currency={currency}
        onHotelsChange={setHotelOptions}
      />

      <CollapsibleSection
        title="Activities & Sightseeing"
        headerVariant="gray"
        actions={
          <button
            type="button"
            className="ccp-orange-btn"
            style={{ fontSize: "10px", padding: "3px 8px" }}
            onClick={expandAllDays}
          >
            Expand All
          </button>
        }
      >
        {daysWithCity.map((day) => {
          const sightseeingOptions = sightseeings.filter(
            (item) => !day.city || cityMatches(item.city || "", day.city)
          );
          const optionsForDay =
            sightseeingOptions.length > 0 ? sightseeingOptions : sightseeings;

          return (
            <div key={day.dayNumber} className="mb-2">
              <div
                className="ccp-day-header"
                onClick={() => toggleDay(day.dayNumber)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleDay(day.dayNumber);
                  }
                }}
              >
                <span>
                  Day {day.dayNumber} ({day.label})
                  {day.city ? ` - ${day.city}` : ""}
                </span>
                <IconifyIcon
                  icon={
                    expandedDays[day.dayNumber]
                      ? "mdi:chevron-up"
                      : "mdi:chevron-down"
                  }
                />
              </div>
              {expandedDays[day.dayNumber] && (
                <DayItineraryContent
                  dayNumber={day.dayNumber}
                  city={day.city}
                  goingFrom={goingFrom}
                  checkIn={checkIn}
                  checkInRaw={checkInRaw}
                  adults={adults}
                  itinerary={getDayItinerary(day.dayNumber, day.city)}
                  onItineraryChange={(patch) =>
                    updateDayItinerary(day.dayNumber, day.city, patch)
                  }
                  sightseeingOptions={optionsForDay}
                  masterTitles={masterTitles}
                  openPanels={openPanels}
                  onTogglePanel={togglePanel}
                  onFlightSnapshotChange={(snapshot) => {
                    const legs = [mapFlightLeg(snapshot.outbound)];
                    if (snapshot.tripType === "Round Trip") {
                      legs.push(mapFlightLeg(snapshot.inbound));
                    }
                    setFlightsByDay((prev) => ({
                      ...prev,
                      [day.dayNumber]: legs,
                    }));
                    setFlightTotal(snapshot.totalCost);
                  }}
                />
              )}
            </div>
          );
        })}
      </CollapsibleSection>
    </>
  );
};

export default HotelAndActivitiesSection;
