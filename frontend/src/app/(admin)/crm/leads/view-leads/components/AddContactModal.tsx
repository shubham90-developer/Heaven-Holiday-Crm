import React from 'react'
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Button, Modal, Card, Form, Row, Col, CardHeader, NavItem, CardBody } from "react-bootstrap";
import AddVisaCountry from "../AddVisaCountry";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useCreateContactMutation } from "../../../../../../store/services/customerContactApi";

type AddContactModalProps = {
  onClose: () => void;
}
const AddContactModal = ({ onClose }: AddContactModalProps) => {
  const searchParams = useSearchParams();

  const leadId = searchParams.get("id");

  const leadModel =
    searchParams.get("leadModel") || "B2CLead";

  const [createContact, { isLoading }] =
    useCreateContactMutation();

  const [formData, setFormData] = useState({
    relation: "",
    crmLeadSource: "",
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    alternateEmail: "",
    mobileNumber: "",
    alternateMobile: "",
    country: "",
    state: "",
    city: "",
    pinZipCode: "",
    visaCountry: [],
  });

  const handleChange = (
    e: any
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {

      if (
        !formData.relation ||
        !formData.firstName ||
        !formData.mobileNumber ||
        !formData.country ||
        !formData.city
      ) {
        toast.error(
          "Please fill all required fields"
        );

        return;
      }

      const payload = {
        ...formData,

        leadId,

        leadModel,
      };

      const res = await createContact(
        payload
      ).unwrap();

      console.log(res);

      toast.success(
        "Contact created successfully"
      );

      onClose();

    } catch (error: any) {

      console.error(error);

      toast.error(
        error?.data?.message ||
        "Failed to create contact"
      );
    }
  };

  return (
    <>
      <Modal show={true} onHide={onClose} centered size='lg'>
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title style={{ fontSize: "14px" }}>
            Add Customer Contact
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
              <Col md={6} className='mb-2'>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Relation *
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="relation"
                  value={formData.relation}
                  onChange={handleChange}>
                  <option>Select</option>
                  <option value="self">Self</option>

                </Form.Select>
              </Col>

              <Col md={6} className='mb-2'>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  CRM Lead Source
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} name="crmLeadSource"
                  value={formData.crmLeadSource}
                  onChange={handleChange}>
                  <option>Select</option>
                  <option value="Website">Website</option>
                  <option value="Agency">Agency</option>
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
                  value={formData.salutation}
                  onChange={handleChange}>
                  <option>Select</option>
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
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="firstName"
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
                <Form.Control size="sm" style={{ fontSize: "12px" }} name="lastName"
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
                  value={formData.country}
                  onChange={handleChange}>
                  <option>Select</option>
                  <option value="India">
                    India
                  </option>

                  <option value="Iceland">
                    Iceland
                  </option>
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

            <Row>
             <Col md={6}>
                            <Form.Label
                              className="text-primary"
                              style={{ fontSize: "12px" }}
                            >
                              State
                            </Form.Label>
            
            
                            <Form.Control size="sm" style={{ fontSize: "12px" }} />
            
                          </Col>



             <Col md={6} className="mb-2">
                            <Form.Label
                              className="text-primary"
                              style={{ fontSize: "12px" }}
                            >
                              Address
                            </Form.Label>
                            <Form.Control size="sm" style={{ fontSize: "12px" }} />
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
              />
            </Col>
            
            <Col md={6} className="mb-2">
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >
                Marital Status
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "12px" }}>
                <option>Select Status</option>
                <option>Married</option>
                <option>Unmarried</option>
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
              />
            </Col>
            
            <Col md={6} className="mb-2">
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >
                Food Preference
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "12px" }}>
                <option>Select Food Preference</option>
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Vegan</option>
                <option>Jain</option>
                <option>Eggetarian</option>
              </Form.Select>
            </Col>
            
            
                          <Col md={6} className="mb-2">
                            <Form.Label
                              className="text-primary"
                              style={{ fontSize: "12px" }}
                            >
                              Passport Number
                            </Form.Label>
                            <Form.Control size="sm" style={{ fontSize: "12px" }} />
                          </Col>
            
                          <Col md={6} className="mb-2">
                            <Form.Label
                              className="text-primary"
                              style={{ fontSize: "12px" }}
                            >
                              Passport Expiry Date
                            </Form.Label>
                            <Form.Control size="sm" style={{ fontSize: "12px" }} />
                          </Col>
            
                       
                          <Col md={6} className="mb-2">
                            <Form.Label
                              className="text-primary"
                              style={{ fontSize: "12px" }}
                            >
                              Date of Birth
                            </Form.Label>
                            <Form.Control size="sm" style={{ fontSize: "12px" }} />
                          </Col>
            
                          <Col md={6} className="mb-2">
                            <Form.Label
                              className="text-primary"
                              style={{ fontSize: "12px" }}
                            >
                              Marriage Anniversary
                            </Form.Label>
                            <Form.Control size="sm" style={{ fontSize: "12px" }} />
                          </Col>
            
                          <AddVisaCountry/>
            
                          <Col md={6} className='mb-2'>
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >
                Customer Category
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "12px" }}>
                <option>Select</option>
                <option>Regular</option>
                <option>Premium</option>
                <option>VIP</option>
                <option>Corporate</option>
              </Form.Select>
            </Col>
            
            <Col md={6} className='mb-2'>
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >
                Seat Preference
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "12px" }}>
                <option>Select</option>
                <option>Window</option>
                <option>Aisle</option>
                <option>Middle</option>
              </Form.Select>
            </Col>
            
            <Col md={6} className='mb-2'>
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >
                Company Name
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "12px" }} />
            </Col>
            
            <Col md={6} className='mb-2'>
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >
                GST Number
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "12px" }} />
            </Col>
            
            <Col md={6} className='mb-2'>
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >
                Pan Card
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "12px" }} />
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
              />
            </Col>      

</Row>
         {/*   <AddVisaCountry visaCountry={formData.visaCountry}
              setFormData={setFormData} /> */}

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
              ? "Submitting..."
              : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddContactModal
