"use client";

import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import Filter from "./Filter";
import { useGetSuppliersQuery, useDeleteSupplierMutation } from "@/store/services/supplierApi";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

const MySupplier = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetSuppliersQuery(null);
  // const [deleteSupplier] = useDeleteSupplierMutation();
  const [deleteSupplier, { isLoading: deletingSupplier }] = useDeleteSupplierMutation();

  if (isLoading) return <p>Loading suppliers...</p>;
  if (isError) return <p>Error fetching suppliers</p>;

  return (
    <>
      {/* filter */}
      <div className="mb-2">
        <Filter />
      </div>
      <Card className="p-3">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            {/* Left Section */}

            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={() => router.push("/crm/my-suppliers/upload-supplier")}
              >
                <Icon icon="mdi:upload" className="me-1" /> Upload Suppliers
              </Button>
            </div>

            {/* right side */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={() => router.push("/crm/my-suppliers/add-supplier")}
              >
                <Icon icon="mdi:account-plus-outline" className="me-1" /> Add
                Suppliers
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
              >
                <Icon icon="mdi:file-export" />
              </Button>
            </div>
          </div>
          <Row className="align-items-center">
            {/* Right Section */}
            <Col lg={8}>
              <h6 className="fw-bold">
                Total Record Found :- <span className="text-primary">{data?.data?.length || 0}</span>
              </h6>
            </Col>
            <Col lg={4}>
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
                style={{ fontSize: "10px" }}
              />
            </Col>
          </Row>
        </div>
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "40px" }}>
                  <Form.Check type="checkbox" />
                </th>

                <th style={{ width: "100px" }}>Agency Id</th>

                <th style={{ width: "260px" }}>Agency Details</th>

                <th style={{ width: "140px" }}>Lead Source</th>

                <th style={{ width: "110px" }}>RM</th>
                <th style={{ width: "110px" }}>Last Updated</th>

                <th style={{ width: "90px" }}>Status</th>

                <th style={{ width: "70px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {data?.data?.map((supplier: any) => (
                <tr key={supplier._id}>
                  <td>
                    <Form.Check />
                  </td>

                  <td>{supplier._id?.slice(-6)}</td>

                  <td>
                    <div className="fw-semibold">
                      <Icon icon="mdi:building" className="me-1" />
                      {supplier.companyName}
                    </div>

                    <div className="fw-semibold">
                      <Icon icon="mdi:account" className="me-1" />
                      {supplier.salutation} {supplier.firstName} {supplier.lastName}
                    </div>

                    <div>
                      <Icon icon="mdi:phone" className="me-1" />
                      {supplier.mobileNumber}
                    </div>

                    <div>
                      <Icon icon="mdi:email-outline" className="me-1" />
                      {supplier.email}
                    </div>
                  </td>

                  <td>{supplier.source || "N/A"}</td>

                  <td>{supplier.rm || "Admin"}</td>

                  <td>
                    {supplier.updatedAt
                      ? new Date(supplier.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    <span
                      className={`badge ${supplier.status === "Active" ? "bg-success" : "bg-secondary"
                        }`}
                    >
                      {supplier.status || "Inactive"}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex flex-column gap-1">
                      <Button
                        variant="info"
                        size="sm"
                        style={{ fontSize: "8px" }}
                        onClick={() =>
                          router.push(`/crm/my-suppliers/edit/${supplier._id}`)
                        }
                      >
                        <Icon icon="mdi:pencil-outline" />
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        style={{ fontSize: "8px" }}
                        disabled={deletingSupplier}
                        onClick={() => {
                          toast((t) => (
                            <div>
                              <p className="mb-2" style={{ fontSize: "13px" }}>
                                Are you sure you want to delete this supplier?
                              </p>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={async () => {
                                    toast.dismiss(t.id);
                                    try {
                                      await deleteSupplier(supplier._id).unwrap();
                                      toast.success("Supplier deleted successfully");
                                    } catch (err) {
                                      console.error("Delete failed:", err);
                                      toast.error("Failed to delete supplier");
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
                        }}
                      >
                        <Icon icon="mdi:trash-can-outline" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="primary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "600" }}
          >
            Load More <Icon icon="mdi:reload" className="ms-1" />
          </Button>
        </div>
      </Card>
    </>
  );
};

export default MySupplier;
