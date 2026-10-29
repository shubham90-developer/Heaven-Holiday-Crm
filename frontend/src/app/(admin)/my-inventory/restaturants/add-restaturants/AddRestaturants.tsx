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
import { useCreateRestaurantMutation } from "../../../../../store/services/inventory/restaurants/restaurantApi";
import toast from "react-hot-toast";

const AddRestaturants = () => {
  const router = useRouter();

  const [createRestaurant, { isLoading }] =
    useCreateRestaurantMutation();

  const [formData, setFormData] = useState({
    city: "",
    address: "",
    restaurantArea: "",
    supplierName: "",
    currency: "INR",
    mealName: "",
    preferred: false,
    veg: false,
    nonVeg: false,
    ai: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createRestaurant(formData).unwrap();

      toast.success("Restaurant added successfully");

      router.push("/my-inventory/restaturants");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save restaurant");
    }
  };

  return (
    <>
      <Card className="p-3">
        <Form>
          <Row className='g-2'>
            <Col md={4}>

              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                City
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="city"
                value={formData.city}
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

            {/* Restaurant Area */}
            <Col md={4}>

              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Restaurant Area
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="restaurantArea"
                value={formData.restaurantArea}
                onChange={handleChange} />

            </Col>

            {/* Supplier Name */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Supplier Name
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="supplierName"
                value={formData.supplierName}
                onChange={handleChange} />
            </Col>

            {/* Currency */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Currency
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="currency"
                value={formData.currency}
                onChange={handleChange}>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </Form.Select>
            </Col>

            {/* Meal Name */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Meal Name
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="mealName"
                value={formData.mealName}
                onChange={handleChange} />
            </Col>

            <Col md={2}>
              <Form.Check label="Preferred" className='text-primary ' style={{ fontSize: "10px" }} name="preferred"
                checked={formData.preferred}
                onChange={handleChange} />
            </Col>

            <Col md={2}>
              <Form.Check label="Veg" className='text-primary ' style={{ fontSize: "10px" }} name="veg"
                checked={formData.veg}
                onChange={handleChange} />
            </Col>

            <Col md={2}>
              <Form.Check label="NonVeg" className='text-primary ' style={{ fontSize: "10px" }} name="nonVeg"
                checked={formData.nonVeg}
                onChange={handleChange} />
            </Col>
            <Col md={2}>
              <Form.Check label="AI" className='text-primary ' style={{ fontSize: "10px" }} name="ai"
                checked={formData.ai}
                onChange={handleChange} />
            </Col>

          </Row>
        </Form>

        <div className='d-flex justify-content-end gap-2'>
          <Button variant='outline-danger' size='sm'
            onClick={() => router.push('/my-inventory/restaturants')}
            style={{ fontSize: "12px" }}>Cancel</Button>

          <Button variant='danger' size='sm'
            style={{ fontSize: "12px" }} onClick={handleSubmit}
            disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </>
  )
}

export default AddRestaturants
