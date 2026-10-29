"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PackageBookingFormData } from "../../types/packageBooking";
import { useCreateDailyCollectionMutation } from "@/store/services/finance/dailyCollectionApi";
import { useVerifyUserQuery } from "@/store/services/auth/authApi";

const OFFLINE_MODES = [
    "Offline - Cash",
    "Offline - UPI",
    "Offline - Cheque",
    "Offline - Bank Transfer",
    "Offline - Card",
] as const;

type BookNowPaymentModalProps = {
    show: boolean;
    booking: PackageBookingFormData | null;
    onHide: () => void;
    onSuccess?: () => void;
};

const BookNowPaymentModal = ({
    show,
    booking,
    onHide,
    onSuccess,
}: BookNowPaymentModalProps) => {
    const [step, setStep] = useState<"overview" | "offline" | "online">("overview");
    const [payAmount, setPayAmount] = useState("");
    const [mode, setMode] = useState<(typeof OFFLINE_MODES)[number]>("Offline - Cash");
    const [reference, setReference] = useState("");
    const [remarks, setRemarks] = useState("");
    const [createCollection, { isLoading }] = useCreateDailyCollectionMutation();
    const { data: authData } = useVerifyUserQuery(undefined);

    useEffect(() => {
        if (!show) {
            setStep("overview");
            setPayAmount("");
            setMode("Offline - Cash");
            setReference("");
            setRemarks("");
            return;
        }

        if (!booking) return;

        const packageCost = Number(booking.sellingPrice || booking.totalSalesPrice || 0);
        const received = Number(booking.received || 0);
        const outstanding = Math.max(packageCost - received, 0);
        const advance = Number(booking.advance || 0);

        if (advance > 0 && advance <= outstanding) {
            setPayAmount(String(advance));
        } else if (outstanding > 0) {
            setPayAmount(String(outstanding));
        } else {
            setPayAmount("");
        }
    }, [show, booking]);

    if (!booking) return null;

    const currency = booking.currency || "INR";
    const packageCost = Number(booking.sellingPrice || booking.totalSalesPrice || 0);
    const received = Number(booking.received || 0);
    const outstanding = Math.max(packageCost - received, 0);
    const receivedBy =
        authData?.user?.name ||
        authData?.data?.name ||
        authData?.user?.email ||
        "Staff";

    const formatMoney = (value: number) =>
        `${currency} ${value.toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })}`;

    const handleConfirmOffline = async () => {
        const amount = Number(payAmount);
        if (!amount || amount <= 0) {
            toast.error("Enter a valid payment amount");
            return;
        }
        if (outstanding > 0 && amount > outstanding) {
            toast.error(`Amount cannot exceed outstanding ${formatMoney(outstanding)}`);
            return;
        }
        if (!booking._id) {
            toast.error("Booking must be saved before collecting payment");
            return;
        }

        try {
            await createCollection({
                bookingId: booking._id,
                amount,
                mode,
                paymentChannel: "offline",
                reference,
                remarks,
                particulars: "Package Booking Payment",
                receivedBy,
            }).unwrap();

            toast.success("Offline payment submitted. Pending finance approval.");
            onSuccess?.();
            onHide();
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to record payment");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
            <Modal.Header
                closeButton
                closeVariant="white"
                style={{ background: "#274c6b", color: "#fff" }}
            >
                <Modal.Title style={{ fontSize: 14, fontWeight: 600 }}>
                    Book Now — Payment
                    {booking.proposalId ? ` (Proposal #${booking.proposalId})` : ""}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ fontSize: 13 }}>
                <div className="mb-3 p-2 border rounded bg-light">
                    <div className="d-flex flex-wrap gap-3" style={{ fontSize: 12 }}>
                        <div>
                            <span className="text-muted">Customer: </span>
                            <strong>
                                {booking.customerDetails?.firstName || ""}{" "}
                                {booking.customerDetails?.lastName ||
                                    booking.customerDetails?.companyName ||
                                    ""}
                            </strong>
                        </div>
                        <div>
                            <span className="text-muted">Destination: </span>
                            <strong>{booking.goingTo || "—"}</strong>
                        </div>
                        <div>
                            <span className="text-muted">Travel Date: </span>
                            <strong>{booking.travelDate || "—"}</strong>
                        </div>
                    </div>
                </div>

                <Table bordered size="sm" className="mb-0">
                    <tbody>
                        <tr>
                            <td>Package Cost (Inc. GST)</td>
                            <td className="text-end fw-semibold">{formatMoney(packageCost)}</td>
                        </tr>
                        <tr>
                            <td>Amount Received (Approved)</td>
                            <td className="text-end">{formatMoney(received)}</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Outstanding Balance</strong>
                            </td>
                            <td className="text-end fw-bold text-danger">
                                {formatMoney(outstanding)}
                            </td>
                        </tr>
                        {booking.paymentStatus && booking.paymentStatus !== "none" && (
                            <tr>
                                <td>Payment Status</td>
                                <td className="text-end text-capitalize">
                                    {booking.paymentStatus}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {step === "offline" && (
                    <div className="mt-3 p-3 border rounded">
                        <div className="fw-semibold mb-2" style={{ fontSize: 13 }}>
                            Pay Offline
                        </div>
                        <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: 12 }}>
                                Amount ({currency})
                            </Form.Label>
                            <Form.Control
                                type="number"
                                size="sm"
                                value={payAmount}
                                onChange={(e) => setPayAmount(e.target.value)}
                                min={1}
                                max={outstanding || undefined}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: 12 }}>Mode of Payment</Form.Label>
                            <Form.Select
                                size="sm"
                                value={mode}
                                onChange={(e) =>
                                    setMode(e.target.value as (typeof OFFLINE_MODES)[number])
                                }
                            >
                                {OFFLINE_MODES.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: 12 }}>
                                Reference / Cheque / UPI Ref
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Optional reference"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontSize: 12 }}>Remarks</Form.Label>
                            <Form.Control
                                size="sm"
                                as="textarea"
                                rows={2}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Optional remarks"
                            />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={handleConfirmOffline}
                                disabled={isLoading || outstanding <= 0}
                            >
                                {isLoading ? "Submitting..." : "Confirm Offline Payment"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() => setStep("overview")}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                        </div>
                        <div className="mt-2 text-muted" style={{ fontSize: 11 }}>
                            Payment will stay <strong>Pending</strong> until Finance approves
                            it in Daily Collection.
                        </div>
                    </div>
                )}

                {step === "online" && (
                    <div className="mt-3 p-3 border rounded text-center">
                        <Icon
                            icon="mdi:credit-card-wireless-outline"
                            width={36}
                            className="mb-2 text-primary"
                        />
                        <div className="fw-semibold mb-1">Online Payment (Razorpay)</div>
                        <p className="text-muted mb-3" style={{ fontSize: 12 }}>
                            Online payment with Razorpay will be added here next. Please use
                            Pay Offline for now.
                        </p>
                        <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => setStep("overview")}
                        >
                            Back
                        </Button>
                    </div>
                )}
            </Modal.Body>

            {step === "overview" && (
                <Modal.Footer className="d-flex justify-content-between">
                    <div className="d-flex gap-2">
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setStep("offline")}
                            disabled={outstanding <= 0}
                        >
                            Pay Offline
                        </Button>
                        <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => setStep("online")}
                            disabled={outstanding <= 0}
                        >
                            Pay Online
                        </Button>
                    </div>
                    <Button size="sm" variant="outline-danger" onClick={onHide}>
                        Cancel
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default BookNowPaymentModal;
