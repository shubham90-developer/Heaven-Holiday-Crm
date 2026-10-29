"use client";

import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import ItineraryFormPanel from "./ItineraryFormPanel";
import {
    MealsItinerary,
    MealsRow,
    computeMealsTotals,
    defaultMealsItinerary,
    defaultMealsRow,
} from "../../../types/itineraryTypes";

type Props = {
    value?: MealsItinerary;
    onSave: (data: MealsItinerary) => void;
    onCancel: () => void;
};

const inputStyle = { fontSize: "10px", padding: "4px 8px" };

const MealsItineraryForm = ({ value, onSave, onCancel }: Props) => {
    const [draft, setDraft] = useState<MealsItinerary>(
        value || defaultMealsItinerary()
    );

    useEffect(() => {
        if (value) setDraft(value);
    }, [value]);

    const updateItem = (
        index: number,
        field: keyof MealsRow,
        val: string | number
    ) => {
        setDraft((prev) => {
            const items = [...prev.items];
            items[index] = { ...items[index], [field]: val };
            return computeMealsTotals({ ...prev, items });
        });
    };

    const addItem = () => {
        setDraft((prev) =>
            computeMealsTotals({
                ...prev,
                items: [...prev.items, defaultMealsRow()],
            })
        );
    };

    const removeItem = (index: number) => {
        setDraft((prev) =>
            computeMealsTotals({
                ...prev,
                items: prev.items.filter((_, i) => i !== index),
            })
        );
    };

    return (
        <ItineraryFormPanel
            title="Meals"
            onCancel={onCancel}
            onSave={() => onSave(computeMealsTotals(draft))}
        >
            <div className="table-responsive">
                <table className="table table-sm table-bordered mb-2">
                    <thead style={{ fontSize: "10px", background: "#f0f0f0" }}>
                        <tr>
                            <th>Meals</th>
                            <th>Type</th>
                            <th>Options</th>
                            <th>Currency</th>
                            <th>Cost</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: "10px" }}>
                        {draft.items.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.meal}
                                        onChange={(e) =>
                                            updateItem(index, "meal", e.target.value)
                                        }
                                        style={inputStyle}
                                    >
                                        <option value="">select Meal</option>
                                        <option>Breakfast</option>
                                        <option>Lunch</option>
                                        <option>Dinner</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.type}
                                        onChange={(e) =>
                                            updateItem(index, "type", e.target.value)
                                        }
                                        style={inputStyle}
                                    >
                                        <option value="">Select Type</option>
                                        <option>Veg</option>
                                        <option>Non Veg</option>
                                        <option>Jain</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        value={row.options}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "options",
                                                e.target.value
                                            )
                                        }
                                        style={inputStyle}
                                    >
                                        <option value="">Select Options</option>
                                        <option>Buffet</option>
                                        <option>Set Menu</option>
                                        <option>Box Meal</option>
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
                                        value={row.cost}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "cost",
                                                Number(e.target.value)
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

export default MealsItineraryForm;
