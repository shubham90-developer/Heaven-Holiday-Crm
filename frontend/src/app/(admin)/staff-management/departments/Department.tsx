"use client";
import React, { useState } from 'react'

import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import { useGetDepartmentsQuery } from "../../../../store/services/staff-management/department/departmentApi";

const Department = () => {
  const router = useRouter()
  const { data, isLoading, isError } = useGetDepartmentsQuery(null);
  return (
    <>
      <Card className='p-3'>
        <div className='text-end border-bottom mb-2'>
          <div className='mb-2'>
            <Button variant="outline-primary"
              onClick={() => { router.push('./departments/add-department') }}
              size="sm"
              style={{ fontSize: "12px", fontWeight: "bold" }}>
              <Icon icon="mdi:plus" className='me-1' />  Add Department
            </Button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-sm table-bordered mb-0 align-middle" style={{ tableLayout: "fixed", width: "100%" }}>
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th>Department Name</th>
                <th>Is Operations</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "12px" }}>
              {/* Loading */}
              {isLoading && (
                <tr>
                  <td colSpan={4} className="text-center">
                    Loading...
                  </td>
                </tr>
              )}

              {/* Error */}
              {isError && (
                <tr>
                  <td colSpan={4} className="text-center text-danger">
                    Failed to load departments
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!isLoading && data?.data?.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    No departments found
                  </td>
                </tr>
              )}

              {/* Data */}
              {!isLoading &&
                data?.data?.map((dept: any) => (
                  <tr key={dept._id}>
                    <td>{dept.name}</td>

                    <td className="text-center">
                      <Form.Check
                        checked={dept.isOperations}
                        disabled
                      />
                    </td>

                    <td>
                      {dept.isActive ? (
                        <span className="text-success">Active</span>
                      ) : (
                        <span className="text-danger">Deactive</span>
                      )}
                    </td>

                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `./departments/edit-department/${dept._id}`
                          )
                        }
                      >
                        <Icon icon="mdi:edit" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>

          </table>
        </div>
      </Card>
    </>
  )
}

export default Department
