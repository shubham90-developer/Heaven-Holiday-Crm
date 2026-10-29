"use client"
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useBulkUploadB2CLeadsMutation } from "@/store/services/b2cLeadApi";
import toast from "react-hot-toast";

const LeadBulkUpload = () => {

  const [file, setFile] = useState<File | null>(null);
  const [campaignName, setCampaignName] = useState("");

  const [bulkUpload, { isLoading }] = useBulkUploadB2CLeadsMutation();

  const handleDownloadTemplate = () => {
    const headers = [
      "email",
      "mobile",
      "salutation",
      "firstName",
      "lastName",
      "leadSource",
      "leadStage"
    ];

    // Sample row (VERY important for usability)
    const sampleRow = [
      "john.doe@gmail.com",
      "9876543210",
      "Mr.",
      "John",
      "Doe",
      "4514",
      "New"
    ];

    const csvContent =
      headers.join(",") + "\n" +
      sampleRow.join(",");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "b2c_lead_template.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  // 🚀 Upload handler
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("campaignName", campaignName);

    try {
      const res = await bulkUpload(formData).unwrap();

      toast.success(`Uploaded: ${res.inserted}, Failed: ${res.failed}`);

      // reset
      setFile(null);
      setCampaignName("");

    } catch (error: any) {
      console.error(error);
      toast.error("Upload failed");
    }
  };

  return (
    <>
      <Card className="p-3">
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-center mb-0 border-bottom pb-2">
            {/* Left Section */}
            <div className="d-flex align-items-center gap-2">
              <h6>Bulk Upload Lead</h6>
            </div>
            {/* right side */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={handleDownloadTemplate}
              >
                <Icon icon="mdi:cloud-download" className="me-1" /> Download
                Template
              </Button>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "130px" }}>
                  <Form.Control
                    type="text"
                    placeholder="campaign name"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    style={{ fontSize: "10px" }}
                  />
                </th>

                <th style={{ width: "260px" }}>
                  {" "}
                  <Form.Control
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ fontSize: "10px" }}
                  />
                </th>

                <th style={{ width: "140px" }}>
                  {" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleUpload}
                    disabled={isLoading}
                    style={{ fontSize: "10px", fontWeight: "600" }}
                  >
                    {isLoading ? "Uploading..." : "Upload"}
                    <Icon icon="mdi:download" className="ms-1" />
                  </Button>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </Card>

      <Card className="p-3">
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-center mb-0 border-bottom pb-2">
            {/* Left Section */}
            <div className="d-flex align-items-center gap-2">
              <h6>Bulk Upload Lead</h6>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead
              style={{
                fontSize: "10px",
                whiteSpace: "nowrap",
                background: "#274c6b",
                color: "#fff",
              }}
            >
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "130px", color: "#fff" }}>
                  Lead Source Id
                </th>

                <th style={{ width: "130px", color: "#fff" }}>Lead Source</th>
              </tr>
            </thead>
            <tbody
              style={{
                fontSize: "10px",
              }}
            >
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
              <tr>
                <td>4513</td>
                <td>Agency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default LeadBulkUpload;
