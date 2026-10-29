"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Row, Col } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import toast from "react-hot-toast";

export type TemplateTabKey =
  | "master"
  | "code-your-own"
  | "use-existing-html"
  | "dynamic-template";

interface TemplateTabsProps {
  active: TemplateTabKey;
}

const tabs: { key: TemplateTabKey; label: string; icon: string; path: string; ready: boolean }[] = [
  { key: "master", label: "Master", icon: "mdi:format-list-bulleted", path: "/marketing/campaigns/create-template", ready: true },
  { key: "code-your-own", label: "Code your own", icon: "mdi:code-tags", path: "/marketing/campaigns/code-your-own", ready: true },
  { key: "use-existing-html", label: "Use existing HTML", icon: "mdi:file-code-outline", path: "/marketing/campaigns/create-template", ready: false },
  { key: "dynamic-template", label: "Dynamic Template", icon: "mdi:file-cog-outline", path: "/marketing/campaigns/create-template", ready: false },
];

const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  width: "100%",
  border: "1px solid #d9dee8",
  borderRadius: 6,
  padding: "10px 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontWeight: 600,
  fontSize: 14.5,
  background: isActive ? "#1361e8" : "#fff",
  color: isActive ? "#fff" : "#364152",
});

const TemplateTabs = ({ active }: TemplateTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goTo = (tab: (typeof tabs)[number]) => {
    if (!tab.ready) {
      toast(`${tab.label} is coming soon`, { icon: "🚧" });
      return;
    }
    if (tab.key === active) return;
    const qs = searchParams.toString();
    router.push(qs ? `${tab.path}?${qs}` : tab.path);
  };

  return (
    <Row className="g-2 mb-4">
      {tabs.map((tab) => (
        <Col key={tab.key} xs={6} md={3}>
          <button type="button" style={tabButtonStyle(tab.key === active)} onClick={() => goTo(tab)}>
            <IconifyIcon icon={tab.icon} style={{ fontSize: 18 }} />
            {tab.label}
          </button>
        </Col>
      ))}
    </Row>
  );
};

export default TemplateTabs;
