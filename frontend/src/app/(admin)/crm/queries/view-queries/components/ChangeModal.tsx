"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Card,
  CardHeader,
  Row,
  Col,
  CardBody,
} from "react-bootstrap";

type TodoFollowupModalProps ={
    onClose: () => void;
}
const TodoFollowupModal = ({onClose}:TodoFollowupModalProps) => {
 

  return (
    <>
  
      {/* Modal */}
      <Modal
        show={true}
        onHide={onClose}
        centered
        size="lg"
      >
        {/* Header */}
        <Modal.Header
          style={{
            background: "#234a6b",
            color: "#fff",
            border: "none",
          }}
          className="d-flex justify-content-between"
        >
          <Modal.Title style={{ fontSize: "16px" }}>
            Add ToDo / Follow Up
          </Modal.Title>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </Modal.Header>

        {/* Body */}
        <Modal.Body style={{ fontSize: "12px" }}>
          
          {/* Radio */}
          <Form.Check
            type="radio"
            label="Changes Required"
            defaultChecked
            className="mb-3"
          />

          {/* Top Inputs */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Control
                placeholder="Title"
                size="sm"
              />
            </Col>

            <Col md={4}>
              <Form.Control
                type="date"
                size="sm"
              />
            </Col>

            <Col md={4}>
              <Form.Control
                placeholder="To Do Reminder"
                size="sm"
              />
            </Col>
          </Row>

          {/* Assigned + Details */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "11px" }}
                >
                  Assigned To
                </Form.Label>

                <Form.Control
                 
                  size="sm"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "11px" }}
                >
                  Details
                </Form.Label>

                <Form.Control
                  as="textarea"
                  rows={1}
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Mark as done */}
          <Form.Check
            type="checkbox"
            label="Mark as done"
            className="mb-4"
          />

          {/* Submit */}
          <div className="text-end mb-3">
            <Button
              variant="danger"
              size="sm"
            >
              Submit
            </Button>
          </div>

             <Card> {/* Bottom Section */}
        <CardHeader
         className="bg-light p-2"
        >
          Update Proposal Status and Lead Quality
        </CardHeader>

     
          <CardBody>
          {/* Query Status */}
          <Form.Group className="mb-3">
            <Form.Label
              style={{ fontSize: "11px" }}
            >
              Query Status
            </Form.Label>

            <Form.Select size="sm">
              <option>Proposal Sent</option>
              <option>Changes Required</option>
              <option>Follow Up</option>
            </Form.Select>
          </Form.Group>

          {/* Lead Quality */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <span>Lead Quality</span>

            <Form.Check
              inline
              type="radio"
              label="No Status"
              name="lead"
            />

            <Form.Check
              inline
              type="radio"
              label="Hot"
              name="lead"
            />

            <Form.Check
              inline
              type="radio"
              label="Warm"
              name="lead"
            />

            <Form.Check
              inline
              type="radio"
              label="Cold"
              name="lead"
              defaultChecked
            />
          </div>

          {/* Bottom Submit */}
          <div className="text-end">
            <Button
              variant="danger"
              size="sm"
            >
              Submit
            </Button>
          </div>
          </CardBody>
        </Card>

        </Modal.Body>

      </Modal>
    </>
  );
};

export default TodoFollowupModal;

