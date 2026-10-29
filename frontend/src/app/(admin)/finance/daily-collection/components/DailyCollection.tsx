"use client";

import React, { useMemo, useState } from "react";
import { Button, Card, Badge, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
import Filter from "./Filter";
import {
    useApproveDailyCollectionMutation,
    useGetDailyCollectionsQuery,
    useRejectDailyCollectionMutation,
} from "@/store/services/finance/dailyCollectionApi";
import { useVerifyUserQuery } from "@/store/services/auth/authApi";

type DatePreset =
    | "today"
    | "yesterday"
    | "current_week"
    | "last_week"
    | "current_month"
    | "last_month"
    | "overall"
    | "custom";

const startOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const endOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

const toInputDate = (date: Date) => date.toISOString().split("T")[0];

const formatDisplayDate = (value?: string | Date) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getPresetRange = (preset: DatePreset): { fromDate?: string; toDate?: string } => {
    const now = new Date();

    if (preset === "overall") return {};

    if (preset === "today") {
        return { fromDate: toInputDate(now), toDate: toInputDate(now) };
    }

    if (preset === "yesterday") {
        const y = new Date(now);
        y.setDate(y.getDate() - 1);
        return { fromDate: toInputDate(y), toDate: toInputDate(y) };
    }

    if (preset === "current_week") {
        const start = startOfDay(now);
        const day = start.getDay();
        const diff = day === 0 ? 6 : day - 1;
        start.setDate(start.getDate() - diff);
        return { fromDate: toInputDate(start), toDate: toInputDate(now) };
    }

    if (preset === "last_week") {
        const end = startOfDay(now);
        const day = end.getDay();
        const diff = day === 0 ? 6 : day - 1;
        end.setDate(end.getDate() - diff - 1);
        const start = new Date(end);
        start.setDate(end.getDate() - 6);
        return { fromDate: toInputDate(start), toDate: toInputDate(end) };
    }

    if (preset === "current_month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return { fromDate: toInputDate(start), toDate: toInputDate(now) };
    }

    if (preset === "last_month") {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { fromDate: toInputDate(start), toDate: toInputDate(end) };
    }

    return {};
};

const statusVariant = (status: string) => {
    if (status === "approved") return "success";
    if (status === "rejected") return "danger";
    return "warning";
};

const DailyCollection = () => {
    const [activePreset, setActivePreset] = useState<DatePreset>("today");
    const [fromDate, setFromDate] = useState(toInputDate(new Date()));
    const [toDate, setToDate] = useState(toInputDate(new Date()));
    const [appliedRange, setAppliedRange] = useState<{
        fromDate?: string;
        toDate?: string;
    }>(getPresetRange("today"));

    const { data: authData } = useVerifyUserQuery(undefined);
    const [approveCollection, { isLoading: approving }] =
        useApproveDailyCollectionMutation();
    const [rejectCollection, { isLoading: rejecting }] =
        useRejectDailyCollectionMutation();

    const queryParams = useMemo(
        () => ({
            ...(appliedRange.fromDate ? { fromDate: appliedRange.fromDate } : {}),
            ...(appliedRange.toDate ? { toDate: appliedRange.toDate } : {}),
            limit: 100,
        }),
        [appliedRange]
    );

    const { data, isLoading, isFetching, refetch } =
        useGetDailyCollectionsQuery(queryParams);

    const collections = data?.data || [];
    const summary = data?.summary || { totalCollection: 0, online: 0, offline: 0 };
    const approverName =
        authData?.user?.name ||
        authData?.data?.name ||
        authData?.user?.email ||
        "Finance";

    const applyPreset = (preset: DatePreset) => {
        setActivePreset(preset);
        if (preset === "custom") return;
        const range = getPresetRange(preset);
        setFromDate(range.fromDate || "");
        setToDate(range.toDate || "");
        setAppliedRange(range);
    };

    const handleCustomSubmit = () => {
        setActivePreset("custom");
        setAppliedRange({
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
        });
    };

    const handleApprove = async (id: string) => {
        try {
            const res = await approveCollection({
                id,
                approvedBy: approverName,
            }).unwrap();
            toast.success(res?.message || "Payment approved");
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to approve payment");
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectCollection({
                id,
                rejectedBy: approverName,
                rejectionReason: "Rejected by finance",
            }).unwrap();
            toast.success("Payment rejected");
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to reject payment");
        }
    };

    const formatMoney = (amount: number, currency = "INR") =>
        `${currency} ${Number(amount || 0).toLocaleString("en-IN")}`;

    const presetButtons: { key: DatePreset; label: string }[] = [
        { key: "today", label: "Today" },
        { key: "yesterday", label: "Yesterday" },
        { key: "current_week", label: "Current Week" },
        { key: "last_week", label: "Last Week" },
        { key: "current_month", label: "Current Month" },
        { key: "last_month", label: "Last Month" },
        { key: "overall", label: "Over All" },
    ];

    return (
        <>
            <div className="mb-2">
                <Filter />
            </div>
            <Card className="p-3">
                <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            {presetButtons.map((btn) => (
                                <Button
                                    key={btn.key}
                                    variant={
                                        activePreset === btn.key
                                            ? "primary"
                                            : "outline-primary"
                                    }
                                    size="sm"
                                    style={{ fontSize: "10px", fontWeight: "bold" }}
                                    onClick={() => applyPreset(btn.key)}
                                >
                                    {btn.label}
                                </Button>
                            ))}
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                style={{ fontSize: "10px", width: 120 }}
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                style={{ fontSize: "10px", width: 120 }}
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={handleCustomSubmit}
                            >
                                Submit
                            </Button>
                        </div>

                        <div className="d-flex gap-2 justify-content-end">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={() => refetch()}
                            >
                                <Icon icon="mdi:refresh" />
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                            >
                                <Icon icon="mdi:file-export" />
                            </Button>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={() => window.print()}
                            >
                                Print
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="fw-bold border d-flex align-items-center gap-4 p-2 mb-3 flex-wrap">
                    <div>
                        Total Collection:{" "}
                        <span className="text-success">
                            {formatMoney(summary.totalCollection)}
                        </span>
                    </div>
                    <div>
                        Online:{" "}
                        <span className="text-primary">{formatMoney(summary.online)}</span>
                    </div>
                    <div>
                        Offline:{" "}
                        <span className="text-danger">{formatMoney(summary.offline)}</span>
                    </div>
                    {(isLoading || isFetching) && (
                        <Spinner animation="border" size="sm" className="ms-auto" />
                    )}
                </div>

                <div className="table-responsive">
                    <table
                        className="table table-sm table-bordered mb-0 align-middle"
                        style={{ tableLayout: "fixed", width: "100%" }}
                    >
                        <thead>
                            <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                                <th style={{ width: "200px" }}>Customer Details</th>
                                <th style={{ width: "110px" }}>Date</th>
                                <th style={{ width: "100px" }}>Receipt No</th>
                                <th style={{ width: "140px" }}>Booking ID</th>
                                <th style={{ width: "110px" }}>Booking Date</th>
                                <th style={{ width: "140px" }}>Particulars</th>
                                <th style={{ width: "120px" }}>Amt. Received</th>
                                <th style={{ width: "140px" }}>Mode of Payment</th>
                                <th style={{ width: "120px" }}>Owner</th>
                                <th style={{ width: "100px" }}>Status</th>
                                <th style={{ width: "120px" }}>Received By</th>
                                <th style={{ width: "120px" }}>Approved By</th>
                                <th style={{ width: "140px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: "12px" }}>
                            {collections.length === 0 ? (
                                <tr>
                                    <td colSpan={13}>No result found</td>
                                </tr>
                            ) : (
                                collections.map((row: any) => (
                                    <tr key={row._id}>
                                        <td>
                                            <div className="fw-semibold">{row.customerName}</div>
                                            <div className="text-muted" style={{ fontSize: 10 }}>
                                                {row.customerMobile || row.customerEmail || ""}
                                            </div>
                                        </td>
                                        <td>{formatDisplayDate(row.collectionDate)}</td>
                                        <td>{row.receiptNo}</td>
                                        <td>
                                            {row.proposalId
                                                ? `P-${row.proposalId}`
                                                : row.enquiryId
                                                  ? `E-${row.enquiryId}`
                                                  : "—"}
                                        </td>
                                        <td>{formatDisplayDate(row.bookingDate)}</td>
                                        <td>{row.particulars || "Package Booking Payment"}</td>
                                        <td>
                                            {formatMoney(row.amount, row.currency || "INR")}
                                        </td>
                                        <td>{row.mode}</td>
                                        <td>{row.owner || "—"}</td>
                                        <td>
                                            <Badge bg={statusVariant(row.status)}>
                                                {String(row.status || "").toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td>{row.receivedBy || "—"}</td>
                                        <td>{row.approvedBy || "—"}</td>
                                        <td>
                                            {row.status === "pending" ? (
                                                <div className="d-flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        style={{ fontSize: 10 }}
                                                        disabled={approving || rejecting}
                                                        onClick={() => handleApprove(row._id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        style={{ fontSize: 10 }}
                                                        disabled={approving || rejecting}
                                                        onClick={() => handleReject(row._id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default DailyCollection;
