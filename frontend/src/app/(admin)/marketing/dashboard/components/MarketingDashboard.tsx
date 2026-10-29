"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Row, Col, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import CustomerFilter from "../../customer-search/components/CustomerFilter";
import Test from "./component";

const marketingActionCards = [
  {
    key: "b2c-customer",
    title: "MY B2C Customer",
    icon: "mdi:office-building-marker",
    color: "#1a3fa5",
  },
  {
    key: "b2b-customer",
    title: "MY B2B Customer",
    icon: "mdi:account-multiple-outline",
    color: "#7b2ff7",
  },
  {
    key: "planning-trip",
    title: "Customer Planning a Trip",
    icon: "mdi:image-multiple-outline",
    color: "#2fb350",
  },
  {
    key: "birthdays",
    title: "Customer Birthdays for the Month",
    icon: "mdi:party-popper",
    color: "#17a9e6",
  },
  {
    key: "anniversaries",
    title: "Marriage Anniversaries for the Month",
    icon: "mdi:flower-tulip-outline",
    color: "#f5811f",
  },
  {
    key: "build-segment",
    title: "Build your Own Segment",
    icon: "mdi:wrench-outline",
    color: "#8c1c2b",
  },
];

const statCardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  height: "100%",
  background: "#fff",
  border: "1px solid #e3e7ee",
  borderRadius: 8,
  padding: "14px 16px",
};

const statIconStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  flexShrink: 0,
  borderRadius: "50%",
  border: "1px solid #d9dee8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 20,
  color: "#364152",
};

const actionCardStyle = (color: string): React.CSSProperties => ({
  width: "100%",
  minHeight: 170,
  border: "none",
  borderRadius: 10,
  padding: "18px 16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  textAlign: "left",
  color: "#fff",
  background: color,
});

const LAST_CARD_KEY = "build-segment";

const MarketingDashboard = () => {
  const router = useRouter();
  const displayName = "RAJENDRA BUGADE";
  const [showSegmentModal, setShowSegmentModal] = useState(false);

  const handleComingSoon = (title: string) => {
    toast(`${title} is coming soon`, { icon: "🚧" });
  };

  const handleCardClick = (item: (typeof marketingActionCards)[number]) => {
    if (item.key === LAST_CARD_KEY) {
      setShowSegmentModal(true);
      return;
    }
    router.push(`/marketing/customer-search?title=${encodeURIComponent(item.title)}`);
  };

  return (
    <div>
      <h4 className="fw-bold mb-3">Hello {displayName}</h4>
      <p className="text-muted mb-1" style={{ fontSize: 14 }}>
        Lets start your day with some leads generation, greetings to your
        clients or launch a marketing campaign.
      </p>
      <p className="text-muted mb-0" style={{ fontSize: 14 }}>
        Here are some data for your ready reference and start monetizing your
        day.
      </p>

      {/* Stat cards row */}
      <Row className="g-2 mt-3">
        <Col md={6} lg={3}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>
              <IconifyIcon icon="mdi:cake-variant-outline" />
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: 14.5 }}>
                Birthday Greetings
              </div>
              <span
                className="d-inline-block mt-1 px-2 py-1"
                style={{
                  fontSize: 12,
                  background: "#eef1f6",
                  color: "#6b7280",
                  borderRadius: 4,
                }}
              >
                No Mail Sent
              </span>
            </div>
          </div>
        </Col>

        <Col md={6} lg={3}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>
              <IconifyIcon icon="mdi:gift-outline" />
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: 14.5 }}>
                Anniversary Greeting
              </div>
              <span
                className="d-inline-block mt-1 px-2 py-1"
                style={{
                  fontSize: 12,
                  background: "#eef1f6",
                  color: "#6b7280",
                  borderRadius: 4,
                }}
              >
                No Mail Sent
              </span>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div style={{ ...statCardStyle, flexWrap: "wrap" }}>
            <div style={statIconStyle}>
              <IconifyIcon icon="mdi:email-outline" />
            </div>
            <div className="flex-grow-1">
              <div className="fw-bold" style={{ fontSize: 14.5 }}>
                Total Email{" "}
                <span style={{ color: "#f58220", fontWeight: 700 }}>100</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleComingSoon("Add Email Credit")}
              className="d-inline-flex align-items-center gap-1"
              style={{
                border: "1px solid #d9dee8",
                background: "#fff",
                color: "#1f2937",
                fontSize: 12.5,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 6,
                whiteSpace: "nowrap",
              }}
            >
              <IconifyIcon icon="mdi:plus" /> Add Email Credit
            </button>
          </div>
        </Col>
      </Row>

      {/* Follow-up row */}
      <Row className="g-2 mt-1">
        <Col md={6}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>
              <IconifyIcon icon="mdi:chart-bar" />
            </div>
            <div className="fw-bold" style={{ fontSize: 14.5 }}>
              First Auto Follow Up{" "}
              <span className="fw-normal text-muted" style={{ fontSize: 13 }}>
                (After 3 Days)
              </span>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>
              <IconifyIcon icon="mdi:chart-bar" />
            </div>
            <div className="fw-bold" style={{ fontSize: 14.5 }}>
              Second Auto Follow Up{" "}
              <span className="fw-normal text-muted" style={{ fontSize: 13 }}>
                (After 5 Days)
              </span>
            </div>
          </div>
        </Col>
      </Row>

      <p className="text-muted mt-4 mb-3" style={{ fontSize: 14 }}>
        You can also choose options below to start your day and generate new
        business
      </p>

      {/* Action cards */}
      <Row className="g-3">
        {marketingActionCards.map((item) => (
          <Col xs={6} md={4} xl={2} key={item.key}>
            <button
              type="button"
              onClick={() => handleCardClick(item)}
              style={actionCardStyle(item.color)}
            >
              <span
                className="fw-bold"
                style={{ fontSize: 18, lineHeight: 1.25 }}
              >
                {item.title}
              </span>
              <IconifyIcon
                icon={item.icon}
                style={{ fontSize: 34, alignSelf: "flex-end", opacity: 0.95 }}
              />
            </button>
          </Col>
        ))}
      </Row>
      <Test name={"shubham"} surname={"yadav"}></Test>

      {/* Build your Own Segment opens the same filter as a modal instead of a page */}
      <Modal show={showSegmentModal} onHide={() => setShowSegmentModal(false)} size="xl" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Build your Own Segment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomerFilter
            onSearch={(filters) => {
              // TODO: call your search/segment API with these filters
              console.log("segment filters", filters);
              toast.success("Segment filters ready (wire this up to your API)");
              setShowSegmentModal(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MarketingDashboard;
