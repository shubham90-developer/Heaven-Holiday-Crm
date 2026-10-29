"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { DayItinerary } from "../../types/packageBooking";
import { ItineraryTypeOption } from "../../types/itineraryTypes";

export type DayItineraryCardItem = {
    id: string;
    type: ItineraryTypeOption;
    field: keyof DayItinerary;
    title: string;
    subtitle?: string;
    itemIndex?: number;
};

const TYPE_META: Record<
    ItineraryTypeOption,
    { icon: string; label: string; detailsLabel: string }
> = {
    Flight: {
        icon: "mdi:airplane",
        label: "Flight",
        detailsLabel: "Flight Details",
    },
    Transport: {
        icon: "mdi:car",
        label: "Transport",
        detailsLabel: "Transport Details",
    },
    Accommodation: {
        icon: "mdi:bed",
        label: "Accommodation",
        detailsLabel: "Hotel Details",
    },
    Sightseeings: {
        icon: "mdi:binoculars",
        label: "Sightseeing",
        detailsLabel: "Sightseeing Details",
    },
    Cruise: {
        icon: "mdi:ferry",
        label: "Cruise",
        detailsLabel: "Cruise Details",
    },
    Guide: {
        icon: "mdi:account-tie",
        label: "Guide",
        detailsLabel: "Guide Details",
    },
    Meals: {
        icon: "mdi:food",
        label: "Meals",
        detailsLabel: "Meal Details",
    },
    Visa: {
        icon: "mdi:passport",
        label: "Visa",
        detailsLabel: "Visa Details",
    },
    Others: {
        icon: "mdi:dots-horizontal-circle",
        label: "Others",
        detailsLabel: "Other Details",
    },
};

export const collectDayItineraryCards = (
    day: DayItinerary
): DayItineraryCardItem[] => {
    const cards: DayItineraryCardItem[] = [];

    if (day.flight) {
        const f = day.flight;
        const title =
            [f.airline, f.flightNo].filter(Boolean).join(" ") ||
            [f.departureAirport, f.arrivalAirport].filter(Boolean).join(" → ") ||
            "Flight";
        cards.push({
            id: "flight",
            type: "Flight",
            field: "flight",
            title,
            subtitle: [f.departureAirport, f.arrivalAirport]
                .filter(Boolean)
                .join(" → "),
        });
    }

    if (day.transport) {
        const t = day.transport;
        const vehicle = t.vehicles?.[0]?.vehicleName;
        const title =
            vehicle ||
            [t.pickupCity, t.dropCity].filter(Boolean).join(" → ") ||
            "Transport";
        cards.push({
            id: "transport",
            type: "Transport",
            field: "transport",
            title,
            subtitle: [t.pickupLocation, t.dropLocation]
                .filter(Boolean)
                .join(" → "),
        });
    }

    if (day.accommodation) {
        const a = day.accommodation;
        cards.push({
            id: "accommodation",
            type: "Accommodation",
            field: "accommodation",
            title: a.hotelName || "Hotel",
            subtitle: a.city || undefined,
        });
    }

    if (day.sightseeing) {
        const namedItems = (day.sightseeing.items || []).filter((item) =>
            Boolean(item.name?.trim())
        );

        if (namedItems.length) {
            namedItems.forEach((item, index) => {
                cards.push({
                    id: `sightseeing-${index}`,
                    type: "Sightseeings",
                    field: "sightseeing",
                    title: item.name.trim(),
                    subtitle: item.type || day.sightseeing?.destinationCovered,
                    itemIndex: index,
                });
            });
        } else {
            const title =
                day.sightseeing.sightseeing?.trim() ||
                day.sightseeing.destinationCovered?.trim() ||
                "Sightseeing";
            cards.push({
                id: "sightseeing",
                type: "Sightseeings",
                field: "sightseeing",
                title,
                subtitle: day.sightseeing.supplier || undefined,
            });
        }
    }

    if (day.cruise) {
        const c = day.cruise;
        cards.push({
            id: "cruise",
            type: "Cruise",
            field: "cruise",
            title: c.shipline || c.shiplineNumber || "Cruise",
            subtitle: [c.startCity, c.endCity].filter(Boolean).join(" → "),
        });
    }

    if (day.guide) {
        cards.push({
            id: "guide",
            type: "Guide",
            field: "guide",
            title: day.guide.guideName || "Guide",
            subtitle: day.guide.supplier || undefined,
        });
    }

    if (day.mealsItinerary?.items?.length) {
        const mealNames = day.mealsItinerary.items
            .map((m) => m.meal)
            .filter(Boolean)
            .join(", ");
        cards.push({
            id: "meals",
            type: "Meals",
            field: "mealsItinerary",
            title: mealNames || "Meals",
        });
    }

    if (day.visaItinerary?.items?.length) {
        const visaNames = day.visaItinerary.items
            .map((v) => v.visaName)
            .filter(Boolean)
            .join(", ");
        cards.push({
            id: "visa",
            type: "Visa",
            field: "visaItinerary",
            title: visaNames || "Visa",
        });
    }

    if (day.others?.items?.length) {
        const names = day.others.items
            .map((o) => o.serviceName)
            .filter(Boolean)
            .join(", ");
        cards.push({
            id: "others",
            type: "Others",
            field: "others",
            title: names || "Others",
        });
    }

    return cards;
};

type DayItinerarySavedItemsProps = {
    day: DayItinerary;
    onEdit: (card: DayItineraryCardItem) => void;
    onDelete: (card: DayItineraryCardItem) => void;
};

const DayItinerarySavedItems = ({
    day,
    onEdit,
    onDelete,
}: DayItinerarySavedItemsProps) => {
    const cards = collectDayItineraryCards(day);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (!cards.length) return null;

    return (
        <div className="pkg-day-saved-items mb-3">
            {cards.map((card) => {
                const meta = TYPE_META[card.type];
                const expanded = expandedId === card.id;

                return (
                    <div key={card.id} className="pkg-day-saved-card">
                        <div className="pkg-day-saved-card-main">
                            <div className="pkg-day-saved-card-type">
                                <Icon icon={meta.icon} width={22} />
                                <span>{meta.label}</span>
                            </div>

                            <div className="pkg-day-saved-card-body">
                                <div className="pkg-day-saved-card-title">
                                    {card.title}
                                </div>
                                {card.subtitle ? (
                                    <div className="pkg-day-saved-card-sub">
                                        {card.subtitle}
                                    </div>
                                ) : null}
                            </div>

                            <div className="pkg-day-saved-card-actions">
                                <button
                                    type="button"
                                    onClick={() => onEdit(card)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(card)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="pkg-day-saved-card-details"
                            onClick={() =>
                                setExpandedId(expanded ? null : card.id)
                            }
                        >
                            <span>{meta.detailsLabel}</span>
                            <Icon
                                icon={
                                    expanded
                                        ? "mdi:chevron-up"
                                        : "mdi:chevron-down"
                                }
                                width={16}
                            />
                        </button>

                        {expanded && (
                            <div className="pkg-day-saved-card-expanded">
                                {card.subtitle || card.title}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DayItinerarySavedItems;
