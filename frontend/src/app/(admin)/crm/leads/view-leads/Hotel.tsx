import React from 'react'
import { useState } from 'react';
import { Button, Modal, Card, Form, Row, Col, CardHeader, NavItem, CardBody } from "react-bootstrap";
import { FormDataType } from "./NewQuery"
import FoodPreferenceMultiSelect from "./components/FoodPreferenceMultiSelect";
import LeadSourceSelect from "./components/LeadSourceSelect";

type HotelProps = {
  formData: FormDataType;
  handleChange: (section: keyof FormDataType, field: string, value: any) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

const Hotel = ({ formData, handleChange, handleSubmit, isLoading }: HotelProps) => {
  const [open, setOpen] = useState(false);
  const [requirementType, setRequirementType] = useState("package");
  const [showSelect, setShowSelect] = useState(false);
  return (
    <>
      <div>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Destination *
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.hotelDetails.destination}
                onChange={(e) => handleChange("hotelDetails", "destination", e.target.value)} />
            </Col>

            <Col md={3}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Check In *
              </Form.Label>
              <Form.Control type="date" size="sm" value={formData.hotelDetails.checkIn}
                onChange={(e) => handleChange("hotelDetails", "checkIn", e.target.value)} />
            </Col>

            <Col md={3}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Check Out *
              </Form.Label>
              <Form.Control type="date" size="sm" value={formData.hotelDetails.checkOut}
                onChange={(e) => handleChange("hotelDetails", "checkOut", e.target.value)} />
            </Col>

            {/* Row 2 */}
            <Col md={3}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Nights *
              </Form.Label>
              <Form.Control size="sm" value={formData.hotelDetails.nights}
                onChange={(e) => handleChange("hotelDetails", "nights", +e.target.value)} />
            </Col>

            <Col md={3}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Nationality
              </Form.Label>
              <Form.Select size="sm" value={formData.hotelDetails.nationality}
                onChange={(e) => handleChange("hotelDetails", "nationality", e.target.value)}>
                <option value="india">India</option>
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Travelers
              </Form.Label>
              <Form.Select size="sm" value={formData.hotelDetails.travelers}
                onChange={(e) => handleChange("hotelDetails", "travelers", +e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Star Rating
              </Form.Label>
              <Form.Select size="sm" value={formData.hotelDetails.starRating}
                onChange={(e) => handleChange("hotelDetails", "starRating", e.target.value)}>
                <option value="Any">Any</option>
                <option value="3 Star">3 Star</option>
                <option value="4 Star">4 Star</option>
                <option value="5 Star">5 Star</option>
              </Form.Select>
            </Col>

            {/* Row 3 */}
            <Col md={3}>
              <FoodPreferenceMultiSelect
                value={
                  Array.isArray(formData.hotelDetails.foodPreference)
                    ? formData.hotelDetails.foodPreference
                    : formData.hotelDetails.foodPreference
                      ? [formData.hotelDetails.foodPreference]
                      : []
                }
                onChange={(selected) =>
                  handleChange("hotelDetails", "foodPreference", selected)
                }
              />
            </Col>

            <Col md={3}>
              <LeadSourceSelect
                value={formData.hotelDetails.leadSource || ""}
                onChange={(val) => handleChange("hotelDetails", "leadSource", val)}
              />
            </Col>

            <Col md={6}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Add Remarks
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.hotelDetails.remark}
                onChange={(e) => handleChange("hotelDetails", "remark", e.target.value)} />
            </Col>

            {/* Row 4 */}
            <Col md={4}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Assign To Sales
              </Form.Label>
              <Form.Select size="sm" value={formData.hotelDetails.assignToSales}
                onChange={(e) => handleChange("hotelDetails", "assignToSales", e.target.value)}>
                <option>Self</option>
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                Assign To Ops
              </Form.Label>

              <div className="d-flex align-items-center gap-2">
                <Form.Check
                  type="checkbox"
                  checked={formData.hotelDetails.assignToOps}
                  onChange={(e) => handleChange("hotelDetails", "assignToOps", e.target.checked)}
                />
                {formData.hotelDetails.assignToOps && (
                  <Form.Select
                    size="sm"
                    value={formData.hotelDetails.opsPerson}
                    onChange={(e) => handleChange("hotelDetails", "opsPerson", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option>Ops 1</option>
                    <option>Ops 2</option>
                  </Form.Select>
                )}
              </div>
            </Col>

          </Row>
          <div className="text-end ">
            <Button variant="danger" size="sm" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </Form>

      </div>
    </>
  )
}

export default Hotel
