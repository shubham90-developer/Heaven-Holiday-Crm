"use client";

import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import {
    PackageBookingFormData,
    formatDisplayDate,
    getCustomerName,
} from "../../types/packageBooking";
import SendProposalToCustomerModal from "./SendProposalToCustomerModal";
import "../package-builder.scss";

type ProposalPreviewProps = {
    booking: PackageBookingFormData;
};

const addDays = (dateStr: string, days: number) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
};

const hasRichTextContent = (html?: string) => {
    if (!html?.trim()) return false;
    const text = html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .trim();
    return text.length > 0;
};

const dayDescriptionCardStyle: React.CSSProperties = {
    background: "#fff",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.12)",
    padding: "12px 16px",
    marginBottom: 10,
    fontSize: 12,
    color: "#444",
    lineHeight: 1.5,
};

const sectionBarStyle: React.CSSProperties = {
    background: "#5a5a5a",
    color: "#fff",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 600,
};

const ProposalPreview = ({ booking }: ProposalPreviewProps) => {
    const router = useRouter();
    const [showSendModal, setShowSendModal] = useState(false);
    const customer = booking.customerDetails;
    const customerName = getCustomerName(customer) || "Customer";
    const destination =
        booking.goingTo?.split("(")[0]?.trim() || booking.goingTo || "Destination";
    const nights = Math.max((booking.noOfDays || 1) - 1, 0);
    const totalDays = booking.noOfDays || booking.days?.length || 1;
    const total =
        Number(booking.sellingPrice || booking.totalSalesPrice || 0) || 0;

    const formatCurrency = (amount: number) =>
        `${booking.currency || "INR"} ${Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const formatCurrencyShort = (amount: number) =>
        `${booking.currency || "INR"} ${Number(amount || 0).toLocaleString("en-IN")}`;

    const days =
        booking.days?.length > 0
            ? [...booking.days].sort((a, b) => a.dayNumber - b.dayNumber)
            : Array.from({ length: totalDays }, (_, i) => ({
                  dayNumber: i + 1,
                  date: addDays(booking.travelDate, i),
                  location: destination,
                  title: "",
                  description: "",
                  saveAsMaster: false,
                  meals: { breakfast: false, lunch: false, dinner: false },
                  itineraryType: "Flight" as const,
              }));

    const hasOvernight = (dayNumber: number, day: (typeof days)[0]) => {
        const anyDay = day as { accommodation?: unknown; itineraryType?: string };
        if (anyDay.accommodation) return true;
        if (anyDay.itineraryType === "Accommodation") return true;
        return dayNumber < totalDays;
    };

    const inclusionsText =
        booking.terms?.inclusions ||
        [
            booking.hotelStayCities?.length
                ? `Hotel stay in ${booking.hotelStayCities
                      .map((c) => c.cityName)
                      .join(", ")}`
                : null,
            booking.flightCost?.total > 0 ? "Flights" : null,
            booking.visaCost?.total > 0 ? "Visa" : null,
        ]
            .filter(Boolean)
            .join(" · ") || "";

    const handleBackModify = () => {
        if (booking._id) {
            router.push(`/bookings/Packages/build-your-own?id=${booking._id}`);
        } else {
            router.back();
        }
    };

    const handleShareCustomer = () => {
        setShowSendModal(true);
    };

    return (
        <div
            style={{
                background: "#f0f0f0",
                minHeight: "100vh",
                margin: "-1rem",
                padding: "12px",
            }}
        >
            {/* Top header bar */}
            <div
                className="d-flex flex-wrap align-items-start gap-3 p-3 mb-3 bg-white border"
                style={{ borderRadius: 2 }}
            >
                <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "linear-gradient(145deg, #1a3a5c, #0d2137)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        textAlign: "center",
                        lineHeight: 1.2,
                        padding: 6,
                    }}
                >
                    HEAVEN
                    <br />
                    HOLIDAYS
                </div>

                <div className="flex-grow-1" style={{ minWidth: 220 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#222" }}>
                        Package For {customerName} {nights}N/{totalDays}D
                    </div>
                    <div style={{ fontSize: 14, color: "#333", marginTop: 2 }}>
                        {destination}
                    </div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                        {booking.travelers || 1} adult(s) ! Travelling On :{" "}
                        {formatDisplayDate(booking.travelDate) || "—"}
                    </div>
                </div>

                <div className="text-end" style={{ minWidth: 160 }}>
                    <div style={{ fontSize: 12, color: "#444" }}>
                        Total Cost :{" "}
                        <span style={{ color: "#e65100", fontWeight: 700 }}>
                            {formatCurrency(total)}
                        </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>
                        Grand Total :{" "}
                        <span style={{ color: "#e65100", fontWeight: 700 }}>
                            {formatCurrencyShort(total)}
                        </span>
                    </div>
                </div>

                <div className="d-flex flex-column align-items-end gap-2">
                    <Button
                        size="sm"
                        style={{
                            background: "#2b7bb9",
                            borderColor: "#2b7bb9",
                            fontSize: 12,
                            fontWeight: 600,
                            minWidth: 120,
                        }}
                        onClick={handleBackModify}
                    >
                        Back &amp; Modify
                    </Button>
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: 12, color: "#444" }}>Share To :</span>
                        <Button
                            size="sm"
                            style={{
                                background: "#e65100",
                                borderColor: "#e65100",
                                fontSize: 12,
                                fontWeight: 600,
                                minWidth: 90,
                            }}
                            onClick={handleShareCustomer}
                        >
                            Customer
                        </Button>
                    </div>
                </div>
            </div>

            <div
                className="bg-white border px-3 py-2 mb-3"
                style={{ fontSize: 12, color: "#444" }}
            >
                <strong>Inclusions :</strong>{" "}
                {inclusionsText || (
                    <span className="text-muted">No inclusions added</span>
                )}
            </div>

            <div className="d-flex gap-0" style={{ minHeight: 480 }}>
                {/* Main content */}
                <div className="flex-grow-1 bg-white border" style={{ minWidth: 0 }}>
                    <div style={sectionBarStyle}>Program at a glance</div>
                    <div style={{ minHeight: 48, padding: "10px 14px", fontSize: 12 }}>
                        {booking.hotelStayCities?.length > 0 ? (
                            <ul className="mb-0 ps-3">
                                {booking.hotelStayCities.map((city, idx) => (
                                    <li key={`${city.cityName}-${idx}`}>
                                        {city.cityName} — {city.nights} night(s) (
                                        {formatDisplayDate(city.checkIn)} to{" "}
                                        {formatDisplayDate(city.checkOut)})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span className="text-muted">—</span>
                        )}
                    </div>

                    <div style={sectionBarStyle}>Program Details</div>
                    <div className="p-3">
                        {days.map((day) => {
                            const dayDate =
                                day.date ||
                                addDays(booking.travelDate, day.dayNumber - 1);
                            return (
                                <div key={day.dayNumber} className="mb-4">
                                    <div
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 700,
                                            color: "#222",
                                            marginBottom: 8,
                                        }}
                                    >
                                        Day {day.dayNumber} (
                                        {formatDisplayDate(dayDate) || "—"})
                                    </div>

                                    {day.title && (
                                        <div
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                marginBottom: 4,
                                            }}
                                        >
                                            {day.title}
                                        </div>
                                    )}

                                    {hasRichTextContent(day.description) && (
                                        <div
                                            className="proposal-day-description"
                                            style={dayDescriptionCardStyle}
                                            dangerouslySetInnerHTML={{
                                                __html: day.description || "",
                                            }}
                                        />
                                    )}

                                    {(day.meals?.breakfast ||
                                        day.meals?.lunch ||
                                        day.meals?.dinner) && (
                                        <div
                                            style={{ fontSize: 11, color: "#666" }}
                                            className="mb-2"
                                        >
                                            Meals:{" "}
                                            {[
                                                day.meals.breakfast && "Breakfast",
                                                day.meals.lunch && "Lunch",
                                                day.meals.dinner && "Dinner",
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </div>
                                    )}

                                    {hasOvernight(day.dayNumber, day) && (
                                        <div className="text-center mb-2">
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    background: "#e65100",
                                                    color: "#fff",
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    padding: "4px 14px",
                                                    borderRadius: 999,
                                                }}
                                            >
                                                Overnight at the hotel.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div
                        style={{
                            ...sectionBarStyle,
                            textAlign: "center",
                            letterSpacing: 0.3,
                        }}
                    >
                        --- Other Information ---
                    </div>
                    <div style={{ minHeight: 56, padding: "12px 14px", fontSize: 12 }}>
                        {booking.terms?.exclusions ||
                        booking.terms?.termsAndConditions ||
                        booking.remark ? (
                            <div className="d-flex flex-column gap-2">
                                {booking.remark && (
                                    <div>
                                        <strong>Remark:</strong> {booking.remark}
                                    </div>
                                )}
                                {booking.terms?.exclusions && (
                                    <div>
                                        <strong>Exclusions:</strong>{" "}
                                        {booking.terms.exclusions}
                                    </div>
                                )}
                                {booking.terms?.termsAndConditions && (
                                    <div>
                                        <strong>T&amp;C:</strong>{" "}
                                        {booking.terms.termsAndConditions}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-muted">—</span>
                        )}
                    </div>
                </div>

                {/* Right navy sidebar */}
                <div
                    style={{
                        width: 260,
                        flexShrink: 0,
                        background: "#0d2137",
                        padding: 16,
                    }}
                >
                    <div
                        className="bg-white p-3"
                        style={{ borderRadius: 2, fontSize: 12 }}
                    >
                        <div
                            className="fw-bold text-center mb-2"
                            style={{ fontSize: 13, letterSpacing: 0.4 }}
                        >
                            A HEAVEN HOSPITALITY PVT LTD
                        </div>
                        <p className="mb-0 text-center" style={{ color: "#333" }}>
                            My Proposal Id-{booking.enquiryId || "—"}/Q/
                            {String(new Date().getFullYear()).slice(-2)}/
                            {booking.proposalId || "—"}/1 for your reference.
                        </p>
                    </div>

                    <div
                        className="mt-3 text-white"
                        style={{ fontSize: 11, opacity: 0.85 }}
                    >
                        <div className="d-flex align-items-center gap-1 mb-2">
                            <Icon icon="mdi:map-marker" width={14} />
                            {destination}
                        </div>
                        <div className="mb-1">
                            From: {booking.goingFrom || "—"}
                        </div>
                        <div className="mb-1">
                            Travelers: {booking.travelers || 1}
                        </div>
                        <div>
                            Status: {booking.bookingStage || booking.status}
                        </div>
                    </div>
                </div>
            </div>

            <SendProposalToCustomerModal
                show={showSendModal}
                onHide={() => setShowSendModal(false)}
                booking={booking}
            />
        </div>
    );
};

export default ProposalPreview;
