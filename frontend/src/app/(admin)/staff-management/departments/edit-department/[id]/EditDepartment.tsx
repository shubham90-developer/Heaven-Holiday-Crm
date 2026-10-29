"use client";
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Form, Row, Col, CardFooter, Button, CardTitle } from 'react-bootstrap';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  useGetDepartmentByIdQuery,
  useUpdateDepartmentMutation,
} from "../../../../../../store/services/staff-management/department/departmentApi";
import toast from "react-hot-toast";

const EditDepartment = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading } = useGetDepartmentByIdQuery(id);
  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();

  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
    isOperations: false,
  });

  // Prefill form
  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name || "",
        isActive: data.data.isActive ?? true,
        isOperations: data.data.isOperations ?? false,
      });
    }
  }, [data]);

  // Handle change
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "isActive"
            ? value === "true"
            : value,
    }));
  };

  // Submit update
  const handleSubmit = async () => {
    try {
      await updateDepartment({
        id,
        ...formData,
      }).unwrap();

      toast.success("Department updated successfully");
      router.push("/staff-management/departments");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <>
      <Card className="p-3">
        <CardHeader className='border-bottom '>
          <CardTitle style={{ fontSize: "12px" }}>Add Department</CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Label style={{ fontSize: "10px" }} className='text-primary'>Departname Name</Form.Label>
                <Form.Control style={{ fontSize: "12px" }}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  size='sm' />
              </Col>

              <Col md={3} className="d-flex align-items-end">
                <Form.Check
                  type="checkbox"
                  label="Is Operations"
                  name="isOperations"
                  checked={formData.isOperations}
                  onChange={handleChange}
                />
              </Col>

              <Col md={3}>
                <Form.Label style={{ fontSize: "10px" }} className='text-primary'>Status</Form.Label>
                <Form.Select style={{ fontSize: "12px" }}
                  size='sm' name="isActive"
                  value={formData.isActive.toString()}
                  onChange={handleChange}>
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

            <Button variant="success" size="sm" style={{ fontSize: "12px" }}
              onClick={handleSubmit}
              disabled={isUpdating}>
              <Icon icon="akar-icons:check" className="me-1" />
              {isUpdating ? "Updating..." : "Submit"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default EditDepartment
