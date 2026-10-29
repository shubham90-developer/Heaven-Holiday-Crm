"use client";

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import CustomFlatpickr from "@/components/CustomFlatpickr";
import ItineraryFormPanel from "./ItineraryFormPanel";
import {
    TransportItinerary,
    TransportVehicleRow,
    computeTransportTotals,
    defaultTransportItinerary,
    defaultTransportVehicleRow,
} from "../../../types/itineraryTypes";

type Props = {
    value?: TransportItinerary;
    goingFrom: string;
    travelDate: string;
    onSave: (data: TransportItinerary) => void;
    onCancel: () => void;
};

const labelStyle = { fontSize: "10px" };
const inputStyle = { fontSize: "10px", padding: "4px 8px" };

const TransportItineraryForm = ({
    value,
    goingFrom,
    travelDate,
    onSave,
    onCancel,
}: Props) => {
    const [draft, setDraft] = useState<TransportItinerary>(
        value || defaultTransportItinerary(goingFrom, travelDate, travelDate)
    );

    useEffect(() => {
        if (value) setDraft(value);
    }, [value]);

    const update = (updates: Partial<TransportItinerary>) => {
        setDraft((prev) => computeTransportTotals({ ...prev, ...updates }));
    };

    const updateVehicle = (
        index: number,
        field: keyof TransportVehicleRow,
        val: string | number
    ) => {
        setDraft((prev) => {
            const vehicles = [...prev.vehicles];
            vehicles[index] = { ...vehicles[index], [field]: val };
            return computeTransportTotals({ ...prev, vehicles });
        });
    };

    const addVehicle = () => {
        setDraft((prev) =>
            computeTransportTotals({
                ...prev,
                vehicles: [...prev.vehicles, defaultTransportVehicleRow()],
            })
        );
    };

    const removeVehicle = (index: number) => {
        setDraft((prev) =>
            computeTransportTotals({
                ...prev,
                vehicles: prev.vehicles.filter((_, i) => i !== index),
            })
        );
    };

    return (
        <ItineraryFormPanel
            title="Cab (Itinerary Transport)"
            onCancel={onCancel}
            onSave={() => onSave(computeTransportTotals(draft))}
        >
            <Row className="g-1 mb-2">
                <Col md={2}>
                    <Form.Label style={labelStyle}>PickUp City</Form.Label>
                    <Form.Control
                        size="sm"
                        value={draft.pickupCity}
                        onChange={(e) => update({ pickupCity: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label style={labelStyle}>PickUp Location</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Pick Up Location"
                        value={draft.pickupLocation}
                        onChange={(e) =>
                            update({ pickupLocation: e.target.value })
                        }
                        style={inputStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Date</Form.Label>
                    <CustomFlatpickr
                        className="form-control form-control-sm"
                        value={draft.pickupDate}
                        onChange={(dates) => {
                            if (dates[0]) {
                                update({
                                    pickupDate: dates[0]
                                        .toISOString()
                                        .split("T")[0],
                                });
                            }
                        }}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Time</Form.Label>
                    <Form.Control
                        size="sm"
                        type="time"
                        value={draft.pickupTime}
                        onChange={(e) => update({ pickupTime: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label style={labelStyle}>Duration</Form.Label>
                    <Form.Control
                        size="sm"
                        value={draft.duration}
                        onChange={(e) => update({ duration: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
            </Row>

            <Row className="g-1 mb-2">
                <Col md={2}>
                    <Form.Label style={labelStyle}>Drop City</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Drop City"
                        value={draft.dropCity}
                        onChange={(e) => update({ dropCity: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label style={labelStyle}>Drop Location</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Drop Location"
                        value={draft.dropLocation}
                        onChange={(e) =>
                            update({ dropLocation: e.target.value })
                        }
                        style={inputStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Date</Form.Label>
                    <CustomFlatpickr
                        className="form-control form-control-sm"
                        value={draft.dropDate}
                        onChange={(dates) => {
                            if (dates[0]) {
                                update({
                                    dropDate: dates[0].toISOString().split("T")[0],
                                });
                            }
                        }}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Time</Form.Label>
                    <Form.Control
                        size="sm"
                        type="time"
                        value={draft.dropTime}
                        onChange={(e) => update({ dropTime: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label style={labelStyle}>Remark</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Remark"
                        value={draft.remark}
                        onChange={(e) => update({ remark: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
            </Row>

            <div
                className="d-flex justify-content-between align-items-center p-2 mb-2"
                style={{ background: "#e9ecef" }}
            >
                <div className="d-flex gap-3">
                    {["Normal", "KM Based"].map((mode) => (
                        <Form.Check
                            key={mode}
                            type="radio"
                            name="transportMode"
                            label={mode}
                            checked={draft.transportMode === mode}
                            onChange={() => update({ transportMode: mode })}
                            style={labelStyle}
                        />
                    ))}
                </div>
                <Form.Control
                    size="sm"
                    placeholder="Supplier"
                    value={draft.supplier}
                    onChange={(e) => update({ supplier: e.target.value })}
                    style={{ ...inputStyle, width: "180px" }}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-sm table-bordered mb-2">
                    <thead style={{ fontSize: "10px", background: "#f0f0f0" }}>
                        <tr>
                            <th>Vehicle Name</th>
                            <th>AC</th>
                            <th>Currency</th>
                            <th>No Of Vehicle</th>
                            <th>Capacity /Vehicle</th>
                            <th>Total Cost /Vehicle</th>
                            <th>Total Mark Up /Vehicle</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: "10px" }}>
                        {draft.vehicles.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        value={row.vehicleName}
                                        onChange={(e) =>
                                            updateVehicle(
                                                index,
                                                "vehicleName",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.ac}
                                        onChange={(e) =>
                                            updateVehicle(index, "ac", e.target.value)
                                        }
                                        style={inputStyle}
                                    >
                                        <option>Yes</option>
                                        <option>No</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.currency}
                                        onChange={(e) =>
                                            updateVehicle(
                                                index,
                                                "currency",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option>INR</option>
                                        <option>AED</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.noOfVehicle}
                                        onChange={(e) =>
                                            updateVehicle(
                                                index,
                                                "noOfVehicle",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        value={row.capacity}
                                        onChange={(e) =>
                                            updateVehicle(
                                                index,
                                                "capacity",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.totalCostPerVehicle}
                                        onChange={(e) =>
                                            updateVehicle(
                                                index,
                                                "totalCostPerVehicle",
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
                                        value={row.totalMarkupPerVehicle}
                                        onChange={(e) =>
                                            updateVehicle(
                                                index,
                                                "totalMarkupPerVehicle",
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
                                        onClick={addVehicle}
                                    >
                                        <Icon icon="mdi:plus" />
                                    </Button>
                                    {draft.vehicles.length > 1 && (
                                        <Button
                                            variant="link"
                                            className="p-0 text-danger"
                                            onClick={() => removeVehicle(index)}
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
                <Col md={3}>
                    <Form.Label style={labelStyle}>Total Days</Form.Label>
                    <Form.Control
                        size="sm"
                        type="number"
                        value={draft.totalDays}
                        onChange={(e) =>
                            update({ totalDays: Number(e.target.value) })
                        }
                        style={inputStyle}
                    />
                </Col>
                {[
                    ["Total Price", draft.totalPrice],
                    ["Total Mark Up", draft.totalMarkup],
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

export default TransportItineraryForm;
