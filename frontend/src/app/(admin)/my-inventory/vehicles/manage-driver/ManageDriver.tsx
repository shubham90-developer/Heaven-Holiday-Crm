"use client";
import React, { useState } from 'react'
import { Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import Filter from './Filter'
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useGetDriversQuery } from "../../../../../store/services/inventory/vehicle/driver/driverApi";

const ManageDriver = () => {
  const router = useRouter();

  const [filters, setFilters] = useState({
    driverName: "",
    mobileNumber: "",
    email: "",
    country: "",
    city: "",
  });

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== "")
  );

  const { data, isLoading, error } = useGetDriversQuery(
    { ...cleanFilters }, // 🔥 force refetch
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <>
      <div className='mb-2'>
        <Filter onApply={handleFilter} />
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
                variant="primary"
                size="sm"
                onClick={() => router.push('/my-inventory/vehicles/manage-driver')}
                style={{ fontSize: "10px", fontWeight: "bold" }}
              >
                Manage Driver
              </Button>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => router.push('/my-inventory/vehicles/manage-guide')}
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
                onClick={() => router.push("/my-inventory/vehicles/manage-driver/add-driver")}
              >
                <Icon icon="mdi:plus" className="me-1" />
                Add Driver Master
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
                <th style={{ width: "150px" }}>Driver Name</th>
                <th style={{ width: "150px" }}>Mobile No</th>
                <th style={{ width: "200px" }}>E-mail</th>
                <th style={{ width: "150px" }}>Country</th>
                <th style={{ width: "150px" }}>City</th>
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length > 0 ? (
                data.data.map((driver: any, index: number) => (
                  <tr key={driver._id} style={{ fontSize: "12px" }}>
                    <td>{index + 1}</td>
                    <td>{driver.driverName}</td>
                    <td>{driver.mobileNumber}</td>
                    <td>{driver.email || "-"}</td>
                    <td>{driver.country}</td>
                    <td>{driver.city}</td>
                    {/* <td>
                      <Button size="sm" variant="outline-primary">
                        View
                      </Button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No drivers found
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

export default ManageDriver
