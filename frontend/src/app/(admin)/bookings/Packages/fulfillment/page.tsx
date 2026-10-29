import React, { Suspense } from "react";
import PageTitle from "@/components/PageTitle";
import FulfillmentPage from "../components/FulfillmentPage";

const FulfillmentRoute = () => (
    <>
        <PageTitle title="Fulfillment" subTitle="Packages" />
        <Suspense fallback={<div className="p-3">Loading fulfillment...</div>}>
            <FulfillmentPage editable={false} />
        </Suspense>
    </>
);

export default FulfillmentRoute;
