import React from 'react'
import { useState } from 'react';
import { Button, Modal, Card, Form, Row, Col, CardHeader, NavItem, CardBody } from "react-bootstrap";
import { FormDataType } from "./NewQuery"; // adjust path if needed

type MiscellaneousProps = {
  formData: FormDataType;
  handleChange: (section: keyof FormDataType, field: string, value: any) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

const Miscellaneous = ({ formData, handleChange, handleSubmit, isLoading }: MiscellaneousProps) => {
  const [showSelect, setShowSelect] = useState(false);

  return (
    <div>
      <Form>
        <Row>
          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Service *</Form.Label>
            <Form.Select
              size="sm"
              value={formData.miscellaneousDetails.service}
              onChange={(e) => handleChange("miscellaneousDetails", "service", e.target.value)}
            >
              <option value="">Select</option>
              <option>Others</option>
              <option>Hotels</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Destination *</Form.Label>
            <Form.Control
              size="sm"
              value={formData.miscellaneousDetails.destination}
              onChange={(e) => handleChange("miscellaneousDetails", "destination", e.target.value)}
            />
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Select Date *</Form.Label>
            <Form.Control
              type="date" size="sm"
              value={formData.miscellaneousDetails.date}
              onChange={(e) => handleChange("miscellaneousDetails", "date", e.target.value)}
            />
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Count *</Form.Label>
            <Form.Control
              size="sm" type="number"
              value={formData.miscellaneousDetails.count}
              onChange={(e) => handleChange("miscellaneousDetails", "count", +e.target.value)}
            />
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Lead Source *</Form.Label>
            <Form.Select
              size="sm"
              value={formData.miscellaneousDetails.leadSource}
              onChange={(e) => handleChange("miscellaneousDetails", "leadSource", e.target.value)}
            >
              <option value="">Select</option>
              <option>Website</option>
              <option>Agency</option>
              <option>Facebook</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Add Remark</Form.Label>
            <Form.Control
              size="sm" style={{ fontSize: "12px" }}
              value={formData.miscellaneousDetails.remark}
              onChange={(e) => handleChange("miscellaneousDetails", "remark", e.target.value)}
            />
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Assign To Sales</Form.Label>
            <Form.Select
              size="sm"
              value={formData.miscellaneousDetails.assignToSales}
              onChange={(e) => handleChange("miscellaneousDetails", "assignToSales", e.target.value)}
            >
              <option value="">Self</option>
              <option>Rajendra Bugade</option>
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Assign To Ops</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Check
                type="checkbox"
                checked={formData.miscellaneousDetails.assignToOps}
                onChange={(e) => handleChange("miscellaneousDetails", "assignToOps", e.target.checked)}
              />
              {formData.miscellaneousDetails.assignToOps && (
                <Form.Select
                  size="sm"
                  value={formData.miscellaneousDetails.opsPerson}
                  onChange={(e) => handleChange("miscellaneousDetails", "opsPerson", e.target.value)}
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

export default Miscellaneous
