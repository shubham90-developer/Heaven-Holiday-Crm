"use client";

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import ItineraryFormPanel from "./ItineraryFormPanel";
import {
    SightseeingItinerary,
    SightseeingItemRow,
    computeSightseeingItemTotal,
    defaultSightseeingItinerary,
    defaultSightseeingItemRow,
} from "../../../types/itineraryTypes";

type Props = {
    value?: SightseeingItinerary;
    destination: string;
    travelers: number;
    onSave: (data: SightseeingItinerary) => void;
    onCancel: () => void;
};

const labelStyle = { fontSize: "10px" };
const inputStyle = { fontSize: "10px", padding: "4px 8px" };

const SightseeingItineraryForm = ({
    value,
    destination,
    travelers,
    onSave,
    onCancel,
}: Props) => {
    const [draft, setDraft] = useState<SightseeingItinerary>(
        value || defaultSightseeingItinerary(destination, travelers)
    );

    useEffect(() => {
        if (value) setDraft(value);
    }, [value]);

    const update = (updates: Partial<SightseeingItinerary>) => {
        setDraft((prev) => ({ ...prev, ...updates }));
    };

    const updateItem = (
        index: number,
        field: keyof SightseeingItemRow,
        val: string | number | boolean
    ) => {
        setDraft((prev) => {
            const items = [...prev.items];
            const updated = { ...items[index], [field]: val };
            updated.total = computeSightseeingItemTotal(updated);
            items[index] = updated;
            return { ...prev, items };
        });
    };

    const addItem = () => {
        setDraft((prev) => ({
            ...prev,
            items: [...prev.items, defaultSightseeingItemRow(travelers)],
        }));
    };

    const removeItem = (index: number) => {
        setDraft((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    return (
        <ItineraryFormPanel
            title="Sightseeing"
            onCancel={onCancel}
            onSave={() => onSave(draft)}
        >
            <table className="table table-sm table-bordered mb-2">
                <tbody style={{ fontSize: "10px" }}>
                    <tr>
                        <td style={{ width: "120px", background: "#e9ecef" }}>
                            Supplier
                        </td>
                        <td>
                            <Form.Control
                                size="sm"
                                placeholder="Supplier"
                                value={draft.supplier}
                                onChange={(e) =>
                                    update({ supplier: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ background: "#e9ecef" }}>
                            Destination Covered
                        </td>
                        <td>
                            <Form.Control
                                size="sm"
                                value={draft.destinationCovered}
                                onChange={(e) =>
                                    update({ destinationCovered: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ background: "#e9ecef" }}>Sightseeing</td>
                        <td>
                            <Form.Control
                                size="sm"
                                value={draft.sightseeing}
                                onChange={(e) =>
                                    update({ sightseeing: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div
                className="mb-2"
                style={{ color: "#ff6600", cursor: "pointer", fontSize: "10px" }}
                onClick={() =>
                    update({ showOptionalSection: !draft.showOptionalSection })
                }
            >
                {draft.showOptionalSection
                    ? "Hide Optional/ Paid/ Extra Sightseeing _ -"
                    : "Show Optional/ Paid/ Extra Sightseeing _ +"}
            </div>

            {draft.showOptionalSection && (
                <>
                    <div className="table-responsive">
                        <table className="table table-sm table-bordered mb-2">
                            <thead
                                style={{ fontSize: "10px", background: "#f0f0f0" }}
                            >
                                <tr>
                                    <th>Type</th>
                                    <th>Adult</th>
                                    <th>Child</th>
                                    <th>Name</th>
                                    <th>Time</th>
                                    <th>Currency</th>
                                    <th>Cost/Adult</th>
                                    <th>Cost/Child</th>
                                    <th>Mark Up/Adult</th>
                                    <th>Mark Up/Child</th>
                                    <th>Optional</th>
                                    <th>Supplier</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: "10px" }}>
                                {draft.items.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={row.type}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                                style={inputStyle}
                                            >
                                                <option>SIC</option>
                                                <option>Private</option>
                                                <option>Ticket Only</option>
                                            </Form.Select>
                                        </td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                value={row.adult}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "adult",
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
                                                value={row.child}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "child",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                placeholder="Select Sightseeing"
                                                value={row.name}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                value={row.time}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "time",
                                                        e.target.value
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
                                                    updateItem(
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
                                                value={row.costAdult}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "costAdult",
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
                                                value={row.costChild}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "costChild",
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
                                                value={row.markupAdult}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "markupAdult",
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
                                                value={row.markupChild}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "markupChild",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </td>
                                        <td className="text-center">
                                            <Form.Check
                                                type="checkbox"
                                                checked={row.optional}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "optional",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                placeholder="Supplier"
                                                value={row.supplier}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "supplier",
                                                        e.target.value
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </td>
                                        <td>{row.total}</td>
                                        <td>
                                            {draft.items.length > 1 && (
                                                <Button
                                                    variant="link"
                                                    className="p-0 text-danger"
                                                    onClick={() => removeItem(index)}
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

                    <div className="text-end">
                        <Button
                            size="sm"
                            variant="link"
                            style={{ fontSize: "10px" }}
                            onClick={addItem}
                        >
                            Add More
                        </Button>
                    </div>
                </>
            )}
        </ItineraryFormPanel>
    );
};

export default SightseeingItineraryForm;
