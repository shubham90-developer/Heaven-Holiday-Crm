"use client";

import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";

const FollowupModal: React.FC = () => {
  const [status, setStatus] = useState("");
  const [showAdd, setShowAdd] = useState(false);
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

  const chipClass = (value: string, selected: string) =>
    `fu-chip${value === selected ? " is-active" : ""}`;

  return (
    <>
      <Button
        size="sm"
        className="ql-btn-followup"
        onClick={() => setShowAdd(true)}
      >
        Follow Up
      </Button>

      <Modal
        show={showAdd}
        onHide={() => setShowAdd(false)}
        size="lg"
        centered
        scrollable
        dialogClassName="followup-modal-dialog"
      >
        <Modal.Header className="followup-modal-header">
          <Modal.Title>Add To Do / Follow Up</Modal.Title>
          <button
            type="button"
            className="followup-modal-close"
            onClick={() => setShowAdd(false)}
          >
            ✕
          </button>
        </Modal.Header>

        <Modal.Body className="followup-modal-body">
          <div className="fu-chip-row">
            <button
              type="button"
              className={chipClass("call", type)}
              onClick={() => setType("call")}
            >
              Call
            </button>
            <button
              type="button"
              className={chipClass("todo", type)}
              onClick={() => setType("todo")}
            >
              To Do
            </button>
          </div>

          {type === "call" && (
            <div className="fu-chip-row">
              <button
                type="button"
                className={chipClass("outgoing", direction)}
                onClick={() => setDirection("outgoing")}
              >
                Outgoing
              </button>
              <button
                type="button"
                className={chipClass("incoming", direction)}
                onClick={() => setDirection("incoming")}
              >
                Incoming
              </button>
            </div>
          )}

          {type === "call" && (
            <>
              <div className="fu-label">Outcome</div>
              <div className="fu-chip-row">
                <button
                  type="button"
                  className={chipClass("answered", outcome)}
                  onClick={() => setOutcome("answered")}
                >
                  Answered
                </button>
                <button
                  type="button"
                  className={chipClass("unanswered", outcome)}
                  onClick={() => setOutcome("unanswered")}
                >
                  Unanswered
                </button>
                <button
                  type="button"
                  className={chipClass("not_reachable", outcome)}
                  onClick={() => setOutcome("not_reachable")}
                >
                  Not Reachable
                </button>
              </div>
            </>
          )}

          <div className="fu-label">Next Action</div>
          <div className="fu-chip-row">
            <button
              type="button"
              className={chipClass("callback", action)}
              onClick={() => setAction("callback")}
            >
              Call Back
            </button>
            <button
              type="button"
              className={chipClass("todo", action)}
              onClick={() => setAction("todo")}
            >
              To Do
            </button>
            <button
              type="button"
              className={chipClass("meeting", action)}
              onClick={() => setAction("meeting")}
            >
              Meeting
            </button>
            <button
              type="button"
              className={chipClass("query", action)}
              onClick={() => setAction("query")}
            >
              Create Query
            </button>
            <button
              type="button"
              className={chipClass("lost", action)}
              onClick={() => setAction("lost")}
            >
              Lost
            </button>
          </div>

          <div className="fu-label">Schedule</div>
          <div className="fu-chip-row">
            <button
              type="button"
              className={chipClass("today", dateType)}
              onClick={() => setDateType("today")}
            >
              Today
            </button>
            <button
              type="button"
              className={chipClass("tomorrow", dateType)}
              onClick={() => setDateType("tomorrow")}
            >
              Tomorrow
            </button>
            <button
              type="button"
              className={chipClass("2days", dateType)}
              onClick={() => setDateType("2days")}
            >
              In 2 Days
            </button>
            <button
              type="button"
              className={chipClass("3days", dateType)}
              onClick={() => setDateType("3days")}
            >
              In 3 Days
            </button>
            <button
              type="button"
              className={chipClass("custom", dateType)}
              onClick={() => setDateType("custom")}
            >
              Custom
            </button>
          </div>

          <Form>
            <Row className="g-3">
              {dateType === "custom" && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fu-field-label">Custom Date</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
              )}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fu-field-label">Time</Form.Label>
                  <Form.Control type="time" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fu-field-label">Assigned To</Form.Label>
                  <Form.Control type="text" placeholder="Staff name" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fu-field-label">Customer</Form.Label>
                  <Form.Control type="text" placeholder="Customer name" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fu-field-label">Select</Form.Label>
                  <Form.Select>
                    <option value="">Select Lead</option>
                    <option value="1">B2B</option>
                    <option value="2">B2C</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fu-field-label">Details</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Add follow up notes..." />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex flex-wrap align-items-center gap-3 mt-3">
              <Form.Check type="checkbox" label="Completed" />
              <Form.Check
                type="radio"
                name="leadStatus"
                label="No Status"
                value=""
                checked={status === ""}
                onChange={(e) => setStatus(e.target.value)}
              />
              <Form.Check
                type="radio"
                name="leadStatus"
                label="Hot"
                value="hot"
                checked={status === "hot"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <Form.Check
                type="radio"
                name="leadStatus"
                label="Warm"
                value="warm"
                checked={status === "warm"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <Form.Check
                type="radio"
                name="leadStatus"
                label="Cold"
                value="cold"
                checked={status === "cold"}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
          <Button variant="primary">Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FollowupModal;
