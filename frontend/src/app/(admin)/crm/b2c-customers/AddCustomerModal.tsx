"use client";

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import { useCreateB2CLeadMutation } from "@/store/services/b2cLeadApi";
import toast from "react-hot-toast";

const leadSources = [
  { value: "4513", label: "Agency" },
  { value: "4514", label: "Website" },
  { value: "4515", label: "Facebook" },
  { value: "4516", label: "Tripsgateway" },
  { value: "4517", label: "Website B2B" },
  { value: "4518", label: "Proposal" },
  { value: "4519", label: "GTX Network" },
  { value: "4520", label: "GTX Network Web" },
  { value: "6888", label: "Instagram" },
  { value: "8412", label: "Old Customer" },
  { value: "8413", label: "Reference" },
  { value: "8414", label: "Walk-in" },
  { value: "8569", label: "RAJ SIR" },
  { value: "8570", label: "My Old Client" },
  { value: "8571", label: "Raj Sir Facebook" },
  { value: "8572", label: "3700" },
  { value: "8573", label: "AHH" },
  { value: "9102", label: "Expo Belavagi" },
  { value: "9116", label: "Expo Kolhapur" },
  { value: "9117", label: "Expo Sangli" },
  { value: "9288", label: "PUNE EXPO" },
  { value: "9345", label: "PRANAV SIR" },
  { value: "9346", label: "PRAJWAL SIR" },
  { value: "9347", label: "SANKET SIR" },
  { value: "9348", label: "SAIPRASAD SIR" },
  { value: "9349", label: "JUST DIAL" },
  { value: "9813", label: "KASTURI GROUP" },
  { value: "9817", label: "Pune Expo Jan 2026" },
  { value: "9917", label: "Varsha Bugade" },
  { value: "9940", label: "PRANEETA BUGADE" },
  { value: "9954", label: "Sangli Agri Pandhari" },
];

const AddCustomerModal: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  // const [leadSource, setLeadSource] = useState<string>("");
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    salutation: "",
    firstName: "",
    lastName: "",
    leadSource: "",
    leadStage: "53", // default = New
  });

  const [createLead, { isLoading }] = useCreateB2CLeadMutation();

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => setShow(true);

  const resetForm = () => {
    setFormData({
      email: "",
      mobile: "",
      salutation: "",
      firstName: "",
      lastName: "",
      leadSource: "",
      leadStage: "53",
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.email || !formData.mobile || !formData.firstName) {
      toast.error("Please fill required fields!");
      return;
    }

    try {
      await createLead({
        email: formData.email,
        mobile: formData.mobile,
        salutation: formData.salutation,
        firstName: formData.firstName,
        lastName: formData.lastName,
        leadSource: formData.leadSource,
        leadStage: formData.leadStage,
      }).unwrap();

      toast.success("Lead created successfully ✅");
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create lead ❌");
    }
  };

  return (
    <>
      {/* BUTTON */}
      <Button
        variant="outline-danger"
        size="sm"
        style={{ fontSize: "10px", fontWeight: "bold" }}
        onClick={handleShow}
      >
        <Icon icon="mdi:account-plus" className="me-1" /> Add customer
      </Button>

      {/* MODAL */}
      <Modal show={show} onHide={handleClose} centered>
        {/* Header */}
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title>Add Lead</Modal.Title>

          <button
            onClick={handleClose}
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

        {/* BODY */}
        <Modal.Body>
          <Form>
            <Row className="g-1">
              {/* Email */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label
                    className="text-primary"
                    style={{ fontSize: "10px" }}
                  >
                    Email ID *
                  </Form.Label>
                  <Form.Control
                    type="email"
                    size="sm"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ fontSize: "10px", padding: "8px" }}
                  />
                </Form.Group>
              </Col>

              {/* Mobile */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label
                    className="text-primary"
                    style={{ fontSize: "10px" }}
                  >
                    Mobile Number *
                  </Form.Label>

                  <InputGroup size="sm" style={{ fontSize: "10px" }}>
                    <InputGroup.Text>🇮🇳 +91</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      style={{ fontSize: "10px", padding: "8px" }}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              {/* Salutation + First Name */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label
                    className="text-primary"
                    style={{ fontSize: "10px" }}
                  >
                    Salutation
                  </Form.Label>
                  <Form.Select
                    size="sm"
                    name="salutation"
                    value={formData.salutation}
                    onChange={handleChange}
                    style={{ fontSize: "10px", padding: "8px" }}
                  >
                    <option>Select</option>
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mrs.</option>
                    <option>Miss</option>
                    <option>Dr.</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label
                    className="text-primary"
                    style={{ fontSize: "10px" }}
                  >
                    First Name *
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ fontSize: "10px", padding: "8px" }}
                  />
                </Form.Group>
              </Col>

              {/* Last Name */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label
                    className="text-primary"
                    style={{ fontSize: "10px" }}
                  >
                    Last Name
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ fontSize: "10px", padding: "8px" }}
                  />
                </Form.Group>
              </Col>

              {/* Lead Source */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label
                    className="text-primary"
                    style={{ fontSize: "10px" }}
                  >
                    Lead Source
                  </Form.Label>
                  <Form.Select
                    size="sm"
                    name="leadSource"
                    value={formData.leadSource}
                    onChange={handleChange}
                    style={{ fontSize: "12px" }}
                  >
                    <option value="">Select Lead Source</option>

                    {leadSources.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Lead Stage */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label
                    className="text-primary"
                    style={{ fontSize: "10px" }}
                  >
                    Lead Stage
                  </Form.Label>
                  <Form.Select
                    size="sm"
                    name="leadStage"
                    value={formData.leadStage}
                    onChange={handleChange}
                    style={{ fontSize: "10px", padding: "8px" }}
                  >
                    <option value="">Select Stage</option>
                    <option value="Wrong Number">Wrong Number</option>
                    <option value="Can not be Contacted">Can not be Contacted</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Junk Lead">Junk Lead</option>
                    <option value="Lost Lead">Lost Lead</option>
                    <option value="Duplicate">Duplicate</option>
                    <option value="New">New</option>
                    <option value="Call Back">Call Back</option>
                    <option value="Destination Closed">Destination Closed</option>
                    <option value="Unanswered">Unanswered</option>
                    <option value="Not Reachable">Not Reachable</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        {/* FOOTER */}
        <Modal.Footer className="justify-content-between">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleClose}
            style={{ fontSize: "10px" }}
          >
            Cancel
          </Button>

          <Button variant="success" size="sm" onClick={handleSubmit}
            disabled={isLoading} style={{ fontSize: "10px" }}>
            <Icon icon="mdi:account-plus-outline" className="me-1" />
            {isLoading ? "Saving..." : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddCustomerModal;
