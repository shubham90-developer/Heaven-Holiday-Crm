"use client";

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import CustomFlatpickr from "@/components/CustomFlatpickr";
import ItineraryFormPanel from "./ItineraryFormPanel";
import {
    FlightItinerary,
    computeFlightTotals,
    defaultFlightItinerary,
} from "../../../types/itineraryTypes";

type Props = {
    value?: FlightItinerary;
    travelers: number;
    goingFrom: string;
    goingTo: string;
    travelDate: string;
    onSave: (data: FlightItinerary) => void;
    onCancel: () => void;
};

const labelStyle = { fontSize: "10px" };
const inputStyle = { fontSize: "10px", padding: "4px 8px" };

const FlightItineraryForm = ({
    value,
    travelers,
    goingFrom,
    goingTo,
    travelDate,
    onSave,
    onCancel,
}: Props) => {
    const [draft, setDraft] = useState<FlightItinerary>(
        value ||
            defaultFlightItinerary(travelers, travelDate, goingFrom, goingTo)
    );

    useEffect(() => {
        if (value) setDraft(value);
    }, [value]);

    const update = (updates: Partial<FlightItinerary>) => {
        setDraft((prev) => computeFlightTotals({ ...prev, ...updates }));
    };

    const updatePaxRow = (index: number, field: string, val: string | number) => {
        setDraft((prev) => {
            const paxRows = [...prev.paxRows];
            paxRows[index] = {
                ...paxRows[index],
                [field]: val,
            };
            return computeFlightTotals({ ...prev, paxRows });
        });
    };

    const headerExtra = (
        <>
            {["Text Based", "Detailed", "API", "GDS PNR"].map((mode) => (
                <Form.Check
                    key={mode}
                    inline
                    type="radio"
                    name="flightInputMode"
                    label={mode}
                    checked={draft.inputMode === mode}
                    onChange={() => update({ inputMode: mode })}
                    style={{ fontSize: "10px", color: "#fff" }}
                    className="text-white"
                />
            ))}
            <Form.Control
                size="sm"
                placeholder="Supplier"
                value={draft.supplier}
                onChange={(e) => update({ supplier: e.target.value })}
                style={{ ...inputStyle, width: "140px" }}
            />
        </>
    );

    return (
        <ItineraryFormPanel
            title="Flight"
            headerExtra={headerExtra}
            onCancel={onCancel}
            onSave={() => onSave(computeFlightTotals(draft))}
        >
            <div className="d-flex gap-3 mb-2">
                {["One Way", "Round Trip"].map((type) => (
                    <Form.Check
                        key={type}
                        type="radio"
                        name="tripType"
                        label={type}
                        checked={draft.tripType === type}
                        onChange={() => update({ tripType: type })}
                        style={labelStyle}
                    />
                ))}
            </div>

            <strong style={{ fontSize: "11px" }}>Out bound</strong>

            <Row className="g-1 mt-1 mb-2">
                <Col md={3}>
                    <Form.Label style={labelStyle}>Airline</Form.Label>
                    <Form.Control
                        size="sm"
                        value={draft.airline}
                        onChange={(e) => update({ airline: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label style={labelStyle}>Flight No.</Form.Label>
                    <Form.Control
                        size="sm"
                        value={draft.flightNo}
                        onChange={(e) => update({ flightNo: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={6} className="d-flex align-items-end gap-3 pb-1">
                    {["Refundable", "Non Refundable"].map((status) => (
                        <Form.Check
                            key={status}
                            type="radio"
                            name="refundable"
                            label={status}
                            checked={draft.refundableStatus === status}
                            onChange={() => update({ refundableStatus: status })}
                            style={labelStyle}
                        />
                    ))}
                </Col>
            </Row>

            <Row className="g-1 mb-2">
                <Col md={3}>
                    <Form.Label style={labelStyle}>Departure Airport</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Departure City"
                        value={draft.departureAirport}
                        onChange={(e) =>
                            update({ departureAirport: e.target.value })
                        }
                        style={inputStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Departure Date</Form.Label>
                    <CustomFlatpickr
                        className="form-control form-control-sm"
                        value={draft.departureDate}
                        onChange={(dates) => {
                            if (dates[0]) {
                                update({
                                    departureDate: dates[0]
                                        .toISOString()
                                        .split("T")[0],
                                });
                            }
                        }}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Departure Time</Form.Label>
                    <Form.Control
                        size="sm"
                        type="time"
                        value={draft.departureTime}
                        onChange={(e) =>
                            update({ departureTime: e.target.value })
                        }
                        style={inputStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Stop</Form.Label>
                    <Form.Select
                        size="sm"
                        value={draft.stop}
                        onChange={(e) => update({ stop: e.target.value })}
                        style={inputStyle}
                    >
                        <option>Non Stop</option>
                        <option>1 Stop</option>
                        <option>2 Stop</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Label style={labelStyle}>Stop Over</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="stops over"
                        value={draft.stopOver}
                        onChange={(e) => update({ stopOver: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
            </Row>

            <Row className="g-1 mb-2">
                <Col md={3}>
                    <Form.Label style={labelStyle}>Arrival Airport</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Arrival City"
                        value={draft.arrivalAirport}
                        onChange={(e) =>
                            update({ arrivalAirport: e.target.value })
                        }
                        style={inputStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Arrival Date</Form.Label>
                    <CustomFlatpickr
                        className="form-control form-control-sm"
                        value={draft.arrivalDate}
                        onChange={(dates) => {
                            if (dates[0]) {
                                update({
                                    arrivalDate: dates[0]
                                        .toISOString()
                                        .split("T")[0],
                                });
                            }
                        }}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Arrival Time</Form.Label>
                    <Form.Control
                        size="sm"
                        type="time"
                        value={draft.arrivalTime}
                        onChange={(e) =>
                            update({ arrivalTime: e.target.value })
                        }
                        style={inputStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Duration</Form.Label>
                    <Form.Control
                        size="sm"
                        value={draft.duration}
                        onChange={(e) => update({ duration: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
            </Row>

            <div
                className="mb-2"
                style={{ color: "#ff6600", cursor: "pointer", fontSize: "10px" }}
                onClick={() =>
                    update({ showBaggageDetails: !draft.showBaggageDetails })
                }
            >
                {draft.showBaggageDetails
                    ? "Hide More Details _ -"
                    : "Show More Details _ +"}
            </div>

            {draft.showBaggageDetails && (
                <div className="border p-2 mb-2">
                    <strong style={{ fontSize: "10px" }}>Baggage :</strong>
                    <Row className="g-1 mt-1">
                        {(
                            [
                                ["Adult", "adultCabin", "adultCheckIn"],
                                ["Child", "childCabin", "childCheckIn"],
                                ["Infant", "infantCabin", "infantCheckIn"],
                            ] as const
                        ).map(([label, cabinKey, checkInKey]) => (
                            <Col md={4} key={label}>
                                <div className="d-flex gap-2 align-items-center">
                                    <span style={labelStyle}>{label} Cabin</span>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={draft[cabinKey]}
                                        onChange={(e) =>
                                            update({
                                                [cabinKey]: Number(e.target.value),
                                            })
                                        }
                                        style={{ ...inputStyle, width: "50px" }}
                                    />
                                    <span style={labelStyle}>Check In</span>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={draft[checkInKey]}
                                        onChange={(e) =>
                                            update({
                                                [checkInKey]: Number(e.target.value),
                                            })
                                        }
                                        style={{ ...inputStyle, width: "50px" }}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-sm table-bordered mb-2">
                    <thead style={{ fontSize: "10px", background: "#f0f0f0" }}>
                        <tr>
                            <th>Pax Type</th>
                            <th>No of Pax</th>
                            <th>Currency</th>
                            <th>Price/ Pax</th>
                            <th>Mark Up/ Pax</th>
                            <th>Tax Type</th>
                            <th>Tax Amt</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: "10px" }}>
                        {draft.paxRows.map((row, index) => (
                            <tr key={index}>
                                <td>{row.paxType}</td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.noOfPax}
                                        onChange={(e) =>
                                            updatePaxRow(
                                                index,
                                                "noOfPax",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.currency}
                                        onChange={(e) =>
                                            updatePaxRow(
                                                index,
                                                "currency",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option>INR</option>
                                        <option>AED</option>
                                        <option>USD</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.pricePerPax}
                                        onChange={(e) =>
                                            updatePaxRow(
                                                index,
                                                "pricePerPax",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.markupPerPax}
                                        onChange={(e) =>
                                            updatePaxRow(
                                                index,
                                                "markupPerPax",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.taxType}
                                        onChange={(e) =>
                                            updatePaxRow(
                                                index,
                                                "taxType",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option>On Markup</option>
                                        <option>On Total</option>
                                        <option>Tax Extra with text</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.taxAmt}
                                        onChange={(e) =>
                                            updatePaxRow(
                                                index,
                                                "taxAmt",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>{row.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Row className="g-1">
                {[
                    ["Total", draft.total],
                    ["Total Mark Up", draft.totalMarkup],
                    ["Total Tax", draft.totalTax],
                    ["Final Price", draft.finalPrice],
                ].map(([label, val]) => (
                    <Col md={3} key={label as string}>
                        <Form.Label style={labelStyle}>{label}</Form.Label>
                        <Form.Control
                            size="sm"
                            readOnly
                            value={val as number}
                            style={inputStyle}
                        />
                    </Col>
                ))}
            </Row>
        </ItineraryFormPanel>
    );
};

export default FlightItineraryForm;
