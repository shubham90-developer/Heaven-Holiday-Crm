import React from "react";
import PageTitle from "@/components/PageTitle";
import EditLandingTemplate from "./EditLandingTemplate";

const EditLandingTemplatePage = async ({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) => {
  const { id, type } = await params;

  return (
    <>
      <PageTitle
        title="Edit/Create"
        subTitle="Marketing / Manage Landing Page"
      />
      <EditLandingTemplate id={id} type={type} />
    </>
  );
};

export default EditLandingTemplatePage;
