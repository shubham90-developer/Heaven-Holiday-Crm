"use client";
import React from "react";
import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import styles from "../communications.module.scss";

type FormValues = {
  email: string;
  status: "Active" | "Inactive";
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddSenderId = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { email: "", status: "Active" } });

  const onSubmit = async (formData: FormValues) => {
    // TODO: call the create sender-id mutation here, then toast + navigate back:
    // await createSenderId({ email: formData.email.trim(), status: formData.status }).unwrap();
    // toast.success("Sender ID added successfully");
    // router.push("/settings/communications");
    console.log("Sender ID payload:", formData);
  };

  return (
    <Card className={styles.formCard}>
      <div className={styles.formHeader}>Add Sender Id</div>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <FloatingLabel
                label={
                  <>
                    Sender Id<span className={styles.req}>*</span>
                  </>
                }
              >
                <Form.Control
                  type="email"
                  placeholder="Sender Id"
                  isInvalid={!!errors.email}
                  {...register("email", {
                    required: "Sender Id is required",
                    pattern: { value: EMAIL_REGEX, message: "Enter a valid email address" },
                  })}
                />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </FloatingLabel>
            </Col>

            <Col md={6}>
              <FloatingLabel
                label={
                  <>
                    Status<span className={styles.req}>*</span>
                  </>
                }
              >
                <Form.Select {...register("status")}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button variant="outline-primary" onClick={() => router.push("/settings/communications")}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Card.Body>
      </Form>
    </Card>
  );
};

export default AddSenderId;
