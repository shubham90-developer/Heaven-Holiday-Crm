import React from "react";
import PageTitle from "@/components/PageTitle";
import AddGenerateUrl from "./components/AddGenerateUrl";

const AddGenerateUrlPage = () => {
  return (
    <>
      <PageTitle
        title="Generate Url"
        subTitle="Marketing / Campaign URL Builder"
      />
      <AddGenerateUrl />
    </>
  );
};

export default AddGenerateUrlPage;
