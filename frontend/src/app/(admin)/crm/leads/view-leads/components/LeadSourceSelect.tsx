"use client";

import { Form } from "react-bootstrap";
import { useGetLeadSourcesQuery } from "@/store/services/settings/lead-source/leadSourceApi";

type Props = {
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "lg";
};

const LeadSourceSelect = ({ value = "", onChange, size = "sm" }: Props) => {
  const { data, isLoading } = useGetLeadSourcesQuery(null);
  const options = (data?.data || []).filter(
    (item: { status?: string; enabled?: boolean; isDeleted?: boolean }) =>
      item.status !== "Inactive" && item.enabled !== false
  );

  return (
    <>
      <Form.Label style={{ fontSize: "10px" }} className="text-primary">
        Lead Source
      </Form.Label>
      <Form.Select
        size={size}
        style={{ fontSize: "12px" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
      >
        <option value="">{isLoading ? "Loading..." : "Select"}</option>
        {options.map((item: { _id: string; title: string }) => (
          <option key={item._id} value={item.title}>
            {item.title}
          </option>
        ))}
      </Form.Select>
    </>
  );
};

export default LeadSourceSelect;
