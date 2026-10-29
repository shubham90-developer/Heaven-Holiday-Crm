"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Row, Col, Modal } from "react-bootstrap";
import TemplateTabs from "../../components/TemplateTabs";
import toast from "react-hot-toast";

// TODO: replace with real master template previews from your template API
const MASTER_TEMPLATES = [
  { key: "template-1", label: "Template 1" },
  { key: "template-2", label: "Template 2" },
  { key: "template-3", label: "Template 3" },
  { key: "template-4", label: "Template 4" },
  { key: "image-template", label: "Image Template" },
];

const previewBoxStyle: React.CSSProperties = {
  border: "1px solid #e3e7ee",
  borderRadius: 6,
  overflow: "hidden",
};

const previewThumbStyle: React.CSSProperties = {
  height: 220,
  background: "#f4f6f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#a7b0bd",
  fontSize: 13,
};

const CreateTemplate = () => {
  const router = useRouter();
  const [previewKey, setPreviewKey] = useState<string | null>(null);

  const handleSelectTemplate = (key: string) => {
    // TODO: carry the chosen master template id into your campaign draft
    toast.success(`${key.replace("-", " ")} selected`);
    router.push("/marketing/campaigns/code-your-own");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Create Master Template</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm">
            My Template
          </Button>
          <Button variant="dark" size="sm" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <p className="fw-semibold mb-3">Select a starting point for your template</p>

      <TemplateTabs active="master" />

      <h5 className="fw-bold mb-3">Feature</h5>

      <Row className="g-3">
        {MASTER_TEMPLATES.map((tpl) => (
          <Col xs={6} md={4} lg={3} key={tpl.key}>
            <div style={previewBoxStyle}>
              <div style={previewThumbStyle}>Lorem ipsum preview</div>
              <div className="text-center fw-bold py-2 border-top">{tpl.label}</div>
              <div className="text-center pb-3">
                <Button variant="outline-primary" size="sm" onClick={() => setPreviewKey(tpl.key)}>
                  View
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal show={!!previewKey} onHide={() => setPreviewKey(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{MASTER_TEMPLATES.find((t) => t.key === previewKey)?.label}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: 300, background: "#f4f6f9" }} />
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setPreviewKey(null)}>
            Close
          </Button>
          <Button
            style={{ background: "#f58220", border: "none" }}
            onClick={() => previewKey && handleSelectTemplate(previewKey)}
          >
            Use this template
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateTemplate;
