"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useGetPackageBookingByIdQuery } from "@/store/services/booking/packageBookingApi";
import ViewProposal from "./ViewProposal";
import { PackageBookingFormData } from "../types/packageBooking";

const ViewProposalPage = () => {
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
        return <Card className="p-4 text-center">Loading proposal...</Card>;
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
            <ViewProposal booking={data.data as PackageBookingFormData} />
        </>
    );
};

export default ViewProposalPage;
