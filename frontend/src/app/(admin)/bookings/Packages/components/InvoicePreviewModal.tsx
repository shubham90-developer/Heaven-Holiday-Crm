"use client";

import React from "react";
import { Modal, Table } from "react-bootstrap";
import {
    InvoiceData,
    COMPANY_INFO,
    amountInWords,
} from "../types/invoiceTypes";
import { formatDisplayDate } from "../types/packageBooking";

type InvoicePreviewModalProps = {
    show: boolean;
    invoice: InvoiceData | null;
    customerEmail?: string;
    customerPhone?: string;
    onClose: () => void;
};

const InvoicePreviewModal = ({
    show,
    invoice,
    customerEmail,
    customerPhone,
    onClose,
}: InvoicePreviewModalProps) => {
    if (!invoice) return null;

    const formatDate = (d: string) => {
        if (!d) return "—";
        return formatDisplayDate(d);
    };

    return (
        <Modal show={show} onHide={onClose} size="xl" scrollable>
            <Modal.Header
                closeButton
                style={{ background: "#274c6b", color: "#fff" }}
            >
                <Modal.Title style={{ fontSize: "14px" }}>View Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ fontSize: "11px" }}>
                <div className="border p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                            className="rounded-circle border d-flex align-items-center justify-content-center"
                            style={{ width: 60, height: 60, fontSize: "8px", textAlign: "center" }}
                        >
                            LOGO
                        </div>
                        <div className="text-end" style={{ fontSize: "10px" }}>
                            <div className="fw-bold">{COMPANY_INFO.name}</div>
                            <div>{COMPANY_INFO.address}</div>
                            <div>Email ID: {COMPANY_INFO.email}</div>
                            <div>Contact No.: {COMPANY_INFO.phone}</div>
                            <div>Website URL: {COMPANY_INFO.website}</div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <div className="fw-bold mb-1">Customer Name</div>
                            <div>{invoice.billedTo}</div>
                            <div>{customerEmail}</div>
                            <div>{customerPhone}</div>
                        </div>
                        <div className="col-md-6">
                            <Table bordered size="sm" className="mb-0">
                                <tbody>
                                    <tr>
                                        <td>Invoice No.</td>
                                        <td>{invoice.invoiceNumber}</td>
                                    </tr>
                                    <tr>
                                        <td>Invoice / Due Date</td>
                                        <td>
                                            {formatDate(invoice.invoiceDate)} /{" "}
                                            {formatDate(invoice.paymentDueDate)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>PAN No.</td>
                                        <td>{invoice.panNo || "—"}</td>
                                    </tr>
                                    <tr>
                                        <td>GSTIN Number</td>
                                        <td>{invoice.gstinNumber || COMPANY_INFO.gstin}</td>
                                    </tr>
                                    <tr>
                                        <td>Client GST</td>
                                        <td>{invoice.clientGst || "—"}</td>
                                    </tr>
                                    <tr>
                                        <td>Proposal ID</td>
                                        <td>{invoice.proposalIdRef || "—"}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>

                    <Table bordered size="sm" className="mb-3">
                        <thead style={{ background: "#f0f0f0" }}>
                            <tr>
                                <th>Description of Goods\Services</th>
                                <th>HSN/SAC</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Total</th>
                                <th colSpan={2}>IGST</th>
                                <th>Total Price</th>
                            </tr>
                            <tr>
                                <th colSpan={5}></th>
                                <th>%</th>
                                <th>Amt.</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, i) => (
                                <tr key={i}>
                                    <td>
                                        <div>{item.category}</div>
                                        <div className="text-muted">{item.description}</div>
                                    </td>
                                    <td>{item.hsnSac}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.rate}</td>
                                    <td>{item.qty * item.rate}</td>
                                    <td>{item.gstPercent}</td>
                                    <td>{item.totalGst.toFixed(2)}</td>
                                    <td>{item.totalAmt.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="text-end mb-3" style={{ fontSize: "11px" }}>
                        <div>
                            <strong>Total Invoice Value:</strong> {invoice.currency}{" "}
                            {invoice.totalInvoiceValue.toFixed(2)}
                        </div>
                        <div>
                            <strong>IGST:</strong> {invoice.igst.toFixed(2)}
                        </div>
                        <div>
                            <strong>Advance:</strong> {invoice.currency}{" "}
                            {invoice.advance}
                        </div>
                        <div className="fw-bold">
                            Balance to be paid: {invoice.currency}{" "}
                            {invoice.balanceToBePaid.toFixed(2)}
                        </div>
                    </div>

                    <div className="mb-2">
                        <strong>Amount in Words:</strong>{" "}
                        {amountInWords(invoice.totalInvoiceValue)}
                    </div>

                    {invoice.notes && (
                        <div className="mb-2">
                            <strong>Notes:</strong>
                            <div
                                dangerouslySetInnerHTML={{ __html: invoice.notes }}
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <strong>Payment Terms:</strong>
                        <div
                            style={{ whiteSpace: "pre-wrap", fontSize: "10px" }}
                        >
                            {invoice.paymentTerms.replace(/<[^>]*>/g, "")}
                        </div>
                    </div>

                    <div className="text-end mt-4">
                        <div>For {COMPANY_INFO.name}</div>
                        <div
                            className="border d-inline-block my-2"
                            style={{ width: 80, height: 50 }}
                        />
                        <div className="fw-bold">Authorized Signatory</div>
                    </div>

                    <div
                        className="text-center mt-3 pt-2 border-top"
                        style={{ fontSize: "10px" }}
                    >
                        Note:- This is an electronically generated invoice and does
                        not require a physical signature
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default InvoicePreviewModal;
