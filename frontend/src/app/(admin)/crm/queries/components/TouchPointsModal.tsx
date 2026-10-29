"use client";

import React, { useMemo, useState } from "react";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetTouchPointsByQueryQuery } from "@/store/services/crm/touchPointApi";

type TouchPointsModalProps = {
    queryId: string;
    customerName?: string;
    currentStage?: string;
};

type TimelineItem = {
    _id: string;
    type: string;
    title: string;
    description?: string;
    createdBy?: string;
    createdAt: string;
};

const TYPE_ICON: Record<string, string> = {
    Email: "mdi:email-outline",
    Status: "mdi:comment-text-outline",
    Remarks: "mdi:comment-text-outline",
    Call: "mdi:phone-outline",
    Todo: "mdi:checkbox-marked-outline",
    Meeting: "mdi:calendar-outline",
    SMS: "mdi:message-text-outline",
    Proposal: "mdi:file-document-outline",
    "Follow Up": "mdi:phone-outgoing",
    "Query Created": "mdi:plus-circle-outline",
    Payment: "mdi:cash",
    Booking: "mdi:bookmark-check-outline",
};

const formatTouchDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    const dd = String(date.getDate()).padStart(2, "0");
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const yy = String(date.getFullYear()).slice(-2);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${dd}-${months[date.getMonth()]}-${yy} ${hh}:${mm}`;
};

const TouchPointsModal = ({
    queryId,
    customerName,
    currentStage,
}: TouchPointsModalProps) => {
    const [showHistory, setShowHistory] = useState(false);

    const { data, isLoading, isFetching, isError } = useGetTouchPointsByQueryQuery(
        queryId,
        { skip: !queryId || !showHistory }
    );

    const summary = data?.data?.summary;
    const timeline = useMemo(
        () => (data?.data?.timeline || []) as TimelineItem[],
        [data]
    );

    return (
        <>
            <Button
                size="sm"
                className="ql-btn-touch"
                onClick={() => setShowHistory(true)}
                disabled={!queryId}
            >
                Touch Points
            </Button>

            <Modal
                show={showHistory}
                onHide={() => setShowHistory(false)}
                size="lg"
                centered
                scrollable
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
                    <Modal.Title style={{ fontSize: 16 }}>Touch Points</Modal.Title>
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

                <Modal.Body style={{ background: "#f7f7f7" }}>
                    <Table bordered hover size="sm" className="bg-white mb-3">
                        <thead style={{ fontSize: "10px" }}>
                            <tr>
                                <th>#</th>
                                <th>Customer Name</th>
                                <th>Current Stage</th>
                                <th>Lead Quality</th>
                                <th>Total Call</th>
                                <th>Total Todo</th>
                                <th>Total Meeting</th>
                                <th>Total SMS</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: "11px" }}>
                            <tr>
                                <td>1</td>
                                <td>
                                    {summary?.customerName ||
                                        customerName ||
                                        "—"}
                                </td>
                                <td>
                                    {summary?.currentStage ||
                                        currentStage ||
                                        "—"}
                                </td>
                                <td>{summary?.leadQuality || "NA"}</td>
                                <td>{summary?.totalCall ?? 0}</td>
                                <td>{summary?.totalTodo ?? 0}</td>
                                <td>{summary?.totalMeeting ?? 0}</td>
                                <td>{summary?.totalSMS ?? 0}</td>
                            </tr>
                        </tbody>
                    </Table>

                    {isLoading || isFetching ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" size="sm" /> Loading touch
                            points...
                        </div>
                    ) : isError ? (
                        <div className="text-center text-danger py-3">
                            Failed to load touch points
                        </div>
                    ) : timeline.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            No touch points recorded yet for this query.
                        </div>
                    ) : (
                        <div className="tp-timeline">
                            {timeline.map((item, index) => {
                                const alt = index % 2 === 1;
                                const icon =
                                    TYPE_ICON[item.type] ||
                                    "mdi:comment-text-outline";

                                return (
                                    <div key={item._id} className="tp-item">
                                        <div className="tp-left">
                                            <div className="tp-avatar">
                                                <Icon
                                                    icon="mdi:account-circle"
                                                    width={34}
                                                />
                                            </div>
                                            <div className="tp-meta">
                                                <div className="tp-type">
                                                    {item.type}
                                                </div>
                                                <div className="tp-date">
                                                    {formatTouchDate(
                                                        item.createdAt
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tp-rail">
                                            <div className="tp-rail-icon">
                                                <Icon icon={icon} width={14} />
                                            </div>
                                            {index < timeline.length - 1 && (
                                                <div className="tp-rail-line" />
                                            )}
                                        </div>

                                        <div
                                            className={`tp-card${alt ? " is-alt" : ""}`}
                                        >
                                            <div className="tp-card-title">
                                                {item.title}
                                            </div>
                                            {item.description ? (
                                                <>
                                                    <hr className="tp-divider" />
                                                    <div className="tp-card-desc">
                                                        {item.description}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <style>{`
                .tp-timeline {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    padding: 4px 4px 12px;
                }
                .tp-item {
                    display: grid;
                    grid-template-columns: 140px 28px 1fr;
                    gap: 8px;
                    min-height: 72px;
                    align-items: stretch;
                }
                .tp-left {
                    display: flex;
                    gap: 8px;
                    padding-top: 2px;
                }
                .tp-avatar {
                    color: #9aa3ad;
                    line-height: 1;
                }
                .tp-meta {
                    min-width: 0;
                }
                .tp-type {
                    font-size: 12px;
                    font-weight: 600;
                    color: #333;
                }
                .tp-date {
                    font-size: 11px;
                    color: #666;
                    margin-top: 2px;
                }
                .tp-rail {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .tp-rail-icon {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: #c4a484;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                    flex-shrink: 0;
                }
                .tp-rail-line {
                    width: 3px;
                    flex: 1;
                    background: #d2b48c;
                    margin-top: 2px;
                    min-height: 40px;
                }
                .tp-card {
                    position: relative;
                    background: #5a5a5a;
                    color: #fff;
                    border-radius: 4px;
                    padding: 10px 12px;
                    margin-bottom: 12px;
                    font-size: 12px;
                    line-height: 1.45;
                }
                .tp-card.is-alt {
                    background: #c4a484;
                    color: #fff;
                }
                .tp-card::before {
                    content: "";
                    position: absolute;
                    left: -8px;
                    top: 8px;
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-right: 8px solid #5a5a5a;
                }
                .tp-card.is-alt::before {
                    border-right-color: #c4a484;
                }
                .tp-card-title {
                    font-weight: 600;
                    word-break: break-word;
                }
                .tp-divider {
                    margin: 8px 0;
                    border-color: rgba(255, 255, 255, 0.35);
                    opacity: 1;
                }
                .tp-card-desc {
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                @media (max-width: 768px) {
                    .tp-item {
                        grid-template-columns: 110px 24px 1fr;
                    }
                }
            `}</style>
        </>
    );
};

export default TouchPointsModal;
