"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import CustomerFilter from "./components/CustomerFilter";

const CustomerSearchPage = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "Search";

  return (
    <>
      <PageTitle title={title} subTitle="Marketing" />
      <CustomerFilter title={title} />
    </>
  );
};

export default CustomerSearchPage;
