"use client";

import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import ItineraryFormPanel from "./ItineraryFormPanel";
import { GuideItinerary, defaultGuideItinerary } from "../../../types/itineraryTypes";

type Props = {
    value?: GuideItinerary;
    onSave: (data: GuideItinerary) => void;
    onCancel: () => void;
};

const labelStyle = { fontSize: "10px" };
const inputStyle = { fontSize: "10px", padding: "4px 8px" };

const GuideItineraryForm = ({ value, onSave, onCancel }: Props) => {
    const [draft, setDraft] = useState<GuideItinerary>(
        value || defaultGuideItinerary()
    );

    useEffect(() => {
        if (value) setDraft(value);
    }, [value]);

    const update = (updates: Partial<GuideItinerary>) => {
        setDraft((prev) => ({ ...prev, ...updates }));
    };

    return (
        <ItineraryFormPanel
            title="Guide"
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
                </tbody>
            </table>

            <Row className="g-1">
                <Col md={4}>
                    <Form.Label style={labelStyle}>Guide Name</Form.Label>
                    <Form.Control
                        size="sm"
                        placeholder="Name"
                        value={draft.guideName}
                        onChange={(e) => update({ guideName: e.target.value })}
                        style={inputStyle}
                    />
                </Col>
                <Col md={4}>
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
                    <Form.Label style={labelStyle}>Total Cost</Form.Label>
                    <Form.Control
                        size="sm"
                        type="number"
                        value={draft.totalCost}
                        onChange={(e) =>
                            update({ totalCost: Number(e.target.value) || 0 })
                        }
                        style={inputStyle}
                    />
                </Col>
            </Row>
        </ItineraryFormPanel>
    );
};

export default GuideItineraryForm;
