"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Col, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetQueryByIdQuery } from "@/store/services/queriesApi";
import { useGetSuppliersQuery } from "@/store/services/supplierApi";
import { useGetCompanyProfileQuery } from "@/store/services/settings/company-profile/companyProfileApi";
import { useGetStaffQuery } from "@/store/services/staff-management/staff/staffApi";
import {
  useGetEnquirySupplierMailConfigQuery,
  useSendEnquiryToSuppliersMutation,
} from "@/store/services/enquirySupplierApi";
import AddSupplierPopup from "./AddSupplierPopup";
import WhatsAppShareModal from "./WhatsAppShareModal";
import EmailPreviewModal from "./EmailPreviewModal";
import EditableEnquiryTable from "./EditableEnquiryTable";
import {
  addDays,
  buildEmailClosing,
  buildEmailIntro,
  buildWhatsAppText,
  composeEnquiryEmailHtml,
  formatDate,
  formatHotelPreference,
  formatPax,
  formatPaxHtml,
  joinValues,
  mapSupplierToListItem,
  personalizeSupplierEmail,
  type EnquiryDetails,
  type SupplierListItem,
} from "./enquirySupplierUtils";
import "react-quill-new/dist/quill.snow.css";
import "./enquiry-supplier-package.scss";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const DEFAULT_COMPANY_NAME = "A HEAVEN HOSPITALITY PVT LTD";

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ size: ["small", false, "large"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["link"],
    ["clean"],
    ["code-block"],
  ],
};

const closingQuillModules = { toolbar: false };

const uniqueEmails = (values: Array<string | undefined | null>) =>
  Array.from(
    new Set(
      values
        .map((value) => String(value || "").trim())
        .filter(Boolean)
    )
  );

const EnquirySupplierPackage = () => {
  const params = useParams();
  const queryId = params?.id as string;

  const { data: queryResponse, isLoading, isError } = useGetQueryByIdQuery(
    queryId,
    { skip: !queryId }
  );
  const { data: suppliersResponse, isLoading: suppliersLoading } =
    useGetSuppliersQuery(undefined);
  const { data: companyProfileResponse } = useGetCompanyProfileQuery(undefined);
  const { data: staffResponse } = useGetStaffQuery(undefined);
  const { data: mailConfigResponse } = useGetEnquirySupplierMailConfigQuery(undefined);
  const [sendEnquiry, { isLoading: isSending }] = useSendEnquiryToSuppliersMutation();

  const query = queryResponse?.data;
  const lead = query?.leadId || {};
  const firstQuery = query?.queries?.[0] || {};
  const packageDetails = firstQuery?.packageDetails || {};
  const companyProfile = companyProfileResponse?.data || {};
  const mailConfig = mailConfigResponse?.data || {};

  const companyName =
    companyProfile?.companyDetails?.companyDisplayName ||
    companyProfile?.companyDetails?.companyName ||
    DEFAULT_COMPANY_NAME;

  const signerName =
    [
      companyProfile?.personalDetails?.firstName,
      companyProfile?.personalDetails?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    companyProfile?.companyDetails?.agencySignature ||
    companyName;

  const signerPhone =
    companyProfile?.personalDetails?.mobileNumber ||
    companyProfile?.companyDetails?.companyNumber ||
    "";

  const enquiryDetails: EnquiryDetails = useMemo(() => {
    const customerName =
      [lead?.salutation, lead?.firstName, lead?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      lead?.companyName ||
      "Customer";
    const enquiryId = query?._id?.slice(-7)?.toUpperCase() || "";
    const destination = packageDetails.goingTo || "";
    const days = Number(packageDetails.noOfDays) || 0;
    const checkIn = formatDate(packageDetails.specificDate);
    const checkOut =
      formatDate(packageDetails.checkOut) ||
      addDays(packageDetails.specificDate, Math.max(days - 1, 0));

    return {
      customerName,
      enquiryId,
      enquiryFor: firstQuery?.requirementType || "Package",
      destination,
      checkIn: checkIn || "NA",
      checkOut: checkOut || "NA",
      noOfDays: days ? `${days} Days` : "",
      pax: formatPax(packageDetails),
      paxHtml: formatPaxHtml(packageDetails),
      hotelPreference: formatHotelPreference(packageDetails.hotelPreference),
      inclusions: joinValues(packageDetails.inclusions),
      theme: joinValues(packageDetails.theme),
      foodPreference: joinValues(packageDetails.foodPreference),
      remarks: packageDetails.remark || query?.remark || "",
      subject: destination
        ? `Travel Enquiry for ${destination} from ${companyName}${enquiryId ? ` (Query Id- ${enquiryId})` : ""}`
        : `Travel Enquiry from ${companyName}${enquiryId ? ` (Query Id- ${enquiryId})` : ""}`,
    };
  }, [query, lead, packageDetails, firstQuery, companyName]);

  const suppliers: SupplierListItem[] = useMemo(
    () => (suppliersResponse?.data || []).map(mapSupplierToListItem),
    [suppliersResponse]
  );

  const senderEmails = useMemo(() => {
    const staffEmails = (staffResponse?.data || []).map((staff: any) =>
      staff?.isSelfSender ? staff?.email : staff?.senderEmail
    );

    return uniqueEmails([
      mailConfig.fromEmail,
      companyProfile?.personalDetails?.senderEmail,
      companyProfile?.personalDetails?.email,
      companyProfile?.companyDetails?.companyEmail,
      ...staffEmails,
    ]);
  }, [mailConfig.fromEmail, companyProfile, staffResponse]);

  const [subject, setSubject] = useState("");
  const [cc, setCc] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [emailIntro, setEmailIntro] = useState("");
  const [emailClosing, setEmailClosing] = useState("");
  const [gridDetails, setGridDetails] = useState<EnquiryDetails | null>(null);
  const [packageSearch, setPackageSearch] = useState("Packages");
  const [appliedFilter, setAppliedFilter] = useState("Packages");
  const [selectedSuppliers, setSelectedSuppliers] = useState<Record<string, boolean>>({});
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!query?._id) return;
    setSubject(enquiryDetails.subject);
    setEmailIntro(buildEmailIntro(enquiryDetails));
    setGridDetails(enquiryDetails);
  }, [query?._id]);

  useEffect(() => {
    if (!query?._id) return;
    setEmailClosing(buildEmailClosing(signerName, signerPhone));
  }, [query?._id, signerName, signerPhone]);

  useEffect(() => {
    if (!senderEmail && senderEmails.length) {
      setSenderEmail(senderEmails[0]);
    }
  }, [senderEmail, senderEmails]);

  const filteredSuppliers = useMemo(() => {
    const term = appliedFilter.trim().toLowerCase();
    if (!term) return suppliers;
    return suppliers.filter((supplier) =>
      [supplier.name, supplier.location, supplier.services, supplier.contactName, supplier.contactEmail]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [suppliers, appliedFilter]);

  const visibleIds = filteredSuppliers.map((supplier) => supplier.id);
  const allChecked =
    visibleIds.length > 0 && visibleIds.every((id) => selectedSuppliers[id]);

  const tableDetails = gridDetails || enquiryDetails;
  const selectedSupplierList = suppliers.filter((supplier) => selectedSuppliers[supplier.id]);
  const previewSupplier = selectedSupplierList[0];
  const composedEmailHtml = composeEnquiryEmailHtml(
    emailIntro,
    tableDetails,
    emailClosing
  );
  const previewHtml = personalizeSupplierEmail(
    composedEmailHtml,
    previewSupplier?.name || "Supplier Name"
  );
  const whatsappText = buildWhatsAppText(
    tableDetails,
    previewSupplier?.name || "Supplier",
    signerName,
    signerPhone
  );

  const handleGridChange = (field: keyof EnquiryDetails, value: string) => {
    setGridDetails((prev) => ({
      ...(prev || enquiryDetails),
      [field]: value,
    }));
  };

  const toggleAll = () => {
    const next = !allChecked;
    setSelectedSuppliers((prev) => {
      const updated = { ...prev };
      visibleIds.forEach((id) => {
        updated[id] = next;
      });
      return updated;
    });
  };

  const toggleSupplier = (id: string) => {
    setSelectedSuppliers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSupplierCreated = (supplierId: string) => {
    setSelectedSuppliers((prev) => ({ ...prev, [supplierId]: true }));
  };

  const handleWhatsApp = () => {
    setShowWhatsApp(true);
  };

  const handlePreview = () => {
    if (!emailIntro.trim() && !emailClosing.trim()) {
      toast.error("Email body is empty");
      return;
    }
    setShowPreview(true);
  };

  const handleSend = async () => {
    if (!selectedSupplierList.length) {
      toast.error("Select at least one supplier");
      return;
    }
    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!emailIntro.trim() && !emailClosing.trim()) {
      toast.error("Email body is required");
      return;
    }

    const missingEmail = selectedSupplierList.find((supplier) => !supplier.contactEmail);
    if (missingEmail) {
      toast.error(`${missingEmail.name} does not have an email`);
      return;
    }

    try {
      const result = await sendEnquiry({
        queryId,
        subject: subject.trim(),
        htmlBody: composedEmailHtml,
        cc: cc.trim(),
        senderEmail: senderEmail.trim(),
        supplierIds: selectedSupplierList.map((supplier) => supplier.id),
      }).unwrap();

      toast.success(result?.message || "Enquiry sent to selected suppliers");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send enquiry emails");
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (isError || !query) {
    return (
      <div className="p-4 text-danger text-center">
        Failed to load enquiry details.
      </div>
    );
  }

  return (
    <div className="enquiry-supplier-package">
      <nav className="esp-breadcrumb d-flex align-items-center flex-wrap gap-1">
        <Link href="/dashboard">
          <IconifyIcon icon="mdi:home" className="fs-16" />
        </Link>
        <span>/</span>
        <span>Buy</span>
        <span>/</span>
        <span>Packages</span>
        <span>/</span>
        <span>Enquiry supplier package</span>
        <span>/</span>
        <span className="esp-breadcrumb-active">
          {enquiryDetails.customerName}
        </span>
      </nav>

      <div className="esp-summary-card">
        <div className="esp-summary-row">
          <div className="esp-summary-cell">
            <div className="label">Customer Name</div>
            <div className="value">{enquiryDetails.customerName}</div>
          </div>
          <div className="esp-summary-cell">
            <div className="label">Enquiry ID</div>
            <div className="value">{enquiryDetails.enquiryId || "N/A"}</div>
          </div>
          <div className="esp-summary-cell">
            <div className="label">Enquiry For</div>
            <div className="value">{enquiryDetails.enquiryFor}</div>
          </div>
        </div>
        <div className="esp-enquiry-details-header">Enquiry Details</div>
        <div className="esp-summary-row">
          <div className="esp-summary-cell">
            <div className="label">Check In</div>
            <div className="value">{enquiryDetails.checkIn}</div>
          </div>
          <div className="esp-summary-cell">
            <div className="label">Check Out</div>
            <div className="value">{enquiryDetails.checkOut}</div>
          </div>
          <div className="esp-summary-cell">
            <div className="label">No Of Days</div>
            <div className="value">{enquiryDetails.noOfDays || "NA"}</div>
          </div>
          <div className="esp-summary-cell">
            <div className="label">Destination</div>
            <div className="value">{enquiryDetails.destination || "NA"}</div>
          </div>
          <div className="esp-summary-cell">
            <div className="label">No of Pax</div>
            <div className="value">{enquiryDetails.pax || "NA"}</div>
          </div>
        </div>
      </div>

      <Row className="g-3">
        <Col lg={8}>
          <div className="esp-main-card">
            <Row className="g-3 mb-3">
              <Col md={12}>
                <label className="esp-field-label">Subject</label>
                <Form.Control
                  className="esp-field-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <label className="esp-field-label">CC</label>
                <Form.Control
                  className="esp-field-input"
                  placeholder="cc email id"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <label className="esp-field-label">Sender Email ID</label>
                <Form.Select
                  className="esp-field-input"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                >
                  <option value="">Select</option>
                  {senderEmails.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <div className="esp-compose">
              <ReactQuill
                theme="snow"
                value={emailIntro}
                onChange={setEmailIntro}
                modules={quillModules}
              />
              <div className="esp-compose-table">
                <EditableEnquiryTable
                  details={tableDetails}
                  onChange={handleGridChange}
                />
              </div>
              <div className="esp-compose-closing">
                <ReactQuill
                  theme="snow"
                  value={emailClosing}
                  onChange={setEmailClosing}
                  modules={closingQuillModules}
                />
              </div>
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="esp-supplier-panel">
            <div className="esp-supplier-search">
              <Form.Control
                className="esp-search-input"
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setAppliedFilter(packageSearch);
                  }
                }}
                placeholder="Search suppliers"
              />
              <button
                type="button"
                className="esp-filter-btn"
                onClick={() => setAppliedFilter(packageSearch)}
              >
                Filter
              </button>
            </div>

            <div className="esp-supplier-list">
              <Form.Check
                type="checkbox"
                label="Check All"
                checked={allChecked}
                onChange={toggleAll}
                className="mb-3"
                style={{ fontSize: "12px", fontWeight: 600 }}
              />

              {suppliersLoading ? (
                <div className="esp-empty-suppliers">Loading suppliers...</div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="esp-empty-suppliers">
                  No suppliers found. Click Add Supplier to create one.
                </div>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <div key={supplier.id} className="esp-supplier-item">
                    <Form.Check
                      type="checkbox"
                      checked={Boolean(selectedSuppliers[supplier.id])}
                      onChange={() => toggleSupplier(supplier.id)}
                      label={
                        <div>
                          <div className="supplier-name">
                            {supplier.name}
                            {supplier.location ? ` (${supplier.location})` : ""}
                          </div>
                          {supplier.services ? (
                            <div className="supplier-meta">{supplier.services}</div>
                          ) : null}
                          <div className="supplier-contact">
                            {supplier.contactName}
                            {supplier.contactEmail ? ` (${supplier.contactEmail})` : ""}
                          </div>
                        </div>
                      }
                      style={{ fontSize: "11px" }}
                    />
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              className="esp-add-supplier-btn"
              onClick={() => setShowAddSupplier(true)}
            >
              Add Supplier
            </button>
          </div>
        </Col>
      </Row>

      <div className="esp-footer-actions">
        <button type="button" className="esp-whatsapp-btn" onClick={handleWhatsApp}>
          Share on Whatsapp
        </button>
        <button type="button" className="esp-preview-btn" onClick={handlePreview}>
          Preview
        </button>
        <button
          type="button"
          className="esp-send-btn"
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>

      <AddSupplierPopup
        show={showAddSupplier}
        onHide={() => setShowAddSupplier(false)}
        destination={enquiryDetails.destination}
        onCreated={handleSupplierCreated}
      />
      <WhatsAppShareModal
        show={showWhatsApp}
        onHide={() => setShowWhatsApp(false)}
        text={whatsappText}
      />
      <EmailPreviewModal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        from={senderEmail || mailConfig.fromEmail || companyName}
        to={selectedSupplierList.map((supplier) => supplier.contactEmail).join(", ")}
        cc={cc}
        subject={subject}
        html={previewHtml}
      />
    </div>
  );
};

export default EnquirySupplierPackage;
