import React from "react";
import PageTitle from "@/components/PageTitle";
import CreateCampaign from "./components/CreateCampaign";

const CreateCampaignPage = () => {
  return (
    <>
      <PageTitle title="Create a campaign" subTitle="Marketing / Campaign" />
      <CreateCampaign />
    </>
  );
};

export default CreateCampaignPage;
