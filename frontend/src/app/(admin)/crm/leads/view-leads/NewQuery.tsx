"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Button, Modal, Card, Form, Row, Col, CardHeader, NavItem, CardBody } from "react-bootstrap";
import TravelersField from "./TravelersField";
import Sightseeing from "./Sightseeing";
import Miscellaneous from "./Miscellaneous";
import Hotel from "./Hotel";
import { useCreateQueryMutation } from "@/store/services/queriesApi";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import InclusionMultiSelect from "./components/InclusionMultiSelect";
import ThemeMultiSelect from "./components/ThemeMultiSelect";
import FoodPreferenceMultiSelect from "./components/FoodPreferenceMultiSelect";
import LeadSourceSelect from "./components/LeadSourceSelect";
import { defaultPaxDetails } from "../../utils/paxDetails";

type RequirementType =
  | "Package"
  | "Flight"
  | "Transfer"
  | "Visa"
  | "Hotel"
  | "Sightseeing"
  | "Miscellaneous";

export type FormDataType = {
  packageDetails: any;
  flightDetails: any;
  transferDetails: any;
  visaDetails: any;
  hotelDetails: any;
  sightseeingDetails: any;
  miscellaneousDetails: any;
};

const requirementMap: Record<RequirementType, keyof FormDataType> = {
  Package: "packageDetails",
  Flight: "flightDetails",
  Transfer: "transferDetails",
  Visa: "visaDetails",
  Hotel: "hotelDetails",
  Sightseeing: "sightseeingDetails",
  Miscellaneous: "miscellaneousDetails",
};

const NewQuery = () => {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("id");
  const [open, setOpen] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [showFlightActions, setShowFlightActions] = useState(false);
  const [transferType, settransferType] = useState("Cab")
  const [createQuery, { isLoading }] = useCreateQueryMutation();
  const [requirementType, setRequirementType] = useState<RequirementType>("Package");
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    packageDetails: {
      goingTo: "",
      goingFrom: "",
      specificDate: "",
      travelers: 2,
      paxDetails: defaultPaxDetails(),
      noOfDays: "",
      priceRange: "",
      inclusions: [] as string[],
      theme: [] as string[],
      hotelPreference: [] as number[],
      foodPreference: [] as string[],
      leadSource: "",
      remark: "",
      assignToSales: "",
      queryType: "",
      assignToOps: false,
      opsPerson: "",
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
      travelers: 2,
      paxDetails: defaultPaxDetails(),
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
      foodPreference: [] as string[],
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

  const buildPayload = () => {
    const key = requirementMap[requirementType];

    return {
      requirementType,
      [key]: formData[key],
    };
  };

  const handleSubmit = async () => {

    console.log("LEAD ID:", leadId); // ADD THIS

    if (!leadId) {
      toast.error("❌ Lead ID is missing");
      return;
    }

    try {
      const payload = buildPayload();

      await createQuery({
        leadId,
        data: payload,
      }).unwrap();

      toast.success("Query Created Successfully");

      if (requirementType === "Flight") {
        setShowFlightActions(true);
      }

      // ✅ correct reset
      setFormData({
        packageDetails: {
          goingTo: "",
          goingFrom: "",
          specificDate: "",
          travelers: 2,
          paxDetails: defaultPaxDetails(),
          noOfDays: "",
          priceRange: "",
          inclusions: [],
          theme: [],
          hotelPreference: [],
          foodPreference: [],
          leadSource: "",
          remark: "",
          assignToSales: "",
          queryType: "",
          assignToOps: false,
          opsPerson: "",
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
          travelers: 2,
          paxDetails: defaultPaxDetails(),
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
          foodPreference: [],
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

      // setRequirementType("Package");

    } catch (err) {
      console.error(err);
      toast.error("Failed to create query");
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="bg-dark p-2">
            <h6 className="text-white mb-0">New Query</h6>
          </div>
          <Form.Group className="mb-2">
            <Form.Label
              style={{ fontSize: "12px" }}>Requirement Type</Form.Label>
            <div className="d-flex gap-2 mb-0"
              style={{ fontSize: "12px" }}>
              {Object.keys(requirementMap).map((item) => (
                <Form.Check
                  key={item}
                  type="radio"
                  label={item}
                  value={item}
                  checked={requirementType === item}
                  onChange={(e) =>
                    setRequirementType(e.target.value as RequirementType)
                  }
                />
              ))}
            </div>
          </Form.Group>
        </CardHeader>

        <CardBody className="border">
          <h6 style={{ fontSize: "12px" }}>Lead Info:</h6>
          <div className="d-flex justify-content-between border p-1">
            <div ><strong>Going From :</strong></div>
            <div><strong>Going To :</strong></div>
            <div><strong>PAX:</strong></div>
            <div><strong>Travel Date:</strong><strong></strong></div>
          </div>
          {requirementType === "Package" && (
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
                      value="FIT"
                      checked={formData.packageDetails.queryType === "FIT"}
                      onChange={(e) =>
                        handleChange("packageDetails", "queryType", e.target.value)
                      }
                      className="me-2"
                      style={{ fontSize: "12px" }}
                    />

                    <Form.Check
                      type="radio"
                      label="GIT Group"
                      name="type"
                      value="GIT"
                      checked={formData.packageDetails.queryType === "GIT"}
                      onChange={(e) =>
                        handleChange("packageDetails", "queryType", e.target.value)
                      }
                      style={{ fontSize: "12px" }}
                    />
                  </div></Col>

                <Col md={3}>
                  <Form.Label
                    style={{ fontSize: "10px" }}
                    className="text-primary"
                  >
                    Going To
                  </Form.Label>
                  <Form.Control size="sm" style={{ fontSize: "12px" }}
                    value={formData.packageDetails.goingTo}
                    onChange={(e) =>
                      handleChange("packageDetails", "goingTo", e.target.value)
                    } />
                </Col>

                <Col md={3}>
                  <Form.Label
                    style={{ fontSize: "10px" }}
                    className="text-primary"
                  >
                    Going From
                  </Form.Label>
                  <Form.Control size="sm" style={{ fontSize: "12px" }}
                    value={formData.packageDetails.goingFrom}
                    onChange={(e) =>
                      handleChange("packageDetails", "goingFrom", e.target.value)
                    } />
                </Col>
                <Col md={3}>
                  <Form.Label
                    style={{ fontSize: "10px" }}
                    className="text-primary"
                  >
                    Specific Date
                  </Form.Label>
                  <Form.Control type="date" size="sm" style={{ fontSize: "12px" }}
                    value={formData.packageDetails.specificDate}
                    onChange={(e) =>
                      handleChange("packageDetails", "specificDate", e.target.value)
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
                  <Form.Control size="sm" style={{ fontSize: "12px" }}
                    value={formData.packageDetails.noOfDays}
                    onChange={(e) =>
                      handleChange("packageDetails", "noOfDays", e.target.value)
                    } />
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
                  <Form.Control size="sm" style={{ fontSize: "12px" }}
                    value={formData.packageDetails.priceRange}
                    onChange={(e) =>
                      handleChange("packageDetails", "priceRange", e.target.value)
                    } />
                </Col>

                <Col md={3}>
                  <InclusionMultiSelect
                    value={
                      Array.isArray(formData.packageDetails.inclusions)
                        ? formData.packageDetails.inclusions
                        : formData.packageDetails.inclusions
                          ? [formData.packageDetails.inclusions]
                          : []
                    }
                    onChange={(selected) =>
                      handleChange("packageDetails", "inclusions", selected)
                    }
                  />
                </Col>
                <Col md={3}>
                  <ThemeMultiSelect
                    value={
                      Array.isArray(formData.packageDetails.theme)
                        ? formData.packageDetails.theme
                        : formData.packageDetails.theme
                          ? [formData.packageDetails.theme]
                          : []
                    }
                    onChange={(selected) =>
                      handleChange("packageDetails", "theme", selected)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Label
                    style={{ fontSize: "10px" }}
                    className="text-primary"
                  >
                    Hotel Preference
                  </Form.Label>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Form.Check
                        key={num}
                        type="checkbox"
                        label={num}
                        checked={
                          Array.isArray(formData.packageDetails.hotelPreference)
                            ? formData.packageDetails.hotelPreference.includes(num)
                            : formData.packageDetails.hotelPreference === num
                        }
                        onChange={(e) => {
                          const current = Array.isArray(
                            formData.packageDetails.hotelPreference
                          )
                            ? formData.packageDetails.hotelPreference
                            : formData.packageDetails.hotelPreference
                              ? [formData.packageDetails.hotelPreference]
                              : [];
                          const next = e.target.checked
                            ? [...current, num]
                            : current.filter((n: number) => n !== num);
                          handleChange("packageDetails", "hotelPreference", next);
                        }}
                      />
                    ))}
                  </div>
                </Col>
                <Col md={3}>
                  <FoodPreferenceMultiSelect
                    value={
                      Array.isArray(formData.packageDetails.foodPreference)
                        ? formData.packageDetails.foodPreference
                        : formData.packageDetails.foodPreference
                          ? [formData.packageDetails.foodPreference]
                          : []
                    }
                    onChange={(selected) =>
                      handleChange("packageDetails", "foodPreference", selected)
                    }
                  />
                </Col>
                <Col md={3}>
                  <LeadSourceSelect
                    value={formData.packageDetails.leadSource || ""}
                    onChange={(val) =>
                      handleChange("packageDetails", "leadSource", val)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Add Remarks
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    size="sm"
                    style={{ fontSize: "12px" }}
                    value={formData.packageDetails.remark || ""}
                    onChange={(e) =>
                      handleChange("packageDetails", "remark", e.target.value)
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Assign To Sales
                  </Form.Label>
                  <Form.Select
                    size="sm"
                    style={{ fontSize: "12px" }}
                    value={formData.packageDetails.assignToSales || ""}
                    onChange={(e) =>
                      handleChange("packageDetails", "assignToSales", e.target.value)
                    }
                  >
                    <option value="Self">Self</option>
                    <option value="Sales 1">Sales 1</option>
                    <option value="Sales 2">Sales 2</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }}
                    className="text-primary">Assign To Ops</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Check
                      type="checkbox"
                      style={{ fontSize: "12px" }}
                      checked={!!formData.packageDetails.assignToOps || showSelect}
                      onChange={(e) => {
                        setShowSelect(e.target.checked);
                        handleChange("packageDetails", "assignToOps", e.target.checked);
                      }}
                    />
                    {showSelect && (
                      <Form.Select
                        size="sm"
                        style={{ fontSize: "12px" }}
                        value={formData.packageDetails.opsPerson || ""}
                        onChange={(e) =>
                          handleChange("packageDetails", "opsPerson", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option>Ops 1</option>
                        <option>Ops 2</option>
                      </Form.Select>
                    )}
                  </div>
                </Col>



              </Row>
              <div className="text-end mt-3">
                <Button variant="danger" size="sm" style={{ fontSize: "12px" }} onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save & Continue"}
                </Button>
              </div>
            </Form>
          )}

          {requirementType === "Flight" && (
            <Form>
              <Row className="mb-2 mt-2">
                <Col md={6}>
                  <div className="d-flex gap-3 mb-3">
                    {["One Way", "Round Trip", "Multi City"].map((type) => (
                      <Form.Check
                        key={type}
                        type="radio"
                        label={type}
                        name="flightType"
                        value={type}
                        checked={formData.flightDetails.flightType === type}
                        onChange={(e) => handleChange("flightDetails", "flightType", e.target.value)}
                        style={{ fontSize: "12px" }}
                      />
                    ))}
                  </div>
                </Col>
                <Col md={6}>
                  <Form.Check type="checkbox" style={{ fontSize: "12px" }} label="Group" className="ms-auto"
                    checked={formData.flightDetails.isGroup}
                    onChange={(e) => handleChange("flightDetails", "isGroup", e.target.checked)} />
                </Col>
                {/* Source / Destination */}
                <Row className="mb-2">
                  <Col md={6}>
                    <Form.Label
                      style={{ fontSize: "10px" }}
                      className="text-primary"
                    >
                      Select Source City
                    </Form.Label>
                    <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.flightDetails.sourceCity}
                      onChange={(e) => handleChange("flightDetails", "sourceCity", e.target.value)} />

                  </Col>
                  <Col md={6}>
                    <Form.Label
                      style={{ fontSize: "10px" }}
                      className="text-primary"
                    >
                      Select Destination City
                    </Form.Label>
                    <Form.Control size="sm" style={{ fontSize: "12px" }} onChange={(e) =>
                      handleChange("flightDetails", "destinationCity", e.target.value)
                    } />

                  </Col>
                </Row>

                {/* Date + Pax */}
                <Row className="mb-2">
                  <Col md={6}>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Departure Date *
                    </Form.Label>
                    <Form.Control type="date" size="sm" value={formData.flightDetails.departureDate}
                      onChange={(e) => handleChange("flightDetails", "departureDate", e.target.value)}
                    />
                  </Col>

                  <Col md={2}>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      ADULTS (+12 YRS)
                    </Form.Label>
                    <Form.Select size="sm" value={formData.flightDetails.adults}
                      onChange={(e) => handleChange("flightDetails", "adults", +e.target.value)}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </Form.Select>
                  </Col>

                  <Col md={2}>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      CHILD (2-11 YRS)
                    </Form.Label>
                    <Form.Select size="sm" value={formData.flightDetails.children}
                      onChange={(e) => handleChange("flightDetails", "children", +e.target.value)}
                    >
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </Form.Select>
                  </Col>

                  <Col md={2}>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      INFANT (0-2 YRS)
                    </Form.Label>
                    <Form.Select size="sm" value={formData.flightDetails.infants}
                      onChange={(e) => handleChange("flightDetails", "infants", +e.target.value)}>
                      <option value="0">0</option>
                      <option value="1">1</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col md={6}>
                    {/* Fare Type */}
                    <div className="d-flex gap-3 mb-2">
                      {["Regular Fares", "Student Fares", "Senior Citizen Fares"].map((fare) => (
                        <Form.Check
                          key={fare}
                          type="radio"
                          label={fare}
                          name="fareType"
                          value={fare}
                          checked={formData.flightDetails.fareType === fare}
                          onChange={(e) => handleChange("flightDetails", "fareType", e.target.value)}
                          style={{ fontSize: "12px" }}
                        />
                      ))}

                      <Form.Check type="checkbox" style={{ fontSize: "12px" }} label="Direct Flight" checked={formData.flightDetails.directFlight}
                        onChange={(e) => handleChange("flightDetails", "directFlight", e.target.checked)} />
                    </div>
                  </Col>

                  <Col md={2}>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Class</Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.flightDetails.flightClass}
                      onChange={(e) => handleChange("flightDetails", "flightClass", e.target.value)}>
                      <option>Economy</option>
                      <option>Business</option>
                    </Form.Select>
                  </Col>

                  <Col md={2}>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Preferred Airline
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.flightDetails.preferredAirline}
                      onChange={(e) => handleChange("flightDetails", "preferredAirline", e.target.value)}>
                      <option>None selected</option>
                      <option>Indigo</option>
                      <option>Air India</option>
                    </Form.Select>
                  </Col>

                  <Col md={2}>
                    <LeadSourceSelect
                      value={formData.flightDetails.leadSource || ""}
                      onChange={(val) =>
                        handleChange("flightDetails", "leadSource", val)
                      }
                    />
                  </Col>

                </Row>
                {/* Assign + Remark */}
                <Row className="mb-2">
                  <Col md={3}>
                    <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                      Assign To Sales
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.flightDetails.assignToSales}
                      onChange={(e) => handleChange("flightDetails", "assignToSales", e.target.value)}>
                      <option>Self</option>
                    </Form.Select>
                  </Col>

                  <Col md={3}>
                    <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                      Assign To Ops
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Check
                        type="checkbox"
                        style={{ fontSize: "12px" }}
                        checked={formData.flightDetails.assignToOps}
                        onChange={(e) => {
                          handleChange("flightDetails", "assignToOps", e.target.checked);
                          setShowSelect(e.target.checked);
                        }}
                      />
                      {formData.flightDetails.assignToOps && (
                        <Form.Select
                          size="sm"
                          value={formData.flightDetails.opsPerson}
                          onChange={(e) => handleChange("flightDetails", "opsPerson", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option>Ops 1</option>
                          <option>Ops 2</option>
                        </Form.Select>
                      )}
                    </div>
                  </Col>

                  <Col md={4}>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Add Remark
                    </Form.Label>
                    <Form.Control as="textarea" rows={1} size="sm" value={formData.flightDetails.remark}
                      onChange={(e) => handleChange("flightDetails", "remark", e.target.value)} />
                  </Col>
                </Row>

                {/* Button */}
                <div className="text-end">
                  {!showFlightActions ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save & Continue"}
                    </Button>
                  ) : (
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          // Modify & Save logic
                        }}
                      >
                        Modify & Save
                      </Button>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          // Contact Suppliers logic
                        }}
                      >
                        Contact Suppliers
                      </Button>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          // Send Proposal logic
                        }}
                      >
                        Send Proposal
                      </Button>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          // Custom Proposal logic
                        }}
                      >
                        Custom Proposal
                      </Button>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          // Series Fare logic
                        }}
                      >
                        Series Fare
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        // on your "Share Flights" button:
                        onClick={() => {
                          const params = new URLSearchParams({
                            id: leadId ?? "",
                            from: formData.flightDetails.sourceCity,
                            to: formData.flightDetails.destinationCity,
                            date: formData.flightDetails.departureDate,
                            pax: `${formData.flightDetails.adults} Adult(s)`,
                          });
                          router.push(`/crm/leads/view-leads/share-flights?${params.toString()}`);
                        }}
                      >
                        Search Flights
                      </Button>
                    </div>
                  )}
                </div>
              </Row>
            </Form>
          )}

          {requirementType === "Transfer" && (
            <Form>
              <Row className="mb-2 mt-2">
                <Col md={6}>
                  <div className="d-flex gap-3 mb-3">
                    {["Cab", "Train"].map((item) => (
                      <Form.Check
                        key={item}
                        type="radio"
                        label={item}
                        value={item}
                        checked={formData.transferDetails.transferType === item}
                        onChange={(e) => handleChange("transferDetails", "transferType", e.target.value)}
                      />
                    ))}
                  </div>
                </Col>

                {formData.transferDetails.transferType === "Cab" && (
                  <div>
                    <Row>
                      <Col md={12}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Query Type
                        </Form.Label>
                        <div className="d-flex align-iems-center">
                          {["One Way", "Round Trip"].map((type) => (
                            <Form.Check
                              key={type}
                              type="radio"
                              label={type}
                              name="cabQueryType"
                              value={type}
                              checked={formData.transferDetails.queryType === type}
                              onChange={(e) => handleChange("transferDetails", "queryType", e.target.value)}
                              className="me-2"
                              style={{ fontSize: "12px" }}
                            />
                          ))}
                        </div></Col>

                      <Col md={3}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Going To
                        </Form.Label>
                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.goingTo}
                          onChange={(e) => handleChange("transferDetails", "goingTo", e.target.value)} />
                      </Col>

                      <Col md={3}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Going From
                        </Form.Label>
                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.goingFrom}
                          onChange={(e) => handleChange("transferDetails", "goingFrom", e.target.value)} />
                      </Col>
                      <Col md={3}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Pickup up & Date Time
                        </Form.Label>
                        <Form.Control type="date" size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.pickupDateTime}
                          onChange={(e) => handleChange("transferDetails", "pickupDateTime", e.target.value)} />
                      </Col>
                      <Col md={3}>

                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          No of Days
                        </Form.Label>
                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.noOfDays}
                          onChange={(e) => handleChange("transferDetails", "noOfDays", e.target.value)} />
                      </Col>
                      <TravelersField
                        section="transferDetails"
                        onChange={handleChange}
                        paxDetails={formData.transferDetails.paxDetails}
                        travelers={formData.transferDetails.travelers}
                      />



                      <Col md={3}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Pickup Location
                        </Form.Label>
                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.pickupLocation}
                          onChange={(e) => handleChange("transferDetails", "pickupLocation", e.target.value)} />
                      </Col>

                      <Col md={3}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Preference
                        </Form.Label>

                        <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.preference}
                          onChange={(e) => handleChange("transferDetails", "preference", e.target.value)}>
                          <option value="">Select</option>
                          <option>Luxary</option>
                          <option>Standard</option>
                          <option>SUV</option>


                        </Form.Select>
                      </Col>
                      <Col md={3}>
                        <LeadSourceSelect
                          value={formData.transferDetails.leadSource || ""}
                          onChange={(val) =>
                            handleChange("transferDetails", "leadSource", val)
                          }
                        />
                      </Col>

                      <Col md={3}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Add Remark
                        </Form.Label>
                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.remark}
                          onChange={(e) => handleChange("transferDetails", "remark", e.target.value)} />
                      </Col>


                      <Col md={3}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Assign to sales
                        </Form.Label>
                        <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.assignToSales}
                          onChange={(e) => handleChange("transferDetails", "assignToSales", e.target.value)}>
                          <option value="">Select</option>
                          <option>Self</option>
                          <option>Rajendra Bugade</option>
                          <option>Facebook</option>
                        </Form.Select>
                      </Col>
                      <Col md={3}>
                        <Form.Label style={{ fontSize: "10px" }}
                          className="text-primary">Assign To Ops</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Check
                            type="checkbox"
                            style={{ fontSize: "12px" }}
                            checked={formData.transferDetails.assignToOps}
                            onChange={(e) => handleChange("transferDetails", "assignToOps", e.target.checked)}
                          />
                          {formData.transferDetails.assignToOps && (
                            <Form.Select
                              size="sm" style={{ fontSize: "12px" }}
                              value={formData.transferDetails.opsPerson}
                              onChange={(e) => handleChange("transferDetails", "opsPerson", e.target.value)}
                            >
                              <option value="">Select</option>
                              <option>Ops 1</option>
                              <option>Ops 2</option>
                            </Form.Select>
                          )}
                        </div>
                      </Col>

                    </Row>
                    <div className="text-end mt-2">
                      <Button variant="danger" size="sm" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save & Continue"}
                      </Button>
                    </div>
                  </div>
                )}

                {formData.transferDetails.transferType === "Train" && (
                  <div>
                    <Row>
                      <Col md={12}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Query Type
                        </Form.Label>
                        <div className="d-flex align-iems-center">
                          {["One Way", "Round Trip"].map((type) => (
                            <Form.Check
                              key={type}
                              type="radio"
                              label={type}
                              name="trainQueryType"
                              value={type}
                              checked={formData.transferDetails.queryType === type}
                              onChange={(e) => handleChange("transferDetails", "queryType", e.target.value)}
                              className="me-2"
                              style={{ fontSize: "12px" }}
                            />
                          ))}
                        </div></Col>

                      <Col md={4}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          From
                        </Form.Label>
                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.from}
                          onChange={(e) => handleChange("transferDetails", "from", e.target.value)} />
                      </Col>

                      <Col md={4}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          To
                        </Form.Label>
                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.to}
                          onChange={(e) => handleChange("transferDetails", "to", e.target.value)} />
                      </Col>
                      <Col md={4}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Departure Date
                        </Form.Label>
                        <Form.Control type="date" size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.departureDate}
                          onChange={(e) => handleChange("transferDetails", "departureDate", e.target.value)} />
                      </Col>
                      <Col md={4}>

                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                          size="sm"
                        >
                          ADULTS (+12 YEARS)
                        </Form.Label>
                        <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.adults}
                          onChange={(e) => handleChange("transferDetails", "adults", +e.target.value)}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </Form.Select>
                      </Col>
                      <Col md={4}>

                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                          size="sm"
                        >
                          CHILD (2-11 YEARS)
                        </Form.Label>
                        <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.children}
                          onChange={(e) => handleChange("transferDetails", "children", +e.target.value)}>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="3">3</option>
                        </Form.Select>
                      </Col>

                      <Col md={4}>

                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                          size="sm"
                        >
                          INFANT (0-2 YEARS)
                        </Form.Label>
                        <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.infants}
                          onChange={(e) => handleChange("transferDetails", "infants", +e.target.value)}>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="3">3</option>
                        </Form.Select>
                      </Col>

                      <Col md={4}>

                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                          size="sm"
                        >
                          CLASSES
                        </Form.Label>
                        <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.trainClass}
                          onChange={(e) => handleChange("transferDetails", "trainClass", e.target.value)}>
                          <option value="AC First Class (1A)">AC First Class (1A)</option>
                          <option value="ALL CLASSES">ALL CLASSES</option>

                        </Form.Select>
                      </Col>

                      <Col md={4}>

                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                          size="sm"
                        >
                          Category
                        </Form.Label>
                        <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.category}
                          onChange={(e) => handleChange("transferDetails", "category", e.target.value)}>
                          <option value="General">General</option>
                          <option value="Tatkal">Tatkal</option>

                        </Form.Select>
                      </Col>

                      <Col md={4}>
                        <Form.Label
                          style={{ fontSize: "10px" }}
                          className="text-primary"
                        >
                          Assign to sales
                        </Form.Label>
                        <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.transferDetails.assignToSales}
                          onChange={(e) => handleChange("transferDetails", "assignToSales", e.target.value)}>
                          <option value="">Select</option>
                          <option value="Self">Self</option>
                          <option value="Rajendra Bugade">Rajendra Bugade</option>
                          <option value="Facebook">Facebook</option>
                        </Form.Select>
                      </Col>
                      <Col md={4}>
                        <Form.Label style={{ fontSize: "10px" }}
                          className="text-primary">Assign To Ops</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Check
                            type="checkbox"
                            style={{ fontSize: "12px" }}
                            checked={formData.transferDetails.assignToOps}
                            onChange={(e) => handleChange("transferDetails", "assignToOps", e.target.checked)}
                          />
                          {formData.transferDetails.assignToOps && (
                            <Form.Select
                              size="sm" style={{ fontSize: "12px" }}
                              value={formData.transferDetails.opsPerson}
                              onChange={(e) => handleChange("transferDetails", "opsPerson", e.target.value)}
                            >
                              <option value="">Select</option>
                              <option>Ops 1</option>
                              <option>Ops 2</option>
                            </Form.Select>
                          )}
                        </div>
                      </Col>



                    </Row>
                    <div className="text-end">
                      <Button variant="danger" size="sm" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save & Continue"}
                      </Button>
                    </div>
                  </div>
                )}
              </Row>
            </Form>
          )}

          {requirementType === "Visa" && (
            <Form>
              <Row className="mt-2">
                <Col md={3}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Country *</Form.Label>
                  <Form.Control
                    size="sm" style={{ fontSize: "12px" }}
                    value={formData.visaDetails.country}
                    onChange={(e) => handleChange("visaDetails", "country", e.target.value)}
                  />
                </Col>

                <Col md={3}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Visa Category *</Form.Label>
                  <Form.Select
                    size="sm" style={{ fontSize: "12px" }}
                    value={formData.visaDetails.visaCategory}
                    onChange={(e) => handleChange("visaDetails", "visaCategory", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option>Tourism</option>
                    <option>Business</option>
                    <option>Student</option>
                  </Form.Select>
                </Col>

                <Col md={3}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Entry Type</Form.Label>
                  <Form.Select
                    size="sm" style={{ fontSize: "12px" }}
                    value={formData.visaDetails.entryType}
                    onChange={(e) => handleChange("visaDetails", "entryType", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option>Single Entry</option>
                    <option>Multi Entry</option>
                    <option>Double Entry</option>
                  </Form.Select>
                </Col>

                <Col md={3}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Date of Travel *</Form.Label>
                  <Form.Control
                    type="date" size="sm" style={{ fontSize: "12px" }}
                    value={formData.visaDetails.dateOfTravel}
                    onChange={(e) => handleChange("visaDetails", "dateOfTravel", e.target.value)}
                  />
                </Col>

                <Col md={2}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Adult</Form.Label>
                  <Form.Control
                    size="sm" style={{ fontSize: "12px" }}
                    type="number"
                    value={formData.visaDetails.adults}
                    onChange={(e) => handleChange("visaDetails", "adults", +e.target.value)}
                  />
                </Col>

                <Col md={2}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Child</Form.Label>
                  <Form.Control
                    size="sm" style={{ fontSize: "12px" }}
                    type="number"
                    value={formData.visaDetails.children}
                    onChange={(e) => handleChange("visaDetails", "children", +e.target.value)}
                  />
                </Col>

                <Col md={2}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Child With Family</Form.Label>
                  <Form.Control
                    size="sm" style={{ fontSize: "12px" }}
                    type="number"
                    value={formData.visaDetails.childWithFamily}
                    onChange={(e) => handleChange("visaDetails", "childWithFamily", +e.target.value)}
                  />
                </Col>

                <Col md={2}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Infant</Form.Label>
                  <Form.Control
                    size="sm" style={{ fontSize: "12px" }}
                    type="number"
                    value={formData.visaDetails.infants}
                    onChange={(e) => handleChange("visaDetails", "infants", +e.target.value)}
                  />
                </Col>

                <Col md={2}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Duration</Form.Label>
                  <Form.Control
                    size="sm" style={{ fontSize: "12px" }}
                    value={formData.visaDetails.duration}
                    onChange={(e) => handleChange("visaDetails", "duration", e.target.value)}
                  />
                </Col>

                <Col md={2}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Nationality *</Form.Label>
                  <Form.Select
                    size="sm" style={{ fontSize: "12px" }}
                    value={formData.visaDetails.nationality}
                    onChange={(e) => handleChange("visaDetails", "nationality", e.target.value)}
                  >
                    <option>India</option>
                  </Form.Select>
                </Col>

                <Col md={3}>
                  <LeadSourceSelect
                    value={formData.visaDetails.leadSource || ""}
                    onChange={(val) =>
                      handleChange("visaDetails", "leadSource", val)
                    }
                  />
                </Col>

                <Col md={3}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Add Remark</Form.Label>
                  <Form.Control
                    as="textarea" rows={1} size="sm" style={{ fontSize: "12px" }}
                    value={formData.visaDetails.remark}
                    onChange={(e) => handleChange("visaDetails", "remark", e.target.value)}
                  />
                </Col>

                <Col md={3}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Assign To Sales</Form.Label>
                  <Form.Select
                    size="sm" style={{ fontSize: "12px" }}
                    value={formData.visaDetails.assignToSales}
                    onChange={(e) => handleChange("visaDetails", "assignToSales", e.target.value)}
                  >
                    <option value="">Self</option>
                  </Form.Select>
                </Col>

                <Col md={3}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Assign To Ops</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Check
                      type="checkbox"
                      checked={formData.visaDetails.assignToOps}
                      onChange={(e) => handleChange("visaDetails", "assignToOps", e.target.checked)}
                    />
                    {formData.visaDetails.assignToOps && (
                      <Form.Select
                        size="sm" style={{ fontSize: "12px" }}
                        value={formData.visaDetails.opsPerson}
                        onChange={(e) => handleChange("visaDetails", "opsPerson", e.target.value)}
                      >
                        <option value="">Select</option>
                        <option>Ops 1</option>
                        <option>Ops 2</option>
                      </Form.Select>
                    )}
                  </div>
                </Col>

                <div className="text-end mt-2">
                  <Button variant="danger" size="sm" style={{ fontSize: "12px" }} onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save & Continue"}
                  </Button>
                </div>
              </Row>
            </Form>
          )}

          {requirementType === "Hotel" && (<Hotel
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading} />)}

          {requirementType === "Sightseeing" && (<Sightseeing
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading} />)}

          {requirementType === "Miscellaneous" && (<Miscellaneous
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading} />)}
        </CardBody>
      </Card >
    </>
  );
};
export default NewQuery;