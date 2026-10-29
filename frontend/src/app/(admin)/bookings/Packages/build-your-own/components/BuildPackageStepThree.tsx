"use client";

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import ViewPriceDetailModal from "./ViewPriceDetailModal";
import QueryDetailsSummary from "../../components/QueryDetailsSummary";
import {
    PackageBookingFormData,
    computePricing,
} from "../../types/packageBooking";

type BuildPackageStepThreeProps = {
    form: PackageBookingFormData;
    setForm: React.Dispatch<React.SetStateAction<PackageBookingFormData | null>>;
    setStep: (step: number) => void | Promise<void>;
    onSaveDraft: () => void;
    onSaveAndShare: () => void;
    saving: boolean;
};

type CostSectionId =
    | "pricingInfo"
    | "flightCost"
    | "visaCost"
    | "landPackageCost"
    | "totalPackageCost";

const DEFAULT_OPEN_SECTIONS: Record<CostSectionId, boolean> = {
    pricingInfo: true,
    flightCost: false,
    visaCost: false,
    landPackageCost: false,
    totalPackageCost: true,
};

type CostAccordionSectionProps = {
    title: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    headerExtra?: React.ReactNode;
    children: React.ReactNode;
};

const CostAccordionSection = ({
    title,
    isOpen,
    onToggle,
    headerExtra,
    children,
}: CostAccordionSectionProps) => (
    <div
        className={`pkg-cost-section${isOpen ? " is-open" : " is-collapsed"}`}
    >
        <div
            className="pkg-cost-header"
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            onClick={onToggle}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle();
                }
            }}
        >
            <span className="pkg-cost-header-title">{title}</span>
            {headerExtra ? (
                <div
                    className="pkg-cost-header-extra"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    {headerExtra}
                </div>
            ) : null}
            <Icon
                icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                className="pkg-cost-chevron"
            />
        </div>
        {isOpen ? <div className="pkg-cost-body">{children}</div> : null}
    </div>
);

const TAX_OPTIONS = [
    "Tax Extra with text",
    "On Markup",
    "Inclusive",
    "Extra GST",
];

const BuildPackageStepThree = ({
    form,
    setForm,
    setStep,
    onSaveDraft,
    onSaveAndShare,
    saving,
}: BuildPackageStepThreeProps) => {
    const [openSections, setOpenSections] =
        useState<Record<CostSectionId, boolean>>(DEFAULT_OPEN_SECTIONS);

    const toggleSection = (id: CostSectionId) => {
        setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const pricingType = form.pricingType;
    const isPerPerson = pricingType === "Per Person Pricing";

    const updateForm = (updates: Partial<PackageBookingFormData>) => {
        setForm((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, ...updates };
            return { ...updated, ...computePricing(updated) };
        });
    };

    const updateCost = (
        section: "flightCost" | "visaCost" | "landPackageCost",
        field: string,
        value: string | number
    ) => {
        setForm((prev) => {
            if (!prev) return prev;
            const updated = {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: field === "tax" ? value : Number(value) || 0,
                },
            };
            return { ...updated, ...computePricing(updated) };
        });
    };

    const updateShareBreakup = (field: string, checked: boolean) => {
        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                sharePriceBreakup: {
                    ...prev.sharePriceBreakup,
                    [field]: checked,
                },
            };
        });
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="pkg-title">Plan Your Travel</h5>
                <button
                    type="button"
                    className="pkg-nav-link"
                    onClick={() => setStep(2)}
                >
                    <Icon icon="mdi:arrow-left" /> Previous
                </button>
            </div>

            <QueryDetailsSummary form={form} showUpdateButton={false} />

            <div className="pkg-card mb-3">
                <Form.Check
                    type="radio"
                    label="Build with Single mark Up"
                    checked
                    readOnly
                />
            </div>

            {/* Pricing Info */}
            <CostAccordionSection
                title="Pricing Info"
                isOpen={openSections.pricingInfo}
                onToggle={() => toggleSection("pricingInfo")}
                headerExtra={<ViewPriceDetailModal />}
            >
                <div className="d-flex flex-wrap gap-4 mb-3">
                    <Form.Check
                        type="radio"
                        name="pricingtype"
                        label="Total Pricing"
                        checked={pricingType === "Total Pricing"}
                        onChange={() =>
                            updateForm({ pricingType: "Total Pricing" })
                        }
                    />
                    <Form.Check
                        type="radio"
                        name="pricingtype"
                        label="Per Person Pricing"
                        checked={isPerPerson}
                        onChange={() =>
                            updateForm({ pricingType: "Per Person Pricing" })
                        }
                    />
                </div>
                <div className="pkg-cost-row">
                    <span>Currency</span>
                    <Form.Select
                        size="sm"
                        style={{ maxWidth: 180 }}
                        value={form.currency}
                        onChange={(e) =>
                            updateForm({ currency: e.target.value })
                        }
                    >
                        <option>INR</option>
                        <option>AED</option>
                        <option>AUD</option>
                        <option>USD</option>
                    </Form.Select>
                </div>
            </CostAccordionSection>

            {/* Flight Cost */}
            <CostAccordionSection
                title="Flight Cost"
                isOpen={openSections.flightCost}
                onToggle={() => toggleSection("flightCost")}
            >
                    <div className="pkg-cost-row">
                        <span>Flight Cost</span>
                        <Form.Control
                            size="sm"
                            type="number"
                            style={{ maxWidth: 220 }}
                            value={form.flightCost.cost}
                            onChange={(e) =>
                                updateCost("flightCost", "cost", e.target.value)
                            }
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>Flight Mark Up</span>
                        <Form.Control
                            size="sm"
                            type="number"
                            style={{ maxWidth: 220 }}
                            value={form.flightCost.markup}
                            onChange={(e) =>
                                updateCost("flightCost", "markup", e.target.value)
                            }
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>Flight TAX</span>
                        <Form.Select
                            size="sm"
                            style={{ maxWidth: 220 }}
                            value={form.flightCost.tax}
                            onChange={(e) =>
                                updateCost("flightCost", "tax", e.target.value)
                            }
                        >
                            {TAX_OPTIONS.map((opt) => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </Form.Select>
                    </div>
                    <div className="pkg-cost-row">
                        <span>Total Flight Cost</span>
                        <Form.Control
                            size="sm"
                            readOnly
                            style={{ maxWidth: 220 }}
                            value={form.flightCost.total}
                        />
                    </div>
            </CostAccordionSection>

            {/* Visa Cost */}
            <CostAccordionSection
                title="Visa Cost"
                isOpen={openSections.visaCost}
                onToggle={() => toggleSection("visaCost")}
            >
                    <div className="pkg-cost-row">
                        <span>Visa Cost</span>
                        <Form.Control
                            size="sm"
                            type="number"
                            style={{ maxWidth: 220 }}
                            value={form.visaCost.cost}
                            onChange={(e) =>
                                updateCost("visaCost", "cost", e.target.value)
                            }
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>Visa Mark Up</span>
                        <Form.Control
                            size="sm"
                            type="number"
                            style={{ maxWidth: 220 }}
                            value={form.visaCost.markup}
                            onChange={(e) =>
                                updateCost("visaCost", "markup", e.target.value)
                            }
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>Visa TAX</span>
                        <Form.Select
                            size="sm"
                            style={{ maxWidth: 220 }}
                            value={form.visaCost.tax}
                            onChange={(e) =>
                                updateCost("visaCost", "tax", e.target.value)
                            }
                        >
                            {TAX_OPTIONS.map((opt) => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </Form.Select>
                    </div>
                    <div className="pkg-cost-row">
                        <span>Total Visa Cost</span>
                        <Form.Control
                            size="sm"
                            readOnly
                            style={{ maxWidth: 220 }}
                            value={form.visaCost.total}
                        />
                    </div>
            </CostAccordionSection>

            {/* Land Package Cost */}
            <CostAccordionSection
                title="Land Package Cost"
                isOpen={openSections.landPackageCost}
                onToggle={() => toggleSection("landPackageCost")}
            >
                    <div className="pkg-cost-row">
                        <span>Total *</span>
                        <Form.Control
                            size="sm"
                            type="number"
                            style={{ maxWidth: 220 }}
                            value={form.landPackageCost.cost}
                            onChange={(e) =>
                                updateCost(
                                    "landPackageCost",
                                    "cost",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>Mark Up (Fixed Amount) *</span>
                        <Form.Control
                            size="sm"
                            type="number"
                            style={{ maxWidth: 220 }}
                            value={form.landPackageCost.markup}
                            onChange={(e) =>
                                updateCost(
                                    "landPackageCost",
                                    "markup",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>TAX *</span>
                        <Form.Select
                            size="sm"
                            style={{ maxWidth: 220 }}
                            value={form.landPackageCost.tax}
                            onChange={(e) =>
                                updateCost(
                                    "landPackageCost",
                                    "tax",
                                    e.target.value
                                )
                            }
                        >
                            {TAX_OPTIONS.map((opt) => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </Form.Select>
                    </div>
                    <div className="pkg-cost-row">
                        <span>Total Cost with GST</span>
                        <Form.Control
                            size="sm"
                            readOnly
                            style={{ maxWidth: 220 }}
                            value={form.landPackageCost.total}
                        />
                    </div>
            </CostAccordionSection>

            {/* Total Package Cost */}
            <CostAccordionSection
                title="Total Package Cost"
                isOpen={openSections.totalPackageCost}
                onToggle={() => toggleSection("totalPackageCost")}
                headerExtra={
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        <span style={{ fontSize: 12 }}>Share Combined :</span>
                        <Form.Check
                            type="checkbox"
                            label="Flight Pricing"
                            checked={form.shareCombinedFlight}
                            onChange={(e) =>
                                updateForm({
                                    shareCombinedFlight: e.target.checked,
                                })
                            }
                        />
                        <Form.Check
                            type="checkbox"
                            label="Visa Pricing"
                            checked={form.shareCombinedVisa}
                            onChange={(e) =>
                                updateForm({
                                    shareCombinedVisa: e.target.checked,
                                })
                            }
                        />
                    </div>
                }
            >
                    <div className="pkg-cost-row">
                        <span>Discount</span>
                        <Form.Control
                            size="sm"
                            type="number"
                            style={{ maxWidth: 220 }}
                            value={form.discount}
                            onChange={(e) =>
                                updateForm({
                                    discount: Number(e.target.value) || 0,
                                })
                            }
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>Total Sales Price</span>
                        <Form.Control
                            size="sm"
                            readOnly
                            style={{ maxWidth: 220 }}
                            value={form.totalSalesPrice}
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>Advance Required to Book *</span>
                        <Form.Select
                            size="sm"
                            style={{ maxWidth: 220 }}
                            value={form.advanceRequiredPercent}
                            onChange={(e) =>
                                updateForm({
                                    advanceRequiredPercent: Number(e.target.value),
                                })
                            }
                        >
                            <option value={10}>10 %</option>
                            <option value={20}>20 %</option>
                            <option value={30}>30 %</option>
                            <option value={50}>50 %</option>
                        </Form.Select>
                    </div>
                    <div className="pkg-cost-row">
                        <span>Advance</span>
                        <Form.Control
                            size="sm"
                            readOnly
                            style={{ maxWidth: 220 }}
                            value={form.advance}
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>Total Balance</span>
                        <Form.Control
                            size="sm"
                            readOnly
                            style={{ maxWidth: 220 }}
                            value={form.totalBalance}
                        />
                    </div>
                    <div className="pkg-cost-row">
                        <span>TCS Applicable</span>
                        <div className="d-flex flex-wrap gap-3">
                            {(
                                [
                                    ["tcsPackage", "TCS Package"],
                                    ["tcsFlight", "TCS Flight"],
                                    ["tcsVisa", "TCS Visa"],
                                    ["displayOnProposal", "Display on Proposal"],
                                ] as const
                            ).map(([key, label]) => (
                                <Form.Check
                                    key={key}
                                    type="checkbox"
                                    label={label}
                                    checked={form[key]}
                                    onChange={(e) =>
                                        updateForm({ [key]: e.target.checked })
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div className="pkg-cost-row">
                        <span>Payment Mode</span>
                        <Form.Select
                            size="sm"
                            style={{ maxWidth: 220 }}
                            value={form.paymentMode}
                            onChange={(e) =>
                                updateForm({ paymentMode: e.target.value })
                            }
                        >
                            <option>Cheque</option>
                            <option>Draft</option>
                            <option>Cash</option>
                            <option>Online</option>
                        </Form.Select>
                    </div>
                    <div className="pkg-share-breakup mt-2">
                        <div className="d-flex flex-wrap align-items-center gap-3">
                            <strong style={{ fontSize: 12 }}>
                                Share Price Break Up :
                            </strong>
                            {(
                                [
                                    "flight",
                                    "hotel",
                                    "transfer",
                                    "sightseeing",
                                    "visa",
                                ] as const
                            ).map((key) => (
                                <Form.Check
                                    key={key}
                                    type="checkbox"
                                    label={
                                        key.charAt(0).toUpperCase() + key.slice(1)
                                    }
                                    checked={form.sharePriceBreakup[key]}
                                    onChange={(e) =>
                                        updateShareBreakup(key, e.target.checked)
                                    }
                                />
                            ))}
                        </div>
                    </div>
            </CostAccordionSection>

            <div className="d-flex justify-content-between mt-3">
                <Button
                    className="pkg-btn-draft"
                    disabled={saving}
                    onClick={onSaveDraft}
                >
                    {saving ? "Saving..." : "Save as Draft"}
                </Button>
                <Button
                    className="pkg-btn-primary"
                    disabled={saving}
                    onClick={onSaveAndShare}
                >
                    {saving ? "Saving..." : "Save & Share"}
                </Button>
            </div>
        </>
    );
};

export default BuildPackageStepThree;
