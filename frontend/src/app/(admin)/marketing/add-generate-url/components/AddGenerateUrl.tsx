"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  websiteUrl: string;
  leadSource: string;
  medium: string;
  campaignName: string;
  assignTo: string;
  isLandingPageUrl: boolean;
};

// TODO: replace with real options from your lead-source / staff / campaign APIs
const LEAD_SOURCES = ["Website", "Agency", "Referral", "Social Media"];
const MEDIUMS = ["Email", "WhatsApp", "SMS", "Social", "Organic"];
const CAMPAIGN_NAMES = ["h", "hvh", "SINGAPORE MALAYSIA"];
const STAFF = ["RAJENDRA BUGADE", "PRAJWAL SIR", "SAIPRASAD SIR"];

const AddGenerateUrl = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"medium" | "campaign">("medium");
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      websiteUrl: "https://www.aheavenholiday.in/",
      leadSource: "",
      medium: "",
      campaignName: "",
      assignTo: "",
      isLandingPageUrl: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    // TODO: call your generate-campaign-url API with `values`
    console.log("Generating campaign URL", values);
    toast.success("URL generated");
    router.push("/marketing/campaigns-url-builder");
  };

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h5 className="fw-bold text-danger mb-0">Campaign URL Builder</h5>
        <div className="d-flex gap-2">
          <Button
            variant={tab === "medium" ? "primary" : "outline-secondary"}
            size="sm"
            style={{ fontSize: "10px" }}
            onClick={() => setTab("medium")}
          >
            <Icon icon="mdi:eye-outline" className="me-1" /> Medium
          </Button>
          <Button
            variant={tab === "campaign" ? "primary" : "outline-secondary"}
            size="sm"
            style={{ fontSize: "10px" }}
            onClick={() => setTab("campaign")}
          >
            <Icon icon="mdi:eye-outline" className="me-1" /> Campaign
          </Button>
        </div>
      </div>

      <h6 className="fw-bold mb-3">Generate Url</h6>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="g-3">
          <Col md={12}>
            <Form.Label>Website Url</Form.Label>
            <Form.Control {...register("websiteUrl")} />
          </Col>

          <Col md={12}>
            <Form.Label>
              Lead Source <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select {...register("leadSource", { required: true })}>
              <option value="">Select Lead Source</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={12}>
            <Form.Label>
              Medium <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select {...register("medium", { required: true })}>
              <option value="">Select Medium</option>
              {MEDIUMS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={12}>
            <Form.Label>
              Campaign Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select {...register("campaignName", { required: true })}>
              <option value="">Select Campaign Name</option>
              {CAMPAIGN_NAMES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={12}>
            <Form.Label>Assign To</Form.Label>
            <Form.Select {...register("assignTo")}>
              <option value="">Select Staff</option>
              {STAFF.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={12}>
            <Form.Check
              type="checkbox"
              label="Landing Page Url"
              {...register("isLandingPageUrl")}
            />
          </Col>
        </Row>

        <div className="text-end mt-4">
          <Button type="submit" variant="primary">
            Generate Url
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddGenerateUrl;
