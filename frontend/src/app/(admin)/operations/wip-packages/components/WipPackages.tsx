"use client";

import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import Filter from "./Filter";
import {
    useGetPackageBookingsQuery,
    useDeletePackageBookingMutation,
} from "@/store/services/booking/packageBookingApi";
import {
    formatDisplayDate,
    getCustomerName,
    PackageBookingFormData,
} from "@/app/(admin)/bookings/Packages/types/packageBooking";
import DiscardConfirmModal from "@/app/(admin)/bookings/Packages/components/DiscardConfirmModal";
import toast from "react-hot-toast";

const WipPackages = () => {
    const router = useRouter();
    const [discardTarget, setDiscardTarget] = useState<{
        id: string;
        proposalId?: number;
        customerName: string;
    } | null>(null);
    const [discarding, setDiscarding] = useState(false);

    const { data, isLoading, isError, refetch } = useGetPackageBookingsQuery({});
    const [deleteBooking] = useDeletePackageBookingMutation();

    const bookings = data?.data || [];

    const handleView = (booking: PackageBookingFormData & { _id: string }) => {
        router.push(`/bookings/Packages/build-your-own?id=${booking._id}`);
    };

    const handleDiscardClick = (
        booking: PackageBookingFormData & { _id: string }
    ) => {
        setDiscardTarget({
            id: booking._id,
            proposalId: booking.proposalId,
            customerName: getCustomerName(booking.customerDetails),
        });
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

    return (
        <>
            <div className="mb-2">
                <Filter />
            </div>
            <Card className="p-3">
                <div className="table-responsive">
                    <table
                        className="table table-sm table-bordered mb-0 align-middle"
                        style={{ tableLayout: "fixed", width: "100%" }}
                    >
                        <thead>
                            <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                                <th style={{ width: "110px" }}>Sr No</th>
                                <th style={{ width: "110px" }}>Travel Date</th>
                                <th style={{ width: "110px" }}>Creation Date</th>
                                <th style={{ width: "110px" }}>Proposal ID</th>
                                <th style={{ width: "260px" }}>Name/Mobile</th>
                                <th style={{ width: "110px" }}>From Destinations</th>
                                <th style={{ width: "110px" }} className="text-center">
                                    To Destinations
                                </th>
                                <th style={{ width: "110px" }} className="text-center">
                                    No of Days
                                </th>
                                <th style={{ width: "110px" }} className="text-center">
                                    Created by
                                </th>
                                <th style={{ width: "110px" }} className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody style={{ fontSize: "12px" }}>
                            {isLoading && (
                                <tr>
                                    <td colSpan={10} className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary me-2" />
                                        Loading WIP packages...
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={10} className="text-center text-danger py-4">
                                        Failed to load.{" "}
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm"
                                            onClick={() => refetch()}
                                        >
                                            Retry
                                        </button>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError && bookings.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="text-center text-muted py-4">
                                        No WIP package bookings found.
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                !isError &&
                                bookings.map(
                                    (
                                        booking: PackageBookingFormData & {
                                            _id: string;
                                            createdAt?: string;
                                        },
                                        index: number
                                    ) => {
                                        const customer = booking.customerDetails;
                                        const name = getCustomerName(customer);

                                        return (
                                            <tr key={booking._id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {formatDisplayDate(booking.travelDate)}
                                                </td>
                                                <td>
                                                    {formatDisplayDate(
                                                        booking.createdAt?.split("T")[0] || ""
                                                    )}
                                                </td>
                                                <td>{booking.proposalId ?? "—"}</td>
                                                <td>
                                                    <div className="fw-semibold">
                                                        <Icon icon="mdi:account" className="me-1" />
                                                        {name}
                                                    </div>
                                                    {customer?.email && (
                                                        <div>
                                                            <Icon
                                                                icon="mdi:email-outline"
                                                                className="me-1"
                                                            />
                                                            {customer.email}
                                                        </div>
                                                    )}
                                                    {customer?.mobile && (
                                                        <div>
                                                            <Icon icon="mdi:phone" className="me-1" />
                                                            +91 {customer.mobile}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>{booking.goingFrom || "—"}</td>
                                                <td>{booking.goingTo || "—"}</td>
                                                <td>{booking.noOfDays ?? "—"}</td>
                                                <td>{booking.owner || "—"}</td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            style={{ fontSize: "10px" }}
                                                            title="Modify Proposal"
                                                            onClick={() => handleView(booking)}
                                                        >
                                                            <Icon icon="mdi:eye-outline" />
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            style={{ fontSize: "10px" }}
                                                            title="Discard"
                                                            onClick={() =>
                                                                handleDiscardClick(booking)
                                                            }
                                                        >
                                                            <Icon icon="mdi:minus-circle-outline" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                        </tbody>
                    </table>
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
        </>
    );
};

export default WipPackages;
