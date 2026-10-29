"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";

// UI only — replace with real B2B category / markup slab data from your API later
type MarkupSlab = {
  id: string;
  title: string;
  status: "Active" | "Inactive";
  defaultB2B: boolean;
  defaultB2C: boolean;
  defaultB2CLoggedIn: boolean;
};

const SLABS: MarkupSlab[] = [];

type TabKey = "markup-slabs" | "other-markup" | "manage-fare-type";

const TABS: { key: TabKey; label: string }[] = [
  { key: "markup-slabs", label: "Markup Slabs" },
  { key: "other-markup", label: "Other Markup" },
  { key: "manage-fare-type", label: "Manage Fare Type" },
];

const MarkupSlabsList = () => {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("markup-slabs");

  const goToAdd = () => {
    router.push("/settings/mark-ups/add-markup-slab");
  };

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <Button
              key={t.key}
              variant={tab === t.key ? "primary" : "outline-secondary"}
              size="sm"
              style={{ fontSize: "10px" }}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </Button>
          ))}
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-success" size="sm" style={{ fontSize: "10px" }}>
            <Icon icon="mdi:open-in-new" className="me-1" /> New View
          </Button>
          <Button
            variant="primary"
            size="sm"
            style={{ fontSize: "10px" }}
            onClick={goToAdd}
          >
            <Icon icon="mdi:plus" className="me-1" /> Add B2B Category
          </Button>
        </div>
      </div>

      {tab === "markup-slabs" ? (
        <div className="table-responsive">
          <table className="table table-sm table-bordered mb-0 align-middle">
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Default B2B</th>
                <th>Default B2C</th>
                <th>Default B2C Logged-In</th>
                <th style={{ width: "80px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {SLABS.length === 0 ? (
                <tr>
                  <td colSpan={7}>No. records found</td>
                </tr>
              ) : (
                SLABS.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.title}</td>
                    <td>{s.status}</td>
                    <td className="text-center">
                      {s.defaultB2B && <Icon icon="mdi:check" className="text-success" />}
                    </td>
                    <td className="text-center">
                      {s.defaultB2C && <Icon icon="mdi:check" className="text-success" />}
                    </td>
                    <td className="text-center">
                      {s.defaultB2CLoggedIn && (
                        <Icon icon="mdi:check" className="text-success" />
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-1 justify-content-center">
                        <Button variant="primary" size="sm" style={{ fontSize: "10px" }} title="edit">
                          <Icon icon="mdi:edit" />
                        </Button>
                        <Button variant="danger" size="sm" style={{ fontSize: "10px" }} title="delete">
                          <Icon icon="mdi:delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5 text-muted" style={{ fontSize: 12 }}>
          {tab === "other-markup" ? "Other Markup" : "Manage Fare Type"} — UI
          not built yet.
        </div>
      )}
    </Card>
  );
};

export default MarkupSlabsList;
