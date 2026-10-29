"use client";
import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Modal,
  Tab,
} from "react-bootstrap";
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  useCreateTransportRouteMutation
} from "../../../../../store/services/inventory/transport-route/transportRouteApi";
import toast from "react-hot-toast";

interface TransportFormData {
  category: string;
  transferTypes: string[];
  transportType: string;
  startCity: string;
  destinationCity: string;
  routeName: string;
  description: string;
  pickupPointArea: string;
  dropPointArea: string;
  regionType: string;
  state: string;
  country: string;
  vehicleCostType: string;
  currency: string;
  website: boolean;

  citiesIncluded: {
    city: string;
    noOfDays: string;
    destinationsCovered: string;
    sightseeingCovered: string;
  }[];

  seasons: {
    from: string;
    to: string;
    markUpType: string;
    b2c: number;
    b2b: number;
  }[];
}

const AddRoute = () => {
  const router = useRouter()
  const [transportcategory, setTransportCategory] = useState("Itinerary Transport")
  const [addcity, setAddCity] = useState(1)
  const [region, setRegion] = useState('State')
  const [addseason, setAddSeason] = useState(0)
  const [createTransportRoute] = useCreateTransportRouteMutation();
  const [formData, setFormData] = useState<TransportFormData>({
    category: "Itinerary Transport",
    transferTypes: [],
    transportType: "",
    startCity: "",
    destinationCity: "",
    routeName: "",
    description: "",
    pickupPointArea: "",
    dropPointArea: "",
    regionType: "State",
    state: "",
    country: "",
    vehicleCostType: "Normal",
    currency: "INR",
    website: false,

    citiesIncluded: [
      {
        city: "",
        noOfDays: "",
        destinationsCovered: "",
        sightseeingCovered: "",
      },
    ],

    seasons: [
      {
        from: "",
        to: "",
        markUpType: "Fixed %",
        b2c: 0,
        b2b: 0,
      },
    ],
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "category") {
      setTransportCategory(value);
    }

    if (name === "regionType") {
      setRegion(value);
    }
  };

  const handleTransferTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      transferTypes: prev.transferTypes.includes(value)
        ? prev.transferTypes.filter((item) => item !== value)
        : [...prev.transferTypes, value],
    }));
  };

  const handleCityChange = (index: number, field: string, value: string) => {
    const updated = [...formData.citiesIncluded];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      citiesIncluded: updated,
    }));
  };

  const handleSeasonChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updated = [...formData.seasons];
    updated[index] = {
      ...updated[index],
      [field]: field === "b2c" || field === "b2b" ? Number(value) : value,
    };

    setFormData((prev) => ({
      ...prev,
      seasons: updated,
    }));
  };

  const handleSave = async () => {
    try {
      await createTransportRoute(formData).unwrap();

      toast.success("Transport route created");
      router.push("/my-inventory/transport-rates");
    } catch (error: any) {
      console.log("API Error:", error);

      toast.error(
        error?.data?.message ||
        error?.data?.errors?.[0]?.message ||
        "Failed to create route"
      );
    }
  };

  return (
    <>
      <Card className="p-3">
        <div className='text-end'>
          <Button variant='primary' size='sm'
            onClick={() => router.push('/my-inventory/transport-rates')}
            style={{ fontSize: "10px" }} ><Icon icon="mdi:eye" className='me-1' />Transport Routes Listing</Button>
        </div>

        <hr />
        <Form>
          <Row className='g-2'>
            <Col md={12}>
              <div className='d-flex gap-2 align-items-center'>
                <Form.Label style={{ fontSize: "12px" }} className='text-primary'>Category</Form.Label>
                <Form.Check type='radio' name='category'
                  id='Itinerary Transport'
                  value="Itinerary Transport"
                  checked={formData.category === "Itinerary Transport"}
                  onChange={handleChange}
                  label='Itinerary Transport' style={{ fontSize: "12px" }} />
                <Form.Check type='radio' name='category'
                  checked={formData.category === "Point to Point Transfers"}
                  onChange={handleChange}
                  id='Point to Point Transfers' value="Point to Point Transfers" label='Point to Point Transfers' style={{ fontSize: "12px" }} />
                <Form.Check type='radio' name='category' value='SIC (Ferry Transfer)'
                  checked={formData.category === "SIC (Ferry Transfer)"}
                  onChange={handleChange}
                  id='SIC (Ferry Transfer)' label='SIC (Ferry Transfer)' style={{ fontSize: "12px" }} />
                <Form.Check type='radio' name='category' value='Per Day Cost'
                  checked={formData.category === "Per Day Cost"}
                  onChange={handleChange}
                  id='Per Day Cost' label='Per Day Cost' style={{ fontSize: "12px" }} />





              </div></Col>

            {transportcategory === "Point to Point Transfers" && (
              <Col md={12}>
                <div className='d-flex gap-2 mb-1'>
                  <Form.Check type='checkbox' name='way' id='Local/City / Tour Transfer' label='Local/City / Tour Transfer' style={{ fontSize: "12px" }} />
                  <Form.Check type='checkbox' name='way' id='Airport Transfer' label='Airport Transfer' style={{ fontSize: "12px" }}
                    checked={formData.transferTypes.includes("Airport Transfer")}
                    onChange={() => handleTransferTypeChange("Airport Transfer")} />
                  <Form.Check
                    type="checkbox"
                    label="Railway Station Transfer"
                    name="transportType"
                    id="railwayTransfer"
                    style={{ fontSize: "12px" }}
                    checked={formData.transferTypes.includes("Railway Station Transfer")}
                    onChange={() => handleTransferTypeChange("Railway Station Transfer")}
                  />

                  <Form.Check
                    type="checkbox"
                    label="Bus Stand Transfer"
                    name="transportType"
                    id="busStandTransfer"
                    style={{ fontSize: "12px" }}
                    checked={formData.transferTypes.includes("Bus Stand Transfer")}
                    onChange={() => handleTransferTypeChange("Bus Stand Transfer")}
                  />

                  <Form.Check
                    type="checkbox"
                    label="Port Transfer"
                    name="transportType"
                    id="portTransfer"
                    style={{ fontSize: "12px" }}
                    checked={formData.transferTypes.includes("Port Transfer")}
                    onChange={() => handleTransferTypeChange("Port Transfer")}
                  />

                  <Form.Check
                    type="checkbox"
                    label="Meal Transfer"
                    name="transportType"
                    id="mealTransfer"
                    style={{ fontSize: "12px" }}
                    checked={formData.transferTypes.includes("Meal Transfer")}
                    onChange={() => handleTransferTypeChange("Meal Transfer")}
                  />

                </div>
              </Col>
            )}
            {transportcategory !== 'Per Day Cost' && (
              <>
                <Col md={3}>
                  <Form.Label style={{ fontSize: "12px" }} className='text-primary'>Transport Type</Form.Label>
                  <div className='d-flex gap-2 align-items-center'>

                    <Form.Check type='radio' id='One Way' label='One Way' style={{ fontSize: "12px" }} name="transportType" value="One Way"
                      checked={formData.transportType === "One Way"}
                      onChange={handleChange} />
                    <Form.Check type='radio' id='Round Trip' label='Round Trip' style={{ fontSize: "12px" }} name="transportType"
                      value="Round Trip"
                      onChange={handleChange} />
                  </div>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label
                      style={{ fontSize: "12px" }}
                      className="text-primary"
                    >
                      Start City
                    </Form.Label>
                    <Form.Control size="sm" style={{ fontSize: "12px" }} name="startCity"
                      value={formData.startCity}
                      onChange={handleChange} />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label
                      style={{ fontSize: "12px" }}
                      className="text-primary"
                    >
                      Destination City
                    </Form.Label>
                    <Form.Control size="sm" style={{ fontSize: "12px" }} name="destinationCity"
                      value={formData.destinationCity}
                      onChange={handleChange} />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label
                      style={{ fontSize: "12px" }}
                      className="text-primary"
                    >
                      Route Name
                    </Form.Label>
                    <Form.Control size="sm" style={{ fontSize: "12px" }} name="routeName"
                      value={formData.routeName}
                      onChange={handleChange} />
                  </Form.Group>
                </Col>
              </>
            )}
            {transportcategory !== 'SIC (Ferry Transfer)' && transportcategory !== 'Per Day Cost' && (

              <>
                <Row className='mt-2'>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "12px" }}
                        className="text-primary"
                      >
                        Cities Included
                      </Form.Label>

                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "12px" }}
                        className="text-primary"
                      >
                        No of Days
                      </Form.Label>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "12px" }}
                        className="text-primary"
                      >
                        Destinations Covered
                      </Form.Label>

                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label
                        style={{ fontSize: "12px" }}
                        className="text-primary"
                      >
                        Sightseeing Covered
                      </Form.Label>

                    </Form.Group>
                  </Col>
                </Row>
                {[...Array(addcity)].map((_, index) => (
                  <Row key={index} className='g-1'>
                    <Col md={2}>
                      <Form.Group>

                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.citiesIncluded[index].city}
                          onChange={(e) =>
                            handleCityChange(index, "city", e.target.value)
                          } />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group>

                        <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.citiesIncluded[index].noOfDays}
                          onChange={(e) =>
                            handleCityChange(index, "noOfDays", e.target.value)
                          }>
                          <option>Select</option>
                          <option>1</option>
                          <option>2</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>

                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.citiesIncluded[index].destinationsCovered}
                          onChange={(e) =>
                            handleCityChange(index, "destinationsCovered", e.target.value)
                          } />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>

                        <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.citiesIncluded[index].sightseeingCovered}
                          onChange={(e) =>
                            handleCityChange(index, "sightseeingCovered", e.target.value)
                          } />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <div className='d-flex gap-2'>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setAddCity(addcity - 1)}
                          style={{ fontSize: "12px", fontWeight: "bold" }}
                        >
                          <Icon icon="mdi:minus" />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                ))}
                <div className='text-end'>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setAddCity(addcity + 1)}
                    style={{ fontSize: "10px" }}
                  >
                    Add City & Sightseeing
                  </Button>
                </div>
              </>
            )}
            <Col md={6}>
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >
                Description
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "12px" }} name="description"
                value={formData.description}
                onChange={handleChange} />
            </Col>
            {transportcategory !== 'Per Day Cost' && (
              <>
                <Col md={3}>
                  <Form.Label
                    className="text-primary"
                    style={{ fontSize: "12px" }}
                  >
                    Pick up Point Area
                  </Form.Label>
                  <Form.Control size="sm" style={{ fontSize: "12px" }} name="pickupPointArea"
                    value={formData.pickupPointArea}
                    onChange={handleChange} />
                </Col>

                <Col md={3}>
                  <Form.Label
                    className="text-primary"
                    style={{ fontSize: "12px" }}
                  >
                    Drop Point Area
                  </Form.Label>
                  <Form.Control size="sm" style={{ fontSize: "12px" }} name="dropPointArea"
                    value={formData.dropPointArea}
                    onChange={handleChange} />
                </Col>


                <Col md={12}>
                  <div className='d-flex flex-column gap-1' style={{ fontSize: "10px" }}>
                    <strong >For With Hotel BYO :</strong>
                    <strong>For Land Only BYO :</strong>
                  </div>
                </Col>

              </>
            )}


          </Row>


          {transportcategory === 'Per Day Cost' && (
            <>
              <Row className='mt-2 align-items-center'>
                <Col md={3}>
                  <div className='d-flex gap-2 align-items-center'>

                    <Form.Check type='radio' name="regionType"
                      value="State"
                      checked={formData.regionType === "State"}
                      onChange={handleChange}
                      id='State' label='State' style={{ fontSize: "12px" }} />
                    <Form.Check type='radio' name="regionType"
                      value="Country"
                      checked={formData.regionType === "Country"}
                      onChange={handleChange}
                      id='Country' label='Country' style={{ fontSize: "12px" }} />
                  </div>
                </Col>





                {region === 'State' ? (
                  <Col md={3}>
                    <Form.Label
                      className="text-primary"
                      style={{ fontSize: "12px" }}
                    >
                      State
                    </Form.Label>
                    <Form.Control size="sm" style={{ fontSize: "12px" }} name="state"
                      value={formData.state}
                      onChange={handleChange} />
                  </Col>)
                  : (
                    <Col md={3}>
                      <Form.Label
                        className="text-primary"
                        style={{ fontSize: "12px" }}
                      >
                        Country
                      </Form.Label>
                      <Form.Control size="sm" style={{ fontSize: "12px" }} name="country"
                        value={formData.country}
                        onChange={handleChange} />
                    </Col>)
                }
              </Row>
            </>
          )}
        </Form>

        <div className="p-3 border mt-4">

          {/* Vehicle Type */}
          <div className="mb-3 d-flex gap-2">
            <Form.Label
              className="text-primary"
              style={{ fontSize: "12px" }}
            >
              Vehicle Cost Type
            </Form.Label>
            <Form.Check
              inline
              type="radio"
              label="Normal"
              id="Normal"
              style={{ fontSize: "12px" }}
              name="vehicleCostType"
              value="Normal"
              onChange={handleChange}
            />
            <Form.Check
              inline
              type="radio"
              label="KM Based"
              id="KM Based"
              style={{ fontSize: "12px" }}
              name="vehicleCostType"
              value="KM Based"
              onChange={handleChange}
            />
          </div>

          {/* Table */}
          <div className='table-responsive'>
            <table className='table table-sm table-bordered'>
              <tbody>
                <tr style={{ fontSize: "12px" }} >
                  <td><strong>Add Season</strong></td>
                  <td>
                    Currency
                  </td>
                  <td colSpan={4}>
                    <Col md={3}>
                      <Form.Select size='sm' style={{ width: "150px", fontSize: "12px" }} name="currency"
                        value={formData.currency}
                        onChange={handleChange}>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </Form.Select></Col>
                  </td>
                </tr>

                <tr className='bg-light' style={{ fontSize: "12px" }}>
                  <th>From</th>
                  <th>To</th>
                  <th>Mark Up</th>
                  <th>B2C</th>
                  <th>B2B</th>
                  <th></th>
                </tr>

                <tr style={{ fontSize: "12px" }}>
                  <td><Form.Control type="date" size="sm" style={{ fontSize: "12px" }} /></td>
                  <td><Form.Control type="date" size="sm" style={{ fontSize: "12px" }} /></td>
                  <td>
                    <Form.Select size="sm" style={{ fontSize: "12px" }}>
                      <option>Fixed %</option>
                      <option>Fixed</option>
                    </Form.Select>
                  </td>
                  <td><Form.Control size="sm" style={{ fontSize: "12px" }} /></td>
                  <td><Form.Control size="sm" style={{ fontSize: "12px" }} /></td>

                </tr>

                {[...Array(addseason)].map((_, index) => (
                  <tr key={index} style={{ fontSize: "12px" }}>
                    <td><Form.Control type="date" size="sm" style={{ fontSize: "12px" }} value={formData.seasons[index].from}
                      onChange={(e) =>
                        handleSeasonChange(index, "from", e.target.value)
                      } /></td>
                    <td><Form.Control type="date" size="sm" style={{ fontSize: "12px" }} value={formData.seasons[index].to}
                      onChange={(e) =>
                        handleSeasonChange(index, "to", e.target.value)
                      } /></td>
                    <td>
                      <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.seasons[index].markUpType}
                        onChange={(e) =>
                          handleSeasonChange(index, "markUpType", e.target.value)
                        }>
                        <option>Fixed %</option>
                        <option>Fixed</option>
                      </Form.Select>
                    </td>
                    <td><Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.seasons[index].b2c}
                      onChange={(e) =>
                        handleSeasonChange(index, "b2c", e.target.value)
                      } /></td>
                    <td><Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.seasons[index].b2b}
                      onChange={(e) =>
                        handleSeasonChange(index, "b2b", e.target.value)
                      } /></td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        style={{ fontSize: "12px" }}
                      >
                        -
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <Button size="sm" variant='outline-primary'
              onClick={() => setAddSeason(addseason + 1)}
              style={{ fontSize: "12px" }} >
              Add More Season
            </Button>
            <Button size="sm" variant="success" style={{ fontSize: "12px" }}>
              Add Cost
            </Button>
          </div>

          <hr />

          <div className="d-flex align-items-center justify-content-end gap-3 py-2">
            <Form.Check label='Website' id='Website' style={{ fontSize: "12px" }} />
            <Button size="sm" variant='outline-danger'
              onClick={() => router.push('/my-inventory/transport-rates')}
              style={{ fontSize: "12px" }} >
              Cancel
            </Button>
            <Button size="sm" variant="danger" style={{ fontSize: "12px" }} onClick={handleSave}>
              Save Route
            </Button>
          </div>
        </div>
      </Card>



    </>
  )
}

export default AddRoute
