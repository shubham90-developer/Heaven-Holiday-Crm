"use client";

import React from "react";
import { Button } from "react-bootstrap";

type ItineraryFormPanelProps = {
    title: string;
    children: React.ReactNode;
    onCancel: () => void;
    onSave: () => void;
    headerExtra?: React.ReactNode;
};

const ItineraryFormPanel = ({
    title,
    children,
    onCancel,
    onSave,
    headerExtra,
}: ItineraryFormPanelProps) => (
    <div className="border mt-3">
        <div
            className="d-flex justify-content-between align-items-center px-3 py-2"
            style={{ background: "#4a4a4a", color: "#fff", fontSize: "12px" }}
        >
            <div className="d-flex align-items-center gap-3 flex-wrap">
                <strong>{title}</strong>
                {headerExtra}
            </div>
        </div>
        <div className="p-2" style={{ fontSize: "11px" }}>
            {children}
        </div>
        <div
            className="d-flex justify-content-end gap-2 p-2 border-top"
            style={{ background: "#f8f9fa" }}
        >
            <Button
                size="sm"
                variant="outline-danger"
                style={{ fontSize: "11px", minWidth: "80px" }}
                onClick={onCancel}
            >
                Cancel
            </Button>
            <Button
                size="sm"
                variant="danger"
                style={{ fontSize: "11px", minWidth: "80px" }}
                onClick={onSave}
            >
                Save
            </Button>
        </div>
    </div>
);

export default ItineraryFormPanel;
