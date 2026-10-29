import React from "react";
import PageTitle from "@/components/PageTitle";
import DefaultCampaignsList from "./components/DefaultCampaignsList";

const DefaultCampaignsPage = () => {
  return (
    <>
      <PageTitle title="My Campaigns" subTitle="Marketing / Campaign" />
      <DefaultCampaignsList />
    </>
  );
};

export default DefaultCampaignsPage;
