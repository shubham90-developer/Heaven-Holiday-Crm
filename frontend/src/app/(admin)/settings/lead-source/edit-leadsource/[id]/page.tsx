import React from "react";
import PageTitle from "@/components/PageTitle";
import EditLeadSource from "./EditLeadSource";

const EditLeadSourcePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {

  const { id } = await params;

  return (
    <>
      <PageTitle title="Settings - Edit Lead Source" />
      <EditLeadSource id={id} />
    </>
  );
};

export default EditLeadSourcePage;
