"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";

// TODO: replace with real landing-page templates from your API
type LandingTemplate = {
  id: string;
  templateName: string;
  agencyName: string;
  bannerText1: string;
  bannerText2: string;
  mainPackageHeading: string;
  display: boolean;
  type: number; // maps to the "type" segment used on the edit page
};

const TEMPLATES: LandingTemplate[] = [
  {
    id: "3836",
    templateName: "DUBAI ABU DHABI TOUR WITH A HEAVEN HOLIDAY",
    agencyName: "A HEAVEN HOSPITALITY PVT LTD",
    bannerText1: "Banner Main Heading",
    bannerText2: "THINK DUBAI THINK A HEAVEN",
    mainPackageHeading: "Popular Tours",
    display: false,
    type: 4,
  },
  {
    id: "3835",
    templateName: "Dubai Visa",
    agencyName: "A HEAVEN HOSPITALITY PVT LTD",
    bannerText1: "Amazing Dubai Visa deal with a heaven holiday",
    bannerText2: "Dubai Visa",
    mainPackageHeading: "Popular Tours",
    display: false,
    type: 4,
  },
];

const TEMPLATE_FILTERS = [
  "Template 1 (1*12)",
  "Template 2 (2*6)",
  "Template 3 (3*4)",
  "Template 4 (Visa - 3*4)",
  "Template 5 (3*4)",
  "Template 6",
  "Template 7",
];

const ManageLandingPageList = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState(0);

  const goToEdit = (tpl: LandingTemplate) => {
    router.push(
      `/marketing/manage-landing-page/edit-template/${tpl.id}/${tpl.type}`,
    );
  };

  const handlePreview = (tpl: LandingTemplate) => {
    // TODO: open the public landing-page preview URL for this template
    toast(`Preview: ${tpl.templateName}`, { icon: "🚧" });
  };

  const handleRemove = (tpl: LandingTemplate) => {
    // TODO: call delete/disable API, then refetch
    toast(`Remove: ${tpl.templateName}`, { icon: "🚧" });
  };

  const handleCopy = (tpl: LandingTemplate) => {
    // TODO: call duplicate-template API, then refetch
    toast(`Duplicated: ${tpl.templateName}`, { icon: "🚧" });
  };

  const toggleDisplay = (id: string) => {
    // TODO: call API to toggle "Display" flag for this template
    toast("Display flag updated", { icon: "🚧" });
  };

  return (
    <Card className="p-3">
      <h5 className="fw-bold mb-3">My List</h5>

      <div className="d-flex flex-wrap gap-2 mb-3 pb-3 border-bottom">
        {TEMPLATE_FILTERS.map((label, idx) => (
          <Button
            key={label}
            variant={activeFilter === idx ? "primary" : "outline-primary"}
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => setActiveFilter(idx)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="table-responsive">
        <table
          className="table table-sm table-bordered mb-0 align-middle"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <thead>
            <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
              <th style={{ width: "60px" }}>Id</th>
              <th>Template Name</th>
              <th>Agency Name</th>
              <th>Banner Text 1</th>
              <th>Banner Text 2</th>
              <th style={{ width: "130px" }}>Main Package Heading</th>
              <th style={{ width: "70px" }}>Display</th>
              <th style={{ width: "110px" }} className="text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody style={{ fontSize: "12px" }}>
            {TEMPLATES.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center">
                  No templates found
                </td>
              </tr>
            )}

            {TEMPLATES.map((tpl) => (
              <tr key={tpl.id}>
                <td>{tpl.id}</td>
                <td className="fw-semibold">{tpl.templateName}</td>
                <td>{tpl.agencyName}</td>
                <td>{tpl.bannerText1}</td>
                <td>{tpl.bannerText2}</td>
                <td>{tpl.mainPackageHeading}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={tpl.display}
                    onChange={() => toggleDisplay(tpl.id)}
                  />
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      style={{ fontSize: "8px" }}
                      onClick={() => goToEdit(tpl)}
                    >
                      <Icon icon="mdi:pencil-outline" />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      style={{ fontSize: "8px" }}
                      onClick={() => handlePreview(tpl)}
                    >
                      <Icon icon="mdi:eye-outline" />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      style={{ fontSize: "8px" }}
                      onClick={() => handleRemove(tpl)}
                    >
                      <Icon icon="mdi:minus" />
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      style={{ fontSize: "8px" }}
                      onClick={() => handleCopy(tpl)}
                    >
                      <Icon icon="mdi:content-copy" />
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

export default ManageLandingPageList;
