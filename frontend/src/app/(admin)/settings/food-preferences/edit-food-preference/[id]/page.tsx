import React from "react";
import PageTitle from "@/components/PageTitle";
import EditFoodPreference from "./EditFoodPreference";

const EditFoodPreferencePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <>
      <PageTitle title="Settings - Edit Food Preference" />
      <EditFoodPreference id={id} />
    </>
  );
};

export default EditFoodPreferencePage;
