"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import CustomFlatpickr from "@/components/CustomFlatpickr";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type FormValues = {
  createType: "single" | "bulk";
  discountCodeName: string;
  discountCode: string;
  currency: string;
  discountApplicable: "total" | "service_fee";
  discountType: string;
  percentage: string;
  product: string;
  minimumOrderValue: string;
  customerEligibility: string;
  noOfUsage: string;
  fromDate: string;
  toDate: string;
  validOnTravelDates: boolean;
  applicableMaxSpentLimit: boolean;
  defaultDisplay: boolean;
  active: boolean;
  description: string;
};

// UI only — replace with real options from your APIs later
const DISCOUNT_TYPES = ["Percentage", "Flat Amount"];
const PRODUCTS = ["All", "Flights", "Hotels", "Packages", "Visa"];
const CUSTOMER_ELIGIBILITY = ["Everyone", "New Customers", "Returning Customers"];
const CURRENCIES = ["INR", "USD", "EUR", "AED"];

const AddCoupon = () => {
  const router = useRouter();
  const { register, handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      createType: "single",
      discountCodeName: "",
      discountCode: "",
      currency: "INR",
      discountApplicable: "total",
      discountType: "Percentage",
      percentage: "",
      product: "All",
      minimumOrderValue: "",
      customerEligibility: "Everyone",
      noOfUsage: "",
      fromDate: "",
      toDate: "",
      validOnTravelDates: false,
      applicableMaxSpentLimit: false,
      defaultDisplay: false,
      active: false,
      description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // UI only — wire this up to your create-discount-coupon API later
    console.log("Saving discount coupon", values);
    toast.success("Discount code saved");
    router.push("/marketing/coupon-code");
  };

  return (
    <Row className="g-3">
      <Col lg={8}>
        <Card className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">Add Discount Coupon</h6>
            <Button
              variant="outline-secondary"
              size="sm"
              style={{ fontSize: "10px" }}
              onClick={() => router.push("/marketing/coupon-code")}
            >
              <Icon icon="mdi:arrow-left" className="me-1" /> Back
            </Button>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Create Type */}
            <Form.Label className="fw-semibold small">Create Type</Form.Label>
            <div className="d-flex gap-4 mb-3">
              <Form.Check
                type="radio"
                label="Single Coupon"
                value="single"
                {...register("createType")}
              />
              <Form.Check
                type="radio"
                label="Bulk Coupon"
                value="bulk"
                {...register("createType")}
              />
            </div>

            <Row className="g-3 mb-3">
              <Col md={4}>
                <Form.Label className="small">Discount Code Name</Form.Label>
                <Form.Control size="sm" {...register("discountCodeName")} />
              </Col>
              <Col md={4}>
                <Form.Label className="small">Discount Code</Form.Label>
                <Form.Control size="sm" {...register("discountCode")} />
              </Col>
              <Col md={4}>
                <Form.Label className="small">
                  Currency <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select size="sm" {...register("currency", { required: true })}>
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Discount Applicable */}
            <Form.Label className="fw-semibold small">Discount Applicable</Form.Label>
            <div className="d-flex gap-4 mb-3">
              <Form.Check
                type="radio"
                label="On Total"
                value="total"
                {...register("discountApplicable")}
              />
              <Form.Check
                type="radio"
                label="On Service Fee"
                value="service_fee"
                {...register("discountApplicable")}
              />
            </div>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Label className="small">Discount Type</Form.Label>
                <Form.Select size="sm" {...register("discountType")}>
                  {DISCOUNT_TYPES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="small">Percentage</Form.Label>
                <Form.Control size="sm" {...register("percentage")} />
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Label className="small">Product</Form.Label>
                <Form.Select size="sm" {...register("product")}>
                  {PRODUCTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Label className="small">Minimum Order Value</Form.Label>
                <Form.Control size="sm" {...register("minimumOrderValue")} />
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Label className="small">Customer Eligibility</Form.Label>
                <Form.Select size="sm" {...register("customerEligibility")}>
                  {CUSTOMER_ELIGIBILITY.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Label className="small">No of Usage</Form.Label>
                <Form.Control size="sm" {...register("noOfUsage")} />
              </Col>
            </Row>

            {/* Active During */}
            <Form.Label className="fw-semibold small">Active During</Form.Label>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Controller
                  control={control}
                  name="fromDate"
                  render={({ field }) => (
                    <CustomFlatpickr
                      className="form-control form-control-sm"
                      placeholder="From Date"
                      options={{
                        enableTime: false,
                        onChange: (dates: Date[]) =>
                          field.onChange(dates.length ? dates[0].toISOString() : ""),
                      }}
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Controller
                  control={control}
                  name="toDate"
                  render={({ field }) => (
                    <CustomFlatpickr
                      className="form-control form-control-sm"
                      placeholder="To Date"
                      options={{
                        enableTime: false,
                        onChange: (dates: Date[]) =>
                          field.onChange(dates.length ? dates[0].toISOString() : ""),
                      }}
                    />
                  )}
                />
              </Col>
            </Row>

            <Form.Check
              type="checkbox"
              label="Valid on Travel Dates"
              className="mb-2"
              {...register("validOnTravelDates")}
            />
            <Form.Check
              type="checkbox"
              label="Applicable Max Spent Limit"
              className="mb-3"
              {...register("applicableMaxSpentLimit")}
            />

            <Row className="align-items-center mb-3">
              <Col md={8}>
                <Form.Check
                  type="checkbox"
                  label="Default Display (Website/ Booking Page)"
                  {...register("defaultDisplay")}
                />
              </Col>
              <Col md={4}>
                <Form.Check type="checkbox" label="Active" {...register("active")} />
              </Col>
            </Row>

            <Form.Label className="small">Description</Form.Label>
            <div className="mb-3">
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Add a short description..."
                  />
                )}
              />
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => router.push("/marketing/coupon-code")}
              >
                Discard
              </Button>
              <Button variant="danger" size="sm" type="submit">
                Save Discount Code
              </Button>
            </div>
          </Form>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="p-3">
          <h6 className="fw-bold mb-3">Overview</h6>
          <div style={{ fontSize: 12 }} className="d-flex flex-column gap-3">
            <div>
              <strong>Discount Name:</strong> Discount Name is for Display
              Purpose only like New year Offer or Xmas offer etc.
            </div>
            <div>
              <strong>Discount Code:</strong> Discount Code is the Unique Code
              that you can give to your clients.
            </div>
            <div>
              <strong>Minimum Order Value:</strong> Discount code will be
              applicable if order value is equal or more than the Minimum
              Order Value.
            </div>
            <div>
              <strong>No. of Usage:</strong> No of times a code can be used.
            </div>
            <div>
              <strong>Active During:</strong> it means this code can be used
              between this period only.
            </div>
            <div>
              <strong>Valid for Travel Dates:</strong> It means code is
              applicable only in case travel date is between Booking Dates.
              (eg. If Active During Period is 1st Jan to 28th Feb and Booking
              Dates are 20th May till 30th Sep it means this code can be used
              only between 1st Jan to 28th Feb on bookings where travel date
              is 20th May till 30th Sep.
            </div>
            <div>
              <strong>Max Spent Limit:</strong> This helps you to control
              your spent on a particular coupon code specially where you
              offer discount&apos;s in %. Once spent on a particular code
              reached the limit this code will become deactivate.
            </div>
            <div>
              <strong>Default Display (Website/ Booking Page):</strong> In
              case Default Display is active it means this code will be
              visible on the booking page and on website where customer can
              pick any of the coupon code to book the services. It is used to
              promote online sale on the website.
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default AddCoupon;
