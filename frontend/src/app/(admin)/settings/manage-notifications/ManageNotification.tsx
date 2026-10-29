"use client";
import React, { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import styles from "./manage-notifications.module.scss";

/* ---------------------------------- Types --------------------------------- */

type NotificationOption = { key: string; label: string; checked: boolean };

/** null = not applicable (no checkbox rendered) */
type PaxRule = {
  b2cShow: boolean | null;
  b2cMandatory: boolean | null;
  b2bShow: boolean | null;
  b2bMandatory: boolean | null;
};

type PaxField = { key: string; label: string } & PaxRule;
type RuleKey = keyof PaxRule;

/* ------------------------------ Initial data ------------------------------ */

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  // column 1
  { key: "emailOpenAlert", label: "Email Open Alert", checked: false },
  { key: "birthdayReminder", label: "Birthday Reminder", checked: true },
  { key: "facebookLeadAlert", label: "Facebook Lead Alert", checked: true },
  { key: "b2bAutoLogin", label: "B2B Auto Login", checked: true },
  { key: "showNetworkPackageInGtx", label: "Show Network Package In GTX", checked: true },
  { key: "allowYouth", label: "Allow Youth", checked: false },
  { key: "showOldQuickPackage", label: "Show Old Quick Package", checked: false },
  // column 2
  { key: "confirmationEmailWithoutPayment", label: "Confirmation Email (W/o Payment)", checked: true },
  { key: "anniversaryReminder", label: "Anniversary Reminder", checked: true },
  { key: "reminderPopUp", label: "Reminder Pop Up", checked: true },
  { key: "showOnlyMyInventoryHotels", label: "Show Only My Inventory Hotels", checked: true },
  { key: "showGtxSupplier", label: "Show GTX Supplier", checked: false },
  { key: "serviceFeeModel", label: "Service Fee Model", checked: false },
  { key: "showProPackage", label: "Show Pro Package", checked: false },
  // column 3
  { key: "confirmationEmailOnPayment", label: "Confirmation Email (On Payment)", checked: true },
  { key: "autoFollowUpOnProposal", label: "Auto Follow Up On Proposal", checked: true },
  { key: "queryAcknowledgement", label: "Query Acknowledgement", checked: true },
  { key: "todoReminderEmails", label: "To Do Reminder Emails (Morning/Evening)", checked: true },
  { key: "flightInvoiceWithPaxDetail", label: "Flight Invoice with Pax detail", checked: false },
  { key: "dmc", label: "DMC", checked: false },
];

const rule = (
  b2cShow: boolean | null,
  b2cMandatory: boolean | null,
  b2bShow: boolean | null,
  b2bMandatory: boolean | null
): PaxRule => ({ b2cShow, b2cMandatory, b2bShow, b2bMandatory });

const LEAD_PAX_FIELDS: PaxField[] = [
  { key: "relation", label: "Relation", ...rule(true, false, null, null) },
  { key: "salutation", label: "Salutation", ...rule(true, true, true, false) },
  { key: "firstName", label: "First Name", ...rule(true, true, true, false) },
  { key: "lastName", label: "Last Name", ...rule(true, false, true, false) },
  { key: "emailId", label: "Email Id", ...rule(true, false, true, false) },
  { key: "mobileNumber", label: "Mobile Number", ...rule(true, false, true, false) },
  { key: "dob", label: "DOB", ...rule(true, false, true, false) },
  { key: "passportNo", label: "Passport No.", ...rule(true, false, true, false) },
  { key: "issueDate", label: "Issue Date", ...rule(false, false, true, false) },
  { key: "expiryDate", label: "Expiry Date", ...rule(false, false, false, false) },
  { key: "city", label: "City", ...rule(false, false, false, false) },
  { key: "country", label: "Country", ...rule(false, false, false, false) },
  { key: "state", label: "State", ...rule(false, false, false, false) },
  { key: "zipPostalCode", label: "Zip/Postal Code", ...rule(false, false, false, false) },
  { key: "panCard", label: "Pan Card", ...rule(false, false, false, false) },
  { key: "gstNumber", label: "GST Number", ...rule(false, false, false, false) },
  { key: "address", label: "Address", ...rule(false, false, false, false) },
];

const OTHER_PAX_FIELDS: PaxField[] = [
  { key: "relation", label: "Relation", ...rule(true, false, null, null) },
  { key: "salutation", label: "Salutation", ...rule(true, false, false, false) },
  { key: "firstName", label: "First Name", ...rule(true, false, false, false) },
  { key: "lastName", label: "Last Name", ...rule(true, false, false, false) },
  { key: "emailId", label: "Email Id", ...rule(true, false, false, false) },
  { key: "mobileNumber", label: "Mobile Number", ...rule(true, false, false, false) },
  { key: "dob", label: "DOB", ...rule(true, false, false, false) },
  { key: "passportNo", label: "Passport No.", ...rule(false, false, false, false) },
  { key: "issueDate", label: "Issue Date", ...rule(false, false, false, false) },
  { key: "expiryDate", label: "Expiry Date", ...rule(false, false, false, false) },
  { key: "city", label: "City", ...rule(false, false, false, false) },
  { key: "country", label: "Country", ...rule(false, false, false, false) },
  { key: "state", label: "State", ...rule(false, false, false, false) },
  { key: "zipPostalCode", label: "Zip/Postal Code", ...rule(false, false, false, false) },
  { key: "address", label: "Address", ...rule(false, false, false, false) },
];

/* ------------------------------- Sub-component ---------------------------- */

type PaxTableProps = {
  title: string;
  fields: PaxField[];
  onToggle: (fieldKey: string, ruleKey: RuleKey, value: boolean) => void;
};

const PaxTable = ({ title, fields, onToggle }: PaxTableProps) => {
  const cell = (field: PaxField, ruleKey: RuleKey) => {
    const value = field[ruleKey];
    if (value === null) return <td key={ruleKey} />;
    return (
      <td key={ruleKey}>
        <Form.Check.Input
          type="checkbox"
          checked={value}
          onChange={(e) => onToggle(field.key, ruleKey, e.target.checked)}
          aria-label={`${field.label} ${ruleKey}`}
        />
      </td>
    );
  };

  return (
    <>
      <div className={styles.paxTitle}>{title}</div>
      <div className={styles.tableWrap}>
        <div className="table-responsive">
          <table className={`table table-bordered ${styles.table}`}>
            <thead>
              <tr>
                <th rowSpan={3} style={{ verticalAlign: "middle" }}>
                  Field Name
                </th>
                <th colSpan={4}>Package</th>
              </tr>
              <tr className={styles.subHead}>
                <th colSpan={2}>B2C</th>
                <th colSpan={2}>B2B</th>
              </tr>
              <tr className={styles.subHead}>
                <th>Show</th>
                <th>Mandatory</th>
                <th>Show</th>
                <th>Mandatory</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.key}>
                  <td className={styles.fieldName}>{field.label}</td>
                  {cell(field, "b2cShow")}
                  {cell(field, "b2cMandatory")}
                  {cell(field, "b2bShow")}
                  {cell(field, "b2bMandatory")}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

/* -------------------------------- Main page ------------------------------- */

/** Mandatory implies Show; hiding a field also clears Mandatory. */
const applyToggle = (
  fields: PaxField[],
  fieldKey: string,
  ruleKey: RuleKey,
  value: boolean
): PaxField[] =>
  fields.map((f) => {
    if (f.key !== fieldKey) return f;
    const next: PaxField = { ...f, [ruleKey]: value };

    if (ruleKey === "b2cMandatory" && value && next.b2cShow !== null) next.b2cShow = true;
    if (ruleKey === "b2bMandatory" && value && next.b2bShow !== null) next.b2bShow = true;
    if (ruleKey === "b2cShow" && !value && next.b2cMandatory !== null) next.b2cMandatory = false;
    if (ruleKey === "b2bShow" && !value && next.b2bMandatory !== null) next.b2bMandatory = false;

    return next;
  });

const ManageNotification = () => {
  const [options, setOptions] = useState<NotificationOption[]>(NOTIFICATION_OPTIONS);
  const [leadPax, setLeadPax] = useState<PaxField[]>(LEAD_PAX_FIELDS);
  const [otherPax, setOtherPax] = useState<PaxField[]>(OTHER_PAX_FIELDS);

  const toggleOption = (key: string) =>
    setOptions((prev) => prev.map((o) => (o.key === key ? { ...o, checked: !o.checked } : o)));

  return (
    <>
      {/* Manage Notifications */}
      <Card className={`${styles.card} mb-3`}>
        <Card.Header className={styles.cardHeader}>Manage Notifications</Card.Header>
        <Card.Body>
          <div className={styles.optionGrid}>
            {options.map((option) => (
              <label key={option.key} className={styles.optionItem}>
                <Form.Check.Input
                  type="checkbox"
                  checked={option.checked}
                  onChange={() => toggleOption(option.key)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Booking Form Validation */}
      <Card className={styles.card}>
        <Card.Header className={styles.cardHeader}>Booking Form Validation</Card.Header>
        <Card.Body>
          <Row className="g-4">
            <Col xl={6}>
              <PaxTable
                title="Lead Pax"
                fields={leadPax}
                onToggle={(f, r, v) => setLeadPax((prev) => applyToggle(prev, f, r, v))}
              />
            </Col>
            <Col xl={6}>
              <PaxTable
                title="Other Pax"
                fields={otherPax}
                onToggle={(f, r, v) => setOtherPax((prev) => applyToggle(prev, f, r, v))}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default ManageNotification;
