import React from "react";
import PageTitle from "@/components/PageTitle";
import EditTemplate from "./EditTemplate";

const EditEmailTemplatePage = async ({ params }: { params: Promise<{ id: string }> }) => {

  const { id } = await params;
  return (
    <>
      <PageTitle title="Settings - Edit Email Template" />
      <EditTemplate id={id} />
    </>
  );
};

export default EditEmailTemplatePage;