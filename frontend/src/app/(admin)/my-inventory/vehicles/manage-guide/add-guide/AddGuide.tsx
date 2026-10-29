"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import { useCreateGuideMutation } from "../../../../../../store/services/inventory/vehicle/guide/guideApi";
import toast from "react-hot-toast";

const AddGuide = () => {
  const router = useRouter()
  const [createGuide, { isLoading }] = useCreateGuideMutation();

  const [formData, setFormData] = useState({
    guideName: "",
    destination: "",
    mobileNumber: "",
    email: "",
    languages: "",
    description: "",
    currency: "",
    perDayRate: "",
    overnightCharges: "",
    markupType: "",
    markup: "",
    taxes: "",
    total: "",
  });

  // handle change
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createGuide({
        guideName: formData.guideName,
        destination: formData.destination,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        languages: formData.languages,
        description: formData.description,

        rates: {
          currency: formData.currency,
          perDayRate: Number(formData.perDayRate),
          overnightCharges: Number(formData.overnightCharges),
          markupType: formData.markupType,
          markup: Number(formData.markup),
          taxes: Number(formData.taxes),
          total: Number(formData.total),
        },
      }).unwrap();

      toast.success("Guide created successfully ✔");
      router.push("/my-inventory/vehicles/manage-guide");

    } catch (error: any) {
      const backendMessage = error?.data?.message;
      const fieldErrors = error?.data?.errors;

      let firstError = "";

      if (fieldErrors) {
        const firstKey = Object.keys(fieldErrors)[0];
        firstError = fieldErrors[firstKey]?.[0];
      }

      toast.error(firstError || backendMessage || "Something went wrong");
    }
  };

  return (
    <>
      <Card className="p-3">
        <Form onSubmit={handleSubmit}>
          <Row className='mb-2'>
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Guide Name*
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="guideName"
                value={formData.guideName}
                onChange={handleChange} />
            </Col>

            {/* Destination */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Destination*
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="destination"
                value={formData.destination}
                onChange={handleChange} />
            </Col>

            {/* Mobile Number */}
            <Col md={2}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Mobile Number *
              </Form.Label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">+91</span>
                <Form.Control style={{ fontSize: "10px" }} name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange} />
              </div>
            </Col>

            {/* Email */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                E-mail
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="email"
                value={formData.email}
                onChange={handleChange} />
            </Col>

            {/* Languages Known */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Languages Known*
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="languages"
                value={formData.languages}
                onChange={handleChange} />
            </Col>

            {/* Image */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Image
              </Form.Label>
              <Form.Control type="file" size="sm" style={{ fontSize: "10px" }} />
            </Col>

            {/* Short Description */}
            <Col md={6}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Short Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                style={{ fontSize: "10px" }}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <strong style={{ fontSize: "10px" }}>Rates</strong>

          <div className="table-responsive my-2">
            <table
              className="table table-sm table-bordered mb-0 align-middle"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                  <th style={{ width: "120px" }}>Currency</th>
                  <th style={{ width: "140px" }}>Per Day Rate</th>
                  <th style={{ width: "160px" }}>Overnight Charges</th>
                  <th style={{ width: "140px" }}>Mark Up Type</th>
                  <th style={{ width: "120px" }}>Mark Up</th>
                  <th style={{ width: "120px" }}>Taxes</th>
                  <th style={{ width: "140px" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ fontSize: "12px" }}>
                  <td>
                    <Form.Select size="sm" style={{ fontSize: "10px" }} name="currency" onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="INR">INR</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control size="sm" style={{ fontSize: "10px" }} name="perDayRate" onChange={handleChange} />
                  </td>
                  <td>
                    <Form.Control size="sm" style={{ fontSize: "10px" }} name="overnightCharges" onChange={handleChange} />
                  </td>
                  <td>
                    <Form.Select size="sm" style={{ fontSize: "10px" }} name="markupType" onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Percentage">Percentage</option>
                      <option value="Flat">Flat</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control size="sm" style={{ fontSize: "10px" }} name="markup" onChange={handleChange} />
                  </td>
                  <td>
                    <Form.Control size="sm" style={{ fontSize: "10px" }} name="taxes" onChange={handleChange} />
                  </td>
                  <td>
                    <Form.Control size="sm" style={{ fontSize: "10px" }} name="total" onChange={handleChange} />
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
          <div className='d-flex justify-content-end gap-2'>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => router.push('/my-inventory/vehicles/manage-guide')}
              style={{ fontSize: "12px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              size="sm"
              style={{ fontSize: "12px" }}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Card>
    </>
  )
}

export default AddGuide
