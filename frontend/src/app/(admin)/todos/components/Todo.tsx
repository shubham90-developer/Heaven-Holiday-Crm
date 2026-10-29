"use client";

import React from "react";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import Filter from "./Filter";
import { useGetAllFollowUpsQuery } from "@/store/services/followUp.Api";

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

const getLeadContact = (item: {
  leadId?: Record<string, string> | string;
  leadModel?: string;
}) => {
  const lead = item.leadId;
  if (!lead || typeof lead === "string") {
    return { name: "—", phone: "—", leadId: null as string | null };
  }

  const leadId = lead._id?.toString() || null;

  if (item.leadModel === "B2BLead") {
    const name =
      lead.companyName ||
      `${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
      "—";
    return { name, phone: lead.mobile || "—", leadId };
  }

  const name =
    `${lead.salutation || ""} ${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
    "—";
  return { name, phone: lead.mobile || "—", leadId };
};

const getActionLabel = (item: {
  type?: string;
  direction?: string;
  nextStep?: string;
  details?: string;
}) => {
  const parts = [item.type];
  if (item.direction) parts.push(item.direction);
  if (item.nextStep) parts.push(item.nextStep);
  if (item.details) parts.push(`(${item.details})`);
  return parts.filter(Boolean).join(" - ") || "—";
};

const Todo = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetAllFollowUpsQuery({});
  const followUps = data?.data || [];

  return (
    <>
      <div className="mb-2">
        <Filter />
      </div>
      <Card className="p-3">
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "110px" }}>Stage Type</th>
                <th style={{ width: "180px" }}>Action</th>
                <th style={{ width: "110px" }}>Create Date</th>
                <th style={{ width: "110px" }}>Due Date</th>
                <th style={{ width: "110px" }}>Created by</th>
                <th style={{ width: "110px" }}>Assigned to</th>
                <th style={{ width: "160px" }} className="text-center">
                  Contact
                </th>
                <th style={{ width: "110px" }} className="text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Loading todos...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={8} className="text-center text-danger py-4">
                    Failed to load todos.{" "}
                    <button
                      type="button"
                      className="btn btn-link btn-sm"
                      onClick={() => refetch()}
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              )}

              {!isLoading && !isError && followUps.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    No todos found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                followUps.map((item: Record<string, unknown> & { _id: string }) => {
                  const contact = getLeadContact(
                    item as Parameters<typeof getLeadContact>[0]
                  );

                  return (
                    <tr key={item._id}>
                      <td>{item.type as string}</td>
                      <td style={{ fontSize: "10px" }}>
                        {getActionLabel(
                          item as Parameters<typeof getActionLabel>[0]
                        )}
                      </td>
                      <td>{formatDate(item.createdAt as string)}</td>
                      <td>
                        {formatDate(
                          (item.schedule as { date?: string })?.date
                        )}
                      </td>
                      <td>—</td>
                      <td>—</td>
                      <td>
                        <div className="fw-semibold">{contact.name}</div>
                        <div style={{ fontSize: "10px" }}>{contact.phone}</div>
                        {contact.leadId && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0"
                            style={{ fontSize: "10px" }}
                            onClick={() =>
                              router.push(
                                `/crm/leads/view-leads?id=${contact.leadId}`
                              )
                            }
                          >
                            View Lead
                          </Button>
                        )}
                      </td>
                      <td className="text-center">
                        {(item.status as string) || "Pending"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default Todo;
