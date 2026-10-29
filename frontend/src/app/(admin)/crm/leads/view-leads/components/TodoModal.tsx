"use client";

import React, { useState } from "react";
import { Button, Modal, Table, Form, Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSearchParams } from "next/navigation";
import { useCreateFollowUpMutation } from "../../../../../../store/services/followUp.Api";
import toast from "react-hot-toast";

const ToDoModal: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [remind, setRemind] = useState(false)
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

  // helper
  const getVariant = (value: string, selected: string) =>
    value === selected ? "primary" : "outline-secondary";

  const searchParams = useSearchParams();
  const leadId = searchParams.get("id");

  const [createFollowUp, { isLoading: submitting }] = useCreateFollowUpMutation();

  const [time, setTime] = useState("");
  const [details, setDetails] = useState("");
  const [completed, setCompleted] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [leadModel, setLeadModel] = useState("B2CLead");

  const handleSubmit = async () => {
    try {

      await createFollowUp({
        leadId,
        leadModel,
        type: type === "call" ? "Call" : "ToDo",

        direction: type === "call"
          ? (direction === "outgoing" ? "Outgoing" : "Incoming")
          : undefined,

        outcome: type === "call"
          ? (outcome === "answered" ? "Answered"
            : outcome === "unanswered" ? "Unanswered"
              : "NotReachable")
          : undefined,

        nextStep: type === "call"
          ? (action === "callback" ? "CallBack"
            : action === "meeting" ? "Meeting"
              : action === "query" ? "CreateQuery"
                : action === "lost" ? "Lost"
                  : undefined)
          : undefined,

        schedule: {
          day: dateType === "today" ? "Today"
            : dateType === "tomorrow" ? "Tomorrow"
              : dateType === "2days" ? "In2Days"
                : dateType === "3days" ? "In3Days"
                  : "Custom",
          date: (() => {
            const base = dateType === "custom"
              ? new Date(customDate)
              : new Date();
            if (time) {
              const [hours, minutes] = time.split(":");
              base.setHours(Number(hours), Number(minutes));
            }
            return base.toISOString();
          })(),
        },

        details,
        completed,
      }).unwrap();

      toast.success("Follow-up created successfully");
      setShowAdd(false);

    } catch (error: any) {
      console.error(error);
      toast.error("Failed to create follow-up");
    }
  };

  return (
    <>
      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => setShowAdd(true)}>
        <Icon icon="mdi:plus" className="me-1" />To Do
      </Button>

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
          <Modal.Title>Add To Do </Modal.Title>

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
          <div className="d-flex justify-content-between">
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

            <div className="position-relative">
              <h6>remind in <b onClick={() => setRemind(!remind)} style={{ cursor: "pointer" }}>15 minutes</b></h6>
            </div>

            {remind && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  right: "15px",
                  width: "380px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  padding: "10px",
                  zIndex: 1000,
                }}>
                <p>Remind in</p>
                <Row>
                  <Col md={6}>
                    <Form.Control placeholder="15"
                      size="sm" style={{ fontSize: "12px" }}
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Select size="sm" style={{ fontSize: "12px" }}>
                      <option>minutes</option>
                      <option>hours</option>
                      <option>days</option>
                    </Form.Select>
                  </Col>
                </Row>

                <div className="text-end mt-2">
                  <Button variant="outline-danger" size="sm"
                    style={{ fontSize: "12px" }}>Submit</Button>
                </div>
              </div>
            )}
          </div>

          {type !== "todo" && (
            <>
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

                {direction !== "incoming" && (
                  <>
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
                  </>
                )}
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

                {outcome !== "not_reachable" && outcome !== "unanswered" && (
                  <>
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

                  </>
                )}
                <Button
                  size="sm"
                  variant={getVariant("lost", action)}
                  onClick={() => setAction("lost")}
                  style={{ fontSize: "10px" }}
                >
                  Lost
                </Button>
              </div>
            </>
          )}

          {action !== "query" && action !== "lost" && (
            <>
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
            </>
          )}


          <Form>
            <Row>
              {action !== "query" && action !== "lost" && (
                <>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                        Time
                      </Form.Label>
                      <Form.Control type="time" style={{ fontSize: "10px" }} value={time} onChange={(e) => setTime(e.target.value)} />
                    </Form.Group>
                  </Col>
                </>
              )}

              {action === "lost" && (
                <Col md={6}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Select
                  </Form.Label>
                  <Form.Select size="sm" style={{ fontSize: "10px" }}>
                    <option>Lead Stages</option>
                    <option>Wrong Number</option>
                    <option>Cannot be contacted</option>
                  </Form.Select>
                </Col>
              )}
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Assigned To
                  </Form.Label>
                  <Form.Control type="text" style={{ fontSize: "10px" }} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Customer
                  </Form.Label>
                  <Form.Control type="text" style={{ fontSize: "10px" }} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Select
                  </Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    style={{ fontSize: "10px" }} value={leadModel} onChange={(e) => setLeadModel(e.target.value === "1" ? "B2BLead" : "B2CLead")}
                  >
                    <option>select Lead</option>
                    <option value="1">B2B</option>
                    <option value="2">B2C</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Details
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    style={{ fontSize: "10px" }}
                    value={details} onChange={(e) => setDetails(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Completed"
                  style={{ fontSize: "10px" }}
                  checked={completed} onChange={(e) => setCompleted(e.target.checked)}
                />
              </Col>
            </Row>
          </Form>

          {/* CUSTOM DATE */}
          {dateType === "custom" && (
            <Form.Group className="mb-2">
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Custom Date
              </Form.Label>
              <Form.Control type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
            </Form.Group>
          )}


        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAdd(false)}
            style={{ fontSize: "10px" }}
          >
            Cancel
          </Button>
          <Button variant="primary" style={{ fontSize: "10px" }} onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ToDoModal;
