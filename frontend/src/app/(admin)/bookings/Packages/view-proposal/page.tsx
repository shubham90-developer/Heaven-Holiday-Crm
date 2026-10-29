import React, { Suspense } from "react";
import PageTitle from "@/components/PageTitle";
import ViewProposalPage from "../components/ViewProposalPage";

const ViewProposalRoute = () => (
    <>
        <PageTitle title="View Proposal" subTitle="Packages" />
        <Suspense fallback={<div className="p-3">Loading proposal...</div>}>
            <ViewProposalPage />
        </Suspense>
    </>
);

export default ViewProposalRoute;
