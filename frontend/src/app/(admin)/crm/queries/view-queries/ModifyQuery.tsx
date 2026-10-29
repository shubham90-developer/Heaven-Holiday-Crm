"use client";

import { useEffect, useState } from "react";
import { Button, Card, Form, Row, Col, CardHeader, CardBody } from "react-bootstrap";
import TravelersField from "../../leads/view-leads/TravelersField";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  QUERY_PACKAGE_STORAGE_KEY,
  QueryPackagePrefill,
  buildPrefillFromQuery,
} from "@/app/(admin)/bookings/Packages/types/packageBooking";

export type FormDataType = {
  packageDetails: any;
  flightDetails: any;
  transferDetails: any;
  visaDetails: any;
  hotelDetails: any;
  sightseeingDetails: any;
  miscellaneousDetails: any;
};

const toDateInputValue = (value?: string | Date | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

type ModifyQueryProps = {
  query?: any;
};

const ModifyQuery = ({ query }: ModifyQueryProps) => {
  const router = useRouter();
  const params = useParams();
  const queryId = (params?.id as string) || query?._id;
  const [showSelect, setShowSelect] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    packageDetails: {
      goingTo: "",
      goingFrom: "",
      specificDate: "",
      travelers: 2,
      paxDetails: {},
      noOfDays: "",
      priceRange: "",
      inclusions: "",
      theme: "",
      hotelPreference: "",
      queryType: "",
      assignToOps: false,
      opsPerson: "",
      leadSource: "",
      remark: "",
    },
    flightDetails: {
      flightType: "",
      isGroup: false,
      sourceCity: "",
      destinationCity: "",
      departureDate: "",
      adults: 1,
      children: 0,
      infants: 0,
      fareType: "",
      directFlight: false,
      flightClass: "",
      preferredAirline: "",
      leadSource: "",
      assignToSales: "",
      assignToOps: false,
      opsPerson: "",
      remark: "",
    },
    transferDetails: {
      transferType: "Cab",
      queryType: "",
      goingTo: "",
      goingFrom: "",
      pickupDateTime: "",
      noOfDays: "",
      travelers: 1,
      pickupLocation: "",
      preference: "",
      from: "",
      to: "",
      departureDate: "",
      adults: 1,
      children: 0,
      infants: 0,
      trainClass: "",
      category: "",
      leadSource: "",
      remark: "",
      assignToSales: "",
      assignToOps: false,
      opsPerson: "",
    },
    visaDetails: {
      country: "",
      visaCategory: "",
      entryType: "",
      dateOfTravel: "",
      adults: 1,
      children: 0,
      childWithFamily: 0,
      infants: 0,
      duration: "",
      nationality: "India",
      leadSource: "",
      remark: "",
      assignToSales: "",
      assignToOps: false,
      opsPerson: "",
    },
    hotelDetails: {
      destination: "",
      checkIn: "",
      checkOut: "",
      nights: 1,
      nationality: "India",
      travelers: 1,
      starRating: "",
      foodPreference: "",
      leadSource: "",
      remark: "",
      assignToSales: "",
      assignToOps: false,
      opsPerson: "",
    },
    sightseeingDetails: {
      destination: "",
      duration: "",
      adults: 1,
      children: 0,
      nationality: "India",
      leadSource: "",
      remark: "",
      assignToSales: "",
      assignToOps: false,
      opsPerson: "",
    },
    miscellaneousDetails: {
      service: "",
      destination: "",
      date: "",
      count: 0,
      leadSource: "",
      remark: "",
      assignToSales: "",
      assignToOps: false,
      opsPerson: "",
    },
  });

  // Prefill from the open query document
  useEffect(() => {
    if (!query) return;

    const item = query?.queries?.[0];
    if (!item) return;

    const prefill = buildPrefillFromQuery(query);

    setFormData((prev) => ({
      ...prev,
      packageDetails: {
        ...prev.packageDetails,
        ...(item.packageDetails || {}),
        goingTo: prefill.goingTo || item.packageDetails?.goingTo || "",
        goingFrom: prefill.goingFrom || item.packageDetails?.goingFrom || "",
        specificDate:
          toDateInputValue(
            item.packageDetails?.specificDate || prefill.travelDate
          ) || "",
        travelers:
          prefill.travelers || item.packageDetails?.travelers || 2,
        paxDetails: item.packageDetails?.paxDetails || {},
        noOfDays: prefill.noOfDays || item.packageDetails?.noOfDays || "",
        leadSource: prefill.leadSource || "",
        remark: prefill.remark || "",
        priceRange: item.packageDetails?.priceRange || "",
        inclusions: item.packageDetails?.inclusions || "",
        theme: item.packageDetails?.theme || "",
        hotelPreference: item.packageDetails?.hotelPreference || "",
      },
      flightDetails: {
        ...prev.flightDetails,
        ...(item.flightDetails || {}),
      },
      transferDetails: {
        ...prev.transferDetails,
        ...(item.transferDetails || {}),
      },
      visaDetails: {
        ...prev.visaDetails,
        ...(item.visaDetails || {}),
      },
      hotelDetails: {
        ...prev.hotelDetails,
        ...(item.hotelDetails || {}),
      },
      sightseeingDetails: {
        ...prev.sightseeingDetails,
        ...(item.sightseeingDetails || {}),
      },
      miscellaneousDetails: {
        ...prev.miscellaneousDetails,
        ...(item.miscellaneousDetails || {}),
      },
    }));
  }, [query]);

  const handleChange = (
    section: keyof FormDataType,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleBuildProPackage = () => {
    if (!queryId) {
      toast.error("Query ID is missing");
      return;
    }

    const pkg = formData.packageDetails;
    const basePrefill = query
      ? buildPrefillFromQuery(query)
      : ({
          customerDetails: {
            customerType: "B2C" as const,
            firstName: "Guest",
          },
        } as QueryPackagePrefill);

    const prefill: QueryPackagePrefill = {
      ...basePrefill,
      queryId,
      goingTo: pkg.goingTo || basePrefill.goingTo || "",
      goingFrom: pkg.goingFrom || basePrefill.goingFrom || "",
      travelDate:
        toDateInputValue(pkg.specificDate) || basePrefill.travelDate || "",
      noOfDays: Number(pkg.noOfDays || basePrefill.noOfDays || 0),
      travelers: Number(pkg.travelers || basePrefill.travelers || 2),
      leadSource: pkg.leadSource || basePrefill.leadSource || "",
      remark: pkg.remark || basePrefill.remark || "",
      customerDetails: {
        ...basePrefill.customerDetails,
        leadSource: pkg.leadSource || basePrefill.customerDetails?.leadSource || "",
        remarks: pkg.remark || basePrefill.customerDetails?.remarks || "",
      },
    };

    sessionStorage.setItem(QUERY_PACKAGE_STORAGE_KEY, JSON.stringify(prefill));
    router.push(`/bookings/Packages/build-your-own?queryId=${queryId}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="bg-dark p-2">
            <h6 className="text-white mb-0">Search Results & Send Proposal</h6>
          </div>
        </CardHeader>

        <CardBody className="p-4">
          <Form>
            <Row className="mb-2">
              <Col md={12}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Query Type
                </Form.Label>
                <div className="d-flex align-iems-center">
                  <Form.Check
                    type="radio"
                    label="FIT (Normal)"
                    name="type"
                    className="me-2"
                    style={{ fontSize: "12px" }}
                    defaultChecked
                  />

                  <Form.Check
                    type="radio"
                    label="GIT Group"
                    name="type"
                    style={{ fontSize: "12px" }}
                  />
                </div>
              </Col>

              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Going To
                </Form.Label>
                <Form.Control
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={formData.packageDetails.goingTo}
                  onChange={(e) =>
                    handleChange("packageDetails", "goingTo", e.target.value)
                  }
                />
              </Col>

              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Going From
                </Form.Label>
                <Form.Control
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={formData.packageDetails.goingFrom}
                  onChange={(e) =>
                    handleChange("packageDetails", "goingFrom", e.target.value)
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Specific Date
                </Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={formData.packageDetails.specificDate}
                  onChange={(e) =>
                    handleChange(
                      "packageDetails",
                      "specificDate",
                      e.target.value
                    )
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  No of Days
                </Form.Label>
                <Form.Control
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={formData.packageDetails.noOfDays}
                  onChange={(e) =>
                    handleChange("packageDetails", "noOfDays", e.target.value)
                  }
                />
              </Col>
              <TravelersField
                section="packageDetails"
                onChange={handleChange}
                paxDetails={formData.packageDetails.paxDetails}
                travelers={formData.packageDetails.travelers}
              />

              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Price Range
                </Form.Label>
                <Form.Control
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={formData.packageDetails.priceRange}
                  onChange={(e) =>
                    handleChange("packageDetails", "priceRange", e.target.value)
                  }
                />
              </Col>

              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Inclusions
                </Form.Label>

                <Form.Select
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={formData.packageDetails.inclusions}
                  onChange={(e) =>
                    handleChange("packageDetails", "inclusions", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option>Hotel</option>
                  <option>Flight</option>
                  <option>Transfer</option>
                  <option>Sightseeing</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Theme
                </Form.Label>

                <Form.Select
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={formData.packageDetails.theme}
                  onChange={(e) =>
                    handleChange("packageDetails", "theme", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option>Adventure</option>
                  <option>Honeymoon</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Hotel Preference
                </Form.Label>
                <div className="d-flex align-items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Form.Check
                      key={star}
                      type="radio"
                      label={String(star)}
                      name="preference"
                      className="me-2"
                      style={{ fontSize: "12px" }}
                      checked={
                        String(formData.packageDetails.hotelPreference) ===
                        String(star)
                      }
                      onChange={() =>
                        handleChange(
                          "packageDetails",
                          "hotelPreference",
                          star
                        )
                      }
                    />
                  ))}
                </div>
              </Col>

              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Preference
                </Form.Label>

                <Form.Select size="sm" style={{ fontSize: "12px" }}>
                  <option value="">Select</option>
                  <option>Luxary</option>
                  <option>Standard</option>
                  <option>SUV</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Lead Source
                </Form.Label>

                <Form.Select
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={formData.packageDetails.leadSource}
                  onChange={(e) =>
                    handleChange("packageDetails", "leadSource", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option>Agency</option>
                  <option>Website</option>
                  <option>Facebook</option>
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Add Remark
                </Form.Label>
                <Form.Control
                  size="sm"
                  style={{ fontSize: "12px" }}
                  value={formData.packageDetails.remark}
                  onChange={(e) =>
                    handleChange("packageDetails", "remark", e.target.value)
                  }
                />
              </Col>

              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Assign to sales
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }}>
                  <option value="">Select</option>
                  <option>Self</option>
                  <option>Rajendra Bugade</option>
                  <option>Facebook</option>
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Label
                  style={{ fontSize: "10px" }}
                  className="text-primary"
                >
                  Assign To Ops
                </Form.Label>
                <div className="d-flex gap-2">
                  <Form.Check
                    type="checkbox"
                    style={{ fontSize: "12px" }}
                    onChange={(e) => setShowSelect(e.target.checked)}
                  />
                  {showSelect && (
                    <Form.Select size="sm" style={{ fontSize: "12px" }}>
                      <option value="">Select</option>
                      <option>Ops 1</option>
                      <option>Ops 2</option>
                    </Form.Select>
                  )}
                </div>
              </Col>
            </Row>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 px-3 py-3">
              <div className="d-flex align-items-center gap-3">
                <Form.Check
                  type="checkbox"
                  className="mb-0"
                  style={{ fontSize: "12px" }}
                  id="new-query"
                  label="Create New Query"
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="text-nowrap"
                  style={{ fontSize: "12px" }}
                >
                  Modify & Save
                </Button>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="text-nowrap"
                  onClick={() => {
                    if (!queryId) return;
                    router.push(
                      `/crm/queries/view-queries/${queryId}/enquiry-supplier-package`
                    );
                  }}
                >
                  Contact Suppliers
                </Button>

                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    if (!queryId) return;
                    router.push(
                      `/crm/queries/view-queries/${queryId}/create-custom-proposal`
                    );
                  }}
                >
                  Create Custom Proposal
                </Button>

                <Button
                  variant="outline-primary"
                  size="sm"
                  className="text-nowrap"
                  onClick={handleBuildProPackage}
                >
                  Build Pro Package
                </Button>

                <Button
                  variant="outline-primary"
                  size="sm"
                  className="text-nowrap"
                  onClick={() => {
                    if (!queryId) return;
                    router.push(
                      `/crm/queries/view-queries/${queryId}/quick-package-listing`
                    );
                  }}
                >
                  Search Custom Proposal
                </Button>

                {/* <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (!queryId) return;
                    router.push(
                      `/crm/queries/view-queries/${queryId}/package-search-result`
                    );
                  }}
                >
                  Search Master/Network
                </Button> */}
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};

export default ModifyQuery;
