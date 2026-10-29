"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardCard from "./DashboardCard";
import B2BLeadModal from "./B2BLeadModal";
import B2CLeadModal from "./B2CLeadModal";
import CorporateLeadModal from "./CorporateLeadModal";

type StartNowItem = {
  title: string;
  btnTitle: string;
  action: () => void;
};

const Stat = () => {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpen = (type: string) => {
    setActiveModal(type);
  };

  const handleClose = () => {
    setActiveModal(null);
  };

  const startNowItems: StartNowItem[] = [
    {
      title: "B2C Lead",
      btnTitle: "Add New",
      action: () => handleOpen("b2c"),
    },
    {
      title: "B2B Lead",
      btnTitle: "Add New",
      action: () => handleOpen("b2b"),
    },
    {
      title: "Corporate Lead",
      btnTitle: "Add New",
      action: () => handleOpen("corporate"),
    },
    {
      title: "New Leads",
      btnTitle: "View",
      action: () => router.push("/crm/leads"),
    },
    {
      title: "Queries",
      btnTitle: "View",
      action: () => router.push("/crm/queries"),
    },
  ];

  return (
    <>
      <DashboardCard title="Start Now" icon="mdi:rocket-launch" iconBg="#5b9bd5">
        {startNowItems.map((item) => (
          <div key={item.title} className="start-now-row">
            <span className="start-now-label">{item.title}</span>
            <button
              type="button"
              className="dashboard-orange-btn"
              onClick={item.action}
            >
              {item.btnTitle}
            </button>
          </div>
        ))}
      </DashboardCard>

      <B2BLeadModal show={activeModal === "b2b"} onHide={handleClose} />
      <B2CLeadModal show={activeModal === "b2c"} onHide={handleClose} />
      <CorporateLeadModal
        show={activeModal === "corporate"}
        onHide={handleClose}
      />
    </>
  );
};

export default Stat;
