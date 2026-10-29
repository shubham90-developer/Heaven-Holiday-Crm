"use client";
import React from 'react'
import { useState, useEffect } from "react";
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
import { useRouter, useParams } from "next/navigation";
import PermissionControl from './PermissionControl';
import {
  useGetStaffByIdQuery,
  useUpdateStaffMutation
} from "../../../../../../store/services/staff-management/staff/staffApi";
import { useGetRolesQuery } from "../../../../../../store/services/staff-management/role/roleApi";
import { useGetDepartmentsQuery } from "../../../../../../store/services/staff-management/department/departmentApi";
import toast from "react-hot-toast";

const EditStaff = () => {
  const [step, setStep] = useState(1)
  const [selfsender, setSelfSender] = useState(false)
  const router = useRouter()
  const { id } = useParams();

  const { data, isLoading: isFetching } = useGetStaffByIdQuery(id);
  const [updateStaff, { isLoading }] = useUpdateStaffMutation();
  const { data: roleData } = useGetRolesQuery(null);
  const { data: deptData } = useGetDepartmentsQuery(null);

  const defaultSignature = `Kind Regards,

Pallavi Laskeshri
sales
m: 91 7218213200
pallavi.aheaven@gmail.com
Rate our Services

B-11, 1st Floor, Prabhakar Plaza, Station Road`;

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
    permissions: {} as Record<string, boolean>,
    address: {
      country: "",
      city: "",
      postalCode: "",
      fullAddress: "",
    },
    signatureType: "default",
    signature: defaultSignature,
  });

  useEffect(() => {
    if (!data?.data) return;

    const staff = data.data;
    const permissionObject: Record<string, boolean> = {};

    if (Array.isArray(staff.permissions)) {
      staff.permissions.forEach((perm: string) => {
        permissionObject[perm] = true;

        const parent = perm.split(".")[0];
        permissionObject[parent] = true;
      });
    }

    setFormData((prev) => ({
      ...prev,
      firstName: staff.firstName || "",
      lastName: staff.lastName || "",
      email: staff.email || "",
      phone: staff.phone || "",
      role: typeof staff.role === "object" ? staff.role?._id : staff.role || "",
      department:
        typeof staff.department === "object"
          ? staff.department?._id
          : staff.department || "",
      reportingManager:
        typeof staff.reportingManager === "object"
          ? staff.reportingManager?._id
          : staff.reportingManager || "",
      isSelfSender: staff.isSelfSender || false,
      senderEmail: staff.senderEmail || "",
      permissions: permissionObject,
      address: {
        country: staff.address?.country || "",
        city: staff.address?.city || "",
        postalCode: staff.address?.postalCode || "",
        fullAddress: staff.address?.fullAddress || "",
      },
      signatureType: staff.signatureType || "default",
      signature: staff.signature || defaultSignature,
    }));
  }, [data]);

  // HANDLE CHANGE
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignatureChange = (type: "default" | "custom") => {
    setFormData((prev) => ({
      ...prev,
      signatureType: type,
      signature: type === "default" ? defaultSignature : "",
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

  // SUBMIT
  const handleUpdate = async () => {
    try {
      const permissionArray = Object.keys(formData.permissions).filter(
        (key) => formData.permissions[key] && key.includes(".")
      );

      const payload = {
        ...formData,
        permissions: permissionArray,
        senderEmail: formData.isSelfSender
          ? formData.email
          : formData.senderEmail,
      };

      await updateStaff({ id, body: payload }).unwrap();

      toast.success("Updated successfully ✅");
      router.push("/staff-management/staff");
    } catch {
      toast.error("Update failed ❌");
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
                  <Form.Control size="sm" style={{ fontSize: "12px" }}
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </Col>

                {/* Last Name */}
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Last Name *
                  </Form.Label>
                  <Form.Control size="sm" style={{ fontSize: "12px" }}
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </Col>

                {/* Email */}
                <Col md={3}>
                  <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                    Email Id *
                  </Form.Label>
                  <Form.Control size="sm" style={{ fontSize: "12px" }}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
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
                    {roleData?.data?.map((role: any) => (
                      <option key={role._id} value={role._id}>
                        {role.name}
                      </option>
                    ))}
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
                    {deptData?.data?.map((dept: any) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                {/* Sender ID Self */}
                <Col md={3} className="d-flex align-items-end">
                  <Form.Check
                    type="checkbox"
                    checked={selfsender}
                    label="Sender Id Self"
                    style={{ fontSize: "12px" }}
                    onChange={(e) => setSelfSender(e.target.checked)}
                  />
                </Col>

                {/* Sender Email ID */}

                {!selfsender && (
                  <Col md={3}>
                    <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                      Sender Email ID
                    </Form.Label>
                    <Form.Select size="sm" style={{ fontSize: "12px" }}>
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
            <PermissionControl
              permissions={formData.permissions}
              setPermissions={(perms) =>
                setFormData((prev) => ({ ...prev, permissions: perms }))
              }
              onNext={() => setStep(3)}
            />
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
                  onChange={() => handleSignatureChange("custom")}
                  style={{ fontSize: "12px" }}
                />

                <Form.Check
                  type="radio"
                  label="Default"
                  checked={formData.signatureType === "default"}
                  onChange={() => handleSignatureChange("default")}
                  style={{ fontSize: "12px" }}
                />
              </div>

              <Form.Control
                as="textarea"
                rows={8}
                value={formData.signature}
                disabled={formData.signatureType === "default"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    signature: e.target.value,
                  }))
                }
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
                  onClick={handleUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Finish"}
                </Button>
              </div>
            </Form>
          )}


        </CardBody>


      </Card>
    </>
  )
}

export default EditStaff
