"use client";

import { Form } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

export const RefreshButton = () => (
  <button type="button" className="dashboard-action-btn" aria-label="Refresh">
    <IconifyIcon icon="solar:refresh-bold" />
  </button>
);

export const TodaySelect = () => (
  <Form.Select size="sm" className="dashboard-select">
    <option>Today</option>
    <option>This Week</option>
    <option>This Month</option>
  </Form.Select>
);

export const NavArrows = () => (
  <div className="d-flex align-items-center gap-1">
    <button type="button" className="dashboard-action-btn" aria-label="Previous">
      <IconifyIcon icon="tabler:chevron-left" />
    </button>
    <button type="button" className="dashboard-action-btn" aria-label="Next">
      <IconifyIcon icon="tabler:chevron-right" />
    </button>
  </div>
);
