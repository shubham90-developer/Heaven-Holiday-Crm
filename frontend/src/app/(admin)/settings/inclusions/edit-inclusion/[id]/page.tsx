import React from "react";
import PageTitle from "@/components/PageTitle";
import EditInclusion from "./EditInclusion";

const EditInclusionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <>
      <PageTitle title="Settings - Edit Inclusion" />
      <EditInclusion id={id} />
    </>
  );
};

export default EditInclusionPage;
