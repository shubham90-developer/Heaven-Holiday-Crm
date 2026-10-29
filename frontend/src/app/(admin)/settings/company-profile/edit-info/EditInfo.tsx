"use client";
import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Row, Col, InputGroup, Card, CardBody } from "react-bootstrap";
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  useCreateOrUpdateCompanyProfileMutation,
  useGetCompanyProfileQuery
} from "../../../../../store/services/settings/company-profile/companyProfileApi";
import toast from "react-hot-toast";

const tabs: string[] = [
  "Verify Contact Details",
  "Persnal Details",
  "Company Details",
  "More About Company"
]
const EditInfo = () => {
  const [activetab, setActiveTab] = useState<number>(0);

  const {
    data: companyProfileData,
    isLoading: isFetchingProfile
  } = useGetCompanyProfileQuery(undefined);

  const [createOrUpdateCompanyProfile, { isLoading: isSubmitting }] =
    useCreateOrUpdateCompanyProfileMutation();
  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: "",
      lastName: "",
      designation: "",
      mobileNumber: "",
      email: "",
      senderEmail: ""
    },

    companyDetails: {
      companyName: "",
      companyDisplayName: "",
      gstinNumber: "",
      companyLogo: "",
      companyNumber: "",
      companyEmail: "",
      transactionCurrency: "INR",

      registeredAddress: {
        addressLine1: "",
        addressLine2: "",
        country: "",
        city: "",
        pinCode: ""
      },

      expertiseCountry: "",
      expertiseCity: "",
      agencySignature: ""
    },

    moreAboutCompany: {
      aboutCompany: "",
      certificationOfTrade: [],
      recognitionFromGovernment: [],
      socialLinks: {
        facebook: "",
        google: "",
        youtube: "",
        twitter: "",
        instagram: "",
        pinterest: "",
        googleFeedback: ""
      }
    }
  });

  useEffect(() => {
    if (companyProfileData?.data) {
      setFormData({
        personalDetails: {
          firstName:
            companyProfileData.data.personalDetails?.firstName || "",
          lastName:
            companyProfileData.data.personalDetails?.lastName || "",
          designation:
            companyProfileData.data.personalDetails?.designation || "",
          mobileNumber:
            companyProfileData.data.personalDetails?.mobileNumber || "",
          email:
            companyProfileData.data.personalDetails?.email || "",
          senderEmail:
            companyProfileData.data.personalDetails?.senderEmail || ""
        },

        companyDetails: {
          companyName:
            companyProfileData.data.companyDetails?.companyName || "",
          companyDisplayName:
            companyProfileData.data.companyDetails?.companyDisplayName || "",
          gstinNumber:
            companyProfileData.data.companyDetails?.gstinNumber ||
            companyProfileData.data.companyDetails?.gstNumber ||
            "",
          companyLogo:
            companyProfileData.data.companyDetails?.companyLogo || "",
          companyNumber:
            companyProfileData.data.companyDetails?.companyNumber || "",
          companyEmail:
            companyProfileData.data.companyDetails?.companyEmail || "",
          transactionCurrency:
            companyProfileData.data.companyDetails?.transactionCurrency || "INR",

          registeredAddress: {
            addressLine1:
              companyProfileData.data.companyDetails?.registeredAddress?.addressLine1 || "",
            addressLine2:
              companyProfileData.data.companyDetails?.registeredAddress?.addressLine2 || "",
            country:
              companyProfileData.data.companyDetails?.registeredAddress?.country || "",
            city:
              companyProfileData.data.companyDetails?.registeredAddress?.city || "",
            pinCode:
              companyProfileData.data.companyDetails?.registeredAddress?.pinCode || ""
          },

          expertiseCountry:
            companyProfileData.data.companyDetails?.expertiseCountry || "",

          expertiseCity:
            companyProfileData.data.companyDetails?.expertiseCity || "",

          agencySignature:
            companyProfileData.data.companyDetails?.agencySignature || ""
        },

        moreAboutCompany: {
          aboutCompany:
            companyProfileData.data.moreAboutCompany?.aboutCompany || "",

          certificationOfTrade:
            companyProfileData.data.moreAboutCompany?.certificationOfTrade || [],

          recognitionFromGovernment:
            companyProfileData.data.moreAboutCompany?.recognitionFromGovernment || [],

          socialLinks: {
            facebook:
              companyProfileData.data.moreAboutCompany?.socialLinks?.facebook || "",

            google:
              companyProfileData.data.moreAboutCompany?.socialLinks?.google || "",

            youtube:
              companyProfileData.data.moreAboutCompany?.socialLinks?.youtube || "",

            twitter:
              companyProfileData.data.moreAboutCompany?.socialLinks?.twitter || "",

            instagram:
              companyProfileData.data.moreAboutCompany?.socialLinks?.instagram || "",

            pinterest:
              companyProfileData.data.moreAboutCompany?.socialLinks?.pinterest || "",

            googleFeedback:
              companyProfileData.data.moreAboutCompany?.socialLinks?.googleFeedback || ""
          }
        }
      });
    }
  }, [companyProfileData]);

  const handleChange = (
    section: string,
    field: string,
    value: any
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAddressChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        registeredAddress: {
          ...prev.companyDetails.registeredAddress,
          [field]: value
        }
      }
    }));
  };

  const handleSocialMediaChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      moreAboutCompany: {
        ...prev.moreAboutCompany,
        socialMediaUrls: {
          ...prev.moreAboutCompany.socialMediaUrls,
          [field]: value
        }
      }
    }));
  };

  const handleCheckboxChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev: any) => {
      const existing =
        prev.moreAboutCompany[field];

      return {
        ...prev,
        moreAboutCompany: {
          ...prev.moreAboutCompany,
          [field]: existing.includes(value)
            ? existing.filter(
              (item: string) => item !== value
            )
            : [...existing, value]
        }
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await createOrUpdateCompanyProfile(formData).unwrap();

      toast.success(response.message);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Card className="p-3">
        <div className='d-flex justify-content-between align-items-center '>
          <h6>Registration Process</h6>
        </div>
        <hr />
        <div>
          <div className='d-flex gap-2'>
            {tabs.map((tab, index) => (
              <Button key={index}
                size='sm' style={{ fontSize: "10px" }}
                variant={activetab === index ? "primary" : "outline-primary"}
                onClick={() => setActiveTab(index)}
              >{index + 1} {" "} {tab}</Button>))}
          </div>

          {activetab === 0 && <ContactDetails
            activetab={activetab}
            setActiveTab={setActiveTab}
            formData={formData}
            handleChange={handleChange} />}

          {activetab === 1 && <PersonalDetail activetab={activetab}
            setActiveTab={setActiveTab}
            formData={formData}
            handleChange={handleChange} />}

          {activetab === 2 && <CompanyDetail
            activetab={activetab}
            setActiveTab={setActiveTab}
            formData={formData}
            handleChange={handleChange}
            handleAddressChange={handleAddressChange}
          />}
          {activetab === 3 && <MoreAboutCompany
            activetab={activetab}
            setActiveTab={setActiveTab}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            handleSocialMediaChange={handleSocialMediaChange}
            handleCheckboxChange={handleCheckboxChange} />}
        </div>
      </Card>
    </>
  )
}

export default EditInfo

type ContactDetailsProps = {
  activetab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  formData: any;
  handleChange: any;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  activetab,
  setActiveTab,
  formData
}) => {

  return (
    <>
      <Card>
        <CardBody>
          <h5 style={{ fontSize: "12px" }}>Your Email ID & Mobile No. are successfully verified</h5>
          <div className='text-danger' style={{ fontSize: "12px" }}> {formData.personalDetails?.email || "No Email"} </div>
          <div className='text-danger' style={{ fontSize: "12px" }}> {formData.personalDetails?.mobileNumber || "No Mobile"} </div>
          <div className='text-end mt-3'>
            <Button variant='primary' size='sm'
              onClick={() => setActiveTab(activetab + 1)}
              style={{ fontSize: "10px" }}>Next</Button>

          </div>
        </CardBody>
      </Card>
    </>
  )
}



type PersonalDetailProps = {
  activetab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  formData: any;
  handleChange: any;
}
const PersonalDetail: React.FC<PersonalDetailProps> = ({
  activetab,
  setActiveTab,
  formData,
  handleChange
}) => {

  return (
    <>
      <Card>
        <CardBody>
          <h5 style={{ fontSize: "12px" }}>Complete Your Profile</h5>
          <p style={{ fontSize: "12px" }}>Please fill your personal details below as part of your profile to complete the registration process.</p>
          <p style={{ fontSize: "12px" }}>(Kindly fill the details of an Authorised Signatory of your company)</p>
          <h6 style={{ fontSize: "12px" }}>Primary Contact</h6>

          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  First Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  value={formData.personalDetails.firstName}
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "firstName",
                      e.target.value
                    )
                  }
                  style={{ fontSize: "10px" }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Last Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  value={formData.personalDetails.lastName}
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "lastName",
                      e.target.value
                    )
                  }
                  style={{ fontSize: "10px" }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Designation *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Designation"
                  value={formData.personalDetails.designation}
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "designation",
                      e.target.value
                    )
                  }
                  style={{ fontSize: "10px" }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Mobile Number *
                </Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value="+91"
                    disabled
                    style={{ fontSize: "10px", maxWidth: "60px", marginRight: "5px" }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Mobile Number"
                    value={formData.personalDetails.mobileNumber}
                    onChange={(e) =>
                      handleChange(
                        "personalDetails",
                        "mobileNumber",
                        e.target.value
                      )
                    }
                    style={{ fontSize: "10px" }}
                  />
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Email *
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={formData.personalDetails.email}
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "email",
                      e.target.value
                    )
                  }
                  style={{ fontSize: "10px" }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Sender Email ID *
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Sender Email ID"
                  value={formData.personalDetails.senderEmail}
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "senderEmail",
                      e.target.value
                    )
                  }
                  style={{ fontSize: "10px" }}
                />
              </Form.Group>
              <div style={{ fontSize: "10px" }} className='text-primary'><Icon icon="mdi:check" />Verified</div>
              <div style={{ fontSize: "10px" }}>This ID will be used to send email to customer or agent for your booking.</div>
            </Col>
          </Row>
          <div className='text-end mt-3'>
            <Button variant='primary' size='sm'
              onClick={() => setActiveTab(activetab + 1)}
              style={{ fontSize: "10px" }}>Next</Button>

          </div>
        </CardBody>
      </Card>
    </>
  )
}



type CompanyDetailProps = {
  activetab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  formData: any;
  handleChange: any;
  handleAddressChange: any;
}
const CompanyDetail: React.FC<CompanyDetailProps> = ({
  activetab,
  setActiveTab,
  formData,
  handleChange,
  handleAddressChange
}) => {
  return (
    <Card>
      <CardBody>
        <h5 style={{ fontSize: "12px" }}>Complete Your Profile</h5>
        <p style={{ fontSize: "12px" }}>Please fill your company details to complete the registration process and get your holiday packages live on globaltravelexchange.com.</p>
        <Row className='g-2'>
          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Company Name *
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.companyDetails.companyName}
                onChange={(e) =>
                  handleChange(
                    "companyDetails",
                    "companyName",
                    e.target.value
                  )
                }
                style={{ fontSize: "10px" }}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Company Display Name
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.companyDetails.companyDisplayName}
                onChange={(e) =>
                  handleChange(
                    "companyDetails",
                    "companyDisplayName",
                    e.target.value
                  )
                }
                style={{ fontSize: "10px" }}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                GSTIN Number
              </Form.Label>
              <Form.Control
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.gstinNumber}
                onChange={(e) =>
                  handleChange(
                    "companyDetails",
                    "gstinNumber",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Company Logo
              </Form.Label>
              <Form.Control
                type="file"
                accept=".png,.jpg,.jpeg,.gif"
                style={{ fontSize: "10px" }}
                onChange={(e: any) => {
                  const file = e?.target?.files?.[0] as File | undefined;
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    handleChange(
                      "companyDetails",
                      "companyLogo",
                      String(reader.result || "")
                    );
                  };
                  reader.readAsDataURL(file);
                }}
              />
              {formData.companyDetails.companyLogo ? (
                <img
                  src={formData.companyDetails.companyLogo}
                  alt="Company logo"
                  style={{
                    display: "block",
                    maxHeight: "48px",
                    marginTop: "8px",
                    objectFit: "contain",
                  }}
                />
              ) : null}
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Company Number
              </Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  defaultValue={+91}
                  style={{ fontSize: "10px", maxWidth: "60px", marginRight: "5px" }}
                />
                <Form.Control
                  type="text"
                  style={{ fontSize: "10px" }}
                  value={formData.companyDetails.companyNumber}
                  onChange={(e) =>
                    handleChange(
                      "companyDetails",
                      "companyNumber",
                      e.target.value
                    )
                  }
                />
              </div>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Company Email
              </Form.Label>
              <Form.Control
                type="email"
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.companyEmail}
                onChange={(e) =>
                  handleChange(
                    "companyDetails",
                    "companyEmail",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Transaction Currency *
              </Form.Label>
              <Form.Select style={{ fontSize: "10px" }} value={formData.companyDetails.transactionCurrency}
                onChange={(e) =>
                  handleChange(
                    "companyDetails",
                    "transactionCurrency",
                    e.target.value
                  )
                }>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12}>
            <h6 className="mt-3">Registered Address</h6>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Address Line 1 *
              </Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.registeredAddress.addressLine1}
                onChange={(e) =>
                  handleAddressChange(
                    "addressLine1",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Address Line 2
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Address Line 2"
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.registeredAddress.addressLine2}
                onChange={(e) =>
                  handleAddressChange(
                    "addressLine2",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Country *
              </Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.registeredAddress.country}
                onChange={(e) =>
                  handleAddressChange(
                    "country",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                City *
              </Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.registeredAddress.city}
                onChange={(e) =>
                  handleAddressChange(
                    "city",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                PIN / Zip Code *
              </Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.registeredAddress.pinCode}
                onChange={(e) =>
                  handleAddressChange(
                    "pinCode",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Upload Address Proof
              </Form.Label>
              <Form.Control
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.pdf"
                style={{ fontSize: "10px" }}
              />
              <small style={{ fontSize: "9px" }}>
                Only GIF, PNG, JPG, JPEG, PDF allowed
              </small>
            </Form.Group>
          </Col>

          <Col md={12}>
            <h6 className="mt-3">Expertise In</h6>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Expertise In (Geography) : Country
              </Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.expertiseCountry}
                onChange={(e) =>
                  handleChange(
                    "companyDetails",
                    "expertiseCountry",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Expertise In (Geography) : City
              </Form.Label>
              <Form.Control
                type="text"
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.expertiseCity}
                onChange={(e) =>
                  handleChange(
                    "companyDetails",
                    "expertiseCity",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Agency Signature
              </Form.Label>
              <Form.Control
                as="textarea" rows={3}
                style={{ fontSize: "10px" }}
                value={formData.companyDetails.agencySignature}
                onChange={(e) =>
                  handleChange(
                    "companyDetails",
                    "agencySignature",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>


          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Upload Image For Agency Signature
              </Form.Label>
              <Form.Control
                type="file"
                accept=".png,.jpg,.jpeg"
                style={{ fontSize: "10px" }}
              />
              <small style={{ fontSize: "9px" }}>
                (Common for All Employees) | Width: 550px & Height: 170px | Only PNG, JPG, JPEG allowed
              </small>
            </Form.Group>
          </Col>

          <Col md={4} className="mt-2">
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Upload Image For Invoice Signature
              </Form.Label>
              <Form.Control
                type="file"
                accept=".png,.jpg,.jpeg"
                style={{ fontSize: "10px" }}
              />
              <small style={{ fontSize: "9px" }}>
                (Common for All Employees) | Width: 120px & Height: 120px | Only PNG, JPG, JPEG allowed
              </small>
            </Form.Group>
          </Col>
        </Row>

      </CardBody>
      <div className='mt-3 text-end'>
        <Button variant='danger' size='sm'
          onClick={() => setActiveTab(activetab + 1)}
          style={{ fontSize: "10px" }}>Continue</Button>
      </div>
    </Card>
  )
}

type MoreAboutCompanyProps = {
  activetab: number;
  setActiveTab: React.Dispatch<
    React.SetStateAction<number>
  >;
  formData: any;
  handleChange: any;
  handleSubmit: any;
  isSubmitting: boolean;
  handleSocialMediaChange: any;
  handleCheckboxChange: any;
};
const MoreAboutCompany: React.FC<MoreAboutCompanyProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  handleSocialMediaChange,
  handleCheckboxChange
}) => {
  return (

    <Card>
      <CardBody>
        <h5 style={{ fontSize: "12px" }} >Complete Your Profile</h5>
        <p style={{ fontSize: "12px" }}>Please share some highlights of your company. which you would like to showcase to customers</p>
        <Row className='g-1'>
          <Col md={12}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                About the Company(250 words maximum)*
              </Form.Label>
              <Form.Control
                as="textarea" rows={2}
                style={{ fontSize: "10px" }}
                value={formData.moreAboutCompany.aboutCompany}
                onChange={(e) =>
                  handleChange(
                    "moreAboutCompany",
                    "aboutCompany",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Certification Of Trade
              </Form.Label>
              <div className='d-flex flex-column gap-1'>
                <Form.Check label='IATO' checked={formData.moreAboutCompany.certificationOfTrade.includes("IATO")}
                  onChange={() =>
                    handleCheckboxChange(
                      "certificationOfTrade",
                      "IATO"
                    )
                  } style={{ fontSize: "10px" }} />
                <Form.Check label='ADTOI' checked={formData.moreAboutCompany.certificationOfTrade.includes("ADTOI")}
                  onChange={() =>
                    handleCheckboxChange(
                      "certificationOfTrade",
                      "ADTOI"
                    )
                  } style={{ fontSize: "10px" }} />
                <Form.Check label='IATA' checked={formData.moreAboutCompany.certificationOfTrade.includes("IATA")}
                  onChange={() =>
                    handleCheckboxChange(
                      "certificationOfTrade",
                      "IATA"
                    )
                  } style={{ fontSize: "10px" }} />
              </div>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Recognition from Government
              </Form.Label>
              <div className='d-flex flex-column gap-1' style={{ fontSize: "10px" }}>
                <Form.Check label='Domestic Holiday' checked={formData.moreAboutCompany.recognitionFromGovernment.includes("Domestic Holiday")}
                  onChange={() =>
                    handleCheckboxChange(
                      "recognitionFromGovernment",
                      "Domestic Holiday"
                    )
                  } style={{ fontSize: "10px" }} />
                <Form.Check label='International Holiday' checked={formData.moreAboutCompany.recognitionFromGovernment.includes("International Holiday")}
                  onChange={() =>
                    handleCheckboxChange(
                      "recognitionFromGovernment",
                      "International Holiday"
                    )
                  } style={{ fontSize: "10px" }} />
              </div>
            </Form.Group>
          </Col>

          <Col md={12}>
            <h6 className="mt-3">Social Media Url</h6>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Facebook URL
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter Facebook URL"
                style={{ fontSize: "10px" }}
                value={formData.moreAboutCompany.socialLinks.facebook}
                onChange={(e) =>
                  handleSocialMediaChange(
                    "facebook",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Google URL
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter Google URL"
                style={{ fontSize: "10px" }}
                value={formData.moreAboutCompany.socialLinks.google}
                onChange={(e) =>
                  handleSocialMediaChange(
                    "google",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                YouTube URL
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter YouTube URL"
                style={{ fontSize: "10px" }}
                value={formData.moreAboutCompany.socialLinks.youtube}
                onChange={(e) =>
                  handleSocialMediaChange(
                    "youtube",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Twitter URL
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter Twitter URL"
                style={{ fontSize: "10px" }}
                value={formData.moreAboutCompany.socialLinks.twitter}
                onChange={(e) =>
                  handleSocialMediaChange(
                    "twitter",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Instagram URL
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter Instagram URL"
                style={{ fontSize: "10px" }}
                value={formData.moreAboutCompany.socialLinks.instagram}
                onChange={(e) =>
                  handleSocialMediaChange(
                    "instagram",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Pinterest URL
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter Pinterest URL"
                style={{ fontSize: "10px" }}
                value={formData.moreAboutCompany.socialLinks.pinterest}
                onChange={(e) =>
                  handleSocialMediaChange(
                    "pinterest",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                Google Feedback URL
              </Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter Google Feedback URL"
                style={{ fontSize: "10px" }}
                value={formData.moreAboutCompany.socialLinks.googleFeedback}
                onChange={(e) =>
                  handleSocialMediaChange(
                    "googleFeedback",
                    e.target.value
                  )
                }
              />
            </Form.Group>
          </Col>

        </Row>


      </CardBody>

      <div className='mt-3 text-end'>
        <Button variant='success' size='sm'
          style={{ fontSize: "10px" }}
          onClick={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </Card>

  )
}