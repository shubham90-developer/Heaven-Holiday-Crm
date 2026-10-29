"use client";

import { useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetSuppliersQuery } from "@/store/services/supplierApi";
import { useGetAreasQuery } from "@/store/services/inventory/area-master/areaMasterApi";
import CollapsibleSection from "./CollapsibleSection";

const TRANSPORT_TYPES = ["cab", "bus", "train"] as const;
type TransportType = (typeof TRANSPORT_TYPES)[number];

const CURRENCIES = ["INR", "USD", "EUR", "AED", "GBP", "THB"];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, "0");
  const minutes = index % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

type SupplierRecord = {
  _id: string;
  companyName?: string;
  currencyType?: string;
};

type TransportEntry = {
  id: string;
  fromDate: string;
  fromCity: string;
  pickupLocation: string;
  pickupTime: string;
  toDate: string;
  toCity: string;
  dropLocation: string;
  dropTime: string;
  description: string;
  supplierName: string;
  currency: string;
  perAdultCost: string;
  taxPercent: string;
  markupEnabled: boolean;
  totalMarkup: string;
};

type OtherTransportsSectionProps = {
  adults?: number;
  checkInRaw?: string;
  currency?: string;
  destinationsCovered?: string;
  goingFrom?: string;
};

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const parseDestinations = (value?: string) =>
  (value || "")
    .split(/[,/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const formatMoney = (value: number) =>
  Number.isFinite(value) ? value.toFixed(2) : "0.00";

const nextId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const toIsoDate = (value?: string) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const createEntry = (
  fromDate: string,
  fromCity: string,
  toCity: string,
  currency: string
): TransportEntry => ({
  id: nextId("transport"),
  fromDate,
  fromCity,
  pickupLocation: "",
  pickupTime: "",
  toDate: fromDate,
  toCity,
  dropLocation: "",
  dropTime: "",
  description: "",
  supplierName: "",
  currency,
  perAdultCost: "",
  taxPercent: "",
  markupEnabled: false,
  totalMarkup: "",
});

const computeCosts = (entry: TransportEntry, adults: number) => {
  const perAdult = Number(entry.perAdultCost) || 0;
  const taxPercent = Number(entry.taxPercent) || 0;
  const totalCost = perAdult * Math.max(1, adults);
  const taxAmount = (totalCost * taxPercent) / 100;
  const markup = entry.markupEnabled ? Number(entry.totalMarkup) || 0 : 0;
  return {
    totalCost,
    taxAmount,
    total: totalCost + taxAmount + markup,
  };
};

const OtherTransportsSection = ({
  adults = 2,
  checkInRaw = "",
  currency = "INR",
  destinationsCovered = "",
  goingFrom = "",
}: OtherTransportsSectionProps) => {
  const defaultDate = toIsoDate(checkInRaw);
  const destList = parseDestinations(destinationsCovered);
  const defaultFromCity = (goingFrom || "").replace(/^NA$/i, "").trim();
  const defaultToCity = destList[0] || "";

  const [enabled, setEnabled] = useState<Record<TransportType, boolean>>({
    cab: false,
    bus: false,
    train: false,
  });
  const [entries, setEntries] = useState<Record<TransportType, TransportEntry[]>>(
    {
      cab: [],
      bus: [],
      train: [],
    }
  );

  const { data: suppliersResponse } = useGetSuppliersQuery(undefined);
  const { data: areasResponse } = useGetAreasQuery({ city: "", area: "" });
  const suppliers: SupplierRecord[] = suppliersResponse?.data || [];
  const cityOptions = useMemo(() => {
    const areas = areasResponse?.data || [];
    return Array.from(
      new Set(
        [
          defaultFromCity,
          ...destList,
          ...areas.map((item: { city?: string }) => item.city),
        ].filter(Boolean)
      )
    );
  }, [areasResponse, defaultFromCity, destList]);

  const toggleType = (type: TransportType, checked: boolean) => {
    setEnabled((prev) => ({ ...prev, [type]: checked }));
    if (checked) {
      setEntries((prev) =>
        prev[type].length
          ? prev
          : {
              ...prev,
              [type]: [
                createEntry(
                  defaultDate,
                  defaultFromCity,
                  defaultToCity,
                  currency
                ),
              ],
            }
      );
    }
  };

  const updateEntry = (
    type: TransportType,
    id: string,
    updater: (entry: TransportEntry) => TransportEntry
  ) => {
    setEntries((prev) => ({
      ...prev,
      [type]: prev[type].map((entry) =>
        entry.id === id ? updater(entry) : entry
      ),
    }));
  };

  const addEntry = (type: TransportType) => {
    const last = entries[type][entries[type].length - 1];
    setEntries((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        createEntry(
          last?.toDate || defaultDate,
          last?.toCity || defaultFromCity,
          last?.toCity || defaultToCity,
          last?.currency || currency
        ),
      ],
    }));
  };

  const removeEntry = (type: TransportType, id: string) => {
    setEntries((prev) => ({
      ...prev,
      [type]: prev[type].filter((entry) => entry.id !== id),
    }));
  };

  return (
    <CollapsibleSection title="Other Transports" headerVariant="teal">
      <div className="d-flex align-items-center gap-3 flex-wrap mb-2">
        <span className="ccp-transport-type-label">Transport Type:</span>
        {TRANSPORT_TYPES.map((type) => (
          <Form.Check
            key={type}
            type="checkbox"
            label={titleCase(type)}
            checked={enabled[type]}
            onChange={(e) => toggleType(type, e.target.checked)}
            className="mb-0"
            style={{ fontSize: "12px" }}
          />
        ))}
      </div>

      {TRANSPORT_TYPES.filter((type) => enabled[type]).map((type) => (
        <div key={type} className="ccp-transport-block">
          <div className="ccp-transport-type-header">{titleCase(type)}</div>
          {entries[type].map((entry, index) => {
            const costs = computeCosts(entry, adults);
            return (
              <div key={entry.id} className="ccp-transport-item">
                <div className="ccp-transport-item-header">
                  {titleCase(type)} {index + 1}
                </div>
                <div className="ccp-transport-item-body">
                  <div className="ccp-transport-logistics">
                    <div>
                      <label className="ccp-field-label">From Date</label>
                      <Form.Control
                        size="sm"
                        type="date"
                        className="ccp-input"
                        value={entry.fromDate}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            fromDate: e.target.value,
                            toDate: current.toDate || e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="ccp-field-label">From City</label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        list={`${entry.id}-from-cities`}
                        value={entry.fromCity}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            fromCity: e.target.value,
                          }))
                        }
                      />
                      <datalist id={`${entry.id}-from-cities`}>
                        {cityOptions.map((city) => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="ccp-field-label">Pickup Location</label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        value={entry.pickupLocation}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            pickupLocation: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="ccp-field-label">Pickup Time</label>
                      <Form.Select
                        size="sm"
                        className="ccp-input"
                        value={entry.pickupTime}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            pickupTime: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select</option>
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div>
                      <label className="ccp-field-label">To Date</label>
                      <Form.Control
                        size="sm"
                        type="date"
                        className="ccp-input"
                        value={entry.toDate}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            toDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="ccp-field-label">To City</label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        list={`${entry.id}-to-cities`}
                        value={entry.toCity}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            toCity: e.target.value,
                          }))
                        }
                      />
                      <datalist id={`${entry.id}-to-cities`}>
                        {cityOptions.map((city) => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="ccp-field-label">Drop Location</label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        value={entry.dropLocation}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            dropLocation: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="ccp-field-label">Drop Time</label>
                      <Form.Select
                        size="sm"
                        className="ccp-input"
                        value={entry.dropTime}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            dropTime: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select</option>
                        {TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div>
                      <label className="ccp-field-label">Description</label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        value={entry.description}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="ccp-transport-action">
                      <label className="ccp-field-label">Action</label>
                      <button
                        type="button"
                        className="ccp-transport-delete"
                        aria-label={`Delete ${titleCase(type)} ${index + 1}`}
                        disabled={entries[type].length <= 1}
                        onClick={() => removeEntry(type, entry.id)}
                      >
                        <IconifyIcon icon="mdi:delete" />
                      </button>
                    </div>
                  </div>

                  <div className="ccp-transport-costing">
                    <div>
                      <label className="ccp-field-label">
                        Supplier <span className="text-danger">*</span>
                      </label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        list={`${entry.id}-suppliers`}
                        value={entry.supplierName}
                        onChange={(e) => {
                          const selected = suppliers.find(
                            (item) => item.companyName === e.target.value
                          );
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            supplierName: e.target.value,
                            currency:
                              selected?.currencyType || current.currency,
                          }));
                        }}
                      />
                      <datalist id={`${entry.id}-suppliers`}>
                        {suppliers.map((supplier) => (
                          <option
                            key={supplier._id}
                            value={supplier.companyName || "Supplier"}
                          />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="ccp-field-label">
                        Currency <span className="text-danger">*</span>
                      </label>
                      <Form.Select
                        size="sm"
                        className="ccp-input"
                        value={entry.currency}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            currency: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select</option>
                        {CURRENCIES.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div>
                      <label className="ccp-field-label">
                        Per Adult Cost (x{adults})
                      </label>
                      <Form.Control
                        size="sm"
                        type="number"
                        min={0}
                        className="ccp-input"
                        value={entry.perAdultCost}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            perAdultCost: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="ccp-field-label">Tax (In %)</label>
                      <Form.Control
                        size="sm"
                        type="number"
                        min={0}
                        className="ccp-input"
                        value={entry.taxPercent}
                        onChange={(e) =>
                          updateEntry(type, entry.id, (current) => ({
                            ...current,
                            taxPercent: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="ccp-field-label">Tax Amount</label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        readOnly
                        value={formatMoney(costs.taxAmount)}
                      />
                    </div>
                    <div>
                      <label className="ccp-field-label">Total Cost</label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        readOnly
                        value={formatMoney(costs.totalCost)}
                      />
                    </div>
                    <div>
                      <label className="ccp-field-label">
                        Total Markup{" "}
                        <IconifyIcon
                          icon="mdi:information-outline"
                          className="text-primary"
                        />
                      </label>
                      <div className="d-flex align-items-center gap-1">
                        <Form.Check
                          type="checkbox"
                          className="mb-0"
                          checked={entry.markupEnabled}
                          onChange={(e) =>
                            updateEntry(type, entry.id, (current) => ({
                              ...current,
                              markupEnabled: e.target.checked,
                            }))
                          }
                        />
                        <Form.Control
                          size="sm"
                          type="number"
                          min={0}
                          className="ccp-input"
                          disabled={!entry.markupEnabled}
                          value={entry.totalMarkup}
                          onChange={(e) =>
                            updateEntry(type, entry.id, (current) => ({
                              ...current,
                              totalMarkup: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="ccp-field-label">Total</label>
                      <Form.Control
                        size="sm"
                        className="ccp-input"
                        readOnly
                        value={formatMoney(costs.total)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="ccp-transport-footer">
            <button
              type="button"
              className="ccp-add-more-btn"
              onClick={() => addEntry(type)}
            >
              Add More
            </button>
          </div>
        </div>
      ))}
    </CollapsibleSection>
  );
};

export default OtherTransportsSection;
