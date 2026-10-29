"use client";
import React, { useEffect } from "react";
import { Button, Col, Form, Offcanvas, Row } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useCreateLeadSourceMutation,
  useUpdateLeadSourceMutation,
} from "../../../../store/services/settings/lead-source/leadSourceApi";
import styles from "./lead-source.module.scss";

type FormValues = {
  title: string;
  status: "Active" | "Inactive";
  enabled: "true" | "false";
};

type Props = {
  show: boolean;
  onHide: () => void;
  /** pass a lead source to edit it, leave null/undefined to create a new one */
  editItem?: any | null;
};

const DEFAULTS: FormValues = { title: "", status: "Active", enabled: "false" };

const LeadSourceOffcanvas = ({ show, onHide, editItem }: Props) => {
  const isEdit = !!editItem;

  const [createLeadSource, { isLoading: isCreating }] = useCreateLeadSourceMutation();
  const [updateLeadSource, { isLoading: isUpdating }] = useUpdateLeadSourceMutation();
  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: DEFAULTS });

  // Fill the form when opening for edit, clear it when opening for add
  useEffect(() => {
    if (!show) return;
    if (editItem) {
      reset({
        title: editItem.title || "",
        status: editItem.status || "Active",
        enabled: editItem.enabled ? "true" : "false",
      });
    } else {
      reset(DEFAULTS);
    }
  }, [show, editItem, reset]);

  const onSubmit = async (formData: FormValues) => {
    const payload = {
      title: formData.title.trim(),
      status: formData.status,
      enabled: formData.enabled === "true",
    };

    try {
      if (isEdit) {
        await updateLeadSource({ id: editItem._id, ...payload }).unwrap();
        toast.success("Lead source updated successfully");
      } else {
        await createLeadSource(payload).unwrap();
        toast.success("Lead source created successfully");
      }
      onHide();
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} lead source. Please try again.`
      );
    }
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: 520, maxWidth: "100vw" }}>
      <Offcanvas.Header closeButton className="border-bottom">
        <div className="d-flex align-items-center gap-3">
          <span className={styles.panelIcon}>
            <Icon icon="mdi:tag-outline" />
          </span>
          <div>
            <Offcanvas.Title as="h5" className="mb-0" style={{ fontSize: 16, fontWeight: 700 }}>
              {isEdit ? "Edit Lead Source" : "Add Lead Source"}
            </Offcanvas.Title>
            <div className={styles.fieldHint}>
              {isEdit ? "Update this lead source" : "Create a new lead source"}
            </div>
          </div>
        </div>
      </Offcanvas.Header>

      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column flex-grow-1" style={{ minHeight: 0 }}>
        <Offcanvas.Body className="flex-grow-1">
          <Form.Group className="mb-3">
            <Form.Label className={styles.fieldLabel}>
              Lead Source Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              placeholder="e.g. Instagram, Referral, Walk-in"
              style={{ fontSize: 13 }}
              isInvalid={!!errors.title}
              autoFocus
              {...register("title", {
                required: "Lead source name is required",
                validate: (v) => v.trim().length >= 2 || "Must be at least 2 characters",
                maxLength: { value: 100, message: "Must be 100 characters or less" },
              })}
            />
            <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
          </Form.Group>

          <Row className="g-3">
            <Col md={6}>
              <Form.Label className={styles.fieldLabel}>Status</Form.Label>
              <Form.Select style={{ fontSize: 13 }} {...register("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label className={styles.fieldLabel}>Enable Default Assign</Form.Label>
              <Form.Select style={{ fontSize: 13 }} {...register("enabled")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </Form.Select>
            </Col>
          </Row>

          <p className={`${styles.fieldHint} mt-2 mb-0`}>
            “Enable Default Assign” shows the assign-lead option for this source on the lead form.
          </p>
        </Offcanvas.Body>

        <div className={styles.panelFooter}>
          <Button variant="light" className="border" onClick={onHide} disabled={isSaving} style={{ fontSize: 13 }}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSaving} style={{ fontSize: 13 }}>
            <Icon icon="mdi:check" className="me-1" />
            {isSaving ? "Saving..." : isEdit ? "Update" : "Submit"}
          </Button>
        </div>
      </Form>
    </Offcanvas>
  );
};

export default LeadSourceOffcanvas;
