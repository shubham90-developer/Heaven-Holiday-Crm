"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import { useCreateTransportMutation } from "../../../../../store/services/inventory/vehicle/transport/transportApi";
import toast from "react-hot-toast";

const AddTransport = () => {
  const router = useRouter()
  // RTK mutation
  const [createTransport, { isLoading }] = useCreateTransportMutation();

  // form state
  const [formData, setFormData] = useState({
    carType: "",
    transportName: "",
    seatingCapacity: "",
    ac: "",
    vehicleNo: "",
    numberOfVehicles: "",
  });

  // handle input change
  const handleChange = (
    e: any
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log("API HIT START");

    try {
      await createTransport({
        carType: formData.carType,
        transportName: formData.transportName,
        seatingCapacity: Number(formData.seatingCapacity),
        ac: formData.ac === "Yes",
        vehicleNo: formData.vehicleNo,
        numberOfVehicles: Number(formData.numberOfVehicles),
      }).unwrap();

      toast.success("Transport created successfully ✔");
      router.push("/my-inventory/vehicles");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Card className="p-3">
        <Form>
          <Row>
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Car Type
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="carType"
                value={formData.carType}
                onChange={handleChange}>
                <option value="">Select</option>
                <option value="Luxury">Luxary </option>
                <option value="Standard">Standard</option>
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Car Name
              </Form.Label>
              <Form.Control
                size="sm"
                style={{ fontSize: "10px" }}
                name="transportName"
                value={formData.transportName}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Seating Capacity
              </Form.Label>
              <Form.Control
                size="sm"
                style={{ fontSize: "10px" }}
                name="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                AC
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="ac"
                value={formData.ac}
                onChange={handleChange}>
                <option value="">Select</option>
                <option value="Yes">Yes </option>
                <option value="No">No</option>
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Vehicle No
              </Form.Label>
              <Form.Control
                size="sm"
                style={{ fontSize: "10px" }}
                name="vehicleNo"
                value={formData.vehicleNo}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                No of Vehicle
              </Form.Label>
              <Form.Control
                size="sm"
                style={{ fontSize: "10px" }}
                name="numberOfVehicles"
                value={formData.numberOfVehicles}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Image
              </Form.Label>
              <Form.Control type='file'
                size="sm"
                style={{ fontSize: "10px" }}
              />
            </Col>

          </Row>
          <div className='d-flex justify-content-end gap-2'>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => router.push('/my-inventory/vehicles')}
              style={{ fontSize: "12px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
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

export default AddTransport
