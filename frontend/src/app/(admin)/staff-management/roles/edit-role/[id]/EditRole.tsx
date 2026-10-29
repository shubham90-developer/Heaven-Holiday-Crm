"use client";
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Form, Row, Col, CardFooter, Button, CardTitle } from 'react-bootstrap';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation
} from "../../../../../../store/services/staff-management/role/roleApi";
import toast from "react-hot-toast";

const EditRole = () => {

  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading } = useGetRoleByIdQuery(id);
  const [updateRole] = useUpdateRoleMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    roleType: "",
    isActive: true,
  });

  // Prefill form when data loads
  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name || "",
        description: data.data.description || "",
        roleType: data.data.roleType || "",
        isActive: data.data.isActive ?? true,
      });
    }
  }, [data]);

  // Handle input change
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : value,
    }));
  };

  // Submit update
  const handleSubmit = async () => {
    try {
      await updateRole({
        id,
        ...formData,
      }).unwrap();

      toast.success("Role updated successfully");
      router.push("/staff-management/roles/");
    } catch (err: any) {
      toast.success(err?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <Card className="p-3">
        <CardHeader className='border-bottom '>
          <CardTitle style={{ fontSize: "12px" }}>Edit Role</CardTitle>
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
                  value={formData.roleType}
                  onChange={handleChange}
                  size='sm' >
                  {/* <option>None</option>
                  <option>Is Superadmin</option>
                  <option>Is Reporting Manager</option> */}
                  <option value="">Select</option>
                  <option value="ADMIN">Super Admin</option>
                  <option value="MANAGER">Reporting Manager</option>
                  <option value="SALES">Sales</option>
                  <option value="BACK_OFFICE">Back Office</option>
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Label style={{ fontSize: "10px" }} className='text-primary'>Status</Form.Label>
                <Form.Select style={{ fontSize: "12px" }}
                  name="isActive"
                  value={formData.isActive.toString()}
                  onChange={handleChange}
                  size='sm' >
                  <option value="true">Active</option>
                  <option value="false">Deactive</option>
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

            <Button variant="success" size="sm" style={{ fontSize: "12px" }} onClick={handleSubmit}>
              <Icon icon="akar-icons:check" className="me-1" /> Submit
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default EditRole
