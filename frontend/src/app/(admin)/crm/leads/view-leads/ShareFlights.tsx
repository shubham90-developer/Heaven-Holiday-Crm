"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  CardHeader,
  CardBody,
  Badge,
} from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import LeadSourceSelect from "./components/LeadSourceSelect";

/**
 * Types
 * -----
 * Mirrors the shape of a single row from the Flight Results grid
 * (Airline / Departure / Duration / Arrival / Price).
 */
export type FlightResult = {
  id: string;
  airlineName: string; // e.g. "Akasa Air"
  flightNumber: string; // e.g. "QP-1940 G"
  departureTime: string; // e.g. "14:00"
  departureCode: string; // e.g. "DXN"
  arrivalTime: string; // e.g. "16:20"
  arrivalCode: string; // e.g. "BOM"
  durationLabel: string; // e.g. "2h 20m"
  stopsLabel: string; // e.g. "Non-stop" | "1 Stop(s)"
  price: number;
  seatsLeft?: number;
  fareType?: string; // e.g. "Offer fare with pnr (G)"
  refundable?: boolean;
};

type ShareChannel = "Email" | "WhatsApp" | "SMS";

// Temporary mock so the page renders something before real flight data
// is wired up. Replace with a real fetch keyed off leadId / searchId.
const mockFlights: FlightResult[] = [
  {
    id: "1",
    airlineName: "Akasa Air",
    flightNumber: "QP-1940 G",
    departureTime: "14:00",
    departureCode: "DXN",
    arrivalTime: "16:20",
    arrivalCode: "BOM",
    durationLabel: "2h 20m",
    stopsLabel: "Non-stop",
    price: 4596,
    seatsLeft: 4,
    fareType: "Offer fare with pnr (G)",
    refundable: false,
  },
  {
    id: "2",
    airlineName: "Spicejet",
    flightNumber: "SG-9091 HR",
    departureTime: "05:30",
    departureCode: "DEL",
    arrivalTime: "07:50",
    arrivalCode: "BOM",
    durationLabel: "2h 20m",
    stopsLabel: "Non-stop",
    price: 5911,
    seatsLeft: 3,
    fareType: "Coupon (HR)",
    refundable: true,
  },
];

const defaultChannels: Record<ShareChannel, boolean> = {
  Email: true,
  WhatsApp: false,
  SMS: false,
};

const ShareFlights = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const leadId = searchParams.get("id");
  const from = searchParams.get("from") ?? "-";
  const to = searchParams.get("to") ?? "-";
  const date = searchParams.get("date") ?? "-";
  const pax = searchParams.get("pax") ?? "-";

  // TODO: replace mockFlights with a real query, e.g.
  // const { data: flights = [] } = useGetFlightResultsQuery(leadId);
  const [flights] = useState<FlightResult[]>(mockFlights);

  const [selectedIds, setSelectedIds] = useState<string[]>(
    flights.slice(0, 1).map((f) => f.id)
  );
  const [channels, setChannels] = useState<Record<ShareChannel, boolean>>(
    defaultChannels
  );
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [leadSource, setLeadSource] = useState("");
  const [remark, setRemark] = useState("");
  const [showMarkup, setShowMarkup] = useState(false);
  const [markupType, setMarkupType] = useState<"Flat" | "Percentage">("Flat");
  const [markupValue, setMarkupValue] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);

  const toggleFlight = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleChannel = (ch: ShareChannel) => {
    setChannels((prev) => ({ ...prev, [ch]: !prev[ch] }));
  };

  const finalPrice = (base: number) => {
    if (!showMarkup || !markupValue) return base;
    return markupType === "Flat"
      ? base + markupValue
      : Math.round(base + (base * markupValue) / 100);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) {
      toast.error("❌ Select at least one flight to share");
      return;
    }
    if (!Object.values(channels).some(Boolean)) {
      toast.error("❌ Select at least one channel (Email / WhatsApp / SMS)");
      return;
    }
    if (channels.Email && !recipientEmail) {
      toast.error("❌ Recipient email is required");
      return;
    }
    if ((channels.WhatsApp || channels.SMS) && !recipientPhone) {
      toast.error("❌ Recipient phone is required");
      return;
    }

    try {
      setIsSending(true);
      // TODO: wire to real mutation, e.g. useShareFlightsMutation()
      await new Promise((res) => setTimeout(res, 800));
      toast.success("Flights Shared Successfully");
      router.push(`/queries/new?id=${leadId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to share flights");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="bg-dark p-2 d-flex justify-content-between align-items-center">
          <h6 className="text-white mb-0">Share Flights</h6>
          <Icon
            icon="mdi:arrow-left"
            className="text-white"
            style={{ cursor: "pointer" }}
            onClick={handleBack}
          />
        </div>
      </CardHeader>

      <CardBody className="border">
        <h6 style={{ fontSize: "12px" }}>Route Info:</h6>
        <div className="d-flex justify-content-between border p-1 mb-3">
          <div>
            <strong>Going From :</strong> {from}
          </div>
          <div>
            <strong>Going To :</strong> {to}
          </div>
          <div>
            <strong>PAX:</strong> {pax}
          </div>
          <div>
            <strong>Travel Date:</strong> {date}
          </div>
        </div>

        <Form>
          {/* Flight selection list */}
          <Row className="mb-2">
            <Col md={12}>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Select Flights to Share
              </Form.Label>

              <div className="border">
                <div
                  className="d-flex justify-content-between p-2"
                  style={{
                    backgroundColor: "#0b2b4a",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ width: "6%" }}></div>
                  <div style={{ width: "22%" }}>Airline</div>
                  <div style={{ width: "18%" }}>Departure</div>
                  <div style={{ width: "18%" }}>Duration</div>
                  <div style={{ width: "18%" }}>Arrival</div>
                  <div style={{ width: "18%" }} className="text-end">
                    Price
                  </div>
                </div>

                {flights.map((f) => (
                  <div
                    key={f.id}
                    className="d-flex justify-content-between align-items-center p-2 border-top"
                    style={{ fontSize: "12px" }}
                  >
                    <div style={{ width: "6%" }}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(f.id)}
                        onChange={() => toggleFlight(f.id)}
                      />
                    </div>

                    <div style={{ width: "22%" }}>
                      <div className="fw-bold">{f.airlineName}</div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        {f.flightNumber}
                      </div>
                    </div>

                    <div style={{ width: "18%" }}>
                      <div className="fw-bold">{f.departureTime}</div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        {f.departureCode}
                      </div>
                    </div>

                    <div style={{ width: "18%" }} className="text-center">
                      <div>{f.durationLabel}</div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        {f.stopsLabel}
                      </div>
                    </div>

                    <div style={{ width: "18%" }}>
                      <div className="fw-bold">{f.arrivalTime}</div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>
                        {f.arrivalCode}
                      </div>
                    </div>

                    <div style={{ width: "18%" }} className="text-end">
                      <div className="fw-bold">
                        ₹{finalPrice(f.price).toLocaleString("en-IN")}.00
                      </div>
                      {f.seatsLeft !== undefined && (
                        <div className="text-muted" style={{ fontSize: "10px" }}>
                          Seats left: {f.seatsLeft}
                          {f.fareType ? `, ${f.fareType}` : ""}
                          {f.refundable !== undefined && (
                            <Badge
                              bg={f.refundable ? "success" : "danger"}
                              className="ms-1"
                              style={{ fontSize: "9px" }}
                            >
                              {f.refundable ? "Refundable" : "Non Refundable"}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>

          {/* Optional markup before sharing */}
          <Row className="mb-2">
            <Col md={3}>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Apply Markup
              </Form.Label>
              <div className="d-flex gap-2">
                <Form.Check
                  type="checkbox"
                  style={{ fontSize: "12px" }}
                  checked={showMarkup}
                  onChange={(e) => setShowMarkup(e.target.checked)}
                />
              </div>
            </Col>

            {showMarkup && (
              <>
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Markup Type
                  </Form.Label>
                  <div className="d-flex align-items-center">
                    {(["Flat", "Percentage"] as const).map((type) => (
                      <Form.Check
                        key={type}
                        type="radio"
                        label={type}
                        name="markupType"
                        value={type}
                        checked={markupType === type}
                        onChange={(e) =>
                          setMarkupType(e.target.value as "Flat" | "Percentage")
                        }
                        className="me-2"
                        style={{ fontSize: "12px" }}
                      />
                    ))}
                  </div>
                </Col>
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Markup Value {markupType === "Percentage" ? "(%)" : "(₹)"}
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    style={{ fontSize: "12px" }}
                    value={markupValue}
                    onChange={(e) => setMarkupValue(+e.target.value)}
                  />
                </Col>
              </>
            )}
          </Row>

          {/* Share channels */}
          <Row className="mb-2">
            <Col md={12}>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Share Via
              </Form.Label>
              <div className="d-flex gap-3">
                {(["Email", "WhatsApp", "SMS"] as ShareChannel[]).map((ch) => (
                  <Form.Check
                    key={ch}
                    type="checkbox"
                    label={ch}
                    checked={channels[ch]}
                    onChange={() => toggleChannel(ch)}
                    style={{ fontSize: "12px" }}
                  />
                ))}
              </div>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={3}>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Recipient Name
              </Form.Label>
              <Form.Control
                size="sm"
                style={{ fontSize: "12px" }}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </Col>

            {channels.Email && (
              <Col md={3}>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Recipient Email *
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  style={{ fontSize: "12px" }}
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </Col>
            )}

            {(channels.WhatsApp || channels.SMS) && (
              <Col md={3}>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Recipient Phone *
                </Form.Label>
                <Form.Control
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                />
              </Col>
            )}

            <Col md={3}>
              <LeadSourceSelect value={leadSource} onChange={setLeadSource} />
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={12}>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Add Remark
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                size="sm"
                style={{ fontSize: "12px" }}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Col>
          </Row>

          <div className="text-end mt-3 d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" size="sm" onClick={handleBack}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              style={{ fontSize: "12px" }}
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Share Now"}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ShareFlights;