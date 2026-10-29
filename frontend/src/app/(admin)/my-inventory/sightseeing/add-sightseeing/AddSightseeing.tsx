"use client";
import React from 'react'

import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Modal,
  Tabs,
  Tab,
  CardHeader,
  CardBody,
  CardFooter
} from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import AddDetailModal from './AddDetailModal';
import { useRouter } from 'next/navigation';
import { StdioNull } from 'child_process';
import {
  useCreateSightseeingMutation
} from "../../../../../store/services/inventory/sightseeing/sightSeeingApi";
import toast from "react-hot-toast";

const AddSightseeing = () => {
  const router = useRouter()
  const [adddetail, setshowAddDetail] = useState(false)
  const [detail, setDetail] = useState(true)
  const [addoperatingtime, setAddOperatingTime] = useState(0)
  const [otherdetail, setOtherDetail] = useState(false)

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [createSightseeing, { isLoading }] =
    useCreateSightseeingMutation();

  const [sections, setSections] = useState([
    { title: "Other Inclusions", open: false, value: "" },
    { title: "Advisory", open: false, value: "" },
    { title: "Cancellation Policy", open: false, value: "" },
    { title: "Refund Policy", open: false, value: "" },
    { title: "Confirmation policy", open: false, value: "" },
    { title: "Term & Condition's", open: false, value: "" },
  ]);

  const handleOperatingTimeChange = (
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    const updated = [...formData.operatingTime];
    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      operatingTime: updated,
    }));
  };

  const addOperatingSlot = () => {
    setFormData((prev) => ({
      ...prev,
      operatingTime: [
        ...prev.operatingTime,
        { from: "15:00", to: "17:00" },
      ],
    }));
  };

  const removeOperatingSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      operatingTime: prev.operatingTime.filter((_, i) => i !== index),
    }));
  };

  const [formData, setFormData] = useState({
    country: "",
    city: "",
    sightseeingName: "",
    latitude: "",
    longitude: "",
    image: "",
    address: "",
    isUnique: false,

    details: "",

    category: "",
    activities: "",
    difficultyLevel: "",
    season: "",
    daysOfWeek: "",
    popularity: "",
    thingsToCarry: "",
    pickupPoint: "",
    pickupTime: "",

    minPax: 1,
    maxPax: 10,

    durationDays: 0,
    durationMinutes: 0,

    minAge: 5,
    maxAge: 70,

    operatingTime: [
      {
        from: "15:00",
        to: "17:00",
      },
    ],

    otherInclusions: "",
    advisory: "",
    cancellationPolicy: "",
    refundPolicy: "",
    confirmationPolicy: "",
    termsConditions: "",
  });
  
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    try {
      await createSightseeing(formData).unwrap();

      toast.success("Sightseeing added successfully");

      router.push("/my-inventory/sightseeing");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add sightseeing");
    }
  };

  return (
    <>
      <Card className="p-3">
        {/* right side */}
        <div className="d-flex align-items-center border-bottom pb-2 mb-2 gap-2 justify-content-end">
          <Button
            variant="secondary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => router.push("/my-inventory/sightseeing")}
          >
            <Icon icon="mdi:eye" className='me-1' /> My Sightseeing
          </Button>

          <Button
            variant="outline-secondary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => router.push("/my-inventory/sightseeing/my-rates")}
          >
            <Icon icon="mdi:eye" className="me-1" /> My Rates
          </Button>

          <Button
            variant="outline-secondary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => router.push("/my-inventory/packages/add-package")}
          >
            <Icon icon="mdi:plus" /> Add Rates
          </Button>
        </div>


        <Row >

          {/* Row 1 */}
          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-primary" style={{ fontSize: "10px" }}>Country *</Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="country"
                value={formData.country}
                onChange={handleChange}>
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
                <option value="Thailand">Thailand</option>
                <option value="Singapore">Singapore</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Maldives">Maldives</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>City *</Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="city"
                value={formData.city}
                onChange={handleChange}>
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Delhi">Delhi</option>
                <option value="Goa">Goa</option>
                <option value="Dubai">Dubai</option>
                <option value="Bangkok">Bangkok</option>
                <option value="Singapore">Singapore</option>
                <option value="Bali">Bali</option>
                <option value="Male">Male</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Sightseeing Name *
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="sightseeingName"
                value={formData.sightseeingName}
                onChange={handleChange} />
              <Form.Label className='text-primary' size="sm"
                onClick={() => setshowAddDetail(true)}
                style={{ fontSize: "10px", cursor: "pointer" }}>Get Place Detail</Form.Label>

            </Form.Group>

          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>Latitude</Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="latitude"
                value={formData.latitude}
                onChange={handleChange} />
            </Form.Group>

          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>Longitude</Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} name="longitude"
                value={formData.longitude}
                onChange={handleChange} />
            </Form.Group>
          </Col>

          {/* Row 2 */}

          {adddetail && (<AddDetailModal onClose={() => setshowAddDetail(false)} />)}

          {/* Row 3 */}


          <Col md={4} >
            <Form.Group>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Image (Recommend size W:800px & H:600px)
              </Form.Label>
              <Form.Control type="file" size="sm" style={{ fontSize: "10px" }} />
            </Form.Group>
          </Col>

          <Col md={4} >
            <Form.Group>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Address
              </Form.Label>
              <Form.Control type="text" size="sm" style={{ fontSize: "10px" }} name="address"
                value={formData.address}
                onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>Unique Type</Form.Label>
            <Form.Group>
              <Form.Check type='checkbox' label='Is Unique' name="isUnique" style={{ fontSize: "10px" }} checked={formData.isUnique}
                onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <strong className='mt-3'>More Details</strong>
        <Card className='mt-2'>
          <CardHeader className='bg-secondary d-flex align-items-center justify-content-between p-1 px-2 text-white fw-bold'
            onClick={() => setDetail(!detail)}
            style={{ cursor: "pointer" }}>
            Details
            {detail ? <Icon icon="mdi:minus"
              className='text-white fw-bold'
            /> : <Icon icon="mdi:plus"
              className='text-white fw-bold'
            />}

          </CardHeader>
          {detail && (
            <CardBody>
              <Col md={12}>
                <Form.Control as="textarea" rows={3} name="details"
                  value={formData.details}
                  onChange={handleChange} />
              </Col>
            </CardBody>
          )}
        </Card>

        <Card className='mt-2'>
          <CardHeader className='bg-secondary d-flex align-items-center justify-content-between p-1 px-2 text-white fw-bold'
            onClick={() => setOtherDetail(!otherdetail)}
            style={{ cursor: "pointer" }} >
            Other Details
            {otherdetail ? <Icon icon="mdi:minus"
              className='text-white fw-bold'
            /> : <Icon icon="mdi:plus"
              className='text-white fw-bold'
            />}
          </CardHeader>
          {otherdetail && (
            <CardBody>
              <Row className="g-3">

                {/* Row 1 */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Category
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "10px" }} name="category"
                      value={formData.category}
                      onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Nature">Nature</option>
                      <option value="Historical">Historical</option>
                      <option value="Wildlife">Wildlife</option>
                      <option value="Religious">Religious</option>
                      <option value="Cultural">Cultural</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Activities
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "10px" }} name="activities"
                      value={formData.activities}
                      onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Hiking">Hiking</option>
                      <option value="Boating">Boating</option>
                      <option value="Safari">Safari</option>
                      <option value="Photography">Photography</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-primary " style={{ fontSize: "10px" }}>
                      Difficulty Level
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "10px" }} name="difficultyLevel"
                      value={formData.difficultyLevel}
                      onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Row 2 */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Season
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "10px" }} name="season"
                      value={formData.season}
                      onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Summer">Summer</option>
                      <option value="Winter">Winter</option>
                      <option value="Monsoon">Monsoon</option>
                      <option value="All Season">All Season</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Days of week
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "10px" }} name="daysOfWeek"
                      value={formData.daysOfWeek}
                      onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Popularity
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "10px" }} name="popularity"
                      value={formData.popularity}
                      onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Row 3 */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Things to Carry
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "10px" }} name="thingsToCarry"
                      value={formData.thingsToCarry}
                      onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="Water Bottle">Water Bottle</option>
                      <option value="Camera">Camera</option>
                      <option value="Sunscreen">Sunscreen</option>
                      <option value="Jacket">Jacket</option>
                      <option value="Walking Shoes">Walking Shoes</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Pick up Point
                    </Form.Label>
                    <Form.Control size="sm" style={{ fontSize: "10px" }} name="pickupPoint"
                      value={formData.pickupPoint}
                      onChange={handleChange} />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                      Pick up Time
                    </Form.Label>
                    <Form.Control size="sm" style={{ fontSize: "10px" }} name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange} />
                  </Form.Group>
                </Col>

                {/* Row 4 - Pax */}
                <Col md={4}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Pax
                  </Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: "10px" }}>Min</span>
                    <Form.Control size="sm" style={{ fontSize: "10px", width: "60px" }} name="minPax"
                      type="number"
                      value={formData.minPax}
                      onChange={handleChange} />
                    <span style={{ fontSize: "10px" }}>Max</span>
                    <Form.Control size="sm" style={{ fontSize: "10px", width: "60px" }} name="maxPax"
                      type="number"
                      value={formData.maxPax}
                      onChange={handleChange} />
                  </div>
                </Col>

                {/* Duration */}
                <Col md={4}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Duration
                  </Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: "10px" }}>Days</span>
                    <Form.Control size="sm" style={{ fontSize: "10px", width: "60px" }} name="durationDays"
                      type="number"
                      value={formData.durationDays}
                      onChange={handleChange} />
                    <span style={{ fontSize: "10px" }}>Min</span>
                    <Form.Control size="sm" style={{ fontSize: "10px", width: "60px" }} name="durationMinutes"
                      type="number"
                      value={formData.durationMinutes}
                      onChange={handleChange} />
                  </div>
                </Col>

                {/* Age Group */}
                <Col md={4}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Allowed Age Group (Yrs)
                  </Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: "10px" }}>From</span>
                    <Form.Control size="sm" style={{ fontSize: "10px", width: "60px" }} name="minAge"
                      type="number"
                      value={formData.minAge}
                      onChange={handleChange} />
                    <span style={{ fontSize: "10px" }}>To</span>
                    <Form.Control size="sm" style={{ fontSize: "10px", width: "60px" }} name="maxAge"
                      type="number"
                      value={formData.maxAge}
                      onChange={handleChange} />
                  </div>
                </Col>

                {/* Operating Time */}
                <Col md={6}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Operating Time
                  </Form.Label>

                  {formData.operatingTime.map((slot, index) => (
                    <div className="d-flex align-items-center gap-2 mt-2" key={index}>
                      <span style={{ fontSize: "10px" }}>From</span>

                      <Form.Select
                        size="sm"
                        style={{ fontSize: "10px", width: "80px" }}
                        value={slot.from}
                        onChange={(e) =>
                          handleOperatingTimeChange(index, "from", e.target.value)
                        }
                      >
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                      </Form.Select>

                      <span style={{ fontSize: "10px" }}>To</span>

                      <Form.Select
                        size="sm"
                        style={{ fontSize: "10px", width: "80px" }}
                        value={slot.to}
                        onChange={(e) =>
                          handleOperatingTimeChange(index, "to", e.target.value)
                        }
                      >
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                      </Form.Select>

                      {index === 0 ? (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={addOperatingSlot}
                        >
                          <Icon icon="mdi:plus" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => removeOperatingSlot(index)}
                        >
                          <Icon icon="mdi:delete" />
                        </Button>
                      )}
                    </div>
                  ))}
                </Col>

              </Row>
            </CardBody>
          )}
        </Card>

        {sections.map((item, index) => (
          <Card className="mt-2" key={index}>
            <CardHeader
              className="bg-secondary d-flex align-items-center justify-content-between p-1 px-2 text-white fw-bold"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{ cursor: "pointer" }}
            >
              {item.title}

              {openIndex === index ? (
                <Icon icon="mdi:minus" className="text-white fw-bold" />
              ) : (
                <Icon icon="mdi:plus" className="text-white fw-bold" />
              )}
            </CardHeader>

            {openIndex === index && (
              <CardBody>
                <Col md={12}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name={
                      index === 0
                        ? "otherInclusions"
                        : index === 1
                          ? "advisory"
                          : index === 2
                            ? "cancellationPolicy"
                            : index === 3
                              ? "refundPolicy"
                              : index === 4
                                ? "confirmationPolicy"
                                : "termsConditions"
                    }
                    value={
                      index === 0
                        ? formData.otherInclusions
                        : index === 1
                          ? formData.advisory
                          : index === 2
                            ? formData.cancellationPolicy
                            : index === 3
                              ? formData.refundPolicy
                              : index === 4
                                ? formData.confirmationPolicy
                                : formData.termsConditions
                    }
                    onChange={handleChange}
                  />
                </Col>
              </CardBody>
            )}
          </Card>
        ))}
        <CardFooter className='text-end'>
          <Button variant='danger' size='sm' style={{ fontSize: "12px" }} onClick={handleSubmit}
            disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>


    </>
  )
}

export default AddSightseeing
