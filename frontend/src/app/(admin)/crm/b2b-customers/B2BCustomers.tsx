"use client";

import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import Filter from "./Filter";
import AddCustomerModal from "./AddCustomerModal";
import { useGetStaffQuery } from "@/store/services/staff-management/staff/staffApi";
import { useGetB2BLeadsQuery, useFilterB2BLeadsQuery, useAssignB2BLeadsMutation } from "@/store/services/b2bLeadApi";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

const B2BCustomers = () => {

  const router = useRouter();
  // store filters
  const [filters, setFilters] = useState({});
  const [customericon, setCustomerIcon] = useState("check");
  const { data: staffData, isLoading: staffLoading } = useGetStaffQuery({});
  const [assignB2BLeads, { isLoading: assigning }] = useAssignB2BLeadsMutation();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  // detect if filter is applied
  const isFilterApplied = Object.keys(filters).length > 0;
  // Fetch RTK
  const {
    data: defaultData,
    isLoading: defaultLoading,
    isError: defaultError,
  } = useGetB2BLeadsQuery({}, { skip: isFilterApplied });
  // filter API
  const {
    data: filterData,
    isLoading: filterLoading,
    isError: filterError,
  } = useFilterB2BLeadsQuery(filters, { skip: !isFilterApplied });
  // final data source
  const leadsData = isFilterApplied
    ? filterData?.data || []
    : defaultData?.data || [];

  const isLoading = isFilterApplied ? filterLoading : defaultLoading;
  const isError = isFilterApplied ? filterError : defaultError;

  const handleIcon = () => {
    if (customericon === "check") {
      alert("Are you sure you want to deactivate this customer?");
      setCustomerIcon("close");
    }
    else {
      alert("Are you sure you want to activate this customer?");
      setCustomerIcon("check");
    }
  }

  const handleAssignB2BLeads = async () => {
    if (!selectedLeads.length) {
      toast.error("Please select at least one lead");
      return;
    }
    if (!selectedStaff) {
      toast.error("Please select a staff member");
      return;
    }
    try {
      await assignB2BLeads({ leadIds: selectedLeads, staffId: selectedStaff }).unwrap();
      toast.success("Leads assigned successfully");
      setSelectedLeads([]);
      setSelectedStaff("");
    } catch (err) {
      toast.error("Failed to assign leads");
    }
  }


  return (
    <>
      {/* filter */}
      <div className="mb-2">
        <Filter onApplyFilter={setFilters} />
      </div>
      <Card className="p-3">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            {/* Left Section */}

            <div className="d-flex align-items-center gap-2">
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="form-select form-select-sm w-auto"
                style={{ fontSize: "10px" }}
              >
                <option value="">
                  {staffLoading ? "Loading Staff..." : "Select Users"}
                </option>
                {staffData?.data?.map((staff: any) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.firstName} {staff.lastName}
                  </option>
                ))}
              </select>

              <Button
                variant="outline-primary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                disabled={assigning}
                onClick={handleAssignB2BLeads}
              >
                {assigning ? "Assigning..." : "Assign"}
              </Button>
            </div>

            {/* right side */}
            <div className="d-flex align-items-center gap-2">
              <AddCustomerModal />

              <Button
                variant="outline-secondary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
              >
                <Icon icon="mdi:file-export" />
              </Button>
            </div>
          </div>
          <Row className="align-items-center">
            {/* Right Section */}
            <Col lg={8}>
              <h6 className="fw-bold">
                Total Record Found :- <span className="text-primary">{leadsData.length}</span>
              </h6>
            </Col>
            <Col lg={4}>
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
                <th style={{ width: "40px" }}>
                  <Form.Check
                    type="checkbox"
                    checked={selectedLeads.length === leadsData.length && leadsData.length > 0}
                    onChange={(e) => {
                      setSelectedLeads(e.target.checked ? leadsData.map((l: any) => l._id) : []);
                    }}
                  />
                </th>

                <th style={{ width: "100px" }}>Agency Id</th>

                <th style={{ width: "260px" }}>Agency Details</th>

                <th style={{ width: "140px" }}>Lead Source</th>

                <th style={{ width: "110px" }}>RM</th>
                <th style={{ width: "110px" }}>Last Updated</th>

                <th style={{ width: "90px" }}>Status</th>

                <th style={{ width: "70px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="text-center">
                    Loading customers...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={8} className="text-center text-danger">
                    Failed to load data
                  </td>
                </tr>
              )}

              {!isLoading && leadsData.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center">
                    No customers found
                  </td>
                </tr>
              )}

              {leadsData.map((lead: any) => (
                <tr key={lead._id}>
                  <td>
                    <Form.Check
                      checked={selectedLeads.includes(lead._id)}
                      onChange={(e) => {
                        setSelectedLeads((prev) =>
                          e.target.checked
                            ? [...prev, lead._id]
                            : prev.filter((id) => id !== lead._id)
                        );
                      }}
                    />
                  </td>

                  {/* Agency Id */}
                  <td>{lead._id || "NA"}</td>

                  {/* Agency Details */}
                  <td>
                    <div className="fw-semibold">
                      <Icon icon="mdi:building" className="me-1" />
                      {lead.companyName || "NA"}
                    </div>
                    <div className="fw-semibold">
                      <Icon icon="mdi:account" className="me-1" />
                      {lead.salutation} {lead.firstName} {lead.lastName}
                    </div>
                    <div>
                      <Icon icon="mdi:phone" className="me-1" />
                      +91 {lead.mobile}
                    </div>
                    <div>
                      <Icon icon="mdi:email-outline" className="me-1" />
                      {lead.email}
                    </div>
                  </td>

                  {/* Lead Source */}
                  <td>{lead.leadSource || "NA"}</td>

                  {/* RM */}
                  <td>{lead.assignedOwner?.name || "NA"}</td>

                  {/* Last Updated */}
                  <td>
                    {lead.updatedAt
                      ? new Date(lead.updatedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })
                      : "NA"}
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`badge bg-${lead.leadStage === "New" ? "success" : "secondary"}`}>
                      {lead.leadStage || "New"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="text-center">
                    <div className="d-flex flex-column gap-1">
                      <Button variant="success" size="sm" style={{ fontSize: "8px" }} onClick={() => { router.push(`/crm/leads/view-leads?id=${lead._id}`) }}>
                        <Icon icon="mdi:eye-outline" />
                      </Button>
                      <Button variant="danger" size="sm" style={{ fontSize: "8px" }}
                        onClick={handleIcon}>
                        <Icon icon={customericon === "check" ? "mdi:check" : "mdi:close"} />
                      </Button>
                      {/* <ReminderEmailModal /> */}
                    </div>
                  </td>
                </tr>
              ))}
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
    </>
  );
};

export default B2BCustomers;
