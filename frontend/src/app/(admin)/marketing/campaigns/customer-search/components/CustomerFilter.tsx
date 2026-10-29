"use client";

import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// TODO: replace with real lead-source options from your API
const LEAD_SOURCES = [
  "AGENCY", "WEBSITE", "FACEBOOK", "TRIPSGATEWAY", "WEBSITE B2B", "PROPOSAL", "GTX NETWORK",
  "GTX NETWORK WEB", "INSTAGRAM", "OLD CUSTOMER", "REFRENCE", "WALKIN", "RAJ SIR", "MY OLD CLINT",
  "RAJ SIR FACEBOOK", "3700", "AHH", "EXPO BELAGAVI", "EXPO KOLHAPUR", "EXPO SANGLI", "PUNE EXPO",
  "PRANAV SIR", "PRAJWAL SIR", "SANKET SIR", "SAIPRASAD SIR", "JUST DIAL", "KASTURI GROUP",
  "PUNE EXPO JAN 2026", "VARSHA BUGADE", "PRANEETA BUGADE", "DUMMY LEAD SOURCE", "IUSDHAFJ", "KOP EXPO 2026",
];

const pillStyle = (active: boolean): React.CSSProperties => ({
  border: active ? "1px solid #1361e8" : "1px solid #d9dee8",
  background: active ? "#eaf2ff" : "#fff",
  color: active ? "#1361e8" : "#374151",
  borderRadius: 6,
  padding: "8px 14px",
  fontSize: 12.5,
  fontWeight: 600,
});

const solidPillStyle = (active: boolean): React.CSSProperties => ({
  border: active ? "none" : "1px solid #d9dee8",
  background: active ? "#1361e8" : "#fff",
  color: active ? "#fff" : "#374151",
  borderRadius: 6,
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 600,
});

interface CustomerFilterProps {
  title?: string;
  onSearch?: (filters: Record<string, unknown>) => void;
}

const CustomerFilter = ({ title, onSearch }: CustomerFilterProps) => {
  const [type, setType] = useState<"CUSTOMER" | "LEAD">("CUSTOMER");
  const [customerType, setCustomerType] = useState<"B2C" | "B2B" | null>(null);
  const [destination, setDestination] = useState("");
  const [tags, setTags] = useState("");
  const [anniversaryType, setAnniversaryType] = useState<"BIRTH" | "MARRIAGE" | null>(null);
  const [anniversaryMonth, setAnniversaryMonth] = useState<string | null>(null);
  const [queryMonth, setQueryMonth] = useState<string | null>(null);
  const [leadSources, setLeadSources] = useState<string[]>([]);

  const toggleLeadSource = (source: string) => {
    setLeadSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleSearch = () => {
    const filters = {
      type,
      customerType,
      destination,
      tags,
      anniversaryType,
      anniversaryMonth,
      queryMonth,
      leadSources,
    };
    if (onSearch) {
      onSearch(filters);
    } else {
      // TODO: call your search API with these filters
      toast.success("Filters ready (wire this up to your search API)");
    }
  };

  return (
    <div>
      {title && <h5 className="fw-bold mb-3">{title}</h5>}

      <Row className="g-4">
        <Col md={6}>
          <div className="fw-semibold mb-2">Type :</div>
          <div className="d-flex gap-2">
            <button type="button" style={solidPillStyle(type === "CUSTOMER")} onClick={() => setType("CUSTOMER")}>
              CUSTOMER
            </button>
            <button type="button" style={solidPillStyle(type === "LEAD")} onClick={() => setType("LEAD")}>
              LEAD
            </button>
          </div>
        </Col>

        <Col md={6}>
          <div className="fw-semibold mb-2">Customer Type :</div>
          <div className="d-flex gap-2">
            <button
              type="button"
              style={pillStyle(customerType === "B2C")}
              onClick={() => setCustomerType(customerType === "B2C" ? null : "B2C")}
            >
              B2C
            </button>
            <button
              type="button"
              style={pillStyle(customerType === "B2B")}
              onClick={() => setCustomerType(customerType === "B2B" ? null : "B2B")}
            >
              B2B
            </button>
          </div>
        </Col>

        <Col md={6}>
          <div className="fw-semibold mb-2">To Destination:</div>
          <Form.Control
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
          />
        </Col>

        <Col md={6}>
          <div className="fw-semibold mb-2">Customer Tags :</div>
          <Form.Control
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags"
          />
        </Col>

        <Col md={6}>
          <div className="fw-semibold mb-2">Anniversary :</div>
          <div className="d-flex gap-2 mb-2">
            <button
              type="button"
              style={pillStyle(anniversaryType === "BIRTH")}
              onClick={() => setAnniversaryType(anniversaryType === "BIRTH" ? null : "BIRTH")}
            >
              BIRTH
            </button>
            <button
              type="button"
              style={pillStyle(anniversaryType === "MARRIAGE")}
              onClick={() => setAnniversaryType(anniversaryType === "MARRIAGE" ? null : "MARRIAGE")}
            >
              MARRIAGE
            </button>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {MONTHS.map((m) => (
              <button
                key={m}
                type="button"
                style={pillStyle(anniversaryMonth === m)}
                onClick={() => setAnniversaryMonth(anniversaryMonth === m ? null : m)}
              >
                {m}
              </button>
            ))}
          </div>
        </Col>

        <Col md={6}>
          <div className="fw-semibold mb-2">Query Month :</div>
          <div className="d-flex flex-wrap gap-2">
            {MONTHS.map((m) => (
              <button
                key={m}
                type="button"
                style={pillStyle(queryMonth === m)}
                onClick={() => setQueryMonth(queryMonth === m ? null : m)}
              >
                {m}
              </button>
            ))}
          </div>
        </Col>

        <Col xs={12}>
          <div className="fw-semibold mb-2">Lead Source :</div>
          <div className="d-flex flex-wrap gap-2">
            {LEAD_SOURCES.map((source) => (
              <button
                key={source}
                type="button"
                style={{ ...pillStyle(leadSources.includes(source)), textAlign: "center" }}
                onClick={() => toggleLeadSource(source)}
              >
                {source}
              </button>
            ))}
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <Button style={{ width: "100%", background: "#1361e8", border: "none" }} onClick={handleSearch}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default CustomerFilter;
