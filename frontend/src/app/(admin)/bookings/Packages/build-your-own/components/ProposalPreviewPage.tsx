"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { useGetPackageBookingByIdQuery } from "@/store/services/booking/packageBookingApi";
import ProposalPreview from "./ProposalPreview";
import { PackageBookingFormData } from "../../types/packageBooking";

const ProposalPreviewPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const { data, isLoading, isError } = useGetPackageBookingByIdQuery(id!, {
        skip: !id,
    });

    if (!id) {
        return (
            <Card className="p-4 text-center">
                <p>No proposal selected.</p>
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
        return <Card className="p-4 text-center">Loading proposal preview...</Card>;
    }

    if (isError || !data?.data) {
        return (
            <Card className="p-4 text-center">
                <p>Proposal not found.</p>
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

    return (
        <ProposalPreview booking={data.data as PackageBookingFormData} />
    );
};

export default ProposalPreviewPage;
