"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
// import AddVisaCountry from "./AddVisaCountry";
import { useUpdateB2BLeadMutation } from "../../../../../store/services/b2bLeadApi";
import toast from 'react-hot-toast';

const EditCustomerModal = ({ lead }: { lead: any }) => {
  const [show, setShow] = useState(false);
  const [updateB2BLead, { isLoading, isError, error }] = useUpdateB2BLeadMutation();

  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    alternateEmail: "",
    mobile: "",
    alternateMobile: "",
    country: "",
    state: "",
    city: "",
    area: "",
    pincode: "",
    addressLine: "",
    relation: "",
    leadSource: "",
    passportNumber: "",
    passportExpiry: "",
    dob: "",
    anniversary: "",
  });

  useEffect(() => {
    if (lead && show) {
      setFormData({
        salutation: lead.salutation || "",
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        email: lead.email || "",
        alternateEmail: lead.alternateEmail || "",
        mobile: lead.mobile || "",
        alternateMobile: lead.alternateMobile || "",
        country: lead.address?.country || "",
        state: lead.address?.state || "",
        city: lead.address?.city || "",
        area: lead.address?.area || "",
        pincode: lead.address?.pincode || "",
        addressLine: lead.address?.addressLine || "",
        relation: lead.personalInfo?.relation || "",
        leadSource: lead.leadSource || "",
        passportNumber: lead.personalInfo?.passport?.passportNumber || "",
        passportExpiry: lead.personalInfo?.passport?.expiryDate?.split("T")[0] || "",
        dob: lead.personalInfo?.dob?.split("T")[0] || "",
        anniversary: lead.personalInfo?.anniversary?.split("T")[0] || "",
      });
    }
  }, [lead, show]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!lead?._id) return;
    try {
      await updateB2BLead({
        id: lead._id,
        salutation: formData.salutation,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        alternateEmail: formData.alternateEmail,
        mobile: formData.mobile,
        alternateMobile: formData.alternateMobile,
        leadSource: formData.leadSource,
        address: {
          country: formData.country,
          state: formData.state,
          city: formData.city,
          area: formData.area,
          pincode: formData.pincode,
          addressLine: formData.addressLine,
        },
        personalInfo: {
          relation: formData.relation,
          dob: formData.dob || undefined,
          anniversary: formData.anniversary || undefined,
          passport: {
            passportNumber: formData.passportNumber,
            expiryDate: formData.passportExpiry || undefined,
            hasPassport: !!formData.passportNumber,
          },
        },
      }).unwrap();

      toast.success("B2B updated successfully");

      setShow(false);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Could not update B2B");
    }
  };


  return (
    <>
      <span className="text-danger edit-link"
        style={{ cursor: "pointer" }}
        onClick={() => setShow(true)}>Edit <Icon icon="mdi:pencil" /></span>
      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title style={{ fontSize: "14px" }}>
            Edit Customer Info
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
          <Form>
            <Row className="mb-2">

              <Col md={2}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Salutation *
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="salutation" value={formData.salutation} onChange={handleChange}>
                  <option>Select</option>
                  <option>Mr.</option>
                  <option>Ms.</option>
                  <option>Miss</option>
                  <option>Mrs.</option>

                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  First Name *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="firstName" value={formData.firstName} onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Last Name *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="lastName" value={formData.lastName} onChange={handleChange} />
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
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="email" value={formData.email} onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Alternate Email
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="alternateEmail" value={formData.alternateEmail} onChange={handleChange} />
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
                  <Form.Control size="sm" style={{ fontSize: "12px" }} name="mobile" value={formData.mobile} onChange={handleChange} />
                </div>
              </Col>
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Alternate Mobile
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} />
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
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="country" value={formData.country} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="India">India</option>
                  <option value="Iceland">Iceland</option>
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  State
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="state" value={formData.state} onChange={handleChange} />
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
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="city" value={formData.city} onChange={handleChange} />
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Pin/Postal Code
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="pincode" value={formData.pincode} onChange={handleChange} />
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Address
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="addressLine" value={formData.addressLine} onChange={handleChange} />
              </Col>


              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Relation *
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="relation" value={formData.relation} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Self">Self</option>
                </Form.Select>
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  CRM Lead Source
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="leadSource" value={formData.leadSource} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Website">Website</option>
                  <option value="Agency">Agency</option>
                </Form.Select>
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Passport Number
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="passportNumber" value={formData.passportNumber} onChange={handleChange} />
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Passport Expiry Date
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="passportExpiry" value={formData.passportExpiry} onChange={handleChange} />
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Date of Birth
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="dob" value={formData.dob} onChange={handleChange} />
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Marriage Anniversary
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="anniversary" value={formData.anniversary} onChange={handleChange} />
              </Col>
            </Row>
            {/*}   <AddVisaCountry visaCountry={formData.visaCountry}
              setFormData={setFormData} /> */}

          </Form>
        </Modal.Body>

        {/* FOOTER */}
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setShow(false)}
            style={{ fontSize: "12px" }}
          >
            Cancel
          </Button>

          <Button variant="success" size="sm" style={{ fontSize: "12px" }} onClick={handleSubmit} disabled={isLoading}>
            <Icon icon="akar-icons:check" className="me-1" />
            {isLoading
              ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
              : <>Submit</>}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditCustomerModal;
