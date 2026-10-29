import React from "react";
import PageTitle from "@/components/PageTitle";
import CouponCodeList from "./components/CouponCodeList";

const CouponCodePage = () => {
  return (
    <>
      <PageTitle title="Discounts & Coupons" subTitle="Marketing / Coupon Code" />
      <CouponCodeList />
    </>
  );
};

export default CouponCodePage;
