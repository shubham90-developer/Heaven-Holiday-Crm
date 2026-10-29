import React from "react";
import PageTitle from "@/components/PageTitle";
import TemplateList from "./components/TemplateList";

const TemplateListPage = () => {
  return (
    <>
      <PageTitle title="Select a template" subTitle="Marketing / Campaign" />
      <TemplateList />
    </>
  );
};

export default TemplateListPage;
