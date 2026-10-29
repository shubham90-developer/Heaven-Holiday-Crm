"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form } from "react-bootstrap";
import toast from "react-hot-toast";

type RowKey =
  | "package-domestic"
  | "package-international"
  | "package-byo"
  | "hotel-domestic"
  | "hotel-international"
  | "flight-domestic"
  | "flight-international"
  | "flight-own-series-fare"
  | "sightseeing-domestic"
  | "sightseeing-international"
  | "transfer-domestic"
  | "transfer-international";

type RowState = {
  commission: string;
  tds: boolean;
  markupDiscount: "Markup" | "Discount";
  markupType: string;
  markup: string;
};

type RowDef = {
  key: RowKey;
  category: string;
  type: string;
  hasCommission: boolean; // Flight rows show My Commission (%) + TDS
  markupTypeOptions: string[];
  defaultMarkupType: string;
  firstOfCategory: boolean;
  categoryRowSpan?: number;
};

const FIXED_PER_PERSON = "Fixed Per Person On Sale Price";
const FIXED = "Fixed";

const ROWS: RowDef[] = [
  {
    key: "package-domestic",
    category: "Package",
    type: "Domestic",
    hasCommission: false,
    markupTypeOptions: [FIXED_PER_PERSON, FIXED, "Percentage"],
    defaultMarkupType: FIXED_PER_PERSON,
    firstOfCategory: true,
    categoryRowSpan: 3,
  },
  {
    key: "package-international",
    category: "Package",
    type: "International",
    hasCommission: false,
    markupTypeOptions: [FIXED_PER_PERSON, FIXED, "Percentage"],
    defaultMarkupType: FIXED_PER_PERSON,
    firstOfCategory: false,
  },
  {
    key: "package-byo",
    category: "Package",
    type: "BYO",
    hasCommission: false,
    markupTypeOptions: [FIXED_PER_PERSON, FIXED, "Percentage"],
    defaultMarkupType: FIXED_PER_PERSON,
    firstOfCategory: false,
  },
  {
    key: "hotel-domestic",
    category: "Hotel",
    type: "Domestic",
    hasCommission: false,
    markupTypeOptions: [FIXED, "Percentage"],
    defaultMarkupType: FIXED,
    firstOfCategory: true,
    categoryRowSpan: 2,
  },
  {
    key: "hotel-international",
    category: "Hotel",
    type: "International",
    hasCommission: false,
    markupTypeOptions: [FIXED, "Percentage"],
    defaultMarkupType: FIXED,
    firstOfCategory: false,
  },
  {
    key: "flight-domestic",
    category: "Flight",
    type: "Domestic",
    hasCommission: true,
    markupTypeOptions: [FIXED, "Percentage"],
    defaultMarkupType: FIXED,
    firstOfCategory: true,
    categoryRowSpan: 3,
  },
  {
    key: "flight-international",
    category: "Flight",
    type: "International",
    hasCommission: true,
    markupTypeOptions: [FIXED, "Percentage"],
    defaultMarkupType: FIXED,
    firstOfCategory: false,
  },
  {
    key: "flight-own-series-fare",
    category: "Flight",
    type: "Own Series Fare",
    hasCommission: true,
    markupTypeOptions: [FIXED, "Percentage"],
    defaultMarkupType: FIXED,
    firstOfCategory: false,
  },
  {
    key: "sightseeing-domestic",
    category: "Sightseeing",
    type: "Domestic",
    hasCommission: false,
    markupTypeOptions: [FIXED, "Percentage"],
    defaultMarkupType: FIXED,
    firstOfCategory: true,
    categoryRowSpan: 2,
  },
  {
    key: "sightseeing-international",
    category: "Sightseeing",
    type: "International",
    hasCommission: false,
    markupTypeOptions: [FIXED, "Percentage"],
    defaultMarkupType: FIXED,
    firstOfCategory: false,
  },
  {
    key: "transfer-domestic",
    category: "Tranfer",
    type: "Domestic",
    hasCommission: false,
    markupTypeOptions: [FIXED, "Percentage"],
    defaultMarkupType: FIXED,
    firstOfCategory: true,
    categoryRowSpan: 2,
  },
  {
    key: "transfer-international",
    category: "Tranfer",
    type: "International",
    hasCommission: false,
    markupTypeOptions: [FIXED, "Percentage"],
    defaultMarkupType: FIXED,
    firstOfCategory: false,
  },
];

const initialRowState = (): Record<RowKey, RowState> =>
  ROWS.reduce((acc, row) => {
    acc[row.key] = {
      commission: "",
      tds: false,
      markupDiscount: "Markup",
      markupType: row.defaultMarkupType,
      markup: "",
    };
    return acc;
  }, {} as Record<RowKey, RowState>);

const AddMarkupSlab = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [rows, setRows] = useState<Record<RowKey, RowState>>(initialRowState);
  const [insuranceCommission, setInsuranceCommission] = useState("");

  const updateRow = (key: RowKey, patch: Partial<RowState>) => {
    setRows((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const handleSubmit = () => {
    // UI only — wire this up to your create-agency-marketplace-rate API later
    console.log("Saving agency marketplace rate", {
      title,
      status,
      rows,
      insuranceCommission,
    });
    toast.success("Agency marketplace rate saved");
    router.push("/settings/mark-ups");
  };

  return (
    <Card className="p-3">
      <h6 className="fw-bold mb-3">Add Agency MarketPlace Rate</h6>

      <div className="d-flex flex-wrap gap-3 align-items-end mb-4">
        <Form.Group style={{ minWidth: 280, flex: 1 }}>
          <Form.Label className="small">
            Title <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            size="sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group style={{ minWidth: 160 }}>
          <Form.Label className="small">
            Status <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            size="sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Select>
        </Form.Group>
      </div>

      <div className="table-responsive">
        <table className="table table-sm table-bordered align-middle mb-0">
          <thead>
            <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
              <th style={{ width: "40px" }}>#</th>
              <th>Type</th>
              <th style={{ width: "140px" }}>My Commission (%)</th>
              <th style={{ width: "50px" }}>TDS</th>
              <th style={{ width: "130px" }}>Markup/Discount</th>
              <th style={{ width: "220px" }}>Markup Type</th>
              <th style={{ width: "140px" }}>Markup</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "12px" }}>
            {ROWS.map((row) => (
              <tr key={row.key}>
                {row.firstOfCategory && (
                  <td rowSpan={row.categoryRowSpan} className="fw-semibold align-middle">
                    {row.category}
                  </td>
                )}
                <td>{row.type}</td>
                <td>
                  {row.hasCommission && (
                    <Form.Control
                      size="sm"
                      value={rows[row.key].commission}
                      onChange={(e) =>
                        updateRow(row.key, { commission: e.target.value })
                      }
                    />
                  )}
                </td>
                <td className="text-center">
                  {row.hasCommission && (
                    <Form.Check
                      type="checkbox"
                      checked={rows[row.key].tds}
                      onChange={(e) => updateRow(row.key, { tds: e.target.checked })}
                    />
                  )}
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    value={rows[row.key].markupDiscount}
                    onChange={(e) =>
                      updateRow(row.key, {
                        markupDiscount: e.target.value as "Markup" | "Discount",
                      })
                    }
                  >
                    <option value="Markup">Markup</option>
                    <option value="Discount">Discount</option>
                  </Form.Select>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    value={rows[row.key].markupType}
                    onChange={(e) => updateRow(row.key, { markupType: e.target.value })}
                  >
                    {row.markupTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    value={rows[row.key].markup}
                    onChange={(e) => updateRow(row.key, { markup: e.target.value })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-sm table-bordered align-middle mb-0">
          <thead>
            <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
              <th style={{ width: "120px" }}>#</th>
              <th>Agent Commission (%) - (On Agency Commission)</th>
              <th>-</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "12px" }}>
            <tr>
              <td className="fw-semibold">Insurance</td>
              <td colSpan={2}>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    size="sm"
                    style={{ maxWidth: 160 }}
                    value={insuranceCommission}
                    onChange={(e) => setInsuranceCommission(e.target.value)}
                  />
                  <span>% (On Agency Commission)</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex gap-2 justify-content-end mt-4">
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => router.push("/settings/mark-ups")}
        >
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Card>
  );
};

export default AddMarkupSlab;
