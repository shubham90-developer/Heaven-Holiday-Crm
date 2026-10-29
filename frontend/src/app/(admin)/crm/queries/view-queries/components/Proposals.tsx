"use client";

import React, { useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useGetPackageBookingsQuery } from "@/store/services/booking/packageBookingApi";
import PriceDetailModal from "./PriceDetailModal";
import ChangeModal from "./ChangeModal";
import ReplyModal from "./ReplyModal";
import ViewEmail from "./ViewEmail";
import ProposalRowActions from "../../components/ProposalRowActions";
import {
    ProposalBooking,
    formatDestination,
    formatOfferPrice,
    formatPackageType,
    formatProposalAge,
    formatProposalCode,
    formatProposalDate,
    formatProposalStage,
    formatTravelRange,
} from "../../utils/proposalHelpers";

type ProposalsProps = {
    queryId: string;
    queryCode?: string;
    customerEmail?: string;
};

const Proposals = ({ queryId, queryCode, customerEmail }: ProposalsProps) => {
    const [changes, setChanges] = useState(false);

    const { data, isLoading, isFetching, isError } = useGetPackageBookingsQuery(
        { queryId, limit: 100 },
        { skip: !queryId }
    );

    const proposals = useMemo(() => {
        const rows = (data?.data || []) as ProposalBooking[];
        return rows.filter((p) => p.status !== "cancelled");
    }, [data]);

    const myCost = (booking: ProposalBooking) => {
        const currency = booking.currency || "INR";
        const cost =
            Number(booking.landPackageCost?.cost || 0) +
            Number(booking.flightCost?.cost || 0) +
            Number(booking.visaCost?.cost || 0);
        return `${currency} ${cost.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">
                    Proposals{" "}
                    <span className="text-muted" style={{ fontSize: 12 }}>
                        ({proposals.length})
                    </span>
                </h6>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="bg-light">
                        <tr style={{ fontSize: "11px" }}>
                            <th>Proposal ID</th>
                            <th>Sent On</th>
                            <th>Travel Date</th>
                            <th>Type/ Source</th>
                            <th>Destination</th>
                            <th>My Cost</th>
                            <th>Offer Price</th>
                            <th>Sent To</th>
                            <th>Stage</th>
                            <th>Last Updated</th>
                            <th>Response</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading || isFetching ? (
                            <tr>
                                <td colSpan={12} className="text-center py-4">
                                    <Spinner animation="border" size="sm" /> Loading
                                    proposals...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={12} className="text-center text-danger py-3">
                                    Failed to load proposals
                                </td>
                            </tr>
                        ) : proposals.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="text-center text-muted py-4">
                                    No proposals yet for this query. Build a Pro Package
                                    and share it to see proposals here.
                                </td>
                            </tr>
                        ) : (
                            proposals.map((booking, index) => (
                                <tr key={booking._id} style={{ fontSize: "10px" }}>
                                    <td>
                                        {formatProposalCode(booking, index)}
                                        <br />
                                        (PId-{booking.proposalId || "—"})
                                        {queryCode ? (
                                            <>
                                                <br />
                                                <span className="text-muted">
                                                    Q:{queryCode}
                                                </span>
                                            </>
                                        ) : null}
                                    </td>

                                    <td>
                                        {formatProposalDate(booking.createdAt)}
                                        <br />
                                        <span className="text-muted">
                                            {formatProposalAge(booking.createdAt)}
                                        </span>
                                    </td>

                                    <td>{formatTravelRange(booking)}</td>

                                    <td>
                                        {formatPackageType(booking)}
                                        <br />
                                        {booking.customerDetails?.customerType || "B2C"}
                                    </td>

                                    <td>{formatDestination(booking)}</td>

                                    <td>{myCost(booking)}</td>

                                    <td>
                                        {formatOfferPrice(booking)}
                                        <br />
                                        <PriceDetailModal />
                                    </td>

                                    <td>
                                        {customerEmail ||
                                            booking.customerDetails?.email ||
                                            "—"}
                                        <br />
                                        <ViewEmail />
                                    </td>

                                    <td>
                                        <span
                                            style={{
                                                color: "#e65100",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {formatProposalStage(booking)}
                                        </span>
                                        <br />
                                        <span
                                            className="text-danger fw-bold"
                                            onClick={() => setChanges(true)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            + Changes
                                        </span>
                                        <br />
                                        <span
                                            className="text-danger"
                                            onClick={() => setChanges(true)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            Follow Up
                                        </span>
                                    </td>

                                    <td>
                                        {formatProposalDate(
                                            booking.updatedAt || booking.createdAt
                                        )}
                                    </td>

                                    <td className="text-center">
                                        <ReplyModal />
                                    </td>

                                    <td>
                                        <ProposalRowActions
                                            booking={booking}
                                            showIcons={false}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {changes && <ChangeModal onClose={() => setChanges(false)} />}
        </div>
    );
};

export default Proposals;
