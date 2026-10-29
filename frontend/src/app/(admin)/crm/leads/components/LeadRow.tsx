"use client";

import React from "react";
import { Button, Form } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import FollowupModal from "./FollowupModal";
import SendMessageModal from "./SendMessageModal";
import { useGetFollowUpsByLeadIdQuery } from "../../../../../store/services/followUp.Api";

const LeadRow = ({
    lead,
    selectedLeads,
    setSelectedLeads,
}: any) => {
    const router = useRouter();

    // ✅ Safe API call
    const { data: followUpsData } = useGetFollowUpsByLeadIdQuery(lead?._id, {
        skip: !lead?._id,
    });

    const getStageFromFollowUp = (fu: any) => {
        if (!fu) return "New";

        // 1. Outcome (highest priority)
        if (fu.outcome === "Answered") return "Answered";
        if (fu.outcome === "Unanswered") return "Unanswered";
        if (fu.outcome === "NotReachable") return "Not Reachable";

        // 2. Next Step
        if (fu.nextStep === "Lost") return "Lost";
        if (fu.nextStep === "CallBack") return "Call Back";
        if (fu.nextStep === "Meeting") return "Meeting";
        if (fu.nextStep === "CreateQuery") return "Query Created";

        // 3. Status
        if (fu.status === "Overdue") return "Overdue";
        if (fu.status === "Pending") return "In Process";

        // Default
        return "In Process";
    };

    // ✅ Get latest follow-up
    const latestFollowUp = followUpsData?.data
        ?.slice()
        ?.sort(
            (a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

    const latestStage = getStageFromFollowUp(latestFollowUp);

    return (
        <tr>
            <td>
                <Form.Check checked={selectedLeads.includes(lead._id)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedLeads([...selectedLeads, lead._id]);
                        } else {
                            setSelectedLeads(
                                selectedLeads.filter((id: any) => id !== lead._id)
                            );
                        }
                    }} />
            </td>

            {/* Lead Date */}
            <td>
                {lead.createdAt ? (
                    <>
                        <div>
                            {new Date(lead.createdAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}
                        </div>

                        <div>
                            {Math.floor(
                                (Date.now() - new Date(lead.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            Days
                        </div>

                        <div>{lead._id}</div>
                    </>
                ) : (
                    "NA"
                )}
            </td>

            {/* Customer */}
            <td>
                <div className="fw-semibold">
                    <Icon icon="mdi:account" className="me-1" />
                    {lead.firstName || "NA"} {lead.lastName || ""}
                </div>

                <div>
                    <Icon icon="mdi:phone" className="me-1" />
                    {lead.mobile || "NA"}
                </div>

                <div>
                    <Icon icon="mdi:email-outline" className="me-1" />
                    {lead.email || "NA"}
                </div>
            </td>

            {/* Type */}
            <td>
                <div>{lead.type || "Customer"}</div>
                <span className="badge bg-success">
                    {lead.leadModel === "B2BLead" ? "B2B" : "B2C"}
                </span>
                <div>{lead.leadSource || "NA"}</div>
            </td>

            <td>{lead.travelDate || "NA"}</td>
            <td>{lead.noOfPax || "NA"}</td>
            <td>{lead.noOfDays || "NA"}</td>
            <td>{lead.destinations || "NA"}</td>

            {/* ✅ Dynamic Stage */}
            <td>
                {latestStage || lead.leadStage || "NA"}
                <br />
                <FollowupModal
                    leadId={lead._id}
                    leadModel={lead.leadModel}
                />
            </td>

            <td>{lead.remarks || "NA"}</td>
            <td>{lead.lastUpdated || "NA"}</td>
            <td>{lead?.assignedOwner?.name || "Unassigned"}</td>

            {/* Actions */}
            <td>
                <div className="d-flex flex-column gap-1">
                    <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                            router.push(`/crm/leads/view-leads?id=${lead._id}`)
                        }
                    >
                        <Icon icon="mdi:eye-outline" />
                    </Button>

                    <SendMessageModal
                        leadId={lead._id}
                        leadName={`${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim()}
                        leadModel={lead.leadModel}
                    />
                </div>
            </td>
        </tr>
    );
};

export default LeadRow;