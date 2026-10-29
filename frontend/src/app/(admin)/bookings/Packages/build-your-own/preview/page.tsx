import React, { Suspense } from "react";
import PageTitle from "@/components/PageTitle";
import ProposalPreviewPage from "../components/ProposalPreviewPage";

const BuildYourOwnPreviewRoute = () => {
    return (
        <>
            <PageTitle title="Proposal Preview" />
            <Suspense fallback={<div className="p-3">Loading preview...</div>}>
                <ProposalPreviewPage />
            </Suspense>
        </>
    );
};

export default BuildYourOwnPreviewRoute;
