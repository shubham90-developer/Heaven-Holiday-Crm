"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useCreateContactMutation } from "@/store/services/supplierContactApi";
import toast from "react-hot-toast";

const AddContactModal = () => {
  const [show, setShow] = useState(false);

  // RTK Query mutation
  const [createContact, { isLoading }] = useCreateContactMutation();

  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    designation: "",
    department: "",
    email: "",
    mobileNumber: "",
    country: "",
    state: "",
    city: "",
    comments: "",
    destinations: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Required field validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobileNumber) {
      toast.error("Please fill in all required fields (*)");
      return;
    }

    try {
      await createContact({
        ...formData,
        // split destinations by comma if user inputs multiple
        destinations: formData.destinations.split(",").map((d) => d.trim()),
      }).unwrap();

      toast.success("Supplier contact created successfully!");
      setFormData({
        salutation: "",
        firstName: "",
        lastName: "",
        designation: "",
        department: "",
        email: "",
        mobileNumber: "",
        country: "",
        state: "",
        city: "",
        comments: "",
        destinations: "",
      });

      setShow(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create supplier contact");
    }
  };

  return (
    <>
      <Button
        size="sm"
        style={{ fontSize: "8px" }}
        onClick={() => setShow(true)}
      >
        <Icon icon="mdi:plus" className="me-1" /> Add
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title style={{ fontSize: "14px" }}>
            Add Supplier Contact
          </Modal.Title>

          <button
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

        {/* BODY */}
        <Modal.Body style={{ fontSize: "12px" }}>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
              <Col md={2}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Salutation *
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }}
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleChange}>
                  <option>Select</option>
                  <option>Mr.</option>
                  <option>Ms.</option>
                  <option>Miss</option>
                  <option>Mrs.</option>
                  <option>Dr.</option>
                </Form.Select>
              </Col>

              <Col md={4}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  First Name *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Last Name *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange} />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Designation
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Department
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="department"
                  value={formData.department}
                  onChange={handleChange} />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Email *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="email"
                  value={formData.email}
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Mobile Number *
                </Form.Label>
                <div className="d-flex gap-2" style={{ fontSize: "12px" }}>
                  <Form.Control
                    value="+91"
                    readOnly
                    size="sm"
                    style={{ width: "30%" }}
                  />
                  <Form.Control size="sm" style={{ fontSize: "12px" }}
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange} />
                </div>
              </Col>
            </Row>

            {/* SECTION HEADER */}
            <div
              style={{
                background: "#0f3d5e",
                color: "#fff",
                padding: "6px 10px",
                fontSize: "13px",
                marginTop: "10px",
              }}
            >
              Destination Manage
            </div>

            <Row className="mt-2 mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Country
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="country"
                  value={formData.country}
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  State
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="state"
                  value={formData.state}
                  onChange={handleChange} />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  City *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="city"
                  value={formData.city}
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Comments
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  size="sm"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  style={{ fontSize: "12px" }}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Expertise In (Geography) : Destinations *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="destinations"
                  value={formData.destinations}
                  onChange={handleChange} />
              </Col>
            </Row>

            <Modal.Footer className="d-flex justify-content-between">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setShow(false)}
                style={{ fontSize: "12px" }}
              >
                Cancel
              </Button>

              <Button type="submit" variant="success" size="sm" style={{ fontSize: "12px" }} disabled={isLoading}>
                <Icon icon="akar-icons:check" className="me-1" /> {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>

        {/* FOOTER */}
        {/* <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setShow(false)}
            style={{ fontSize: "12px" }}
          >
            Cancel
          </Button>

          <Button type="submit" variant="success" size="sm" style={{ fontSize: "12px" }} disabled={isLoading}>
            <Icon icon="akar-icons:check" className="me-1" /> {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default AddContactModal;
