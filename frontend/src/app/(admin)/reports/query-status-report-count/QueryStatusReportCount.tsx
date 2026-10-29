"use client";

import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetQueryStatusReportQuery } from "../../../../store/services/queriesApi";
import { useRouter } from "next/navigation";

const getDateRange = (type: string) => {
    const today = new Date();

    let start = new Date();
    let end = new Date();

    switch (type) {
        case "today":
            break;

        case "yesterday":
            start.setDate(today.getDate() - 1);
            end.setDate(today.getDate() - 1);
            break;

        case "currentWeek":
            const day = today.getDay(); // 0-6
            start.setDate(today.getDate() - day);
            break;

        case "lastWeek":
            const lastWeekStart = new Date(today);
            lastWeekStart.setDate(today.getDate() - today.getDay() - 7);

            const lastWeekEnd = new Date(today);
            lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);

            start = lastWeekStart;
            end = lastWeekEnd;
            break;

        case "currentMonth":
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            break;

        case "overall":
            return { startDate: undefined, endDate: undefined };
    }

    return {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
    };
};

const QueryStatusReportCount = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filterType, setFilterType] = useState("overall");
    const router = useRouter();

    const { startDate: autoStart, endDate: autoEnd } = getDateRange(filterType);

    const { data, isLoading } = useGetQueryStatusReportQuery({
        startDate: startDate || autoStart,
        endDate: endDate || autoEnd,
    });

    console.log("API DATA:", data);

    const handleFilterClick = (type: string) => {
        setFilterType(type);
        setStartDate("");
        setEndDate("");
    };

    const handleCustomSubmit = () => {
        setFilterType("custom");
    };
    return (
        <>
            <Card className="p-3">
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                        {/* Left Sections */}
                        <div className="d-flex align-items-center gap-2">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={() => handleFilterClick("today")}
                            >Today</Button>

                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={() => handleFilterClick("yesterday")}
                            >Yesterday</Button>

                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={() => handleFilterClick("currentWeek")}
                            >Current Week</Button>

                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={() => handleFilterClick("lastWeek")}
                            >Last Week</Button>

                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={() => handleFilterClick("currentMonth")}
                            >Current Month</Button>

                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={() => handleFilterClick("overall")}
                            >Over All</Button>

                            <input type="date"
                                className="form-control form-control-sm"
                                style={{ fontSize: "10PX" }}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                            <input type="date"
                                className="form-control form-control-sm"
                                style={{ fontSize: "10PX" }}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />

                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                                onClick={handleCustomSubmit}
                            >Submit</Button>


                        </div>

                        {/* right side */}
                        <div className="d-flex align-items-center gap-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                style={{ fontSize: "10PX", fontWeight: "bold" }}
                            >
                                <Icon icon="mdi:file-export" />
                            </Button>

                            <Button
                                variant="outline-primary"
                                size="sm"
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                            >Print</Button>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table
                            className="table table-sm table-bordered mb-0 align-middle"
                            style={{ tableLayout: "fixed", width: "100%" }}
                        >
                            <thead>
                                <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }} className="table-dark"
                                >

                                    <th style={{ width: "130px" }}>#</th>

                                    <th style={{ width: "270px" }} colSpan={3}>Queries & Proposals</th>

                                    <th style={{ width: "270px" }} colSpan={5}>Follow up Stage</th>

                                    <th style={{ width: "260px" }} colSpan={3}>Final Output</th>

                                    <th style={{ width: "230px" }} colSpan={3}>Today's Sales</th>
                                </tr>
                                <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>


                                    <th style={{ width: "130px" }}>Name</th>

                                    <th style={{ width: "90px" }}>Total Queries</th>

                                    <th style={{ width: "90px" }}>Proposals Sent</th>

                                    <th style={{ width: "90px" }}>Proposal not sent</th>

                                    <th>In Process</th>
                                    <th>No Status</th>
                                    <th>Hot</th>
                                    <th>Warm</th>
                                    <th>Cold</th>

                                    <th>Verbal Confirmed</th>
                                    <th>Lost</th>
                                    <th>Won</th>


                                    <th>Verbal Confirmed</th>
                                    <th>Lost</th>
                                    <th>Won</th>
                                </tr>
                            </thead>

                            <tbody style={{ fontSize: "12px" }}>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={15} className="text-center">Loading...</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td>Rajendra Bugade</td>

                                        <td>{data?.totalQueries || 0}</td>
                                        <td>0</td>
                                        <td>0</td>

                                        <td>{data?.totalQueries || 0}</td>
                                        <td>{data?.inProcess || 0}</td>
                                        <td>{data?.noStatus || 0}</td>
                                        <td>{data?.hot || 0}</td>
                                        <td>{data?.warm || 0}</td>
                                        <td>{data?.cold || 0}</td>
                                        <td>{data?.verbalConfirmed || 0}</td>
                                        <td>{data?.lost || 0}</td>
                                        <td>{data?.won || 0}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </>
    )
};

export default QueryStatusReportCount;