"use client";

import React, { useState } from "react";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import Filter from "./Filter";
import SendMessageModal from "./SendMessageModal";
import FollowupModal from "./FollowupModal";
import B2CLeadModal from "./B2CLeadModal";
import B2BLeadModal from "./B2BLeadModal";
import { useRouter } from "next/navigation";
import { useGetLeadsByTabQuery } from "../../../../../store/services/leadsApi"; // swapped
import { useFilterLeadsQuery } from "../../../../../store/services/leadsApi";
import { useGetStaffQuery } from "../../../../../store/services/staff-management/staff/staffApi";
import { useAssignLeadsMutation, useArchiveLeadsMutation, useGetUnassignedLeadsQuery } from "../../../../../store/services/leadsApi";
// import { useGetFollowUpsByLeadIdQuery } from "../../../../../store/services/followUpApi";
import toast from "react-hot-toast";
import LeadRow from "./LeadRow";

const Leads = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("+91 8421135320");
  const [activeTab, setActiveTab] = useState<string>("overall"); // added
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  // Fetch leads by tab
  const { data: leadsData,
    isLoading: tabLoading,       // ← renamed from isLoading
    isError: tabError } = useGetLeadsByTabQuery(
      activeTab === "overall" ? undefined : activeTab,
      { skip: activeTab === "unassigned" } // swapped
    );

  const {
    data: unassignedData,
    isLoading: unassignedLoading,
    isError: unassignedError,
  } = useGetUnassignedLeadsQuery(undefined, {
    skip: activeTab !== "unassigned",      // ← only fetch when unassigned tab is active
  });

  const { data: staffData, isLoading: staffLoading } = useGetStaffQuery({});

  const [assignLeads, { isLoading: assigning }] =
    useAssignLeadsMutation();

  const [archiveLeads, { isLoading: archiving }] = useArchiveLeadsMutation();

  const [filters, setFilters] = useState<any>({});
  const [applyFilter, setApplyFilter] = useState(false);

  const {
    data: filteredData,
    isLoading: filterLoading,
  } = useFilterLeadsQuery(filters, {
    skip: !applyFilter,
  });

  // ── derive finalLeads based on active state ───────────────────────────
  const finalLeads = applyFilter
    ? filteredData?.data || []
    : activeTab === "unassigned"
      ? unassignedData?.data || []
      : leadsData?.data || [];

  // ── derive loading & error based on active tab ────────────────────────
  const isLoading = applyFilter
    ? filterLoading
    : activeTab === "unassigned"
      ? unassignedLoading
      : tabLoading;

  const isError = activeTab === "unassigned" ? unassignedError : tabError;

  const handleArchive = async () => {
    if (!selectedLeads.length) {
      toast.error("Please select at least one lead to archive");
      return;
    }

    try {
      await archiveLeads({ leadIds: selectedLeads }).unwrap();
      toast.success("Leads archived successfully");
      setSelectedLeads([]);   // clear selection after archive
    } catch (error) {
      console.error(error);
      toast.error("Archiving failed");
    }
  };

  return (
    <>
      {/* filter */}
      <div className="mb-2">
        <Filter setFilters={setFilters} setApplyFilter={setApplyFilter} />
      </div>
      <Card className="p-3">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            {/* Left Section */}

            <div className="d-flex align-items-center gap-2">
              <select value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="form-select form-select-sm w-auto"
                style={{ fontSize: "10px" }}
              >
                <option value="">
                  {staffLoading ? "Loading Staff..." : "Select Staff"}
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
                onClick={async () => {
                  if (!selectedLeads.length) {
                    toast.error("Please select at least one lead to assign");
                    return;
                  }

                  if (!selectedStaff) {
                    toast.error("Please select a staff member to assign");
                    return;
                  }
                  try {
                    await assignLeads({
                      staffId: selectedStaff,
                      leadIds: selectedLeads,
                    }).unwrap();

                    toast.success("Leads assigned successfully");

                    setSelectedLeads([]);
                    setSelectedStaff("");
                  } catch (error) {
                    console.error(error);
                    toast.error("Assignment failed");
                  }
                }}
              >
                {assigning ? "Assigning..." : "Assign"}
              </Button>

              <Button
                variant="outline-primary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={handleArchive}
                disabled={archiving || selectedLeads.length === 0}
              >
                {archiving ? "Archiving..." : `Archive ${selectedLeads.length > 0 ? `(${selectedLeads.length})` : ""}`}
              </Button>
            </div>

            {/* right side */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-danger"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={() => router.push("/crm/leads/lead-bulk-upload")}
              >
                <Icon icon="mdi:upload" className="me-1" />
                B2C
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={() => router.push("/crm/leads/lead-b2b-bulk-upload")}
              >
                <Icon icon="mdi:upload" className="me-1" />
                B2B
              </Button>

              <B2CLeadModal />
              <B2BLeadModal />

              <Button
                variant="outline-secondary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={() => {
                  setActiveTab("overall");
                  setApplyFilter(false);
                  setFilters({});
                  setSelectedLeads([]);
                  setSelectedStaff("");
                }}
              >
                <Icon icon="mdi:refresh" />
              </Button>
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
            {/* Left Section */}
            <Col lg={8}>
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  style={{ fontSize: "10px", fontWeight: "600" }}
                  onClick={() => {
                    setActiveTab("inprocess")
                    setApplyFilter(false);
                  }}
                >
                  In Process
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  style={{ fontSize: "10px", fontWeight: "600" }}
                  onClick={() => {
                    setActiveTab("callback")
                    setApplyFilter(false);
                  }
                  }
                >
                  Callback Leads
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  style={{ fontSize: "10px", fontWeight: "600" }}
                  onClick={() => {
                    setActiveTab("overall")
                    setApplyFilter(false);
                  }
                  }
                >
                  Overall Leads
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  style={{ fontSize: "10px", fontWeight: "600" }}
                  onClick={() => {
                    setActiveTab("unassigned");
                    setApplyFilter(false);
                  }}
                >
                  Un-Assigned
                </Button>
              </div>
            </Col>

            {/* Right Section */}
            <Col lg={4}>
              <h6 className="fw-bold">
                Total Record Found :- <span className="text-primary">{finalLeads?.length ?? 0}</span>
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
                <th style={{ width: "40px" }}>
                  <Form.Check type="checkbox" />
                </th>

                <th style={{ width: "130px" }}>Lead Date</th>

                <th style={{ width: "260px" }}>Customer Details</th>

                <th style={{ width: "140px" }}>Type / Source</th>

                <th style={{ width: "110px" }}>Travel Date</th>

                <th style={{ width: "90px" }}>No. of Pax</th>

                <th style={{ width: "100px" }}>No. of Days</th>

                <th style={{ width: "150px" }}>Destinations</th>

                <th style={{ width: "120px" }}>Lead Stage</th>

                <th style={{ width: "160px" }}>Remark</th>

                <th style={{ width: "120px" }}>Last Updated</th>

                <th style={{ width: "140px" }}>Owner</th>

                <th style={{ width: "70px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {isLoading && (
                <tr>
                  <td colSpan={13} className="text-center">
                    Loading...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={13} className="text-center text-danger">
                    Error fetching leads
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                finalLeads?.map((lead: any) => (
                  <LeadRow key={lead._id} lead={lead} selectedLeads={selectedLeads}
                    setSelectedLeads={setSelectedLeads} />
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
      </Card >

      {/* message modal */}
    </>
  );
};

export default Leads;
