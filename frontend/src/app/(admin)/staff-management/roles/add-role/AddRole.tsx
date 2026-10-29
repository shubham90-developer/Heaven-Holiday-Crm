"use client";
import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Form, Row, Col, CardFooter, Button, CardTitle } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useCreateRoleMutation } from "../../../../../store/services/staff-management/role/roleApi";
import toast from "react-hot-toast"

const AddRole = () => {
  const router = useRouter();

  const [createRole, { isLoading }] = useCreateRoleMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    roleType: "",
    isActive: true,
  });

  // handle input change
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // map UI values → backend enum
    if (name === "roleType") {
      let mappedValue = "";

      if (value === "Is Superadmin") mappedValue = "ADMIN";
      else if (value === "Is Reporting Manager") mappedValue = "MANAGER";
      else mappedValue = "";

      setFormData((prev: any) => ({ ...prev, roleType: mappedValue }));
    } else if (name === "isActive") {
      setFormData((prev: any) => ({
        ...prev,
        isActive: value === "Active",
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // handle submit
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      return toast.error("Role Title is required");
    }

    if (!formData.roleType) {
      return toast.error("Role Type is required");
    }
    try {
      await createRole(formData).unwrap();

      toast.success("Role created successfully");
      setFormData({
        name: "",
        description: "",
        roleType: "",
        isActive: true,
      })
      // router.push("./");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Card className="p-3">
        <CardHeader className='border-bottom '>
          <CardTitle style={{ fontSize: "12px" }}>Add Role</CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Label style={{ fontSize: "10px" }} className='text-primary'>Role Title</Form.Label>
                <Form.Control style={{ fontSize: "12px" }}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  size='sm' />
              </Col>

              <Col md={3}>
                <Form.Label style={{ fontSize: "10px" }} className='text-primary'>Role Description</Form.Label>
                <Form.Control style={{ fontSize: "12px" }}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  size='sm' />
              </Col>

              <Col md={3}>
                <Form.Label style={{ fontSize: "10px" }} className='text-primary'>Role Type</Form.Label>
                <Form.Select style={{ fontSize: "12px" }}
                  name="roleType"
                  onChange={handleChange}
                  size='sm' >
                  <option>None</option>
                  <option>Is Superadmin</option>
                  <option>Is Reporting Manager</option>
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Label style={{ fontSize: "10px" }} className='text-primary'>Status</Form.Label>
                <Form.Select style={{ fontSize: "12px" }}
                  name="isActive"
                  onChange={handleChange}
                  size='sm' >
                  <option>Active</option>
                  <option>Deactive</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </CardBody>
        <CardFooter>
          <div className='d-flex justify-content-end gap-2'>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => { router.push('./') }}
              style={{ fontSize: "12px" }}
            >
              Cancel
            </Button>

            <Button variant="success" size="sm" style={{ fontSize: "12px" }}
              onClick={handleSubmit}
              disabled={isLoading}>
              <Icon icon="akar-icons:check" className="me-1" />
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default AddRole
