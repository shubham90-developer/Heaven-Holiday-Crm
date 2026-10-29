import React from 'react'
import { useState } from "react";
import { Button, Modal, Card, Form, Row, Col, CardHeader, NavItem, CardBody } from "react-bootstrap";
import { FormDataType } from "./NewQuery"; // adjust path if needed

type SightseeingProps = {
  formData: FormDataType;
  handleChange: (section: keyof FormDataType, field: string, value: any) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

const Sightseeing = ({ formData, handleChange, handleSubmit, isLoading }: SightseeingProps) => {
  const [showSelect, setShowSelect] = useState(false);
  return (
    <div>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Destination *</Form.Label>
            <Form.Control
              size="sm"
              value={formData.sightseeingDetails.destination}
              onChange={(e) => handleChange("sightseeingDetails", "destination", e.target.value)}
            />
          </Col>

          <Col md={3}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Duration</Form.Label>
            <Form.Control
              size="sm"
              placeholder="No. of Days"
              value={formData.sightseeingDetails.duration}
              onChange={(e) => handleChange("sightseeingDetails", "duration", e.target.value)}
            />
          </Col>

          <Col md={3}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Adults</Form.Label>
            <Form.Select
              size="sm"
              value={formData.sightseeingDetails.adults}
              onChange={(e) => handleChange("sightseeingDetails", "adults", +e.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Children (0-12)</Form.Label>
            <Form.Select
              size="sm"
              value={formData.sightseeingDetails.children}
              onChange={(e) => handleChange("sightseeingDetails", "children", +e.target.value)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Nationality</Form.Label>
            <Form.Select
              size="sm"
              value={formData.sightseeingDetails.nationality}
              onChange={(e) => handleChange("sightseeingDetails", "nationality", e.target.value)}
            >
              <option>India</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Lead Source *</Form.Label>
            <Form.Select
              size="sm"
              value={formData.sightseeingDetails.leadSource}
              onChange={(e) => handleChange("sightseeingDetails", "leadSource", e.target.value)}
            >
              <option value="">Select</option>
              <option>Website</option>
              <option>Agency</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Add Remark</Form.Label>
            <Form.Control
              size="sm" style={{ fontSize: "12px" }}
              value={formData.sightseeingDetails.remark}
              onChange={(e) => handleChange("sightseeingDetails", "remark", e.target.value)}
            />
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Assign To Sales</Form.Label>
            <Form.Select
              size="sm"
              value={formData.sightseeingDetails.assignToSales}
              onChange={(e) => handleChange("sightseeingDetails", "assignToSales", e.target.value)}
            >
              <option value="">Self</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Assign To Ops</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Check
                type="checkbox"
                checked={formData.sightseeingDetails.assignToOps}
                onChange={(e) => handleChange("sightseeingDetails", "assignToOps", e.target.checked)}
              />
              {formData.sightseeingDetails.assignToOps && (
                <Form.Select
                  size="sm"
                  value={formData.sightseeingDetails.opsPerson}
                  onChange={(e) => handleChange("sightseeingDetails", "opsPerson", e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Ops 1</option>
                  <option>Ops 2</option>
                </Form.Select>
              )}
            </div>
          </Col>
        </Row>

        <div className="text-end mt-3">
          <Button variant="danger" size="sm" style={{ fontSize: "12px" }} onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Sightseeing
