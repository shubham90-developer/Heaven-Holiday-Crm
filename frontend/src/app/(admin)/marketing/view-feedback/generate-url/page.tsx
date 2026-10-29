import React from "react";
import PageTitle from "@/components/PageTitle";
import GenerateFeedbackUrl from "./components/GenerateFeedbackUrl";

const GenerateFeedbackUrlPage = () => {
  return (
    <>
      <PageTitle title="Generate Url" subTitle="Marketing / View Feedback" />
      <GenerateFeedbackUrl />
    </>
  );
};

export default GenerateFeedbackUrlPage;
