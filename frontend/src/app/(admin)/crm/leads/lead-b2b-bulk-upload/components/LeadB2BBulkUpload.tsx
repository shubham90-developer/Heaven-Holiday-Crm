"use client"
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useBulkUploadB2BLeadsMutation } from "@/store/services/b2bLeadApi";
import toast from "react-hot-toast";

const LeadB2BBulkUpload = () => {

  const [file, setFile] = useState<File | null>(null);
  const [campaignName, setCampaignName] = useState("");

  const [bulkUpload, { isLoading }] = useBulkUploadB2BLeadsMutation();

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // optional (if backend supports)
    formData.append("campaignName", campaignName);

    try {
      const res = await bulkUpload(formData).unwrap();
      console.log("Upload success:", res);

      toast.success(`File successfully uploaded`);

      // reset
      setFile(null);
      setCampaignName("");

    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "type",
      "companyName",
      "email",
      "salutation",
      "firstName",
      "lastName",
      "mobile",
      "rm",
      "leadSource",
      "country",
      "state",
      "city",
      "area",
      "pincode",
      "address",
      "remarks"
    ];

    // Optional: Add one dummy row for clarity (VERY useful for users)
    const sampleRow = [
      "agency",
      "ABC Travels Pvt Ltd",
      "abc@gmail.com",
      "Mr.",
      "Rahul",
      "Sharma",
      "9876543210",
      "RM001",
      "4513",
      "India",
      "Maharashtra",
      "Mumbai",
      "Andheri",
      "400001",
      "Street 1, Andheri East",
      "Important client"
    ];

    const csvContent =
      headers.join(",") + "\n" +
      sampleRow.join(",");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "b2b_lead_template.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="p-3">
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-center mb-0 border-bottom pb-2">
            {/* Left Section */}
            <div className="d-flex align-items-center gap-2">
              <h6>Bulk Upload(B2B Lead)</h6>
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
                    placeholder="name@example.com"
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
              <h6>Bulk Upload(B2B Lead)</h6>
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

export default LeadB2BBulkUpload;
