"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { PackageBookingFormData } from "../../types/packageBooking";
import {
    DEFAULT_PDF_SECTIONS,
    PDF_SECTION_LABELS,
    PdfSectionKey,
    PdfSectionOptions,
    buildProposalPdfHtml,
    downloadProposalPdf,
    getProposalCustomerName,
} from "../utils/proposalPdfUtils";
import { buildWhatsAppProposalMessage } from "../utils/whatsappProposalUtils";

type ProposalPdfDownloadModalProps = {
    show: boolean;
    onHide: () => void;
    onComplete?: () => void;
    booking: PackageBookingFormData;
    packageTitle: string;
    emailSubject: string;
    messageBody: string;
    taxIncl: boolean;
    mailChecked: boolean;
    customerFirstName: string;
    customerLastName: string;
    phone: string;
};

const ProposalPdfDownloadModal = ({
    show,
    onHide,
    onComplete,
    booking,
    packageTitle,
    emailSubject,
    messageBody,
    taxIncl,
    mailChecked,
    customerFirstName,
    customerLastName,
    phone,
}: ProposalPdfDownloadModalProps) => {
    const [sections, setSections] =
        useState<PdfSectionOptions>(DEFAULT_PDF_SECTIONS);
    const [showPdfOptions, setShowPdfOptions] = useState(false);
    const [copied, setCopied] = useState(false);
    const pdfOptionsRef = useRef<HTMLDivElement>(null);

    const destination =
        booking.goingTo?.split("(")[0]?.trim() || booking.goingTo || "Destination";
    const customerName =
        [customerFirstName, customerLastName].filter(Boolean).join(" ") ||
        getProposalCustomerName(booking);
    const currency = booking.currency || "INR";

    const whatsappMessage = useMemo(
        () =>
            buildWhatsAppProposalMessage(booking, {
                customerFirstName,
                customerLastName,
                taxIncl,
                tripManagerName: booking.owner || booking.customerDetails?.rm || "RAJENDRA BUGADE",
                tripManagerPhone: "+91 8602410707",
            }),
        [booking, customerFirstName, customerLastName, taxIncl]
    );

    useEffect(() => {
        if (!show) return;
        setSections({ ...DEFAULT_PDF_SECTIONS });
        setShowPdfOptions(false);
        setCopied(false);
    }, [show]);

    useEffect(() => {
        if (!showPdfOptions) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                pdfOptionsRef.current &&
                !pdfOptionsRef.current.contains(event.target as Node)
            ) {
                setShowPdfOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPdfOptions]);

    const toggleSection = (key: PdfSectionKey) => {
        setSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const buildPdf = () =>
        buildProposalPdfHtml({
            booking,
            sections,
            packageTitle,
            customerName,
            destination,
            taxIncl,
        });

    const handleDownloadPdf = () => {
        const selectedCount = Object.values(sections).filter(Boolean).length;
        if (!selectedCount) {
            toast.error("Select at least one section to download");
            return;
        }

        try {
            const safeName = packageTitle.replace(/[^\w\s-]/g, "").trim() || "proposal";
            downloadProposalPdf(buildPdf(), `${safeName}.pdf`);
            toast.success("PDF opened — use Save as PDF in the print dialog");
            setShowPdfOptions(false);
        } catch {
            toast.error("Unable to open PDF. Allow popups and try again.");
        }
    };

    const handlePrintEmailPdf = () => {
        try {
            const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${emailSubject}</title>
                <style>body{font-family:Arial,sans-serif;padding:24px;font-size:13px;white-space:pre-wrap;line-height:1.6;}</style>
                </head><body>${whatsappMessage.replace(/\n/g, "<br/>")}</body></html>`;
            downloadProposalPdf(html, "email-proposal.pdf");
            toast.success("Email PDF opened in print dialog");
        } catch {
            toast.error("Unable to print email PDF");
        }
    };

    const handleCopyClipboard = async () => {
        try {
            await navigator.clipboard.writeText(whatsappMessage);
            setCopied(true);
            toast.success("WhatsApp proposal copied to clipboard");
            setTimeout(() => setCopied(false), 2500);
        } catch {
            toast.error("Unable to copy");
        }
    };

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(whatsappMessage);
        const phoneDigits = phone.replace(/\D/g, "");
        const url = phoneDigits
            ? `https://wa.me/91${phoneDigits.replace(/^91/, "")}?text=${text}`
            : `https://wa.me/?text=${text}`;
        window.open(url, "_blank");
    };

    const handleFinishSend = () => {
        toast.success(
            mailChecked
                ? "Proposal sent to customer"
                : "Proposal prepared successfully"
        );
        onComplete?.();
    };

    const leftSections = PDF_SECTION_LABELS.slice(0, 6);
    const rightSections = PDF_SECTION_LABELS.slice(6);

    return (
        <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
            <Modal.Header
                className="py-2"
                style={{ background: "#1e3a5f", color: "#fff" }}
                closeButton
                closeVariant="white"
            >
                <Modal.Title style={{ fontSize: 15, fontWeight: 600 }}>
                    Send Proposal To Customer (Currency is {currency})
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-3" style={{ background: "#f5f5f5" }}>
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #d0d0d0",
                        borderRadius: 2,
                        padding: "16px 18px",
                        fontSize: 13,
                        lineHeight: 1.65,
                        color: "#222",
                        whiteSpace: "pre-wrap",
                        maxHeight: 360,
                        overflowY: "auto",
                    }}
                >
                    {whatsappMessage}
                </div>
            </Modal.Body>

            <Modal.Footer
                className="d-flex flex-wrap justify-content-between align-items-end gap-2 py-2 px-3 position-relative"
                style={{ background: "#fff" }}
            >
                <div className="d-flex flex-wrap align-items-center gap-2 position-relative">
                    <div className="btn-group" ref={pdfOptionsRef}>
                        <Button
                            size="sm"
                            style={{
                                background: "#2b7bb9",
                                borderColor: "#2b7bb9",
                                fontWeight: 600,
                            }}
                            onClick={() => setShowPdfOptions((prev) => !prev)}
                        >
                            Default PDF
                        </Button>
                        <Button
                            size="sm"
                            style={{
                                background: "#2b7bb9",
                                borderColor: "#2b7bb9",
                                fontWeight: 600,
                            }}
                            onClick={() => setShowPdfOptions((prev) => !prev)}
                        >
                            <Icon icon="mdi:chevron-down" width={18} />
                        </Button>
                    </div>

                    <Button
                        size="sm"
                        style={{
                            background: "#2b7bb9",
                            borderColor: "#2b7bb9",
                            fontWeight: 600,
                        }}
                        onClick={handlePrintEmailPdf}
                    >
                        Print Email PDF
                    </Button>

                    {showPdfOptions && (
                        <div
                            className="proposal-pdf-options-popover"
                            style={{
                                position: "absolute",
                                left: 0,
                                bottom: "calc(100% + 8px)",
                                zIndex: 1060,
                                background: "#fff",
                                border: "1px solid #c5cdd6",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                padding: "14px 16px",
                                minWidth: 420,
                            }}
                        >
                            <div className="row g-2">
                                <div className="col-6">
                                    {leftSections.map(({ key, label }) => (
                                        <Form.Check
                                            key={key}
                                            type="checkbox"
                                            id={`pdf-section-${key}`}
                                            className="mb-1"
                                            style={{ fontSize: 12 }}
                                            label={label}
                                            checked={sections[key]}
                                            onChange={() => toggleSection(key)}
                                        />
                                    ))}
                                </div>
                                <div className="col-6">
                                    {rightSections.map(({ key, label }) => (
                                        <Form.Check
                                            key={key}
                                            type="checkbox"
                                            id={`pdf-section-${key}`}
                                            className="mb-1"
                                            style={{ fontSize: 12 }}
                                            label={label}
                                            checked={sections[key]}
                                            onChange={() => toggleSection(key)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="text-end mt-2">
                                <Button
                                    size="sm"
                                    style={{
                                        background: "#2b7bb9",
                                        borderColor: "#2b7bb9",
                                        fontWeight: 600,
                                        minWidth: 90,
                                    }}
                                    onClick={handleDownloadPdf}
                                >
                                    Download
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                    {copied && (
                        <span
                            style={{
                                background: "#2e7d32",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 600,
                                padding: "4px 10px",
                                borderRadius: 4,
                            }}
                        >
                            Copied
                        </span>
                    )}

                    <Button
                        size="sm"
                        variant="outline-warning"
                        style={{
                            color: "#e65100",
                            borderColor: "#e65100",
                            fontWeight: 600,
                        }}
                        onClick={onHide}
                    >
                        Back
                    </Button>

                    <Button
                        size="sm"
                        variant="outline-warning"
                        style={{
                            color: "#e65100",
                            borderColor: "#e65100",
                            fontWeight: 600,
                        }}
                        onClick={handleCopyClipboard}
                    >
                        Copy to clipboard
                    </Button>

                    <Button
                        size="sm"
                        style={{
                            background: "#25d366",
                            borderColor: "#25d366",
                            fontWeight: 600,
                        }}
                        onClick={handleWhatsAppShare}
                    >
                        <Icon icon="mdi:whatsapp" className="me-1" />
                        Share on whatsapp
                    </Button>

                    <Button
                        size="sm"
                        style={{
                            background: "#e65100",
                            borderColor: "#e65100",
                            fontWeight: 600,
                            minWidth: 80,
                        }}
                        onClick={handleFinishSend}
                    >
                        Send
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ProposalPdfDownloadModal;
