"use client";

import React from "react";
import { Modal, Button } from "react-bootstrap";

type DiscardConfirmModalProps = {
    show: boolean;
    proposalId?: number | string;
    customerName?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
};

const DiscardConfirmModal = ({
    show,
    proposalId,
    customerName,
    onConfirm,
    onCancel,
    loading,
}: DiscardConfirmModalProps) => (
    <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton style={{ background: "#274c6b", color: "#fff" }}>
            <Modal.Title style={{ fontSize: "14px" }}>Discard Proposal</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "13px" }}>
            <p className="mb-2">
                Are you sure you want to discard this package proposal?
            </p>
            {customerName && (
                <p className="mb-1">
                    <strong>Customer:</strong> {customerName}
                </p>
            )}
            {proposalId && (
                <p className="mb-0 text-muted">
                    <strong>Proposal ID:</strong> {proposalId}
                </p>
            )}
            <p className="mt-2 mb-0 text-danger" style={{ fontSize: "12px" }}>
                This action cannot be undone.
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Button
                variant="outline-secondary"
                size="sm"
                onClick={onCancel}
                disabled={loading}
            >
                Cancel
            </Button>
            <Button
                variant="danger"
                size="sm"
                onClick={onConfirm}
                disabled={loading}
            >
                {loading ? "Discarding..." : "Yes, Discard"}
            </Button>
        </Modal.Footer>
    </Modal>
);

export default DiscardConfirmModal;
