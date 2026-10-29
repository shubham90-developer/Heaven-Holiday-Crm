"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Form, Placeholder } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch } from "react-redux";
import Filter from "./Filter";
import SendMessageModal from "./SendMessageModal";
import FollowupModal from "./FollowupModal";
import B2CLeadModal from "./B2CLeadModal";
import B2BLeadModal from "./B2BLeadModal";
import TouchPointsModal from "./TouchPointsModal";
import ProposalModal from "./ProposalModal";
import EmailModal from "./EmailModal";
import CallDetailsModal from "./CallDetailsModal";
import {
  queryApi,
  useGetAllQueriesQuery, useUpdateQueryStageMutation,
  useGetConfirmedQueriesQuery, useAssignQueriesMutation,
  useGetCallbackQueriesQuery,
  useGetInProcessQueriesQuery,
  useGetUnassignedQueriesQuery,
  useGetRejectedQueriesQuery,
  useGetRecentQueriesQuery,
  useBulkUpdateQueriesMutation,
  useLazyExportQueriesQuery,
} from "@/store/services/queriesApi";
import { useGetStaffQuery } from "@/store/services/staff-management/staff/staffApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  STAGE_OPTIONS,
  QUALITY_FILTERS,
  QualityFilterKey,
  formatListingDate,
  formatAgeDays,
  getDestination,
  getTravelDate,
  getPax,
  getQueryCode,
  getLeadId,
  matchesQuality,
  matchesSearch,
  buildQueriesCsv,
  downloadCsvFile,
  tabToCategory,
} from "../utils/queryListingUtils";
import "./Queries.scss";

const PAGE_SIZE = 10;

const QueryRowSkeleton = () => (
  <tr>
    {Array.from({ length: 12 }).map((_, i) => (
      <td key={i} className="py-3">
        <Placeholder as="div" animation="glow">
          <Placeholder xs={i === 0 ? 4 : 10} style={{ height: 10, borderRadius: 4 }} />
          {i > 0 && i < 4 && (
            <Placeholder xs={7} className="mt-1" style={{ height: 8, borderRadius: 4 }} />
          )}
        </Placeholder>
      </td>
    ))}
  </tr>
);

const Queries = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [filters] = useState({});
  const [activeTab, setActiveTab] = useState("overall");
  const [page, setPage] = useState(1);
  const [selectedSalesStaff, setSelectedSalesStaff] = useState("");
  const [selectedOpsStaff, setSelectedOpsStaff] = useState("");
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const [qualityFilter, setQualityFilter] = useState<QualityFilterKey>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadMoreLockRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const listParams = useMemo(() => {
    const params: Record<string, unknown> = { ...filters, page, limit: PAGE_SIZE };
    if (debouncedSearch) params.search = debouncedSearch;
    if (qualityFilter === "archive") {
      params.isArchived = "true";
    } else {
      params.isArchived = "false";
      if (qualityFilter) params.leadQuality = qualityFilter;
    }
    return params;
  }, [filters, page, debouncedSearch, qualityFilter]);

  const {
    data: queries,
    isLoading,
    isFetching,
    isError,
  } = useGetAllQueriesQuery(listParams, {
    skip: activeTab !== "overall",
  });

  const { data: confirmedQueries = [], isLoading: confirmedLoading, isError: confirmedError } = useGetConfirmedQueriesQuery(undefined, {
    skip: activeTab !== "confirmed",
  });

  const {
    data: callbackData,
    isLoading: callbackLoading,
    isError: callbackError,
  } = useGetCallbackQueriesQuery(undefined, {
    skip: activeTab !== "callback",
  });

  const {
    data: inProcessData,
    isLoading: inProcessLoading,
    isError: inProcessError,
  } = useGetInProcessQueriesQuery(undefined, {
    skip: activeTab !== "inprocess",
  });

  const {
    data: unassignedData,
    isLoading: unassignedLoading,
    isError: unassignedError,
  } = useGetUnassignedQueriesQuery(undefined, {
    skip: activeTab !== "unassigned",
  });

  const {
    data: rejectedData,
    isLoading: rejectedLoading,
    isError: rejectedError,
  } = useGetRejectedQueriesQuery(undefined, {
    skip: activeTab !== "rejected",
  });

  const {
    data: recentData,
    isLoading: recentLoading,
    isError: recentError,
  } = useGetRecentQueriesQuery(undefined, {
    skip: activeTab !== "recent",
  });

  const {
    data: staffData,
    isLoading: staffLoading,
  } = useGetStaffQuery({});

  const staffList = staffData?.data ?? [];

  const overallQueries = queries?.data ?? [];
  const totalCount = queries?.count ?? overallQueries.length;
  const hasMore = Boolean(queries?.hasMore);

  // ✅ covers all 7 tabs
  const activeQueries =
    activeTab === "confirmed" ? confirmedQueries ?? [] :
      activeTab === "callback" ? callbackData ?? [] :
        activeTab === "inprocess" ? inProcessData ?? [] :
          activeTab === "unassigned" ? unassignedData ?? [] :
            activeTab === "rejected" ? rejectedData ?? [] :
              activeTab === "recent" ? recentData ?? [] :
                overallQueries;

  const displayedQueries = useMemo(() => {
    if (activeTab === "overall") return overallQueries;
    return (activeQueries as any[]).filter((query) => {
      if (!matchesQuality(query, qualityFilter)) return false;
      if (debouncedSearch && !matchesSearch(query, debouncedSearch)) return false;
      return true;
    });
  }, [activeTab, overallQueries, activeQueries, qualityFilter, debouncedSearch]);

  const recordCount =
    activeTab === "overall" ? totalCount : displayedQueries.length;

  const visibleIds = displayedQueries.map((query: any) => query._id);
  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id: string) => selectedQueries.includes(id));

  const activeLoading =
    activeTab === "confirmed" ? confirmedLoading :
      activeTab === "callback" ? callbackLoading :
        activeTab === "inprocess" ? inProcessLoading :
          activeTab === "unassigned" ? unassignedLoading :
            activeTab === "rejected" ? rejectedLoading :
              activeTab === "recent" ? recentLoading :
                isLoading && page === 1;

  const isLoadingMore =
    activeTab === "overall" && isFetching && page > 1 && overallQueries.length > 0;

  const activeError =
    activeTab === "confirmed" ? confirmedError :
      activeTab === "callback" ? callbackError :
        activeTab === "inprocess" ? inProcessError :
          activeTab === "unassigned" ? unassignedError :
            activeTab === "rejected" ? rejectedError :
              activeTab === "recent" ? recentError :
                isError;

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setSelectedQueries([]);
    if (tab === "overall") setPage(1);
  }, []);

  // Infinite scroll — load next page when sentinel enters viewport
  useEffect(() => {
    if (activeTab !== "overall") return;

    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          hasMore &&
          !isFetching &&
          !isError &&
          !loadMoreLockRef.current
        ) {
          loadMoreLockRef.current = true;
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [activeTab, hasMore, isFetching, isError]);

  useEffect(() => {
    if (!isFetching) loadMoreLockRef.current = false;
  }, [isFetching]);

  const [updateQueryStage, { isLoading: isUpdatingStage }] = useUpdateQueryStageMutation();
  const [assignQueries, { isLoading: assigning }] = useAssignQueriesMutation();
  const [bulkUpdateQueries, { isLoading: bulkUpdating }] = useBulkUpdateQueriesMutation();
  const [triggerExport, { isFetching: exporting }] = useLazyExportQueriesQuery();


  const handleStageChange = async (queryId: string, newStage: string) => {
    if (!newStage) return;
    try {
      await updateQueryStage({ queryId, stage: newStage }).unwrap();
      console.log("Stage updated Query ID:", queryId);
    } catch (err) {
      console.error("Failed to update stage:", err);
    }
  };

  const handleRowSelect = (queryId: string, checked: boolean) => {
    setSelectedQueries((prev) =>
      checked ? [...prev, queryId] : prev.filter((id) => id !== queryId)
    );
  };

  const handleAssignSales = async () => {
    if (!selectedQueries.length) {
      toast.error("Please select at least one query to assign");
      return;
    }
    if (!selectedSalesStaff) {
      toast.error("Please select a sales staff member to assign");
      return;
    }
    try {
      await assignQueries({
        queryIds: selectedQueries,
        staffId: selectedSalesStaff,
      }).unwrap();
      toast.success("Queries assigned to sales successfully");
      setSelectedQueries([]);
      setSelectedSalesStaff("");
    } catch (error) {
      console.error(error);
      toast.error("Assignment failed");
    }
  };

  // ── assign ops handler ────────────────────────────────────────────────
  // OPS assignment uses the same mutation for now since Query model only
  // has assignedToSales — wire separately once assignedToOps field is added
  const handleAssignOps = async () => {
    if (!selectedQueries.length) {
      toast.error("Please select at least one query to assign");
      return;
    }
    if (!selectedOpsStaff) {
      toast.error("Please select an OPS staff member to assign");
      return;
    }
    try {
      await assignQueries({
        queryIds: selectedQueries,
        staffId: selectedOpsStaff,
      }).unwrap();
      toast.success("Queries assigned to OPS successfully");
      setSelectedQueries([]);
      setSelectedOpsStaff("");
    } catch (error) {
      console.error(error);
      toast.error("OPS Assignment failed");
    }
  };

  const handleReload = () => {
    setPage(1);
    loadMoreLockRef.current = false;
    dispatch(queryApi.util.invalidateTags(["Query"]));
    toast.success("Queries refreshed");
  };

  const handleExportCsv = async () => {
    try {
      const params: Record<string, unknown> = {
        category: tabToCategory(activeTab),
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (qualityFilter === "archive") {
        params.isArchived = "true";
      } else {
        params.isArchived = "false";
        if (qualityFilter) params.leadQuality = qualityFilter;
      }

      const result = await triggerExport(params, false).unwrap();
      const rows = result?.data ?? [];
      if (!rows.length) {
        toast.error("No records to export");
        return;
      }
      downloadCsvFile(buildQueriesCsv(rows), "query-listing.csv");
      toast.success(`Exported ${rows.length} records`);
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const handleQualityClick = async (key: QualityFilterKey) => {
    if (key && selectedQueries.length > 0) {
      try {
        if (key === "archive") {
          await bulkUpdateQueries({
            queryIds: selectedQueries,
            isArchived: true,
          }).unwrap();
          toast.success("Selected queries archived");
        } else {
          await bulkUpdateQueries({
            queryIds: selectedQueries,
            leadQuality: key,
            isArchived: false,
          }).unwrap();
          toast.success(`Lead quality updated to ${QUALITY_FILTERS.find((item) => item.key === key)?.label}`);
        }
        setSelectedQueries([]);
        setQualityFilter(key);
        setPage(1);
      } catch {
        toast.error("Failed to update queries");
      }
      return;
    }

    setQualityFilter((prev) => (prev === key ? null : key));
    setPage(1);
    setSelectedQueries([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQueries((prev) => Array.from(new Set([...prev, ...visibleIds])));
    } else {
      setSelectedQueries((prev) => prev.filter((id) => !visibleIds.includes(id)));
    }
  };

  return (
    <div className="query-listing-page">
      {/* filter */}
      <div className="mb-2">
        <Filter />
      </div>
      <Card className="p-3">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            {/* Left Section */}

            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm w-auto ql-assign-select"
                value={selectedSalesStaff}
                onChange={(e) => setSelectedSalesStaff(e.target.value)}
              >
                <option value="">
                  {staffLoading ? "Loading..." : "Assign Sales Users"}
                </option>
                {staffList.map((staff: any) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.firstName} {staff.lastName}
                  </option>
                ))}
              </select>

              <Button
                size="sm"
                className="ql-assign-btn"
                onClick={handleAssignSales}
              >
                {assigning ? "Assigning..." : `Assign${selectedQueries.length > 0 ? ` (${selectedQueries.length})` : ""}`}
              </Button>
              <select
                className="form-select form-select-sm w-auto ql-assign-select"
                value={selectedOpsStaff}
                onChange={(e) => setSelectedOpsStaff(e.target.value)}
              >
                <option value="">
                  {staffLoading ? "Loading..." : "Assign Ops Users"}
                </option>
                {staffList.map((staff: any) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.firstName} {staff.lastName}
                  </option>
                ))}
              </select>

              <Button
                size="sm"
                className="ql-assign-btn"
                onClick={handleAssignOps}
              >
                {assigning ? "Assigning..." : `Assign${selectedQueries.length > 0 ? ` (${selectedQueries.length})` : ""}`}
              </Button>
            </div>

            {/* right side */}
            <div className="d-flex align-items-center gap-2">
              <B2CLeadModal />
              <B2BLeadModal />

              <button
                type="button"
                className="ql-icon-btn"
                onClick={handleReload}
                title="Refresh"
                disabled={isFetching || bulkUpdating}
              >
                <Icon icon="mdi:refresh" width={16} height={16} />
              </button>
              <button
                type="button"
                className="ql-icon-btn ql-icon-excel"
                onClick={handleExportCsv}
                title="Download CSV"
                disabled={exporting}
              >
                <Icon icon="mdi:file-excel" width={16} height={16} />
              </button>
            </div>
          </div>
          <div className="ql-quality-row mb-2">
            <div className="ql-quality-btns">
              {QUALITY_FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`ql-quality-tab ql-quality-${item.key}${qualityFilter === item.key ? " is-active" : ""}`}
                  disabled={bulkUpdating}
                  title={
                    selectedQueries.length
                      ? item.key === "archive"
                        ? "Archive selected queries"
                        : `Set selected queries to ${item.label}`
                      : `Filter by ${item.label}`
                  }
                  onClick={() => handleQualityClick(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <h6 className="ql-record-count">
              Total Record Found:{" "}
              <span className="text-primary">{recordCount}</span>
            </h6>
            <input
              type="search"
              className="form-control form-control-sm ql-search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom border-top pb-2 pt-2 mt-2">
            <div className="ql-status-tabs">
              {[
                { key: "inprocess", label: "In Progress" },
                { key: "recent", label: "Recent" },
                { key: "confirmed", label: "Confirmed" },
                { key: "rejected", label: "Rejected" },
                { key: "unassigned", label: "Un Assigned" },
                { key: "callback", label: "Call Back" },
                { key: "overall", label: "Overall" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`ql-status-tab${activeTab === tab.key ? " is-active" : ""}`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* right side */}
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm w-auto ql-assign-select"
              >
                <option>Select Email Template</option>
                <option value="1">Call Back</option>
                <option value="2">
                  Feedback on Your Recent Travel Experienece
                </option>
              </select>

              <EmailModal />
            </div>
          </div>
        </div>
        <div className="query-listing-wrap">
          <table className="table table-sm table-bordered query-listing-table">
            <thead>
              <tr>
                <th className="ql-check">
                  <Form.Check
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="ql-date">Query Date</th>
                <th className="ql-customer">Customer Details</th>
                <th className="ql-pax">Pax/Type</th>
                <th className="ql-desc">Description</th>
                <th className="ql-travel">Travel Date</th>
                <th className="ql-dest">Destinations</th>
                <th className="ql-proposal">Proposal</th>
                <th className="ql-stage">Lead Stage</th>
                <th className="ql-updated">Last Updated</th>
                <th className="ql-owner">Owner</th>
                <th className="ql-action text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {activeLoading &&
                Array.from({ length: 6 }).map((_, idx) => (
                  <QueryRowSkeleton key={`skeleton-${idx}`} />
                ))}

              {activeError && displayedQueries.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center text-danger py-4">
                    <Icon icon="mdi:alert-circle-outline" className="me-1" />
                    Failed to load queries.
                  </td>
                </tr>
              )}

              {!activeLoading && !activeError && displayedQueries.length === 0 && (
                <tr>
                  <td colSpan={12} className="text-center text-muted py-4">No queries found.</td>
                </tr>
              )}

              {!activeLoading && displayedQueries.map((query: any) => {
                const lead = query.leadId ?? {};
                const firstQueryItem = query.queries?.[0];
                const rowKey = query.queryItemId
                  ? `${query._id}-${query.queryItemId}`
                  : query._id;

                const companyName =
                  lead.companyName ??
                  lead.company ??
                  lead.personalInfo?.companyName ??
                  "";
                const contactName =
                  lead.name ||
                  lead.contactPerson ||
                  [lead.firstName, lead.lastName].filter(Boolean).join(" ") ||
                  "";
                const phone = lead.phone ?? lead.mobile ?? "";
                const email = lead.email ?? "";
                const leadType = query.leadModel === "B2BLead" ? "B2B" : "B2C";
                const badgeColor = leadType === "B2B" ? "primary" : "success";

                const createdAt =
                  query.queryCreatedAt ??
                  firstQueryItem?.createdAt ??
                  query.createdAt;
                const updatedAt =
                  query.queryUpdatedAt ??
                  firstQueryItem?.updatedAt ??
                  query.updatedAt;

                const queryDate = formatListingDate(createdAt) || "—";
                const queryAge = formatAgeDays(createdAt);
                const queryCode = getQueryCode(query) || "—";
                const lastUpdated = formatListingDate(updatedAt) || "—";
                const owner = query.assignedToSales?.name ?? "Unassigned";
                const currentStage = query.stage ?? "";
                const requirementType = firstQueryItem?.requirementType ?? "—";
                const destination = firstQueryItem ? getDestination(firstQueryItem) : "—";
                const travelDate = firstQueryItem ? getTravelDate(firstQueryItem) || "—" : "—";
                const pax = firstQueryItem ? getPax(firstQueryItem) : "—";
                const subLabel = lead.customerType ?? lead.source ?? "";
                const qualityClass = query.isArchived
                  ? "archive"
                  : query.leadQuality || "no_status";

                return (
                  <tr key={rowKey} className={`ql-row-${qualityClass}`}>
                    <td>
                      <Form.Check
                        checked={selectedQueries.includes(query._id)}
                        onChange={(e) => handleRowSelect(query._id, e.target.checked)}
                      />
                    </td>

                    <td>
                      <div>{queryDate}</div>
                      <div className="ql-muted">{queryAge}</div>
                      <div className="ql-muted">Q/26/{queryCode}</div>
                    </td>

                    <td>
                      {companyName && <div className="fw-semibold"><Icon icon="mdi:building" className="me-1" />{companyName}</div>}
                      {contactName && <div className="fw-semibold"><Icon icon="mdi:account" className="me-1" />{contactName}</div>}
                      {phone && <div><Icon icon="mdi:phone" className="me-1" />{phone}</div>}
                      {email && <div><Icon icon="mdi:email-outline" className="me-1" />{email}</div>}
                    </td>

                    <td>
                      <div>{pax}</div>
                      <span className={`badge bg-${badgeColor}`}>{leadType}</span>
                    </td>

                    <td>
                      <div>{requirementType}</div>
                      {subLabel && <div className="ql-muted">{subLabel}</div>}
                    </td>

                    <td>{travelDate}</td>
                    <td>{destination}</td>

                    <td>
                      <ProposalModal
                        queryId={query._id}
                        queryCode={queryCode}
                      />
                    </td>

                    <td>
                      <select
                        className="form-select form-select-sm ql-stage-select"
                        defaultValue={currentStage}
                        disabled={isUpdatingStage}
                        onChange={(e) => handleStageChange(query._id, e.target.value)}
                      >
                        {STAGE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <div className="ql-stage-actions">
                        <FollowupModal />
                        <TouchPointsModal
                          queryId={query._id}
                          customerName={contactName || companyName}
                          currentStage={currentStage}
                        />
                        <CallDetailsModal
                          leadId={getLeadId(query)}
                          customerName={contactName || companyName}
                        />
                      </div>
                    </td>

                    <td>{lastUpdated}</td>
                    <td>{owner}</td>

                    <td>
                      <div className="ql-action-btns">
                        <button
                          type="button"
                          className="ql-action-btn"
                          onClick={() => router.push(`/crm/queries/view-queries/${query._id}`)}
                          title="View"
                        >
                          <Icon icon="mdi:eye-outline" width={18} height={18} />
                        </button>
                        <SendMessageModal />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {isLoadingMore &&
                Array.from({ length: 3 }).map((_, idx) => (
                  <QueryRowSkeleton key={`more-skeleton-${idx}`} />
                ))}
            </tbody>
          </table>
        </div>

        {activeTab === "overall" && (
          <div
            ref={loadMoreRef}
            className="d-flex justify-content-center align-items-center mt-3"
            style={{ minHeight: 40 }}
          >
            {isLoadingMore && (
              <span className="text-muted" style={{ fontSize: "11px" }}>
                Loading more queries...
              </span>
            )}
            {!hasMore && overallQueries.length > 0 && !isFetching && (
              <span className="text-muted" style={{ fontSize: "11px" }}>
                All queries loaded
              </span>
            )}
          </div>
        )}
      </Card>

      {/* message modal */}
    </div>
  );
};

export default Queries;
