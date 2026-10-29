"use client";

import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import ItineraryFormPanel from "./ItineraryFormPanel";
import {
    OthersItinerary,
    OthersRow,
    computeOthersTotals,
    defaultOthersItinerary,
    defaultOthersRow,
} from "../../../types/itineraryTypes";

type Props = {
    value?: OthersItinerary;
    travelers: number;
    onSave: (data: OthersItinerary) => void;
    onCancel: () => void;
};

const inputStyle = { fontSize: "10px", padding: "4px 8px" };

const OthersItineraryForm = ({ value, travelers, onSave, onCancel }: Props) => {
    const [draft, setDraft] = useState<OthersItinerary>(
        value || defaultOthersItinerary(travelers)
    );

    useEffect(() => {
        if (value) setDraft(value);
    }, [value]);

    const update = (updates: Partial<OthersItinerary>) => {
        setDraft((prev) => computeOthersTotals({ ...prev, ...updates }));
    };

    const updateItem = (
        index: number,
        field: keyof OthersRow,
        val: string | number
    ) => {
        setDraft((prev) => {
            const items = [...prev.items];
            items[index] = { ...items[index], [field]: val };
            return computeOthersTotals({ ...prev, items });
        });
    };

    const addItem = () => {
        setDraft((prev) =>
            computeOthersTotals({
                ...prev,
                items: [...prev.items, defaultOthersRow(travelers)],
            })
        );
    };

    const removeItem = (index: number) => {
        setDraft((prev) =>
            computeOthersTotals({
                ...prev,
                items: prev.items.filter((_, i) => i !== index),
            })
        );
    };

    return (
        <ItineraryFormPanel
            title="Miscellaneous"
            onCancel={onCancel}
            onSave={() => onSave(computeOthersTotals(draft))}
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
                </tbody>
            </table>

            <div className="table-responsive">
                <table className="table table-sm table-bordered mb-2">
                    <thead style={{ fontSize: "10px", background: "#f0f0f0" }}>
                        <tr>
                            <th>Adult Pax</th>
                            <th>Child Pax</th>
                            <th>Infant Pax</th>
                            <th>Service Name</th>
                            <th>Service Type</th>
                            <th>Rate</th>
                            <th>Currency</th>
                            <th>Cost/ Adult</th>
                            <th>Cost/ Child</th>
                            <th>Cost/ Infant</th>
                            <th>Total</th>
                            <th>Comment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: "10px" }}>
                        {draft.items.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        value={row.adultPax}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "adultPax",
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
                                        value={row.childPax}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "childPax",
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
                                        value={row.infantPax}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "infantPax",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        placeholder="Service Name"
                                        value={row.serviceName}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "serviceName",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.serviceType}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "serviceType",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option value="">Type</option>
                                        <option>Insurance</option>
                                        <option>Permit</option>
                                        <option>Misc</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.rate}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "rate",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option>Per Pax</option>
                                        <option>Fixed</option>
                                    </Form.Select>
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
                                        value={row.costInfant}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "costInfant",
                                                Number(e.target.value)
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>{row.total}</td>
                                <td>
                                    <Form.Control
                                        size="sm"
                                        as="textarea"
                                        rows={1}
                                        placeholder="Comment"
                                        value={row.comment}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "comment",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    />
                                </td>
                                <td>
                                    <Button
                                        variant="link"
                                        className="p-0 text-success"
                                        onClick={addItem}
                                    >
                                        <Icon icon="mdi:plus" />
                                    </Button>
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

            <div className="d-flex justify-content-end align-items-center gap-2">
                <span style={{ fontSize: "10px" }}>Total Cost</span>
                <Form.Control
                    size="sm"
                    readOnly
                    value={draft.totalCost}
                    style={{ ...inputStyle, width: "200px" }}
                />
            </div>
        </ItineraryFormPanel>
    );
};

export default OthersItineraryForm;
