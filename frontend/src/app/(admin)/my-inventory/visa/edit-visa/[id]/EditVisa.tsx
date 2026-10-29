"use client";
import React, { useState, useEffect } from 'react'
import { Button, Modal, Card, Tabs, Tab, Form, Row, Col, CardHeader, NavItem, CardBody } from "react-bootstrap";
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter, useParams } from 'next/navigation';
import {
  useGetVisaByIdQuery,
  useUpdateVisaMutation
} from "../../../../../../store/services/inventory/visa/visaApi";
import toast from "react-hot-toast"

const EditVisa = () => {
  const router = useRouter()
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  const [markup, setMarkup] = useState([
    {
      marketPlace: "B2C",
      currency: "INR",
      markUpType: "Amount",
      adult: 0,
      child: 0,
      infant: 0,
    },
    {
      marketPlace: "B2B",
      currency: "INR",
      markUpType: "Amount",
      adult: 0,
      child: 0,
      infant: 0,
    },
  ]);

  const [serviceProviders, setServiceProviders] = useState([
    {
      display: false,
      serviceName: "",
      currency: "INR",
      fees: 0,
      markup: 0,
      taxable: false,
    },
  ]);

  const [addservice, setAddService] = useState(1)
  const {
    data,
    isLoading,
    isError,
  } = useGetVisaByIdQuery(id, {
    skip: !id,
  });

  const [updateVisa, { isLoading: isUpdating }] = useUpdateVisaMutation();

  const [formData, setFormData] = useState<any>(null);

  const [docs, setDocs] = useState([

    { id: 1, name: "Original Passport", checked: false },
    { id: 2, name: "Photo (35mm x 45mm)", checked: false },
    { id: 3, name: "PAN Card", checked: false },
    { id: 4, name: "Document Radio Button", checked: false },

  ])

  useEffect(() => {
    if (data) {
      const visa = data?.data || data;

      setFormData(visa);

      if (visa.markup) setMarkup(visa.markup);
      if (visa.serviceProviders) setServiceProviders(visa.serviceProviders);
    }
  }, [data]);

  const handleMarkupChange = (index: number, field: string, value: any) => {
    setMarkup((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            [field]:
              ["adult", "child", "infant"].includes(field)
                ? Number(value)
                : value,
          }
          : item
      )
    );
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    setServiceProviders((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            [field]:
              ["fees", "markup"].includes(field)
                ? Number(value)
                : value,
          }
          : item
      )
    );
  };

  const addServiceRow = () => {
    setServiceProviders((prev) => [
      ...prev,
      {
        display: false,
        serviceName: "",
        currency: "INR",
        fees: 0,
        markup: 0,
        taxable: false,
      },
    ]);
  };

  const removeServiceRow = (index: number) => {
    setServiceProviders((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle change
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const numberFields = [
      "adultFee",          // "adult"
      "childFee",          // "child"
      "infantFee",         // "infant"
      "passportExpireDays", // "passportExpire"
      "validityDays",      // "validity"
      "childAge",
    ];

    setFormData((prev: any) => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));
  };

  const getCleanPayload = (data: any) => {
    const {
      _id,
      id,
      __v,
      createdAt,
      updatedAt,
      ...cleanData
    } = data;

    return cleanData;
  };

  // Submit update
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const cleaned = getCleanPayload(formData);

    const payload = {
      ...cleaned,
      markup, // ADD THIS
      serviceProviders, // ADD THIS
    };

    console.log("FINAL PAYLOAD:", payload);

    try {
      await updateVisa({
        id,
        data: payload,
      }).unwrap();

      toast.success("Visa updated successfully ✔");
      router.push("/my-inventory/visa");

    } catch (error: any) {
      console.error("ERROR:", error);
      toast.error(error?.data?.message || "Update failed");
    }
  };

  // loading state
  if (!id) {
    return <div className="p-3">Invalid Visa ID</div>;
  }

  if (isLoading || !formData) {
    return <div className="p-3">Loading visa data...</div>;
  }

  if (isError) {
    return <div className="p-3 text-danger">Failed to load visa</div>;
  }


  return (
    <>
      <Card className='p-3'>
        <div className='text-end'>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/my-inventory/visa")}
            style={{ fontSize: "10px", fontWeight: "bold" }}
          >
            <Icon icon="mdi:eye" className='me-1' />       My Visa
          </Button>
        </div>
        <hr />
        <Form onSubmit={handleSubmit}>
          <Row >
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Travelers Nationality
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="travelerNationality"
                value={formData.travelerNationality || ""}
                onChange={handleChange}>
                <option value="">Select</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </Form.Select>
            </Col>

            {/* Countries Covered */}
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Countries Covered
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "10px" }} placeholder="Enter Countries" name="countriesCovered"
                value={formData.countriesCovered || ""}
                onChange={handleChange} />
            </Col>
          </Row>

          <div className='my-3 border p-3'>
            <Row className="g-2">

              {/* Visa Name */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Visa Name *
                </Form.Label>
                <Form.Control size="sm" placeholder="Visa Name" style={{ fontSize: "10px" }} name="visaName"
                  value={formData.visaName || ""}
                  onChange={handleChange} />
              </Col>

              {/* Visa Type */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Visa Type
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} name="visaType"
                  value={formData.visaType || ""}
                  onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="e Visa">e Visa</option>
                  <option value="Sticker Visa">Sticker Visa</option>
                </Form.Select>
              </Col>

              {/* Visa Category */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Visa Category
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} name="visaCategory"
                  value={formData.visaCategory || ""}
                  onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Tourism">Tourism</option>
                  <option value="Business">Business</option>
                </Form.Select>
              </Col>

              {/* Entry Type */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Entry Type
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} name="entryType"
                  value={formData.entryType || ""}
                  onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Single Entry">Single Entry</option>
                  <option value="Multiple Entry">Multiple Entry</option>
                </Form.Select>
              </Col>

              {/* Processing Time */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Processing Time
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="processingTime"
                  value={formData.processingTime || ""}
                  onChange={handleChange} />
              </Col>

              {/* Passport Expire */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Passport Expire (Days)
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="passportExpireDays"
                  value={formData.passportExpireDays || 0}
                  onChange={handleChange} />
              </Col>

              {/* Validity */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Validity of Visa (Days)
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="validityDays"
                  value={formData.validityDays || 0}
                  onChange={handleChange} />
              </Col>

              {/* Duration */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Duration
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="duration"
                  value={formData.duration || ""}
                  onChange={handleChange} />
              </Col>

              {/* Supplier */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Supplier
                </Form.Label>
                <Form.Control size="sm" placeholder="Supplier" style={{ fontSize: "10px" }} name="supplier"
                  value={formData.supplier || ""}
                  onChange={handleChange} />
              </Col>

              {/* Currency */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Embassy Fee Currency
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} name="embassyFeeCurrency"
                  value={formData.embassyFeeCurrency || "INR"}
                  onChange={handleChange}>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </Form.Select>
              </Col>

              {/* Adult */}
              <Col md={2}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Adult
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="adultFee" value={formData.adultFee || 0}
                  onChange={handleChange} />
              </Col>

              {/* Child */}
              <Col md={2}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Child
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="childFee" value={formData.childFee || 0}
                  onChange={handleChange} />
              </Col>

              {/* Child Age */}
              <Col md={2}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Child Age
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="childAge"
                  value={formData.childAge || 0}
                  onChange={handleChange} />
              </Col>

              {/* Infant */}
              <Col md={2}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Infant
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="infantFee" value={formData.infantFee || 0}
                  onChange={handleChange} />
              </Col>

            </Row>
          </div>


          <strong style={{ fontSize: "10px" }}>Add Markup</strong>

          <div className="table-responsive my-2">
            <table
              className="table table-sm table-bordered mb-0 align-middle"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                  <th style={{ width: "150px" }}>Market Place</th>
                  <th style={{ width: "120px" }}>Currency</th>
                  <th style={{ width: "150px" }}>Mark Up Type</th>
                  <th style={{ width: "120px" }}>Adult</th>
                  <th style={{ width: "120px" }}>Child</th>
                  <th style={{ width: "120px" }}>Infant</th>
                </tr>
              </thead>

              <tbody style={{ fontSize: "10px" }}>
                {markup.map((row, index) => (
                  <tr key={index}>
                    <td>{row.marketPlace}</td>

                    <td>
                      <Form.Select
                        size="sm" style={{ fontSize: "10px" }}
                        value={row.currency}
                        onChange={(e) =>
                          handleMarkupChange(index, "currency", e.target.value)
                        }
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </Form.Select>
                    </td>

                    <td>
                      <Form.Select
                        size="sm" style={{ fontSize: "10px" }}
                        value={row.markUpType}
                        onChange={(e) =>
                          handleMarkupChange(index, "markUpType", e.target.value)
                        }
                      >
                        <option value="Amount">Amount</option>
                        <option value="Percentage">Percentage</option>
                      </Form.Select>
                    </td>

                    <td>
                      <Form.Control
                        size="sm" style={{ fontSize: "10px" }}
                        value={row.adult}
                        onChange={(e) =>
                          handleMarkupChange(index, "adult", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control
                        size="sm" style={{ fontSize: "10px" }}
                        value={row.child}
                        onChange={(e) =>
                          handleMarkupChange(index, "child", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control
                        size="sm" style={{ fontSize: "10px" }}
                        value={row.infant}
                        onChange={(e) =>
                          handleMarkupChange(index, "infant", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <strong style={{ fontSize: "10px" }}>Add Service Provider</strong>

          <div className="table-responsive my-2">
            <table
              className="table table-sm table-bordered mb-0 align-middle"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                  <th style={{ width: "80px" }}>Display</th>
                  <th style={{ width: "200px" }}>Service Name</th>
                  <th style={{ width: "120px" }}>Currency</th>
                  <th style={{ width: "150px" }}>Fees</th>
                  <th style={{ width: "150px" }}>Markup</th>
                  <th style={{ width: "80px" }}>Taxable</th>
                  <th style={{ width: "80px" }}>Action</th>
                </tr>
              </thead>

              <tbody style={{ fontSize: "10px" }}>
                {serviceProviders.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        checked={row.display}
                        onChange={(e) =>
                          handleServiceChange(index, "display", e.target.checked)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control
                        size="sm" style={{ fontSize: "10px" }}
                        value={row.serviceName}
                        onChange={(e) =>
                          handleServiceChange(index, "serviceName", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Select
                        size="sm" style={{ fontSize: "10px" }}
                        value={row.currency}
                        onChange={(e) =>
                          handleServiceChange(index, "currency", e.target.value)
                        }
                      >
                        <option value="INR">INR</option>
                      </Form.Select>
                    </td>

                    <td>
                      <Form.Control
                        size="sm" style={{ fontSize: "10px" }}
                        value={row.fees}
                        onChange={(e) =>
                          handleServiceChange(index, "fees", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control
                        size="sm" style={{ fontSize: "10px" }}
                        value={row.markup}
                        onChange={(e) =>
                          handleServiceChange(index, "markup", e.target.value)
                        }
                      />
                    </td>

                    <td className="text-center">
                      <Form.Check
                        checked={row.taxable}
                        onChange={(e) =>
                          handleServiceChange(index, "taxable", e.target.checked)
                        }
                      />
                    </td>

                    <td>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => removeServiceRow(index)}
                      >
                        -
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add More Button */}
            <div className="d-flex justify-content-end mt-2">
              <Button size="sm"
                style={{ fontSize: "10px" }}
                onClick={addServiceRow}
                variant="outline-danger">
                Add More
              </Button>
            </div>
          </div>

          <strong style={{ fontSize: "10px" }}>Add/Update Visa Document Details</strong>

          <Tabs
            defaultActiveKey="Basic Details"
            id="fill-tab-example"
            className="mb-3 py-2"
            variant="pills"
            style={{ fontSize: "10px" }}
          >

            <Tab eventKey="Basic Details" title="Basic Details">
              <Row className='g-2 mb-4'>
                <Col md={6}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Docs Required
                  </Form.Label>
                  <Form.Control as="textarea" rows={3} size='sm' style={{ fontSize: "10px" }} />
                </Col>
                <Col md={6}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Basic Requirements to visit
                  </Form.Label>
                  <Form.Control as="textarea" rows={3} size='sm' style={{ fontSize: "10px" }} />
                </Col>
                <Col md={6}>
                  <Form.Label className="text-primary" style={{ fontSize: "10px" }}>
                    Embassy Address
                  </Form.Label>
                  <Form.Control as="textarea" rows={3} size='sm' style={{ fontSize: "10px" }} />
                </Col>
              </Row>


              <div className="table-responsive">
                <table
                  className="table table-sm table-bordered mb-0 align-middle"
                  style={{ tableLayout: "fixed", width: "100%" }}
                >
                  <tbody>
                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                      <td style={{ width: "180px" }}>Document 1</td>
                      <td><Form.Control size='sm' style={{ fontSize: "10px" }} /></td>
                      <td><Form.Control type='file' size='sm' style={{ fontSize: "10px" }} /></td>
                    </tr>
                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                      <td>Document 2</td>
                      <td><Form.Control size='sm' style={{ fontSize: "10px" }} /></td>
                      <td><Form.Control type='file' size='sm' style={{ fontSize: "10px" }} /></td>
                    </tr>
                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                      <td>Document 3</td>
                      <td><Form.Control size='sm' style={{ fontSize: "10px" }} /></td>
                      <td><Form.Control type='file' size='sm' style={{ fontSize: "10px" }} /></td>
                    </tr>
                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                      <td>Document 4</td>
                      <td><Form.Control size='sm' style={{ fontSize: "10px" }} /></td>
                      <td><Form.Control type='file' size='sm' style={{ fontSize: "10px" }} /></td>
                    </tr>
                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                      <td>Document 5</td>
                      <td><Form.Control size='sm' style={{ fontSize: "10px" }} /></td>
                      <td><Form.Control type='file' size='sm' style={{ fontSize: "10px" }} /></td>
                    </tr>
                    <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                      <td>Document 6</td>
                      <td><Form.Control size='sm' style={{ fontSize: "10px" }} /></td>
                      <td><Form.Control type='file' size='sm' style={{ fontSize: "10px" }} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>


            </Tab>

            <Tab eventKey="fields / doc mapping" title="Fields / Doc Mapping">
              <div>
                <Row className='align-items-center mb-2'>
                  <Col md={3}>
                    <div className='d-flex gap-2 align-items-center'>
                      <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                        Physical Submission
                      </Form.Label>
                      <Form.Check type='radio' name='submissiontype' id='submissionyes' label='Yes' style={{ fontSize: "10px" }} />
                      <Form.Check type='radio' label='No' name='submissiontype' id='submissionno' style={{ fontSize: "10px" }} />
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className='d-flex gap-2 align-items-center'>
                      <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                        Physical Interview
                      </Form.Label>
                      <Form.Check type='radio' name='type' id='yes' label='Yes' style={{ fontSize: "10px" }} />
                      <Form.Check type='radio' label='No' name='type' id='no' style={{ fontSize: "10px" }} />
                    </div>
                  </Col>
                </Row>

                <div className=''>
                  {docs.map((item) => (
                    <div key={item.id}
                      className='border mb-2 p-1 d-flex justify-content-between'
                    >
                      <div className='d-flex gap-2' >
                        <Form.Check
                          type='checkbox'
                          label={item.name}
                          style={{ fontSize: "10px" }}
                          checked={item.checked}
                          onChange={() => handleChange(item.id)}
                        />

                        {item.checked && (
                          <>
                            <div className='d-flex gap-1'>
                              <Icon icon="mdi:alert-circle" className='me-1' />
                              <Form.Check type='checkbox' label='Mandatory' style={{ fontSize: "10px" }} name='required' id='mandatory' />
                            </div>
                          </>

                        )}
                      </div>
                      <span><Icon icon="mdi:plus" /></span>
                    </div>
                  ))}

                </div>
              </div>
            </Tab>
          </Tabs>
          <div className='text-end mt-3'>
            <Button size="sm"
              style={{ fontSize: "10px", fontWeight: "bold" }}
              type="submit"
              variant="success"
              disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Visa"}
            </Button>
          </div>
        </Form>
      </Card>
    </>

  )
}

export default EditVisa
