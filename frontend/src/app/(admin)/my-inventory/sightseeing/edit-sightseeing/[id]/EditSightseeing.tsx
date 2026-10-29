"use client";
import React from 'react'
import { useState, useEffect } from "react";
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
import { useRouter, useParams } from 'next/navigation';
import {
  useGetSightseeingByIdQuery,
  useUpdateSightseeingMutation,
} from "../../../../../../store/services/inventory/sightseeing/sightSeeingApi";
import toast from "react-hot-toast";

const EditSightseeing = () => {
  const router = useRouter()
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useGetSightseeingByIdQuery(id);
  const [updateSightseeing] = useUpdateSightseeingMutation();

  const [adddetail, setshowAddDetail] = useState(false)
  const [detail, setDetail] = useState(true)
  const [addoperatingtime, setAddOperatingTime] = useState(0)
  const [otherdetail, setOtherDetail] = useState(false)

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data?.data) {
      setFormData(data.data);
    }
  }, [data]);

  const [formData, setFormData] = useState<any>({
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
    minPax: 0,
    maxPax: 0,
    durationDays: 0,
    durationMinutes: 0,
    minAge: 0,
    maxAge: 0,
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

  const handleOperatingTimeChange = (
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    const updated = [...formData.operatingTime];
    updated[index][field] = value;

    setFormData((prev: any) => ({
      ...prev,
      operatingTime: updated,
    }));
  };

  const addOperatingTime = () => {
    setFormData((prev: any) => ({
      ...prev,
      operatingTime: [...prev.operatingTime, { from: "", to: "" }],
    }));
  };

  const removeOperatingTime = (index: number) => {
    const updated = formData.operatingTime.filter(
      (_: any, i: number) => i !== index
    );

    setFormData((prev: any) => ({
      ...prev,
      operatingTime: updated,
    }));
  };

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

  const handleUpdate = async (e: any) => {

    e.preventDefault();

    try {
      await updateSightseeing({
        id,
        data: formData,
      }).unwrap();

      toast.success("Sightseeing updated successfully");
      router.push("/my-inventory/sightseeing");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  const [sections, setSections] = useState([
    { title: "Other Inclusions", open: false, value: "" },
    { title: "Advisory", open: false, value: "" },
    { title: "Cancellation Policy", open: false, value: "" },
    { title: "Refund Policy", open: false, value: "" },
    { title: "Confirmation policy", open: false, value: "" },
    { title: "Term & Condition's", open: false, value: "" },
  ]);
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
              <Form.Check type='checkbox' label='Is Unique' style={{ fontSize: "10px" }} name="isUnique"
                checked={formData.isUnique}
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
                    <Form.Label className="text-primary" style={{ fontSize: "10px" }} name="season"
                      value={formData.season}
                      onChange={handleChange}>
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
                      value={formData.minPax}
                      onChange={handleChange} />
                    <span style={{ fontSize: "10px" }}>Max</span>
                    <Form.Control size="sm" style={{ fontSize: "10px", width: "60px" }} name="maxPax"
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
                      value={formData.durationDays}
                      onChange={handleChange} />
                    <span style={{ fontSize: "10px" }}>Min</span>
                    <Form.Control size="sm" style={{ fontSize: "10px", width: "60px" }} name="durationMinutes"
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
                      value={formData.minAge}
                      onChange={handleChange} />
                    <span style={{ fontSize: "10px" }}>To</span>
                    <Form.Control size="sm" style={{ fontSize: "10px", width: "60px" }} name="maxAge"
                      value={formData.maxAge}
                      onChange={handleChange} />
                  </div>
                </Col>

                {/* Operating Time */}
                {formData.operatingTime.map((time: any, index: number) => (
                  <div
                    className="d-flex align-items-center gap-2 mt-2"
                    key={index}
                  >
                    <span style={{ fontSize: "10px" }}>From</span>

                    <Form.Select
                      size="sm"
                      style={{ fontSize: "10px", width: "80px" }}
                      value={time.from}
                      onChange={(e) =>
                        handleOperatingTimeChange(index, "from", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </Form.Select>

                    <span style={{ fontSize: "10px" }}>To</span>

                    <Form.Select
                      size="sm"
                      style={{ fontSize: "10px", width: "80px" }}
                      value={time.to}
                      onChange={(e) =>
                        handleOperatingTimeChange(index, "to", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </Form.Select>

                    {index === formData.operatingTime.length - 1 ? (
                      <Button
                        size="sm"
                        variant="danger"
                        style={{ fontSize: "10px" }}
                        onClick={addOperatingTime}
                      >
                        <Icon icon="mdi:plus" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline-info"
                        style={{ fontSize: "10px" }}
                        onClick={() => removeOperatingTime(index)}
                      >
                        <Icon icon="mdi:delete" />
                      </Button>
                    )}
                  </div>
                ))}

              </Row>
            </CardBody>
          )}
        </Card>

        {sections.map((item, index) => (
          <Card className='mt-2' key={index}>
            <CardHeader className='bg-secondary d-flex align-items-center justify-content-between p-1 px-2 text-white fw-bold'
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{ cursor: "pointer" }}>
              {item.title}
              {openIndex === index ? <Icon icon="mdi:minus"
                className='text-white fw-bold'
              /> : <Icon icon="mdi:plus"
                className='text-white fw-bold'
              />}

            </CardHeader>
            {openIndex === index && (
              <CardBody>
                <Col md={12}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name={
                      item.title === "Other Inclusions"
                        ? "otherInclusions"
                        : item.title === "Advisory"
                          ? "advisory"
                          : item.title === "Cancellation Policy"
                            ? "cancellationPolicy"
                            : item.title === "Refund Policy"
                              ? "refundPolicy"
                              : item.title === "Confirmation policy"
                                ? "confirmationPolicy"
                                : "termsConditions"
                    }
                    value={
                      item.title === "Other Inclusions"
                        ? formData.otherInclusions
                        : item.title === "Advisory"
                          ? formData.advisory
                          : item.title === "Cancellation Policy"
                            ? formData.cancellationPolicy
                            : item.title === "Refund Policy"
                              ? formData.refundPolicy
                              : item.title === "Confirmation policy"
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
          <Button variant='danger' size='sm' style={{ fontSize: "12px" }} onClick={handleUpdate}>Save</Button>
        </CardFooter>
      </Card>


    </>
  )
}

export default EditSightseeing
