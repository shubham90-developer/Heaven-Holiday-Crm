"use client";
import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import Filter from './Filter';
import { useRouter } from 'next/navigation';
import { useGetAreasQuery, useDeleteAreaMutation } from "../../../../store/services/inventory/area-master/areaMasterApi";
import toast from "react-hot-toast";

const AreaMaster = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    city: "",
    area: "",
  });

  const { data, isLoading, isError } =
    useGetAreasQuery(filters);

  const [deleteArea, { isLoading: deletingArea }] = useDeleteAreaMutation();

  const areas = data?.data || [];

  if (isLoading) {
    return <p className="p-3">Loading areas...</p>;
  }

  if (isError) {
    return (
      <p className="p-3 text-danger">
        Failed to load areas
      </p>
    );
  }

  return (
    <>
      <div className='mb-2'>
        <Filter filters={filters}
          setFilters={setFilters} />
      </div>
      <Card className='p-3'>
        <div className='text-end mb-3'>
          <Button variant='primary' size='sm'
            onClick={() => router.push('/my-inventory/area-master/add-area')}
            style={{ fontSize: "10px" }} ><Icon icon="mdi:plus" className='me-1' />Add Area Master</Button>
        </div>
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "50px" }}>S.No</th>
                <th style={{ width: "150px" }}>City</th>
                <th style={{ width: "150px" }}>Area</th>
                <th style={{ width: "100px" }}>Status</th>
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {areas.length > 0 ? (
                areas.map((item: any, index: number) => (
                  <tr key={item._id} style={{ fontSize: "10px" }}>
                    <td>{index + 1}</td>
                    <td>{item.city}</td>
                    <td>{item.area}</td>
                    <td>
                      <span
                        className={
                          item.status === "Active"
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <Button size="sm" variant="outline-primary" style={{ fontSize: "10px" }}>
                        Edit
                      </Button>{" "}
                      <Button size="sm" variant="outline-danger" style={{ fontSize: "10px" }}
                        onClick={() => {
                          toast((t) => (
                            <div>
                              <p className="mb-2" style={{ fontSize: "13px" }}>
                                Are you sure you want to delete this area?
                              </p>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={async () => {
                                    toast.dismiss(t.id);
                                    try {
                                      await deleteArea(item._id).unwrap();
                                      toast.success("Area deleted successfully");
                                    } catch (err) {
                                      toast.error("Failed to delete area");
                                    }
                                  }}
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => toast.dismiss(t.id)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ), { duration: Infinity });
                        }}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No areas found
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

export default AreaMaster
