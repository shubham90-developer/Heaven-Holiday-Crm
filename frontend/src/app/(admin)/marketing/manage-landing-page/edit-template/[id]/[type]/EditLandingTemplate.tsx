"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  templateName: string;
  agencyName: string;
  bannerMainHeading: string;
  bannerSubHeading: string;
  enquiryFormMainHeading: string;
  enquiryFormSubHeading: string;
  emailId: string;
  contactNumber: string;
  whatsappNumber: string;
  address: string;
  mainHeading: string;
  description: string;
  leadSource: string;
  siteType: string;
  packageIds: string[];
  aboutUs: string;
  facebookUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  pinterestUrl: string;
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  headerScript: string;
  startBodyScript: string;
  endBodyScript: string;
};

const EditLandingTemplate = ({ id, type }: { id: string; type: string }) => {
  const router = useRouter();

  // TODO: replace with a real fetch, e.g. useGetLandingTemplateByIdQuery(id)
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      templateName: "",
      agencyName: "",
      bannerMainHeading: "",
      bannerSubHeading: "",
      enquiryFormMainHeading: "",
      enquiryFormSubHeading: "",
      emailId: "",
      contactNumber: "",
      whatsappNumber: "",
      address: "",
      mainHeading: "",
      description: "",
      leadSource: "Agency",
      siteType: "B2C",
      packageIds: ["", "", "", "", "", ""],
      aboutUs: "",
      facebookUrl: "",
      youtubeUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      pinterestUrl: "",
      metaTitle: "",
      metaKeyword: "",
      metaDescription: "",
      headerScript: "",
      startBodyScript: "",
      endBodyScript: "",
    },
  });

  useEffect(() => {
    // TODO: once the fetch hook above returns real data, reset(data) here
  }, [id, type]);

  const onSubmit = (values: FormValues) => {
    // TODO: call your create/update-landing-template API with { id, type, ...values }
    console.log("Submitting landing template", { id, type, values });
    toast.success("Template saved");
    router.push("/marketing/manage-landing-page");
  };

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <h6 className="fw-bold mb-0">Lead Template</h6>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Label>Template Page Name *</Form.Label>
            <Form.Control {...register("templateName", { required: true })} />
          </Col>
          <Col md={6}>
            <Form.Label>Agency Name</Form.Label>
            <Form.Control {...register("agencyName")} />
          </Col>

          <Col md={6}>
            <Form.Label>
              Banner Image (Approx Size: W:1600px, H:800px)
            </Form.Label>
            <Form.Control type="file" />
          </Col>
          <Col md={6}>
            <Form.Label>Banner Main Heading</Form.Label>
            <Form.Control {...register("bannerMainHeading")} />
          </Col>

          <Col md={12}>
            <Form.Label>Banner Sub Heading</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register("bannerSubHeading")}
            />
          </Col>

          <Col md={6}>
            <Form.Label>Enquiry Form Main Heading</Form.Label>
            <Form.Control {...register("enquiryFormMainHeading")} />
          </Col>
          <Col md={6}>
            <Form.Label>Enquiry Form Sub Heading</Form.Label>
            <Form.Control {...register("enquiryFormSubHeading")} />
          </Col>

          <Col md={4}>
            <Form.Label>Email Id</Form.Label>
            <Form.Control type="email" {...register("emailId")} />
          </Col>
          <Col md={4}>
            <Form.Label>Contact Number</Form.Label>
            <Form.Control {...register("contactNumber")} />
          </Col>
          <Col md={4}>
            <Form.Label>WhatsApp Number</Form.Label>
            <Form.Control {...register("whatsappNumber")} />
          </Col>

          <Col md={12}>
            <Form.Label>Address</Form.Label>
            <Form.Control {...register("address")} />
          </Col>

          <Col md={6}>
            <Form.Label>Main Heading</Form.Label>
            <Form.Control {...register("mainHeading")} />
          </Col>
          <Col md={6}>
            <Form.Label>Lead Source</Form.Label>
            <Form.Select {...register("leadSource")}>
              <option value="Agency">Agency</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
            </Form.Select>
          </Col>

          <Col md={12}>
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={2} {...register("description")} />
          </Col>

          <Col md={6}>
            <Form.Label>Site Type</Form.Label>
            <Form.Select {...register("siteType")}>
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
            </Form.Select>
          </Col>

          <Col md={12}>
            <Form.Label>
              Link Packages by Id (Item 1–6, enter Package ID for each)
            </Form.Label>
            <Row className="g-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Col md={6} key={i}>
                  <Form.Control
                    placeholder="Enter Package ID"
                    {...register(`packageIds.${i}` as const)}
                  />
                </Col>
              ))}
            </Row>
          </Col>

          <Col md={12}>
            <Form.Label>About Us (up to 2000 characters)</Form.Label>
            <Form.Control as="textarea" rows={4} {...register("aboutUs")} />
          </Col>

          <Col md={6}>
            <Form.Label>Facebook Url</Form.Label>
            <Form.Control {...register("facebookUrl")} />
          </Col>
          <Col md={6}>
            <Form.Label>Youtube Url</Form.Label>
            <Form.Control {...register("youtubeUrl")} />
          </Col>
          <Col md={6}>
            <Form.Label>Twitter Url</Form.Label>
            <Form.Control {...register("twitterUrl")} />
          </Col>
          <Col md={6}>
            <Form.Label>Instagram Url</Form.Label>
            <Form.Control {...register("instagramUrl")} />
          </Col>
          <Col md={12}>
            <Form.Label>Pinterest Url</Form.Label>
            <Form.Control {...register("pinterestUrl")} />
          </Col>

          <Col md={4}>
            <Form.Label>Meta Title</Form.Label>
            <Form.Control {...register("metaTitle")} />
          </Col>
          <Col md={4}>
            <Form.Label>Meta Keyword</Form.Label>
            <Form.Control {...register("metaKeyword")} />
          </Col>
          <Col md={4}>
            <Form.Label>Meta Description</Form.Label>
            <Form.Control {...register("metaDescription")} />
          </Col>

          <Col md={12}>
            <Form.Label>Header Script (within script tag)</Form.Label>
            <Form.Control {...register("headerScript")} />
          </Col>
          <Col md={12}>
            <Form.Label>Start Body Script (within script tag)</Form.Label>
            <Form.Control {...register("startBodyScript")} />
          </Col>
          <Col md={12}>
            <Form.Label>End Body Script (within script tag)</Form.Label>
            <Form.Control {...register("endBodyScript")} />
          </Col>
        </Row>

        <div className="text-end mt-3">
          <Button type="submit" variant="danger">
            Submit
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default EditLandingTemplate;
