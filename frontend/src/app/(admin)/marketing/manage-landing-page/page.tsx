import React from "react";
import PageTitle from "@/components/PageTitle";
import ManageLandingPageList from "./components/ManageLandingPageList";
const ManageLandingPagePage = () => {
  return (
    <>
      <PageTitle title="My List" subTitle="Marketing / Manage Landing Page" />
      <ManageLandingPageList />
    </>
  );
};

export default ManageLandingPagePage;
