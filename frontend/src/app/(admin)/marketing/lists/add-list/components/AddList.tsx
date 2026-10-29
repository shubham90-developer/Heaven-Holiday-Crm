"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";

const AddList = () => {
  const router = useRouter();

  const [listName, setListName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (!listName.trim()) {
      toast.error("Please enter a list name");
      return;
    }
    if (!fromEmail.trim() || !fromName.trim()) {
      toast.error("Please fill the required fields");
      return;
    }

    // TODO: call your create-list mutation here
    toast.success("List created");
    router.push("/marketing/lists");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Add List</h4>
        <Button variant="dark" size="sm" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Card className="p-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Label className="fw-semibold text-primary">
              List Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="List Name"
            />
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold text-primary">
              Default from email address<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="Default from email address"
            />
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold text-primary">
              Default from name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Default from name"
            />
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold text-primary">Company / organization</Form.Label>
            <Form.Control
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company / organization"
            />
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold text-primary">Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold text-primary">Zip / Postal code</Form.Label>
            <Form.Control
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="Zip / Postal code"
            />
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold text-primary">Phone</Form.Label>
            <Form.Control
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="outline-secondary" onClick={() => router.push("/marketing/lists")}>
            Cancel
          </Button>
          <Button style={{ background: "#f58220", border: "none" }} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Card>
    </>
  );
};

export default AddList;
