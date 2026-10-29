"use client";

import React, { useMemo, useState } from "react";
import { Button, Modal, Spinner, Table } from "react-bootstrap";
import { useGetFollowUpsByLeadIdQuery } from "@/store/services/followUp.Api";

type CallDetailsModalProps = {
  leadId?: string;
  customerName?: string;
};

const formatCallDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const dd = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const yy = String(date.getFullYear()).slice(-2);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${dd}-${months[date.getMonth()]}-${yy} ${hh}:${mm}`;
};

const CallDetailsModal = ({ leadId, customerName }: CallDetailsModalProps) => {
  const [show, setShow] = useState(false);

  const { data, isLoading, isFetching, isError } = useGetFollowUpsByLeadIdQuery(
    leadId,
    { skip: !leadId || !show }
  );

  const calls = useMemo(() => {
    const rows = (data?.data || []) as any[];
    return rows.filter((item) => item?.type === "Call");
  }, [data]);

  return (
    <>
      <Button
        size="sm"
        className="ql-btn-calls"
        onClick={() => setShow(true)}
        disabled={!leadId}
      >
        Calls
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header
          style={{
            background: "#1e4b8e",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Modal.Title style={{ fontSize: 16 }}>
            Call Details for {customerName || "Customer"}
          </Modal.Title>
          <button
            type="button"
            onClick={() => setShow(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Table bordered className="mb-0 align-middle">
            <thead>
              <tr>
                {["Date & Time", "Call Type", "Duration", "Action"].map((label) => (
                  <th
                    key={label}
                    style={{
                      background: "#1e4b8e",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 600,
                      borderColor: "#1e4b8e",
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {(isLoading || isFetching) && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading calls...
                  </td>
                </tr>
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={4} className="text-center text-danger py-4">
                    Failed to load call details.
                  </td>
                </tr>
              )}
              {!isLoading && !isFetching && !isError && calls.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    No call records found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                calls.map((call: any) => (
                  <tr key={call._id}>
                    <td>
                      {formatCallDateTime(
                        call.createdAt || call.schedule?.date || call.completedAt
                      )}
                    </td>
                    <td>
                      {[call.direction, call.outcome].filter(Boolean).join(" / ") ||
                        "Call"}
                    </td>
                    <td>{call.duration || "—"}</td>
                    <td>{call.status || call.details || "—"}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CallDetailsModal;
