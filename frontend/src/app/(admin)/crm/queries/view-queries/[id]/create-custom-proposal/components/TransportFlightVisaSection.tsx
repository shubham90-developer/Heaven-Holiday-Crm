"use client";

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import CollapsibleSection from "./CollapsibleSection";
import OtherTransportsSection from "./OtherTransportsSection";
import FlightDetailsPanel, {
  type FlightProposalSnapshot,
} from "./FlightDetailsPanel";
import ProposalRichTextEditor from "./ProposalRichTextEditor";
import CostFieldsRow from "./CostFieldsRow";

type TransportFlightVisaSectionProps = {
  adults?: number;
  checkInRaw?: string;
  currency?: string;
  destinationsCovered?: string;
  goingFrom?: string;
  onFlightSnapshotChange?: (snapshot: FlightProposalSnapshot) => void;
};

const TransportFlightVisaSection = ({
  adults = 2,
  checkInRaw = "",
  currency = "INR",
  destinationsCovered = "",
  goingFrom = "",
  onFlightSnapshotChange,
}: TransportFlightVisaSectionProps) => {
  const [visaContent, setVisaContent] = useState("");
  const [flightExpanded, setFlightExpanded] = useState(true);
  const goingTo =
    destinationsCovered
      .split(/[,/|]+/)
      .map((item) => item.trim())
      .filter(Boolean)[0] || "";

  return (
    <>
      <OtherTransportsSection
        adults={adults}
        checkInRaw={checkInRaw}
        currency={currency}
        destinationsCovered={destinationsCovered}
        goingFrom={goingFrom}
      />

      <CollapsibleSection
        title="Flight Details & Cost (API)"
        headerVariant="blue"
        expanded={flightExpanded}
        onToggle={() => setFlightExpanded((open) => !open)}
      >
        <FlightDetailsPanel
          embedded
          adults={adults}
          goingFrom={goingFrom}
          goingTo={goingTo}
          checkIn={checkInRaw}
          currency={currency}
          onSnapshotChange={onFlightSnapshotChange}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Visa Info & Cost" headerVariant="purple">
        <Row className="g-2 mb-3">
          <Col md={3}>
            <label className="ccp-field-label">Country</label>
            <Form.Control size="sm" className="ccp-input" />
          </Col>
          <Col md={3}>
            <label className="ccp-field-label">Entry Type</label>
            <Form.Select size="sm" className="ccp-input">
              <option>-- Select --</option>
              <option>Single Entry</option>
              <option>Multiple Entry</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <label className="ccp-field-label">Visa Category</label>
            <Form.Select size="sm" className="ccp-input">
              <option>-- Select --</option>
              <option>Tourist</option>
              <option>Business</option>
            </Form.Select>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button className="ccp-orange-btn w-100">Get Details</Button>
          </Col>
        </Row>
        <ProposalRichTextEditor value={visaContent} onChange={setVisaContent} />
        <CostFieldsRow adultCount={2} showTaxType />
      </CollapsibleSection>
    </>
  );
};

export default TransportFlightVisaSection;
