import React from "react";
import PageTitle from "@/components/PageTitle";
import CreateTemplate from "./components/CreateTemplate";

const CreateTemplatePage = () => {
  return (
    <>
      <PageTitle title="Edit/Create" subTitle="Marketing / Template" />
      <CreateTemplate />
    </>
  );
};

export default CreateTemplatePage;
