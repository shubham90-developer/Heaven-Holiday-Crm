import React from "react";
import PageTitle from "@/components/PageTitle";
import ViewFeedbackList from "./components/ViewFeedbackList";

const ViewFeedbackPage = () => {
  return (
    <>
      <PageTitle title="Feedback" subTitle="Marketing / View Feedback" />
      <ViewFeedbackList />
    </>
  );
};

export default ViewFeedbackPage;
