import React from "react";
import PageTitle from "@/components/PageTitle";
import EditTheme from "./EditTheme";

const EditThemePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <>
      <PageTitle title="Settings - Edit Theme" />
      <EditTheme id={id} />
    </>
  );
};

export default EditThemePage;
