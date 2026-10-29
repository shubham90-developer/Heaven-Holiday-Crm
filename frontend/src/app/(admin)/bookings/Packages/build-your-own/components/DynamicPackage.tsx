"use client";

import CustomFlatpickr from "@/components/CustomFlatpickr";
import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import BuildPackageStepTwo from "./BuildPackageStepTwo";
import BuildPackageStepThree from "./BuildPackageStepThree";
import PackageStepNav from "./PackageStepNav";
import QueryDetailsSummary from "../../components/QueryDetailsSummary";
import {
    useCreatePackageBookingMutation,
    useGetPackageBookingByIdQuery,
    useUpdatePackageBookingMutation,
} from "@/store/services/booking/packageBookingApi";
import {
    CUSTOMER_STORAGE_KEY,
    QUERY_PACKAGE_STORAGE_KEY,
    CustomerDetails,
    HotelStayCity,
    PackageBookingFormData,
    QueryPackagePrefill,
    createFormDataFromQueryPrefill,
    createInitialFormData,
    buildPrefillFromQuery,
} from "../../types/packageBooking";
import { useGetQueryByIdQuery } from "@/store/services/queriesApi";
import "../package-builder.scss";

const addDaysToDate = (dateStr: string, days: number) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
};

/** Format as dd/mm/yyyy to match HelloGTX hotel stay UI */
const formatStayDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};

const normalizeBookingForm = (
    data: PackageBookingFormData & { _id?: string },
    fallbackQueryId?: string | null
): PackageBookingFormData => ({
    ...data,
    endDestination: data.endDestination || "",
    hotelStayCities: Array.isArray(data.hotelStayCities)
        ? data.hotelStayCities
        : [],
    days: Array.isArray(data.days) ? data.days : [],
    queryId: data.queryId || fallbackQueryId || undefined,
});

const DynamicPackage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("id");
    const queryId = searchParams.get("queryId");
    const queryEditRef = useRef<HTMLDivElement | null>(null);
    const dragCityIndex = useRef<number | null>(null);

    const [step, setStep] = useState(1);
    const [form, setForm] = useState<PackageBookingFormData | null>(null);
    const [bookingId, setBookingId] = useState<string | null>(editId);
    const [citySearch, setCitySearch] = useState("");
    const [saving, setSaving] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [queryType, setQueryType] = useState<"Normal" | "GIT">("Normal");
    const initializedRef = useRef(false);
    const formRef = useRef(form);
    formRef.current = form;

    const [createBooking] = useCreatePackageBookingMutation();
    const [updateBooking] = useUpdatePackageBookingMutation();
    const { data: existingBooking } = useGetPackageBookingByIdQuery(editId!, {
        skip: !editId,
    });
    const { data: queryResponse, isLoading: queryLoading } = useGetQueryByIdQuery(
        queryId!,
        { skip: !queryId || !!editId }
    );

    useEffect(() => {
        // Only hydrate once — never overwrite in-progress edits on refetch
        if (initializedRef.current) return;

        if (existingBooking?.data) {
            setForm(normalizeBookingForm(existingBooking.data, queryId));
            setBookingId(existingBooking.data._id);
            setStep(existingBooking.data.currentStep || 1);
            initializedRef.current = true;
            return;
        }

        // Waiting for booking fetch when editing
        if (editId) return;

        const storedQuery = sessionStorage.getItem(QUERY_PACKAGE_STORAGE_KEY);
        if (storedQuery) {
            try {
                const prefill: QueryPackagePrefill = JSON.parse(storedQuery);
                setForm(createFormDataFromQueryPrefill(prefill));
                sessionStorage.removeItem(QUERY_PACKAGE_STORAGE_KEY);
                initializedRef.current = true;
                return;
            } catch {
                sessionStorage.removeItem(QUERY_PACKAGE_STORAGE_KEY);
            }
        }

        if (queryResponse?.data) {
            setForm(
                createFormDataFromQueryPrefill(
                    buildPrefillFromQuery(queryResponse.data)
                )
            );
            initializedRef.current = true;
            return;
        }

        if (queryId && (queryLoading || !queryResponse)) return;

        const stored = sessionStorage.getItem(CUSTOMER_STORAGE_KEY);
        if (stored) {
            const customerDetails: CustomerDetails = JSON.parse(stored);
            setForm(createInitialFormData(customerDetails));
            sessionStorage.removeItem(CUSTOMER_STORAGE_KEY);
            initializedRef.current = true;
        } else if (!queryId) {
            setForm(
                createInitialFormData({
                    customerType: "B2C",
                    firstName: "Guest",
                })
            );
            initializedRef.current = true;
        }
    }, [existingBooking, editId, queryId, queryResponse, queryLoading]);

    const updateForm = (updates: Partial<PackageBookingFormData>) => {
        setForm((prev) => (prev ? { ...prev, ...updates } : prev));
    };

    const addHotelCity = () => {
        const name = citySearch.trim();
        if (!name || !form?.travelDate) {
            if (!form?.travelDate) {
                toast.error("Select travel date first");
            }
            return;
        }

        if (
            form.hotelStayCities.some(
                (c) => c.cityName.toLowerCase() === name.toLowerCase()
            )
        ) {
            toast.error("City already added");
            setCitySearch("");
            return;
        }

        const nights = 1;
        const checkIn =
            form.hotelStayCities.length > 0
                ? form.hotelStayCities[form.hotelStayCities.length - 1].checkOut
                : form.travelDate;
        const checkOut = addDaysToDate(checkIn, nights);

        const newCity: HotelStayCity = {
            cityName: name,
            checkIn,
            checkOut,
            nights,
        };

        updateForm({
            hotelStayCities: [...form.hotelStayCities, newCity],
        });
        setCitySearch("");
    };

    const updateHotelCity = (
        index: number,
        field: keyof HotelStayCity,
        value: string | number
    ) => {
        if (!form) return;
        const cities = [...form.hotelStayCities];
        const city = { ...cities[index], [field]: value };

        if (field === "nights" || field === "checkIn") {
            const nights = Number(field === "nights" ? value : city.nights);
            const checkIn = field === "checkIn" ? String(value) : city.checkIn;
            city.nights = nights;
            city.checkIn = checkIn;
            city.checkOut = addDaysToDate(checkIn, nights);
        }

        // Recascade subsequent city dates
        cities[index] = city;
        for (let i = index + 1; i < cities.length; i++) {
            cities[i] = {
                ...cities[i],
                checkIn: cities[i - 1].checkOut,
                checkOut: addDaysToDate(cities[i - 1].checkOut, cities[i].nights),
            };
        }

        updateForm({ hotelStayCities: cities });
    };

    const recascadeCityDates = (
        cities: HotelStayCity[],
        travelDate?: string
    ) => {
        if (!cities.length) return cities;
        const next = cities.map((c) => ({ ...c }));
        if (travelDate) {
            next[0].checkIn = travelDate;
            next[0].checkOut = addDaysToDate(travelDate, next[0].nights);
        }
        for (let i = 1; i < next.length; i++) {
            next[i].checkIn = next[i - 1].checkOut;
            next[i].checkOut = addDaysToDate(next[i].checkIn, next[i].nights);
        }
        return next;
    };

    const removeHotelCity = (index: number) => {
        if (!form) return;
        const cities = form.hotelStayCities.filter((_, i) => i !== index);
        updateForm({ hotelStayCities: recascadeCityDates(cities, form.travelDate) });
    };

    const moveHotelCity = (fromIndex: number, toIndex: number) => {
        if (!form) return;
        if (
            fromIndex === toIndex ||
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= form.hotelStayCities.length ||
            toIndex >= form.hotelStayCities.length
        ) {
            return;
        }
        const cities = [...form.hotelStayCities];
        const [moved] = cities.splice(fromIndex, 1);
        cities.splice(toIndex, 0, moved);
        updateForm({
            hotelStayCities: recascadeCityDates(cities, form.travelDate),
        });
    };

    const persistBooking = async (
        stepNumber: number,
        extra: Partial<PackageBookingFormData> = {},
        options: { replaceForm?: boolean } = {}
    ) => {
        const current = formRef.current;
        if (!current) return null;

        const {
            _id: _omitId,
            createdAt: _omitCreated,
            updatedAt: _omitUpdated,
            __v: _omitV,
            ...formFields
        } = current as PackageBookingFormData & {
            _id?: string;
            createdAt?: string;
            updatedAt?: string;
            __v?: number;
        };

        const payload = {
            ...formFields,
            ...extra,
            hotelStayCities:
                extra.hotelStayCities || current.hotelStayCities || [],
            currentStep: stepNumber,
            queryId: extra.queryId || current.queryId || queryId || undefined,
        };

        setSaving(true);
        try {
            if (bookingId) {
                const res = await updateBooking({
                    id: bookingId,
                    ...payload,
                }).unwrap();
                if (options.replaceForm !== false) {
                    setForm(normalizeBookingForm(res.data, queryId));
                }
                return res.data;
            }

            const res = await createBooking(payload).unwrap();
            setBookingId(res.data._id);
            if (options.replaceForm !== false) {
                setForm(normalizeBookingForm(res.data, queryId));
            } else {
                setForm((prev) =>
                    prev
                        ? {
                              ...prev,
                              _id: res.data._id,
                              proposalId: res.data.proposalId,
                              enquiryId: res.data.enquiryId,
                          }
                        : normalizeBookingForm(res.data, queryId)
                );
            }
            // Keep URL in sync so refresh/reload restores hotel stay cities
            const params = new URLSearchParams();
            params.set("id", res.data._id);
            if (queryId) params.set("queryId", queryId);
            router.replace(
                `/bookings/Packages/build-your-own?${params.toString()}`
            );
            return res.data;
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || "Failed to save package booking");
            return null;
        } finally {
            setSaving(false);
        }
    };

    const handleStepChange = async (nextStep: number) => {
        if (nextStep === step) return;

        // Leaving step 1 — persist hotel stay cities & query details first
        if (step === 1 && nextStep > 1) {
            if (!form?.goingTo || !form.travelDate) {
                toast.error("Going To and Specific Date are required");
                return;
            }
            const saved = await persistBooking(nextStep);
            if (saved) {
                setStep(nextStep);
            }
            return;
        }

        // Coming back to step 1 or moving between 2↔3 — keep local form as source of truth
        setStep(nextStep);
    };

    const handleModifySave = async () => {
        if (!form?.goingTo || !form.travelDate) {
            toast.error("Going To and Specific Date are required");
            return;
        }
        const saved = await persistBooking(step);
        if (saved) toast.success("Query details saved");
    };

    const handleStep1Continue = async () => {
        if (!form?.goingTo || !form.travelDate) {
            toast.error("Going To and Specific Date are required");
            return;
        }

        const saved = await persistBooking(2);
        if (saved) {
            setStep(2);
            toast.success("Step 1 saved");
        }
    };

    const handleStep2Continue = async () => {
        const saved = await persistBooking(3);
        if (saved) {
            setStep(3);
            toast.success("Step 2 saved");
        }
    };

    const handleSaveDraft = async () => {
        const saved = await persistBooking(3, { status: "draft" });
        if (saved) {
            toast.success("Saved as draft");
            router.push("/bookings/Packages");
        }
    };

    const handleSaveAndShare = async () => {
        const saved = await persistBooking(3, {
            status: "shared",
            bookingStage: "Proposal Shared",
            voucherStatus: "Generated",
        });
        if (saved) {
            toast.success("Package saved and shared");
            router.push(
                `/bookings/Packages/build-your-own/preview?id=${saved._id}`
            );
        }
    };

    if (!form) {
        return (
            <div className="pkg-builder">
                <div className="pkg-card text-center py-5">
                    {queryId && queryLoading
                        ? "Loading query details..."
                        : "Loading package builder..."}
                </div>
            </div>
        );
    }

    return (
        <div className="pkg-builder">
            <PackageStepNav step={step} onChange={handleStepChange} />

            {step === 1 && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="pkg-title">Plan Your Travel</h5>
                    </div>

                    <QueryDetailsSummary
                        form={form}
                        onUpdateQuery={() => {
                            queryEditRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }}
                    />

                    <div className="pkg-card" ref={queryEditRef}>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#1e6aa8" }}>
                                Query Type
                            </span>
                            <Form.Check
                                type="radio"
                                id="qt-normal"
                                name="queryType"
                                label="Normal"
                                checked={queryType === "Normal"}
                                onChange={() => setQueryType("Normal")}
                            />
                            <Form.Check
                                type="radio"
                                id="qt-git"
                                name="queryType"
                                label="GIT Group"
                                checked={queryType === "GIT"}
                                onChange={() => setQueryType("GIT")}
                            />
                        </div>

                        <Row className="g-2">
                            <Col md={3}>
                                <div className="pkg-field">
                                    <label>
                                        Going to <span className="text-danger">*</span>
                                    </label>
                                    <Form.Control
                                        value={form.goingTo}
                                        placeholder="Destination City"
                                        onChange={(e) =>
                                            updateForm({ goingTo: e.target.value })
                                        }
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="pkg-field">
                                    <label>Going From</label>
                                    <Form.Control
                                        value={form.goingFrom}
                                        placeholder="From City"
                                        onChange={(e) =>
                                            updateForm({ goingFrom: e.target.value })
                                        }
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="pkg-field">
                                    <label>
                                        Specific Date <span className="text-danger">*</span>
                                    </label>
                                    <CustomFlatpickr
                                        className="form-control"
                                        placeholder="dd/mm/yyyy"
                                        value={form.travelDate}
                                        onChange={(dates: Date[]) => {
                                            if (dates[0] && form) {
                                                const travelDate = dates[0]
                                                    .toISOString()
                                                    .split("T")[0];
                                                updateForm({
                                                    travelDate,
                                                    hotelStayCities: recascadeCityDates(
                                                        form.hotelStayCities,
                                                        travelDate
                                                    ),
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="pkg-field">
                                    <label>No Of Days</label>
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        value={form.noOfDays || ""}
                                        onChange={(e) =>
                                            updateForm({
                                                noOfDays: Number(e.target.value) || 0,
                                            })
                                        }
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="pkg-field">
                                    <label>Travelers</label>
                                    <Form.Select
                                        value={form.travelers}
                                        onChange={(e) =>
                                            updateForm({
                                                travelers: Number(e.target.value),
                                            })
                                        }
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                            <option key={n} value={n}>
                                                {n}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="pkg-field">
                                    <label>Lead Source</label>
                                    <Form.Select
                                        value={form.leadSource}
                                        onChange={(e) =>
                                            updateForm({ leadSource: e.target.value })
                                        }
                                    >
                                        <option value="">Change Source</option>
                                        <option value="Agency">Agency</option>
                                        <option value="Website">Website</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Reference">Reference</option>
                                    </Form.Select>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="pkg-field">
                                    <label>Add Remark</label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Add Remark"
                                        value={form.remark}
                                        onChange={(e) =>
                                            updateForm({ remark: e.target.value })
                                        }
                                    />
                                </div>
                            </Col>
                        </Row>

                        <div className="text-end">
                            <Button
                                className="pkg-btn-secondary"
                                disabled={saving}
                                onClick={handleModifySave}
                            >
                                {saving ? "Saving..." : "Modify & Save"}
                            </Button>
                        </div>
                    </div>

                    <div className="pkg-card">
                        <div className="pkg-mode-row">
                            <Form.Check
                                type="radio"
                                name="packageMode"
                                id="mode-byo"
                                label="Build Your Own"
                                checked={form.packageMode === "buildYourOwn"}
                                onChange={() =>
                                    updateForm({ packageMode: "buildYourOwn" })
                                }
                            />
                            <Form.Check
                                type="radio"
                                name="packageMode"
                                id="mode-ready"
                                label="Readymade (Third Party)"
                                checked={form.packageMode === "readymade"}
                                onChange={() =>
                                    updateForm({ packageMode: "readymade" })
                                }
                            />
                        </div>

                        <div className="pkg-mode-row">
                            <span style={{ fontWeight: 700, fontSize: 12 }}>
                                Package Type :
                            </span>
                            <Form.Check
                                type="radio"
                                name="packageType"
                                id="type-dom"
                                label="Domestic"
                                checked={form.packageType === "Domestic"}
                                onChange={() =>
                                    updateForm({ packageType: "Domestic" })
                                }
                            />
                            <Form.Check
                                type="radio"
                                name="packageType"
                                id="type-int"
                                label="International"
                                checked={form.packageType === "International"}
                                onChange={() =>
                                    updateForm({ packageType: "International" })
                                }
                            />
                        </div>

                        <Row className="g-2 mb-3">
                            <Col md={4}>
                                <div className="pkg-field">
                                    <label>From Destination</label>
                                    <Form.Control
                                        placeholder="From Destination"
                                        value={form.goingFrom}
                                        onChange={(e) =>
                                            updateForm({ goingFrom: e.target.value })
                                        }
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="pkg-field">
                                    <label>To Destination</label>
                                    <Form.Control
                                        placeholder="To Destination"
                                        value={form.goingTo}
                                        onChange={(e) =>
                                            updateForm({ goingTo: e.target.value })
                                        }
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="pkg-field">
                                    <label>End Destination</label>
                                    <Form.Control
                                        placeholder="End Destination"
                                        value={form.endDestination || ""}
                                        onChange={(e) =>
                                            updateForm({
                                                endDestination: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </Col>
                        </Row>

                        <div className="pkg-hotel-block">
                            <div className="pkg-hotel-title">Hotel Stay Cities</div>

                            <div className="pkg-hotel-box">
                            { (form.hotelStayCities || []).map((city, index) => (
                                <div
                                    key={`${city.cityName}-${index}`}
                                    className={`pkg-city-row${
                                        draggingIndex === index ? " is-dragging" : ""
                                    }${dragOverIndex === index ? " is-drag-over" : ""}`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragOverIndex(index);
                                    }}
                                    onDragLeave={() => {
                                        if (dragOverIndex === index) {
                                            setDragOverIndex(null);
                                        }
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const from = dragCityIndex.current;
                                        if (from != null) moveHotelCity(from, index);
                                        dragCityIndex.current = null;
                                        setDraggingIndex(null);
                                        setDragOverIndex(null);
                                    }}
                                >
                                    <div className="pkg-city-name">{city.cityName}</div>

                                    <div className="pkg-city-panel">
                                        <div className="pkg-city-dates">
                                            <div className="pkg-city-date-item">
                                                <span className="pkg-city-date-label">
                                                    Check in date
                                                </span>
                                                <span className="pkg-city-date-value">
                                                    {formatStayDate(city.checkIn)}
                                                </span>
                                            </div>
                                            <div className="pkg-city-date-item">
                                                <span className="pkg-city-date-label">
                                                    Check out date
                                                </span>
                                                <span className="pkg-city-date-value">
                                                    {formatStayDate(city.checkOut)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pkg-city-nights">
                                            <span className="pkg-nights-label">Nights</span>
                                            <div className="pkg-nights-ctrl">
                                                <div className="pkg-nights-value">
                                                    {city.nights}
                                                </div>
                                                <div className="pkg-nights-btns">
                                                    <button
                                                        type="button"
                                                        title="Increase nights"
                                                        onClick={() =>
                                                            updateHotelCity(
                                                                index,
                                                                "nights",
                                                                city.nights + 1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Decrease nights"
                                                        onClick={() =>
                                                            updateHotelCity(
                                                                index,
                                                                "nights",
                                                                Math.max(1, city.nights - 1)
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pkg-city-actions">
                                        <button
                                            type="button"
                                            title="Drag to reorder"
                                            draggable
                                            onDragStart={(e) => {
                                                dragCityIndex.current = index;
                                                setDraggingIndex(index);
                                                e.dataTransfer.effectAllowed = "move";
                                                e.dataTransfer.setData(
                                                    "text/plain",
                                                    String(index)
                                                );
                                            }}
                                            onDragEnd={() => {
                                                dragCityIndex.current = null;
                                                setDraggingIndex(null);
                                                setDragOverIndex(null);
                                            }}
                                        >
                                            <Icon icon="mdi:arrow-all" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Remove city"
                                            onClick={() => removeHotelCity(index)}
                                        >
                                            <Icon icon="mdi:close" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="pkg-search-city">
                                <span className="pkg-search-icon">
                                    <Icon icon="mdi:magnify" width={18} />
                                </span>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter City for Night Stay"
                                    value={citySearch}
                                    onChange={(e) => setCitySearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addHotelCity();
                                        }
                                    }}
                                    onBlur={() => {
                                        if (citySearch.trim()) addHotelCity();
                                    }}
                                />
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-end mt-3 pt-1">
                        <Button
                            className="pkg-btn-primary"
                            disabled={saving}
                            onClick={handleStep1Continue}
                        >
                            {saving ? "Saving..." : "Save and Continue"}
                        </Button>
                    </div>
                </>
            )}

            {step === 2 && (
                <BuildPackageStepTwo
                    form={form}
                    setForm={setForm}
                    setStep={handleStepChange}
                    onSaveContinue={handleStep2Continue}
                    onSaveDay={(extra) =>
                        persistBooking(2, extra, { replaceForm: false })
                    }
                    saving={saving}
                />
            )}

            {step === 3 && (
                <BuildPackageStepThree
                    form={form}
                    setForm={setForm}
                    setStep={handleStepChange}
                    onSaveDraft={handleSaveDraft}
                    onSaveAndShare={handleSaveAndShare}
                    saving={saving}
                />
            )}
        </div>
    );
};

export default DynamicPackage;
