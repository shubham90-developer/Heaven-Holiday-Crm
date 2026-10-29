"use client";

import React, { useState } from "react";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetConfirmedQueriesQuery } from "@/store/services/queriesApi";

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "2-digit",
  });
};

const formatAge = (dateStr?: string | Date) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}H ${m}M`;
};

const getDestination = (q: any): string => {
  if (q?.packageDetails?.goingTo)
    return [q.packageDetails.goingFrom, q.packageDetails.goingTo].filter(Boolean).join(" → ");
  if (q?.flightDetails?.destinationCity)
    return [q.flightDetails.sourceCity, q.flightDetails.destinationCity].filter(Boolean).join(" → ");
  if (q?.transferDetails?.goingTo)
    return [q.transferDetails.goingFrom, q.transferDetails.goingTo].filter(Boolean).join(" → ");
  if (q?.transferDetails?.to)
    return [q.transferDetails.from, q.transferDetails.to].filter(Boolean).join(" → ");
  if (q?.visaDetails?.country) return q.visaDetails.country;
  if (q?.hotelDetails?.destination) return q.hotelDetails.destination;
  if (q?.sightseeingDetails?.destination) return q.sightseeingDetails.destination;
  if (q?.miscellaneousDetails?.destination) return q.miscellaneousDetails.destination;
  return "—";
};

const getTravelDate = (q: any): string => {
  const found = [
    q?.packageDetails?.specificDate,
    q?.flightDetails?.departureDate,
    q?.transferDetails?.pickupDateTime ?? q?.transferDetails?.departureDate,
    q?.visaDetails?.dateOfTravel,
    q?.hotelDetails?.checkIn,
    q?.miscellaneousDetails?.date,
  ].find(Boolean);
  return found ? formatDate(found) : "—";
};

const getPax = (q: any): string => {
  const d = q?.packageDetails ?? q?.flightDetails ?? q?.transferDetails ??
    q?.visaDetails ?? q?.hotelDetails ?? q?.sightseeingDetails ?? q?.miscellaneousDetails;
  if (!d) return "—";
  if (d.travelers != null) return `${d.travelers} Traveler(s)`;
  if (d.count != null) return `${d.count} Person(s)`;
  if (d.adults != null) {
    const parts = [`${d.adults} Adult(s)`];
    if (d.children) parts.push(`${d.children} Child`);
    if (d.infants) parts.push(`${d.infants} Infant`);
    return parts.join(", ");
  }
  return "—";
};

const STAGE_BADGE: Record<string, string> = {
  confirmed: "success",
  verbal_confirmed: "warning",
  booking_requested: "primary",
};

const ConfirmedQueries = () => {
  const { data: queries = [], isLoading, isError, refetch } = useGetConfirmedQueriesQuery(undefined);
  console.log(queries);

  return (
    <>
      <Card className="p-3">
        <div className="mb-4">
          <Row className="align-items-center">
            {/* Right Section */}
            <Col lg={4}>
              <h6 className="fw-bold">
                Total Record Found :- <span className="text-primary">{queries.length}</span>
              </h6>
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
                style={{ fontSize: "10px" }}
              />
            </Col>
          </Row>
        </div>
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "40px" }}>
                  <Form.Check type="checkbox" />
                </th>

                <th style={{ width: "130px" }}>Query Date</th>

                <th style={{ width: "260px" }}>Customer Details</th>

                <th style={{ width: "140px" }}>Pax/ Type</th>

                <th style={{ width: "110px" }}>Description</th>

                <th style={{ width: "90px" }}>Travel Date</th>

                <th style={{ width: "100px" }}>Destinations</th>

                <th style={{ width: "150px" }}> Proposal</th>

                <th style={{ width: "120px" }}>Lead Stage</th>

                <th style={{ width: "120px" }}>Last Updated</th>

                <th style={{ width: "140px" }}>Owner</th>

                <th style={{ width: "70px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {/* loading */}
              {isLoading && (
                <tr>
                  <td colSpan={12} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Loading confirmed queries...
                  </td>
                </tr>
              )}

              {/* error */}
              {isError && (
                <tr>
                  <td colSpan={12} className="text-center text-danger py-4">
                    <Icon icon="mdi:alert-circle-outline" className="me-1" />
                    Failed to load.{" "}
                    <button className="btn btn-link btn-sm p-0" onClick={refetch}>Retry</button>
                  </td>
                </tr>
              )}

              {/* empty */}
              {!isLoading && !isError && queries.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center text-muted py-4">
                    No confirmed queries found.
                  </td>
                </tr>
              )}

              {/* data rows */}
              {!isLoading && !isError && queries?.map((query: any) => {
                const lead = query.leadId ?? {};
                const firstItem = query.queries?.[0];

                const companyName = lead.companyName ?? lead.company ?? "";
                const contactName = lead.name ?? lead.contactPerson ?? "";
                const phone = lead.phone ?? lead.mobile ?? "";
                const email = lead.email ?? "";
                const leadType = query.leadModel === "B2BLead" ? "B2B" : "B2C";
                const badgeColor = leadType === "B2B" ? "primary" : "success";

                const queryDate = formatDate(query.createdAt);
                const queryAge = formatAge(query.createdAt);
                const queryCode = query._id?.toString().slice(-7).toUpperCase() ?? "—";
                const lastUpdated = formatDate(query.updatedAt);
                const owner = query.assignedToSales?.name ?? "Unassigned";
                const stage = query.stage ?? "";
                const stageBadge = STAGE_BADGE[stage] ?? "secondary";
                const stageLabel = stage.replace(/_/g, " ");

                const requirementType = firstItem?.requirementType ?? "—";
                const destination = firstItem ? getDestination(firstItem) : "—";
                const travelDate = firstItem ? getTravelDate(firstItem) : "—";
                const pax = firstItem ? getPax(firstItem) : "—";

                return (
                  <tr key={query._id}>

                    <td><Form.Check /></td>

                    {/* Query Date */}
                    <td>
                      <div>{queryDate}</div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>{queryAge}</div>
                      <div className="text-muted" style={{ fontSize: "10px" }}>Q/26/{queryCode}</div>
                    </td>

                    {/* Customer Details */}
                    <td>
                      {companyName && (
                        <div className="fw-semibold">
                          <Icon icon="mdi:building" className="me-1" />{companyName}
                        </div>
                      )}
                      {contactName && (
                        <div className="fw-semibold">
                          <Icon icon="mdi:account" className="me-1" />{contactName}
                        </div>
                      )}
                      {phone && (
                        <div><Icon icon="mdi:phone" className="me-1" />{phone}</div>
                      )}
                      {email && (
                        <div><Icon icon="mdi:email-outline" className="me-1" />{email}</div>
                      )}
                    </td>

                    {/* Pax / Type */}
                    <td>
                      <div>{pax}</div>
                      <span className={`badge bg-${badgeColor}`}>{leadType}</span>
                    </td>

                    {/* Description */}
                    <td>{requirementType}</td>

                    {/* Travel Date */}
                    <td>{travelDate}</td>

                    {/* Destinations */}
                    <td style={{ wordBreak: "break-word" }}>{destination}</td>

                    {/* Proposal — empty col kept for layout */}
                    <td></td>

                    {/* Lead Stage */}
                    <td>
                      <span className={`badge bg-${stageBadge} text-capitalize`}>
                        {stageLabel}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td>{lastUpdated}</td>

                    {/* Owner */}
                    <td>{owner}</td>

                    {/* Action */}
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Button variant="success" size="sm" 
                        
                        style={{ fontSize: "10px" }} title="View">
                          <Icon icon="mdi:eye-outline" />
                        </Button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="primary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "600" }}
          >
            Load More <Icon icon="mdi:reload" className="ms-1" />
          </Button>
        </div>
      </Card>

      {/* message modal */}
    </>
  );
};

export default ConfirmedQueries;
