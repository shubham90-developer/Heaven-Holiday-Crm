"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import Filter from "./Filter";
import SupplierModal from "./SupplierModal";
import { useGetAllPackagesQuery, useDeletePackageMutation } from "../../../../../store/services/inventory/package/packageApi";
import toast from "react-hot-toast";

const Packages = () => {
  const router = useRouter();
  const { data, isLoading, error } = useGetAllPackagesQuery({});
  const packages = data?.data || [];

  console.log("Packages API Data:", data);
  console.log("Packages:", packages);

  const [deletePackage, { isLoading: deletingPackage }] = useDeletePackageMutation();

  return (
    <>
      {/* filter */}
      <div className="mb-2">
        <Filter />
      </div>
      <Card className="p-3">
        {/* right side */}
        <div className="d-flex align-items-center  justify-content-end">
          <Button
            variant="outline-secondary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => router.push("/my-inventory/packages/add-package")}
          >
            <Icon icon="mdi:plus" /> Add Readymade Package
          </Button>
        </div>
        <Tabs
          defaultActiveKey="profile"
          id="fill-tab-example"
          className="mb-3"
          variant="pills"
          style={{ fontSize: "10px" }}
        >
          {/* <Tab eventKey="home" title="Delete">
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
                    <th style={{ width: "110px" }}>Pkg No.</th>

                    <th style={{ width: "250px" }}>Package Name</th>

                    <th style={{ width: "110px" }}> Cities</th>

                    <th style={{ width: "110px" }}>Supplier Name</th>
                    <th style={{ width: "250px" }}>Created By</th>

                    <th style={{ width: "110px" }}>Days</th>

                    <th style={{ width: "110px" }} className="text-center">
                      Type
                    </th>
                    <th style={{ width: "110px" }} className="text-center">
                      Price PP
                    </th>
                    <th style={{ width: "100px" }} className="text-center">
                      Expiry Date
                    </th>
                    <th style={{ width: "110px" }} className="text-center">
                      Status
                    </th>

                    <th style={{ width: "50px" }} className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody style={{ fontSize: "12px" }}>
                  <tr>
                    <td>
                      <Form.Check />
                    </td>
                    <td>113893</td>
                    <td>FD - Itinerary - Goa</td>
                    <td>Goa</td>
                    <td>
                      <SupplierModal />
                    </td>
                    <td>
                      <div> RAJENDRA BUGADE</div>
                    </td>
                    <td>
                      <div>2N/3D</div>
                    </td>
                    <td> Deluxe</td>
                    <td>
                      <div> INR 7297</div>
                    </td>

                    <td>
                      <div> 31-Dec-26</div>
                    </td>
                    <td>
                      <div>Published</div>
                    </td>

                    <td>
                      <div className="d-flex flex-column gap-1">
                        <span className="action-btn delete">
                          <Button
                            variant="info"
                            size="sm"
                            style={{ fontSize: "8px" }}
                            title="Edit"
                          >
                            <Icon icon="mdi:pencil" />
                          </Button>
                        </span>
                        <span className="action-btn delete">
                          <Button
                            variant="danger"
                            size="sm"
                            style={{ fontSize: "8px" }}
                            title="Delete"
                          >
                            <Icon icon="mdi:trash-can-outline" />
                          </Button>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Tab> */}
          <Tab eventKey="profile" title="Normal">
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
                    <th style={{ width: "110px" }}>Pkg No.</th>

                    <th style={{ width: "250px" }}>Package Name</th>

                    <th style={{ width: "110px" }}> Cities</th>

                    <th style={{ width: "110px" }}>Supplier Name</th>
                    <th style={{ width: "250px" }}>Created By</th>

                    <th style={{ width: "110px" }}>Days</th>

                    <th style={{ width: "110px" }} className="text-center">
                      Type
                    </th>
                    <th style={{ width: "110px" }} className="text-center">
                      Price PP
                    </th>
                    <th style={{ width: "100px" }} className="text-center">
                      Expiry Date
                    </th>
                    <th style={{ width: "110px" }} className="text-center">
                      Status
                    </th>

                    <th style={{ width: "50px" }} className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody style={{ fontSize: "12px" }}>
                  {isLoading ? (
                    <tr>
                      <td colSpan={12} className="text-center py-3">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={12} className="text-center text-danger py-3">
                        Failed to fetch packages
                      </td>
                    </tr>
                  ) : packages.length > 0 ? (
                    packages.map((pkg: any) => (
                      <tr key={pkg._id}>
                        <td>
                          <Form.Check />
                        </td>

                        <td>{pkg.packageNo || "-"}</td>

                        <td>{pkg.packageName || "-"}</td>

                        <td>
                          {pkg.destinationCovered || "-"}
                        </td>

                        <td>{pkg.supplier || "-"}</td>

                        <td>{pkg.categories?.join(", ") || "-"}</td>

                        <td>{pkg.packageMode || "-"}</td>

                        <td>{pkg.packageType || "-"}</td>

                        <td>{pkg.pricePerPerson ? `INR ${pkg.pricePerPerson}` : "-"}</td>

                        <td>
                          {pkg.expiryDate
                            ? new Date(pkg.expiryDate).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>{pkg.status || "-"}</td>

                        <td>
                          <div className="d-flex flex-column gap-1">
                            <span className="action-btn delete">
                              <Button
                                variant="info"
                                size="sm"
                                style={{ fontSize: "8px" }}
                                title="Edit"
                              >
                                <Icon icon="mdi:pencil" />
                              </Button>
                            </span>

                            <span className="action-btn delete">
                              <Button
                                variant="danger"
                                size="sm"
                                style={{ fontSize: "8px" }}
                                title="Delete"
                                disabled={deletingPackage}
                                onClick={() => {
                                  toast((t) => (
                                    <div>
                                      <p className="mb-2" style={{ fontSize: "13px" }}>
                                        Are you sure you want to delete this package?
                                      </p>
                                      <div className="d-flex gap-2">
                                        <button
                                          className="btn btn-danger btn-sm"
                                          onClick={async () => {
                                            toast.dismiss(t.id);
                                            try {
                                              await deletePackage(pkg._id).unwrap();
                                              toast.success("Package deleted successfully");
                                            } catch (err) {
                                              console.error("Delete failed:", err);
                                              toast.error("Failed to delete package");
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
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="text-center py-3">
                        No packages found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tab>
          {/* <Tab eventKey="longer-tab" title=" Expired">
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
                    <th style={{ width: "110px" }}>Pkg No.</th>

                    <th style={{ width: "250px" }}>Package Name</th>

                    <th style={{ width: "110px" }}> Cities</th>

                    <th style={{ width: "110px" }}>Supplier Name</th>
                    <th style={{ width: "250px" }}>Created By</th>

                    <th style={{ width: "110px" }}>Days</th>

                    <th style={{ width: "110px" }} className="text-center">
                      Type
                    </th>
                    <th style={{ width: "110px" }} className="text-center">
                      Price PP
                    </th>
                    <th style={{ width: "100px" }} className="text-center">
                      Expiry Date
                    </th>
                    <th style={{ width: "110px" }} className="text-center">
                      Status
                    </th>

                    <th style={{ width: "50px" }} className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody style={{ fontSize: "12px" }}>
                  {isLoading ? (
                    <tr>
                      <td colSpan={12} className="text-center py-3">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={12} className="text-center text-danger py-3">
                        Failed to fetch packages
                      </td>
                    </tr>
                  ) : packages.length > 0 ? (
                    packages.map((pkg: any) => (
                      <tr key={pkg._id}>
                        <td>
                          <Form.Check />
                        </td>

                        <td>{pkg.packageNo || "-"}</td>

                        <td>{pkg.packageName || "-"}</td>

                        <td>
                          {Array.isArray(pkg.cities)
                            ? pkg.cities.join(", ")
                            : pkg.cities || "-"}
                        </td>

                        <td>{pkg.supplierName || "-"}</td>

                        <td>{pkg.createdBy || "-"}</td>

                        <td>{pkg.days || "-"}</td>

                        <td>{pkg.type || "-"}</td>

                        <td>{pkg.pricePerPerson ? `INR ${pkg.pricePerPerson}` : "-"}</td>

                        <td>
                          {pkg.expiryDate
                            ? new Date(pkg.expiryDate).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>{pkg.status || "-"}</td>

                        <td>
                          <div className="d-flex flex-column gap-1">
                            <span className="action-btn delete">
                              <Button
                                variant="info"
                                size="sm"
                                style={{ fontSize: "8px" }}
                                title="Edit"
                              >
                                <Icon icon="mdi:pencil" />
                              </Button>
                            </span>

                            <span className="action-btn delete">
                              <Button
                                variant="danger"
                                size="sm"
                                style={{ fontSize: "8px" }}
                                title="Delete"
                              >
                                <Icon icon="mdi:trash-can-outline" />
                              </Button>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={12} className="text-center py-3">
                        No packages found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tab> */}
        </Tabs>

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

export default Packages;
