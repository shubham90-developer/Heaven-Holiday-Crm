"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

import Offcanvas from "react-bootstrap/Offcanvas";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import CustomFlatpickr from "@/components/CustomFlatpickr";

function OffCanvasExample({ name, onApply }: any) {
  const [show, setShow] = useState(false);

  // LOCAL FILTER STATE
  const [filters, setFilters] = useState({
    country: "",
    visaType: "",
    visaName: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // HANDLE CHANGE
  const handleChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // APPLY FILTER
  const handleApply = () => {
    // remove empty values
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );

    onApply(cleanedFilters); // SEND TO PARENT
    handleClose();
  };

  // RESET FILTER
  const handleReset = () => {
    setFilters({
      country: "",
      visaType: "",
      visaName: "",
    });

    onApply({}); // fetch all
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
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Country
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} value={filters.country}
                  onChange={(e) => handleChange("countriesCovered", e.target.value)}>
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="UAE">UAE</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Select Visa Type */}
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Visa Type
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} value={filters.visaType}
                  onChange={(e) => handleChange("visaType", e.target.value)}>
                  <option value="">Select Visa Type</option>
                  <option value="Single Entry">Single Entry</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Visa Name */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Visa Name
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} value={filters.visaName}
                onChange={(e) => handleChange("visaName", e.target.value)}
                placeholder="Visa Name" />
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
              onClick={handleApply}
            >
              <Icon
                icon="tabler:search"
                className="me-1"
                style={{ fontSize: "12px" }}
              />
              Filter
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
