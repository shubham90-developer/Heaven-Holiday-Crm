"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useBulkUploadB2CLeadsMutation } from "@/store/services/b2cLeadApi";
import toast from "react-hot-toast";

const CustomerBulkUpload = () => {

  const [file, setFile] = useState<File | null>(null);
  const [bulkUpload, { isLoading }] = useBulkUploadB2CLeadsMutation();

  const handleDownloadTemplate = () => {
    const headers = ["email", "mobile", "salutation", "firstName", "lastName", "leadSource", "remarks"];
    const csvContent = headers.join(",") + "\n";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "b2c_lead_template.csv";
    a.click();
  };

  // 📁 File select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // 🚀 Upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res: any = await bulkUpload(formData).unwrap();

      toast.success(
        `✅ ${res.inserted} uploaded | ❌ ${res.failed} failed`
      );

      setFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed ❌");
    }
  };

  return (
    <>
      <Card className="p-3">
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-center mb-0 border-bottom pb-2">
            {/* Left Section */}
            <div className="d-flex align-items-center gap-2">
              <h6>Customer Bulk Upload</h6>
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
                    {isLoading ? (
                      <>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:upload" className="me-1" />
                        Upload
                      </>
                    )}
                    {/* Upload <Icon icon="mdi:download" className="ms-1" /> */}
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

export default CustomerBulkUpload;
