"use client";

import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

export type PackageAction =
    | "view-proposal"
    | "modify-proposal"
    | "discard"
    | "update-payment"
    | "invoice"
    | "fulfillment"
    | "old-fulfillment";

type PackageActionDropdownProps = {
    onAction: (action: PackageAction) => void;
};

const ACTION_ITEMS: { key: PackageAction; label: string; implemented: boolean }[] = [
    { key: "view-proposal", label: "View Proposal", implemented: true },
    { key: "modify-proposal", label: "Modify Proposal", implemented: true },
    { key: "discard", label: "Discard", implemented: true },
    { key: "update-payment", label: "Update Payment", implemented: true },
    { key: "invoice", label: "Invoice", implemented: true },
    { key: "fulfillment", label: "Fullfillment", implemented: true },
    { key: "old-fulfillment", label: "Old Fullfillment", implemented: true },
];

const PackageActionDropdown = ({ onAction }: PackageActionDropdownProps) => {
    const [show, setShow] = useState(false);

    const handleSelect = (action: PackageAction, implemented: boolean) => {
        setShow(false);
        if (!implemented) {
            toast("This feature will be available soon", { icon: "🚧" });
            return;
        }
        onAction(action);
    };

    return (
        <Dropdown show={show} onToggle={(next) => setShow(!!next)}>
            <Dropdown.Toggle
                variant="outline-primary"
                size="sm"
                id="package-action-dropdown"
                style={{
                    fontSize: "10px",
                    padding: "2px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                }}
            >
                Select <Icon icon="mdi:chevron-down" width={14} />
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ fontSize: "11px", minWidth: "160px" }}>
                {ACTION_ITEMS.map((item) => (
                    <Dropdown.Item
                        key={item.key}
                        onClick={() => handleSelect(item.key, item.implemented)}
                        style={{ color: "#0d6efd" }}
                    >
                        {item.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default PackageActionDropdown;
