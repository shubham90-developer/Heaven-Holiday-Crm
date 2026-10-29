"use client";
import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Form, Row, Col, CardFooter, Button, CardTitle } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useCreateDepartmentMutation } from "../../../../../store/services/staff-management/department/departmentApi";
import toast from "react-hot-toast";

const AddDepartment = () => {
  const router = useRouter()
  const [createDepartment, { isLoading }] = useCreateDepartmentMutation();

  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
    isOperations: false, // default
  });

  // handle input change
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "isActive") {
      setFormData((prev) => ({
        ...prev,
        isActive: value === "Active",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // handle submit
  const handleSubmit = async () => {
    // basic validation
    if (!formData.name.trim()) {
      return toast.error("Department name is required");
    }

    try {
      await createDepartment(formData).unwrap();
      toast.success("Department created successfully");
      setFormData({
        name: "",
        isActive: true,
        isOperations: false, // default
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

              <Col md={3} className="d-flex align-items-end">
                <Form.Check
                  type="checkbox"
                  label="Is Operations"
                  name="isOperations"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isOperations: e.target.checked,
                    }))
                  }
                />
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

            <Button variant="success" size="sm" style={{ fontSize: "12px" }} onClick={handleSubmit}
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

export default AddDepartment
