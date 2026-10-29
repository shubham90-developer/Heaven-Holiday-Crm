import React from "react";
import PageTitle from "@/components/PageTitle";
import TemplateList from "../campaigns/template-list/components/TemplateList";

const EmailMarketingPage = () => {
  return (
    <>
      <PageTitle title="Email Templates" subTitle="Templates" />
      <TemplateList />
    </>
  );
};

export default EmailMarketingPage;
