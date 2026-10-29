"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

import Offcanvas from "react-bootstrap/Offcanvas";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import CustomFlatpickr from "@/components/CustomFlatpickr";
// import { useGetDriversQuery } from "@/store/services/inventory/vehicle/driver/driverApi";


function OffCanvasExample({ name, onApply }: any) {
  const [show, setShow] = useState(false);

  const initialState = {
    driverName: "",
    mobileNumber: "",
    email: "",
    country: "",
    city: "",
  };

  const [filters, setFilters] = useState(initialState);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e: any) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // APPLY FILTER
  const handleFilter = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, v]) => v?.toString().trim() !== ""
      )
    );

    onApply(cleanFilters);
    handleClose();
  };

  // RESET FILTER
  const handleReset = () => {
    setFilters(initialState);
    onApply(initialState); // 🔥 important fix
    handleClose();
  };

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={handleShow}
        className="me-2"
        size="sm"
        style={{ fontSize: "10px", fontWeight: "bold" }}
      >
        <Icon icon="tabler:filter" width="12" /> {name}
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{ width: "900px" }}
      >
        <Offcanvas.Header
          style={{
            background: "#274c6b",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Offcanvas.Title>
            <Icon icon="tabler:filter" className="me-2" />
            Filter Results
          </Offcanvas.Title>

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
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Row className="g-2">
            {/* Destination*/}

            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Driver Name
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="driverName" value={filters.driverName}
                onChange={handleChange} />
            </Col>

            {/* Mobile No */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Mobile No
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="mobileNumber" value={filters.mobileNumber}
                onChange={handleChange} />
            </Col>

            {/* Email Id */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Email Id
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="email"
                value={filters.email}
                onChange={handleChange} />
            </Col>

            {/* Country */}
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Country
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} name="country"
                  value={filters.country}
                  onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* City */}
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  City
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} name="city"
                  value={filters.city}
                  onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div style={{ borderTop: "1px dotted #000" }} className="mt-5"></div>
          {/* Buttons */}
          <div className="d-flex justify-content-end mt-1 gap-2">
            <Button
              variant="outline-danger"
              size="sm"
              style={{ fontSize: "12px", fontWeight: "bold" }}
              onClick={handleReset}
            >
              Reset
            </Button>

            <Button
              variant="success"
              size="sm"
              style={{ fontSize: "12px", fontWeight: "bold" }}
              onClick={handleFilter}
            >
              <Icon
                icon="tabler:search"
                className="me-1"
                style={{ fontSize: "12px" }}
              />
              Apply
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function Filter({ onApply }: any) {
  return (
    <>
      <OffCanvasExample placement="end" name="Filter" onApply={onApply} />
    </>
  );
}

export default Filter;
