"use client";

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import CustomFlatpickr from "@/components/CustomFlatpickr";
import ItineraryFormPanel from "./ItineraryFormPanel";
import {
    CruiseItinerary,
    CruiseCabinRow,
    computeCruiseTotals,
    defaultCruiseItinerary,
    defaultCruiseCabinRow,
} from "../../../types/itineraryTypes";

type Props = {
    value?: CruiseItinerary;
    goingFrom: string;
    goingTo: string;
    travelDate: string;
    travelers: number;
    onSave: (data: CruiseItinerary) => void;
    onCancel: () => void;
};

const labelStyle = { fontSize: "10px" };
const inputStyle = { fontSize: "10px", padding: "4px 8px" };

const CruiseItineraryForm = ({
    value,
    goingFrom,
    goingTo,
    travelDate,
    travelers,
    onSave,
    onCancel,
}: Props) => {
    const [draft, setDraft] = useState<CruiseItinerary>(
        value || defaultCruiseItinerary(goingFrom, goingTo, travelDate, travelers)
    );

    useEffect(() => {
        if (value) setDraft(value);
    }, [value]);

    const update = (updates: Partial<CruiseItinerary>) => {
        setDraft((prev) => computeCruiseTotals({ ...prev, ...updates }));
    };

    const updateCabin = (
        index: number,
        field: keyof CruiseCabinRow,
        val: string | number
    ) => {
        setDraft((prev) => {
            const cabins = [...prev.cabins];
            cabins[index] = { ...cabins[index], [field]: val };
            return computeCruiseTotals({ ...prev, cabins });
        });
    };

    const addCabin = () => {
        setDraft((prev) =>
            computeCruiseTotals({
                ...prev,
                cabins: [...prev.cabins, defaultCruiseCabinRow(travelers)],
            })
        );
    };

    const removeCabin = (index: number) => {
        setDraft((prev) =>
            computeCruiseTotals({
                ...prev,
                cabins: prev.cabins.filter((_, i) => i !== index),
            })
        );
    };

    return (
        <ItineraryFormPanel
            title="Cruise"
            headerExtra={
                <Form.Control
                    size="sm"
                    placeholder="Supplier"
                    value={draft.supplier}
                    onChange={(e) => update({ supplier: e.target.value })}
                    style={{ ...inputStyle, width: "160px" }}
                />
            }
            onCancel={onCancel}
            onSave={() => onSave(computeCruiseTotals(draft))}
        >
            <Row className="g-1 mb-2">
                <Col md={2}>
                    <Form.Label style={labelStyle}>Start City</Form.Label>
                    <Form.Control
                        size="sm"
                        value={draft.startCity}
                        onChange={(e) => update({ startCity: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Embark Port</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Enter Location"
                        value={draft.embarkPort}
                        onChange={(e) => update({ embarkPort: e.target.value })}
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
                <Col md={1}>
                    <Form.Label style={labelStyle}>Time</Form.Label>
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
                    <Form.Label style={labelStyle}>Shipline</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Shipline"
                        value={draft.shipline}
                        onChange={(e) => update({ shipline: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label style={labelStyle}>Shipline Number</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Shipline Number"
                        value={draft.shiplineNumber}
                        onChange={(e) =>
                            update({ shiplineNumber: e.target.value })
                        }
                        style={inputStyle}
                    />
                </Col>
            </Row>

            <Row className="g-1 mb-2">
                <Col md={2}>
                    <Form.Label style={labelStyle}>End City</Form.Label>
                    <Form.Control
                        size="sm"
                        value={draft.endCity}
                        onChange={(e) => update({ endCity: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Debark Port</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Enter Location"
                        value={draft.debarkPort}
                        onChange={(e) => update({ debarkPort: e.target.value })}
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
                <Col md={1}>
                    <Form.Label style={labelStyle}>Time</Form.Label>
                    <Form.Control
                        size="sm"
                        type="time"
                        value={draft.arrivalTime}
                        onChange={(e) => update({ arrivalTime: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Duration</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Duration"
                        value={draft.duration}
                        onChange={(e) => update({ duration: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
            </Row>

            <div className="table-responsive">
                <table className="table table-sm table-bordered mb-2">
                    <thead style={{ fontSize: "10px", background: "#f0f0f0" }}>
                        <tr>
                            <th>Cabin</th>
                            <th>No Of Cabin</th>
                            <th>Meal Plan</th>
                            <th>Adults</th>
                            <th>Kids</th>
                            <th>Currency</th>
                            <th>Price/Adult</th>
                            <th>Price/Child</th>
                            <th>Mark Up/PP</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: "10px" }}>
                        {draft.cabins.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.cabin}
                                        onChange={(e) =>
                                            updateCabin(index, "cabin", e.target.value)
                                        }
                                        style={inputStyle}
                                    >
                                        <option value="">Select</option>
                                        <option>Interior</option>
                                        <option>Ocean View</option>
                                        <option>Balcony</option>
                                        <option>Suite</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.noOfCabin}
                                        onChange={(e) =>
                                            updateCabin(
                                                index,
                                                "noOfCabin",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.mealPlan}
                                        onChange={(e) =>
                                            updateCabin(
                                                index,
                                                "mealPlan",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option>EP</option>
                                        <option>CP</option>
                                        <option>MAP</option>
                                        <option>AP</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.adults}
                                        onChange={(e) =>
                                            updateCabin(
                                                index,
                                                "adults",
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
                                        value={row.kids}
                                        onChange={(e) =>
                                            updateCabin(
                                                index,
                                                "kids",
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
                                            updateCabin(
                                                index,
                                                "currency",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option>INR</option>
                                        <option>USD</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.priceAdult}
                                        onChange={(e) =>
                                            updateCabin(
                                                index,
                                                "priceAdult",
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
                                        value={row.priceChild}
                                        onChange={(e) =>
                                            updateCabin(
                                                index,
                                                "priceChild",
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
                                        value={row.markupPP}
                                        onChange={(e) =>
                                            updateCabin(
                                                index,
                                                "markupPP",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>{row.total}</td>
                                <td>
                                    <Button
                                        variant="link"
                                        className="p-0 text-success"
                                        onClick={addCabin}
                                    >
                                        <Icon icon="mdi:plus" />
                                    </Button>
                                    {draft.cabins.length > 1 && (
                                        <Button
                                            variant="link"
                                            className="p-0 text-danger"
                                            onClick={() => removeCabin(index)}
                                        >
                                            <Icon icon="mdi:minus" />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Row className="g-1">
                {[
                    ["Total", draft.total],
                    ["Total Mark Up", draft.totalMarkup],
                    ["Final Price", draft.finalPrice],
                ].map(([label, val]) => (
                    <Col md={4} key={label as string}>
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

export default CruiseItineraryForm;
