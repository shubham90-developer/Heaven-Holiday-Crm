"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import toast from "react-hot-toast";

// TODO: replace with real list options from your RTK Query list/segment API
const CONTACT_LISTS = [
  { value: "B2C_All_Clients", label: "B2C_All_Clients", contacts: 3026 },
  { value: "B2B_All_Clients", label: "B2B_All_Clients", contacts: 842 },
  { value: "Birthdays_This_Month", label: "Birthdays This Month", contacts: 57 },
  { value: "Custom_Segment", label: "Custom Segment", contacts: 0 },
];

const CreateCampaign = () => {
  const router = useRouter();

  const [campaignName, setCampaignName] = useState("");
  const [selectedList, setSelectedList] = useState(CONTACT_LISTS[0].value);
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");

  const totalContacts = useMemo(
    () => CONTACT_LISTS.find((l) => l.value === selectedList)?.contacts ?? 0,
    [selectedList]
  );

  const handleNext = () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }
    if (!selectedList) {
      toast.error("Please select a list");
      return;
    }

    // TODO: replace with a real created campaignId from your create-campaign mutation
    const params = new URLSearchParams({
      campaignName,
      list: selectedList,
      fromEmail,
      fromName,
    });

    router.push(`/marketing/campaigns/template-list?${params.toString()}`);
  };

  const handleUseExistingCampaigns = () => {
    toast("Use Existing Campaigns is coming soon", { icon: "🚧" });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Create a campaign</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={handleUseExistingCampaigns}>
            Use Existing Campaigns
          </Button>
          <Button variant="dark" size="sm" onClick={() => router.back()}>
            <IconifyIcon icon="mdi:arrow-left" className="me-1" /> Back
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <Row className="g-3">
          <Col md={6}>
            <Form.Label className="fw-semibold text-primary">
              Campaign Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Campaign Name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold text-primary">
              Select a List<span className="text-danger">*</span>
            </Form.Label>
            <Form.Select value={selectedList} onChange={(e) => setSelectedList(e.target.value)}>
              {CONTACT_LISTS.map((list) => (
                <option key={list.value} value={list.value}>
                  {list.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold text-primary">Default from email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Default from email address"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
            />
          </Col>

          <Col md={6}>
            <Form.Label className="fw-semibold text-primary">Default from name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Default from name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
            />
          </Col>
        </Row>

        <div className="mt-4">
          <span className="fw-semibold">Total Contact(s) : {totalContacts}</span>{" "}
          <Button
            variant="link"
            className="p-0 ms-1"
            onClick={() => toast("View Contacts is coming soon", { icon: "🚧" })}
          >
            View Contact(s)
          </Button>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="outline-secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button style={{ background: "#f58220", border: "none" }} onClick={handleNext}>
            Next
          </Button>
        </div>
      </Card>
    </>
  );
};

export default CreateCampaign;
