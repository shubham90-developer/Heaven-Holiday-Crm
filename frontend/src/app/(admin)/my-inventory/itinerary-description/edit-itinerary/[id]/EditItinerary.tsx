"use client";
import React, { useState, useEffect } from 'react'
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
import { useRouter, useParams } from 'next/navigation';
import {
  useGetItineraryByIdQuery,
  useUpdateItineraryMutation,
} from "../../../../../../store/services/inventory/itinerary-description/itineraryDescriptionApi";
import toast from "react-hot-toast";

const EditItinerary = () => {
  const router = useRouter()
  const params = useParams();

  const id = params?.id as string;

  const { data, isLoading } =
    useGetItineraryByIdQuery(id);

  const [updateItinerary, { isLoading: updating }] =
    useUpdateItineraryMutation();

  const [formData, setFormData] = useState({
    startCity: "",
    destinationCity: "",
    title: "",
  });

  // Populate form when data loads
  useEffect(() => {
    if (data?.data) {
      setFormData({
        startCity: data.data.startCity || "",
        destinationCity: data.data.destinationCity || "",
        title: data.data.title || "",
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await updateItinerary({
        id,
        body: formData,
      }).unwrap();

      toast.success("Itinerary updated successfully");

      router.push("/my-inventory/itinerary-description");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
        "Failed to update itinerary"
      );
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

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
                maxLength={100}
                name="title"
                value={formData.title}
                onChange={handleChange}
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
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating ? "Updating..." : "Save"}
          </Button>
        </div>
      </Card>
    </>
  )
}

export default EditItinerary
