"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";

// UI only — replace with real coupon data from your API later
type Coupon = {
  id: string;
  discountName: string;
  typeValue: string;
  products: string;
  minCriteria: string;
  period: string;
  usageLimit: string;
  usageNo: string;
  usageValue: string;
  status: "Active" | "Inactive";
};

const COUPONS: Coupon[] = [];

type StatusFilter = "all" | "active" | "deactive";

const CouponCodeList = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = COUPONS.filter((c) => {
    const matchesSearch =
      c.discountName.toLowerCase().includes(search.toLowerCase()) ||
      c.products.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.status === "Active") ||
      (statusFilter === "deactive" && c.status === "Inactive");
    return matchesSearch && matchesStatus;
  });

  const goToAddCoupon = () => {
    router.push("/marketing/coupon-code/add-coupon");
  };

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h5 className="fw-bold mb-0">Discounts & Coupons</h5>
          <span className="text-muted" style={{ fontSize: 12 }}>
            {filtered.length} discounts
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          style={{ fontSize: "10px", fontWeight: "bold" }}
          onClick={goToAddCoupon}
        >
          <Icon icon="mdi:plus" className="me-1" /> Add Discount
        </Button>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          type="search"
          className="form-control"
          style={{ fontSize: "12px", maxWidth: 320 }}
          placeholder="Search by discount name or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="d-flex gap-2">
          {(
            [
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "deactive", label: "Deactive" },
            ] as { key: StatusFilter; label: string }[]
          ).map((opt) => (
            <Button
              key={opt.key}
              variant={statusFilter === opt.key ? "primary" : "outline-secondary"}
              size="sm"
              style={{ fontSize: "10px" }}
              onClick={() => setStatusFilter(opt.key)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <Icon
            icon="mdi:tag-outline"
            style={{ fontSize: 40 }}
            className="text-muted mb-3"
          />
          <h6 className="fw-bold">No discounts yet</h6>
          <Button
            variant="primary"
            size="sm"
            className="mt-2"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={goToAddCoupon}
          >
            <Icon icon="mdi:plus" className="me-1" /> Add Discount
          </Button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-bordered mb-0 align-middle">
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "30px" }}>
                  <input type="checkbox" />
                </th>
                <th>Discount Name</th>
                <th>Type & Value</th>
                <th>Product(s)</th>
                <th>Min Criteria</th>
                <th>Period</th>
                <th>Usage Limit</th>
                <th>Usage No</th>
                <th>Usage Value</th>
                <th>Status</th>
                <th style={{ width: "80px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{c.discountName}</td>
                  <td>{c.typeValue}</td>
                  <td>{c.products}</td>
                  <td>{c.minCriteria}</td>
                  <td>{c.period}</td>
                  <td>{c.usageLimit}</td>
                  <td>{c.usageNo}</td>
                  <td>{c.usageValue}</td>
                  <td>
                    <span
                      className={`badge ${
                        c.status === "Active" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-1 justify-content-center">
                      <Button variant="primary" size="sm" style={{ fontSize: "10px" }} title="edit">
                        <Icon icon="mdi:edit" />
                      </Button>
                      <Button variant="danger" size="sm" style={{ fontSize: "10px" }} title="delete">
                        <Icon icon="mdi:delete" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default CouponCodeList;
