"use client";

import React, { useState } from "react";
import { Button, Card, Form, Badge } from "react-bootstrap";
import { useRouter } from "next/navigation";
import B2BVoucherModal from "./B2BVoucherModal";
import B2CVoucherModal from "./B2CVoucherModal";
import Filter from "./Filter";
import PackageActionDropdown, {
    PackageAction,
} from "./PackageActionDropdown";
import DiscardConfirmModal from "./DiscardConfirmModal";
import VoucherStatusGrid from "./VoucherStatusGrid";
import {
    useGetPackageBookingsQuery,
    useDeletePackageBookingMutation,
    useUpdatePackageBookingMutation,
} from "@/store/services/booking/packageBookingApi";
import {
    formatDisplayDate,
    getCustomerName,
    PackageBookingFormData,
} from "../types/packageBooking";
import UpdatePaymentModal from "./UpdatePaymentModal";
import toast from "react-hot-toast";

const Packages = () => {
    const router = useRouter();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [discardTarget, setDiscardTarget] = useState<{
        id: string;
        proposalId?: number;
        customerName: string;
    } | null>(null);
    const [discarding, setDiscarding] = useState(false);
    const [paymentBooking, setPaymentBooking] = useState<
        (PackageBookingFormData & { _id: string }) | null
    >(null);

    const { data, isLoading, refetch } = useGetPackageBookingsQuery({
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
    });
    const [deleteBooking] = useDeletePackageBookingMutation();
    const [updateBooking] = useUpdatePackageBookingMutation();

    const bookings = data?.data || [];

    const handleAction = (
        action: PackageAction,
        booking: PackageBookingFormData & { _id: string }
    ) => {
        switch (action) {
            case "view-proposal":
                router.push(
                    `/bookings/Packages/view-proposal?id=${booking._id}`
                );
                break;
            case "modify-proposal":
                router.push(
                    `/bookings/Packages/build-your-own?id=${booking._id}`
                );
                break;
            case "discard":
                setDiscardTarget({
                    id: booking._id,
                    proposalId: booking.proposalId,
                    customerName: getCustomerName(booking.customerDetails),
                });
                break;
            case "update-payment":
                setPaymentBooking(booking);
                break;
            case "invoice":
                router.push(`/bookings/Packages/invoice?id=${booking._id}`);
                break;
            case "fulfillment":
                router.push(`/bookings/Packages/fulfillment?id=${booking._id}`);
                break;
            case "old-fulfillment":
                router.push(
                    `/bookings/Packages/old-fulfillment?id=${booking._id}`
                );
                break;
            default:
                break;
        }
    };

    const handleConfirmDiscard = async () => {
        if (!discardTarget) return;
        setDiscarding(true);
        try {
            await deleteBooking(discardTarget.id).unwrap();
            toast.success("Proposal discarded successfully");
            setDiscardTarget(null);
            refetch();
        } catch {
            toast.error("Failed to discard proposal");
        } finally {
            setDiscarding(false);
        }
    };

    const getPaymentStage = (booking: PackageBookingFormData) => {
        if (booking.bookingStage?.toLowerCase().includes("ticket")) {
            return booking.bookingStage;
        }
        if (booking.status === "shared") return "Proposal - Shared";
        if (booking.status === "confirmed") return "Ticket - Booked";
        return booking.bookingStage || "Proposal";
    };

    const getVoucherStage = (booking: PackageBookingFormData) => {
        if (booking.voucherStatus?.toLowerCase().includes("voucher")) {
            return booking.voucherStatus;
        }
        if (booking.voucherStatus === "Generated") return "Voucher - In Process";
        if (booking.voucherStatus === "Pending") return "Voucher - Pending";
        return `Voucher - ${booking.voucherStatus || "Pending"}`;
    };

    return (
        <>
            <div className="mb-2">
                <Filter />
            </div>

            <Card className="p-3">
                <div className="p-3">
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                            <div className="d-flex align-items-center gap-2">
                                <select
                                    className="form-select form-select-sm w-auto"
                                    style={{ fontSize: "10PX" }}
                                >
                                    <option>Select Ops users</option>
                                    <option value="1">User 1</option>
                                    <option value="2">User 2</option>
                                    <option value="3">User 3</option>
                                </select>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    style={{ fontSize: "10px", fontWeight: "bold" }}
                                >
                                    Assign
                                </Button>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    style={{ fontSize: "10px", fontWeight: "bold" }}
                                >
                                    Package Ops Report
                                </Button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                {[
                                    "Today",
                                    "Yesterday",
                                    "UpComing",
                                    "In Trip",
                                    "Completed",
                                    "Over All",
                                ].map((label) => (
                                    <Button
                                        key={label}
                                        variant="outline-primary"
                                        size="sm"
                                        style={{
                                            fontSize: "10px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {label}
                                    </Button>
                                ))}

                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    style={{ fontSize: "10PX", width: "130px" }}
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    style={{ fontSize: "10PX", width: "130px" }}
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />

                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    style={{ fontSize: "10px", fontWeight: "600" }}
                                    onClick={() => refetch()}
                                >
                                    Submit
                                </Button>
                            </div>

                            <div className="d-flex gap-2 justify-content-end">
                                <B2BVoucherModal />
                                <B2CVoucherModal />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table
                            className="table table-sm table-bordered mb-0 align-middle"
                            style={{ tableLayout: "fixed", width: "100%" }}
                        >
                            <thead>
                                <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                                    <th style={{ width: "40px" }}>
                                        <Form.Check type="checkbox" />
                                    </th>
                                    <th style={{ width: "260px" }}>Customer Details</th>
                                    <th style={{ width: "140px" }}>
                                        Proposal ID / Booking Date
                                    </th>
                                    <th style={{ width: "110px" }}>Travel Date</th>
                                    <th style={{ width: "130px" }}>Pax</th>
                                    <th style={{ width: "130px" }}>Destination</th>
                                    <th style={{ width: "100px" }}>Selling Price(INR)</th>
                                    <th style={{ width: "150px" }}>Received(INR)</th>
                                    <th style={{ width: "120px" }}>Balance(INR)</th>
                                    <th style={{ width: "160px" }}>Owner</th>
                                    <th style={{ width: "120px" }}>
                                        Payment/Booking stage
                                    </th>
                                    <th style={{ width: "140px" }}>Voucher Status</th>
                                    <th style={{ width: "140px" }}>Action</th>
                                </tr>
                            </thead>

                            <tbody style={{ fontSize: "12px" }}>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={13} className="text-center py-4">
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && bookings.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={13}
                                            className="text-center py-4 text-muted"
                                        >
                                            No package bookings found. Create one using
                                            B2B or B2C Voucher.
                                        </td>
                                    </tr>
                                )}

                                {bookings.map(
                                    (booking: PackageBookingFormData & { _id: string; createdAt?: string }) => {
                                        const customer = booking.customerDetails;
                                        const name = getCustomerName(customer);

                                        return (
                                            <tr key={booking._id}>
                                                <td>
                                                    <Form.Check />
                                                </td>
                                                <td>
                                                    <div className="fw-semibold">{name}</div>
                                                    <div style={{ fontSize: "10px" }}>
                                                        {customer?.email}
                                                    </div>
                                                    <div style={{ fontSize: "10px" }}>
                                                        +91 {customer?.mobile}
                                                    </div>
                                                    <Badge
                                                        bg={
                                                            customer?.customerType ===
                                                            "B2B"
                                                                ? "primary"
                                                                : "success"
                                                        }
                                                        style={{ fontSize: "9px" }}
                                                    >
                                                        {customer?.customerType}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <div>{booking.proposalId}</div>
                                                    <div style={{ fontSize: "10px" }}>
                                                        {formatDisplayDate(
                                                            booking.createdAt?.split(
                                                                "T"
                                                            )[0] || ""
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    {formatDisplayDate(booking.travelDate)}
                                                </td>
                                                <td>{booking.travelers} Adults</td>
                                                <td>{booking.goingTo}</td>
                                                <td>{booking.sellingPrice}</td>
                                                <td>{booking.received}</td>
                                                <td>{booking.balance}</td>
                                                <td>{booking.owner || "—"}</td>
                                                <td style={{ fontSize: "10px" }}>
                                                    <div>{getPaymentStage(booking)}</div>
                                                    <div className="text-muted">
                                                        {getVoucherStage(booking)}
                                                    </div>
                                                </td>
                                                <td>
                                                    <VoucherStatusGrid booking={booking} />
                                                </td>
                                                <td>
                                                    <PackageActionDropdown
                                                        onAction={(action) =>
                                                            handleAction(action, booking)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            <DiscardConfirmModal
                show={!!discardTarget}
                proposalId={discardTarget?.proposalId}
                customerName={discardTarget?.customerName}
                onConfirm={handleConfirmDiscard}
                onCancel={() => setDiscardTarget(null)}
                loading={discarding}
            />

            <UpdatePaymentModal
                show={!!paymentBooking}
                booking={paymentBooking}
                onClose={() => setPaymentBooking(null)}
                onSave={async (id, paymentData) => {
                    await updateBooking({ id, ...paymentData }).unwrap();
                    refetch();
                }}
            />
        </>
    );
};

export default Packages;
