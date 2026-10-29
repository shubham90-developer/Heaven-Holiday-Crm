"use client";

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import { useCreateHotelMutation } from "../../../../../store/services/inventory/hotel/hotelApi";
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

const AddModal: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [leadSource, setLeadSource] = useState<string>("");
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const [createHotel, { isLoading }] = useCreateHotelMutation();

  // FORM STATE
  const [formData, setFormData] = useState({
    hotelName: "",
    cityName: "",
    contactEmail: "",
    countryCode: "+91",
    contactNo: "",
    starRating: "",
    propertyType: "Hotel",
    checkInTime: "11:00",
    checkOutTime: "12:00",
    weekend: {
      saturday: false,
      sunday: false,
    },
    roomType: "",
    childAge: 3,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // HANDLE CHANGE
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // CHECKBOX
  const handleCheckbox = (day: "saturday" | "sunday") => {
    setFormData((prev) => ({
      ...prev,
      weekend: {
        ...prev.weekend,
        [day]: !prev.weekend[day],
      },
    }));
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        starRating: formData.starRating
          ? Number(formData.starRating)
          : undefined,
        childAge: Number(formData.childAge),
      };

      await createHotel(payload).unwrap();

      toast.success("Hotel created successfully ✅");
      handleClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create hotel ❌");
    }
  };


  return (
    <>
      {/* BUTTON */}
      <Button
        variant="primary"
        size="sm"
        style={{ fontSize: "10px" }}
        onClick={handleShow}
      >
        <Icon icon="tabler:plus" width="12" /> Add Hotel
      </Button>

      {/* MODAL */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        {/* Header */}
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title>Add Hotel</Modal.Title>

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
            {/* Row 1 */}
            <Row className="mb-3" style={{ fontSize: "10px" }}>
              <Col>
                <Form.Label>Hotel Name *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter hotel name"
                  name="hotelName"
                  style={{ fontSize: "10px" }}
                  value={formData.hotelName}
                  onChange={handleChange}
                />
              </Col>

              <Col>
                <Form.Label>City Name *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city name"
                  name="cityName"
                  style={{ fontSize: "10px" }}
                  value={formData.cityName}
                  onChange={handleChange}
                />
              </Col>

              <Col>
                <Form.Label>Contact Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  style={{ fontSize: "10px" }}
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </Col>

              <Col md={2}>
                <Form.Label>Country Code</Form.Label>
                <Form.Select style={{ fontSize: "10px" }} value={formData.countryCode}
                  name="countryCode"
                  onChange={handleChange}>
                  <option>+91</option>
                  <option>+1</option>
                  <option>+44</option>
                </Form.Select>
              </Col>

              <Col>
                <Form.Label>Contact No.</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter contact number"
                  name="contactNo"
                  style={{ fontSize: "10px" }}
                  value={formData.contactNo}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            {/* Row 2 */}
            <Row className="mb-3" style={{ fontSize: "10px" }}>
              <Col>
                <Form.Label>Star Rating</Form.Label>
                <Form.Select style={{ fontSize: "10px" }} value={formData.starRating}
                  name="startRating"
                  onChange={handleChange}>
                  <option>Select Rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Star</option>
                  <option value="3">3 Star</option>
                  <option value="4">4 Star</option>
                  <option value="5">5 Star</option>
                </Form.Select>
              </Col>

              <Col>
                <Form.Label>Property Type *</Form.Label>
                <Form.Select style={{ fontSize: "10px" }} value={formData.propertyType}
                  name="propertyType"
                  onChange={handleChange}>
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                </Form.Select>
              </Col>

              <Col>
                <Form.Label>Check In Time</Form.Label>
                <Form.Control
                  type="time"
                  // defaultValue="11:00"
                  style={{ fontSize: "10px" }}
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleChange}
                />
              </Col>

              <Col>
                <Form.Label>Out Time</Form.Label>
                <Form.Control
                  type="time"
                  // defaultValue="12:00"
                  style={{ fontSize: "10px" }}
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            {/* Row 3 */}
            <Row className="mb-3" style={{ fontSize: "10px" }}>
              <Col md={4}>
                <Form.Label>Weekend</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Saturday"
                    type="checkbox"
                    name="saturday"
                    style={{ fontSize: "10px" }}
                    checked={formData.weekend.saturday}
                    onChange={() => handleCheckbox("saturday")}
                  />
                  <Form.Check
                    inline
                    label="Sunday"
                    type="checkbox"
                    style={{ fontSize: "10px" }}
                    name="sunday"
                    checked={formData.weekend.sunday}
                    onChange={() => handleCheckbox("sunday")}
                  />
                </div>
              </Col>

              <Col md={5}>
                <Form.Label>Room Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter room type"
                  style={{ fontSize: "10px" }}
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                />
              </Col>

              <Col md={3}>
                <Form.Label>Child Age</Form.Label>
                <Form.Select value={formData.childAge}
                  name="childAge"
                  onChange={handleChange}
                >
                  {[...Array(18)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-danger" style={{ fontSize: "10px" }}>
            Save & More
          </Button>
          <Button variant="danger" style={{ fontSize: "10px" }} onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddModal;
