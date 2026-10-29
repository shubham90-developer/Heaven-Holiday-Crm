"use client";

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import ProposalRichTextEditor from "./ProposalRichTextEditor";

const DEFAULT_INCLUSIONS = `<ul>
<li>Hotel Nights accommodation on twin sharing basis as per itinerary</li>
<li>Meals as per hotel plan</li>
<li>All transfers and sightseeing as per the itinerary in an air-conditioned vehicle on sharing basis</li>
<li>Road taxes, parking fees, fuel charges, interstate taxes</li>
</ul>`;

type PolicyItem = {
  key: string;
  label: string;
  defaultChecked?: boolean;
  defaultContent?: string;
};

const POLICY_ITEMS: PolicyItem[] = [
  { key: "notes", label: "Notes", defaultChecked: true },
  { key: "inclusions", label: "Inclusions", defaultChecked: true, defaultContent: DEFAULT_INCLUSIONS },
  { key: "exclusions", label: "Exclusions", defaultChecked: true },
  { key: "termsAndConditions", label: "Terms & Conditions", defaultChecked: true },
  { key: "cancellationPolicy", label: "Cancellation Policy", defaultChecked: true },
  { key: "generalInformation", label: "General Information", defaultChecked: false },
  { key: "bookingTerms", label: "Booking Terms", defaultChecked: true },
  { key: "paymentTerms", label: "Payment Terms", defaultChecked: true },
  { key: "whyUseUs", label: "Why Use Us", defaultChecked: true },
  { key: "refundPolicy", label: "Refund Policy", defaultChecked: true },
];

const PolicySections = ({
  onPoliciesChange,
}: {
  onPoliciesChange?: (policies: {
    notes?: string;
    inclusions: string;
    exclusions: string;
    cancellationPolicy: string;
    termsAndConditions: string;
    bookingTerms?: string;
    paymentTerms?: string;
  }) => void;
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    notes: false,
    inclusions: true,
  });
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(
      POLICY_ITEMS.map((item) => [item.key, item.defaultChecked ?? false])
    )
  );
  const [content, setContent] = useState<Record<string, string>>(
    Object.fromEntries(
      POLICY_ITEMS.map((item) => [item.key, item.defaultContent || ""])
    )
  );
  const [templates, setTemplates] = useState<Record<string, string>>(
    Object.fromEntries(POLICY_ITEMS.map((item) => [item.key, "Master"]))
  );

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    onPoliciesChange?.({
      notes: content.notes || content.generalInformation || "",
      inclusions: content.inclusions || "",
      exclusions: content.exclusions || "",
      cancellationPolicy: content.cancellationPolicy || "",
      termsAndConditions: content.termsAndConditions || "",
      bookingTerms: content.bookingTerms || "",
      paymentTerms: content.paymentTerms || "",
    });
  }, [content, onPoliciesChange]);

  return (
    <>
      {POLICY_ITEMS.map((item) => (
        <div key={item.key} className="ccp-section mb-2">
          <div
            className="ccp-policy-header"
            onClick={() => toggle(item.key)}
            role="button"
            tabIndex={0}
          >
            <div className="d-flex align-items-center gap-2">
              <Form.Check
                type="checkbox"
                checked={checked[item.key]}
                onChange={(e) => {
                  e.stopPropagation();
                  setChecked((prev) => ({ ...prev, [item.key]: e.target.checked }));
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <span>{item.label}</span>
            </div>
            <div
              className="d-flex align-items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Form.Select
                size="sm"
                value={templates[item.key]}
                onChange={(e) =>
                  setTemplates((prev) => ({ ...prev, [item.key]: e.target.value }))
                }
                style={{ width: "90px", fontSize: "11px" }}
              >
                <option>Master</option>
                <option>Custom</option>
              </Form.Select>
              <button type="button" className="ccp-toggle-btn" onClick={() => toggle(item.key)}>
                <IconifyIcon
                  icon={
                    expanded[item.key]
                      ? "mdi:minus-circle-outline"
                      : "mdi:plus-circle-outline"
                  }
                />
              </button>
            </div>
          </div>
          {expanded[item.key] && (
            <div className="ccp-section-body">
              <ProposalRichTextEditor
                value={content[item.key]}
                onChange={(value) =>
                  setContent((prev) => ({ ...prev, [item.key]: value }))
                }
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default PolicySections;
