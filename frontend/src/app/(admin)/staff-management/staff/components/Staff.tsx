"use client";
import React, { useState } from 'react'
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from 'next/navigation'
import { useRouter } from "next/navigation";
import FormatStaff from './FormatStaff';
import { useGetStaffQuery } from "../../../../../store/services/staff-management/staff/staffApi";

const Staff = () => {
  const router = useRouter()
  const [stafftype, setStaffType] = useState('Current Staff')
  const { data, isLoading, error } = useGetStaffQuery({});

  return (
    <>
      <Card className='p-3'>
        <div className='d-flex justify-content-between mb-2 border-bottom pb-2'>
          <div className='d-flex gap-1'>
            <Button
              variant={stafftype === 'Current Staff' ? "primary" : "outline-primary"}
              onClick={() => setStaffType('Current Staff')}
              size="sm"
              style={{ fontSize: "12px", fontWeight: "600" }}>
              Current Staff
            </Button>
            <Button
              variant={stafftype === 'Format Staff' ? "primary" : "outline-primary"}
              onClick={() => setStaffType('Format Staff')}
              size="sm"
              style={{ fontSize: "12px", fontWeight: "600" }}>
              Format Staff
            </Button>
          </div>
          <Button variant="outline-primary"
            onClick={() => { router.push('./staff/add-staff') }}
            size="sm"
            style={{ fontSize: "12px", fontWeight: "600" }}>
            <Icon icon="mdi:plus" className='me-1' />  Add Staff
          </Button>
        </div>

        {stafftype === 'Current Staff' && (
          <div className="table-responsive mt-2">
            <table className="table table-sm table-bordered mb-0 align-middle" style={{ tableLayout: "fixed", width: "100%" }}>
              <thead>
                <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                  <th style={{ width: "200px" }}>Staff Details</th>
                  <th>Role</th>
                  <th>Report To</th>
                  <th>Department</th>
                  <th>WA / WA Admin</th>
                  <th>Secure Login</th>
                  <th>API Booking</th>
                  <th>Masking</th>
                  <th>Finance</th>
                  <th>Archived</th>
                  <th style={{ width: "150px" }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "12px" }}>
                {isLoading && (
                  <tr>
                    <td colSpan={11} className="text-center">Loading...</td>
                  </tr>
                )}

                {error && (
                  <tr>
                    <td colSpan={11} className="text-center text-danger">Error loading staff</td>
                  </tr>
                )}

                {data?.data?.map((staff: any) => (
                  <tr key={staff._id}>
                    {/* Staff Details */}
                    <td>
                      <div>
                        <Icon icon="mdi:account" className='me-1' />
                        {staff.firstName} {staff.lastName}
                      </div>
                      <div>
                        <Icon icon="mdi:email" className='me-1' />
                        {staff.email}
                      </div>
                      <div>
                        <Icon icon="mdi:phone" className='me-1' />
                        {staff.phone}
                      </div>
                    </td>

                    {/* Role */}
                    <td>{staff.role?.name || "-"}</td>

                    {/* IMPORTANT FIX HERE */}
                    <td>
                      {typeof staff.reportingManager === "object"
                        ? staff.reportingManager?.name
                        : staff.reportingManager}
                    </td>

                    {/* Department */}
                    <td>{staff.department?.name || "-"}</td>

                    {/* WA / WA Admin */}
                    <td>No</td>

                    {/* Permissions (example mapping) */}
                    <td>
                      <Form.Check checked={staff.permissions?.includes("secureLogin")} readOnly />
                    </td>

                    <td>
                      <Form.Check checked={staff.permissions?.includes("apiBooking")} readOnly />
                    </td>

                    <td>
                      <Form.Check checked={staff.permissions?.includes("masking")} readOnly />
                    </td>

                    <td>
                      <Form.Check checked={staff.permissions?.includes("finance")} readOnly />
                    </td>

                    {/* Archived */}
                    <td>
                      <Form.Check checked={!staff.isActive} readOnly />
                    </td>

                    {/* Actions */}
                    <td>
                      <div className='d-flex gap-1'>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => router.push(`./staff/view-staff/${staff._id}`)}
                        >
                          <Icon icon="mdi:eye" />
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => router.push(`./staff/edit-staff/${staff._id}`)}
                        >
                          <Icon icon="mdi:edit" />
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                        >
                          <Icon icon="mdi:account-off-outline" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {data?.data?.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={11} className="text-center">No staff found</td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}

        {stafftype === 'Format Staff' && (
          <FormatStaff />
        )}
      </Card>
    </>
  )
}

export default Staff
