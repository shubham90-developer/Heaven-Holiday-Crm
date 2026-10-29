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
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useGetEmailTemplateByIdQuery,
  useUpdateEmailTemplateMutation
} from "../../../../../../store/services/settings/email-template/emailTemplateApi";

const EditTemplate = ({ id }: { id: string }) => {
  const router = useRouter()
  const { data, isLoading } = useGetEmailTemplateByIdQuery(id);
  const [updateEmailTemplate, { isLoading: isUpdating }] = useUpdateEmailTemplateMutation();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      templateName: "",
      subject: "",
      status: "Active",
      message: "",
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (data?.data) {
      reset({
        templateName: data.data.templateName || "",
        subject: data.data.subject || "",
        status: data.data.status || "Active",
        message: data.data.message || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      await updateEmailTemplate({ id, ...formData }).unwrap();
      toast.success("Email template updated successfully");
      router.push("/settings/email-templates");
    } catch (err) {
      toast.error("Failed to update template. Please try again.");
    }
  };

  if (isLoading) return <p style={{ fontSize: "12px" }}>Loading...</p>;

  return (
    <>
      <Card className='p-3'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className='g-2'>
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Template Name *
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} {...register("templateName", { required: true })} />
            </Col>

            {/* Subject */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Subject *
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} {...register("subject", { required: true })} />
            </Col>

            {/* Status */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Status
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }}  {...register("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>

            <Col md={12}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Message Body
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                style={{ fontSize: "10px" }}
                {...register("message", { required: true })}
              />
            </Col>
          </Row>

          <div className='d-flex gap-2 justify-content-end mt-3'>
            <Button variant='outline-danger' size='sm'
              onClick={() => router.push('/settings/email-templates')}
              style={{ fontSize: "10px" }}>Cancel</Button>
            <Button variant='success' size='sm' type="submit" disabled={isUpdating}
              style={{ fontSize: "10px" }}>{isUpdating ? "Updating..." : "Update"}</Button>
          </div>
        </Form>
      </Card>
    </>
  )
}

export default EditTemplate
