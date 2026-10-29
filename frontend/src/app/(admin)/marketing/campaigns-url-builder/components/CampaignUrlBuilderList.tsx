"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";

// TODO: replace with real generated URLs from your API
type CampaignUrl = {
  id: string;
  leadUrl: string;
  shortUrl: string;
  websiteLeadUrl: string;
};

const URLS: CampaignUrl[] = [];

const CampaignUrlBuilderList = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = URLS.filter(
    (u) =>
      u.leadUrl.toLowerCase().includes(search.toLowerCase()) ||
      u.shortUrl.toLowerCase().includes(search.toLowerCase()),
  );

  const goToGenerate = () => {
    router.push("/marketing/add-generate-url");
  };

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold mb-0">Campaign URL Builder</h5>
          <span className="text-muted" style={{ fontSize: 12 }}>
            {filtered.length} URLs
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          style={{ fontSize: "10px", fontWeight: "bold" }}
          onClick={goToGenerate}
        >
          <Icon icon="mdi:plus" className="me-1" /> Add / Generate URL
        </Button>
      </div>

      <input
        type="search"
        className="form-control mb-3"
        placeholder="Search URLs..."
        style={{ fontSize: "12px" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <Icon
            icon="mdi:share-variant-outline"
            style={{ fontSize: 40 }}
            className="text-muted mb-3"
          />
          <h6 className="fw-bold">No campaign URLs yet</h6>
          <Button
            variant="primary"
            size="sm"
            className="mt-2"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={goToGenerate}
          >
            <Icon icon="mdi:plus" className="me-1" /> Add / Generate URL
          </Button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-bordered mb-0 align-middle">
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "60px" }}>S.No</th>
                <th>Lead Url</th>
                <th>Short Url</th>
                <th>Website Lead Url</th>
                <th style={{ width: "80px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {filtered.map((u, idx) => (
                <tr key={u.id}>
                  <td>{idx + 1}</td>
                  <td>{u.leadUrl}</td>
                  <td>{u.shortUrl}</td>
                  <td>{u.websiteLeadUrl}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      style={{ fontSize: "8px" }}
                    >
                      <Icon icon="mdi:trash-can-outline" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default CampaignUrlBuilderList;
