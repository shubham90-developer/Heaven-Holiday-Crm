"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

import Offcanvas from "react-bootstrap/Offcanvas";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import CustomFlatpickr from "@/components/CustomFlatpickr";

function OffCanvasExample({ name, ...props }: any) {
  const [show, setShow] = useState(false);
  const [leadSource, setLeadSource] = useState<string>("");
  const [leadStage, setLeadStage] = useState<string>("");

  const [guideName, setGuideName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleApply = () => {
    const params: any = {};

    if (guideName) params.guideName = guideName;
    if (mobileNumber) params.mobileNumber = mobileNumber;
    if (email) params.email = email;

    props.onApply(params); // 🔥 triggers RTK refetch
    handleClose();
  };

  const handleReset = () => {
    setGuideName("");
    setMobileNumber("");
    setEmail("");

    props.onApply({}); // fetch all again
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
                Guide Name
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} value={guideName}
                onChange={(e) => setGuideName(e.target.value)} />
            </Col>

            {/* Mobile No */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Mobile No
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)} />
            </Col>

            {/* Email Id */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Email Id
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} value={email}
                onChange={(e) => setEmail(e.target.value)} />
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
