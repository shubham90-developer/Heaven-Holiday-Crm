export const dynamic = "force-dynamic";
import React from "react";
import Profile from "./Profile";
import PageTitle from "@/components/PageTitle";

const ViewLeadsPage = () => {
  return (
    <>
      <PageTitle title=" CRM  - Customers Profile" />
      <Profile />
    </>
  );
};

export default ViewLeadsPage;
