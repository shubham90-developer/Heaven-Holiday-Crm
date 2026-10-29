"use client";

import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import CollapsibleSection from "./CollapsibleSection";
import DestinationCoveredSelect from "./DestinationCoveredSelect";
import EnquiryDetailsSection from "./EnquiryDetailsSection";
import ModifyQueryPanel from "./ModifyQueryPanel";
import ProposalRichTextEditor from "./ProposalRichTextEditor";
import {
  SUPPLIER_TYPE_OPTIONS,
  packageSupplierLabel,
  showsPackageLevelSupplier,
} from "../supplierTypes";

export type QueryPrefill = {
  queryId: string;
  customerName: string;
  enquiryId: string;
  enquiryFor: string;
  checkIn: string;
  checkInRaw?: string;
  checkOut: string;
  noOfNights: number;
  destination: string;
  adults: number;
  paxSummary?: string;
  goingFrom?: string;
  priceRange?: string;
  hotel?: string;
  food?: string;
  inclusions?: string;
  themes?: string;
  remark: string;
  leadType: string;
};

type QueryDetailSectionProps = {
  data: QueryPrefill;
  overview: string;
  onOverviewChange: (value: string) => void;
  destinationsCovered: string;
  onDestinationsChange: (value: string) => void;
  packageSupplier: string;
  onPackageSupplierChange: (value: string) => void;
  currency: string;
  onCurrencyChange: (value: string) => void;
  supplierType: string;
  onSupplierTypeChange: (value: string) => void;
  dayWiseItinerary: boolean;
  onDayWiseItineraryChange: (value: boolean) => void;
};

const QueryDetailSection = ({
  data,
  overview,
  onOverviewChange,
  destinationsCovered,
  onDestinationsChange,
  packageSupplier,
  onPackageSupplierChange,
  currency,
  onCurrencyChange,
  supplierType,
  onSupplierTypeChange,
  dayWiseItinerary,
  onDayWiseItineraryChange,
}: QueryDetailSectionProps) => {
  const [showModifyQuery, setShowModifyQuery] = useState(false);
  const [showEnquiryDetails, setShowEnquiryDetails] = useState(true);
  const [overviewExpanded, setOverviewExpanded] = useState(true);
  const [displayCheckIn, setDisplayCheckIn] = useState(data.checkIn);
  const [displayAdults, setDisplayAdults] = useState(data.adults);
  const [displayPaxSummary, setDisplayPaxSummary] = useState(
    data.paxSummary || `Adults: ${data.adults}\nRoom 1: Adults: ${data.adults}`
  );

  return (
    <>
      <div className="ccp-query-header">
        <span>Query Detail</span>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark">{data.leadType}</span>
          <Button
            className="ccp-modify-query-btn"
            size="sm"
            onClick={() => setShowModifyQuery(true)}
          >
            Modify Query
          </Button>
        </div>
      </div>

      <Row className="g-0">
        <Col md={4}>
          <div className="ccp-info-box border-end-0">
            <div className="label">Customer Name</div>
            <div className="value">{data.customerName}</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="ccp-info-box border-end-0">
            <div className="label">Enquiry ID</div>
            <div className="value">{data.enquiryId}</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="ccp-info-box">
            <div className="label">Enquiry For</div>
            <div className="value">{data.enquiryFor}</div>
          </div>
        </Col>
      </Row>

      <EnquiryDetailsSection
        expanded={showEnquiryDetails}
        onToggle={() => setShowEnquiryDetails(!showEnquiryDetails)}
        checkIn={displayCheckIn}
        checkOut={data.checkOut}
        noOfNights={data.noOfNights}
        destination={data.destination}
        goingFrom={data.goingFrom || "NA"}
        priceRange={data.priceRange || "NA"}
        hotel={data.hotel || "3 Star"}
        food={data.food || "NA"}
        inclusions={data.inclusions || "Hotel, All Meals, Gala Dinner"}
        themes={data.themes || "NA"}
        paxSummary={displayPaxSummary}
        remark={data.remark}
      />

      {showModifyQuery && (
        <ModifyQueryPanel
          initialDate={data.checkInRaw || ""}
          initialAdults={displayAdults}
          onCancel={() => setShowModifyQuery(false)}
          onUpdate={({ travelDate, rooms }) => {
            if (travelDate) {
              setDisplayCheckIn(
                new Date(travelDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              );
            }
            const totalAdults = rooms.reduce((sum, r) => sum + r.adults, 0);
            setDisplayAdults(totalAdults);
            setDisplayPaxSummary(
              [
                `Adults: ${totalAdults}`,
                ...rooms.map(
                  (room, index) =>
                    `Room ${index + 1}: Adults: ${room.adults}`
                ),
              ].join("\n")
            );
          }}
        />
      )}

      <CollapsibleSection
        title="Package Type"
        headerVariant="dark"
        actions={
          <div className="d-flex align-items-center gap-2">
            <Form.Check
              type="checkbox"
              label="Day Wise Itinerary"
              checked={dayWiseItinerary}
              onChange={(e) => onDayWiseItineraryChange(e.target.checked)}
              className="text-white mb-0"
              style={{ fontSize: "11px" }}
            />
            <button type="button" className="ccp-ai-btn">
              + Create with AI
            </button>
            <button type="button" className="ccp-orange-btn">
              Search Quick Package
            </button>
          </div>
        }
      >
        <div className="mb-2">
          <label className="ccp-field-label">Suppliers:</label>
          <div className="d-flex gap-2 flex-wrap mt-1">
            {SUPPLIER_TYPE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`ccp-supplier-tab ${supplierType === option ? "active" : ""}`}
                onClick={() => onSupplierTypeChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {showsPackageLevelSupplier(supplierType) && (
          <Row className="g-2">
            <Col md={6}>
              <label className="ccp-field-label">
                {packageSupplierLabel(supplierType)}{" "}
                <span className="text-danger">*</span>
              </label>
              <Form.Control
                size="sm"
                className="ccp-input"
                value={packageSupplier}
                onChange={(e) => onPackageSupplierChange(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <label className="ccp-field-label">
                Currency <span className="text-danger">*</span>
              </label>
              <Form.Select
                size="sm"
                className="ccp-input"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value)}
              >
                <option value="">Select</option>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </Form.Select>
            </Col>
          </Row>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title={
          <span className="d-flex align-items-center gap-1">
            Destinations Covered
            <IconifyIcon icon="mdi:help-circle" className="text-info" />
          </span>
        }
        headerVariant="dark"
      >
        <DestinationCoveredSelect
          value={destinationsCovered}
          onChange={onDestinationsChange}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Overview"
        headerVariant="dark"
        expanded={overviewExpanded}
        onToggle={() => setOverviewExpanded(!overviewExpanded)}
      >
        <ProposalRichTextEditor value={overview} onChange={onOverviewChange} />
      </CollapsibleSection>
    </>
  );
};

export default QueryDetailSection;
