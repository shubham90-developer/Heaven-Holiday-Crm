"use client";
import React, { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js';
import { Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import { useRouter } from 'next/navigation';
import { useCreateVisaMutation } from "../../../../../store/services/inventory/visa/visaApi";
import toast from "react-hot-toast";

interface ServiceProvider {
  display: boolean;
  serviceName: string;
  currency: string;
  fees: number;
  markup: number;
  taxable: boolean;
}

const AddVisa = () => {
  const router = useRouter()
  const [addservice, setAddService] = useState(1)
  const [createVisa, { isLoading }] = useCreateVisaMutation();

  const [formData, setFormData] = useState({
    travelerNationality: "India",
    countriesCovered: "",
    visaName: "",
    visaType: "",
    visaCategory: "",
    entryType: "",
    processingTime: "",
    passportExpire: "",
    validity: "",
    duration: "",
    supplier: "",
    currency: "INR",
    adult: 0,
    child: 0,
    childAge: 0,
    infant: 0,
    markup: [
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
    ],

    serviceProviders: [] as ServiceProvider[],
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const numberFields = ["adult", "child", "childAge", "infant", "passportExpire", "validity"];

    setFormData({
      ...formData,
      [name]: numberFields.includes(name)
        ? value === "" ? 0 : Number(value)
        : value,
    });
  };

  const handleMarkupChange = (index: number, field: string, value: any) => {
    const updated = [...formData.markup];
    updated[index] = {
      ...updated[index],
      [field]:
        field === "adult" || field === "child" || field === "infant"
          ? Number(value)
          : value,
    };

    setFormData({ ...formData, markup: updated });
  };


  const handleServiceChange = (index: number, field: string, value: any) => {
    const updated = [...formData.serviceProviders] as {
      display: boolean;
      serviceName: string;
      currency: string;
      fees: number;
      markup: number;
      taxable: boolean;
    }[];

    updated[index] = {
      ...updated[index],
      [field]:
        field === "fees" || field === "markup"
          ? Number(value)
          : field === "display" || field === "taxable"
            ? value
            : value,
    };

    setFormData({ ...formData, serviceProviders: updated });
  };

  const addServiceProvider = () => {
    setFormData({
      ...formData,
      serviceProviders: [
        ...formData.serviceProviders,
        {
          display: false,
          serviceName: "",
          currency: "INR",
          fees: 0,
          markup: 0,
          taxable: false,
        } as {
          display: boolean;
          serviceName: string;
          currency: string;
          fees: number;
          markup: number;
          taxable: boolean;
        },
      ],
    });
  };

  const removeServiceProvider = (index: number) => {
    const updated = [...formData.serviceProviders];
    updated.splice(index, 1);
    setFormData({ ...formData, serviceProviders: updated });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createVisa(formData).unwrap();

      toast.success("Visa created successfully ✔");
      router.push("/my-inventory/visa");

    } catch (error: any) {
      console.error(error);

      const backendMessage = error?.data?.message;
      const fieldErrors = error?.data?.errors;

      let firstError = "";

      if (fieldErrors) {
        const firstKey = Object.keys(fieldErrors)[0];
        firstError = fieldErrors[firstKey]?.[0];
      }

      toast.error(firstError || backendMessage || "Something went wrong");
    }
  };

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
              <Form.Select size="sm" style={{ fontSize: "10px" }} name="travelersNationality"
                value={formData.travelerNationality}
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
                value={formData.countriesCovered}
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
                  value={formData.visaName}
                  onChange={handleChange} />
              </Col>

              {/* Visa Type */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Visa Type
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} name="visaType"
                  value={formData.visaType}
                  onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="E Visa">e Visa</option>
                  <option value="Sticker Visa">Sticker Visa</option>
                </Form.Select>
              </Col>

              {/* Visa Category */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Visa Category
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} name="visaCategory"
                  value={formData.visaCategory}
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
                  value={formData.entryType}
                  onChange={handleChange}>
                  <option>Single Entry</option>
                  <option>Multiple Entry</option>
                </Form.Select>
              </Col>

              {/* Processing Time */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Processing Time
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="processingTime"
                  value={formData.processingTime}
                  onChange={handleChange} />
              </Col>

              {/* Passport Expire */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Passport Expire (Days)
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="passportExpire"
                  value={formData.passportExpire}
                  onChange={handleChange} />
              </Col>

              {/* Validity */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Validity of Visa (Days)
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="validity"
                  value={formData.validity}
                  onChange={handleChange} />
              </Col>

              {/* Duration */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Duration
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }} name="duration"
                  value={formData.duration}
                  onChange={handleChange} />
              </Col>

              {/* Supplier */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Supplier
                </Form.Label>
                <Form.Control size="sm" placeholder="Supplier" style={{ fontSize: "10px" }} name="supplier"
                  value={formData.supplier}
                  onChange={handleChange} />
              </Col>

              {/* Currency */}
              <Col md={4}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Embassy Fee Currency
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "10px" }} name="currency"
                  value={formData.currency}
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
                <Form.Control size="sm" style={{ fontSize: "10px" }}
                  name="adult"
                  value={formData.adult}
                  onChange={handleChange} />
              </Col>

              {/* Child */}
              <Col md={2}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Child
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }}
                  name="child"
                  value={formData.child}
                  onChange={handleChange} />
              </Col>

              {/* Child Age */}
              <Col md={2}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Child Age
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }}
                  name="childAge"
                  value={formData.childAge}
                  onChange={handleChange} />
              </Col>

              {/* Infant */}
              <Col md={2}>
                <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                  Infant
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "10px" }}
                  name="infant"
                  value={formData.infant}
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
                {formData.markup.map((m, i) => (
                  <tr key={i}>
                    <td>{m.marketPlace}</td>

                    <td>
                      <Form.Control size="sm" style={{ fontSize: "10px" }}
                        value={m.currency}
                        onChange={(e) =>
                          handleMarkupChange(i, "currency", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Select size="sm" style={{ fontSize: "10px" }}
                        value={m.markUpType}
                        onChange={(e) =>
                          handleMarkupChange(i, "markUpType", e.target.value)
                        }
                      >
                        <option>Amount</option>
                        <option>Percentage</option>
                      </Form.Select>
                    </td>

                    <td>
                      <Form.Control size="sm" style={{ fontSize: "10px" }}
                        value={m.adult}
                        onChange={(e) =>
                          handleMarkupChange(i, "adult", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control size="sm" style={{ fontSize: "10px" }}
                        value={m.child}
                        onChange={(e) =>
                          handleMarkupChange(i, "child", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control size="sm" style={{ fontSize: "10px" }}
                        value={m.infant}
                        onChange={(e) =>
                          handleMarkupChange(i, "infant", e.target.value)
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
                {formData.serviceProviders.map((sp, i) => (
                  <tr key={i}>
                    <td>
                      <Form.Check
                        checked={sp.display}
                        onChange={(e) =>
                          handleServiceChange(i, "display", e.target.checked)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control size="sm" placeholder="Enter Title" style={{ fontSize: "10px" }}
                        value={sp.serviceName}
                        onChange={(e) =>
                          handleServiceChange(i, "serviceName", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control size="sm" style={{ fontSize: "10px" }}
                        value={sp.currency}
                        onChange={(e) =>
                          handleServiceChange(i, "currency", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control size="sm" placeholder="Enter value" style={{ fontSize: "10px" }}
                        value={sp.fees}
                        onChange={(e) =>
                          handleServiceChange(i, "fees", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Control size="sm" placeholder="Enter value" style={{ fontSize: "10px" }}
                        value={sp.markup}
                        onChange={(e) =>
                          handleServiceChange(i, "markup", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <Form.Check
                        checked={sp.taxable}
                        onChange={(e) =>
                          handleServiceChange(i, "taxable", e.target.checked)
                        }
                      />
                    </td>

                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => removeServiceProvider(i)}
                      >
                        X
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
                onClick={addServiceProvider}
                variant="outline-danger">
                Add More
              </Button>
            </div>
          </div>

          <div className='text-end mt-3'>
            <Button size="sm"
              style={{ fontSize: "10px", fontWeight: "bold" }}
              type="submit"
              variant="success" disabled={isLoading}>
              Save
            </Button>
          </div>
        </Form>
      </Card>
    </>
  )
}

export default AddVisa
