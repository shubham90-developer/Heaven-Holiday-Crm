"use client";

import { ReactNode } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

type EnquiryDetailCellProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

const EnquiryDetailCell = ({
  label,
  value,
  className = "",
}: EnquiryDetailCellProps) => (
  <div className={`ccp-enquiry-detail-cell ${className}`}>
    <span className="cell-label">{label}:</span>
    <span className="cell-value">{value}</span>
  </div>
);

type EnquiryDetailsSectionProps = {
  expanded: boolean;
  onToggle: () => void;
  checkIn: string;
  checkOut: string;
  noOfNights: number | string;
  destination: string;
  goingFrom: string;
  priceRange: string;
  hotel: string;
  food: string;
  inclusions: string;
  themes: string;
  paxSummary: string;
  remark: string;
};

const EnquiryDetailsSection = ({
  expanded,
  onToggle,
  checkIn,
  checkOut,
  noOfNights,
  destination,
  goingFrom,
  priceRange,
  hotel,
  food,
  inclusions,
  themes,
  paxSummary,
  remark,
}: EnquiryDetailsSectionProps) => {
  const paxLines = paxSummary.split("\n").filter(Boolean);

  return (
    <div className="ccp-enquiry-details-section">
      <div className="ccp-enquiry-details-header">
        <span>Enquiry Details</span>
        <button type="button" className="ccp-enquiry-toggle-btn" onClick={onToggle}>
          {expanded ? "Hide Details" : "Show Details"}
          <IconifyIcon
            icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="fs-14"
          />
        </button>
      </div>

      {expanded && (
        <div className="ccp-enquiry-details-body">
          <div className="ccp-enquiry-details-row">
            <EnquiryDetailCell label="Check In" value={checkIn} />
            <EnquiryDetailCell label="Check Out" value={checkOut} />
            <EnquiryDetailCell label="No of Nights" value={noOfNights} />
            <EnquiryDetailCell label="Destination" value={destination} />
          </div>

          <div className="ccp-enquiry-details-row">
            <EnquiryDetailCell label="Going From" value={goingFrom} />
            <EnquiryDetailCell label="Price Range" value={priceRange} />
            <EnquiryDetailCell label="Hotel" value={hotel} />
            <EnquiryDetailCell label="Food" value={food} />
          </div>

          <div className="ccp-enquiry-details-row ccp-enquiry-details-row-2">
            <EnquiryDetailCell label="Inclusions" value={inclusions} />
            <EnquiryDetailCell label="Themes" value={themes} />
          </div>

          <div className="ccp-enquiry-details-row ccp-enquiry-details-row-2">
            <EnquiryDetailCell
              label="No of Pax"
              value={
                <span className="d-block">
                  {paxLines.map((line) => (
                    <span key={line} className="d-block">
                      {line}
                    </span>
                  ))}
                </span>
              }
            />
            <EnquiryDetailCell label="Remark" value={remark || ""} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryDetailsSection;
