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
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCreateEmailTemplateMutation } from "../../../../../store/services/settings/email-template/emailTemplateApi";

const AddTemplate = () => {
  const router = useRouter()
  const [createEmailTemplate, { isLoading }] = useCreateEmailTemplateMutation();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      templateName: "",
      subject: "",
      status: "Active",
      message: "",
    },
  });

  const onSubmit = async (formData: any) => {
    try {
      await createEmailTemplate(formData).unwrap();
      toast.success("Email template created successfully");
      reset();
      router.push("/settings/email-templates");
    } catch (err) {
      toast.error("Failed to create template. Please try again.");
    }
  };

  return (
    <>
      <Card className='p-3'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className='g-2'>
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Template Name *
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }}  {...register("templateName", { required: true })} />
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
              <Form.Select size="sm" style={{ fontSize: "10px" }} {...register("status")}>
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
            <Button variant='success' size='sm'
              style={{ fontSize: "10px" }} type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form>
      </Card>
    </>
  )
}

export default AddTemplate
