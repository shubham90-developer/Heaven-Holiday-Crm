import React from "react";
import PageTitle from "@/components/PageTitle";
import MyList from "./components/MyList";

const MarketingListsPage = () => {
  return (
    <>
      <PageTitle title="Lists" subTitle="Marketing" />
      <MyList />
    </>
  );
};

export default MarketingListsPage;
