"use client";

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "react-bootstrap";
import AddContactModal from "./AddContactModal";
import AddBankModal from "./AddBankModule";
import { useCreateSupplierMutation } from "@/store/services/supplierApi";
import { useGetContactsQuery } from "@/store/services/supplierContactApi";
import { useGetBanksQuery, useDeleteBankMutation } from "@/store/services/supplierBankApi";
import toast from "react-hot-toast";

const currencies = [
  { code: "INR", label: "Indian Rupee (INR)" },
  { code: "USD", label: "US Dollar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "GBP", label: "British Pound (GBP)" },
  { code: "AED", label: "UAE Dirham (AED)" },
  { code: "AUD", label: "Australian Dollar (AUD)" },
  { code: "CAD", label: "Canadian Dollar (CAD)" },
  { code: "SGD", label: "Singapore Dollar (SGD)" },
  { code: "JPY", label: "Japanese Yen (JPY)" },
  { code: "CNY", label: "Chinese Yuan (CNY)" },
];

interface FormDataType {
  companyName: string;
  currencyType: string;
  gst: boolean;
  panNumber: string;
  salutation: string;
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  city: string;
  city2: string;
  category: string;
  services: string;
  comments: string;
  destinationOffered: string[];
}

const AddSupplier = () => {
  const [step, setStep] = useState(1);
  // RTK Mutation
  const [createSupplier, { isLoading, isSuccess, isError, error }] = useCreateSupplierMutation();
  const { data: contactsData } = useGetContactsQuery(null);
  const { data: bankData } = useGetBanksQuery(null);
  const [deleteBank, { isLoading: deletingBank }] = useDeleteBankMutation();

  console.log(contactsData);
  console.log(bankData);
  // Form state
  const [formData, setFormData] = useState<FormDataType>({
    companyName: "",
    currencyType: "",
    gst: false,
    panNumber: "",
    salutation: "Mr.",
    firstName: "",
    lastName: "",
    designation: "",
    email: "",
    mobileNumber: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    city2: "",
    category: "",
    services: "",
    comments: "",
    destinationOffered: [],
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" || type === "radio") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const payload = {
      companyName: formData.companyName,
      currencyType: formData.currencyType,
      gstRegister: formData.gst,
      panNumber: formData.panNumber,
      salutation: formData.salutation,
      firstName: formData.firstName,
      lastName: formData.lastName,
      designation: formData.designation,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      addressLine1: formData.addressLine1,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      comments: formData.comments,
      category: formData.category,
      services: formData.services,
      destinationOffered: formData.destinationOffered
    };

    try {
      await createSupplier(payload).unwrap();
      toast.success("Supplier created successfully!");
      // reset form...
    } catch (err) {
      toast.error("Failed to create supplier. Please try again.");
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          {" "}
          {/* STEP TABS */}
          <div className="d-flex gap-2 mb-0">
            {[1, 2, 3].map((item) => (
              <Button
                key={item}
                size="sm"
                onClick={() => setStep(item)}
                style={{
                  fontSize: "10px",
                  background: step === item ? "#0d6efd" : "#fff",
                  color: step === item ? "#fff" : "#000",
                  border: "1px solid #0d6efd",
                }}
              >
                {item === 1 && "1 Overview"}
                {item === 2 && "2 Contacts"}
                {item === 3 && "3 Bank"}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardBody>
          <div>
            {/* BODY */}
            <div>
              {/* ================= STEP 1 ================= */}
              {step === 1 && (
                <Form>
                  {/* Company + Currency + GST + PAN */}
                  <Row className="mb-2">
                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Company Name *
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange} />
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Currency Type *
                      </Form.Label>

                      <Form.Select size="sm" style={{ fontSize: "12px" }}
                        name="currencyType"
                        value={formData.currencyType}
                        onChange={handleChange}>
                        <option value="">Select</option>

                        {currencies.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col md={3} className="">
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="me-2 mt-3 text-primary"
                      >
                        GST Register :
                      </Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="radio"
                          label="Yes"
                          name="gst"
                          className="me-2"
                          style={{ fontSize: "12px" }}
                          checked={formData.gst === true}
                          onChange={() => setFormData({ ...formData, gst: true })}
                        />
                        <Form.Check
                          type="radio"
                          label="No"
                          name="gst"
                          style={{ fontSize: "12px" }}
                          checked={formData.gst === false}
                          onChange={() => setFormData({ ...formData, gst: false })}
                        />
                      </div>
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        PAN Number
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange} />
                    </Col>
                  </Row>

                  {/* Name Section */}
                  <Row className="mb-2">
                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Salutation
                      </Form.Label>
                      <Form.Select size="sm" style={{ fontSize: "12px" }}
                        name="salutation"
                        value={formData.salutation}
                        onChange={handleChange}>
                        <option>Select</option>
                        <option>Mr.</option>
                        <option>Ms.</option>
                        <option>Mrs.</option>
                        <option>Miss</option>
                        <option>Dr.</option>
                      </Form.Select>
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        First Name *
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange} />
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Last Name
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange} />
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Designation
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange} />
                    </Col>
                  </Row>

                  {/* Email + Mobile + Address */}
                  <Row className="mb-2">
                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Email *
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="email"
                        value={formData.email}
                        onChange={handleChange} />
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Mobile Number *
                      </Form.Label>
                      <div className="d-flex gap-1">
                        <Form.Control
                          value="+91"
                          readOnly
                          size="sm"
                          style={{ width: "30%", fontSize: "12px" }}
                        />
                        <Form.Control size="sm" style={{ fontSize: "12px" }}
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange} />
                      </div>
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Address Line 1
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange} />
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Address Line 2
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange} />
                    </Col>
                  </Row>

                  {/* Location */}
                  <Row className="mb-2">
                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Country *
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="country"
                        value={formData.country}
                        onChange={handleChange} />
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        State
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="state"
                        value={formData.state}
                        onChange={handleChange} />
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        City *
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="city"
                        value={formData.city}
                        onChange={handleChange} />
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Other Location : City
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="city2"
                        value={formData.city2}
                        onChange={handleChange} />
                    </Col>
                  </Row>

                  {/* Category + Services + Comments */}
                  <Row className="mb-2">
                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Category *
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="category"
                        value={formData.category}
                        onChange={handleChange} />
                    </Col>

                    <Col md={3}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Services *
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="services"
                        value={formData.services}
                        onChange={handleChange} />
                    </Col>

                    <Col md={6}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Comments
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        style={{ fontSize: "12px" }}
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>

                  {/* Destination Offered */}
                  <hr />

                  <h6 style={{ fontSize: "12px" }}>Destination Offered</h6>

                  <Row>
                    <Col md={4}>
                      <Form.Label
                        style={{ fontSize: "10px" }}
                        className="text-primary"
                      >
                        Expertise In (Geography) : Destinations *
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }}
                        name="destinationOffered"
                        value={formData.destinationOffered.join(", ")}
                        onChange={(e) => {
                          const val = e.target.value
                            .split(",")
                            .map((d) => d.trim())
                            .filter((d) => d); // remove empty strings
                          setFormData({ ...formData, destinationOffered: val });
                        }} />
                    </Col>
                  </Row>
                </Form>
              )}

              {/* ================= STEP 2 ================= */}
              {step === 2 && (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <h6>Supplier Contacts</h6>
                    <AddContactModal />
                  </div>

                  <table className="table table-bordered table-sm">
                    <thead style={{ fontSize: "12px" }}>
                      <tr>
                        <th>Contact Person</th>
                        <th>Designation</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "12px" }}>
                      {contactsData?.data?.map((contact: any) => (
                        <tr key={contact._id}>
                          <td>
                            {contact.salutation} {contact.firstName} {contact.lastName}
                          </td>
                          <td>{contact.designation}</td>
                          <td>{contact.email}</td>
                          <td>{contact.mobileNumber}</td>
                          <td>
                            <Button size="sm" variant="success">
                              <Icon icon="mdi:eye-outline" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* ================= STEP 3 ================= */}
              {step === 3 && (
                <>
                  <div className="d-flex justify-content-between mb-2">
                    <h6>Supplier Bank</h6>
                    <AddBankModal />
                  </div>

                  <table className="table table-bordered table-sm">
                    <thead style={{ fontSize: "10px" }}>
                      <tr>
                        <th>Account Name</th>
                        <th>Account Number</th>
                        <th>Bank Name</th>
                        <th>IFSC Code</th>
                        <th>Primary</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "10px" }}>
                      {(bankData?.data || bankData || []).map((bank: any) => (
                        <tr key={bank._id}>
                          <td>{bank.accountName}</td>
                          <td>{bank.accountNumber}</td>
                          <td>{bank.bankName}</td>
                          <td>{bank.ifscCode}</td>
                          <td>{bank.isPrimary ? "Yes" : "No"}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="danger"
                              disabled={deletingBank}
                              onClick={() => {
                                toast((t) => (
                                  <div>
                                    <p className="mb-2" style={{ fontSize: "13px" }}>
                                      Are you sure you want to delete this bank?
                                    </p>
                                    <div className="d-flex gap-2">
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => {
                                          deleteBank(bank._id);
                                          toast.dismiss(t.id);
                                          toast.success("Bank deleted successfully");
                                        }}
                                      >
                                        Yes, Delete
                                      </button>
                                      <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => toast.dismiss(t.id)}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ), { duration: Infinity }); // stays until user acts
                              }}
                            >
                              <Icon icon="mdi:trash-can-outline" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </CardBody>
        <CardFooter>
          {/* FOOTER */}
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="outline-danger"
              size="sm"
              style={{ fontSize: "10px" }}
            >
              Cancel
            </Button>

            <div>
              {step > 1 && (
                <Button
                  size="sm"
                  className="me-2"
                  onClick={() => setStep(step - 1)}
                  style={{ fontSize: "10px" }}
                >
                  Back
                </Button>
              )}

              {step < 3 ? (
                <Button
                  size="sm"
                  onClick={() => setStep(step + 1)}
                  style={{ fontSize: "10px" }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="success"
                  style={{ fontSize: "10px" }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Finish"}
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default AddSupplier;
