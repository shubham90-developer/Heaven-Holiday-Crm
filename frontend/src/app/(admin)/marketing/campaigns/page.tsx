import React from "react";
import PageTitle from "@/components/PageTitle";
import CampaignsList from "./components/CampaignsList";

const CampaignsPage = () => {
  return (
    <>
      <PageTitle title="Email Campaigns" subTitle="Marketing / Campaign" />
      <CampaignsList />
    </>
  );
};

export default CampaignsPage;
