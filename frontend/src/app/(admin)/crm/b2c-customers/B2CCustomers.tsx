"use client";

import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import Filter from "./Filter";
import AddCustomerModal from "./AddCustomerModal";
import ReminderEmailModal from "./ReminderEmailModal";
import { useRouter } from "next/navigation";
import { useGetStaffQuery } from "@/store/services/staff-management/staff/staffApi";
import { useGetB2CLeadsQuery, useFilterB2CLeadsQuery, useAssignB2CLeadsMutation } from "@/store/services/b2cLeadApi";
import toast from "react-hot-toast";

const B2CCustomers = () => {
  const { data, isLoading, isError } = useGetB2CLeadsQuery({});
  const [filters, setFilters] = useState<any>({});
  const [isFiltered, setIsFiltered] = useState(false);
  const [deactivatedLeads, setDeactivatedLeads] = useState<string[]>([]);
  const { data: staffData, isLoading: staffLoading } = useGetStaffQuery({});
  const [assignB2CLeads, { isLoading: assigning }] = useAssignB2CLeadsMutation();

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  const {
    data: filteredData,
    isFetching,
  } = useFilterB2CLeadsQuery(filters, {
    skip: !isFiltered, // ❗ important
  });

  const handleApplyFilters = (filtersData: any) => {
    const hasFilters = Object.values(filtersData).some((v) => v !== "");

    if (!hasFilters) {
      setIsFiltered(false);
      return;
    }

    setFilters(filtersData);
    setIsFiltered(true);
  };
  const router = useRouter();

  // const leadsData = Array.isArray(data?.data) ? data.data : [];
  const leadsData = isFiltered
    ? filteredData?.data || []
    : data?.data || [];

  const handleIcon = (leadId: string) => {
    const isDeactivated = deactivatedLeads.includes(leadId);

    if (!isDeactivated) {
      const confirmed = window.confirm(
        "Are you sure you want to deactivate this customer?"
      );

      if (!confirmed) return;

      setDeactivatedLeads((prev) => [...prev, leadId]);
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to activate this customer?"
      );

      if (!confirmed) return;

      setDeactivatedLeads((prev) =>
        prev.filter((id) => id !== leadId)
      );
    }
  };

  const handleAssignB2CLeads = async () => {
    if (!selectedLeads.length) {
      toast.error("Please select at least one lead");
      return;
    }
    if (!selectedStaff) {
      toast.error("Please select a staff member");
      return;
    }
    try {
      await assignB2CLeads({ leadIds: selectedLeads, staffId: selectedStaff }).unwrap();
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
        <Filter onApplyFilters={handleApplyFilters} />
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
                onClick={handleAssignB2CLeads}
              >
                {assigning ? "Assigning..." : "Assign"}
              </Button>
            </div>

            {/* right side */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={() =>
                  router.push("/crm/b2c-customers/customer-bulk-upload")
                }
              >
                <Icon icon="mdi:file-import" className="me-1" /> Bulk import
              </Button>
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
                Total Record Found :- <span className="text-primary">{isLoading ? "..." : leadsData.length}</span>
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

                <th style={{ width: "260px" }}>Name / Mobile</th>

                <th style={{ width: "100px" }}>Source</th>

                <th style={{ width: "140px" }}>RM</th>

                <th style={{ width: "110px" }}>Last Updated</th>

                <th style={{ width: "90px" }}>Status</th>

                <th style={{ width: "70px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {/* Loading */}
              {isLoading && (
                <tr>
                  <td colSpan={7} className="text-center">
                    Loading customers...
                  </td>
                </tr>
              )}

              {/* Error */}
              {isError && (
                <tr>
                  <td colSpan={7} className="text-center text-danger">
                    Failed to load data
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!isLoading && leadsData.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No customers found
                  </td>
                </tr>
              )}

              {/* Data */}
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

                  {/* NAME */}
                  <td>
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

                  {/* SOURCE */}
                  <td>{lead.leadSource}</td>

                  {/* RM */}
                  <td>{lead.assignedOwner?.name || "NA"}</td>

                  {/* DATE */}
                  <td>
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })
                      : "NA"}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className="badge bg-success">
                      {lead.leadStage || "New"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <Button
                        variant="success"
                        size="sm"
                        style={{ fontSize: "8px" }}
                        onClick={() => { router.push(`/crm/leads/view-leads?id=${lead._id}`) }}
                      >
                        <Icon icon="mdi:eye-outline" />
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        style={{ fontSize: "8px" }}
                        onClick={() => handleIcon(lead._id)}
                      >
                        <Icon icon={
                          deactivatedLeads.includes(lead._id)
                            ? "mdi:close"
                            : "mdi:check"
                        } />
                      </Button>

                      <ReminderEmailModal />
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

export default B2CCustomers;
