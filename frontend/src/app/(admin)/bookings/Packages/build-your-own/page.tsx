import React, { Suspense } from "react";
import PageTitle from "@/components/PageTitle";
import DynamicPackage from "./components/DynamicPackage";

const DynamicPackagePage = () => {
    return (
        <>
            <PageTitle title="Build your own Dynamic Package" />
            <Suspense fallback={<div className="pkg-builder"><div className="pkg-card p-3">Loading...</div></div>}>
                <DynamicPackage />
            </Suspense>
        </>
    );
};

export default DynamicPackagePage;
