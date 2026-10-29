"use client";

import React, { useState } from "react";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetArchivedLeadsQuery } from "@/store/services/leadsApi";

const ArchivedLeads = () => {
  const { data, isLoading, isError } = useGetArchivedLeadsQuery({});

  const leads = data?.data || [];

  if (isLoading) {
    return <p>Loading archived leads...</p>;
  }

  if (isError) {
    return <p>Error fetching archived leads</p>;
  }
  
  return (
    <>
      <Card className="p-3">
        <div className="mb-4">
          <Row className="align-items-center">
            {/* Right Section */}
            <Col lg={4}>
              <h6 className="fw-bold">
                Total Record Found :- <span className="text-primary">{leads.length}</span>
              </h6>
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
                style={{ fontSize: "10px" }}
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
                <th style={{ width: "260px" }}>Name / Mobile</th>

                <th style={{ width: "100px" }}>Date of Lead</th>

                <th style={{ width: "140px" }}>Source</th>

                <th style={{ width: "110px" }}> Owner</th>

                <th style={{ width: "90px" }}>Stage</th>

                <th style={{ width: "70px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No archived leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead._id}>
                    <td>
                      <div className="fw-semibold">
                        <Icon icon="mdi:account" className="me-1" />
                        {lead.firstName || "-"} {lead.lastName || ""}
                      </div>

                      <div>
                        <Icon icon="mdi:phone" className="me-1" />
                        {lead.mobile || "-"}
                      </div>

                      <div>
                        <Icon icon="mdi:email-outline" className="me-1" />
                        {lead.email || "-"}
                      </div>
                    </td>

                    <td>
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>{lead.leadSource || "-"}</td>

                    <td>{lead.assignedTo || "Unassigned"}</td>

                    <td>{lead.computedStage || "-"}</td>

                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Button
                          variant="success"
                          size="sm"
                          style={{ fontSize: "10px" }}
                          title="View"
                          onClick={()=>alert("Are you sure, you want to active this query")}
                        >
                          <Icon icon="mdi:check" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="primary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "600" }}
          >
            Load More <Icon icon="mdi:reload" className="ms-1" />
          </Button>
        </div>
      </Card>

      {/* message modal */}
    </>
  );
};

export default ArchivedLeads;
