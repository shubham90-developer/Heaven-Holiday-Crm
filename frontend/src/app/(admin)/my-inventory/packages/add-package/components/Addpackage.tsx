"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Button, Form, Row, Col, Card, Table } from "react-bootstrap";
import { useCreatePackageMutation } from "../../../../../../store/services/inventory/package/packageApi";
import toast from "react-hot-toast";

const tabs: string[] = [
  "Create Package",
  "Itinerary",
  "Optional",
  "T & C",
  "Cost Sheet",
  "Manage Inventory",
  "Contributors History",
];

const Addpackage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [createPackage, { isLoading }] = useCreatePackageMutation();

  const [formData, setFormData] = useState({
    packageName: "",
    packageMode: "Readymade Package",
    packageType: "Domestic",
    startingFrom: "",
    endCity: "",
    destinationCovered: "",
    supplier: "",
    categories: [] as string[],
    theme: "",
    inclusives: "",
    specification: "",
    youtubeUrl: "",
    overview: "",
    createdBy: "YOUR_STAFF_ID",
  });

  const handleChange = (
    e: any
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await createPackage(formData).unwrap();
      console.log("Created:", res);

      toast.success("Package created successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.data?.message || "Failed to create package"
      );
    }
  };

  return (
    <div className="p-2">
      {/* Tabs */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            size="sm"
            variant={activeTab === index ? "primary" : "outline-primary"}
            onClick={() => setActiveTab(index)}
          >
            {index + 1} {tab}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="">
        {/* 1. CREATE PACKAGE */}
        {activeTab === 0 && <CreatePackage handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleCategoryChange={handleCategoryChange}
          formData={formData}
          isLoading={isLoading} />}

        {/* 2. ITINERARY */}
        {activeTab === 1 && <Itinerary />}

        {/* 3. OPTIONAL */}
        {activeTab === 2 && <Optional />}

        {/* 4. T&C */}
        {activeTab === 3 && <Terms />}

        {/* 5. COST SHEET */}
        {activeTab === 4 && <CostSheet />}

        {/* 6. INVENTORY */}
        {activeTab === 5 && <Inventory />}

        {/* 7. HISTORY */}
        {activeTab === 6 && <History />}
      </div>
    </div>
  );
};

export default Addpackage;

// ================= COMPONENTS =================

type CreatePackageProps = {
  handleSubmit: (e: any) => void;
  handleChange: (e: any) => void;
  handleCategoryChange: (category: string) => void;
  formData: any;
  isLoading: boolean;
};

// ✅ CREATE PACKAGE
const CreatePackage: React.FC<CreatePackageProps> = ({
  handleSubmit,
  handleChange,
  handleCategoryChange,
  formData,
  isLoading,
}) => {
  return (
    <>
      <Card className="p-3">
        <Form onSubmit={handleSubmit}>
          {/* Package Options */}
          <div className="d-flex align-items-center flex-wrap gap-3 mb-3">
            {[
              "Readymade Package",
              "Fixed Departure",
              "Bus Route Package",
              "Common Flight",
              "Cruise",
              "Event",
            ].map((mode) => (
              <Form.Check
                key={mode}
                type="radio"
                name="packageMode"
                label={mode}
                value={mode}
                checked={formData.packageMode === mode}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* Package Type */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="text-dark small fw-medium">Package Type</span>

            <Form.Check
              type="radio"
              name="packageType"
              label="Domestic"
              value="Domestic"
              checked={formData.packageType === "Domestic"}
              onChange={handleChange}
            />
            <Form.Check type="radio" name="packageType" label="Inbound" value="Inbound"
              checked={formData.packageType === "Inbound"}
              onChange={handleChange} />
            <Form.Check type="radio" name="packageType" label="International" value="International"
              checked={formData.packageType === "International"}
              onChange={handleChange} />
          </div>
          <Row className="g-3">
            {/* Row 1 */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary small">
                  Package Name
                </Form.Label>
                <Form.Control size="sm" placeholder="Enter package name" name="packageName"
                  value={formData.packageName}
                  onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary small">
                  Starting From
                </Form.Label>
                <Form.Control size="sm" placeholder="City" name="startingFrom"
                  value={formData.startingFrom}
                  onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-primary small">End City</Form.Label>
                <Form.Control size="sm" name="endCity" placeholder="City"
                  value={formData.endCity}
                  onChange={handleChange} />
              </Form.Group>
            </Col>

            {/* Row 2 */}

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small">
                  Destination Covered ?
                </Form.Label>
                <Form.Control size="sm" name="destinationCovered" placeholder="Destination"
                  value={formData.destinationCovered}
                  onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small">Supplier</Form.Label>
                <Form.Control size="sm" name="supplier" placeholder="Supplier name"
                  value={formData.supplier}
                  onChange={handleChange} />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small">
                  Package Category
                </Form.Label>
                <div className="d-flex flex-wrap gap-3 pt-1">
                  {["Budget", "Standard", "Deluxe", "Luxury", "Premium"].map(
                    (cat) => (
                      <Form.Check
                        key={cat}
                        type="checkbox"
                        label={cat}
                        checked={formData.categories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                    )
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small">
                  Package Theme
                </Form.Label>
                <Form.Select size="sm" name="theme"
                  value={formData.theme}
                  onChange={handleChange}>
                  <option value="">Select Package Theme</option>
                  <option value="Honeymoon">Honeymoon</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Beach">Beach</option>
                  <option value="Family">Family</option>
                  <option value="Sports">Sports</option>
                  <option value="Cruise">Cruise</option>
                  <option value="Religions">Religions</option>
                  <option value="Hill Station">Hill Station</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Culture">Culture</option>
                  <option value="Weekend">Weekend</option>
                  <option value="New Year">New Year</option>
                  <option value="Festivals & Events">Festivals & Events</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Shopping & Nightlife">Shopping & Nightlife</option>
                  <option value="Offbeat">Offbeat</option>
                  <option value="Offbeat">Offbeat</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small">
                  Package Inclusive
                </Form.Label>
                <Form.Select size="sm" name="inclusives" value={formData.inclusives}
                  onChange={handleChange}>
                  <option value="">Select Inclusives</option>
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Visa">Visa</option>
                  <option value="Guide">Guide</option>
                  <option value="Meals">Meals</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-primary small">
                  Package Specification
                </Form.Label>
                <Form.Select size="sm" name="specification" value={formData.specification}
                  onChange={handleChange}>
                  <option value="">Select specifications</option>
                  <option value="Daily Itinerary Based">Daily Itinerary Based</option>
                  <option value="Only Hotel">Only Hotel</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary small">
                  Upload Image (Recommend size W:800px & H:600px)
                </Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="Supplier name"
                  type="file"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-primary small">
                  Youtube Url
                </Form.Label>
                <Form.Control
                  size="sm"
                  placeholder="  Youtube Url"
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Row 3 */}
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-primary small">Overview</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Write overview..."
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Buttons */}
          <div className="d-flex justify-content-end mt-4">
            <Button size="sm" variant="outline-danger" className="me-2 px-3">
              Cancel
            </Button>
            <Button size="sm" variant="warning" className="px-3" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save & Next"}
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

// ✅ ITINERARY
const Itinerary: React.FC = () => {
  return (
    <div>
      <h6>Add Cities, Nights & Itinerary</h6>

      <Row className="g-2 mt-2">
        <Col md={6}>
          <Form.Control size="sm" placeholder="Add Hotel City" />
        </Col>

        <Col md={4}>
          <Form.Control size="sm" placeholder="No. of Nights" />
        </Col>

        <Col md={2}>
          <Button size="sm" variant="danger">
            + Add City
          </Button>
        </Col>
      </Row>

      <div className="mt-3">
        <div className="border p-2 mb-2">
          Day 1 - Update Itinerary & Accommodation
        </div>
        <div className="border p-2 mb-2">
          Day 2 - Update Itinerary & Accommodation
        </div>
      </div>
    </div>
  );
};

// ✅ OPTIONAL
const Optional: React.FC = () => {
  return (
    <div>
      <h6>Addon Items</h6>
      <div className="border p-2">No Records Found</div>

      <h6 className="mt-3">Visa</h6>
      <div className="border p-2">No Records Found</div>

      <div className="text-end mt-3">
        <Button size="sm" variant="outline-danger" className="me-2">
          View Listing
        </Button>
        <Button size="sm" variant="success">
          Save & Next
        </Button>
      </div>
    </div>
  );
};

// ✅ TERMS & CONDITIONS
const Terms: React.FC = () => {
  return (
    <Card className="p-3">
      {/* Package Type */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <span className="text-dark small fw-medium">T&C Type</span>

        <Form.Check
          type="radio"
          name="packageType"
          label="Domestic"
          defaultChecked
        />

        <Form.Check type="radio" name="packageType" label="International" />
      </div>
      <h6>Inclusions (International)</h6>
      <Form.Control as="textarea" rows={5} />

      <h6 className="mt-3">Exclusions (International)</h6>
      <Form.Control as="textarea" rows={5} />

      <h6 className="mt-3">Term & Conditions (International)</h6>
      <Form.Control as="textarea" rows={5} />

      <h6 className="mt-3">Cancellation Policy (International)</h6>
      <Form.Control as="textarea" rows={5} />

      <h6 className="mt-3">Travel Basics</h6>
      <Form.Control as="textarea" rows={5} />

      <h6 className="mt-3">Booking Terms</h6>
      <Form.Control as="textarea" rows={5} />

      <h6 className="mt-3">Why use Us</h6>
      <Form.Control as="textarea" rows={5} />

      <h6 className="mt-3">Refund Policy</h6>
      <Form.Control as="textarea" rows={5} />
    </Card>
  );
};

// ✅ COST SHEET
const CostSheet: React.FC = () => {
  return (
    <Card className="p-3">
      <div className="costsheet-wrapper">
        {/* HEADER */}
        <div className="section-header mb-2">Manage Rates/ Season</div>

        {/* ADD SEASON */}
        <div className="table-responsive">
          <Table bordered className="cost-table">
            <thead style={{ fontSize: "10px" }}>
              <tr>
                <th>Currency</th>
                <th>
                  <Form.Control
                    size="sm"
                    defaultValue="INR"
                    style={{ fontSize: "10px" }}
                  />
                </th>
                <th>
                  {" "}
                  <Form.Check
                    label="Add more than 12 pax wise"
                    style={{ fontSize: "10px" }}
                  />
                </th>
                <th>
                  {" "}
                  <Form.Check
                    label="Quote Price"
                    style={{ fontSize: "10px" }}
                  />
                </th>
              </tr>
            </thead>
          </Table>
        </div>

        {/* ADD SEASON */}
        <div className="table-responsive">
          <Table bordered className="cost-table">
            <thead style={{ fontSize: "10px" }}>
              <tr>
                <th>Date*</th>
                <th>Mark UP*</th>
                <th>B2C (INR)</th>
                <th>B2B (INR)</th>
                <th>Common Inventory</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "10px" }}>
              <tr>
                <td>
                  <Form.Control
                    size="sm"
                    defaultValue="INR"
                    type="date"
                    style={{ fontSize: "10px" }}
                  />
                </td>
                <td>
                  <Form.Select size="sm" style={{ fontSize: "10px" }}>
                    <option>Fixed %</option>
                    <option>Fixed Amount</option>
                  </Form.Select>
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    type="text"
                    style={{ fontSize: "10px" }}
                  />
                </td>

                <td>
                  <Form.Control
                    size="sm"
                    type="text"
                    style={{ fontSize: "10px" }}
                  />
                </td>
                <td>
                  <Form.Control
                    size="sm"
                    type="text"
                    style={{ fontSize: "10px" }}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={5}></td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      style={{ fontSize: "10px" }}
                    >
                      Add More Season
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      style={{ fontSize: "10px" }}
                    >
                      Add Cost
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* PRICE TABLE */}
        <div className="section-header">Details</div>
        <div className="table-responsive">
          <Table bordered className="cost-table">
            <thead style={{ fontSize: "10px" }}>
              <tr>
                <th>Validity</th>
                <th>Markup</th>
                <th>Cost 2 Pax</th>
                <th>Cost 4 Pax</th>
                <th>Cost 6 Pax</th>
                <th>Cost 8 Pax</th>
                <th>Cost 10 Pax</th>
                <th>Cost 12 Pax</th>
                <th>Single Occupancy</th>
                <th>Extra Adult</th>
                <th>Extra Child</th>
                <th>Extra Child (No Bed)</th>
                <th>Infant</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "10px" }}>
              <tr>
                <td>My Cost INR (12-26 Mar)</td>
                <td>-</td>
                <td>6297</td>
                <td>6297</td>
                <td>6297</td>
                <td>6297</td>
                <td>6297</td>
                <td>6297</td>
                <td>0</td>
                <td>6297</td>
                <td>6297</td>
                <td>5000</td>
                <td>2500</td>
                <td>✏️ 👁️</td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* SETTINGS + BOOKING RULES */}

        <Row className="g-1 p-1">
          {/* SETTINGS */}
          <Col md={6}>
            <Card className="p-3 border">
              <div className="section-subheader mb-2">Settings</div>

              <Form.Group className="mb-2" style={{ fontSize: "10px" }}>
                <Form.Label>Minimum Pax Allowed</Form.Label>
                <Form.Control size="sm" defaultValue="1" />
              </Form.Group>

              <Form.Group className="mb-2" style={{ fontSize: "10px" }}>
                <Form.Label>Package Valid Till</Form.Label>
                <Form.Control size="sm" type="date" />
              </Form.Group>

              <Row className="g-2 mb-2" style={{ fontSize: "10px" }}>
                <Col>
                  <Form.Label>Cutoff Days</Form.Label>
                  <Form.Control size="sm" />
                </Col>
                <Col>
                  <Form.Label>Cutoff Time</Form.Label>
                  <Form.Control size="sm" />
                </Col>
              </Row>

              <Form.Group className="mb-2" style={{ fontSize: "10px" }}>
                <Form.Label>Price Range</Form.Label>
                <Form.Control size="sm" />
              </Form.Group>

              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  label="Auto Proposal with Booking"
                  style={{ fontSize: "10px" }}
                />
                <Form.Check
                  type="radio"
                  label="Auto Proposal No Booking"
                  style={{ fontSize: "10px" }}
                />
                <Form.Check
                  type="radio"
                  label="Only Query"
                  style={{ fontSize: "10px" }}
                />
              </div>

              <div className="mt-2">
                <Form.Check label="FIT Rates" style={{ fontSize: "10px" }} />
                <Form.Check label="Room Sharing" style={{ fontSize: "10px" }} />
              </div>
            </Card>
          </Col>

          {/* BOOKING RULES */}
          <Col md={6}>
            <Card className="p-3 border">
              <div className="section-subheader mb-2">Booking Rules</div>

              <Form.Group className="mb-2" style={{ fontSize: "10px" }}>
                <Form.Label>Advance at time of confirmation</Form.Label>
                <Row className="g-2">
                  <Col>
                    <Form.Control
                      size="sm"
                      defaultValue="75"
                      style={{ fontSize: "10px" }}
                    />
                  </Col>
                  <Col>
                    <Form.Select size="sm" style={{ fontSize: "10px" }}>
                      <option>Fixed %</option>
                      <option>Amount</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-2" style={{ fontSize: "10px" }}>
                <Form.Label>Balance before (days)</Form.Label>
                <Form.Control size="sm" defaultValue="30" />
              </Form.Group>

              <div className="section-subheader mt-3">TCS</div>
              <Form.Check label="Enable TCS" style={{ fontSize: "10px" }} />

              <div className="mt-2">
                <Form.Check
                  type="radio"
                  label="Default"
                  name="tcs"
                  style={{ fontSize: "10px" }}
                />
                <Form.Check
                  type="radio"
                  label="GST"
                  name="tcs"
                  style={{ fontSize: "10px" }}
                />
                <Form.Check
                  type="radio"
                  label="No GST"
                  name="tcs"
                  style={{ fontSize: "10px" }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* INTERNAL REMARK */}
        <div className="section-subheader px-2">Internal Remark</div>
        <div className="p-2">
          <Form.Control as="textarea" rows={4} />
        </div>

        {/* DISPLAY URL */}
        <div className="p-2">
          <Form.Check label="Display On" />
          <Form.Control size="sm" className="mt-2" placeholder="https://..." />
        </div>

        {/* ACTIONS */}
        <div className="text-end p-2 border-top">
          <Button size="sm" variant="outline-primary" className="me-2">
            Manage Inventory
          </Button>
          <Button size="sm" variant="outline-secondary" className="me-2">
            View Package
          </Button>
          <Button size="sm" variant="outline-warning" className="me-2">
            Save As Draft
          </Button>
          <Button size="sm" variant="danger">
            Update
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ✅ INVENTORY
const Inventory: React.FC = () => {
  return (
    <Card className="p-3">
      <div className="inventory-wrapper">
        {/* Header */}
        <div className="section-title mb-2">Flight Inventory</div>

        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center top-bar px-2">
          <Table bordered className="inventory-table">
            <thead style={{ fontSize: "10px" }}>
              <tr>
                <th>
                  <span>Add Package Cost and Markup from Kolhapur</span>
                </th>
                <th>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="radio"
                      label="Same"
                      name="type"
                      defaultChecked
                    />
                    <Form.Check type="radio" label="Different" name="type" />
                  </div>
                </th>
              </tr>
            </thead>
          </Table>
        </div>

        {/* Price Detail */}
        <div className="section-header">Price Detail</div>
        <div className="table-responsive">
          <Table bordered className="inventory-table">
            <thead style={{ fontSize: "10px" }}>
              <tr>
                <th>Date</th>
                <th>Currency</th>
                <th>Adult Cost</th>
                <th>Infant Cost</th>
                <th>Markup</th>
                <th>B2C Adult</th>
                <th>B2C Infant</th>
                <th>B2B Adult</th>
                <th>B2B Infant</th>
                <th>Inventory</th>
                <th>Sold</th>
                <th>On Hold</th>
                <th>Availability</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "10px" }}>
              <tr>
                <td>27/03/2026</td>
                <td>INR</td>
                <td>0.00</td>
                <td>0.00</td>
                <td>Fixed Amount</td>
                <td>0.00</td>
                <td>0.00</td>
                <td>0.00</td>
                <td>0.00</td>
                <td>30</td>
                <td>0</td>
                <td>0</td>
                <td>30</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    style={{ fontSize: "10px" }}
                    title="Edit"
                  >
                    <Icon icon="mdi:pencil" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* Onward Flight */}
        <div className="section-header mb-2">Onward Flight</div>
        <Row className="g-2 align-items-end px-2">
          <Col>
            <Form.Control
              size="sm"
              placeholder="Air Lines"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="Flight Number"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="From Airport"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="From Terminal"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="To Airport"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="To Terminal"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="Departure Time"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="Arrival Time"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="Duration"
              style={{ fontSize: "10px" }}
            />
          </Col>

          <Col xs="auto">
            <Button
              variant="primary"
              size="sm"
              style={{ fontSize: "10px" }}
              title="add"
            >
              <Icon icon="mdi:plus-circle-outline" />
            </Button>
          </Col>
        </Row>

        {/* Inward Flight */}
        <div className="section-header mt-3 mb-2">Inward Flight</div>
        <Row className="g-2 align-items-end px-2">
          <Col>
            <Form.Control
              size="sm"
              placeholder="Air Lines"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="Flight Number"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="From Airport"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="From Terminal"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="To Airport"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="To Terminal"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="Departure Time"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="Arrival Time"
              style={{ fontSize: "10px" }}
            />
          </Col>
          <Col>
            <Form.Control
              size="sm"
              placeholder="Duration"
              style={{ fontSize: "10px" }}
            />
          </Col>

          <Col xs="auto">
            <Button
              variant="primary"
              size="sm"
              style={{ fontSize: "10px" }}
              title="add"
            >
              <Icon icon="mdi:plus-circle-outline" />
            </Button>
          </Col>
        </Row>

        {/* Submit */}
        <div className="text-end p-2">
          <Button size="sm" variant="success">
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ✅ HISTORY
const History: React.FC = () => {
  const data = [
    {
      date: "23-03-2026",
      screen: "Cost Sheet",
      details: "NA",
      agent: "RAJENDRA BUGADE",
    },
    {
      date: "20-03-2026",
      screen: "Cost Sheet",
      details: "NA",
      agent: "RAJENDRA BUGADE",
    },
    {
      date: "10-03-2026",
      screen: "Cost Sheet",
      details: "Publish Package",
      agent: "RAJENDRA BUGADE",
    },
    {
      date: "10-03-2026",
      screen: "Cost Sheet",
      details: "Booking Rules : Balance before",
      agent: "RAJENDRA BUGADE",
    },
    {
      date: "10-03-2026",
      screen: "Cost Sheet",
      details: "Booking Rules : Advance booking percent",
      agent: "RAJENDRA BUGADE",
    },
    {
      date: "10-03-2026",
      screen: "Cost Sheet",
      details: "Settings : Minimum pax allowed",
      agent: "RAJENDRA BUGADE",
    },
    {
      date: "10-03-2026",
      screen: "Cost Sheet",
      details: "Add rates",
      agent: "RAJENDRA BUGADE",
    },
  ];
  return (
    <>
      <Card className="p-3">
        <div className="history-wrapper">
          <div className="table-responsive">
            <Table bordered hover className="align-middle mb-0">
              <thead className="table-light" style={{ fontSize: "10px" }}>
                <tr>
                  <th style={{ width: "15%" }}>Date</th>
                  <th style={{ width: "20%" }}>Screen Name</th>
                  <th>Details</th>
                  <th style={{ width: "20%" }}>Agent Name</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "10px" }}>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.screen}</td>
                    <td>{item.details}</td>
                    <td className="fw-semibold text-uppercase">{item.agent}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Card>
    </>
  );
};
