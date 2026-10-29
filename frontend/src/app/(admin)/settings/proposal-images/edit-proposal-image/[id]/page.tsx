import React from "react";
import PageTitle from "@/components/PageTitle";
import EditProposalImage from "./EditProposalImage";

const EditProposalImagePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <>
      <PageTitle title="Settings - Edit Proposal Images" />
      <EditProposalImage id={id} />
    </>
  );
};

export default EditProposalImagePage;
