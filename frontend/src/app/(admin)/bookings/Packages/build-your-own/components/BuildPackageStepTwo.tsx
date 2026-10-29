"use client";

import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import QueryDetailsSummary from "../../components/QueryDetailsSummary";
import ItinerarySection from "./ItinerarySection";
import DayItinerarySavedItems, {
    DayItineraryCardItem,
} from "./DayItinerarySavedItems";
import {
    DayItinerary,
    PackageBookingFormData,
    TermsSection,
    formatDisplayDate,
} from "../../types/packageBooking";
import { ITINERARY_TYPES, ItineraryTypeOption } from "../../types/itineraryTypes";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

type DayDescriptionEditorProps = {
    initialValue: string;
    onChange: (html: string) => void;
};

const DayDescriptionEditor = ({
    initialValue,
    onChange,
}: DayDescriptionEditorProps) => {
    return (
        <div className="pkg-day-editor">
            <ReactQuill
                theme="snow"
                defaultValue={initialValue || ""}
                onChange={(html, _delta, source) => {
                    if (source !== "user") return;
                    onChange(html);
                }}
                modules={quillModules}
                placeholder="Write what travelers will do on this day..."
            />
        </div>
    );
};

type BuildPackageStepTwoProps = {
    form: PackageBookingFormData;
    setForm: React.Dispatch<React.SetStateAction<PackageBookingFormData | null>>;
    setStep: (step: number) => void | Promise<void>;
    onSaveContinue: () => void;
    onSaveDay?: (
        extra?: Partial<PackageBookingFormData>
    ) => Promise<unknown>;
    saving: boolean;
};

const TNC_KEY = "tnc";

const BuildPackageStepTwo = ({
    form,
    setForm,
    setStep,
    onSaveContinue,
    onSaveDay,
    saving,
}: BuildPackageStepTwoProps) => {
    const [activeDay, setActiveDay] = useState<string>(
        form.days.length > 0 ? `day-${form.days[0].dayNumber}` : TNC_KEY
    );
    const [hotelOptions, setHotelOptions] = useState("1");
    /** null = add form closed (default). Set when user picks a type or edits a card. */
    const [selectedItineraryType, setSelectedItineraryType] =
        useState<ItineraryTypeOption | null>(null);
    const descriptionDraftRef = useRef("");
    const syncedDayRef = useRef<number | null>(null);

    const updateDay = (dayNumber: number, updates: Partial<DayItinerary>) => {
        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                days: prev.days.map((day) =>
                    day.dayNumber === dayNumber
                        ? {
                              ...day,
                              ...updates,
                          }
                        : day
                ),
            };
        });
    };

    const daysWithDraft = (dayNumber?: number, description?: string) => {
        if (dayNumber == null || description === undefined) return form.days;
        return form.days.map((day) =>
            day.dayNumber === dayNumber ? { ...day, description } : day
        );
    };

    const updateTerms = (field: keyof TermsSection, value: string) => {
        setForm((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                terms: { ...prev.terms, [field]: value },
            };
        });
    };

    const activeDayData =
        form.days.find((d) => `day-${d.dayNumber}` === activeDay) || form.days[0];

    const normalizedDay: DayItinerary | undefined = activeDayData
        ? {
              ...activeDayData,
              itineraryType:
                  selectedItineraryType ||
                  activeDayData.itineraryType ||
                  "Flight",
          }
        : undefined;

    const activeDayIndex = normalizedDay
        ? form.days.findIndex((d) => d.dayNumber === normalizedDay.dayNumber)
        : -1;

    if (
        normalizedDay &&
        activeDay !== TNC_KEY &&
        syncedDayRef.current !== normalizedDay.dayNumber
    ) {
        descriptionDraftRef.current = normalizedDay.description || "";
        syncedDayRef.current = normalizedDay.dayNumber;
    }

    const closeAddForm = () => setSelectedItineraryType(null);

    const flushActiveDescription = () => {
        if (!normalizedDay || activeDay === TNC_KEY) return;
        updateDay(normalizedDay.dayNumber, {
            description: descriptionDraftRef.current,
        });
    };

    const selectDay = (dayKey: string) => {
        flushActiveDescription();
        setActiveDay(dayKey);
        closeAddForm();
    };

    const goPrevDay = () => {
        if (activeDayIndex > 0) {
            selectDay(`day-${form.days[activeDayIndex - 1].dayNumber}`);
        }
    };

    const goNextDay = () => {
        if (activeDayIndex >= 0 && activeDayIndex < form.days.length - 1) {
            selectDay(`day-${form.days[activeDayIndex + 1].dayNumber}`);
        } else {
            selectDay(TNC_KEY);
        }
    };

    const handleSaveDay = async () => {
        if (!normalizedDay) return;

        const description = descriptionDraftRef.current;
        updateDay(normalizedDay.dayNumber, { description });

        if (onSaveDay) {
            const saved = await onSaveDay({
                days: daysWithDraft(normalizedDay.dayNumber, description),
            });
            if (!saved) return;
        }

        toast.success(`Day ${normalizedDay.dayNumber} saved`);
    };

    const handleItinerarySaved = (
        dayNumber: number,
        updates: Partial<DayItinerary>
    ) => {
        updateDay(dayNumber, {
            ...updates,
            ...(selectedItineraryType
                ? { itineraryType: selectedItineraryType }
                : {}),
        });
        // Close form after save — user must select a type again to add more
        closeAddForm();
    };

    const handleEditCard = (card: DayItineraryCardItem) => {
        if (!normalizedDay) return;
        updateDay(normalizedDay.dayNumber, { itineraryType: card.type });
        setSelectedItineraryType(card.type);
        toast(`Editing ${card.title}`, { icon: "✏️" });
    };

    const handleDeleteCard = (card: DayItineraryCardItem) => {
        if (!normalizedDay) return;

        if (
            card.field === "sightseeing" &&
            typeof card.itemIndex === "number" &&
            normalizedDay.sightseeing
        ) {
            const items = [...(normalizedDay.sightseeing.items || [])];
            items.splice(card.itemIndex, 1);

            if (items.length === 0 && !normalizedDay.sightseeing.sightseeing) {
                updateDay(normalizedDay.dayNumber, { sightseeing: undefined });
            } else {
                updateDay(normalizedDay.dayNumber, {
                    sightseeing: {
                        ...normalizedDay.sightseeing,
                        items,
                    },
                });
            }
            toast.success("Sightseeing removed");
            return;
        }

        updateDay(normalizedDay.dayNumber, {
            [card.field]: undefined,
        } as Partial<DayItinerary>);
        toast.success(`${card.type} removed`);
    };

    const handleSelectType = (type: ItineraryTypeOption) => {
        if (!normalizedDay) return;
        // Clicking the same selected type again closes the form
        if (selectedItineraryType === type) {
            closeAddForm();
            return;
        }
        updateDay(normalizedDay.dayNumber, { itineraryType: type });
        setSelectedItineraryType(type);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="pkg-title">Plan Your Travel</h5>
                <div className="d-flex gap-3">
                    <button
                        type="button"
                        className="pkg-nav-link"
                        onClick={() => {
                            flushActiveDescription();
                            setStep(1);
                        }}
                    >
                        <Icon icon="mdi:arrow-left" /> Previous
                    </button>
                    <button
                        type="button"
                        className="pkg-nav-link"
                        onClick={() => {
                            flushActiveDescription();
                            setStep(3);
                        }}
                    >
                        Next <Icon icon="mdi:arrow-right" />
                    </button>
                </div>
            </div>

            <QueryDetailsSummary form={form} showUpdateButton={false} />

            <div className="pkg-card">
                <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                    <Form.Check
                        type="radio"
                        label="Build Your Own"
                        checked={form.packageMode === "buildYourOwn"}
                        readOnly
                    />
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: 12, fontWeight: 600 }}>
                            No of Hotel Options
                        </span>
                        <Form.Select
                            size="sm"
                            style={{ width: 120 }}
                            value={hotelOptions}
                            onChange={(e) => setHotelOptions(e.target.value)}
                        >
                            <option value="1">1 Option</option>
                            <option value="2">2 Options</option>
                            <option value="3">3 Options</option>
                        </Form.Select>
                    </div>
                </div>

                <Row className="g-3">
                    <Col lg={2} md={3}>
                        <div className="pkg-day-nav">
                            {form.days.map((day) => (
                                <button
                                    key={day.dayNumber}
                                    type="button"
                                    className={`pkg-day-item${
                                        activeDay === `day-${day.dayNumber}`
                                            ? " is-active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        selectDay(`day-${day.dayNumber}`)
                                    }
                                >
                                    <div className="pkg-day-title">
                                        Day {day.dayNumber}
                                    </div>
                                    <div className="pkg-day-meta">
                                        {formatDisplayDate(day.date)}
                                        {day.location ? `, ${day.location}` : ""}
                                    </div>
                                </button>
                            ))}
                            <button
                                type="button"
                                className={`pkg-day-item${
                                    activeDay === TNC_KEY ? " is-active" : ""
                                }`}
                                onClick={() => selectDay(TNC_KEY)}
                            >
                                <div className="pkg-day-title">T&amp;C</div>
                            </button>
                        </div>
                    </Col>

                    <Col lg={10} md={9}>
                        {normalizedDay && activeDay !== TNC_KEY && (
                            <>
                                <Row className="align-items-center g-2 mb-3">
                                    <Col md={5}>
                                        <div className="pkg-field mb-0">
                                            <label>Title</label>
                                            <Form.Control
                                                placeholder="Day title"
                                                value={normalizedDay.title}
                                                onChange={(e) =>
                                                    updateDay(
                                                        normalizedDay.dayNumber,
                                                        { title: e.target.value }
                                                    )
                                                }
                                            />
                                        </div>
                                    </Col>
                                    <Col md="auto" className="mt-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Save as Master"
                                            checked={normalizedDay.saveAsMaster}
                                            onChange={(e) =>
                                                updateDay(normalizedDay.dayNumber, {
                                                    saveAsMaster: e.target.checked,
                                                })
                                            }
                                        />
                                    </Col>
                                </Row>

                                <div className="pkg-field">
                                    <label>Description</label>
                                    <DayDescriptionEditor
                                        key={normalizedDay.dayNumber}
                                        initialValue={
                                            normalizedDay.description || ""
                                        }
                                        onChange={(html) => {
                                            descriptionDraftRef.current = html;
                                            updateDay(normalizedDay.dayNumber, {
                                                description: html,
                                            });
                                        }}
                                    />
                                </div>

                                <div className="pkg-meal-row">
                                    <div className="pkg-meal-row-left">
                                        <strong style={{ fontSize: 12 }}>
                                            Meal Plan
                                        </strong>
                                        {(
                                            ["breakfast", "lunch", "dinner"] as const
                                        ).map((meal) => (
                                            <Form.Check
                                                key={meal}
                                                type="checkbox"
                                                label={
                                                    meal.charAt(0).toUpperCase() +
                                                    meal.slice(1)
                                                }
                                                checked={normalizedDay.meals[meal]}
                                                onChange={(e) =>
                                                    updateDay(
                                                        normalizedDay.dayNumber,
                                                        {
                                                            meals: {
                                                                ...normalizedDay.meals,
                                                                [meal]:
                                                                    e.target.checked,
                                                            },
                                                        }
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                    <Button
                                        className="pkg-btn-primary"
                                        disabled={saving}
                                        onClick={handleSaveDay}
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </Button>
                                </div>

                                <DayItinerarySavedItems
                                    day={normalizedDay}
                                    onEdit={handleEditCard}
                                    onDelete={handleDeleteCard}
                                />

                                <div className="pkg-add-itinerary-box">
                                    <div className="pkg-add-itinerary-header">
                                        <h6>
                                            Add Itinerary for Day{" "}
                                            {normalizedDay.dayNumber}
                                        </h6>
                                        <div className="pkg-add-itinerary-nav">
                                            <button
                                                type="button"
                                                className="pkg-nav-link"
                                                onClick={goPrevDay}
                                                disabled={activeDayIndex <= 0}
                                                style={
                                                    activeDayIndex <= 0
                                                        ? {
                                                              opacity: 0.4,
                                                              cursor: "default",
                                                          }
                                                        : undefined
                                                }
                                            >
                                                <Icon icon="mdi:arrow-left" />{" "}
                                                Previous Day
                                            </button>
                                            <button
                                                type="button"
                                                className="pkg-nav-link"
                                                onClick={goNextDay}
                                            >
                                                Next Day{" "}
                                                <Icon icon="mdi:arrow-right" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pkg-add-itinerary-body">
                                        <div className="pkg-itinerary-types">
                                            {ITINERARY_TYPES.map((type) => (
                                                <Form.Check
                                                    key={type}
                                                    type="radio"
                                                    name={`itinerary-${normalizedDay.dayNumber}`}
                                                    label={type}
                                                    checked={
                                                        selectedItineraryType ===
                                                        type
                                                    }
                                                    onChange={() =>
                                                        handleSelectType(type)
                                                    }
                                                />
                                            ))}
                                        </div>

                                        {selectedItineraryType ? (
                                            <ItinerarySection
                                                form={form}
                                                day={normalizedDay}
                                                onUpdateDay={handleItinerarySaved}
                                                onCancel={closeAddForm}
                                            />
                                        ) : (
                                            <div
                                                className="text-muted text-center py-2"
                                                style={{ fontSize: 12 }}
                                            >
                                                Select an itinerary type above to
                                                add details
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeDay === TNC_KEY && (
                            <>
                                <Accordion defaultActiveKey="0" className="mb-4">
                                    {(
                                        [
                                            ["inclusions", "Inclusions"],
                                            ["exclusions", "Exclusions"],
                                            [
                                                "termsAndConditions",
                                                "Term & Conditions",
                                            ],
                                            [
                                                "cancellationPolicy",
                                                "Cancellation Policy",
                                            ],
                                            ["travelBasics", "Travel Basics"],
                                            ["bookingTerms", "Booking Terms"],
                                            ["whyUseUs", "Why use us"],
                                            ["refundPolicy", "Refund Policy"],
                                        ] as [keyof TermsSection, string][]
                                    ).map(([key, label], index) => (
                                        <Accordion.Item
                                            eventKey={String(index)}
                                            key={key}
                                        >
                                            <Accordion.Header>{label}</Accordion.Header>
                                            <Accordion.Body>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    value={form.terms[key]}
                                                    onChange={(e) =>
                                                        updateTerms(
                                                            key,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button className="pkg-btn-outline">Preview</Button>
                                    <Button
                                        className="pkg-btn-primary"
                                        disabled={saving}
                                        onClick={() => {
                                            flushActiveDescription();
                                            onSaveContinue();
                                        }}
                                    >
                                        {saving ? "Saving..." : "Save & continue"}
                                    </Button>
                                </div>
                            </>
                        )}

                        {form.days.length === 0 && activeDay !== TNC_KEY && (
                            <div className="text-muted p-4 text-center border rounded">
                                No itinerary days yet. Set No of Days in Step 1 and
                                Save and Continue again.
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default BuildPackageStepTwo;
