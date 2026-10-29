"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Form, Row, Col, Table, Card } from "react-bootstrap";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import InvoicePreviewModal from "./InvoicePreviewModal";
import {
    InvoiceData,
    InvoiceItemRow,
    buildInvoiceFromBooking,
    computeInvoiceTotals,
    defaultInvoiceItem,
    computeInvoiceItemTotal,
} from "../types/invoiceTypes";
import { PackageBookingFormData } from "../types/packageBooking";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type InvoiceFormProps = {
    booking: PackageBookingFormData & { _id: string };
    onSave: (
        id: string,
        data: {
            invoice: InvoiceData;
            received: number;
            balance: number;
            bookingStage: string;
        }
    ) => Promise<void>;
    onCancel: () => void;
};

const labelStyle = { fontSize: "10px" };
const inputStyle = { fontSize: "11px", padding: "4px 8px" };

const quillModules = {
    toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
    ],
};

const InvoiceForm = ({ booking, onSave, onCancel }: InvoiceFormProps) => {
    const [draft, setDraft] = useState<InvoiceData | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (booking) {
            setDraft(buildInvoiceFromBooking(booking));
        }
    }, [booking]);

    if (!draft) {
        return <Card className="p-4 text-center">Loading invoice...</Card>;
    }

    const update = (updates: Partial<InvoiceData>) => {
        setDraft((prev) =>
            prev ? computeInvoiceTotals({ ...prev, ...updates }) : prev
        );
    };

    const updateItem = (
        index: number,
        field: keyof InvoiceItemRow,
        value: string | number
    ) => {
        setDraft((prev) => {
            if (!prev) return prev;
            const items = [...prev.items];
            items[index] = computeInvoiceItemTotal({
                ...items[index],
                [field]: value,
            });
            return computeInvoiceTotals({ ...prev, items });
        });
    };

    const addItem = () => {
        setDraft((prev) =>
            prev
                ? computeInvoiceTotals({
                      ...prev,
                      items: [...prev.items, defaultInvoiceItem()],
                  })
                : prev
        );
    };

    const removeItem = (index: number) => {
        setDraft((prev) => {
            if (!prev || prev.items.length <= 1) return prev;
            return computeInvoiceTotals({
                ...prev,
                items: prev.items.filter((_, i) => i !== index),
            });
        });
    };

    const handleSave = async () => {
        if (!draft.billedTo || !draft.invoiceNumber) {
            toast.error("Billed To and Invoice Number are required");
            return;
        }
        setSaving(true);
        try {
            const computed = computeInvoiceTotals(draft);
            await onSave(booking._id, {
                invoice: computed,
                received: computed.advance,
                balance: computed.balanceToBePaid,
                bookingStage: "Invoice Generated",
            });
            toast.success("Invoice saved successfully");
        } catch {
            toast.error("Failed to save invoice");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Card className="border">
                <Card.Header
                    className="d-flex justify-content-between align-items-center"
                    style={{ background: "#274c6b", color: "#fff" }}
                >
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>Invoice</span>
                    <Button
                        size="sm"
                        variant="outline-light"
                        style={{ fontSize: "10px" }}
                    >
                        + My Invoice List
                    </Button>
                </Card.Header>

                <Card.Body style={{ fontSize: "11px" }}>
                    <Row className="g-2 mb-2">
                        <Col md={3}>
                            <Form.Label style={labelStyle}>
                                Billed To <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                value={draft.billedTo}
                                onChange={(e) =>
                                    update({ billedTo: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Label style={labelStyle}>Currency</Form.Label>
                            <Form.Select
                                size="sm"
                                value={draft.currency}
                                onChange={(e) =>
                                    update({ currency: e.target.value })
                                }
                                style={inputStyle}
                            >
                                <option>INR</option>
                                <option>USD</option>
                                <option>AED</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Label style={labelStyle}>
                                Invoice Date <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                type="date"
                                value={draft.invoiceDate}
                                onChange={(e) =>
                                    update({ invoiceDate: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Label style={labelStyle}>
                                Payment Due Date <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                type="date"
                                value={draft.paymentDueDate}
                                onChange={(e) =>
                                    update({ paymentDueDate: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label style={labelStyle}>
                                Invoice Number <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                value={draft.invoiceNumber}
                                onChange={(e) =>
                                    update({ invoiceNumber: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </Col>
                    </Row>

                    <Row className="g-2 mb-2">
                        <Col md={4}>
                            <Form.Label style={labelStyle}>Client Address</Form.Label>
                            <Form.Control
                                size="sm"
                                placeholder="Client Address"
                                value={draft.clientAddress}
                                onChange={(e) =>
                                    update({ clientAddress: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Label style={labelStyle}>
                                Pin/Postal Code <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                value={draft.pinCode}
                                onChange={(e) =>
                                    update({ pinCode: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Label style={labelStyle}>
                                Client City <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                placeholder="Client City"
                                value={draft.clientCity}
                                onChange={(e) =>
                                    update({ clientCity: e.target.value })
                                }
                                style={inputStyle}
                            />
                        </Col>
                        <Col md={2}>
                            <Form.Label style={labelStyle}>Client State</Form.Label>
                            <Form.Select
                                size="sm"
                                value={draft.clientState}
                                onChange={(e) =>
                                    update({ clientState: e.target.value })
                                }
                                style={inputStyle}
                            >
                                <option value="">Select</option>
                                <option>Maharashtra</option>
                                <option>Karnataka</option>
                                <option>Delhi</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Form.Label style={labelStyle}>Client GST</Form.Label>
                            <Form.Select
                                size="sm"
                                value={draft.clientGst}
                                onChange={(e) =>
                                    update({ clientGst: e.target.value })
                                }
                                style={inputStyle}
                            >
                                <option>No</option>
                                <option>Yes</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    <Row className="g-2 mb-3">
                        <Col md={4}>
                            <Form.Label style={labelStyle}>
                                Sales By <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                size="sm"
                                value={draft.salesBy}
                                onChange={(e) =>
                                    update({ salesBy: e.target.value })
                                }
                                style={inputStyle}
                            >
                                <option>RAJENDRA BUGADE</option>
                                <option>{draft.salesBy}</option>
                            </Form.Select>
                            <div className="mt-1 text-muted" style={{ fontSize: "10px" }}>
                                Email: {draft.salesEmail} Phone: {draft.salesPhone}
                            </div>
                        </Col>
                    </Row>

                    <div className="table-responsive mb-2">
                        <Table bordered size="sm" style={{ fontSize: "10px" }}>
                            <thead style={{ background: "#f0f0f0" }}>
                                <tr>
                                    <th>Category /Description</th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                    <th>Discount</th>
                                    <th>Markup</th>
                                    <th>GST On</th>
                                    <th>Total GST</th>
                                    <th>Total Amt.</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {draft.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Control
                                                size="sm"
                                                value={item.category}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "category",
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-1"
                                                style={inputStyle}
                                            />
                                            <Form.Control
                                                size="sm"
                                                value={item.hsnSac}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "hsnSac",
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-1"
                                                style={inputStyle}
                                            />
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                size="sm"
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "description",
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
                                                value={item.qty}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "qty",
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
                                                value={item.rate}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "rate",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={item.discountType}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "discountType",
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-1"
                                                style={inputStyle}
                                            >
                                                <option>Fixed</option>
                                                <option>Percent</option>
                                            </Form.Select>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                value={item.discount}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "discount",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={item.markupType}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "markupType",
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-1"
                                                style={inputStyle}
                                            >
                                                <option>Fixed</option>
                                                <option>Percent</option>
                                            </Form.Select>
                                            <Form.Control
                                                size="sm"
                                                type="number"
                                                value={item.markup}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "markup",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                style={inputStyle}
                                            />
                                        </td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={item.gstOn}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "gstOn",
                                                        e.target.value
                                                    )
                                                }
                                                className="mb-1"
                                                style={inputStyle}
                                            >
                                                <option>No tax</option>
                                                <option>On Total</option>
                                                <option>On Markup</option>
                                            </Form.Select>
                                            <Form.Select
                                                size="sm"
                                                value={item.gstPercent}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "gstPercent",
                                                        e.target.value
                                                    )
                                                }
                                                style={inputStyle}
                                            >
                                                <option>0%</option>
                                                <option>5%</option>
                                                <option>12%</option>
                                                <option>18%</option>
                                            </Form.Select>
                                        </td>
                                        <td>{item.totalGst.toFixed(2)}</td>
                                        <td>{item.totalAmt.toFixed(2)}</td>
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
                        </Table>
                    </div>

                    <div className="text-end mb-3">
                        <Button
                            size="sm"
                            variant="link"
                            style={{ fontSize: "11px" }}
                            onClick={addItem}
                        >
                            Add More Item
                        </Button>
                    </div>

                    <Row className="g-2 mb-3 justify-content-end">
                        {(
                            [
                                ["subTotal", "Sub Total", true],
                                ["igst", "IGST", false],
                                ["otherDiscount", "Other Discount", false],
                                ["totalInvoiceValue", "Total Invoice Value", true],
                                ["advance", "Advance", false],
                                ["balanceToBePaid", "Balance to be paid", true],
                            ] as const satisfies ReadonlyArray<
                                [keyof InvoiceData, string, boolean]
                            >
                        ).map(([key, label, readOnly]) => (
                            <Col md={3} key={key}>
                                <Form.Label style={labelStyle}>{label}</Form.Label>
                                <Form.Control
                                    size="sm"
                                    type="number"
                                    readOnly={readOnly}
                                    value={draft[key] as number}
                                    onChange={(e) =>
                                        update({
                                            [key]: Number(e.target.value),
                                        })
                                    }
                                    style={inputStyle}
                                />
                            </Col>
                        ))}
                    </Row>

                    <Row className="g-3 mb-3">
                        <Col md={6}>
                            <Form.Label style={labelStyle}>Notes</Form.Label>
                            <ReactQuill
                                theme="snow"
                                value={draft.notes}
                                onChange={(val) => update({ notes: val })}
                                modules={quillModules}
                                style={{ minHeight: 120 }}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label style={labelStyle}>Payment Terms</Form.Label>
                            <ReactQuill
                                theme="snow"
                                value={draft.paymentTerms}
                                onChange={(val) => update({ paymentTerms: val })}
                                modules={quillModules}
                                style={{ minHeight: 120 }}
                            />
                        </Col>
                    </Row>

                    <div className="d-flex gap-3 mb-2">
                        <Form.Check
                            type="checkbox"
                            label="Allow Partial Payment"
                            checked={draft.allowPartialPayment}
                            onChange={(e) =>
                                update({ allowPartialPayment: e.target.checked })
                            }
                            style={labelStyle}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Display Markup"
                            checked={draft.displayMarkup}
                            onChange={(e) =>
                                update({ displayMarkup: e.target.checked })
                            }
                            style={labelStyle}
                        />
                    </div>
                </Card.Body>

                <Card.Footer className="d-flex justify-content-end gap-2">
                    <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => setShowPreview(true)}
                    >
                        Preview
                    </Button>
                    <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </Card.Footer>
            </Card>

            <InvoicePreviewModal
                show={showPreview}
                invoice={draft}
                customerEmail={booking.customerDetails?.email}
                customerPhone={booking.customerDetails?.mobile}
                onClose={() => setShowPreview(false)}
            />
        </>
    );
};

export default InvoiceForm;
