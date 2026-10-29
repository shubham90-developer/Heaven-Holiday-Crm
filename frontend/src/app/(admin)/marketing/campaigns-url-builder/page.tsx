import React from "react";
import PageTitle from "@/components/PageTitle";
import CampaignUrlBuilderList from "./components/CampaignUrlBuilderList";

const CampaignUrlBuilderPage = () => {
  return (
    <>
      <PageTitle
        title="Campaign URL Builder"
        subTitle="Marketing / Campaign URL Builder"
      />
      <CampaignUrlBuilderList />
    </>
  );
};

export default CampaignUrlBuilderPage;
