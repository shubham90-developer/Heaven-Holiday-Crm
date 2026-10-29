"use client";

import React from "react";
import { Form } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import DashboardCard from "./DashboardCard";
import { TodaySelect } from "./DashboardActions";

const stats = [
  { label: "Total Sales", value: 0 },
  { label: "Queries In Process", value: 0 },
  { label: "Proposal Sent", value: 0 },
  { label: "Proposal Pending", value: 0, className: "text-danger" },
  { label: "Queries Lost", value: 0, className: "text-danger" },
  { label: "Verbal Won", value: 0, className: "text-primary" },
  { label: "Won", value: 0, className: "text-success" },
];

const leadStats = [
  { label: "Leads In Process", value: 0 },
  { label: "Leads Lost", value: 0, className: "text-danger" },
  { label: "Leads Converted", value: 0 },
];

const EmployeePerformance = () => {
  return (
    <DashboardCard
      title="Employee Performance"
      icon="solar:chart-square-bold-duotone"
      iconBg="#5b9bd5"
      actions={<TodaySelect />}
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        <Form.Control
          type="text"
          value="RAJENDRA BUGADE"
          readOnly
          className="employee-performance-select flex-grow-1"
        />
        <button type="button" className="dashboard-action-btn" aria-label="Refresh">
          <IconifyIcon icon="solar:refresh-bold-duotone" className="fs-18" />
        </button>
      </div>

      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`employee-stat-row ${stat.className || ""}`}
        >
          <span>{stat.label}</span>
          <span>{stat.value}</span>
        </div>
      ))}

      <hr className="employee-stat-divider" />

      {leadStats.map((stat) => (
        <div
          key={stat.label}
          className={`employee-stat-row ${stat.className || ""}`}
        >
          <span>{stat.label}</span>
          <span>{stat.value}</span>
        </div>
      ))}
    </DashboardCard>
  );
};

export default EmployeePerformance;
