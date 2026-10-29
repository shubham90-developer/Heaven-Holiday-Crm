"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";

// TODO: replace with real default/auto-follow-up campaigns from your API
type DefaultCampaign = {
  id: string;
  name: string;
  templateName: string;
  launchStatus: "Draft" | "Scheduled" | "Sent";
  launchDate: string;
  recipients: number;
  category: "birthday" | "anniversary" | "first-follow-up" | "second-follow-up";
};

const CAMPAIGNS: DefaultCampaign[] = [
  {
    id: "1",
    name: "BIRTHDAY_8A2E2D5D-03BD-40C9-BA07-277447186DFA",
    templateName: "Auto follow up",
    launchStatus: "Draft",
    launchDate: "--",
    recipients: 1,
    category: "birthday",
  },
  {
    id: "2",
    name: "After5Days_38003_2026-09-15",
    templateName: "Auto follow up",
    launchStatus: "Draft",
    launchDate: "--",
    recipients: 2,
    category: "first-follow-up",
  },
  {
    id: "3",
    name: "BIRTHDAY_66D30B78-2287-44E4-906D-DF0336D85399",
    templateName: "Auto follow up",
    launchStatus: "Draft",
    launchDate: "--",
    recipients: 2,
    category: "birthday",
  },
  {
    id: "4",
    name: "BIRTHDAY_130D5826-C917-4442-8CA4-FD487F739134",
    templateName: "Auto follow up",
    launchStatus: "Draft",
    launchDate: "--",
    recipients: 1,
    category: "birthday",
  },
  {
    id: "5",
    name: "AutoFollowup_38003_2026-09-15",
    templateName: "Auto follow up",
    launchStatus: "Draft",
    launchDate: "--",
    recipients: 2,
    category: "second-follow-up",
  },
  {
    id: "6",
    name: "BIRTHDAY_6955EAB2-AEDE-42D8-ADF9-6BD98DFA2D8C",
    templateName: "Auto follow up",
    launchStatus: "Draft",
    launchDate: "--",
    recipients: 1,
    category: "birthday",
  },
];

const FILTERS: { key: "all" | DefaultCampaign["category"]; label: string }[] = [
  { key: "birthday", label: "Birthday Greetings" },
  { key: "anniversary", label: "Anniversary Greeting" },
  { key: "first-follow-up", label: "First Auto Follow Up" },
  { key: "second-follow-up", label: "Second Auto Follow Up" },
  { key: "all", label: "Overall" },
];

const DefaultCampaignsList = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | DefaultCampaign["category"]
  >("all");

  const filtered =
    activeFilter === "all"
      ? CAMPAIGNS
      : CAMPAIGNS.filter((c) => c.category === activeFilter);

  const goToCreateCampaign = () => {
    router.push("/marketing/campaigns/create-campaign");
  };

  const handleDelete = () => {
    if (selected.length === 0) {
      toast("Select at least one campaign to delete", { icon: "⚠️" });
      return;
    }
    // TODO: call delete API, then remove from state / refetch
    toast(`Delete: ${selected.length} campaign(s)`, { icon: "🚧" });
    setSelected([]);
  };

  const handleAction = (campaign: DefaultCampaign) => {
    // TODO: route to your edit/view flow for default campaigns once it exists
    router.push(
      `/marketing/campaigns/create-campaign?campaignId=${campaign.id}`,
    );
  };

  return (
    <Card className="p-3">
      <h5 className="fw-bold mb-3">My Campaigns</h5>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div className="d-flex flex-wrap gap-2">
          <Button
            variant="outline-danger"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={handleDelete}
          >
            <Icon icon="mdi:trash-can-outline" className="me-1" /> Delete
          </Button>

          {FILTERS.map((f) => (
            <Button
              key={f.key}
              variant={activeFilter === f.key ? "primary" : "outline-secondary"}
              size="sm"
              style={{ fontSize: "10px", fontWeight: "bold" }}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          style={{ fontSize: "10px", fontWeight: "bold" }}
          onClick={goToCreateCampaign}
        >
          <Icon icon="mdi:plus" className="me-1" /> Create Campaign
        </Button>
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
                    selected.length === filtered.length && filtered.length > 0
                  }
                  onChange={(e) =>
                    setSelected(
                      e.target.checked ? filtered.map((c) => c.id) : [],
                    )
                  }
                />
              </th>
              <th>Campaign Name</th>
              <th style={{ width: "130px" }}>Template Name</th>
              <th style={{ width: "100px" }}>Launch Status</th>
              <th style={{ width: "110px" }}>Launch Date</th>
              <th style={{ width: "90px" }}>Recipients</th>
              <th style={{ width: "70px" }} className="text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody style={{ fontSize: "12px" }}>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No campaigns found
                </td>
              </tr>
            )}

            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(c.id)}
                    onChange={(e) =>
                      setSelected((prev) =>
                        e.target.checked
                          ? [...prev, c.id]
                          : prev.filter((id) => id !== c.id),
                      )
                    }
                  />
                </td>
                <td className="text-primary fw-semibold">{c.name}</td>
                <td>{c.templateName}</td>
                <td>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">
                    {c.launchStatus}
                  </span>
                </td>
                <td>{c.launchDate}</td>
                <td>{c.recipients}</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    style={{ fontSize: "8px" }}
                    onClick={() => handleAction(c)}
                  >
                    <Icon icon="mdi:dots-vertical" />
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

export default DefaultCampaignsList;
