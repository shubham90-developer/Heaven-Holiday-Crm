import React from "react";
import PageTitle from "@/components/PageTitle";
import MarkupSlabsList from "./components/MarkupSlabsList";

const MarkUpsPage = () => {
  return (
    <>
      <PageTitle title="Settings - Category" subTitle="Settings" />
      <MarkupSlabsList />
    </>
  );
};

export default MarkUpsPage;
