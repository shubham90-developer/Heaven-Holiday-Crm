"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Col, Form, Row } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import CustomFlatpickr from "@/components/CustomFlatpickr";
import { useGetSuppliersQuery } from "@/store/services/supplierApi";
import ProposalRichTextEditor from "./ProposalRichTextEditor";
import CostFieldsRow from "./CostFieldsRow";

type TripType = "One Way" | "Round Trip";
type FlightTab = "text" | "api" | "detailed" | "gds";

type FlightSegment = {
  airlineName: string;
  airlineNo: string;
  departureDate: string;
  arrivalDate: string;
  from: string;
  to: string;
  stops: string;
  stopOver: string;
  fareClass: string;
  checkInBaggage: string;
  cabinBaggage: string;
  pax: number;
  costPP: number;
  markupPP: number;
  markupEnabled: boolean;
};

export type FlightProposalSnapshot = {
  tripType: TripType;
  outbound: FlightSegment;
  inbound: FlightSegment;
  totalCost: number;
};

type FlightDetailsPanelProps = {
  adults: number;
  goingFrom?: string;
  goingTo?: string;
  checkIn?: string;
  currency?: string;
  embedded?: boolean;
  onSnapshotChange?: (snapshot: FlightProposalSnapshot) => void;
};

type SupplierRecord = {
  _id: string;
  companyName?: string;
  currencyType?: string;
};

const STOP_OPTIONS = ["Non Stop", "1 Stop", "2 Stops", "3 Stops"];
const CURRENCIES = ["INR", "USD", "EUR", "AED", "GBP", "THB"];
const FLIGHT_TABS = [
  { key: "text" as const, label: "Text / Copy Paste" },
  { key: "api" as const, label: "API" },
  { key: "detailed" as const, label: "Detailed" },
  { key: "gds" as const, label: "GDS PNR" },
];

const toDateTimeLocal = (value?: string) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return value.slice(0, 16);
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return `${value.slice(0, 10)}T06:00`;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T06:00`;
};

const formatMoney = (value: number) =>
  Number.isFinite(value) ? value.toFixed(2) : "0.00";

const DATETIME_PICKER_OPTIONS = {
  enableTime: true,
  time_24hr: true,
  dateFormat: "M d, Y H:i",
  minuteIncrement: 1,
  allowInput: true,
};

const dateToLocalValue = (date: Date) => {
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${mins}`;
};

const durationBetween = (departure: string, arrival: string) => {
  if (!departure || !arrival) return "";
  const start = new Date(departure).getTime();
  const end = new Date(arrival).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return "";
  const minutes = Math.round((end - start) / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const createSegment = (
  adults: number,
  from = "",
  to = "",
  checkIn = ""
): FlightSegment => ({
  airlineName: "",
  airlineNo: "",
  departureDate: toDateTimeLocal(checkIn),
  arrivalDate: toDateTimeLocal(checkIn),
  from,
  to,
  stops: "Non Stop",
  stopOver: "",
  fareClass: "",
  checkInBaggage: "",
  cabinBaggage: "",
  pax: Math.max(1, adults || 1),
  costPP: 0,
  markupPP: 0,
  markupEnabled: true,
});

const segmentTotals = (segment: FlightSegment) => {
  const markup = segment.markupEnabled ? Number(segment.markupPP) || 0 : 0;
  const totalPP = (Number(segment.costPP) || 0) + markup;
  const pax = Number(segment.pax) || 0;
  return {
    totalPP,
    totalCost: (Number(segment.costPP) || 0) * pax,
    totalMarkup: markup * pax,
    total: totalPP * pax,
  };
};

const ClearableControl = ({
  value,
  onClear,
  children,
}: {
  value?: string;
  onClear: () => void;
  children: ReactNode;
}) => (
  <div className="ccp-clearable">
    {children}
    {Boolean(value) && (
      <button type="button" className="ccp-clear-btn" onClick={onClear}>
        ×
      </button>
    )}
  </div>
);

const FlightSegmentForm = ({
  title,
  segment,
  onChange,
}: {
  title: string;
  segment: FlightSegment;
  onChange: (patch: Partial<FlightSegment>) => void;
}) => {
  const totals = segmentTotals(segment);
  const nonStop = segment.stops === "Non Stop";
  const duration = durationBetween(segment.departureDate, segment.arrivalDate);

  return (
    <div className="ccp-flight-segment">
      <div className="ccp-flight-segment-header">{title}</div>
      <div className="ccp-flight-segment-body">
        <Row className="g-2 mb-2">
          <Col md={3}>
            <label className="ccp-field-label">Airline Name</label>
            <ClearableControl
              value={segment.airlineName}
              onClear={() => onChange({ airlineName: "" })}
            >
              <Form.Control
                size="sm"
                className="ccp-input"
                placeholder="Airline Name"
                value={segment.airlineName}
                onChange={(e) => onChange({ airlineName: e.target.value })}
              />
            </ClearableControl>
          </Col>
          <Col md={3}>
            <label className="ccp-field-label">Airline No.</label>
            <ClearableControl
              value={segment.airlineNo}
              onClear={() => onChange({ airlineNo: "" })}
            >
              <Form.Control
                size="sm"
                className="ccp-input"
                placeholder="Airline No."
                value={segment.airlineNo}
                onChange={(e) => onChange({ airlineNo: e.target.value })}
              />
            </ClearableControl>
          </Col>
          <Col md={3}>
            <label className="ccp-field-label">Departure Date</label>
            <ClearableControl
              value={segment.departureDate}
              onClear={() => onChange({ departureDate: "" })}
            >
              <CustomFlatpickr
                className="form-control form-control-sm ccp-input"
                placeholder="Departure Date"
                value={segment.departureDate}
                options={DATETIME_PICKER_OPTIONS}
                onChange={(dates) =>
                  onChange({
                    departureDate: dates[0] ? dateToLocalValue(dates[0]) : "",
                  })
                }
              />
            </ClearableControl>
          </Col>
          <Col md={3}>
            <label className="ccp-field-label">Arrival Date</label>
            <ClearableControl
              value={segment.arrivalDate}
              onClear={() => onChange({ arrivalDate: "" })}
            >
              <CustomFlatpickr
                className="form-control form-control-sm ccp-input"
                placeholder="Arrival Date"
                value={segment.arrivalDate}
                options={DATETIME_PICKER_OPTIONS}
                onChange={(dates) =>
                  onChange({
                    arrivalDate: dates[0] ? dateToLocalValue(dates[0]) : "",
                  })
                }
              />
            </ClearableControl>
          </Col>
        </Row>

        <div className="ccp-flight-route-grid mb-2">
          <div>
            <label className="ccp-field-label">From</label>
            <ClearableControl
              value={segment.from}
              onClear={() => onChange({ from: "" })}
            >
              <Form.Control
                size="sm"
                className="ccp-input"
                placeholder="From"
                value={segment.from}
                onChange={(e) => onChange({ from: e.target.value })}
              />
            </ClearableControl>
          </div>
          <div>
            <label className="ccp-field-label">To</label>
            <ClearableControl
              value={segment.to}
              onClear={() => onChange({ to: "" })}
            >
              <Form.Control
                size="sm"
                className="ccp-input"
                placeholder="To"
                value={segment.to}
                onChange={(e) => onChange({ to: e.target.value })}
              />
            </ClearableControl>
          </div>
          <div>
            <label className="ccp-field-label">Stops</label>
            <Form.Select
              size="sm"
              className="ccp-input"
              value={segment.stops}
              onChange={(e) =>
                onChange({
                  stops: e.target.value,
                  stopOver: e.target.value === "Non Stop" ? "" : segment.stopOver,
                })
              }
            >
              {STOP_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </Form.Select>
          </div>
          <div>
            <label className="ccp-field-label">Stop Over</label>
            <Form.Control
              size="sm"
              className="ccp-input"
              placeholder="Stop Over"
              value={segment.stopOver}
              disabled={nonStop}
              onChange={(e) => onChange({ stopOver: e.target.value })}
            />
          </div>
          <div>
            <label className="ccp-field-label">Duration</label>
            <Form.Control
              size="sm"
              className="ccp-input ccp-input-computed"
              placeholder="Duration"
              value={duration}
              readOnly
            />
          </div>
        </div>

        <Row className="g-2 mb-3">
          <Col md={4}>
            <label className="ccp-field-label">Fare Class</label>
            <ClearableControl
              value={segment.fareClass}
              onClear={() => onChange({ fareClass: "" })}
            >
              <Form.Control
                size="sm"
                className="ccp-input"
                placeholder="Fare Class"
                value={segment.fareClass}
                onChange={(e) => onChange({ fareClass: e.target.value })}
              />
            </ClearableControl>
          </Col>
          <Col md={4}>
            <label className="ccp-field-label">Check-In Baggage</label>
            <ClearableControl
              value={segment.checkInBaggage}
              onClear={() => onChange({ checkInBaggage: "" })}
            >
              <Form.Control
                size="sm"
                className="ccp-input"
                placeholder="Check-In Baggage"
                value={segment.checkInBaggage}
                onChange={(e) => onChange({ checkInBaggage: e.target.value })}
              />
            </ClearableControl>
          </Col>
          <Col md={4}>
            <label className="ccp-field-label">Cabin Baggage</label>
            <ClearableControl
              value={segment.cabinBaggage}
              onClear={() => onChange({ cabinBaggage: "" })}
            >
              <Form.Control
                size="sm"
                className="ccp-input"
                placeholder="Cabin Baggage"
                value={segment.cabinBaggage}
                onChange={(e) => onChange({ cabinBaggage: e.target.value })}
              />
            </ClearableControl>
          </Col>
        </Row>

        <div className="table-responsive">
          <table className="ccp-cost-table ccp-flight-pax-table">
            <thead>
              <tr>
                <th></th>
                <th>PAX</th>
                <th>Cost (P.P.)</th>
                <th>
                  Markup (P.P.){" "}
                  <IconifyIcon
                    icon="mdi:information-outline"
                    className="text-primary"
                  />
                </th>
                <th>Total (P.P.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold">
                  ADULTS (+12 YRS) (x{segment.pax})
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    className="ccp-input"
                    value={segment.pax}
                    onChange={(e) => onChange({ pax: Number(e.target.value) })}
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    type="number"
                    min={0}
                    step="0.01"
                    className="ccp-input"
                    value={segment.costPP || ""}
                    onChange={(e) =>
                      onChange({ costPP: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <Form.Check
                      type="checkbox"
                      checked={segment.markupEnabled}
                      onChange={(e) =>
                        onChange({ markupEnabled: e.target.checked })
                      }
                    />
                    <Form.Control
                      size="sm"
                      type="number"
                      min={0}
                      step="0.01"
                      className="ccp-input"
                      value={segment.markupPP || ""}
                      disabled={!segment.markupEnabled}
                      onChange={(e) =>
                        onChange({ markupPP: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    className="ccp-input ccp-input-computed"
                    readOnly
                    value={
                      segment.costPP || segment.markupPP
                        ? formatMoney(totals.totalPP)
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr className="fw-semibold">
                <td>TOTAL</td>
                <td>{segment.pax}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FlightDetailsPanel = ({
  adults,
  goingFrom = "",
  goingTo = "",
  checkIn = "",
  currency: initialCurrency = "INR",
  embedded = false,
  onSnapshotChange,
}: FlightDetailsPanelProps) => {
  const refundableId = useId();
  const supplierListId = useId();
  const [flightTab, setFlightTab] = useState<FlightTab>("detailed");
  const [content, setContent] = useState("");
  const [tripType, setTripType] = useState<TripType>("One Way");
  const [, setSupplierId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [currency, setCurrency] = useState(initialCurrency);
  const [refundable, setRefundable] = useState(embedded);
  const [outbound, setOutbound] = useState<FlightSegment>(() =>
    createSegment(adults, goingFrom.replace(/^NA$/i, ""), goingTo, checkIn)
  );
  const [inbound, setInbound] = useState<FlightSegment>(() =>
    createSegment(adults, goingTo, goingFrom.replace(/^NA$/i, ""), checkIn)
  );

  const { data: suppliersResponse } = useGetSuppliersQuery(undefined);
  const suppliers: SupplierRecord[] = suppliersResponse?.data || [];

  const outboundTotals = useMemo(() => segmentTotals(outbound), [outbound]);
  const inboundTotals = useMemo(() => segmentTotals(inbound), [inbound]);
  const isRoundTrip = tripType === "Round Trip";
  const onSnapshotChangeRef = useRef(onSnapshotChange);
  onSnapshotChangeRef.current = onSnapshotChange;

  useEffect(() => {
    const from = goingFrom.replace(/^NA$/i, "");
    setOutbound((prev) => ({
      ...prev,
      from: prev.from || from,
      to: prev.to || goingTo,
    }));
    setInbound((prev) => ({
      ...prev,
      from: prev.from || goingTo,
      to: prev.to || from,
    }));
  }, [goingFrom, goingTo]);

  const summary = useMemo(() => {
    const tickets = outbound.pax + (isRoundTrip ? inbound.pax : 0);
    const totalCost =
      outboundTotals.totalCost + (isRoundTrip ? inboundTotals.totalCost : 0);
    const totalMarkup =
      outboundTotals.totalMarkup + (isRoundTrip ? inboundTotals.totalMarkup : 0);
    return {
      tickets,
      totalCost,
      totalMarkup,
      total: totalCost + totalMarkup,
    };
  }, [outbound.pax, inbound.pax, isRoundTrip, outboundTotals, inboundTotals]);

  useEffect(() => {
    onSnapshotChangeRef.current?.({
      tripType,
      outbound,
      inbound,
      totalCost: summary.total,
    });
  }, [tripType, outbound, inbound, summary.total]);

  const handleTripType = (type: TripType) => {
    setTripType(type);
    if (type === "Round Trip") {
      setInbound((prev) => ({
        ...prev,
        from: prev.from || outbound.to,
        to: prev.to || outbound.from,
        departureDate: prev.departureDate || outbound.arrivalDate,
        arrivalDate: prev.arrivalDate || outbound.arrivalDate,
        pax: prev.pax || outbound.pax,
      }));
    }
  };

  return (
    <div className={embedded ? "" : "ccp-detail-panel"}>
      {!embedded && (
        <div className="ccp-detail-panel-header">
          <span>Flight Details</span>
          <span className="ccp-detail-panel-badge">API</span>
        </div>
      )}
      <div className={embedded ? "" : "ccp-detail-panel-body"}>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {FLIGHT_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`ccp-sub-tab ${flightTab === tab.key ? "active" : ""}`}
              onClick={() => setFlightTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {flightTab !== "detailed" ? (
          <>
            <ProposalRichTextEditor value={content} onChange={setContent} />
            <CostFieldsRow adultCount={adults} />
          </>
        ) : (
          <>
            <Row className="g-2 align-items-end mb-3">
              <Col md={5}>
                <label className="ccp-field-label">
                  Supplier Name <span className="text-danger">*</span>
                </label>
                <ClearableControl
                  value={supplierName}
                  onClear={() => {
                    setSupplierName("");
                    setSupplierId("");
                  }}
                >
                  <Form.Control
                    size="sm"
                    className="ccp-input"
                    list={supplierListId}
                    placeholder="Supplier Name"
                    value={supplierName}
                    onChange={(e) => {
                      const value = e.target.value;
                      const match = suppliers.find(
                        (item) => item.companyName === value
                      );
                      setSupplierName(value);
                      setSupplierId(match?._id || "");
                      if (match?.currencyType) setCurrency(match.currencyType);
                    }}
                  />
                </ClearableControl>
                <datalist id={supplierListId}>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier._id}
                      value={supplier.companyName || "Supplier"}
                    />
                  ))}
                </datalist>
              </Col>
              <Col md={3}>
                <label className="ccp-field-label">
                  Currency <span className="text-danger">*</span>
                </label>
                <Form.Select
                  size="sm"
                  className="ccp-input"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCIES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4} className="pb-1">
                <Form.Check
                  type="checkbox"
                  id={refundableId}
                  label="Refundable"
                  checked={refundable}
                  onChange={(e) => setRefundable(e.target.checked)}
                  className="ccp-save-master-check mb-0"
                />
              </Col>
            </Row>

            <div className="d-flex gap-2 mb-3">
              {(["One Way", "Round Trip"] as TripType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`ccp-sub-tab ${tripType === type ? "active" : ""}`}
                  onClick={() => handleTripType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <FlightSegmentForm
              title={isRoundTrip ? "Out Bound" : "One Way"}
              segment={outbound}
              onChange={(patch) =>
                setOutbound((prev) => ({ ...prev, ...patch }))
              }
            />

            {isRoundTrip && (
              <FlightSegmentForm
                title="In Bound"
                segment={inbound}
                onChange={(patch) =>
                  setInbound((prev) => ({ ...prev, ...patch }))
                }
              />
            )}

            {isRoundTrip && (
              <div className="table-responsive">
                <table className="ccp-cost-table ccp-flight-pax-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Total Ticket(s)</th>
                      <th>Total Cost</th>
                      <th>Total Markup</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-semibold">
                        ADULTS (+12 YRS) (x{outbound.pax})
                      </td>
                      <td>{summary.tickets}</td>
                      <td>{formatMoney(summary.totalCost)}</td>
                      <td>{formatMoney(summary.totalMarkup)}</td>
                      <td>{formatMoney(summary.total)}</td>
                    </tr>
                    <tr className="fw-semibold">
                      <td>TOTAL</td>
                      <td>{summary.tickets}</td>
                      <td>{formatMoney(summary.totalCost)}</td>
                      <td>{formatMoney(summary.totalMarkup)}</td>
                      <td>{formatMoney(summary.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FlightDetailsPanel;
