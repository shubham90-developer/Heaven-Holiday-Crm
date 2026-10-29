import React from 'react'
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import AddVisaCountry from './AddVisaCountry';
import { useUpdateB2CLeadMutation } from '@/store/services/b2cLeadApi';
import toast from "react-hot-toast";

const EditB2CCustomerModal = ({ lead }: { lead: any }) => {
  const [show, setShow] = useState(false);
  const [updateB2CLead, { isLoading, isSuccess, isError, error }] = useUpdateB2CLeadMutation();

  const [formData, setFormData] = useState({
    relation: "",
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    alternateEmail: "",
    mobile: "",
    alternateMobile: "",
    leadSource: "",
    dob: "",
    anniversary: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    addressLine: "",
    maritalStatus: "",
    kids: 0,
    passportNumber: "",
    passportExpiry: "",
    visaCountry: "",
    visaExpiry: "",
    companyName: "",
    gstNumber: "",
    panCard: "",
    food: "",
    seatPreference: "",
    category: "",
    tags: "",
    remarks: "",
  });

  useEffect(() => {
    if (lead && show) {
      setFormData({
        relation: lead.relation || "",      // add
        salutation: lead.salutation || "",
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        email: lead.email || "",
        alternateEmail: lead.alternateEmail || "",
        mobile: lead.mobile || "",
        alternateMobile: lead.alternateMobile || "",
        leadSource: lead.leadSource || "",
        dob: lead.dob?.split("T")[0] || "",
        anniversary: lead.anniversary?.split("T")[0] || "",
        country: lead.address?.country || "",
        state: lead.address?.state || "",
        city: lead.address?.city || "",
        pincode: lead.address?.pincode || "",
        addressLine: lead.address?.addressLine || "",
        maritalStatus: lead.personalInfo?.maritalStatus || "",
        kids: lead.personalInfo?.kids?.count ?? 0,
        passportNumber: lead.personalInfo?.passport?.passportNumber || "",
        passportExpiry: lead.personalInfo?.passport?.expiryDate?.split("T")[0] || "",
        visaCountry: lead.preferences?.visa?.country || "",
        visaExpiry: lead.preferences?.visa?.expiryDate?.split("T")[0] || "",
        companyName: lead.personalInfo?.companyName || "",
        gstNumber: lead.personalInfo?.gstNumber || "",
        panCard: lead.personalInfo?.panCard || "",
        food: lead.preferences?.food || "",
        seatPreference: lead.preferences?.seatPreference || "",
        category: lead.preferences?.category || "",
        tags: (lead.tags || []).join(", "),
        remarks: lead.remarks || "",        // ✅ add
      });
    }
  }, [lead, show]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateB2CLead({
        id: lead._id,
        salutation: (formData as any).salutation,
        firstName: (formData as any).firstName,
        lastName: (formData as any).lastName,
        email: (formData as any).email,
        alternateEmail: (formData as any).alternateEmail,
        mobile: (formData as any).mobile,
        alternateMobile: (formData as any).alternateMobile,
        leadSource: (formData as any).leadSource,
        dob: (formData as any).dob || undefined,
        anniversary: (formData as any).anniversary || undefined,
        address: {
          country: (formData as any).country,
          state: (formData as any).state,
          city: (formData as any).city,
          pincode: (formData as any).pincode,
          addressLine: (formData as any).addressLine,
        },
        personalInfo: {
          maritalStatus: (formData as any).maritalStatus,
          kids: { count: Number((formData as any).kids) },
          passport: {
            passportNumber: (formData as any).passportNumber,
            expiryDate: (formData as any).passportExpiry || undefined,
            hasPassport: !!(formData as any).passportNumber,
          },
          companyName: (formData as any).companyName,
          gstNumber: (formData as any).gstNumber,
          panCard: (formData as any).panCard,
        },
        preferences: {
          food: (formData as any).food,
          seatPreference: (formData as any).seatPreference,
          category: (formData as any).category,
          visa: {
            country: formData.visaCountry || undefined,
            expiryDate: formData.visaExpiry || undefined,
            hasVisa: !!formData.visaCountry,
          },
        },
        tags: (formData as any).tags,
        remarks: formData.remarks,
      }).unwrap();
      toast.success("Customer Profile edited successfully");
      setShow(false);

    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Could not save customer profile changes");
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

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Relation *
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="relation" value={formData.relation} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="self">Self</option>

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
                  <option value="website">Website</option>
                  <option value="agency">Agency</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Salutation *
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="salutation" value={formData.salutation} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Miss">Miss</option>
                  <option value="Mrs.">Mrs.</option>

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

              <Col md={6} className="mb-2">
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

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Date of Birth
                </Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  style={{ fontSize: "12px" }}
                  name="dob" value={formData.dob} onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Marital Status
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="Married">Married</option>
                  <option value="Unmarried">Unmarried</option>
                </Form.Select>
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Marriage Anniversary
                </Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  style={{ fontSize: "12px" }}
                  name="anniversary" value={formData.anniversary} onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  No. of Kids
                </Form.Label>
                <Form.Control
                  type="number"
                  size="sm"
                  style={{ fontSize: "12px" }}
                  min="0"
                  name="kids" value={formData.kids} onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Food Preference
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="food" value={formData.food} onChange={handleChange}>
                  <option value="">Select Food Preference</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain</option>
                  <option value="Eggetarian">Eggetarian</option>
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
                  Visa country
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="visaCountry" value={formData.visaCountry} onChange={handleChange} />
              </Col>

              <Col md={6} className="mb-2">
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Visa Expiry date
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="visaExpiry" value={formData.visaExpiry} onChange={handleChange} />
              </Col>

              <AddVisaCountry/>

              <Col md={6} className='mb-2'>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Customer Category
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                  <option value="Corporate">Corporate</option>
                </Form.Select>
              </Col>

              <Col md={6} className='mb-2'>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Seat Preference
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="seatPreference" value={formData.seatPreference} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Window">Window</option>
                  <option value="Aisle">Aisle</option>
                  <option value="Middle">Middle</option>
                </Form.Select>
              </Col>

              <Col md={6} className='mb-2'>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Company Name
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="companyName" value={formData.companyName} onChange={handleChange} />
              </Col>

              <Col md={6} className='mb-2'>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  GST Number
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
              </Col>

              <Col md={6} className='mb-2'>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Pan Card
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="panCard" value={formData.panCard} onChange={handleChange} />
              </Col>

              <Col md={6} className='mb-2'>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Tags
                </Form.Label>
                <Form.Control
                  size="sm"
                  style={{ fontSize: "12px" }}
                  placeholder="Enter tags"
                  name="tags" value={formData.tags} onChange={handleChange}
                />
              </Col>

              <Col md={12}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Remarks
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  style={{ fontSize: "12px" }}
                  placeholder="Enter remarks"
                  name="remarks" value={formData.remarks} onChange={handleChange}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
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
                : <> Submit</>}
            </Button>
          </Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EditB2CCustomerModal