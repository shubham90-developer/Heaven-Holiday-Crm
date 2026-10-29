"use client";
import React, { useMemo, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import styles from "./subscription-plan.module.scss";

/* --------------------------------- Types ---------------------------------- */

type FixedCost = { service: string; baseCost: number; defaultLimit: number; extraCost: string };

type DailyRow = {
  date: string;
  proposals: number;
  flightPax: number;
  hotelNights: number;
  visaPaxUpload: number;
  documentVerification: number;
  amount: number;
};

type UsageService = {
  title: string;
  freeLimit: number;
  freeLimitUnit: string; // e.g. "/month"
  actualUsage: number | null;
  billingRate: number;
  billingUnit: string; // e.g. "/usage"
};

/* ---------------------- Placeholder data (replace with API) ---------------- */
// TODO: replace the constants below with data from your billing API.

const PLAN = {
  name: "Standard Plan Renewable",
  activeSince: "12-12-2022",
  activeUntil: "",
  baseCost: 65000,
  baseCostUnit: "year",
};

const FIXED_COSTS: FixedCost[] = [
  { service: "Proposal", baseCost: 0, defaultLimit: 200, extraCost: "5/usage" },
  { service: "WhatsApp API", baseCost: 5000, defaultLimit: 5, extraCost: "650/user" },
  { service: "Flight Seats", baseCost: 0, defaultLimit: 100, extraCost: "10/pax" },
  { service: "Document Verification", baseCost: 0, defaultLimit: 0, extraCost: "5/usage" },
];

const DAILY_ROWS: DailyRow[] = [
  { date: "01/09/2026", proposals: 2, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "02/09/2026", proposals: 4, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "03/09/2026", proposals: 12, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "04/09/2026", proposals: 2, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "05/09/2026", proposals: 1, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "07/09/2026", proposals: 13, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "08/09/2026", proposals: 7, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "10/09/2026", proposals: 3, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "11/09/2026", proposals: 16, flightPax: 3, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 30 },
  { date: "12/09/2026", proposals: 1, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "15/09/2026", proposals: 6, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "18/09/2026", proposals: 3, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "22/09/2026", proposals: 4, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "23/09/2026", proposals: 3, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "25/09/2026", proposals: 4, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
  { date: "26/09/2026", proposals: 1, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 },
];

const USAGE_SERVICES: UsageService[] = [
  { title: "Proposal", freeLimit: 200, freeLimitUnit: "/month", actualUsage: 86, billingRate: 5, billingUnit: "/usage" },
  { title: "WhatsApp API", freeLimit: 5, freeLimitUnit: "/month", actualUsage: null, billingRate: 650, billingUnit: "/user" },
  { title: "Flight Seats", freeLimit: 100, freeLimitUnit: "/month", actualUsage: null, billingRate: 10, billingUnit: "/pax" },
  { title: "Document Verification", freeLimit: 0, freeLimitUnit: "/month", actualUsage: 3, billingRate: 5, billingUnit: "/usage" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const YEARS = ["2024", "2025", "2026"];

/* --------------------------------- Helpers -------------------------------- */

const fmt = (n: number) => n.toLocaleString("en-IN");
const inr = (n: number) => `INR ${fmt(n)}`;

/* ---------------------------------- Page ---------------------------------- */

const SubscriptionPlan = () => {
  const [month, setMonth] = useState("September");
  const [year, setYear] = useState("2026");

  // TODO: refetch daily summary + usage when month/year change

  const totals = useMemo(
    () =>
      DAILY_ROWS.reduce(
        (acc, r) => ({
          proposals: acc.proposals + r.proposals,
          flightPax: acc.flightPax + r.flightPax,
          hotelNights: acc.hotelNights + r.hotelNights,
          visaPaxUpload: acc.visaPaxUpload + r.visaPaxUpload,
          documentVerification: acc.documentVerification + r.documentVerification,
          amount: acc.amount + r.amount,
        }),
        { proposals: 0, flightPax: 0, hotelNights: 0, visaPaxUpload: 0, documentVerification: 0, amount: 0 }
      ),
    []
  );

  return (
    <>
      {/* Billing Dashboard */}
      <Card className={`${styles.card} mb-3`}>
        <Card.Body>
          <h1 className={styles.pageTitle}>Billing Dashboard</h1>
          <div className={styles.metaRow}>
            <span>
              My Plan Name / Type: <b>{PLAN.name}</b>
            </span>
            <span>
              Active Since: <b>{PLAN.activeSince}</b> to <b>{PLAN.activeUntil || "—"}</b>
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* Plan Fee + Monthly Fixed Costs */}
      <Row className="g-3 mb-3">
        <Col lg={6} className="d-flex">
          <Card className={`${styles.card} w-100`}>
            <Card.Body>
              <h2 className={styles.sectionTitle}>Plan Fee</h2>
              <div className={styles.feeRow}>
                <span>Base Cost</span>
                <strong>
                  {inr(PLAN.baseCost)} / {PLAN.baseCostUnit}
                </strong>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="d-flex">
          <Card className={`${styles.card} w-100`}>
            <Card.Body>
              <h2 className={styles.sectionTitle}>Monthly Fixed Costs</h2>
              <div className="table-responsive">
                <table className={`table table-bordered align-middle ${styles.table}`}>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Base Cost</th>
                      <th>Default Limit</th>
                      <th>Extra Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FIXED_COSTS.map((c) => (
                      <tr key={c.service}>
                        <td>{c.service}</td>
                        <td>{fmt(c.baseCost)}</td>
                        <td>{fmt(c.defaultLimit)}</td>
                        <td>{c.extraCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Daily Summary */}
      <Card className={`${styles.card} mb-3`}>
        <Card.Body>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <h2 className={styles.sectionTitleAccent}>Daily Summary</h2>
            <div className="d-flex gap-2">
              <Form.Select
                size="sm"
                aria-label="Month"
                className={styles.filterSelect}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                size="sm"
                aria-label="Year"
                className={styles.filterSelect}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          <div className="table-responsive">
            <table className={`table table-bordered align-middle ${styles.table}`}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th className={styles.num}>No. Of Proposal</th>
                  <th className={styles.num}>No. of Flight Pax</th>
                  <th className={styles.num}>No. of Hotel Nights</th>
                  <th className={styles.num}>No. of Visa Pax Upload</th>
                  <th className={styles.num}>Document Verification</th>
                  <th className={styles.num}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {DAILY_ROWS.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-3">
                      No usage recorded for {month} {year}
                    </td>
                  </tr>
                )}

                {DAILY_ROWS.map((r) => (
                  <tr key={r.date}>
                    <td>{r.date}</td>
                    <td className={`${styles.num} ${styles.numLink}`}>{fmt(r.proposals)}</td>
                    <td className={`${styles.num} ${styles.numLink}`}>{fmt(r.flightPax)}</td>
                    <td className={`${styles.num} ${styles.numLink}`}>{fmt(r.hotelNights)}</td>
                    <td className={`${styles.num} ${styles.numLink}`}>{fmt(r.visaPaxUpload)}</td>
                    <td className={`${styles.num} ${styles.numLink}`}>{fmt(r.documentVerification)}</td>
                    <td className={`${styles.num} ${styles.numLink}`}>{fmt(r.amount)}</td>
                  </tr>
                ))}

                <tr className={styles.totalRow}>
                  <td>Total</td>
                  <td className={styles.num}>{fmt(totals.proposals)}</td>
                  <td className={styles.num}>{fmt(totals.flightPax)}</td>
                  <td className={styles.num}>{fmt(totals.hotelNights)}</td>
                  <td className={styles.num}>{fmt(totals.visaPaxUpload)}</td>
                  <td className={styles.num}>{fmt(totals.documentVerification)}</td>
                  <td className={styles.num}>{fmt(totals.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Detailed Usage & Billing Breakdown */}
      <Card className={styles.card}>
        <Card.Body>
          <h2 className={styles.sectionTitle}>Detailed Usage &amp; Billing Breakdown</h2>
          <Row className="g-3">
            {USAGE_SERVICES.map((s) => {
              const extra = s.actualUsage === null ? null : Math.max(s.actualUsage - s.freeLimit, 0);
              const total = (extra ?? 0) * s.billingRate;

              return (
                <Col key={s.title} xl={3} md={6}>
                  <Card className={styles.usageCard}>
                    <Card.Body className="p-3">
                      <div className={styles.usageHeader}>
                        {s.title}
                        <Icon icon="mdi:magnify" />
                      </div>

                      <div className={styles.usageRow}>
                        <span>Free Usage Limit</span>
                        <span>
                          {fmt(s.freeLimit)}
                          {s.freeLimitUnit}
                        </span>
                      </div>
                      <div className={styles.usageRow}>
                        <span>Actual Usage</span>
                        <span>{s.actualUsage === null ? "—" : fmt(s.actualUsage)}</span>
                      </div>
                      <div className={styles.usageRow}>
                        <span>Extra Usage</span>
                        <span>{extra === null || extra === 0 ? "—" : fmt(extra)}</span>
                      </div>
                      <div className={styles.usageRow}>
                        <span>Billing Rate</span>
                        <span>
                          {fmt(s.billingRate)}
                          {s.billingUnit}
                        </span>
                      </div>

                      <div className={styles.usageTotal}>
                        <span>Total Amount</span>
                        <span>{inr(total)}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default SubscriptionPlan;
