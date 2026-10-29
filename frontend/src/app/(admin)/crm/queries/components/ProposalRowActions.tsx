"use client";

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    PROPOSAL_SELECT_ACTIONS,
    ProposalBooking,
    ProposalSelectAction,
} from "../utils/proposalHelpers";
import { buildWhatsAppProposalMessage } from "@/app/(admin)/bookings/Packages/build-your-own/utils/whatsappProposalUtils";
import {
    DEFAULT_PDF_SECTIONS,
    buildProposalPdfHtml,
    downloadProposalPdf,
} from "@/app/(admin)/bookings/Packages/build-your-own/utils/proposalPdfUtils";
import { useUpdatePackageBookingMutation } from "@/store/services/booking/packageBookingApi";
import SendProposalToCustomerModal from "@/app/(admin)/bookings/Packages/build-your-own/components/SendProposalToCustomerModal";
import BookNowPaymentModal from "@/app/(admin)/bookings/Packages/build-your-own/components/BookNowPaymentModal";

type ProposalRowActionsProps = {
    booking: ProposalBooking;
    showIcons?: boolean;
    selectClassName?: string;
};

const ProposalRowActions = ({
    booking,
    showIcons = true,
    selectClassName,
}: ProposalRowActionsProps) => {
    const router = useRouter();
    const [selectValue, setSelectValue] = useState("");
    const [showSendModal, setShowSendModal] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);
    const [updateBooking, { isLoading }] = useUpdatePackageBookingMutation();

    const handleView = () => {
        router.push(`/bookings/Packages/build-your-own/preview?id=${booking._id}`);
    };

    const handleModify = () => {
        router.push(`/bookings/Packages/build-your-own?id=${booking._id}`);
    };

    const handleWhatsApp = async () => {
        const message = buildWhatsAppProposalMessage(booking);
        const phone = (booking.customerDetails?.mobile || "").replace(/\D/g, "");
        try {
            await navigator.clipboard.writeText(message);
            toast.success("WhatsApp proposal copied");
        } catch {
            /* ignore clipboard errors */
        }
        const url = phone
            ? `https://wa.me/91${phone.replace(/^91/, "")}?text=${encodeURIComponent(message)}`
            : `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const handlePdf = () => {
        try {
            const customerName =
                [
                    booking.customerDetails?.firstName,
                    booking.customerDetails?.lastName,
                ]
                    .filter(Boolean)
                    .join(" ") || "Customer";
            const destination =
                booking.goingTo?.split("(")[0]?.trim() ||
                booking.goingTo ||
                "Destination";
            const html = buildProposalPdfHtml({
                booking,
                sections: { ...DEFAULT_PDF_SECTIONS },
                packageTitle: `Proposal ${booking.proposalId || ""}`,
                customerName,
                destination,
                taxIncl: true,
            });
            downloadProposalPdf(
                html,
                `proposal-${booking.proposalId || booking._id}.pdf`
            );
            toast.success("PDF opened — use Save as PDF in the print dialog");
        } catch {
            toast.error("Unable to open PDF");
        }
    };

    const handleDiscard = async () => {
        try {
            await updateBooking({
                id: booking._id,
                status: "cancelled",
                bookingStage: "Discarded",
            }).unwrap();
            toast.success("Proposal discarded");
        } catch {
            toast.error("Failed to discard proposal");
        }
    };

    const handleAction = async (action: ProposalSelectAction) => {
        setSelectValue("");
        switch (action) {
            case "view":
                handleView();
                break;
            case "modify":
                handleModify();
                break;
            case "resend":
                setShowSendModal(true);
                break;
            case "whatsapp":
                await handleWhatsApp();
                break;
            case "pdf":
                handlePdf();
                break;
            case "book":
                setShowBookModal(true);
                break;
            case "discard":
                await handleDiscard();
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className={`d-flex gap-2 align-items-start ${selectClassName || ""}`}>
                {showIcons && (
                    <div className="d-flex flex-column gap-1">
                        <Button
                            variant="success"
                            size="sm"
                            style={{ fontSize: "10px" }}
                            title="View Proposal"
                            onClick={handleView}
                        >
                            <Icon icon="mdi:eye-outline" />
                        </Button>
                        <Button
                            variant="outline-success"
                            size="sm"
                            style={{ fontSize: "10px" }}
                            title="Share on WhatsApp"
                            onClick={handleWhatsApp}
                        >
                            <Icon icon="mdi:whatsapp" />
                        </Button>
                    </div>
                )}

                <Form.Select
                    size="sm"
                    style={{ fontSize: "12px", minWidth: 130 }}
                    value={selectValue}
                    disabled={isLoading}
                    onChange={(e) =>
                        handleAction(e.target.value as ProposalSelectAction)
                    }
                >
                    {PROPOSAL_SELECT_ACTIONS.map((opt) => (
                        <option key={opt.value || "select"} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </Form.Select>
            </div>

            <SendProposalToCustomerModal
                show={showSendModal}
                onHide={() => setShowSendModal(false)}
                booking={booking}
            />

            <BookNowPaymentModal
                show={showBookModal}
                booking={booking}
                onHide={() => setShowBookModal(false)}
            />
        </>
    );
};

export default ProposalRowActions;
