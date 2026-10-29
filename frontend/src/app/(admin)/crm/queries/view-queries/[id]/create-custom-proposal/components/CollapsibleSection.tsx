"use client";

import { ReactNode } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

type HeaderVariant = "dark" | "blue" | "teal" | "purple" | "gray";

type CollapsibleSectionProps = {
  title: ReactNode;
  headerVariant?: HeaderVariant;
  expanded?: boolean;
  onToggle?: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  flush?: boolean;
  toggleIcon?: "circle" | "chevron";
};

const CollapsibleSection = ({
  title,
  headerVariant = "dark",
  expanded = true,
  onToggle,
  actions,
  children,
  className = "",
  flush = false,
  toggleIcon = "circle",
}: CollapsibleSectionProps) => {
  return (
    <div className={`ccp-section ${className}`}>
      <div
        className={`ccp-section-header header-${headerVariant}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onToggle?.();
        }}
      >
        <span>{title}</span>
        <div
          className="d-flex align-items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {actions}
          {onToggle && (
            <button
              type="button"
              className="ccp-toggle-btn"
              onClick={onToggle}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              <IconifyIcon
                icon={
                  toggleIcon === "chevron"
                    ? expanded
                      ? "mdi:chevron-up"
                      : "mdi:chevron-down"
                    : expanded
                      ? "mdi:minus-circle-outline"
                      : "mdi:plus-circle-outline"
                }
              />
            </button>
          )}
        </div>
      </div>
      {expanded && children && (
        <div className={`ccp-section-body ${flush ? "flush" : ""}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
