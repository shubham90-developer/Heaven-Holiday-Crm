"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
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
import { useForm } from "react-hook-form"; // added
import toast from "react-hot-toast"; // added
import {
  useGetLeadSourceByIdQuery, // added
  useUpdateLeadSourceMutation, // added
} from "../../../../../../store/services/settings/lead-source/leadSourceApi"; // verify relative depth

const EditLeadSource = ({ id }: { id: string }) => {
  const router = useRouter()
  const { data, isLoading } = useGetLeadSourceByIdQuery(id); // added
  const [updateLeadSource, { isLoading: isUpdating }] = useUpdateLeadSourceMutation(); // added

  const { register, handleSubmit, reset } = useForm({ // added
    defaultValues: {
      title: "",
      status: "Active",
      enabled: "true",
    },
  });

  // Populate form once the fetched lead source data arrives
  useEffect(() => { // added
    if (data?.data) {
      reset({
        title: data.data.title || "",
        status: data.data.status || "Active",
        enabled: data.data.enabled ? "true" : "false",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => { // added
    try {
      await updateLeadSource({
        id,
        title: formData.title,
        status: formData.status,
        enabled: formData.enabled === "true",
      }).unwrap();

      toast.success("Lead source updated successfully");
      router.push("/settings/lead-source");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update lead source. Please try again.");
    }
  };

  if (isLoading) return <p style={{ fontSize: "12px" }}>Loading...</p>; // added

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
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
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
            <Button variant='success' size='sm' type="submit"
              style={{ fontSize: "10px" }}>{isUpdating ? "Updating..." : "Update"}</Button>
          </div>

        </Form>
      </Card>
    </div>
  )
}

export default EditLeadSource;
