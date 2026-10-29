import React, { Suspense } from "react";
import PageTitle from "@/components/PageTitle";
import InvoicePage from "../components/InvoicePage";

const InvoiceRoute = () => (
    <>
        <PageTitle title="Invoice" subTitle="Packages" />
        <Suspense fallback={<div className="p-3">Loading invoice...</div>}>
            <InvoicePage />
        </Suspense>
    </>
);

export default InvoiceRoute;
