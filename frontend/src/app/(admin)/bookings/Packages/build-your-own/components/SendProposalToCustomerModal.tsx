"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import {
    PackageBookingFormData,
    formatDisplayDate,
    getCustomerName,
} from "../../types/packageBooking";
import "react-quill-new/dist/quill.snow.css";
import ProposalPdfDownloadModal from "./ProposalPdfDownloadModal";
import BookNowPaymentModal from "./BookNowPaymentModal";
import { buildWhatsAppProposalMessage } from "../utils/whatsappProposalUtils";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
    toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
    ],
};

const THEME_COLORS = [
    "#e91e63",
    "#9c27b0",
    "#2196f3",
    "#009688",
    "#ffeb3b",
    "#ff9800",
    "#f44336",
];

const addDays = (dateStr: string, days: number) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
};

type SendProposalToCustomerModalProps = {
    show: boolean;
    onHide: () => void;
    booking: PackageBookingFormData;
};

const SendProposalToCustomerModal = ({
    show,
    onHide,
    booking,
}: SendProposalToCustomerModalProps) => {
    const customer = booking.customerDetails;
    const customerName = getCustomerName(customer) || "Customer";
    const firstName = customer?.firstName || customerName.split(" ")[0] || "";
    const lastName =
        customer?.lastName ||
        customerName.split(" ").slice(1).join(" ") ||
        "";
    const destination =
        booking.goingTo?.split("(")[0]?.trim() || booking.goingTo || "Destination";
    const nights = Math.max((booking.noOfDays || 1) - 1, 0);
    const totalDays = booking.noOfDays || 1;
    const currency = booking.currency || "INR";
    const checkOut =
        booking.hotelStayCities?.[booking.hotelStayCities.length - 1]?.checkOut ||
        addDays(booking.travelDate, Math.max(totalDays - 1, 0));

    const defaultTitle = useMemo(
        () =>
            `Trip detail for ${firstName || customerName} for ${destination} Q/${String(
                new Date().getFullYear()
            ).slice(-2)}`,
        [firstName, customerName, destination]
    );

    const defaultSubject = useMemo(
        () =>
            `${firstName || customerName} your ${destination} trip details from A HEAVEN HOSPITALITY`,
        [firstName, customerName, destination]
    );

    const [packageTitle, setPackageTitle] = useState(defaultTitle);
    const [taxIncl, setTaxIncl] = useState(true);
    const [emailSubject, setEmailSubject] = useState(defaultSubject);
    const [cc, setCc] = useState("");
    const [email, setEmail] = useState(customer?.email || "");
    const [firstNameValue, setFirstNameValue] = useState(firstName);
    const [lastNameValue, setLastNameValue] = useState(lastName);
    const [phone, setPhone] = useState(customer?.mobile || "");
    const [senderEmail, setSenderEmail] = useState("");
    const [messageBody, setMessageBody] = useState(
        `<p>Dear ${firstName || "Guest"},</p><p>Please find your ${destination} trip proposal details attached.</p><p>Regards,<br/>A HEAVEN HOSPITALITY</p>`
    );
    const [proposalType, setProposalType] = useState<"summary" | "detailed">(
        "detailed"
    );
    const [themeColor, setThemeColor] = useState(THEME_COLORS[0]);
    const [mailChecked, setMailChecked] = useState(true);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [showBookNowModal, setShowBookNowModal] = useState(false);

    useEffect(() => {
        if (!show) return;
        setPackageTitle(defaultTitle);
        setEmailSubject(defaultSubject);
        setEmail(customer?.email || "");
        setFirstNameValue(firstName);
        setLastNameValue(lastName);
        setPhone(customer?.mobile || "");
        setMessageBody(
            `<p>Dear ${firstName || "Guest"},</p><p>Please find your ${destination} trip proposal details attached.</p><p>Regards,<br/>A HEAVEN HOSPITALITY</p>`
        );
        setProposalType("detailed");
        setThemeColor(THEME_COLORS[0]);
        setTaxIncl(true);
        setMailChecked(true);
        setCc("");
        setSenderEmail("");
        setShowPdfModal(false);
        setShowBookNowModal(false);
    }, [
        show,
        defaultTitle,
        defaultSubject,
        customer?.email,
        customer?.mobile,
        firstName,
        lastName,
        destination,
    ]);

    const handleCopyClipboard = async () => {
        const whatsappMessage = buildWhatsAppProposalMessage(booking, {
            customerFirstName: firstNameValue,
            customerLastName: lastNameValue,
            taxIncl,
            proposalType,
            tripManagerName: booking.owner || customer?.rm || "RAJENDRA BUGADE",
            tripManagerPhone: "+91 8602410707",
        });

        try {
            await navigator.clipboard.writeText(whatsappMessage);
            toast.success("WhatsApp proposal copied to clipboard");
        } catch {
            toast.error("Unable to copy");
        }
    };

    const handleSend = () => {
        if (mailChecked && !email.trim()) {
            toast.error("Recipient email is required");
            return;
        }
        if (!emailSubject.trim()) {
            toast.error("Email subject is required");
            return;
        }
        setShowPdfModal(true);
    };

    const handlePdfModalComplete = () => {
        setShowPdfModal(false);
        onHide();
    };

    const handleBookNow = () => {
        if (!booking._id) {
            toast.error("Save the package booking before collecting payment");
            return;
        }
        setShowBookNowModal(true);
    };

    const labelStyle: React.CSSProperties = {
        fontSize: 11,
        color: "#1e5a8a",
        fontWeight: 600,
        marginBottom: 4,
    };

    const inputStyle: React.CSSProperties = {
        fontSize: 12,
        borderColor: "#7eb6d9",
    };

    return (
        <>
        <Modal show={show && !showPdfModal && !showBookNowModal} onHide={onHide} size="xl" centered backdrop="static">
            <Modal.Header
                className="py-2"
                style={{ background: "#1e3a5f", color: "#fff" }}
                closeButton
                closeVariant="white"
            >
                <Modal.Title style={{ fontSize: 15, fontWeight: 600 }}>
                    Send Proposal To Customer (Currency is {currency} )
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-3" style={{ background: "#fff" }}>
                {/* Package summary row */}
                <div
                    className="d-flex flex-wrap align-items-end gap-3 mb-3 pb-2 border-bottom"
                    style={{ fontSize: 12 }}
                >
                    <div style={{ flex: "1 1 220px", minWidth: 200 }}>
                        <div style={labelStyle}>Package Title</div>
                        <Form.Control
                            size="sm"
                            value={packageTitle}
                            onChange={(e) => setPackageTitle(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <div style={labelStyle}>Destination</div>
                        <div className="fw-bold">{destination}</div>
                    </div>
                    <div>
                        <div style={labelStyle}>Day/Night</div>
                        <div className="fw-bold">
                            {nights} Nights / {totalDays} Days
                        </div>
                    </div>
                    <div>
                        <div style={labelStyle}>Pax Detail</div>
                        <div className="fw-bold">{booking.travelers || 1} Adult</div>
                    </div>
                    <div>
                        <div style={labelStyle}>Travel Date</div>
                        <div className="fw-bold">
                            {formatDisplayDate(booking.travelDate) || "—"}
                        </div>
                    </div>
                </div>

                <Form.Check
                    type="checkbox"
                    id="tax-incl"
                    checked={taxIncl}
                    onChange={(e) => setTaxIncl(e.target.checked)}
                    label="TAX INCL. (unclick if you want to show tax separately.)"
                    className="mb-3"
                    style={{ fontSize: 12 }}
                />

                <Row className="g-3">
                    <Col md={6}>
                        <Form.Group className="mb-2">
                            <Form.Label style={labelStyle}>
                                Email Subject<span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                style={inputStyle}
                            />
                        </Form.Group>

                        <Row className="g-2 mb-2">
                            <Col xs={7}>
                                <Form.Control
                                    size="sm"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={inputStyle}
                                    placeholder="Recipient email"
                                />
                            </Col>
                            <Col xs={5}>
                                <Form.Control
                                    size="sm"
                                    value={firstNameValue}
                                    onChange={(e) => setFirstNameValue(e.target.value)}
                                    style={inputStyle}
                                    placeholder="First name"
                                />
                            </Col>
                        </Row>

                        <Form.Group className="mb-2">
                            <Form.Label style={labelStyle}>Sender Email ID</Form.Label>
                            <Form.Select
                                size="sm"
                                value={senderEmail}
                                onChange={(e) => setSenderEmail(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="">Select</option>
                                <option value="info@aheavenhospitality.com">
                                    info@aheavenhospitality.com
                                </option>
                                <option value="sales@aheavenhospitality.com">
                                    sales@aheavenhospitality.com
                                </option>
                                <option value="ops@aheavenhospitality.com">
                                    ops@aheavenhospitality.com
                                </option>
                            </Form.Select>
                        </Form.Group>

                        <div style={{ fontSize: 12, color: "#333" }} className="mt-3">
                            <div>
                                Check In / Out :{" "}
                                {formatDisplayDate(booking.travelDate) || "—"} -{" "}
                                {formatDisplayDate(checkOut) || "—"}
                            </div>
                            <div className="mt-1">Destinations : {destination}</div>
                        </div>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mb-2">
                            <Form.Label style={labelStyle}>Cc</Form.Label>
                            <Form.Control
                                size="sm"
                                value={cc}
                                onChange={(e) => setCc(e.target.value)}
                                placeholder="Cc email id"
                                style={inputStyle}
                            />
                        </Form.Group>

                        <Row className="g-2 mb-2">
                            <Col xs={5}>
                                <Form.Control
                                    size="sm"
                                    value={lastNameValue}
                                    onChange={(e) => setLastNameValue(e.target.value)}
                                    style={inputStyle}
                                    placeholder="Last name"
                                />
                            </Col>
                            <Col xs={7}>
                                <div className="input-group input-group-sm">
                                    <span
                                        className="input-group-text"
                                        style={{
                                            fontSize: 12,
                                            background: "#fff",
                                            borderColor: "#7eb6d9",
                                        }}
                                    >
                                        🇮🇳 +91
                                    </span>
                                    <Form.Control
                                        size="sm"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        style={inputStyle}
                                        placeholder="Phone"
                                    />
                                </div>
                            </Col>
                        </Row>

                        {/* <div
                            className="send-proposal-quill"
                            style={{
                                border: "1px solid #7eb6d9",
                                borderRadius: 4,
                                overflow: "hidden",
                                minHeight: 160,
                            }}
                        >
                            <ReactQuill
                                theme="snow"
                                value={messageBody}
                                onChange={setMessageBody}
                                modules={quillModules}
                                placeholder="Email message..."
                                style={{ minHeight: 140 }}
                            />
                        </div> */}
                    </Col>
                </Row>

                <div className="d-flex flex-wrap align-items-center gap-4 mt-3 mb-2">
                    <div className="d-flex align-items-center gap-3" style={{ fontSize: 12 }}>
                        <span style={{ fontWeight: 600 }}>Proposal Type :</span>
                        <Form.Check
                            type="radio"
                            id="proposal-summary"
                            name="proposalType"
                            label="Summary Proposal New"
                            checked={proposalType === "summary"}
                            onChange={() => setProposalType("summary")}
                        />
                        <Form.Check
                            type="radio"
                            id="proposal-detailed"
                            name="proposalType"
                            label="Detailed proposal"
                            checked={proposalType === "detailed"}
                            onChange={() => setProposalType("detailed")}
                        />
                    </div>
                </div>

                <div
                    className="d-flex align-items-center gap-2 px-2 py-2 mb-1"
                    style={{ background: "#e9ecef", borderRadius: 2 }}
                >
                    {THEME_COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            aria-label={`Theme ${color}`}
                            onClick={() => setThemeColor(color)}
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: color,
                                border:
                                    themeColor === color
                                        ? "3px solid #fff"
                                        : "2px solid transparent",
                                boxShadow:
                                    themeColor === color
                                        ? "0 0 0 2px #333"
                                        : "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        />
                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer className="d-flex flex-wrap justify-content-between gap-2 py-2">
                <Button
                    size="sm"
                    style={{
                        background: "#e65100",
                        borderColor: "#e65100",
                        fontWeight: 600,
                        minWidth: 100,
                    }}
                    onClick={handleBookNow}
                >
                    Book Now
                </Button>

                <div className="d-flex align-items-center gap-3">
                    <Form.Check
                        type="checkbox"
                        id="mail-check"
                        checked={mailChecked}
                        onChange={(e) => setMailChecked(e.target.checked)}
                        label="Mail"
                        style={{ fontSize: 12 }}
                    />
                    <Button
                        size="sm"
                        style={{
                            background: "#2e7d32",
                            borderColor: "#2e7d32",
                            fontWeight: 600,
                        }}
                        onClick={handleCopyClipboard}
                    >
                        Copy To Clipboard
                    </Button>
                </div>

                <div className="d-flex gap-2">
                    <Button
                        size="sm"
                        variant="outline-warning"
                        style={{
                            color: "#e65100",
                            borderColor: "#e65100",
                            fontWeight: 600,
                            minWidth: 80,
                        }}
                        onClick={onHide}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        style={{
                            background: "#e65100",
                            borderColor: "#e65100",
                            fontWeight: 600,
                            minWidth: 80,
                        }}
                        onClick={handleSend}
                    >
                        Send
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>

        <ProposalPdfDownloadModal
            show={show && showPdfModal}
            onHide={() => setShowPdfModal(false)}
            onComplete={handlePdfModalComplete}
            booking={booking}
            packageTitle={packageTitle}
            emailSubject={emailSubject}
            messageBody={messageBody}
            taxIncl={taxIncl}
            mailChecked={mailChecked}
            customerFirstName={firstNameValue}
            customerLastName={lastNameValue}
            phone={phone}
        />

        <BookNowPaymentModal
            show={show && showBookNowModal}
            booking={booking}
            onHide={() => setShowBookNowModal(false)}
            onSuccess={() => {
                setShowBookNowModal(false);
                onHide();
            }}
        />
        </>
    );
};

export default SendProposalToCustomerModal;
