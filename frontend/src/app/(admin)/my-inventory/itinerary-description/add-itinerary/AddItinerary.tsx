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
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from 'next/navigation';
import { useCreateItineraryMutation } from "../../../../../store/services/inventory/itinerary-description/itineraryDescriptionApi";
import toast from "react-hot-toast";
import { AnyMessageParams } from 'yup';

const AddItinerary = () => {
  const router = useRouter()
  const [createItinerary, { isLoading }] =
    useCreateItineraryMutation();

  const [formData, setFormData] = useState({
    startCity: "",
    destinationCity: "",
    title: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await createItinerary(formData).unwrap();

      toast.success("Itinerary created successfully");

      router.push("/my-inventory/itinerary-description");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create itinerary");
      console.log(error);
    }
  };

  return (
    <>
      <Card className='p-3'>
        <div className='text-end '>
          <Button
            variant="secondary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => router.push("/my-inventory/itinerary-description")}
          >
            <Icon icon="mdi:eye" className="me-1" /> My Itinerary List
          </Button>
        </div>
        <hr />
        <Row className="g-3">

          {/* Start City */}
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Start City
              </Form.Label>
              <Form.Control
                size="sm"
                style={{ fontSize: "10px" }}
                name="startCity"
                value={formData.startCity}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          {/* Destination City */}
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Destination City
              </Form.Label>
              <Form.Control
                size="sm"
                style={{ fontSize: "10px" }}
                name="destinationCity"
                value={formData.destinationCity}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          {/* Title */}
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Title (100 words maximum)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                style={{ fontSize: "10px" }}
              />
              <small className="text-muted">Max 100 characters</small>
            </Form.Group>
          </Col>

        </Row>

        <div className='d-flex justify-content-end gap-2'>
          <Button
            variant="outline-danger"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => router.push("/my-inventory/itinerary-description")}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={handleSave}
            disabled={isLoading}

          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </>
  )
}

export default AddItinerary
