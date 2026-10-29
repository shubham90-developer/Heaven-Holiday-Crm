"use client";

import React from "react";
import { Badge } from "react-bootstrap";
import { PackageBookingFormData, DayItinerary } from "../types/packageBooking";

const VOUCHER_SERVICES = [
    { key: "hotels", label: "Hotels", check: (days: DayItinerary[]) => days.some((d) => d.accommodation) },
    { key: "flight", label: "Flight", check: (days: DayItinerary[]) => days.some((d) => d.flight) },
    { key: "visa", label: "Visa", check: (days: DayItinerary[]) => days.some((d) => d.visaItinerary) },
    { key: "sightseeing", label: "Sightseeing", check: (days: DayItinerary[]) => days.some((d) => d.sightseeing) },
    { key: "transfers", label: "Transfers", check: (days: DayItinerary[]) => days.some((d) => d.transport) },
    { key: "others", label: "Others", check: (days: DayItinerary[]) => days.some((d) => d.others || d.cruise || d.guide || d.mealsItinerary) },
] as const;

type VoucherStatusGridProps = {
    booking: PackageBookingFormData;
};

const VoucherStatusGrid = ({ booking }: VoucherStatusGridProps) => {
    const days = booking.days || [];

    return (
        <div
            className="d-grid"
            style={{
                gridTemplateColumns: "1fr 1fr",
                gap: "2px",
                fontSize: "9px",
            }}
        >
            {VOUCHER_SERVICES.map((service) => {
                const hasData = service.check(days);
                return (
                    <div
                        key={service.key}
                        className="d-flex justify-content-between align-items-center gap-1"
                    >
                        <span>{service.label}:</span>
                        <Badge
                            bg={hasData ? "info" : "secondary"}
                            style={{ fontSize: "8px", fontWeight: "normal" }}
                        >
                            {hasData ? "Added" : "NA"}
                        </Badge>
                    </div>
                );
            })}
        </div>
    );
};

export default VoucherStatusGrid;
