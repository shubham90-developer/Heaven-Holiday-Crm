"use client"
import React, { useState } from 'react'
import Filter from './Filter';
import { Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useGetGuidesQuery } from "../../../../../store/services/inventory/vehicle/guide/guideApi";

const ManageGuide = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<any>({});

  const { data, isLoading, isError } = useGetGuidesQuery(filters);

  return (
    <>
      <div className='mb-2'>
        <Filter onApply={setFilters} />
      </div>
      <Card className='p-3'>
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            {/* Left Section */}

            <div className="d-flex align-items-center gap-2">

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => router.push('/my-inventory/vehicles/')}
                style={{ fontSize: "10px", fontWeight: "bold" }}
              >
                Manage Transport
              </Button>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => router.push('/my-inventory/vehicles/manage-driver')}
                style={{ fontSize: "10px", fontWeight: "bold" }}
              >
                Manage Driver
              </Button>

              <Button
                variant="primary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
              >
                Manage Guide
              </Button>
            </div>

            {/* right side */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-danger"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={() => router.push("/my-inventory/vehicles/manage-guide/add-guide")}
              >
                <Icon icon="mdi:plus" className="me-1" />
                Add Guide
              </Button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "60px" }}>S.No</th>
                <th style={{ width: "150px" }}>Guide Name</th>
                <th style={{ width: "150px" }}>Destination</th>
                <th style={{ width: "200px" }}>Email</th>
                <th style={{ width: "150px" }}>Mobile No</th>
                <th style={{ width: "120px" }}>Status</th>
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="text-center text-danger">
                    Failed to load guides
                  </td>
                </tr>
              ) : data?.data?.length > 0 ? (
                data.data.map((guide: any, index: number) => (
                  <tr key={guide._id} style={{ fontSize: "12px" }}>
                    <td>{index + 1}</td>
                    <td>{guide.guideName}</td>
                    <td>{guide.destination}</td>
                    <td>{guide.email || "-"}</td>
                    <td>{guide.mobileNumber}</td>
                    <td>{guide.status || "Active"}</td>
                    <td>
                      {/* <Button size="sm" variant="outline-primary">
                        Edit
                      </Button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default ManageGuide
