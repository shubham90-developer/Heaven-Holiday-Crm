import React from 'react'
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Button, Modal, Card, Form, Row, Col, CardHeader, NavItem, CardBody } from "react-bootstrap";
import AddVisaCountry from "../AddVisaCountry";
import {
  useUpdateContactMutation,
} from "../../../../../../store/services/customerContactApi";
import toast from "react-hot-toast";

type EditContactModalProps = {
  onClose: () => void;
  contact: any;
}
const EditContactModal = ({ onClose, contact }: EditContactModalProps) => {

  const [updateContact, { isLoading }] =
    useUpdateContactMutation();

  const [formData, setFormData] = useState({
    relation: contact?.relation || "",

    crmLeadSource:
      contact?.crmLeadSource || "",

    salutation:
      contact?.salutation || "",

    firstName:
      contact?.firstName || "",

    lastName:
      contact?.lastName || "",

    email:
      contact?.email || "",

    alternateEmail:
      contact?.alternateEmail || "",

    mobileNumber:
      contact?.mobileNumber || "",

    alternateMobile:
      contact?.alternateMobile || "",

    country:
      contact?.country || "",

    state:
      contact?.state || "",

    city:
      contact?.city || "",

    pinZipCode:
      contact?.pinZipCode || "",
  });

  const handleChange = (e: any) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async () => {

    try {

      await updateContact({
        contactId: contact?._id,

        body: formData,
      }).unwrap();

      toast.success(
        "Contact updated successfully"
      );

      onClose();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to update contact"
      );
    }
  };

  return (
    <>
      <Modal show={true} onHide={onClose} size='lg' centered>
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title style={{ fontSize: "14px" }}>
            Edit Customer Contact
          </Modal.Title>

          <button
            onClick={onClose}
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
          <Form>
            <Row className="mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Relation *
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="relation"
                  value={formData.relation}
                  onChange={handleChange}>
                  <option value="">
                    Select
                  </option>

                  <option value="Self">
                    Self
                  </option>

                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  CRM Lead Source
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="crmLeadSource"
                  value={
                    formData.crmLeadSource
                  }
                  onChange={handleChange}>
                  <option value="">
                    Select
                  </option>

                  <option value="Website">
                    Website
                  </option>

                  <option value="Agency">
                    Agency
                  </option>
                </Form.Select>
              </Col>


              <Col md={2}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Salutation *
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="salutation"
                  value={
                    formData.salutation
                  }
                  onChange={handleChange}>
                  <option value="">
                    Select
                  </option>

                  <option value="Mr.">
                    Mr.
                  </option>

                  <option value="Ms.">
                    Ms.
                  </option>

                  <option value="Miss">
                    Miss
                  </option>

                  <option value="Mrs.">
                    Mrs.
                  </option>

                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  First Name *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="firstName"
                  value={
                    formData.firstName
                  }
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Last Name *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="lastName"
                  value={
                    formData.lastName
                  }
                  onChange={handleChange} />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Email
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="email"
                  value={formData.email}
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Alternate Email
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="alternateEmail"
                  value={
                    formData.alternateEmail
                  }
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >Mobile Number *</Form.Label>
                <div className="d-flex gap-2" style={{ fontSize: "12px" }}>
                  <Form.Control
                    value="+91"
                    readOnly
                    size="sm"
                    style={{ width: "30%" }} />
                  <Form.Control size="sm" style={{ fontSize: "12px" }} name="mobileNumber"
                    value={
                      formData.mobileNumber
                    }
                    onChange={handleChange} />
                </div>
              </Col>
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Alternate Mobile
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="alternateMobile"
                  value={
                    formData.alternateMobile
                  }
                  onChange={handleChange} />
              </Col>
            </Row>


            <Row className="mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Country *
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="country"
                  value={
                    formData.country
                  }
                  onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="India">India.</option>
                  <option value="Iceland">Icland.</option>
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  State
                </Form.Label>


                <Form.Control size="sm" style={{ fontSize: "12px" }} name="state"
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
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="city"
                  value={formData.city}
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Pin/Zip Code
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="pinZipCode"
                  value={
                    formData.pinZipCode
                  }
                  onChange={handleChange} />
              </Col>
            </Row>
            <AddVisaCountry />

          </Form>
        </Modal.Body>

        {/* FOOTER */}
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={onClose}
            style={{ fontSize: "12px" }}
          >
            Cancel
          </Button>

          <Button variant="success" size="sm" style={{ fontSize: "12px" }} onClick={handleSubmit}
            disabled={isLoading}>
            <Icon icon="akar-icons:check" className="me-1" />
            {isLoading
              ? "Updating..."
              : "Update"}
          </Button>
        </Modal.Footer>
      </Modal >
    </>
  )
}

export default EditContactModal
