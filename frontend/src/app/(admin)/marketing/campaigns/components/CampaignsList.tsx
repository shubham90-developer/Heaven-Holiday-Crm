"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";

// TODO: replace with real campaigns from your campaigns-list API
type Campaign = {
  id: string;
  name: string;
  listName: string;
  templateName: string;
  launchStatus: "Draft" | "Scheduled" | "Sent";
  scheduleDate: string;
  launchDate: string;
  recipients: number;
};

const CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "h",
    listName: "B2B_All_Clients",
    templateName: "--",
    launchStatus: "Draft",
    scheduleDate: "23-Sep-26 10:59",
    launchDate: "--",
    recipients: 52,
  },
  {
    id: "2",
    name: "hvh",
    listName: "B2C_All_Clients",
    templateName: "--",
    launchStatus: "Draft",
    scheduleDate: "23-Sep-26 10:41",
    launchDate: "--",
    recipients: 3026,
  },
  {
    id: "3",
    name: "fdgg",
    listName: "PRAJWAL SIR",
    templateName: "--",
    launchStatus: "Draft",
    scheduleDate: "22-Sep-26 12:38",
    launchDate: "--",
    recipients: 1,
  },
  {
    id: "4",
    name: "aaaaaaa",
    listName: "B2C_All_Clients",
    templateName: "--",
    launchStatus: "Draft",
    scheduleDate: "22-Sep-26 12:00",
    launchDate: "--",
    recipients: 3026,
  },
  {
    id: "5",
    name: "sssssssss",
    listName: "SAIPRASAD SIR",
    templateName: "--",
    launchStatus: "Draft",
    scheduleDate: "22-Sep-26 11:36",
    launchDate: "--",
    recipients: 2,
  },
  {
    id: "6",
    name: "sffff",
    listName: "Customer_Birth_Month_Dec",
    templateName: "--",
    launchStatus: "Draft",
    scheduleDate: "22-Sep-26 11:28",
    launchDate: "--",
    recipients: 29,
  },
  {
    id: "7",
    name: "SINGAPORE MALAYSIA",
    listName: "B2C_All_Clients",
    templateName: "--",
    launchStatus: "Draft",
    scheduleDate: "04-Sep-26 17:47",
    launchDate: "--",
    recipients: 2996,
  },
];

const CampaignsList = () => {
  const router = useRouter();
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filtered = CAMPAIGNS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.listName.toLowerCase().includes(search.toLowerCase()),
  );

  const goToCreateCampaign = () => {
    router.push("/marketing/campaigns/create-campaign");
  };

  const handleEdit = (campaign: Campaign) => {
    // TODO: route to your edit-campaign page/flow once it exists
    router.push(
      `/marketing/campaigns/create-campaign?campaignId=${campaign.id}`,
    );
  };

  const handleDelete = () => {
    if (selectedCampaigns.length === 0) {
      toast("Select at least one campaign to delete", { icon: "⚠️" });
      return;
    }
    // TODO: call delete API, then remove from state / refetch
    toast(`Delete: ${selectedCampaigns.length} campaign(s)`, { icon: "🚧" });
    setSelectedCampaigns([]);
  };

  return (
    <Card className="p-3">
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
          {/* Left Section */}
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-danger"
              size="sm"
              style={{ fontSize: "10px", fontWeight: "bold" }}
              onClick={handleDelete}
            >
              <Icon icon="mdi:trash-can-outline" className="me-1" /> Delete
            </Button>
          </div>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              style={{ fontSize: "10px", fontWeight: "bold" }}
              onClick={goToCreateCampaign}
            >
              <Icon icon="mdi:plus" className="me-1" /> Create Campaign
            </Button>
          </div>
        </div>

        <Row className="align-items-center">
          <Col lg={8}>
            <h6 className="fw-bold">
              Total Record Found :-{" "}
              <span className="text-primary">{filtered.length}</span>
            </h6>
          </Col>
          <Col lg={4}>
            <input
              type="search"
              className="form-control"
              placeholder="Search by campaign, list or template..."
              style={{ fontSize: "10px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                  checked={
                    selectedCampaigns.length === filtered.length &&
                    filtered.length > 0
                  }
                  onChange={(e) =>
                    setSelectedCampaigns(
                      e.target.checked ? filtered.map((c) => c.id) : [],
                    )
                  }
                />
              </th>
              <th>Campaign Name</th>
              <th>List Name</th>
              <th style={{ width: "120px" }}>Template Name</th>
              <th style={{ width: "110px" }}>Launch Status</th>
              <th style={{ width: "140px" }}>Schedule Date</th>
              <th style={{ width: "140px" }}>Launch Date</th>
              <th style={{ width: "90px" }}>Recipients</th>
              <th style={{ width: "60px" }} className="text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody style={{ fontSize: "12px" }}>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center">
                  No campaigns found
                </td>
              </tr>
            )}

            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCampaigns.includes(c.id)}
                    onChange={(e) =>
                      setSelectedCampaigns((prev) =>
                        e.target.checked
                          ? [...prev, c.id]
                          : prev.filter((id) => id !== c.id),
                      )
                    }
                  />
                </td>
                <td className="fw-semibold">{c.name}</td>
                <td>{c.listName}</td>
                <td>{c.templateName}</td>
                <td>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">
                    {c.launchStatus}
                  </span>
                </td>
                <td>{c.scheduleDate}</td>
                <td>{c.launchDate}</td>
                <td>{c.recipients}</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    style={{ fontSize: "8px" }}
                    onClick={() => handleEdit(c)}
                  >
                    <Icon icon="mdi:pencil-outline" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CampaignsList;
