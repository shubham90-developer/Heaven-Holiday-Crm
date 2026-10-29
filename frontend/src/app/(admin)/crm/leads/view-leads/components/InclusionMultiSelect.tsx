"use client";

import { useMemo } from "react";
import ChipMultiSelect from "./ChipMultiSelect";
import { useGetInclusionsQuery } from "@/store/services/settings/inclusions/inclusionApi";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

const InclusionMultiSelect = ({ value = [], onChange }: Props) => {
  const { data, isLoading } = useGetInclusionsQuery({ active: "true" });
  const options = useMemo(
    () => (data?.data || []).map((item: { title: string }) => item.title),
    [data]
  );

  return (
    <ChipMultiSelect
      label="Select Inclusions"
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      emptyMessage="No inclusions found"
    />
  );
};

export default InclusionMultiSelect;
