"use client";
import React from 'react'
import { useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import PermissionControl from './PermissionControl';
import { useCreateStaffMutation } from "../../../../../../store/services/staff-management/staff/staffApi";
import { useGetRolesQuery } from "../../../../../../store/services/staff-management/role/roleApi";
import { useGetDepartmentsQuery } from "../../../../../../store/services/staff-management/department/departmentApi";
import toast from "react-hot-toast";

const AddStaff = () => {
  const [step, setStep] = useState(1)
  const [selfsender, setSelfSender] = useState(false)
  const { data: rolesData, isLoading: rolesLoading } = useGetRolesQuery({});
  const { data: deptData, isLoading: deptLoading } = useGetDepartmentsQuery({});
  const defaultSignature = `Kind Regards,

Pallavi Laskeshri
sales
m: 91 7218213200
pallavi.aheaven@gmail.com
Rate our Services

B-11, 1st Floor, Prabhakar Plaza, Station Road`;
  const [signatureType, setSignatureType] = useState("default");
  const [signature, setSignature] = useState(defaultSignature);
  const router = useRouter()

  const [createStaff, { isLoading }] = useCreateStaffMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    reportingManager: "",
    isSelfSender: false,
    senderEmail: "",
    permissions: [],
    address: {
      country: "",
      city: "",
      postalCode: "",
      fullAddress: "",
    },
    signatureType: "default",
    signature: defaultSignature,
  });

  //   const defaultSignature = `Kind Regards,

  // Pallavi Laskeshri
  // sales
  // m: 91 7218213200
  // pallavi.aheaven@gmail.com
  // Rate our Services

  // B-11, 1st Floor, Prabhakar Plaza, Station Road`;
  //   const [signatureType, setSignatureType] = useState("default");
  //   const [signature, setSignature] = useState(defaultSignature);

  // const handleChange = (type: string) => {
  //   setSignatureType(type);

  //   if (type === "default") {
  //     setSignature(defaultSignature);
  //   } else {
  //     setSignature(" ");
  //   }
  // }
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {

    if (!formData.firstName.trim()) return toast.error("First Name is required");
    if (!formData.lastName.trim()) return toast.error("Last Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.phone.trim()) return toast.error("Mobile Number is required");
    if (!formData.role) return toast.error("Please select a Role");
    if (!formData.department) return toast.error("Please select a Department");
    if (!formData.isSelfSender && !formData.senderEmail)
      return toast.error("Please select a Sender Email ID");

    // Step 3 validations
    if (!formData.address.country.trim()) return toast.error("Country is required");
    if (!formData.address.city.trim()) return toast.error("City is required");
    if (!formData.address.postalCode.trim()) return toast.error("Postal Code is required");
    if (!formData.address.fullAddress.trim()) return toast.error("Full Address is required");

    try {
      const payload = {
        ...formData,
        senderEmail: formData.isSelfSender
          ? formData.email
          : formData.senderEmail,
      };

      console.log("PAYLOAD:", payload);
      await createStaff(payload).unwrap();

      toast.success("Staff created successfully ✅");
      router.push("/staff-management/staff");

    } catch (err: any) {
      toast.error(err?.data?.message || "Error creating staff");
    }
  };

  return (
    <>
      <Card className='p-3'>
        <CardHeader className='border-bottom'>
          <div className='d-flex gap-2 mb-0'>
            {[1, 2, 3].map((item) => (
              <Button
                key={item}
                size='sm'
                style={{ fontSize: "10px" }}
                variant={step === item ? "primary" : "outline-primary"}
                onClick={() => setStep(item)}
              >
                {item === 1 && "1 User Login"}
                {item === 2 && "2 Permission Control"}
                {item === 3 && "3 Address & Signature"}
              </Button>
            ))}
          </div>
        </CardHeader>


        <CardBody>
          {step === 1 && (
            <Form>
              <b>User Login & Role</b>
              <Row className="mb-2 mt-2">
                {/* First Name */}
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    First Name *
                  </Form.Label>
                  <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)} />
                </Col>

                {/* Last Name */}
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Last Name *
                  </Form.Label>
                  <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)} />
                </Col>

                {/* Email */}
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Email Id *
                  </Form.Label>
                  <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)} />
                </Col>

                {/* Mobile Number */}
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Mobile Number *
                  </Form.Label>
                  <div className="d-flex">
                    <Form.Select size="sm" style={{ fontSize: "12px", maxWidth: "80px" }}>
                      <option>+91</option>
                    </Form.Select>
                    <Form.Control size="sm" style={{ fontSize: "12px" }} value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)} />
                  </div>
                </Col>
              </Row>

              <Row className="mb-2">
                {/* Role */}
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Select Role *
                  </Form.Label>
                  <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}>
                    <option value="">Select Role</option>
                    {rolesLoading ? (
                      <option>Loading...</option>
                    ) : (
                      rolesData?.data?.map((role: any) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))
                    )}
                  </Form.Select>
                </Col>

                {/* Department */}
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Select Department *
                  </Form.Label>
                  <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}>
                    <option value="">Select Department</option>
                    {deptLoading ? (
                      <option>Loading...</option>
                    ) : (
                      deptData?.data?.map((dept: any) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))
                    )}
                  </Form.Select>
                </Col>

                {/* Sender ID Self */}
                <Col md={3} className="d-flex align-items-end">
                  <Form.Check
                    type="checkbox"
                    label="Sender Id Self"
                    style={{ fontSize: "12px" }}
                    checked={formData.isSelfSender}
                    onChange={(e) => handleChange("isSelfSender", e.target.checked)}
                  />
                </Col>

                {/* Sender Email ID */}

                {!formData.isSelfSender && (
                  <Col md={3}>
                    <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                      Sender Email ID
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.senderEmail}
                      onChange={(e) => handleChange("senderEmail", e.target.value)}>
                      <option value="">Select</option>
                    </Form.Select>
                  </Col>
                )}

                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    RM
                  </Form.Label>
                  <Form.Select size="sm" style={{ fontSize: "12px" }} value={formData.reportingManager}
                    onChange={(e) => handleChange("reportingManager", e.target.value)}>
                    <option value="">Select RM</option>
                    <option value="Rajendra Bugade">RAJENDRA BUGADE</option>
                  </Form.Select>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  style={{ fontSize: "10px" }}
                  onClick={() => router.push('./')}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  style={{ fontSize: "10px" }}
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </div>
            </Form>
          )}

          {step === 2 && (
            <PermissionControl onNext={(permissions: any) => {
              handleChange("permissions", permissions);
              setStep(3);
            }} />
          )}


          {step === 3 && (
            <Form>
              <b>Staff Address</b>

              <Row className="mb-2 mt-2">
                {/* Country */}
                <Col md={4}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Country *
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder="Enter Country"
                    style={{ fontSize: "12px" }}
                    value={formData.address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                  />
                </Col>

                {/* City */}
                <Col md={4}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    City *
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder="Enter City"
                    style={{ fontSize: "12px" }}
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                  />
                </Col>

                {/* Postal Code */}
                <Col md={4}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Postal Code *
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder="Enter Postal Code"
                    style={{ fontSize: "12px" }}
                    value={formData.address.postalCode}
                    onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                  />
                </Col>



                {/* Address */}
                <Col md={6}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Address *
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter Full Address"
                    style={{ fontSize: "12px", resize: "none" }}
                    value={formData.address.fullAddress}
                    onChange={(e) => handleAddressChange("fullAddress", e.target.value)}
                  />
                </Col>


                <Col md={6}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Upload Photograph (100px × 100px)
                  </Form.Label>

                  <div className="d-flex">
                    <Form.Control
                      type="file"
                      size="sm"
                      style={{ fontSize: "12px" }}
                      onChange={(e: any) =>
                        handleChange("profileImage", e.target.files[0])
                      }
                    />
                  </div>
                </Col>
              </Row>

              <b className="mt-3">Staff Signature</b>
              <div className="d-flex gap-3 mb-2">
                <Form.Check
                  type="radio"
                  label="Custom"
                  checked={formData.signatureType === "custom"}
                  onChange={() => handleChange("signatureType", "custom")}
                  style={{ fontSize: "12px" }}
                />

                <Form.Check
                  type="radio"
                  label="Default"
                  checked={formData.signatureType === "default"}
                  onChange={() => {
                    handleChange("signatureType", "default");
                    handleChange("signature", defaultSignature);
                  }}
                  style={{ fontSize: "12px" }}
                />
              </div>

              <Form.Control
                as="textarea"
                rows={8}
                value={formData.signature}
                onChange={(e) => handleChange("signature", e.target.value)}
                style={{ fontSize: "12px" }}
              />


              <div className="d-flex justify-content-end gap-2 mt-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => router.push('./')}
                  style={{ fontSize: "10px" }}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  style={{ fontSize: "10px" }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Finish"}
                </Button>
              </div>
            </Form>
          )}


        </CardBody>


      </Card>
    </>
  )
}

export default AddStaff
