"use client";

import React, { useState } from "react";
import { Button, Modal, Table, Form } from "react-bootstrap";
import {
  useCreateFollowUpMutation,
  useGetFollowUpsByLeadIdQuery
} from "../../../../../store/services/followUp.Api";
import toast from "react-hot-toast";

interface FollowupModalProps {
  leadId: string;
  leadModel: "B2CLead" | "B2BLead";
}

const FollowupModal: React.FC<FollowupModalProps> = ({ leadId, leadModel }) => {

  const [createFollowUp, { isLoading }] = useCreateFollowUpMutation();

  //fetch follow up
  const {
    data: followUpsData,
    isLoading: isLoadingHistory,
    isError: isHistoryError,
  } = useGetFollowUpsByLeadIdQuery(leadId, {
    skip: false, // always fetch; RTK Query caches automatically
  });

  const followUps = followUpsData?.data ?? [];

  const [details, setDetails] = useState("");
  // const [assignedTo, setAssignedTo] = useState("");
  const [time, setTime] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  // TAB STATES
  const [type, setType] = useState<"call" | "todo">("call");
  const [direction, setDirection] = useState<"outgoing" | "incoming">(
    "outgoing",
  );
  const [outcome, setOutcome] = useState<
    "answered" | "unanswered" | "not_reachable"
  >("answered");
  const [action, setAction] = useState<
    "callback" | "todo" | "meeting" | "query" | "lost"
  >("callback");
  const [dateType, setDateType] = useState<
    "today" | "tomorrow" | "2days" | "3days" | "custom"
  >("today");

  const [customDate, setCustomDate] = useState("");

  // helper
  const getVariant = (value: string, selected: string) =>
    value === selected ? "primary" : "outline-secondary";

  const handleSubmit = async () => {
    try {
      // FRONTEND VALIDATION

      if (!type) return toast.error("Type is required");

      if (type === "call" && !direction) {
        return toast.error("Direction is required for Call");
      }

      if (type === "call" && !outcome) {
        return toast.error("Outcome is required for Call");
      }

      if (dateType === "custom" && !customDate) {
        return toast.error("Please select custom date");
      }

      if (!time) {
        return toast.error("Time is required");
      }

      if (!details.trim()) {
        return toast.error("Details cannot be empty");
      }

      // Build date
      let selectedDate = new Date();

      if (dateType === "tomorrow") {
        selectedDate.setDate(selectedDate.getDate() + 1);
      } else if (dateType === "2days") {
        selectedDate.setDate(selectedDate.getDate() + 2);
      } else if (dateType === "3days") {
        selectedDate.setDate(selectedDate.getDate() + 3);
      } else if (dateType === "custom") {
        selectedDate = new Date(customDate);
      }

      // Add time
      const [hours, minutes] = time.split(":");
      selectedDate.setHours(Number(hours));
      selectedDate.setMinutes(Number(minutes));

      const dayMap = {
        today: "Today",
        tomorrow: "Tomorrow",
        "2days": "In2Days",
        "3days": "In3Days",
        custom: "Custom",
      } as const;

      await createFollowUp({
        leadId,
        leadModel,
        type: type === "call" ? "Call" : "ToDo",

        ...(type === "call" && {
          direction: direction === "outgoing" ? "Outgoing" : "Incoming",
          outcome:
            outcome === "answered"
              ? "Answered"
              : outcome === "unanswered"
                ? "Unanswered"
                : "NotReachable",
        }),

        ...(action !== "todo" && {
          nextStep:
            action === "callback"
              ? "CallBack"
              : action === "meeting"
                ? "Meeting"
                : action === "query"
                  ? "CreateQuery"
                  : "Lost",
        }),

        schedule: {
          day: dayMap[dateType], // ✅ FIXED
          date: selectedDate.toISOString(),
        },

        details,
        completed,
      }).unwrap();

      toast.success("Follow-up created successfully ✅");

      setShowAdd(false);

    } catch (err: any) {
      console.error(err);

      // BACKEND ERROR HANDLING
      toast.error(
        err?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      {/* BUTTON */}
      <Button
        size="sm"
        onClick={() => setShowHistory(true)}
        style={{ fontSize: "8px" }}
      >
        Follow Up
      </Button>

      {/* ================= HISTORY MODAL ================= */}
      <Modal
        show={showHistory}
        onHide={() => setShowHistory(false)}
        size="lg"
        centered
      >
        <Modal.Header
          style={{
            background: "#274c6b",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Modal.Title>Follow Up History</Modal.Title>

          <button
            onClick={() => setShowHistory(false)}
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

        <Modal.Body>
          <div className="text-end mb-2">
            <Button
              variant="link"
              onClick={() => {
                setShowHistory(false);
                setShowAdd(true);
              }}
            >
              + Add To Do / Follow Up
            </Button>
          </div>

          <Table bordered hover>
            <thead>
              <tr>
                <th>Action</th>
                <th>Description</th>
                <th>Start / End</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingHistory ? (
                <tr>
                  <td colSpan={4}>Loading...</td>
                </tr>
              ) : isHistoryError ? (
                <tr>
                  <td colSpan={4}>Error loading follow-ups</td>
                </tr>
              ) : followUps.length === 0 ? (
                <tr>
                  <td colSpan={4}>No follow-ups found</td>
                </tr>
              ) : (
                followUps.map((fu: any) => (
                  <tr key={fu._id}>

                    {/* ACTION */}
                    <td>
                      {fu.type}
                      {fu.type === "Call" && fu.direction && fu.outcome && (
                        <> ({fu.direction}, {fu.outcome})</>
                      )}
                    </td>

                    {/* DESCRIPTION */}
                    <td>{fu.details || "NA"}</td>

                    {/* DATE */}
                    <td>
                      {fu.schedule?.date
                        ? new Date(fu.schedule.date).toLocaleString()
                        : "NA"}
                    </td>

                    {/* STATUS */}
                    <td
                      style={{
                        color:
                          fu.status === "Completed"
                            ? "green"
                            : fu.status === "Overdue"
                              ? "red"
                              : "orange",
                      }}
                    >
                      {fu.status}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* ================= ADD MODAL ================= */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} size="lg" centered>
        <Modal.Header
          style={{
            background: "#274c6b",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Modal.Title>Add To Do / Follow Up</Modal.Title>

          <button
            onClick={() => setShowAdd(false)}
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

        <Modal.Body>
          {/* TYPE */}
          <div className="mb-2">
            <Button
              size="sm"
              variant={getVariant("call", type)}
              onClick={() => setType("call")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              Call
            </Button>
            <Button
              size="sm"
              variant={getVariant("todo", type)}
              onClick={() => setType("todo")}
              style={{ fontSize: "10px" }}
            >
              To Do
            </Button>
          </div>

          {/* DIRECTION */}
          <div className="mb-2">
            <Button
              size="sm"
              variant={getVariant("outgoing", direction)}
              onClick={() => setDirection("outgoing")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              Outgoing
            </Button>
            <Button
              size="sm"
              variant={getVariant("incoming", direction)}
              onClick={() => setDirection("incoming")}
              style={{ fontSize: "10px" }}
            >
              Incoming
            </Button>
          </div>

          {/* OUTCOME */}
          <h6 className="text-primary mt-2">Out Come</h6>
          <div className="mb-2">
            <Button
              size="sm"
              variant={getVariant("answered", outcome)}
              onClick={() => setOutcome("answered")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              Answered
            </Button>
            <Button
              size="sm"
              variant={getVariant("unanswered", outcome)}
              onClick={() => setOutcome("unanswered")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              Unanswered
            </Button>
            <Button
              size="sm"
              variant={getVariant("not_reachable", outcome)}
              onClick={() => setOutcome("not_reachable")}
              style={{ fontSize: "10px" }}
            >
              Not Reachable
            </Button>
          </div>

          {/* ACTION */}
          <div className="mb-2">
            <Button
              size="sm"
              variant={getVariant("callback", action)}
              onClick={() => setAction("callback")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              Call Back
            </Button>
            <Button
              size="sm"
              variant={getVariant("todo", action)}
              onClick={() => setAction("todo")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              To Do
            </Button>
            <Button
              size="sm"
              variant={getVariant("meeting", action)}
              onClick={() => setAction("meeting")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              Meeting
            </Button>
            <Button
              size="sm"
              variant={getVariant("query", action)}
              onClick={() => setAction("query")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              Create Query
            </Button>
            <Button
              size="sm"
              variant={getVariant("lost", action)}
              onClick={() => setAction("lost")}
              style={{ fontSize: "10px" }}
            >
              Lost
            </Button>
          </div>

          {/* DATE */}
          <div className="mb-2">
            <Button
              size="sm"
              variant={getVariant("today", dateType)}
              onClick={() => setDateType("today")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              Today
            </Button>
            <Button
              size="sm"
              variant={getVariant("tomorrow", dateType)}
              onClick={() => setDateType("tomorrow")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              Tomorrow
            </Button>
            <Button
              size="sm"
              variant={getVariant("2days", dateType)}
              onClick={() => setDateType("2days")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              In 2 Days
            </Button>
            <Button
              size="sm"
              variant={getVariant("3days", dateType)}
              onClick={() => setDateType("3days")}
              className="me-2"
              style={{ fontSize: "10px" }}
            >
              In 3 Days
            </Button>
            <Button
              size="sm"
              variant={getVariant("custom", dateType)}
              onClick={() => setDateType("custom")}
              style={{ fontSize: "10px" }}
            >
              Custom
            </Button>
          </div>

          {/* CUSTOM DATE */}
          {dateType === "custom" && (
            <Form.Group className="mb-2">
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Custom Date
              </Form.Label>
              <Form.Control type="date" value={customDate}
                onChange={(e) => setCustomDate(e.target.value)} />
            </Form.Group>
          )}

          {/* FORM */}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Time
              </Form.Label>
              <Form.Control type="time" style={{ fontSize: "10px" }} value={time}
                onChange={(e) => setTime(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Assigned To
              </Form.Label>
              <Form.Control type="text" style={{ fontSize: "10px" }} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Customer
              </Form.Label>
              <Form.Control type="text" style={{ fontSize: "10px" }} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Select
              </Form.Label>
              <Form.Select
                aria-label="Default select example"
                style={{ fontSize: "10px" }}
              >
                <option>select Lead</option>
                <option value="1">B2B</option>
                <option value="2">B2C</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Details
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                style={{ fontSize: "10px" }}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Completed"
              style={{ fontSize: "10px" }}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAdd(false)}
            style={{ fontSize: "10px" }}
          >
            Cancel
          </Button>
          <Button variant="primary" style={{ fontSize: "10px" }}
            onClick={handleSubmit}
            disabled={isLoading}>
            {isLoading ? "Saving..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FollowupModal;
