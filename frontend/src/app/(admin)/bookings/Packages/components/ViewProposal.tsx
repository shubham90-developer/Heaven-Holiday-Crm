"use client";

import React, { useState } from "react";
import { Row, Col, Card, Nav, Tab, Badge, Accordion } from "react-bootstrap";
import { Icon } from "@iconify/react";
import {
    PackageBookingFormData,
    formatDisplayDate,
    getCustomerName,
} from "../types/packageBooking";

type ViewProposalProps = {
    booking: PackageBookingFormData;
};

const sectionHeaderStyle: React.CSSProperties = {
    background: "#2c5f8a",
    color: "#fff",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: 600,
};

const subHeaderStyle: React.CSSProperties = {
    background: "#8a9bab",
    color: "#fff",
    padding: "5px 12px",
    fontSize: "11px",
    fontWeight: 600,
};

const ViewProposal = ({ booking }: ViewProposalProps) => {
    const [activeTab, setActiveTab] = useState("itinerary");
    const customer = booking.customerDetails;
    const customerName = getCustomerName(customer);
    const destination =
        booking.goingTo?.split("(")[0]?.trim() || booking.goingTo || "Destination";
    const nights = Math.max((booking.noOfDays || 1) - 1, 1);

    const formatCurrency = (amount: number) =>
        `${booking.currency || "INR"} ${Number(amount || 0).toLocaleString("en-IN")}`;

    return (
        <div className="p-2">
            {/* Header */}
            <Card className="mb-3 border">
                <Card.Body className="p-3">
                    <Row className="align-items-start">
                        <Col md={8}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <Icon
                                    icon="mdi:airplane"
                                    width={28}
                                    style={{ color: "#ff6600" }}
                                />
                                <div>
                                    <h5 className="mb-0" style={{ fontSize: "16px" }}>
                                        <span style={{ color: "#ff6600" }}>
                                            trip details for {customerName}
                                        </span>{" "}
                                        <span className="fw-bold">
                                            {nights}N/{booking.noOfDays || 1}D ({destination})
                                        </span>
                                    </h5>
                                    <div
                                        className="d-flex align-items-center gap-2 mt-1"
                                        style={{ fontSize: "12px" }}
                                    >
                                        <span>{booking.travelers} Adults</span>
                                        <span className="text-muted">|</span>
                                        <span>
                                            Traveling On :{" "}
                                            {formatDisplayDate(booking.travelDate)}
                                        </span>
                                        <Icon
                                            icon="mdi:alert-circle-outline"
                                            style={{ color: "#ff6600" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={4} className="text-end">
                            <div style={{ fontSize: "11px" }} className="text-muted mb-1">
                                +91-{customer?.mobile || "—"}
                            </div>
                            <div style={{ fontSize: "12px" }} className="mb-2">
                                <strong>Proposal No:</strong> {booking.proposalId}
                            </div>
                            <div style={{ fontSize: "11px" }} className="text-muted">
                                Grand Total
                            </div>
                            <div
                                style={{
                                    fontSize: "22px",
                                    color: "#ff6600",
                                    fontWeight: 700,
                                }}
                            >
                                {formatCurrency(booking.sellingPrice || booking.totalSalesPrice)}
                            </div>
                            <div style={{ fontSize: "10px" }} className="text-muted">
                                Extra GST
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row>
                <Col lg={9}>
                    <div style={sectionHeaderStyle} className="mb-0 d-flex align-items-center gap-2">
                        <Icon icon="mdi:tag-outline" />
                        Proposal 1 {formatCurrency(booking.sellingPrice || booking.totalSalesPrice)}
                    </div>

                    <Card className="border-top-0 rounded-0">
                        <Card.Body className="p-0">
                            <Tab.Container
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k || "itinerary")}
                            >
                                <Nav
                                    variant="tabs"
                                    className="px-2 pt-2"
                                    style={{ fontSize: "12px" }}
                                >
                                    <Nav.Item>
                                        <Nav.Link eventKey="itinerary">
                                            <Icon icon="mdi:file-document-outline" className="me-1" />
                                            Itinerary
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="price">
                                            <Icon icon="mdi:currency-inr" className="me-1" />
                                            Price
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="incl-excl">
                                            <Icon icon="mdi:format-list-bulleted" className="me-1" />
                                            Incl./ Excl.
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content className="p-3">
                                    <Tab.Pane eventKey="itinerary">
                                        <div style={sectionHeaderStyle} className="mb-2">
                                            Air/ Transfer
                                        </div>
                                        {booking.flightCost?.total > 0 && (
                                            <div
                                                className="border p-2 mb-3"
                                                style={{ fontSize: "11px" }}
                                            >
                                                Flight: {booking.goingFrom} → {booking.goingTo}
                                                {" — "}
                                                {formatCurrency(booking.flightCost.total)}
                                            </div>
                                        )}

                                        <div style={sectionHeaderStyle} className="mb-2">
                                            Itinerary
                                        </div>

                                        {booking.days?.length > 0 ? (
                                            booking.days.map((day) => (
                                                <div key={day.dayNumber} className="mb-3">
                                                    <div style={subHeaderStyle}>
                                                        Day {String(day.dayNumber).padStart(2, "0")}{" "}
                                                        {day.location || destination}
                                                    </div>
                                                    <div
                                                        className="border border-top-0 p-3"
                                                        style={{
                                                            fontSize: "12px",
                                                            minHeight: "60px",
                                                        }}
                                                    >
                                                        {day.title && (
                                                            <strong className="d-block mb-1">
                                                                {day.title}
                                                            </strong>
                                                        )}
                                                        {day.description || (
                                                            <span className="text-muted">
                                                                No description added
                                                            </span>
                                                        )}
                                                        {(day.meals?.breakfast ||
                                                            day.meals?.lunch ||
                                                            day.meals?.dinner) && (
                                                            <div
                                                                className="mt-2"
                                                                style={{ fontSize: "10px" }}
                                                            >
                                                                Meals:{" "}
                                                                {[
                                                                    day.meals.breakfast &&
                                                                        "Breakfast",
                                                                    day.meals.lunch && "Lunch",
                                                                    day.meals.dinner && "Dinner",
                                                                ]
                                                                    .filter(Boolean)
                                                                    .join(", ")}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-muted p-3 border">
                                                No itinerary days added yet.
                                            </div>
                                        )}

                                        <div style={sectionHeaderStyle} className="mb-2 mt-3">
                                            Price
                                        </div>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header style={{ fontSize: "12px" }}>
                                                    Price Summary
                                                </Accordion.Header>
                                                <Accordion.Body style={{ fontSize: "11px" }}>
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span>Flight Cost</span>
                                                        <span>
                                                            {formatCurrency(
                                                                booking.flightCost?.total || 0
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span>Visa Cost</span>
                                                        <span>
                                                            {formatCurrency(
                                                                booking.visaCost?.total || 0
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span>Land Package Cost</span>
                                                        <span>
                                                            {formatCurrency(
                                                                booking.landPackageCost?.total || 0
                                                            )}
                                                        </span>
                                                    </div>
                                                    {booking.discount > 0 && (
                                                        <div className="d-flex justify-content-between mb-1 text-danger">
                                                            <span>Discount</span>
                                                            <span>
                                                                -{formatCurrency(booking.discount)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>

                                        <div
                                            className="d-flex justify-content-between align-items-center p-2 mt-2"
                                            style={{ background: "#e9ecef", fontSize: "12px" }}
                                        >
                                            <strong>Total Cost</strong>
                                            <strong>
                                                {formatCurrency(
                                                    booking.sellingPrice || booking.totalSalesPrice
                                                )}{" "}
                                                /-
                                            </strong>
                                        </div>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="price">
                                        <table
                                            className="table table-sm table-bordered"
                                            style={{ fontSize: "11px" }}
                                        >
                                            <tbody>
                                                <tr>
                                                    <td>Currency</td>
                                                    <td>{booking.currency}</td>
                                                </tr>
                                                <tr>
                                                    <td>Pricing Type</td>
                                                    <td>{booking.pricingType}</td>
                                                </tr>
                                                <tr>
                                                    <td>Flight Cost</td>
                                                    <td>
                                                        {formatCurrency(
                                                            booking.flightCost?.total || 0
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Visa Cost</td>
                                                    <td>
                                                        {formatCurrency(
                                                            booking.visaCost?.total || 0
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Land Package Cost</td>
                                                    <td>
                                                        {formatCurrency(
                                                            booking.landPackageCost?.total || 0
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Discount</td>
                                                    <td>{formatCurrency(booking.discount || 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Sales Price</td>
                                                    <td>
                                                        <strong>
                                                            {formatCurrency(
                                                                booking.totalSalesPrice ||
                                                                    booking.sellingPrice
                                                            )}
                                                        </strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Advance Required</td>
                                                    <td>{booking.advanceRequiredPercent}%</td>
                                                </tr>
                                                <tr>
                                                    <td>Advance</td>
                                                    <td>{formatCurrency(booking.advance || 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Balance</td>
                                                    <td>{formatCurrency(booking.balance || 0)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Payment Mode</td>
                                                    <td>{booking.paymentMode}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="incl-excl">
                                        {(
                                            [
                                                ["inclusions", "Inclusions"],
                                                ["exclusions", "Exclusions"],
                                                [
                                                    "termsAndConditions",
                                                    "Terms & Conditions",
                                                ],
                                                [
                                                    "cancellationPolicy",
                                                    "Cancellation Policy",
                                                ],
                                                ["travelBasics", "Travel Basics"],
                                                ["bookingTerms", "Booking Terms"],
                                                ["whyUseUs", "Why Use Us"],
                                                ["refundPolicy", "Refund Policy"],
                                            ] as const
                                        ).map(([key, label]) => (
                                            <div key={key} className="mb-3">
                                                <div style={subHeaderStyle}>{label}</div>
                                                <div
                                                    className="border border-top-0 p-2"
                                                    style={{
                                                        fontSize: "11px",
                                                        minHeight: "40px",
                                                    }}
                                                >
                                                    {booking.terms?.[key] || (
                                                        <span className="text-muted">—</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={3}>
                    <Card className="border">
                        <Card.Body className="p-3 text-center">
                            <div
                                className="fw-bold mb-2"
                                style={{ fontSize: "13px", letterSpacing: "0.5px" }}
                            >
                                A HEAVEN HOSPITALITY PVT LTD
                            </div>
                            <hr />
                            <p style={{ fontSize: "11px" }} className="text-muted mb-0">
                                My Proposal Id-{booking.enquiryId}/QS/26/
                                {booking.proposalId}/1 for your reference.
                            </p>
                        </Card.Body>
                    </Card>

                    <Card className="border mt-2">
                        <Card.Body className="p-2" style={{ fontSize: "11px" }}>
                            <div className="mb-1">
                                <strong>From:</strong> {booking.goingFrom || "—"}
                            </div>
                            <div className="mb-1">
                                <strong>To:</strong> {booking.goingTo || "—"}
                            </div>
                            <div className="mb-1">
                                <strong>Rooms:</strong> {booking.noOfRooms}
                            </div>
                            <div className="mb-1">
                                <strong>Remarks:</strong> {booking.remark || "—"}
                            </div>
                            <div>
                                <strong>Status:</strong>{" "}
                                <Badge
                                    bg={
                                        booking.status === "shared" ? "success" : "secondary"
                                    }
                                >
                                    {booking.bookingStage || booking.status}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ViewProposal;
