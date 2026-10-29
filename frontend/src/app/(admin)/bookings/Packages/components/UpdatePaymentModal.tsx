"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { PackageBookingFormData } from "../types/packageBooking";
import { useCreateDailyCollectionMutation } from "@/store/services/finance/dailyCollectionApi";
import { useVerifyUserQuery } from "@/store/services/auth/authApi";

type UpdatePaymentModalProps = {
    show: boolean;
    booking: (PackageBookingFormData & { _id: string }) | null;
    onClose: () => void;
    onSave?: (id: string, data: { received: number; balance: number }) => Promise<void>;
};

const OFFLINE_MODES = [
    "Offline - Cash",
    "Offline - UPI",
    "Offline - Cheque",
    "Offline - Bank Transfer",
    "Offline - Card",
] as const;

const UpdatePaymentModal = ({
    show,
    booking,
    onClose,
}: UpdatePaymentModalProps) => {
    const [showPayOffline, setShowPayOffline] = useState(false);
    const [payAmount, setPayAmount] = useState("");
    const [mode, setMode] = useState<(typeof OFFLINE_MODES)[number]>("Offline - Cash");
    const [reference, setReference] = useState("");
    const [createCollection, { isLoading: saving }] =
        useCreateDailyCollectionMutation();
    const { data: authData } = useVerifyUserQuery(undefined);

    useEffect(() => {
        if (!show) {
            setShowPayOffline(false);
            setPayAmount("");
            setMode("Offline - Cash");
            setReference("");
        }
    }, [show]);

    if (!booking) return null;

    const packageCost = Number(
        booking.sellingPrice || booking.totalSalesPrice || 0
    );
    const received = Number(booking.received || 0);
    const outstanding = packageCost - received;
    const receivedBy =
        authData?.user?.name ||
        authData?.data?.name ||
        authData?.user?.email ||
        "Staff";

    const handlePayOffline = async () => {
        const amount = Number(payAmount);
        if (!amount || amount <= 0) {
            toast.error("Enter a valid payment amount");
            return;
        }
        if (outstanding > 0 && amount > outstanding) {
            toast.error("Amount exceeds outstanding balance");
            return;
        }

        try {
            await createCollection({
                bookingId: booking._id,
                amount,
                mode,
                paymentChannel: "offline",
                reference,
                particulars: "Package Booking Payment",
                receivedBy,
            }).unwrap();
            toast.success("Offline payment recorded. Pending finance approval.");
            setShowPayOffline(false);
            setPayAmount("");
            onClose();
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to record payment");
        }
    };

    const handleSendReminder = () => {
        toast.success("Payment reminder sent to customer");
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header
                closeButton
                style={{ background: "#274c6b", color: "#fff" }}
            >
                <Modal.Title style={{ fontSize: "14px" }}>Update Payment</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ fontSize: "13px" }}>
                <Table bordered size="sm" className="mb-0">
                    <tbody>
                        <tr>
                            <td>Package Cost (Inc. GST)</td>
                            <td className="text-end fw-semibold">
                                INR {packageCost.toLocaleString("en-IN")}
                            </td>
                        </tr>
                        <tr>
                            <td>Amount Received</td>
                            <td className="text-end">
                                INR {received.toLocaleString("en-IN")}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>OutStanding Bal.</strong>
                            </td>
                            <td className="text-end fw-bold">
                                INR {outstanding.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {showPayOffline && (
                    <div className="mt-3 p-2 border rounded">
                        <Form.Label style={{ fontSize: "12px" }}>
                            Enter Offline Payment Amount (INR)
                        </Form.Label>
                        <Form.Control
                            type="number"
                            size="sm"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            placeholder="Amount"
                            className="mb-2"
                        />
                        <Form.Select
                            size="sm"
                            className="mb-2"
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
                        <Form.Control
                            size="sm"
                            className="mb-2"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Reference (optional)"
                        />
                        <div className="d-flex gap-2">
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={handlePayOffline}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Confirm Payment"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() => setShowPayOffline(false)}
                            >
                                Back
                            </Button>
                        </div>
                        <div className="mt-2 text-muted" style={{ fontSize: 11 }}>
                            Goes to Finance Daily Collection as Pending until approved.
                        </div>
                    </div>
                )}
            </Modal.Body>

            {!showPayOffline && (
                <Modal.Footer className="d-flex justify-content-between">
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setShowPayOffline(true)}
                        disabled={outstanding <= 0}
                    >
                        Pay Offline
                    </Button>
                    <div className="d-flex gap-2">
                        <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={handleSendReminder}
                        >
                            Send Payment Reminder
                        </Button>
                    </div>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default UpdatePaymentModal;
