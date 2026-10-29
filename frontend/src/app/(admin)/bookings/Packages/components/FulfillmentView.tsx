"use client";

import React, { useMemo, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    Row,
    Accordion,
} from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    PackageBookingFormData,
    formatDisplayDate,
    getCustomerName,
} from "../types/packageBooking";
import {
    FulfillmentData,
    FulfillmentServiceItem,
    FulfillmentSummary,
    NetProfitRow,
    ServiceCategoryKey,
    SupplierPaymentRow,
    TravellerRow,
    buildSupplierPaymentsFromServices,
    computeFulfillmentSummary,
    formatFulfillmentCurrency,
    getDestinationsList,
    getPackageDisplayName,
    getTravelDateRange,
    uid,
} from "../types/fulfillmentTypes";

type FulfillmentViewProps = {
    booking: PackageBookingFormData & { _id: string; createdAt?: string };
    fulfillment: FulfillmentData;
    onChange: (data: FulfillmentData) => void;
    editable: boolean;
    onSave?: () => Promise<void>;
    saving?: boolean;
};

const sectionBtnStyle: React.CSSProperties = {
    borderRadius: "50%",
    width: 28,
    height: 28,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const CollapsibleHeader = ({
    title,
    open,
    onToggle,
    bg = "dark",
    extra,
}: {
    title: React.ReactNode;
    open: boolean;
    onToggle: () => void;
    bg?: string;
    extra?: React.ReactNode;
}) => (
    <Card.Header
        className={`bg-${bg} text-white d-flex justify-content-between align-items-center p-2`}
        style={{ fontSize: "12px" }}
    >
        <b>{title}</b>
        <div className="d-flex align-items-center gap-2">
            {extra}
            <Button size="sm" variant="light" style={sectionBtnStyle} onClick={onToggle}>
                <Icon icon={open ? "mdi:minus" : "mdi:plus"} width={16} />
            </Button>
        </div>
    </Card.Header>
);

const CATEGORY_CONFIG: {
    key: keyof Pick<
        FulfillmentData,
        "hotels" | "flights" | "transfers" | "sightseeings" | "meals" | "visa" | "others"
    >;
    label: string;
    color: string;
    subLabel?: string;
}[] = [
    { key: "hotels", label: "Hotels", color: "#1a3a5c" },
    { key: "flights", label: "Flights", color: "#2c5f8a", subLabel: "(Update Flight)" },
    { key: "transfers", label: "Transfers", color: "#3a8a8a", subLabel: "(Add More)" },
    { key: "sightseeings", label: "Sightseeings", color: "#2d6a4f", subLabel: "(Add More)" },
    { key: "meals", label: "Meals", color: "#c45c26", subLabel: "(Add More)" },
    { key: "visa", label: "Visa", color: "#6b4c9a", subLabel: "(Add More)" },
    { key: "others", label: "Others", color: "#4a4a4a", subLabel: "(Add More)" },
];

const SERVICE_BUTTONS: { key: ServiceCategoryKey; label: string }[] = [
    { key: "flights", label: "Flights" },
    { key: "guide", label: "Guide" },
    { key: "hotel", label: "Hotel" },
    { key: "insurance", label: "Insurance" },
    { key: "meals", label: "Meals" },
    { key: "others", label: "Others" },
    { key: "sightseeing", label: "Sightseeing" },
    { key: "transfers", label: "Transfers" },
    { key: "visa", label: "Visa" },
];

const FulfillmentView = ({
    booking,
    fulfillment,
    onChange,
    editable,
    onSave,
    saving,
}: FulfillmentViewProps) => {
    const router = useRouter();
    const customer = booking.customerDetails;
    const summary = useMemo(
        () => computeFulfillmentSummary(booking, fulfillment),
        [booking, fulfillment]
    );

    const [openSections, setOpenSections] = useState({
        travellers: true,
        sales: true,
        supplier: true,
        netProfit: true,
        summary: true,
        cashFlow: true,
        services: true,
        itinerary: true,
    });
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        hotels: true,
    });
    const [showAllDays, setShowAllDays] = useState(false);

    const toggleSection = (key: keyof typeof openSections) =>
        setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

    const updateFulfillment = (patch: Partial<FulfillmentData>) =>
        onChange({ ...fulfillment, ...patch });

    const updateTraveller = (id: string, patch: Partial<TravellerRow>) =>
        updateFulfillment({
            travellers: fulfillment.travellers.map((t) =>
                t.id === id ? { ...t, ...patch } : t
            ),
        });

    const addTraveller = () =>
        updateFulfillment({
            travellers: [
                ...fulfillment.travellers,
                {
                    id: uid(),
                    type: "Adult",
                    salutation: "",
                    firstMiddleName: "",
                    lastName: "",
                    passportNo: "",
                    issueDate: "",
                    expiryDate: "",
                    dob: "",
                    panNo: "",
                    nationality: "",
                },
            ],
        });

    const removeTraveller = (id: string) =>
        updateFulfillment({
            travellers: fulfillment.travellers.filter((t) => t.id !== id),
        });

    const updateSupplier = (id: string, patch: Partial<SupplierPaymentRow>) =>
        updateFulfillment({
            supplierPayments: fulfillment.supplierPayments.map((row) => {
                if (row.id !== id) return row;
                const updated = { ...row, ...patch };
                updated.totalCost =
                    Number(updated.serviceCost || 0) -
                    Number(updated.discount || 0) +
                    Number(updated.extra || 0);
                updated.balance =
                    Number(updated.totalCost || 0) - Number(updated.paidAmount || 0);
                return updated;
            }),
        });

    const addSupplier = () =>
        updateFulfillment({
            supplierPayments: [
                ...fulfillment.supplierPayments,
                {
                    id: uid(),
                    supplierName: "",
                    serviceCost: 0,
                    discount: 0,
                    extra: 0,
                    totalCost: 0,
                    paidAmount: 0,
                    balance: 0,
                },
            ],
        });

    const updateServiceItem = (
        category: (typeof CATEGORY_CONFIG)[number]["key"],
        id: string,
        patch: Partial<FulfillmentServiceItem>
    ) =>
        updateFulfillment({
            [category]: fulfillment[category].map((item) =>
                item.id === id ? { ...item, ...patch } : item
            ),
        } as Partial<FulfillmentData>);

    const addServiceItem = (category: (typeof CATEGORY_CONFIG)[number]["key"]) =>
        updateFulfillment({
            [category]: [
                ...fulfillment[category],
                {
                    id: uid(),
                    label: "",
                    supplier: "",
                    cost: 0,
                    markup: 0,
                    total: 0,
                },
            ],
        } as Partial<FulfillmentData>);

    const setAllSightseeingType = (type: FulfillmentServiceItem["sightseeingType"]) =>
        updateFulfillment({
            sightseeings: fulfillment.sightseeings.map((item) => ({
                ...item,
                sightseeingType: type,
            })),
        });

    const toggleServiceIncluded = (key: ServiceCategoryKey) => {
        if (!editable) return;
        updateFulfillment({
            servicesIncluded: {
                ...fulfillment.servicesIncluded,
                [key]: !fulfillment.servicesIncluded[key],
            },
        });
    };

    const handleGenerateVoucher = () => {
        toast.success("Voucher generation initiated");
    };

    const handleRefreshSuppliers = () => {
        const payments = buildSupplierPaymentsFromServices(fulfillment);
        updateFulfillment({ supplierPayments: payments });
        toast.success("Supplier payments refreshed from services");
    };

    const renderSummaryGrid = (s: FulfillmentSummary) => (
        <Row className="g-0 text-center" style={{ fontSize: "12px" }}>
            {[
                { label: "Old Cost", value: s.oldCost },
                { label: "New Cost", value: s.newCost },
                { label: "Billed to Customer", value: s.billedToCustomer },
                { label: "Ops Profit", value: s.opsProfit, color: "#dc3545" },
                { label: "Original Profit", value: s.originalProfit },
                { label: "Net Profit", value: s.netProfit, color: "#198754" },
            ].map((item) => (
                <Col md={2} key={item.label} className="border p-2">
                    <div className="text-muted" style={{ fontSize: "10px" }}>
                        {item.label}
                    </div>
                    <div style={{ color: item.color, fontWeight: 600 }}>
                        {formatFulfillmentCurrency(item.value, booking.currency)}
                    </div>
                </Col>
            ))}
        </Row>
    );

    return (
        <div style={{ fontSize: "12px" }}>
            {/* Query Detail */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title="Query Detail"
                    open
                    onToggle={() => {}}
                    extra={
                        <div className="d-flex align-items-center gap-3">
                            <Badge bg={customer.customerType === "B2B" ? "primary" : "success"}>
                                {customer.customerType}
                            </Badge>
                            <Form.Check
                                type="checkbox"
                                label="Lock File"
                                checked={fulfillment.lockFile}
                                disabled={!editable}
                                onChange={(e) =>
                                    updateFulfillment({ lockFile: e.target.checked })
                                }
                                className="text-white mb-0"
                                style={{ fontSize: "11px" }}
                            />
                        </div>
                    }
                />
                <Card.Body>
                    <Row className="g-2 mb-2">
                        <Col md={6}>
                            <div className="border p-2">
                                <b>Package Name:</b> {getPackageDisplayName(booking)}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="border p-2">
                                <b>Start City:</b> {booking.goingFrom || "—"}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="border p-2">
                                <b>Destinations:</b> {getDestinationsList(booking) || "—"}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="border p-2">
                                <b>Travel Date:</b> {getTravelDateRange(booking)}
                            </div>
                        </Col>
                    </Row>
                    <hr className="my-2" />
                    <Row className="g-2 mb-2">
                        <Col md={2} className="fw-bold">
                            Sales Person
                        </Col>
                        <Col md={3}>
                            <div className="border p-2">
                                <b>Name:</b> {booking.owner || "—"}
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="border p-2">
                                <b>Email:</b> —
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="border p-2">
                                <b>Mobile Number:</b> —
                            </div>
                        </Col>
                    </Row>
                    <Row className="g-2">
                        <Col md={2} className="fw-bold">
                            Customer Contact
                        </Col>
                        <Col md={3}>
                            <div className="border p-2">
                                <b>Name:</b> {getCustomerName(customer)}
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="border p-2">
                                <b>Email:</b> {customer.email || "—"}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="border p-2 d-flex justify-content-between align-items-center">
                                <span>
                                    <b>Mobile Number:</b> +91 {customer.mobile || "—"}
                                </span>
                                <div className="d-flex gap-1">
                                    <Button size="sm" variant="primary" className="py-0 px-1">
                                        <Icon icon="mdi:phone" width={14} />
                                    </Button>
                                    <Button size="sm" variant="success" className="py-0 px-1">
                                        <Icon icon="mdi:whatsapp" width={14} />
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Proposal bar */}
            <Row className="mb-3 align-items-center">
                <Col md={4}>
                    <strong style={{ fontSize: "16px" }}>
                        Proposal ID: {booking.proposalId}
                    </strong>
                </Col>
                <Col md={8} className="d-flex justify-content-md-end gap-2 flex-wrap align-items-center">
                    <Badge bg="danger" className="p-2">
                        Voucher: {booking.voucherStatus || "Pending"}
                    </Badge>
                    <Form.Select
                        size="sm"
                        style={{ width: 150, fontSize: "12px" }}
                        value={fulfillment.voucherType}
                        disabled={!editable && fulfillment.lockFile}
                        onChange={(e) =>
                            updateFulfillment({
                                voucherType: e.target.value as FulfillmentData["voucherType"],
                            })
                        }
                    >
                        <option value="Only Voucher">Only Voucher</option>
                        <option value="With Itinerary">With Itinerary</option>
                    </Form.Select>
                    <Button
                        size="sm"
                        variant="warning"
                        style={{ fontSize: "12px" }}
                        onClick={handleGenerateVoucher}
                    >
                        Generate Voucher
                    </Button>
                </Col>
            </Row>

            {/* Traveller Details */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title={`Traveller Details (${fulfillment.travellers.length} Adults)`}
                    open={openSections.travellers}
                    onToggle={() => toggleSection("travellers")}
                    bg="dark"
                    extra={
                        editable && (
                            <Button
                                size="sm"
                                variant="light"
                                style={{ fontSize: "10px" }}
                                onClick={addTraveller}
                            >
                                + Add
                            </Button>
                        )
                    }
                />
                {openSections.travellers && (
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered mb-0">
                                <thead className="table-light">
                                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                                        <th>TYPE</th>
                                        <th>SALUTATION</th>
                                        <th>FIRST-MIDDLE NAME *</th>
                                        <th>LAST NAME</th>
                                        <th>PASSPORT NO.</th>
                                        <th>ISSUE DATE</th>
                                        <th>EXPIRY DATE</th>
                                        <th>DOB</th>
                                        <th>PAN NO.</th>
                                        <th>NATIONALITY</th>
                                        {editable && <th>ACTIONS</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {fulfillment.travellers.map((traveller) => (
                                        <tr key={traveller.id}>
                                            <td>
                                                {editable ? (
                                                    <Form.Select
                                                        size="sm"
                                                        style={{ fontSize: "10px", width: 90 }}
                                                        value={traveller.type}
                                                        onChange={(e) =>
                                                            updateTraveller(traveller.id, {
                                                                type: e.target
                                                                    .value as TravellerRow["type"],
                                                            })
                                                        }
                                                    >
                                                        <option value="Adult">Adult</option>
                                                        <option value="Child">Child</option>
                                                        <option value="Infant">Infant</option>
                                                    </Form.Select>
                                                ) : (
                                                    traveller.type
                                                )}
                                            </td>
                                            {(
                                                [
                                                    ["salutation", "text"],
                                                    ["firstMiddleName", "text"],
                                                    ["lastName", "text"],
                                                    ["passportNo", "text"],
                                                    ["issueDate", "date"],
                                                    ["expiryDate", "date"],
                                                    ["dob", "date"],
                                                    ["panNo", "text"],
                                                    ["nationality", "text"],
                                                ] as const
                                            ).map(([field, type]) => (
                                                <td key={field}>
                                                    {editable ? (
                                                        <Form.Control
                                                            size="sm"
                                                            type={type}
                                                            style={{ fontSize: "10px" }}
                                                            value={
                                                                traveller[field] as string
                                                            }
                                                            onChange={(e) =>
                                                                updateTraveller(traveller.id, {
                                                                    [field]: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        (traveller[field] as string) || "—"
                                                    )}
                                                </td>
                                            ))}
                                            {editable && (
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        className="py-0 px-1"
                                                        onClick={() =>
                                                            removeTraveller(traveller.id)
                                                        }
                                                    >
                                                        <Icon icon="mdi:delete" width={14} />
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {!fulfillment.travellers.length && (
                                        <tr>
                                            <td
                                                colSpan={editable ? 11 : 10}
                                                className="text-center text-muted py-3"
                                            >
                                                No travellers added
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                )}
            </Card>

            {/* Sales Overview */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title="Sales Overview (Customer)"
                    open={openSections.sales}
                    onToggle={() => toggleSection("sales")}
                    bg="secondary"
                />
                {openSections.sales && (
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered mb-0">
                                <thead className="table-light">
                                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                                        <th>BOOKING DATE</th>
                                        <th>TOTAL COST</th>
                                        <th>MARK UP</th>
                                        <th>DISCOUNT</th>
                                        <th>TAX</th>
                                        <th>SALES PRICE</th>
                                        <th>ADVANCE</th>
                                        <th>BALANCE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {formatDisplayDate(
                                                booking.createdAt?.split("T")[0] || ""
                                            )}
                                        </td>
                                        <td>
                                            {formatFulfillmentCurrency(
                                                booking.totalSalesPrice,
                                                booking.currency
                                            )}
                                        </td>
                                        <td>
                                            {formatFulfillmentCurrency(
                                                Number(booking.flightCost?.markup || 0) +
                                                    Number(booking.visaCost?.markup || 0) +
                                                    Number(booking.landPackageCost?.markup || 0),
                                                booking.currency
                                            )}
                                        </td>
                                        <td>
                                            {booking.discount
                                                ? formatFulfillmentCurrency(
                                                      booking.discount,
                                                      booking.currency
                                                  )
                                                : "NA"}
                                        </td>
                                        <td>NA</td>
                                        <td>
                                            {formatFulfillmentCurrency(
                                                booking.sellingPrice,
                                                booking.currency
                                            )}
                                        </td>
                                        <td>
                                            {booking.advance
                                                ? formatFulfillmentCurrency(
                                                      booking.advance,
                                                      booking.currency
                                                  )
                                                : "NA"}
                                        </td>
                                        <td className="text-danger fw-semibold">
                                            {formatFulfillmentCurrency(
                                                booking.balance,
                                                booking.currency
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                )}
            </Card>

            {/* Supplier Payment */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title={
                        <span>
                            Supplier Payment{" "}
                            <Icon
                                icon="mdi:download"
                                className="ms-1"
                                style={{ cursor: "pointer" }}
                            />
                        </span>
                    }
                    open={openSections.supplier}
                    onToggle={() => toggleSection("supplier")}
                    bg="secondary"
                    extra={
                        editable && (
                            <div className="d-flex gap-1">
                                <Button
                                    size="sm"
                                    variant="light"
                                    style={{ fontSize: "10px" }}
                                    onClick={handleRefreshSuppliers}
                                >
                                    Refresh
                                </Button>
                                <Button
                                    size="sm"
                                    variant="light"
                                    style={{ fontSize: "10px" }}
                                    onClick={addSupplier}
                                >
                                    + Add
                                </Button>
                            </div>
                        )
                    }
                />
                {openSections.supplier && (
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered mb-0">
                                <thead className="table-light">
                                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                                        <th>SUPPLIER NAME</th>
                                        <th>SERVICE COST</th>
                                        <th>DISCOUNT</th>
                                        <th>EXTRA (IF ANY)</th>
                                        <th>TOTAL COST</th>
                                        <th>PAID AMOUNT</th>
                                        <th>BALANCE</th>
                                        {editable && <th>ACTION</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {fulfillment.supplierPayments.map((row) => (
                                        <tr key={row.id}>
                                            <td>
                                                {editable ? (
                                                    <Form.Control
                                                        size="sm"
                                                        style={{ fontSize: "10px" }}
                                                        value={row.supplierName}
                                                        onChange={(e) =>
                                                            updateSupplier(row.id, {
                                                                supplierName: e.target.value,
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    row.supplierName || "—"
                                                )}
                                            </td>
                                            {(
                                                [
                                                    "serviceCost",
                                                    "discount",
                                                    "extra",
                                                    "paidAmount",
                                                ] as const
                                            ).map((field) => (
                                                <td key={field}>
                                                    {editable ? (
                                                        <Form.Control
                                                            size="sm"
                                                            type="number"
                                                            style={{ fontSize: "10px" }}
                                                            value={row[field]}
                                                            onChange={(e) =>
                                                                updateSupplier(row.id, {
                                                                    [field]: Number(
                                                                        e.target.value
                                                                    ),
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        formatFulfillmentCurrency(
                                                            row[field],
                                                            booking.currency
                                                        )
                                                    )}
                                                </td>
                                            ))}
                                            <td>
                                                {formatFulfillmentCurrency(
                                                    row.totalCost,
                                                    booking.currency
                                                )}
                                            </td>
                                            <td
                                                className={
                                                    row.balance > 0 ? "text-danger" : ""
                                                }
                                            >
                                                {formatFulfillmentCurrency(
                                                    row.balance,
                                                    booking.currency
                                                )}
                                            </td>
                                            {editable && <td />}
                                        </tr>
                                    ))}
                                    {!fulfillment.supplierPayments.length && (
                                        <tr>
                                            <td
                                                colSpan={editable ? 8 : 7}
                                                className="text-center text-muted py-3"
                                            >
                                                No supplier payments
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                )}
            </Card>

            {/* Net Profit And Loss */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title="Net Profit And Loss"
                    open={openSections.netProfit}
                    onToggle={() => toggleSection("netProfit")}
                    bg="secondary"
                />
                {openSections.netProfit && (
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered mb-0">
                                <thead className="table-light">
                                    <tr style={{ fontSize: "10px" }}>
                                        <th colSpan={3} className="text-center">
                                            ORIGINAL COSTING & COLLECTION
                                        </th>
                                        <th colSpan={6} className="text-center">
                                            NEW COSTING & SUPPLIER PAYMENT
                                        </th>
                                    </tr>
                                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                                        <th>SOURCING</th>
                                        <th>ROE</th>
                                        <th>COST</th>
                                        <th>SOURCING</th>
                                        <th>PAID AMOUNT</th>
                                        <th>AVERAGE ROE</th>
                                        <th>PAID</th>
                                        <th>BANK CHARGES</th>
                                        <th>TOTAL PAID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(fulfillment.netProfitRows.length
                                        ? fulfillment.netProfitRows
                                        : [
                                              {
                                                  id: "total",
                                                  sourcing: "Total",
                                                  roe: 0,
                                                  cost: summary.oldCost,
                                                  paidAmount: 0,
                                                  averageRoe: 0,
                                                  paid: 0,
                                                  bankCharges: 0,
                                                  totalPaid: 0,
                                              },
                                          ]
                                    ).map((row: NetProfitRow) => (
                                        <tr key={row.id}>
                                            <td>{row.sourcing}</td>
                                            <td>{row.roe || "—"}</td>
                                            <td>
                                                {formatFulfillmentCurrency(
                                                    row.cost,
                                                    booking.currency
                                                )}
                                            </td>
                                            <td>{row.sourcing}</td>
                                            <td>
                                                {formatFulfillmentCurrency(
                                                    row.paidAmount,
                                                    booking.currency
                                                )}
                                            </td>
                                            <td>{row.averageRoe || "—"}</td>
                                            <td>
                                                {formatFulfillmentCurrency(
                                                    row.paid,
                                                    booking.currency
                                                )}
                                            </td>
                                            <td>
                                                {formatFulfillmentCurrency(
                                                    row.bankCharges,
                                                    booking.currency
                                                )}
                                            </td>
                                            <td>
                                                {formatFulfillmentCurrency(
                                                    row.totalPaid,
                                                    booking.currency
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                )}
            </Card>

            {/* Summary */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title="Summary"
                    open={openSections.summary}
                    onToggle={() => toggleSection("summary")}
                />
                {openSections.summary && (
                    <Card.Body className="p-0">{renderSummaryGrid(summary)}</Card.Body>
                )}
            </Card>

            {/* Cash Flow */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title="Cash Flow"
                    open={openSections.cashFlow}
                    onToggle={() => toggleSection("cashFlow")}
                />
                {openSections.cashFlow && (
                    <Card.Body className="p-0">
                        <Row className="g-0 text-center">
                            <Col md={4} className="border p-3">
                                <div className="text-muted" style={{ fontSize: "10px" }}>
                                    CASH IN
                                </div>
                                {editable ? (
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        className="text-center mt-1"
                                        value={fulfillment.cashIn}
                                        onChange={(e) =>
                                            updateFulfillment({
                                                cashIn: Number(e.target.value),
                                            })
                                        }
                                    />
                                ) : (
                                    <div className="fw-semibold">
                                        {formatFulfillmentCurrency(
                                            summary.cashIn,
                                            booking.currency
                                        )}
                                    </div>
                                )}
                            </Col>
                            <Col md={4} className="border p-3">
                                <div className="text-muted" style={{ fontSize: "10px" }}>
                                    CASH OUT
                                </div>
                                {editable ? (
                                    <Form.Control
                                        size="sm"
                                        type="number"
                                        className="text-center mt-1"
                                        value={fulfillment.cashOut}
                                        onChange={(e) =>
                                            updateFulfillment({
                                                cashOut: Number(e.target.value),
                                            })
                                        }
                                    />
                                ) : (
                                    <div className="fw-semibold">
                                        {formatFulfillmentCurrency(
                                            summary.cashOut,
                                            booking.currency
                                        )}
                                    </div>
                                )}
                            </Col>
                            <Col md={4} className="border p-3">
                                <div className="text-muted" style={{ fontSize: "10px" }}>
                                    NET BALANCE
                                </div>
                                <div
                                    className="fw-semibold"
                                    style={{
                                        color:
                                            summary.netBalance < 0 ? "#dc3545" : "#198754",
                                    }}
                                >
                                    {formatFulfillmentCurrency(
                                        summary.netBalance,
                                        booking.currency
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                )}
            </Card>

            {/* Services Included */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title="Services Included"
                    open={openSections.services}
                    onToggle={() => toggleSection("services")}
                    bg="secondary"
                />
                {openSections.services && (
                    <Card.Body>
                        <div className="d-flex flex-wrap gap-2">
                            {SERVICE_BUTTONS.map(({ key, label }) => {
                                const active = fulfillment.servicesIncluded[key];
                                return (
                                    <Button
                                        key={key}
                                        size="sm"
                                        variant={active ? "primary" : "outline-secondary"}
                                        style={{ fontSize: "11px" }}
                                        onClick={() => toggleServiceIncluded(key)}
                                        disabled={!editable}
                                    >
                                        {label}
                                    </Button>
                                );
                            })}
                        </div>
                    </Card.Body>
                )}
            </Card>

            {/* Service Categories */}
            {CATEGORY_CONFIG.map(({ key, label, color, subLabel }) => (
                <Card key={key} className="mb-2 border-0">
                    <div
                        className="d-flex justify-content-between align-items-center text-white px-3 py-2"
                        style={{ background: color, fontSize: "12px", cursor: "pointer" }}
                        onClick={() =>
                            setExpandedCategories((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                            }))
                        }
                    >
                        <span>
                            <b>{label}</b>{" "}
                            {subLabel && (
                                <span style={{ fontSize: "10px" }}>{subLabel}</span>
                            )}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                            {key === "sightseeings" && editable && (
                                <>
                                    {(["SIC", "PVT", "Entry Only", "NA"] as const).map(
                                        (type) => (
                                            <Button
                                                key={type}
                                                size="sm"
                                                variant="light"
                                                style={{ fontSize: "9px", padding: "1px 6px" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAllSightseeingType(type);
                                                }}
                                            >
                                                All {type}
                                            </Button>
                                        )
                                    )}
                                </>
                            )}
                            {editable && (
                                <Button
                                    size="sm"
                                    variant="light"
                                    style={sectionBtnStyle}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addServiceItem(key);
                                        setExpandedCategories((prev) => ({
                                            ...prev,
                                            [key]: true,
                                        }));
                                    }}
                                >
                                    <Icon icon="mdi:plus" width={16} />
                                </Button>
                            )}
                            <Icon
                                icon={
                                    expandedCategories[key]
                                        ? "mdi:chevron-up"
                                        : "mdi:chevron-down"
                                }
                                width={18}
                            />
                        </div>
                    </div>
                    {expandedCategories[key] && (
                        <Card.Body className="p-0 border border-top-0">
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered mb-0">
                                    <thead className="table-light">
                                        <tr style={{ fontSize: "10px" }}>
                                            <th>DAY</th>
                                            <th>DESCRIPTION</th>
                                            <th>SUPPLIER</th>
                                            <th>COST</th>
                                            <th>MARKUP</th>
                                            <th>TOTAL</th>
                                            {key === "sightseeings" && <th>TYPE</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fulfillment[key].map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.dayNumber || "—"}</td>
                                                <td>
                                                    {editable ? (
                                                        <Form.Control
                                                            size="sm"
                                                            style={{ fontSize: "10px" }}
                                                            value={item.label}
                                                            onChange={(e) =>
                                                                updateServiceItem(key, item.id, {
                                                                    label: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        item.label || "—"
                                                    )}
                                                </td>
                                                <td>
                                                    {editable ? (
                                                        <Form.Control
                                                            size="sm"
                                                            style={{ fontSize: "10px" }}
                                                            value={item.supplier}
                                                            onChange={(e) =>
                                                                updateServiceItem(key, item.id, {
                                                                    supplier: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        item.supplier || "—"
                                                    )}
                                                </td>
                                                {(["cost", "markup", "total"] as const).map(
                                                    (field) => (
                                                        <td key={field}>
                                                            {editable ? (
                                                                <Form.Control
                                                                    size="sm"
                                                                    type="number"
                                                                    style={{ fontSize: "10px" }}
                                                                    value={item[field]}
                                                                    onChange={(e) =>
                                                                        updateServiceItem(
                                                                            key,
                                                                            item.id,
                                                                            {
                                                                                [field]: Number(
                                                                                    e.target.value
                                                                                ),
                                                                            }
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                formatFulfillmentCurrency(
                                                                    item[field],
                                                                    booking.currency
                                                                )
                                                            )}
                                                        </td>
                                                    )
                                                )}
                                                {key === "sightseeings" && (
                                                    <td>
                                                        {editable ? (
                                                            <Form.Select
                                                                size="sm"
                                                                style={{ fontSize: "10px" }}
                                                                value={
                                                                    item.sightseeingType || "NA"
                                                                }
                                                                onChange={(e) =>
                                                                    updateServiceItem(
                                                                        key,
                                                                        item.id,
                                                                        {
                                                                            sightseeingType:
                                                                                e.target
                                                                                    .value as FulfillmentServiceItem["sightseeingType"],
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                <option value="SIC">SIC</option>
                                                                <option value="PVT">PVT</option>
                                                                <option value="Entry Only">
                                                                    Entry Only
                                                                </option>
                                                                <option value="NA">NA</option>
                                                            </Form.Select>
                                                        ) : (
                                                            item.sightseeingType || "NA"
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                        {!fulfillment[key].length && (
                                            <tr>
                                                <td
                                                    colSpan={key === "sightseeings" ? 7 : 6}
                                                    className="text-center text-muted py-2"
                                                >
                                                    No {label.toLowerCase()} added
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    )}
                </Card>
            ))}

            {/* Day Wise Itinerary */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title="Day Wise Itinerary"
                    open={openSections.itinerary}
                    onToggle={() => toggleSection("itinerary")}
                    bg="secondary"
                    extra={
                        <div className="d-flex gap-1">
                            {editable && (
                                <Button
                                    size="sm"
                                    variant="warning"
                                    style={{ fontSize: "10px" }}
                                    onClick={() =>
                                        router.push(
                                            `/bookings/Packages/build-your-own?id=${booking._id}`
                                        )
                                    }
                                >
                                    Edit
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="warning"
                                style={{ fontSize: "10px" }}
                                onClick={() => setShowAllDays(!showAllDays)}
                            >
                                {showAllDays ? "Collapse" : "Show All"}
                            </Button>
                        </div>
                    }
                />
                {openSections.itinerary && (
                    <Card.Body>
                        <Accordion defaultActiveKey={showAllDays ? "all" : "0"} alwaysOpen={showAllDays}>
                            {(booking.days || []).map((day, index) => (
                                <Accordion.Item
                                    eventKey={showAllDays ? String(index) : index === 0 ? "0" : String(index)}
                                    key={day.dayNumber}
                                >
                                    <Accordion.Header style={{ fontSize: "12px" }}>
                                        Day {day.dayNumber}
                                        {day.location && ` — ${day.location}`}
                                        {day.date && ` (${formatDisplayDate(day.date)})`}
                                    </Accordion.Header>
                                    <Accordion.Body style={{ fontSize: "11px" }}>
                                        <div>
                                            <b>Itinerary Type:</b> {day.itineraryType}
                                        </div>
                                        {day.title && (
                                            <div>
                                                <b>Title:</b> {day.title}
                                            </div>
                                        )}
                                        {day.description && (
                                            <div>
                                                <b>Description:</b> {day.description}
                                            </div>
                                        )}
                                        <div className="mt-1">
                                            <b>Meals:</b>{" "}
                                            {[
                                                day.meals?.breakfast && "Breakfast",
                                                day.meals?.lunch && "Lunch",
                                                day.meals?.dinner && "Dinner",
                                            ]
                                                .filter(Boolean)
                                                .join(", ") || "None"}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                            {!booking.days?.length && (
                                <p className="text-muted mb-0">No itinerary days configured</p>
                            )}
                        </Accordion>
                        <div className="d-flex justify-content-end gap-2 mt-2">
                            {editable && (
                                <Button
                                    size="sm"
                                    variant="warning"
                                    style={{ fontSize: "10px" }}
                                    onClick={() =>
                                        router.push(
                                            `/bookings/Packages/build-your-own?id=${booking._id}`
                                        )
                                    }
                                >
                                    Edit
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="warning"
                                style={{ fontSize: "10px" }}
                                onClick={() => setShowAllDays(!showAllDays)}
                            >
                                {showAllDays ? "Collapse" : "Show All"}
                            </Button>
                        </div>
                    </Card.Body>
                )}
            </Card>

            {/* Summary repeat at bottom */}
            <Card className="mb-3">
                <CollapsibleHeader
                    title="Summary"
                    open
                    onToggle={() => {}}
                />
                <Card.Body className="p-0">{renderSummaryGrid(summary)}</Card.Body>
            </Card>

            {editable && onSave && (
                <div className="d-flex justify-content-end gap-2 mb-4">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => router.push("/bookings/Packages")}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={onSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Fulfillment"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FulfillmentView;
