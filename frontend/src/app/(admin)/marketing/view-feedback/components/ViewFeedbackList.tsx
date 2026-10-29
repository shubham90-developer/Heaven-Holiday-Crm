"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";

// UI only — replace with real feedback data from your API later
type Feedback = {
  id: string;
  status: string;
  date: string;
  name: string;
  mobile: string;
  email: string;
  destination: string;
  travelMonth: string;
  experience: string;
  reviewTitle: string;
  showOnWebsite: boolean;
};

const FEEDBACKS: Feedback[] = [
  {
    id: "1",
    status: "NA",
    date: "16-Dec-22 18:27",
    name: "Ram Kumar",
    mobile: "+917766554433",
    email: "ram@gmail.com",
    destination: "",
    travelMonth: "",
    experience: "5 Star",
    reviewTitle: "Test",
    showOnWebsite: true,
  },
];

const ViewFeedbackList = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = FEEDBACKS.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.destination.toLowerCase().includes(search.toLowerCase()) ||
      f.reviewTitle.toLowerCase().includes(search.toLowerCase()),
  );

  const goToGenerate = () => {
    router.push("/marketing/view-feedback/generate-url");
  };

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h5 className="fw-bold mb-0">Customer Feedback</h5>
          <span className="text-muted" style={{ fontSize: 12 }}>
            {filtered.length} reviews
          </span>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={goToGenerate}
          >
            <Icon icon="mdi:share-variant" className="me-1" /> Create & Share
            Feedback Link
          </Button>
          <Button
            variant="outline-success"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
          >
            <Icon icon="mdi:open-in-new" className="me-1" /> New View
          </Button>
        </div>
      </div>

      <input
        type="search"
        className="form-control mb-3"
        placeholder="Search by name, destination or title..."
        style={{ fontSize: "12px" }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-sm table-bordered mb-0 align-middle">
          <thead>
            <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
              <th style={{ width: "50px" }}>S.No</th>
              <th>Status</th>
              <th>Date</th>
              <th>Name / Mobile</th>
              <th>Destination</th>
              <th>Travel Month</th>
              <th>Experience</th>
              <th>Review Title</th>
              <th className="text-center">Website</th>
              <th style={{ width: "80px" }} className="text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "12px" }}>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center">
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((f, idx) => (
                <tr key={f.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <span className="badge bg-secondary-subtle text-secondary border">
                      {f.status}
                    </span>
                  </td>
                  <td>{f.date}</td>
                  <td>
                    <div className="d-flex align-items-center gap-1 fw-semibold">
                      <Icon icon="mdi:account-circle-outline" />
                      {f.name}
                    </div>
                    <div className="d-flex align-items-center gap-1 text-muted">
                      <Icon icon="mdi:phone-outline" />
                      {f.mobile}
                    </div>
                    <div className="d-flex align-items-center gap-1 text-muted">
                      <Icon icon="mdi:email-outline" />
                      {f.email}
                    </div>
                  </td>
                  <td>{f.destination || "—"}</td>
                  <td>{f.travelMonth || "—"}</td>
                  <td>{f.experience}</td>
                  <td>{f.reviewTitle}</td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={f.showOnWebsite}
                      readOnly
                      className="d-inline-block"
                    />
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-1 justify-content-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        style={{ fontSize: "10px" }}
                        title="view"
                      >
                        <Icon icon="mdi:eye-outline" />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        style={{ fontSize: "10px" }}
                        title="archive"
                      >
                        <Icon icon="mdi:archive-outline" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="text-muted mt-2" style={{ fontSize: 12 }}>
          Showing {filtered.length === 0 ? 0 : 1}-{filtered.length} of{" "}
          {filtered.length}
        </div>
      )}
    </Card>
  );
};

export default ViewFeedbackList;
