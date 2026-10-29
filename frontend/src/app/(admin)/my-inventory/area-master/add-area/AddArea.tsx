"use client";
import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useRouter } from 'next/navigation';
import { useCreateAreaMutation } from "../../../../../store/services/inventory/area-master/areaMasterApi";
import toast from "react-hot-toast";

const AddArea = () => {
  const router = useRouter()

  // RTK mutation hook
  const [createArea, { isLoading }] = useCreateAreaMutation();

  // form state
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("Active");

  // submit handler
  const handleSubmit = async () => {
    try {
      if (!city || !area) {
        toast.error("City and Area are required");
        return;
      }

      await createArea({
        city,
        area,
        status,
      }).unwrap();

      // redirect after success
      toast.success("Area Master created successfully");

      router.push("/my-inventory/area-master");
    } catch (error) {
      console.error("Error creating area:", error);
      toast.error("Failed to create area");
    }
  };

  return (
    <>
      <Card className="p-3">
        <Form>
          <Row className='g-2 mb-3'>
            <Col md={4}>

              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                City
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

            </Col>

            {/* Address */}
            <Col md={4}>

              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Area
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }}
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />

            </Col>

            {/* Currency */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Status
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>

        <div className='d-flex justify-content-end gap-2 '>
          <Button variant='outline-danger' size='sm'
            onClick={() => router.push('/my-inventory/area-master')}
            style={{ fontSize: "12px" }}>Cancel</Button>

          <Button variant='success' size='sm' onClick={handleSubmit}
            disabled={isLoading}
            style={{ fontSize: "12px" }}> {isLoading ? "Submitting..." : "Submit"}</Button>
        </div>
      </Card>
    </>
  )
}

export default AddArea
