"use client";

import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import FlightDetailsPanel from "./FlightDetailsPanel";

const createRowId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `row-${Date.now()}-${Math.random()}`;

const COUNT_OPTIONS = Array.from({ length: 20 }, (_, index) => index + 1);
const MEAL_OPTIONS = ["Break Fast", "Lunch", "Dinner"];
const MEAL_TYPE_OPTIONS = ["Veg", "Non Veg", "AI"];
const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "AED", "GBP", "THB"];

export type ItineraryPanelKey =
  | "flight"
  | "transfer"
  | "sightseeing"
  | "meal"
  | "guide";

type PanelHeaderProps = {
  title: string;
  badge?: string;
};

const PanelHeader = ({ title, badge = "Inventory" }: PanelHeaderProps) => (
  <div className="ccp-detail-panel-header">
    <span>{title}</span>
    {badge && <span className="ccp-detail-panel-badge">{badge}</span>}
  </div>
);

const AddMoreFooter = ({ onClick }: { onClick?: () => void }) => (
  <div className="text-end mt-2">
    <button type="button" className="ccp-add-more-btn" onClick={onClick}>
      Add More
    </button>
  </div>
);

export { FlightDetailsPanel };

export const TransferDetailsPanel = ({ checkIn }: { checkIn: string }) => (
  <div className="ccp-detail-panel">
    <PanelHeader title="Transfer Details" />
    <div className="ccp-detail-panel-body">
      <div className="table-responsive">
        <table className="ccp-cost-table">
          <thead>
            <tr>
              <th>Category *</th>
              <th>Transfer Type</th>
              <th>Type</th>
              <th>Pickup City</th>
              <th>Pickup Area</th>
              <th>Drop City</th>
              <th>Drop Area</th>
              <th>Pax</th>
              <th>Supplier *</th>
              <th>Currency *</th>
              <th>Vehicle Name</th>
              <th>No Of Vehicle</th>
              <th>Cost/Vehicle</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Select size="sm" className="ccp-input">
                  <option>-- Select --</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select size="sm" className="ccp-input">
                  <option>-- Select --</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select size="sm" className="ccp-input" defaultValue="Sr">
                  <option>Sr</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" defaultValue="Dubai" />
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" />
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" defaultValue="Dubai" />
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" />
              </td>
              <td>
                <Form.Select size="sm" className="ccp-input" defaultValue="2">
                  <option>2</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" />
              </td>
              <td>
                <Form.Select size="sm" className="ccp-input">
                  <option value="">Select</option>
                  <option>INR</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" />
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" defaultValue="1" />
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" type="number" />
              </td>
              <td>
                <button type="button" className="btn btn-link text-danger p-0">
                  <IconifyIcon icon="mdi:delete-outline" />
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan={14}>
                <Row className="g-2 align-items-end">
                  <Col md={2}>
                    <label className="ccp-field-label">From Date</label>
                    <Form.Control
                      size="sm"
                      className="ccp-input"
                      defaultValue={checkIn}
                    />
                  </Col>
                  <Col md={2}>
                    <label className="ccp-field-label">Pickup Time</label>
                    <Form.Control size="sm" className="ccp-input" type="time" />
                  </Col>
                  <Col md={2}>
                    <label className="ccp-field-label">To Date</label>
                    <Form.Control
                      size="sm"
                      className="ccp-input"
                      defaultValue={checkIn}
                    />
                  </Col>
                  <Col md={2}>
                    <label className="ccp-field-label">Drop Time</label>
                    <Form.Control size="sm" className="ccp-input" type="time" />
                  </Col>
                  <Col md={2}>
                    <label className="ccp-field-label">Capacity/Vehicle</label>
                    <Form.Control size="sm" className="ccp-input" />
                  </Col>
                  <Col md={2}>
                    <label className="ccp-field-label">Markup/Vehicle</label>
                    <div className="d-flex align-items-center gap-1">
                      <IconifyIcon
                        icon="mdi:information-outline"
                        className="text-primary"
                      />
                      <Form.Check type="checkbox" />
                      <Form.Control size="sm" className="ccp-input" type="number" />
                    </div>
                  </Col>
                  <Col md={2}>
                    <label className="ccp-field-label">Total</label>
                    <Form.Control
                      size="sm"
                      className="ccp-input"
                      readOnly
                      defaultValue="0.00"
                    />
                  </Col>
                </Row>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AddMoreFooter />
    </div>
  </div>
);

export const SightseeingPanel = ({
  adults,
  options = [],
  listId,
}: {
  adults: number;
  options?: Array<{ _id: string; sightseeingName?: string }>;
  listId: string;
}) => {
  const [rows, setRows] = useState(() => [createRowId()]);

  const addRow = () => setRows((prev) => [...prev, createRowId()]);
  const removeRow = (id: string) =>
    setRows((prev) =>
      prev.length === 1 ? prev : prev.filter((rowId) => rowId !== id)
    );

  return (
    <div className="ccp-detail-panel">
      <PanelHeader title="Sightseeing (Paid / Optional)" />
      <div className="ccp-detail-panel-body">
        <datalist id={listId}>
          {options.map((item) => (
            <option key={item._id} value={item.sightseeingName || ""} />
          ))}
        </datalist>
        <div className="table-responsive">
          <table className="ccp-cost-table">
            <thead>
              <tr>
                <th>Sightseeing Name</th>
                <th>Type</th>
                <th>Time</th>
                <th>Supplier</th>
                <th>Currency</th>
                <th>Adult Count</th>
                <th>Per Adult Cost</th>
                <th>Per Adult Markup</th>
                <th>Optional</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((rowId) => (
                <tr key={rowId}>
                  <td className="ccp-sightseeing-name-cell">
                    <Form.Control
                      size="sm"
                      className="ccp-input"
                      list={listId}
                      placeholder="Type sightseeing name"
                    />
                  </td>
                  <td>
                    <Form.Select size="sm" className="ccp-input" defaultValue="SIC">
                      <option>SIC</option>
                      <option>PVT</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control size="sm" className="ccp-input" type="time" />
                  </td>
                  <td>
                    <Form.Control size="sm" className="ccp-input" />
                  </td>
                  <td>
                    <Form.Select size="sm" className="ccp-input" defaultValue="INR">
                      {CURRENCY_OPTIONS.map((code) => (
                        <option key={code}>{code}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      className="ccp-input"
                      defaultValue={String(Math.max(1, adults))}
                    >
                      {COUNT_OPTIONS.map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control size="sm" className="ccp-input" type="number" />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <IconifyIcon
                        icon="mdi:information-outline"
                        className="text-primary"
                      />
                      <Form.Control size="sm" className="ccp-input" type="number" />
                    </div>
                  </td>
                  <td>
                    <Form.Check type="checkbox" />
                  </td>
                  <td>
                    <Form.Control
                      size="sm"
                      className="ccp-input"
                      readOnly
                      defaultValue="0.00"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeRow(rowId)}
                      aria-label="Delete sightseeing row"
                    >
                      <IconifyIcon icon="mdi:delete-outline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AddMoreFooter onClick={addRow} />
      </div>
    </div>
  );
};

export const MealDetailsPanel = ({ adults }: { adults: number }) => {
  const [rows, setRows] = useState(() => [createRowId()]);

  const addRow = () => setRows((prev) => [...prev, createRowId()]);
  const removeRow = (id: string) =>
    setRows((prev) =>
      prev.length === 1 ? prev : prev.filter((rowId) => rowId !== id)
    );

  return (
    <div className="ccp-detail-panel">
      <PanelHeader title="Meal Details" />
      <div className="ccp-detail-panel-body">
        <div className="table-responsive">
          <table className="ccp-cost-table">
            <thead>
              <tr>
                <th>Meals</th>
                <th>Type</th>
                <th>Short Description</th>
                <th>Adult Count</th>
                <th>Supplier</th>
                <th>Currency</th>
                <th>Cost</th>
                <th>Total Markup</th>
                <th>Final Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((rowId) => (
                <tr key={rowId}>
                  <td>
                    <Form.Select size="sm" className="ccp-input" defaultValue="">
                      <option value="">-- Select --</option>
                      {MEAL_OPTIONS.map((meal) => (
                        <option key={meal}>{meal}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select size="sm" className="ccp-input" defaultValue="">
                      <option value="">-- Select --</option>
                      {MEAL_TYPE_OPTIONS.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      size="sm"
                      className="ccp-input"
                      placeholder="Max 80 Characters."
                      maxLength={80}
                    />
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      className="ccp-input"
                      defaultValue={String(Math.max(1, adults))}
                    >
                      {COUNT_OPTIONS.map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control size="sm" className="ccp-input" />
                  </td>
                  <td>
                    <Form.Select size="sm" className="ccp-input" defaultValue="INR">
                      {CURRENCY_OPTIONS.map((code) => (
                        <option key={code}>{code}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control size="sm" className="ccp-input" type="number" />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <IconifyIcon
                        icon="mdi:information-outline"
                        className="text-primary"
                      />
                      <Form.Check type="checkbox" />
                      <Form.Control size="sm" className="ccp-input" type="number" />
                    </div>
                  </td>
                  <td>
                    <Form.Control
                      size="sm"
                      className="ccp-input"
                      readOnly
                      defaultValue="0.00"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeRow(rowId)}
                      aria-label="Delete meal row"
                    >
                      <IconifyIcon icon="mdi:delete-outline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AddMoreFooter onClick={addRow} />
      </div>
    </div>
  );
};

export const GuideDetailsPanel = () => (
  <div className="ccp-detail-panel">
    <PanelHeader title="Guide Details" />
    <div className="ccp-detail-panel-body">
      <div className="table-responsive">
        <table className="ccp-cost-table">
          <thead>
            <tr>
              <th>Guide Name</th>
              <th>Cost Type</th>
              <th>Supplier</th>
              <th>Currency</th>
              <th>Total Cost</th>
              <th>Total Markup</th>
              <th>Final Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Control
                  as="textarea"
                  rows={2}
                  size="sm"
                  className="ccp-input"
                  placeholder="Max 350 Characters..."
                />
              </td>
              <td>
                <Form.Select size="sm" className="ccp-input" defaultValue="Total">
                  <option>Total</option>
                  <option>Per Person</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" />
              </td>
              <td>
                <Form.Select size="sm" className="ccp-input">
                  <option>INR</option>
                </Form.Select>
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" type="number" />
              </td>
              <td>
                <div className="d-flex align-items-center gap-1">
                  <IconifyIcon icon="mdi:information-outline" className="text-primary" />
                  <Form.Check type="checkbox" />
                  <Form.Control size="sm" className="ccp-input" type="number" />
                </div>
              </td>
              <td>
                <Form.Control size="sm" className="ccp-input" readOnly defaultValue="0.00" />
              </td>
              <td>
                <button type="button" className="btn btn-link text-danger p-0">
                  <IconifyIcon icon="mdi:delete-outline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AddMoreFooter />
    </div>
  </div>
);

export const ITINERARY_PANELS: {
  key: ItineraryPanelKey;
  label: string;
  tag: string;
}[] = [
  { key: "flight", label: "Flight Details", tag: "API" },
  { key: "transfer", label: "Transfer Details", tag: "Inventory" },
  {
    key: "sightseeing",
    label: "Sightseeing (Paid / Optional)",
    tag: "Inventory",
  },
  { key: "meal", label: "Meal Details", tag: "Inventory" },
  { key: "guide", label: "Guide Details", tag: "Inventory" },
];
