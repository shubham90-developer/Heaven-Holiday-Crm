"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import { useCreateDriverMutation } from "../../../../../../store/services/inventory/vehicle/driver/driverApi";
import { useGetTransportsQuery } from "../../../../../../store/services/inventory/vehicle/transport/transportApi";
import toast from "react-hot-toast";

const AddDriver = () => {
  const router = useRouter()
  const [createDriver, { isLoading }] = useCreateDriverMutation();
  const { data: transportData, isLoading: vehicleLoading } = useGetTransportsQuery({});

  const [formData, setFormData] = useState({
    driverName: "",
    mobileNumber: "",
    email: "",
    languages: "",
    address: "",
    country: "",
    city: "",
    drivingLicense: "",
    primaryVehicle: "",
    remark: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      console.log("API HIT START");

      await createDriver({
        driverName: formData.driverName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        languages: formData.languages,
        address: formData.address,
        country: formData.country,
        city: formData.city,
        drivingLicense: formData.drivingLicense,
        primaryVehicle: formData.primaryVehicle || undefined,
        remark: formData.remark,
      }).unwrap();

      toast.success("Driver created successfully ✔");

      router.push("/my-inventory/vehicles/manage-driver");
    } catch (error: any) {
      console.error(error);
      const backendMessage = error?.data?.message;
      const fieldErrors = error?.data?.errors;
      // Extract first error message
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
        <Form>
          <Row>
            {/* Driver Name */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Driver Name*
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="driverName"
                value={formData.driverName}
                onChange={handleChange} />
            </Col>

            {/* Mobile Number */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Mobile Number *
              </Form.Label>
              <div className="d-flex">
                <span className="input-group-text" style={{ fontSize: "10px" }}>+91</span>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="mobileNumber"
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

            {/* Languages */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Languages*
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="languages"
                value={formData.languages}
                onChange={handleChange} />
            </Col>

            {/* Address */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Address
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="address"
                value={formData.address}
                onChange={handleChange} />
            </Col>

            {/* Country */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Country*
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="country"
                value={formData.country}
                onChange={handleChange}>
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
              </Form.Select>
            </Col>

            {/* City */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                City*
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="city"
                value={formData.city}
                onChange={handleChange}>
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
              </Form.Select>
            </Col>

            {/* Driving License */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Driving License
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="drivingLicense"
                value={formData.drivingLicense}
                onChange={handleChange} />
            </Col>

            {/* Primary Vehicle */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Primary Vehicle
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="primaryVehicle"
                value={formData.primaryVehicle}
                onChange={handleChange}>
                <option value="">Select</option>
                {vehicleLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  transportData?.data?.map((vehicle: any) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.transportName} - {vehicle.carType} - {vehicle.vehicleNo}
                    </option>
                  ))
                )}
              </Form.Select>
            </Col>

            {/* Image */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Image
              </Form.Label>
              <Form.Control type="file" size="sm" style={{ fontSize: "10px" }} />
            </Col>

            {/* Remark */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Remark
              </Form.Label>
              <Form.Control as="textarea" rows={2} style={{ fontSize: "10px" }} name="remark"
                value={formData.remark}
                onChange={handleChange} />
            </Col>

          </Row>
          <div className='d-flex justify-content-end gap-2'>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => router.push('/my-inventory/vehicles/manage-driver')}
              style={{ fontSize: "12px" }}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              style={{ fontSize: "12px" }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Card>
    </>
  )
}

export default AddDriver
