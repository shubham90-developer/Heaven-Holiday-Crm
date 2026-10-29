"use client";
import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Form, Row, Col, Table, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter, useParams } from 'next/navigation';
import { useGetStaffByIdQuery } from "../../../../../../store/services/staff-management/staff/staffApi";

const ViewStaff = () => {
  const router = useRouter()
  const { id } = useParams();

  const { data, isLoading, error } = useGetStaffByIdQuery(id);
  const staff = data?.data;

  if (isLoading) return <div className="p-3">Loading...</div>;
  if (error) return <div className="p-3 text-danger">Error loading staff</div>;

  return (
    <>
      <div style={{ padding: "15px", background: "#f5f6f8", fontSize: "12px" }}>

        {/* User Login & Role */}
        <Card className="mb-3">
          <CardHeader className="d-flex justify-content-between border-bottom  p-2 ">
            <b>User Login & Role</b>
            <Button size="sm" variant='danger'
              onClick={() => router.push(`../edit-staff/${id}`)}>
              <Icon icon="mdi:edit" className='me-1' /> Edit Info
            </Button>
          </CardHeader>

          <CardBody>
            <Table bordered size="sm" className="mb-0">
              <tbody>
                <tr>
                  <td style={{ width: "200px", fontWeight: '600' }}>Name</td>
                  <td>{staff.firstName} {staff.lastName}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>Email Id</td>
                  <td>{staff.email}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>Role</td>
                  <td>{staff.role?.name || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>Department</td>
                  <td>{staff.department?.name || "-"}</td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>

        {/* More Information */}
        <Card>
          <CardHeader className="p-2 border-bottom">
            <b>More Information</b>
          </CardHeader>

          <CardBody>
            <Table bordered size="sm" className="mb-0">
              <tbody>
                <tr>
                  <td style={{ width: "200px", fontWeight: "600" }}>Office Phone</td>
                  <td>{staff.officePhone || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>Mobile Phone</td>
                  <td>{staff.phone}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>Home Phone</td>
                  <td>{staff.homePhone || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>Fax</td>
                  <td>{staff.fax}</td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="p-2 border-bottom">
            <b>Staff Address</b>
          </CardHeader>

          <CardBody>
            <Table bordered size="sm" className="mb-0">
              <tbody>
                <tr>
                  <td style={{ width: "200px", fontWeight: "600" }}>Country</td>
                  <td>{staff.address?.country || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>City</td>
                  <td>{staff.address?.city}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>Postal Code</td>
                  <td>{staff.address?.postalCode || "-"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>Address</td>
                  <td>{staff.address?.fullAddress}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600" }}>Photograph</td>
                  <td>{staff.profileImage}</td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="p-2 border-bottom">
            <b>Staff Signature</b>
          </CardHeader>

          <CardBody>
            <Table bordered size="sm" className="mb-0">
              <tbody>
                <tr>
                  <td className='p-3'></td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default ViewStaff
