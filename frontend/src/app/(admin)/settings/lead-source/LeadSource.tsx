"use client";
import React, { useMemo, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
import {
  useGetLeadSourcesQuery,
  useDeleteLeadSourceMutation,
  useUpdateLeadSourceMutation,
} from "../../../../store/services/settings/lead-source/leadSourceApi";
import LeadSourceOffcanvas from "./LeadSourceOffcanvas";
import styles from "./lead-source.module.scss";

const LeadSource = () => {
  const { data, isLoading, isError, isFetching, refetch } = useGetLeadSourcesQuery(null);
  const [deleteLeadSource, { isLoading: isDeleting }] = useDeleteLeadSourceMutation();
  const [updateLeadSource] = useUpdateLeadSourceMutation();

  const [search, setSearch] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const leadSources: any[] = data?.data || [];

  const stats = useMemo(() => {
    const active = leadSources.filter((i) => i.status === "Active").length;
    return { total: leadSources.length, active, inactive: leadSources.length - active };
  }, [leadSources]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leadSources;
    return leadSources.filter(
      (i) => String(i.title || "").toLowerCase().includes(q) || `#${i.leadId}`.includes(q) || String(i.leadId).includes(q)
    );
  }, [leadSources, search]);

  const openAdd = () => {
    setEditItem(null);
    setShowPanel(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setShowPanel(true);
  };

  const closePanel = () => {
    setShowPanel(false);
    setEditItem(null);
  };

  const handleToggleAssign = async (item: any) => {
    setAssigningId(item._id);
    try {
      await updateLeadSource({ id: item._id, isDefaultAssignLead: !item.isDefaultAssignLead }).unwrap();
      toast.success(item.isDefaultAssignLead ? "Lead source unassigned" : "Lead source assigned");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update assignment. Please try again.");
    } finally {
      setAssigningId(null);
    }
  };

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div>
          <p style={{ fontSize: "12px", marginBottom: "8px" }}>Are you sure you want to delete this lead source?</p>
          <div className="d-flex gap-2 justify-content-end">
            <button
              style={{ fontSize: "10px" }}
              className="btn btn-danger btn-sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteLeadSource(id).unwrap();
                  toast.success("Lead source deleted successfully");
                } catch (err) {
                  toast.error("Failed to delete lead source. Please try again.");
                }
              }}
            >
              Yes, Delete
            </button>
            <button style={{ fontSize: "10px" }} className="btn btn-secondary btn-sm" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const statCards = [
    { label: "Lead Sources", value: stats.total, hint: "total configured", icon: "mdi:tag-outline", color: "#2563eb" },
    { label: "Active", value: stats.active, hint: "in use", icon: "mdi:check", color: "#16a34a" },
    { label: "Inactive", value: stats.inactive, hint: "disabled", icon: "mdi:cancel", color: "#9ca3af" },
  ];

  return (
    <div>
      {/* Header */}
      <Card className={`${styles.headerCard} mb-3`}>
        <Card.Body className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div>
            <h1 className={styles.pageTitle}>Lead Source</h1>
            <p className={styles.pageSub}>Manage the lead sources used across your CRM</p>
          </div>
          <Button variant="primary" onClick={openAdd} style={{ fontSize: 13, fontWeight: 600 }}>
            <Icon icon="mdi:plus" className="me-1" />
            Add Lead Source
          </Button>
        </Card.Body>
      </Card>

      {/* Stats */}
      <Row className="g-3 mb-3">
        {statCards.map((s) => (
          <Col md={4} key={s.label}>
            <Card className={styles.statCard} style={{ ["--stat-color" as any]: s.color }}>
              <Card.Body className="py-3">
                <div className={styles.statLabel}>
                  <Icon icon={s.icon} style={{ color: s.color }} />
                  {s.label}
                </div>
                <div className={styles.statValue}>{isLoading ? "–" : s.value}</div>
                <div className={styles.statHint}>{s.hint}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Card className={styles.tableCard}>
        <Card.Body>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div className={styles.searchWrap}>
              <Icon icon="mdi:magnify" className={styles.searchIcon} width={16} />
              <Form.Control
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className={styles.count}>
                {filtered.length} of {leadSources.length}
              </span>
              <Button
                variant="light"
                className={`border ${styles.iconBtn}`}
                style={{ width: 38, height: 38 }}
                title="Refresh"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <Icon icon="mdi:refresh" className={isFetching ? "spin" : ""} />
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <table className={`table align-middle mb-0 ${styles.table}`}>
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th style={{ width: 120 }}>Lead ID</th>
                  <th>Title</th>
                  <th style={{ width: 130 }}>Status</th>
                  <th className="text-end" style={{ width: 230 }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={5} className="text-center text-danger py-4">
                      Failed to load lead sources
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      {search ? "No lead sources match your search" : "No lead sources found"}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  filtered.map((item, index) => (
                    <tr key={item._id}>
                      <td className="text-muted">{index + 1}</td>
                      <td className="fw-semibold">#{item.leadId}</td>
                      <td>
                        <span className={styles.titleCell}>{item.title}</span>
                        {item.enabled && <span className={styles.assignBadge}>Assign Lead</span>}
                      </td>
                      <td>
                        <span
                          className={`${styles.statusPill} ${
                            item.status === "Active" ? styles.statusActive : styles.statusInactive
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1 justify-content-end align-items-center">
                          {item.enabled && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className={styles.assignBtn}
                              disabled={assigningId === item._id}
                              onClick={() => handleToggleAssign(item)}
                            >
                              <Icon icon="mdi:account-check-outline" />
                              {item.isDefaultAssignLead ? "Assigned" : "Assign"}
                            </Button>
                          )}
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="Edit"
                            className={styles.iconBtn}
                            onClick={() => openEdit(item)}
                          >
                            <Icon icon="mdi:square-edit-outline" />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Delete"
                            className={styles.iconBtn}
                            disabled={isDeleting}
                            onClick={() => handleDelete(item._id)}
                          >
                            <Icon icon="mdi:trash-can-outline" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      <LeadSourceOffcanvas show={showPanel} onHide={closePanel} editItem={editItem} />
    </div>
  );
};

export default LeadSource;
