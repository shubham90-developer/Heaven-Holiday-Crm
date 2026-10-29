"use client";

import { useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useCreateQuickSupplierMutation } from "@/store/services/supplierApi";

const SERVICE_OPTIONS = [
  "Packages",
  "Hotels",
  "Visa",
  "Flights",
  "Transfer",
  "Sightseeing",
];

type AddSupplierPopupProps = {
  show: boolean;
  onHide: () => void;
  destination?: string;
  onCreated: (supplierId: string) => void;
};

const emptyForm = {
  companyName: "",
  salutation: "Mr.",
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  country: "India",
  state: "",
  city: "",
  category: "Packages",
  services: ["Packages"] as string[],
};

const AddSupplierPopup = ({
  show,
  onHide,
  destination,
  onCreated,
}: AddSupplierPopupProps) => {
  const [createQuickSupplier, { isLoading }] = useCreateQuickSupplierMutation();
  const [form, setForm] = useState(emptyForm);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (service: string) => {
    setForm((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((item) => item !== service)
          : [...prev.services, service],
      };
    });
  };

  const resetAndClose = () => {
    setForm(emptyForm);
    onHide();
  };

  const handleSubmit = async () => {
    if (!form.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!form.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!form.mobileNumber.trim()) {
      toast.error("Mobile number is required");
      return;
    }
    if (!form.country.trim() || !form.city.trim()) {
      toast.error("Country and city are required");
      return;
    }
    if (!form.services.length) {
      toast.error("Select at least one service");
      return;
    }

    try {
      const created = await createQuickSupplier({
        companyName: form.companyName.trim(),
        salutation: form.salutation,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        country: form.country.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        category: form.category.trim() || "Packages",
        services: form.services.join(", "),
        destinationOffered: destination ? [destination] : [],
      }).unwrap();

      const supplierId = created?.data?._id;
      toast.success("Supplier added successfully");
      if (supplierId) onCreated(supplierId);
      setForm(emptyForm);
      onHide();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add supplier");
    }
  };

  return (
    <Modal show={show} onHide={resetAndClose} centered size="lg" contentClassName="enquiry-supplier-package">
      <Modal.Header closeButton className="esp-modal-header">
        <Modal.Title>Add Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-2">
          <Col md={6}>
            <label className="esp-field-label">Company Name *</label>
            <Form.Control
              className="esp-field-input"
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
          </Col>
          <Col md={6}>
            <label className="esp-field-label">Category</label>
            <Form.Select
              className="esp-field-input"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="Packages">Packages</option>
              <option value="Hotels">Hotels</option>
              <option value="Visa">Visa</option>
              <option value="Flights">Flights</option>
              <option value="Transport">Transport</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <label className="esp-field-label">Salutation</label>
            <Form.Select
              className="esp-field-input"
              value={form.salutation}
              onChange={(e) => handleChange("salutation", e.target.value)}
            >
              <option>Mr.</option>
              <option>Ms.</option>
              <option>Mrs.</option>
              <option>Miss</option>
              <option>Dr.</option>
            </Form.Select>
          </Col>
          <Col md={5}>
            <label className="esp-field-label">First Name *</label>
            <Form.Control
              className="esp-field-input"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </Col>
          <Col md={4}>
            <label className="esp-field-label">Last Name</label>
            <Form.Control
              className="esp-field-input"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </Col>
          <Col md={6}>
            <label className="esp-field-label">Email *</label>
            <Form.Control
              className="esp-field-input"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Col>
          <Col md={6}>
            <label className="esp-field-label">Mobile Number *</label>
            <Form.Control
              className="esp-field-input"
              value={form.mobileNumber}
              onChange={(e) => handleChange("mobileNumber", e.target.value)}
            />
          </Col>
          <Col md={4}>
            <label className="esp-field-label">Country *</label>
            <Form.Control
              className="esp-field-input"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
          </Col>
          <Col md={4}>
            <label className="esp-field-label">State</label>
            <Form.Control
              className="esp-field-input"
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </Col>
          <Col md={4}>
            <label className="esp-field-label">City *</label>
            <Form.Control
              className="esp-field-input"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </Col>
          <Col md={12}>
            <label className="esp-field-label">Services *</label>
            <div className="esp-service-options">
              {SERVICE_OPTIONS.map((service) => (
                <Form.Check
                  key={service}
                  inline
                  type="checkbox"
                  id={`esp-service-${service}`}
                  label={service}
                  checked={form.services.includes(service)}
                  onChange={() => toggleService(service)}
                />
              ))}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="esp-preview-btn" onClick={resetAndClose}>
          Cancel
        </button>
        <button
          type="button"
          className="esp-send-btn"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Supplier"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSupplierPopup;
