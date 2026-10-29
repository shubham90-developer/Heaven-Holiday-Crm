"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, Col, Form, Row } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetQueryByIdQuery } from "@/store/services/queriesApi";
import "./package-search-result.scss";

const formatSearchDate = (date?: string | Date | null) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PackageSearchResult = () => {
  const router = useRouter();
  const params = useParams();
  const queryId = params?.id as string;
  const [sortBy, setSortBy] = useState<"price" | "duration">("price");

  const { data: queryResponse, isLoading, isError } = useGetQueryByIdQuery(
    queryId,
    { skip: !queryId }
  );

  const query = queryResponse?.data;
  const lead = query?.leadId || {};
  const firstQuery = query?.queries?.[0] || {};
  const packageDetails = firstQuery?.packageDetails || {};

  const customerName = [lead?.firstName, lead?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim() || "Customer";

  const searchSummary = useMemo(
    () => ({
      destination: packageDetails.goingTo || "N/A",
      travelers: packageDetails.travelers
        ? `${packageDetails.travelers} adult(s)`
        : "N/A",
      when: formatSearchDate(packageDetails.specificDate),
      priceRange: packageDetails.priceRange || "",
    }),
    [packageDetails]
  );

  if (isLoading) {
    return <div className="p-4 text-center">Loading search results...</div>;
  }

  if (isError || !query) {
    return (
      <div className="p-4 text-danger text-center">
        Failed to load package search details.
      </div>
    );
  }

  return (
    <div className="package-search-result">
      <nav className="psr-breadcrumb d-flex align-items-center flex-wrap gap-1">
        <Link href="/dashboard">
          <IconifyIcon icon="mdi:home" className="fs-16" />
        </Link>
        <span>/</span>
        <span>Buy</span>
        <span>/</span>
        <span>Packages</span>
        <span>/</span>
        <span>Package Search Result</span>
        <span>/</span>
        <span className="psr-breadcrumb-active">{customerName}</span>
      </nav>

      <div className="psr-summary-bar">
        <Row className="align-items-center g-3">
          <Col md={9}>
            <Row className="g-3">
              <Col sm={6} md={3}>
                <div className="psr-summary-item">
                  <strong>To:</strong> {searchSummary.destination}
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="psr-summary-item">
                  <strong>Travelers:</strong> {searchSummary.travelers}
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="psr-summary-item">
                  <strong>When:</strong> {searchSummary.when || "N/A"}
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="psr-summary-item">
                  <strong>Price Range:</strong> {searchSummary.priceRange}
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={3} className="text-md-end">
            <Button
              variant="light"
              className="psr-modify-search-btn"
              onClick={() =>
                router.push(`/crm/queries/view-queries/${queryId}`)
              }
            >
              + Modify Search
            </Button>
          </Col>
        </Row>
      </div>

      <div className="psr-filter-bar d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <IconifyIcon icon="mdi:filter-variant" className="fs-18 text-muted" />
          <Form.Select size="sm" className="psr-filter-select">
            <option>Price Per Head</option>
          </Form.Select>
          <Form.Select size="sm" className="psr-filter-select">
            <option>Duration</option>
          </Form.Select>
          <Form.Select size="sm" className="psr-filter-select">
            <option>Category</option>
          </Form.Select>
          <Form.Select size="sm" className="psr-filter-select">
            <option>Package Type</option>
          </Form.Select>
          <Button variant="light" className="psr-go-btn">
            Go
          </Button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: "12px", fontWeight: 600 }}>Sort By:</span>
          <button
            type="button"
            className={`psr-sort-btn ${sortBy === "price" ? "active" : ""}`}
            onClick={() => setSortBy("price")}
          >
            Price ↓
          </button>
          <button
            type="button"
            className={`psr-sort-btn ${sortBy === "duration" ? "active" : ""}`}
            onClick={() => setSortBy("duration")}
          >
            Duration ↑
          </button>
        </div>
      </div>

      <Row className="g-3">
        <Col lg={9}>
          <div className="psr-results-area">
            <div
              className="border-bottom mb-3 pb-2"
              style={{ minHeight: "24px" }}
            />
          </div>
        </Col>
        <Col lg={3}>
          <button
            type="button"
            className="psr-action-btn"
            onClick={() =>
              router.push(
                `/crm/queries/view-queries/${queryId}/create-custom-proposal`
              )
            }
          >
            Create Custom Proposal
          </button>
          <button
            type="button"
            className="psr-action-btn"
            onClick={() =>
              router.push(
                `/crm/queries/view-queries/${queryId}/quick-package-listing`
              )
            }
          >
            Search Custom Proposal
          </button>
          <button
            type="button"
            className="psr-action-btn"
            onClick={() =>
              router.push(
                `/crm/queries/view-queries/${queryId}/enquiry-supplier-package`
              )
            }
          >
            Contact Suppliers
          </button>
          <button type="button" className="psr-action-btn">
            Request Proposal
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default PackageSearchResult;
