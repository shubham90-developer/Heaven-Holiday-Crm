import React, { Suspense } from "react";
import PageTitle from "@/components/PageTitle";
import FulfillmentPage from "../components/FulfillmentPage";

const OldFulfillmentRoute = () => (
    <>
        <PageTitle title="Old Fulfillment" subTitle="Packages" />
        <Suspense fallback={<div className="p-3">Loading fulfillment...</div>}>
            <FulfillmentPage editable />
        </Suspense>
    </>
);

export default OldFulfillmentRoute;
