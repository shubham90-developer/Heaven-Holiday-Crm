import React from "react";
import PageTitle from "@/components/PageTitle";
import FoodPreferences from "./FoodPreferences";

const FoodPreferencesPage = () => {
  return (
    <>
      <PageTitle title="Settings - Food Preferences" />
      <FoodPreferences />
    </>
  );
};

export default FoodPreferencesPage;
