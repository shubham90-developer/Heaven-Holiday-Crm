"use client";

import React from "react";
import { Button } from "react-bootstrap";
import {
    CustomerDetails,
    PackageBookingFormData,
    formatDisplayDate,
    getCustomerName,
} from "../types/packageBooking";

type QueryDetailsSummaryProps = {
    form: PackageBookingFormData;
    customerDetails?: CustomerDetails;
    onUpdateQuery?: () => void;
    showUpdateButton?: boolean;
};

const QueryDetailsSummary = ({
    form,
    customerDetails,
    onUpdateQuery,
    showUpdateButton = true,
}: QueryDetailsSummaryProps) => {
    const customer = customerDetails || form.customerDetails;

    return (
        <div className="pkg-query-summary">
            {showUpdateButton && (
                <Button
                    size="sm"
                    className="pkg-update-btn"
                    onClick={onUpdateQuery}
                >
                    Update Query
                </Button>
            )}

            <div className="pkg-qs-grid pe-5">
                <div>
                    <span className="pkg-qs-label">Name</span>
                    <span className="pkg-qs-value">{getCustomerName(customer) || "—"}</span>
                </div>
                <div>
                    <span className="pkg-qs-label">Enquiry ID</span>
                    <span className="pkg-qs-value">{form.enquiryId || "—"}</span>
                </div>
                <div>
                    <span className="pkg-qs-label">Enquiry For</span>
                    <span className="pkg-qs-value">Package</span>
                </div>
                <div>
                    <span className="pkg-qs-label">From Destination</span>
                    <span className="pkg-qs-value">{form.goingFrom || "—"}</span>
                </div>
                <div>
                    <span className="pkg-qs-label">To Destination</span>
                    <span className="pkg-qs-value">{form.goingTo || "—"}</span>
                </div>
                <div>
                    <span className="pkg-qs-label">Date of Travel</span>
                    <span className="pkg-qs-value">
                        {formatDisplayDate(form.travelDate) || "—"}
                    </span>
                </div>
                <div>
                    <span className="pkg-qs-label">No of Days</span>
                    <span className="pkg-qs-value">{form.noOfDays || "—"}</span>
                </div>
                <div>
                    <span className="pkg-qs-label">No of Rooms</span>
                    <span className="pkg-qs-value">{form.noOfRooms || 1}</span>
                </div>
                <div>
                    <span className="pkg-qs-label">Remarks</span>
                    <span className="pkg-qs-value">{form.remark || "—"}</span>
                </div>
                <div>
                    <span className="pkg-qs-label">No of Pax</span>
                    <span className="pkg-qs-value">
                        {form.travelers || 0} adult(s)
                        <br />
                        Room 1: [ Adults: {form.travelers || 0} ]
                    </span>
                </div>
            </div>
        </div>
    );
};

export default QueryDetailsSummary;
