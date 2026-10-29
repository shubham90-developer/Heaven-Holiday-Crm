"use client";

import React, { ReactNode } from "react";
import { Card, CardBody } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

type DashboardCardProps = {
  title: string;
  icon: string;
  iconBg?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

const DashboardCard = ({
  title,
  icon,
  iconBg = "#5b9bd5",
  actions,
  children,
  className = "",
}: DashboardCardProps) => {
  return (
    <Card className={`dashboard-card mb-2 ${className}`}>
      <div className="dashboard-card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div
            className="dashboard-card-icon d-flex align-items-center justify-content-center"
            style={{ backgroundColor: iconBg }}
          >
            <IconifyIcon icon={icon} className="text-white fs-16" />
          </div>
          <span className="dashboard-card-title">{title}</span>
        </div>
        {actions && (
          <div className="d-flex align-items-center gap-1">{actions}</div>
        )}
      </div>
      <CardBody className="dashboard-card-body">{children}</CardBody>
    </Card>
  );
};

export default DashboardCard;
