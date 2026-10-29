"use client";

import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import toast from "react-hot-toast";

// UI only — these two values would come from your generate-feedback-link API
const SHORT_URL = "https://g07.in/MTQ1NDk2M18x";
const FULL_URL =
  "https://www.aheavenholiday.in/detail/index/view/id/aHR0cHM6Ly9nbG9iYWx0cmF2ZWxleGNoYW5nZS5jb20vZmVlZC8x/feed/1";

const copyToClipboard = async (value: string, label: string) => {
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Could not copy to clipboard");
  }
};

const GenerateFeedbackUrl = () => {
  return (
    <Card className="p-3">
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Copy Short URL</Form.Label>
        <Form.Control readOnly value={SHORT_URL} />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Copy URL</Form.Label>
        <Form.Control as="textarea" rows={3} readOnly value={FULL_URL} />
      </Form.Group>

      <div className="d-flex gap-2 justify-content-end flex-wrap">
        <Button
          variant="outline-primary"
          onClick={() => copyToClipboard(SHORT_URL, "Short URL")}
        >
          Copy Short URL
        </Button>
        <Button
          variant="success"
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(SHORT_URL)}`,
              "_blank",
            )
          }
        >
          Share on Whatsapp
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            (window.location.href = `mailto:?body=${encodeURIComponent(SHORT_URL)}`)
          }
        >
          Send Email
        </Button>
      </div>
    </Card>
  );
};

export default GenerateFeedbackUrl;
