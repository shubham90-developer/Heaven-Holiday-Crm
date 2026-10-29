"use client";

import { useMemo } from "react";
import ChipMultiSelect from "./ChipMultiSelect";
import { useGetThemesQuery } from "@/store/services/settings/themes/themeApi";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

const ThemeMultiSelect = ({ value = [], onChange }: Props) => {
  const { data, isLoading } = useGetThemesQuery({ active: "true" });
  const options = useMemo(
    () => (data?.data || []).map((item: { title: string }) => item.title),
    [data]
  );

  return (
    <ChipMultiSelect
      label="Select Theme"
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      emptyMessage="No themes found"
    />
  );
};

export default ThemeMultiSelect;
