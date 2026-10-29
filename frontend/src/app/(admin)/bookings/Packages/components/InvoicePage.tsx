"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react";
import {
    useGetPackageBookingByIdQuery,
    useUpdatePackageBookingMutation,
} from "@/store/services/booking/packageBookingApi";
import InvoiceForm from "./InvoiceForm";
import { PackageBookingFormData } from "../types/packageBooking";

const InvoicePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const { data, isLoading, isError } = useGetPackageBookingByIdQuery(id!, {
        skip: !id,
    });
    const [updateBooking] = useUpdatePackageBookingMutation();

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

    if (isLoading) {
        return <Card className="p-4 text-center">Loading invoice...</Card>;
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

    const booking = data.data as PackageBookingFormData & { _id: string };

    return (
        <>
            <div className="mb-2">
                <Button
                    variant="link"
                    className="text-danger p-0 text-decoration-none"
                    style={{ fontSize: "12px" }}
                    onClick={() => router.push("/bookings/Packages")}
                >
                    <Icon icon="mdi:arrow-left" /> Back to Packages
                </Button>
            </div>

            <InvoiceForm
                booking={booking}
                onCancel={() => router.push("/bookings/Packages")}
                onSave={async (bookingId, invoiceData) => {
                    await updateBooking({
                        id: bookingId,
                        invoice: invoiceData.invoice,
                        received: invoiceData.received,
                        balance: invoiceData.balance,
                        bookingStage: invoiceData.bookingStage,
                    }).unwrap();
                    router.push("/bookings/Packages");
                }}
            />
        </>
    );
};

export default InvoicePage;
