"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
    useGetPackageBookingByIdQuery,
    useUpdatePackageBookingMutation,
} from "@/store/services/booking/packageBookingApi";
import FulfillmentView from "./FulfillmentView";
import { PackageBookingFormData } from "../types/packageBooking";
import {
    FulfillmentData,
    buildFulfillmentFromBooking,
} from "../types/fulfillmentTypes";

type FulfillmentPageProps = {
    editable?: boolean;
};

const FulfillmentPage = ({ editable = false }: FulfillmentPageProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const { data, isLoading, isError } = useGetPackageBookingByIdQuery(id!, {
        skip: !id,
    });
    const [updateBooking, { isLoading: saving }] = useUpdatePackageBookingMutation();
    const [fulfillment, setFulfillment] = useState<FulfillmentData | null>(null);

    useEffect(() => {
        if (data?.data) {
            setFulfillment(
                buildFulfillmentFromBooking(data.data as PackageBookingFormData)
            );
        }
    }, [data]);

    const handleSave = async () => {
        if (!id || !fulfillment) return;
        try {
            await updateBooking({
                id,
                fulfillment,
                received: fulfillment.cashIn,
            }).unwrap();
            toast.success("Fulfillment saved successfully");
            router.push("/bookings/Packages");
        } catch {
            toast.error("Failed to save fulfillment");
        }
    };

    if (!id) {
        return (
            <Card className="p-4 text-center">
                <p>No booking selected.</p>
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => router.push("/bookings/Packages")}
                >
                    Back to Packages
                </Button>
            </Card>
        );
    }

    if (isLoading || !fulfillment) {
        return <Card className="p-4 text-center">Loading fulfillment...</Card>;
    }

    if (isError || !data?.data) {
        return (
            <Card className="p-4 text-center">
                <p>Booking not found.</p>
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => router.push("/bookings/Packages")}
                >
                    Back to Packages
                </Button>
            </Card>
        );
    }

    const booking = data.data as PackageBookingFormData & {
        _id: string;
        createdAt?: string;
    };

    return (
        <>
            <div className="mb-2 d-flex justify-content-between align-items-center">
                <Button
                    variant="link"
                    className="text-danger p-0 text-decoration-none"
                    style={{ fontSize: "12px" }}
                    onClick={() => router.push("/bookings/Packages")}
                >
                    <Icon icon="mdi:arrow-left" /> Back to Packages
                </Button>
                {editable && (
                    <span className="badge bg-warning text-dark" style={{ fontSize: "11px" }}>
                        Edit Mode
                    </span>
                )}
            </div>
            <FulfillmentView
                booking={booking}
                fulfillment={fulfillment}
                onChange={setFulfillment}
                editable={editable}
                onSave={handleSave}
                saving={saving}
            />
        </>
    );
};

export default FulfillmentPage;
