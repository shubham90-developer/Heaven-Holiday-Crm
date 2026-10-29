"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";

// TODO: replace with real templates from your template-list API
const TEMPLATES = [
  { id: "7518", name: "Dubai", updatedOn: "22-Jul-25", updatedBy: "RAJENDRA BUGADE", tag: "Master template" },
  { id: "6761", name: "HONGKONG", updatedOn: "16-May-24", updatedBy: "RAJENDRA BUGADE", tag: "Master template" },
  {
    id: "6262",
    name: "DUBAI ABU DHABI TOUR WITH A HEAVEN HOLIDAY",
    updatedOn: "29-Dec-23",
    updatedBy: "RAJENDRA BUGADE",
    tag: "Master template",
  },
  { id: "6259", name: "DUBAI 59911", updatedOn: "29-Dec-23", updatedBy: "RAJENDRA BUGADE", tag: "Master template" },
];

const TemplateList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignName = searchParams.get("campaignName");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  const goToCreateTemplate = () => {
    const qs = searchParams.toString();
    router.push(qs ? `/marketing/campaigns/create-template?${qs}` : "/marketing/campaigns/create-template");
  };

  const handleAction = (action: string, templateName: string) => {
    toast(`${action}: ${templateName}`, { icon: "🚧" });
  };

  // Coming from a template row's "Create Campaign" action: send that template into the campaign flow
  const handleCreateCampaign = (templateId: string, templateName: string) => {
    router.push(`/marketing/campaigns/create-campaign?templateId=${templateId}&templateName=${encodeURIComponent(templateName)}`);
  };

  return (
    <Card className="p-3">
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
          {/* Left Section */}
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              style={{ fontSize: "10px", fontWeight: "bold" }}
              onClick={() => toast("Use Existing Campaigns is coming soon", { icon: "🚧" })}
            >
              <Icon icon="mdi:card-multiple-outline" className="me-1" /> Use Existing Campaigns
            </Button>
          </div>

          {/* right side */}
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              style={{ fontSize: "10px", fontWeight: "bold" }}
              onClick={goToCreateTemplate}
            >
              <Icon icon="mdi:plus" className="me-1" /> Create Email Template
            </Button>
          </div>
        </div>

        <Row className="align-items-center">
          <Col lg={8}>
            <h6 className="fw-bold">
              Total Record Found :- <span className="text-primary">{TEMPLATES.length}</span>
            </h6>
            {campaignName && (
              <span className="text-muted" style={{ fontSize: 12 }}>
                Campaign: {campaignName}
              </span>
            )}
          </Col>
          <Col lg={4}>
            <input type="search" className="form-control" placeholder="Search..." style={{ fontSize: "10px" }} />
          </Col>
        </Row>
      </div>

      <div className="table-responsive">
        <table
          className="table table-sm table-bordered mb-0 align-middle"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <thead>
            <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
              <th style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  checked={selectedTemplates.length === TEMPLATES.length}
                  onChange={(e) =>
                    setSelectedTemplates(e.target.checked ? TEMPLATES.map((t) => t.id) : [])
                  }
                />
              </th>
              <th style={{ width: "90px" }}>Template Id</th>
              <th>Template Name</th>
              <th style={{ width: "160px" }}>Updated On</th>
              <th style={{ width: "90px" }} className="text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody style={{ fontSize: "12px" }}>
            {TEMPLATES.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
                  No templates found
                </td>
              </tr>
            )}

            {TEMPLATES.map((tpl) => (
              <tr key={tpl.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTemplates.includes(tpl.id)}
                    onChange={(e) =>
                      setSelectedTemplates((prev) =>
                        e.target.checked ? [...prev, tpl.id] : prev.filter((id) => id !== tpl.id)
                      )
                    }
                  />
                </td>
                <td>{tpl.id}</td>
                <td>
                  <div className="fw-semibold">{tpl.name}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>
                    {tpl.tag}
                  </div>
                </td>
                <td>
                  Last edited on {tpl.updatedOn} by {tpl.updatedBy}
                </td>
                <td>
                  <div className="d-flex flex-column gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      style={{ fontSize: "8px" }}
                      onClick={() => handleAction("Edit", tpl.name)}
                    >
                      <Icon icon="mdi:pencil-outline" />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      style={{ fontSize: "8px" }}
                      onClick={() => handleAction("Preview", tpl.name)}
                    >
                      <Icon icon="mdi:eye-outline" />
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      style={{ fontSize: "8px" }}
                      onClick={() => handleCreateCampaign(tpl.id, tpl.name)}
                    >
                      <Icon icon="mdi:bullhorn-outline" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TemplateList;
