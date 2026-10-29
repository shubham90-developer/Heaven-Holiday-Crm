"use client";

import { useMemo } from "react";
import ChipMultiSelect from "./ChipMultiSelect";
import { useGetFoodPreferencesQuery } from "@/store/services/settings/food-preferences/foodPreferenceApi";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

const FoodPreferenceMultiSelect = ({ value = [], onChange }: Props) => {
  const { data, isLoading } = useGetFoodPreferencesQuery({ active: "true" });
  const options = useMemo(
    () => (data?.data || []).map((item: { title: string }) => item.title),
    [data]
  );

  return (
    <ChipMultiSelect
      label="Food Preference"
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      emptyMessage="No food preferences found"
    />
  );
};

export default FoodPreferenceMultiSelect;
