"use client";

import React, { useMemo, useState } from "react";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import { useGetPackageBookingsQuery } from "@/store/services/booking/packageBookingApi";
import ProposalRowActions from "./ProposalRowActions";
import PriceModal from "./PriceModal";
import {
    ProposalBooking,
    formatDestination,
    formatOfferPrice,
    formatOwner,
    formatPackageType,
    formatProposalAge,
    formatProposalCode,
    formatProposalDate,
    formatProposalStage,
    formatQueryRef,
    formatTravelRange,
} from "../utils/proposalHelpers";

type ProposalModalProps = {
    queryId: string;
    queryCode?: string;
};

const ProposalModal = ({ queryId, queryCode }: ProposalModalProps) => {
    const [showHistory, setShowHistory] = useState(false);

    const { data, isLoading, isFetching } = useGetPackageBookingsQuery(
        { queryId, limit: 100 },
        { skip: !queryId }
    );

    const proposals = useMemo(() => {
        const rows = (data?.data || []) as ProposalBooking[];
        return rows.filter((p) => p.status !== "cancelled");
    }, [data]);

    const count = proposals.length;
    const label =
        count === 0
            ? "0 (No Proposal)"
            : `${count} (View Proposal${count > 1 ? "s" : ""})`;

    return (
        <>
            <Button
                size="sm"
                className="ql-proposal-link"
                onClick={() => setShowHistory(true)}
                variant="link"
                disabled={!queryId}
            >
                {isLoading ? "…" : label}
            </Button>

            <Modal
                show={showHistory}
                onHide={() => setShowHistory(false)}
                size="xl"
                centered
            >
                <Modal.Header
                    style={{
                        background: "#274c6b",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Modal.Title style={{ fontSize: 16 }}>
                        View Proposal{count !== 1 ? "s" : ""} ({count})
                    </Modal.Title>

                    <button
                        onClick={() => setShowHistory(false)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            fontSize: "18px",
                            cursor: "pointer",
                        }}
                    >
                        ✕
                    </button>
                </Modal.Header>

                <Modal.Body>
                    {isLoading || isFetching ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" size="sm" /> Loading
                            proposals...
                        </div>
                    ) : count === 0 ? (
                        <div className="text-muted text-center py-4">
                            No proposals sent for this query yet. Use Build Pro
                            Package to create one.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table bordered hover className="mb-0">
                                <thead style={{ fontSize: "10px" }}>
                                    <tr>
                                        <th>Proposal Date/Age</th>
                                        <th>Proposal ID</th>
                                        <th>Travel Date</th>
                                        <th>Type</th>
                                        <th>No. of Pax</th>
                                        <th>Destinations</th>
                                        <th>Offer Price</th>
                                        <th>Stage</th>
                                        <th>Owner</th>
                                        <th>Last Updated</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontSize: "10px" }}>
                                    {proposals.map((booking, index) => (
                                        <tr key={booking._id}>
                                            <td>
                                                <div>
                                                    {formatProposalDate(
                                                        booking.createdAt ||
                                                            booking.travelDate
                                                    )}
                                                </div>
                                                <div className="text-muted">
                                                    {formatProposalAge(
                                                        booking.createdAt
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {formatProposalCode(
                                                        booking,
                                                        index
                                                    )}
                                                </div>
                                                <div className="text-muted">
                                                    {formatQueryRef(
                                                        booking,
                                                        queryCode
                                                    )}
                                                </div>
                                                <div className="text-muted">
                                                    (PId-{booking.proposalId || "—"})
                                                </div>
                                            </td>
                                            <td>{formatTravelRange(booking)}</td>
                                            <td>
                                                <div>{formatPackageType(booking)}</div>
                                                <div
                                                    className="text-primary"
                                                    style={{ cursor: "default" }}
                                                >
                                                    {booking.enquiryId ||
                                                        booking.proposalId}
                                                </div>
                                            </td>
                                            <td>
                                                {booking.travelers || 1} Adult(s)
                                            </td>
                                            <td>{formatDestination(booking)}</td>
                                            <td>
                                                <div>{formatOfferPrice(booking)}</div>
                                                <div>
                                                    <PriceModal />
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    style={{
                                                        color: "#e65100",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {formatProposalStage(booking)}
                                                </div>
                                            </td>
                                            <td>{formatOwner(booking)}</td>
                                            <td>
                                                <div>
                                                    {formatProposalDate(
                                                        booking.updatedAt ||
                                                            booking.createdAt
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <ProposalRowActions
                                                    booking={booking}
                                                    showIcons
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ProposalModal;
