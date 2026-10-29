"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import TemplateTabs from "../../components/TemplateTabs";
import toast from "react-hot-toast";

const TOOLBAR_ICONS = [
  "mdi:content-cut",
  "mdi:content-copy",
  "mdi:content-paste",
  "mdi:undo",
  "mdi:redo",
  "mdi:table",
  "mdi:format-align-justify",
  "mdi:emoticon-outline",
  "mdi:omega",
  "mdi:link",
  "mdi:link-off",
  "mdi:arrow-expand-all",
  "mdi:format-bold",
  "mdi:format-italic",
  "mdi:format-strikethrough-variant",
  "mdi:format-list-numbered",
  "mdi:format-list-bulleted",
  "mdi:format-indent-decrease",
  "mdi:format-indent-increase",
  "mdi:format-align-left",
  "mdi:format-align-center",
  "mdi:format-align-right",
  "mdi:format-align-justify",
];

const toolbarButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  padding: "6px 8px",
  fontSize: 16,
  color: "#4b5563",
};

const CodeYourOwn = () => {
  const router = useRouter();
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");

  const handleToolbarClick = (icon: string) => {
    // TODO: wire to a real rich-text editor (e.g. CKEditor/TipTap) exec command for this icon
    toast(`Editor action: ${icon.split(":")[1]}`, { icon: "✏️" });
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    // TODO: call your save-template mutation here
    toast.success("Template saved");
    router.push("/marketing/campaigns/template-list");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Create Code Your Own Template</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm">
            My Template
          </Button>
          <Button variant="dark" size="sm" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <TemplateTabs active="code-your-own" />

      <div className="d-flex gap-3 flex-wrap mb-3">
        <Form.Control
          style={{ maxWidth: 320 }}
          type="text"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <Form.Control
          style={{ maxWidth: 320 }}
          type="text"
          placeholder="Template Subject"
          value={templateSubject}
          onChange={(e) => setTemplateSubject(e.target.value)}
        />
      </div>

      <Form.Label className="fw-semibold text-primary">Description</Form.Label>
      <div style={{ border: "1px solid #d9dee8", borderRadius: 6 }}>
        <div
          className="d-flex flex-wrap align-items-center border-bottom"
          style={{ background: "#f8f9fb", padding: "4px 6px" }}
        >
          {TOOLBAR_ICONS.map((icon, i) => (
            <button key={`${icon}-${i}`} type="button" style={toolbarButtonStyle} onClick={() => handleToolbarClick(icon)}>
              <IconifyIcon icon={icon} />
            </button>
          ))}
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          style={{ minHeight: 260, padding: 14, outline: "none" }}
        />
      </div>

      <div className="d-flex justify-content-end mt-3">
        <Button style={{ background: "#f58220", border: "none" }} onClick={handleSave}>
          <IconifyIcon icon="mdi:content-save-outline" className="me-1" /> Save
        </Button>
      </div>
    </>
  );
};

export default CodeYourOwn;
