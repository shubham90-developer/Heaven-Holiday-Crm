"use client";

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import ItineraryFormPanel from "./ItineraryFormPanel";
import {
    AccommodationItinerary,
    AccommodationRoomRow,
    computeAccommodationTotals,
    defaultAccommodationItinerary,
    defaultAccommodationRoomRow,
} from "../../../types/itineraryTypes";

type Props = {
    value?: AccommodationItinerary;
    city: string;
    checkIn: string;
    nights: number;
    travelers: number;
    onSave: (data: AccommodationItinerary) => void;
    onCancel: () => void;
};

const labelStyle = { fontSize: "10px" };
const inputStyle = { fontSize: "10px", padding: "4px 8px" };

const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB");
};

const AccommodationItineraryForm = ({
    value,
    city,
    checkIn,
    nights,
    travelers,
    onSave,
    onCancel,
}: Props) => {
    const [draft, setDraft] = useState<AccommodationItinerary>(
        value ||
            defaultAccommodationItinerary(city, checkIn, nights, travelers)
    );

    useEffect(() => {
        if (value) setDraft(value);
    }, [value]);

    const update = (updates: Partial<AccommodationItinerary>) => {
        setDraft((prev) => computeAccommodationTotals({ ...prev, ...updates }));
    };

    const updateRoom = (
        index: number,
        field: keyof AccommodationRoomRow,
        val: string | number
    ) => {
        setDraft((prev) => {
            const rooms = [...prev.rooms];
            rooms[index] = { ...rooms[index], [field]: val };
            return computeAccommodationTotals({ ...prev, rooms });
        });
    };

    const addRoom = () => {
        setDraft((prev) =>
            computeAccommodationTotals({
                ...prev,
                rooms: [...prev.rooms, defaultAccommodationRoomRow(travelers)],
            })
        );
    };

    const removeRoom = (index: number) => {
        setDraft((prev) =>
            computeAccommodationTotals({
                ...prev,
                rooms: prev.rooms.filter((_, i) => i !== index),
            })
        );
    };

    const title = `Hotel in ${city || "City"} [ Check In: ${formatDate(checkIn || draft.checkIn)}, Night(s): ${nights || draft.nights} ]`;

    return (
        <ItineraryFormPanel
            title={title}
            onCancel={onCancel}
            onSave={() => onSave(computeAccommodationTotals(draft))}
        >
            <Row className="g-1 mb-2 align-items-end">
                <Col md={4}>
                    <div className="d-flex justify-content-between">
                        <Form.Label style={labelStyle}>Hotel Name</Form.Label>
                        <span
                            style={{
                                fontSize: "10px",
                                color: "#0d6efd",
                                cursor: "pointer",
                            }}
                        >
                            Add Hotel Manually
                        </span>
                    </div>
                    <Form.Control
                        size="sm"
                        placeholder="Hotel Name"
                        value={draft.hotelName}
                        onChange={(e) => update({ hotelName: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={2} className="pb-1">
                    <Form.Check
                        type="checkbox"
                        label="Inventory Hotel"
                        checked={draft.inventoryHotel}
                        onChange={(e) =>
                            update({ inventoryHotel: e.target.checked })
                        }
                        style={labelStyle}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label style={labelStyle}>Currency</Form.Label>
                    <Form.Select
                        size="sm"
                        value={draft.currency}
                        onChange={(e) => update({ currency: e.target.value })}
                        style={inputStyle}
                    >
                        <option>INR</option>
                        <option>AED</option>
                        <option>USD</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Label style={labelStyle}>Supplier</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Supplier"
                        value={draft.supplier}
                        onChange={(e) => update({ supplier: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
            </Row>

            <div className="table-responsive">
                <table className="table table-sm table-bordered mb-2">
                    <thead style={{ fontSize: "10px", background: "#f0f0f0" }}>
                        <tr>
                            <th>Room Type/Meal Plan</th>
                            <th># Rooms</th>
                            <th>#Adult</th>
                            <th>Cost/Night /Room</th>
                            <th>#Adult (extra bed)</th>
                            <th>Cost/Night /Extra Bed</th>
                            <th>Hotel Tax</th>
                            <th>Total Cost</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: "10px" }}>
                        {draft.rooms.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        value={row.roomType}
                                        onChange={(e) =>
                                            updateRoom(
                                                index,
                                                "roomType",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                        className="mb-1"
                                    />
                                    <Form.Select
                                        size="sm"
                                        value={row.mealPlan}
                                        onChange={(e) =>
                                            updateRoom(
                                                index,
                                                "mealPlan",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option>CP</option>
                                        <option>MAP</option>
                                        <option>AP</option>
                                        <option>EP</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.noOfRooms}
                                        onChange={(e) =>
                                            updateRoom(
                                                index,
                                                "noOfRooms",
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
                                        value={row.noOfAdult}
                                        onChange={(e) =>
                                            updateRoom(
                                                index,
                                                "noOfAdult",
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
                                        value={row.costPerNight}
                                        onChange={(e) =>
                                            updateRoom(
                                                index,
                                                "costPerNight",
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
                                        value={row.extraBedAdult}
                                        onChange={(e) =>
                                            updateRoom(
                                                index,
                                                "extraBedAdult",
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
                                        value={row.extraBedCost}
                                        onChange={(e) =>
                                            updateRoom(
                                                index,
                                                "extraBedCost",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.hotelTax}
                                        onChange={(e) =>
                                            updateRoom(
                                                index,
                                                "hotelTax",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option>Included</option>
                                        <option>Extra</option>
                                    </Form.Select>
                                </td>
                                <td>{row.totalCost}</td>
                                <td>
                                    {draft.rooms.length > 1 && (
                                        <Button
                                            variant="link"
                                            className="p-0 text-danger"
                                            onClick={() => removeRoom(index)}
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

            <Button
                size="sm"
                variant="link"
                className="p-0 mb-2"
                style={{ fontSize: "10px" }}
                onClick={addRoom}
            >
                Add More Room
            </Button>

            <Row
                className="g-1 p-2"
                style={{ background: "#e9ecef" }}
            >
                <Col md={4}>
                    <Form.Label style={labelStyle}>Total Cost</Form.Label>
                    <Form.Control
                        size="sm"
                        readOnly
                        value={draft.totalCost}
                        style={inputStyle}
                    />
                </Col>
                <Col md={4}>
                    <Form.Label style={labelStyle}>Total Markup</Form.Label>
                    <div className="d-flex gap-1">
                        <Form.Select
                            size="sm"
                            value={draft.markupType}
                            onChange={(e) =>
                                update({ markupType: e.target.value })
                            }
                            style={{ ...inputStyle, width: "80px" }}
                        >
                            <option>Fixed</option>
                            <option>Percent</option>
                        </Form.Select>
                        <Form.Control
                            size="sm"
                            type="number"
                            value={draft.markup}
                            onChange={(e) =>
                                update({ markup: Number(e.target.value) })
                            }
                            style={inputStyle}
                        />
                    </div>
                </Col>
                <Col md={4}>
                    <Form.Label style={labelStyle}>Final Price</Form.Label>
                    <Form.Control
                        size="sm"
                        readOnly
                        value={draft.finalPrice}
                        style={inputStyle}
                    />
                </Col>
            </Row>
        </ItineraryFormPanel>
    );
};

export default AccommodationItineraryForm;
