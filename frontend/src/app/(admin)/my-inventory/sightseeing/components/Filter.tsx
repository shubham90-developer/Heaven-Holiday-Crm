"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

import Offcanvas from "react-bootstrap/Offcanvas";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import CustomFlatpickr from "@/components/CustomFlatpickr";

interface FilterProps {
  onApplyFilters: (filters: any) => void;
}

function OffCanvasExample({ name, onApplyFilters }: any) {
  const [show, setShow] = useState(false);
  const [leadSource, setLeadSource] = useState<string>("");
  const [leadStage, setLeadStage] = useState<string>("");
  const [filters, setFilters] = useState({
    sightseeingName: "",
    country: "",
    city: "",
    category: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFilter = () => {
    onApplyFilters(filters);
    handleClose();
  };

  const handleReset = () => {
    const resetFilters = {
      sightseeingName: "",
      country: "",
      city: "",
      category: "",
    };

    setFilters(resetFilters);
    onApplyFilters({});
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
            <Col md={3}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "12px" }}
                  className="text-primary"
                >
                  Sightseeing Name
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} value={filters.sightseeingName}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      sightseeingName: e.target.value,
                    })
                  } />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "12px" }}
                  className="text-primary"
                >
                  Country
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} value={filters.country}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      country: e.target.value,
                    })
                  }>
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="UAE">UAE</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Maldives">Maldives</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Created By*/}
            <Col md={3}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "12px" }}
                  className="text-primary"
                >
                  City
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} value={filters.city}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      city: e.target.value,
                    })
                  }>
                  <option value="">Select City</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Goa">Goa</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Bangkok">Bangkok</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Bali">Bali</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Package Status*/}
            <Col md={3}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "12px" }}
                  className="text-primary"
                >
                  Sightseeing Type
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }} value={filters.category}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      category: e.target.value,
                    })
                  }>
                  <option value="">Select</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Nature">Nature</option>
                  <option value="Historical">Historical</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Religious">Religious</option>
                  <option value="Cultural">Cultural</option>
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
              Filter
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function Filter({ onApplyFilters }: FilterProps) {
  return (
    <>
      <OffCanvasExample placement="end" name="Filter" onApplyFilters={onApplyFilters} />
    </>
  );
}

export default Filter;
