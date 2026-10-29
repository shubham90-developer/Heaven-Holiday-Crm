"use client";
import React, { useState } from 'react'
import { Button, Form, Row, Col, Card, Table, CardHeader, CardBody } from "react-bootstrap";
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';
import logo from "@/assets/images/logo.png";
import AddBankDetail from './components/AddBankDetail';
import { useRouter } from 'next/navigation';
import {
  useGetCompanyProfileQuery
} from "../../../../store/services/settings/company-profile/companyProfileApi";
import {
  useGetBankDetailsQuery,
  useDeleteBankDetailMutation
} from "../../../../store/services/settings/company-profile/bankDetailsApi";

const CompanyProfile = () => {
  const [bankdetail, setBankDetail] = useState(false)
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const router = useRouter()

  const {
    data: companyProfileData,
    isLoading
  } = useGetCompanyProfileQuery(undefined);

  const {
    data: bankDetailsData,
    isLoading: bankLoading
  } = useGetBankDetailsQuery(undefined);

  const [
    deleteBankDetail,
    { isLoading: deleteLoading }
  ] = useDeleteBankDetailMutation();

  const profile = companyProfileData?.data;
  const bankDetails = bankDetailsData?.data || [];
  console.log(bankDetails);

  console.log(profile);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDeleteBankDetail = async (
    id: string
  ) => {

    try {

      await deleteBankDetail(id).unwrap();

      console.log("Bank detail deleted successfully");

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <>
      <Card className="p-3">
        <Card className='shadow-sm'>
          <CardHeader className='px-3 py-2 bg-light d-flex justify-content-between align-items-center'>
            <h6 style={{ fontSize: "12px" }}>General Information</h6>
            <Button
              size="sm"
              variant="danger"
              onClick={() => router.push('/settings/company-profile/edit-info')}
              style={{ fontSize: "12px" }}
            >
              <Icon icon="mdi:edit" className='me-1' />Edit Info
            </Button>
          </CardHeader>
          <CardBody className="">
            <Row className='g-2'>
              <Col md={6}>
                <div className="table-responsive">
                  <table
                    className="table table-sm table-bordered mb-0 align-middle"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <tbody style={{ fontSize: "10px" }}>
                      <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                        <td><b>Company Name :</b></td>
                        <td>{profile?.companyDetails?.companyName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><b>Company Display Name</b></td>
                        <td>{profile?.companyDetails?.companyDisplayName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><b>Contact Person</b></td>
                        <td> {profile?.personalDetails?.firstName}{" "}
                          {profile?.personalDetails?.lastName}</td>
                      </tr>
                      <tr>
                        <td><b>Mobile Number</b></td>
                        <td>{profile?.personalDetails?.mobileNumber || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><b>Landline Number</b></td>
                        <td>8602410707</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>

              <Col md={6}>
                <div className="table-responsive">
                  <table
                    className="table table-sm table-bordered mb-0 align-middle"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <tbody style={{ fontSize: "10px" }}>
                      <tr style={{ whiteSpace: "nowrap" }}>

                        <td><b>Email</b></td>
                        <td>{profile?.personalDetails?.email || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><b>Website</b></td>
                        <td>
                          <a href="https://www.aheavenholiday.in/" target="_blank">
                            https://www.aheavenholiday.in/
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td><b>Registered Address</b></td>
                        <td> {profile?.companyDetails?.registeredAddress?.addressLine1},{" "}
                          {profile?.companyDetails?.registeredAddress?.addressLine2},{" "}
                          {profile?.companyDetails?.registeredAddress?.city},{" "}
                          {profile?.companyDetails?.registeredAddress?.country} -{" "}
                          {profile?.companyDetails?.registeredAddress?.pinCode}</td>
                      </tr>
                      <tr>
                        <td><b>About Company</b></td>
                        <td>{profile?.moreAboutCompany?.aboutCompany || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><b>Company Logo</b></td>
                        <td>
                          {profile?.companyDetails?.companyLogo ? (
                            <img
                              src={profile.companyDetails.companyLogo}
                              width={50}
                              height={50}
                              alt="company logo"
                              style={{ objectFit: "contain" }}
                            />
                          ) : (
                            <Image src={logo} width={50} height={50} alt="company logo" />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='px-3 py-2 bg-light d-flex justify-content-between align-items-center'>
            <h6 style={{ fontSize: "12px" }}>Owner's Detail</h6>
          </CardHeader>
          <CardBody className="">
            <Row className='g-2'>
              <Col md={6}>
                <div className="table-responsive">
                  <table
                    className="table table-sm table-bordered mb-0 align-middle"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <tbody style={{ fontSize: "10px" }}>
                      <tr>
                        <td><b>Full Name</b></td>
                        <td> {profile?.personalDetails?.firstName || "N/A"}{" "}
                          {profile?.personalDetails?.lastName || ""}</td>
                      </tr>
                      <tr>
                        <td><b>Contact No</b></td>
                        <td>{profile?.companyDetails?.companyNumber || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><b>Mobile Number</b></td>
                        <td>{profile?.personalDetails?.mobileNumber || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><b>Email Id</b></td>
                        <td>{profile?.personalDetails?.email || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>

              <Col md={6}>
                <div className="table-responsive">
                  <table
                    className="table table-sm table-bordered mb-0 align-middle"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <tbody style={{ fontSize: "10px" }}>
                      <tr>
                        <td><b>Designation</b></td>
                        <td>{profile?.personalDetails?.designation || "N/A"}</td>
                      </tr>
                      <tr>
                        <td><b>Role</b></td>
                        <td>{profile?.role || "Owner"}</td>
                      </tr>
                      <tr>
                        <td><b>GSTIN Number</b></td>
                        <td>{profile?.companyDetails?.gstNumber || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='px-3 py-2 bg-light d-flex justify-content-between align-items-center'>
            <h6 style={{ fontSize: "12px" }}>Bank's Detail</h6>
            <Button
              size="sm"
              variant="danger"
              onClick={() => { setSelectedBank(null); setBankDetail(true); }}
              style={{ fontSize: "12px" }}
            >
              Add
            </Button>
          </CardHeader>
          <CardBody className="">
            <Row className='g-2'>
              <Col md={12}>
                <div className="table-responsive">
                  <table
                    className="table table-sm table-bordered mb-0 align-middle"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <thead style={{ fontSize: "10px" }}>
                      <tr>
                        <th>Account Name</th>
                        <th>Account No</th>
                        <th>IFSC / Sort Code</th>
                        <th>Account Type</th>
                        <th>Bank Name</th>
                        <th>Branch</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "10px" }}>
                      {bankDetails.length > 0 ? (
                        bankDetails.map((bank: any) => (
                          <tr
                            key={bank._id}
                            style={{ fontSize: "10px", whiteSpace: "nowrap" }}
                          >
                            <td>{bank.accountHolderName}</td>
                            <td>{bank.accountNumber}</td>
                            <td>{bank.ifscCode}</td>
                            <td>{bank.accountType}</td>
                            <td>{bank.bankName}</td>
                            <td>
                              {bank.branch}, {bank.country}
                            </td>

                            <td>
                              <div className='d-flex gap-1'>

                                {/* EDIT */}
                                <span className='action-button delete'>
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    title='edit'
                                    onClick={() => { setSelectedBank(bank); setBankDetail(true); }}
                                    style={{ fontSize: "12px" }}
                                  >
                                    <Icon icon="mdi:edit" />
                                  </Button>
                                </span>

                                {/* DELETE */}
                                <span className='action-button delete'>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    title='delete'
                                    style={{ fontSize: "12px" }}
                                    onClick={() =>
                                      handleDeleteBankDetail(bank._id)
                                    }
                                  >
                                    <Icon icon="mdi:delete" />
                                  </Button>
                                </span>

                                {/* ACTIVE */}
                                <span className='action-button delete'>
                                  <Button
                                    size="sm"
                                    variant={
                                      bank.isActive ? "success" : "secondary"
                                    }
                                    title='active'
                                    style={{ fontSize: "12px" }}
                                  >
                                    <Icon icon="mdi:check" />
                                  </Button>
                                </span>

                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center">
                            No bank details found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Col>

            </Row>
          </CardBody>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader className='px-3 py-2 bg-light d-flex justify-content-between align-items-center'>
            <h6 style={{ fontSize: "12px" }}>More Information</h6>
          </CardHeader>
          <CardBody className="">
            <Row className='g-2'>
              <Col md={6}>
                <div className="table-responsive">
                  <table
                    className="table table-sm table-bordered mb-0 align-middle"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <tbody style={{ fontSize: "10px" }}>
                      <tr>
                        <td><b>Sender Email ID</b></td>
                        <td>{profile?.personalDetails?.email || "N/A"}</td>
                      </tr>


                    </tbody>
                  </table>
                </div>
              </Col>

              <Col md={6}>
                <div className="table-responsive">
                  <table
                    className="table table-sm table-bordered mb-0 align-middle"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <tbody style={{ fontSize: "10px" }}>
                      <tr>
                        <td><b>Nature Of Business</b></td>
                        <td>B2C {" "} B2B</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>

            </Row>
          </CardBody>
        </Card>

        {bankdetail && (
          <AddBankDetail
            bankData={selectedBank}
            onClose={() => { setBankDetail(false); setSelectedBank(null); }}
          />
        )}

      </Card>
    </>
  )
}

export default CompanyProfile
