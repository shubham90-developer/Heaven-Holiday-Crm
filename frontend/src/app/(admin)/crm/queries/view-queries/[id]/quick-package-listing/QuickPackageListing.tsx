"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Col, Form, Row } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useGetQueryByIdQuery } from "@/store/services/queriesApi";
import "./quick-package-listing.scss";

type PackageRow = {
  id: number;
  destinations: string;
  queryType: string;
  economyMask: string;
  adults: number;
  kids: number;
  days: number;
  travelDate: string;
  creationDate: string;
  customerName: string;
  createdBy: string;
};

const MOCK_PACKAGES: PackageRow[] = [
  {
    id: 1,
    destinations: "GoaGoa",
    queryType: "Normal",
    economyMask: "Quick Package",
    adults: 72,
    kids: 0,
    days: 3,
    travelDate: "06-Feb-26",
    creationDate: "14-Jan-26",
    customerName: "ANIL DESHMUKHE",
    createdBy: "RAJENDRA BUGADE",
  },
  {
    id: 2,
    destinations: "Goa",
    queryType: "Normal",
    economyMask: "Quick Package",
    adults: 72,
    kids: 0,
    days: 3,
    travelDate: "06-Feb-26",
    creationDate: "14-Jan-26",
    customerName: "ANIL DESHMUKHE",
    createdBy: "RAJENDRA BUGADE",
  },
];

const QuickPackageListing = () => {
  const router = useRouter();
  const params = useParams();
  const queryId = params?.id as string;

  const { data: queryResponse, isLoading, isError } = useGetQueryByIdQuery(
    queryId,
    { skip: !queryId }
  );

  const query = queryResponse?.data;
  const lead = query?.leadId || {};
  const firstQuery = query?.queries?.[0] || {};
  const packageDetails = firstQuery?.packageDetails || {};

  const defaultDestination = packageDetails.goingTo || "Goa";
  const defaultCustomer = [lead?.firstName, lead?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [results, setResults] = useState<PackageRow[]>(MOCK_PACKAGES);

  useEffect(() => {
    setDestination(defaultDestination);
    if (defaultCustomer) setCustomer(defaultCustomer);
  }, [defaultDestination, defaultCustomer]);

  const handleReset = () => {
    setDestination(defaultDestination);
    setTravelDate("");
    setCreationDate("");
    setCustomer(defaultCustomer);
    setResults(MOCK_PACKAGES);
  };

  const handleSearch = () => {
    const filtered = MOCK_PACKAGES.filter((row) => {
      const matchDestination =
        !destination ||
        row.destinations.toLowerCase().includes(destination.toLowerCase());
      const matchCustomer =
        !customer ||
        row.customerName.toLowerCase().includes(customer.toLowerCase());
      return matchDestination && matchCustomer;
    });
    setResults(filtered);
  };

  const tableRows = useMemo(() => results, [results]);

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (isError || !query) {
    return (
      <div className="p-4 text-danger text-center">
        Failed to load query details.
      </div>
    );
  }

  return (
    <div className="quick-package-listing">
      <nav className="qpl-breadcrumb d-flex align-items-center flex-wrap gap-1">
        <Link href="/dashboard">
          <IconifyIcon icon="mdi:home" className="fs-16" />
        </Link>
        <span>/</span>
        <span>Packages</span>
        <span>/</span>
        <span>Quick Package Listing</span>
      </nav>

      <div className="qpl-filter-card">
        <div className="qpl-filter-header">
          <IconifyIcon icon="mdi:filter-variant" className="fs-18" />
          Filter Results
        </div>
        <div className="qpl-filter-body">
          <Row className="g-3 mb-3">
            <Col md={3}>
              <div className="qpl-field-group">
                <label className="qpl-field-label">By Destination</label>
                <Form.Control
                  className="qpl-field-input"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </Col>
            <Col md={3}>
              <div className="qpl-field-group">
                <label className="qpl-field-label">By Travel Date</label>
                <Form.Control
                  type="date"
                  className="qpl-field-input"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>
            </Col>
            <Col md={3}>
              <div className="qpl-field-group">
                <label className="qpl-field-label">By Creation Date</label>
                <Form.Control
                  type="date"
                  className="qpl-field-input"
                  value={creationDate}
                  onChange={(e) => setCreationDate(e.target.value)}
                />
              </div>
            </Col>
            <Col md={3}>
              <div className="qpl-field-group">
                <label className="qpl-field-label">By Customer</label>
                <Form.Control
                  className="qpl-field-input"
                  placeholder="By Customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </div>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="qpl-reset-btn" onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="qpl-search-btn" onClick={handleSearch}>
              <IconifyIcon icon="mdi:magnify" />
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="qpl-table-card">
        <div className="qpl-top-actions">
          <button type="button" className="qpl-outline-btn">
            Search Pro Package
          </button>
          <button
            type="button"
            className="qpl-outline-btn"
            onClick={() =>
              router.push(
                `/crm/queries/view-queries/${queryId}/create-custom-proposal`
              )
            }
          >
            Build Custom Package
          </button>
        </div>

        <div className="table-responsive">
          <table className="qpl-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Destinations</th>
                <th>Query Type</th>
                <th>Economy Mask</th>
                <th>No of Adults</th>
                <th>No. of Kids</th>
                <th>No of Days</th>
                <th>Travel Date</th>
                <th>Creation Date</th>
                <th>Customer Name</th>
                <th>Created by</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-4 text-muted">
                    No packages found.
                  </td>
                </tr>
              ) : (
                tableRows.map((row, index) => (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{row.destinations}</td>
                    <td>{row.queryType}</td>
                    <td>{row.economyMask}</td>
                    <td>{row.adults}</td>
                    <td>{row.kids}</td>
                    <td>{row.days}</td>
                    <td>{row.travelDate}</td>
                    <td>{row.creationDate}</td>
                    <td>{row.customerName}</td>
                    <td>{row.createdBy}</td>
                    <td>
                      <button
                        type="button"
                        className="qpl-view-btn"
                        aria-label="View package"
                      >
                        <IconifyIcon icon="mdi:eye-outline" className="fs-18" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="qpl-pagination">
          <button type="button" className="qpl-page-btn">
            1
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickPackageListing;
