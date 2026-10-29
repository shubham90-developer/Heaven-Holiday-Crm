"use client";
import { useRouter } from 'next/navigation';
import React from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Modal,
  Tabs,
  Tab,
  Accordion,
  AccordionBody,
  AccordionItem,
  AccordionHeader,
  CardHeader,
  CardBody
} from "react-bootstrap";
import { useCreateLeadSourceMutation } from "../../../../../store/services/settings/lead-source/leadSourceApi"; // added
import { useForm } from "react-hook-form"; // added
import toast from "react-hot-toast"; // added

const AddLeadSource = () => {
  const router = useRouter();
  const [createLeadSource, { isLoading }] = useCreateLeadSourceMutation(); // added

  const { register, handleSubmit } = useForm({ // added
    defaultValues: { title: "", status: "Active", enabled: "true" },
  });

  const onSubmit = async (formData: any) => { // added
    try {
      await createLeadSource({
        title: formData.title,
        status: formData.status,
        enabled: formData.enabled === "true",
      }).unwrap();
      toast.success("Lead source created successfully");
      router.push("/settings/lead-source");
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;

      toast.error(message || "Failed to create lead source. Please try again.");
    }
  };

  return (
    <div>
      <Card className='p-3'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            {/* Lead Source Name */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Lead Source Name *
              </Form.Label>
              <Form.Control
                size="sm"
                placeholder="Enter lead source name"
                style={{ fontSize: "10px" }}
                {...register("title", { required: true })}
              />
            </Col>

            {/* Status */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Status *
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} {...register("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>

            {/* Enabled Checkbox */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }} >
                Enabled CheckBox *
              </Form.Label>
              <Form.Select style={{ fontSize: "10px" }} size='sm' {...register("enabled")}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Col>
          </Row>

          <div className='d-flex gap-2 justify-content-end mt-3'>
            <Button variant='outline-danger' size='sm'
              onClick={() => router.push('/settings/lead-source/')}
              style={{ fontSize: "10px" }}>Cancel</Button>
            <Button variant='success' size='sm'
              style={{ fontSize: "10px" }} type="submit">{isLoading ? "Submitting..." : "Submit"}</Button>
          </div>

        </Form>
      </Card>
    </div>
  )
}

export default AddLeadSource
