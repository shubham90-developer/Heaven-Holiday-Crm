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
import ViewSightseeingModal from "./ViewSightseeingModal"
import { useRouter } from "next/navigation";
import Filter from "./Filter";
import {
  useGetSightseeingQuery,
  useDeleteSightseeingMutation
} from "../../../../../store/services/inventory/sightseeing/sightSeeingApi";
import { toast } from "react-hot-toast";

const Sightseeing = () => {
  const router = useRouter();
  const [viewsightseeing, setViewSightseeing] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({});

  const { data, isLoading, error } = useGetSightseeingQuery(filters);

  console.log(data?.data);

  const [deleteSightseeing, { isLoading: isDeleting }] = useDeleteSightseeingMutation();

  const handleDelete = async (id: string) => {
    toast((t) => (
      <div className="d-flex align-items-center gap-2">
        <span style={{ fontSize: "12px" }}>Sure you want to delete?</span>
        <button
          className="btn btn-danger btn-sm"
          style={{ fontSize: "10px" }}
          onClick={async () => {
            toast.dismiss(t.id);
            try {
              await deleteSightseeing(id).unwrap();
              toast.success("Sightseeing deleted successfully!");
            } catch (err) {
              toast.error("Failed to delete sightseeing.");
            }
          }}
        >
          Yes
        </button>
        <button
          className="btn btn-secondary btn-sm"
          style={{ fontSize: "10px" }}
          onClick={() => toast.dismiss(t.id)}
        >
          No
        </button>
      </div>
    ), { duration: 5000 });
  };

  return (
    <>
      {/* filter */}
      <div className="mb-2">
        <Filter onApplyFilters={setFilters} />
      </div>
      <Card className="p-3">
        {/* right side */}
        <div className="d-flex align-items-center mb-3 gap-2 justify-content-end">
          <Button
            variant="secondary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => router.push("/my-inventory/sightseeing/add-sightseeing")}
          >
            <Icon icon="mdi:plus" className="me-1" /> Add Sightseeing
          </Button>

          <Button
            variant="outline-secondary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => router.push("/my-inventory/sightseeing/my-rates")}
          >
            <Icon icon="mdi:eye" className="me-1" /> My Rates
          </Button>

          <Button
            variant="outline-secondary"
            size="sm"
            style={{ fontSize: "10px", fontWeight: "bold" }}
            onClick={() => router.push("/my-inventory/sightseeing/my-rates/add-rate")}
          >
            <Icon icon="mdi:plus" /> Add Rates
          </Button>
        </div>

        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th>Sightseeing Id</th>
                <th>Country</th>
                <th>City</th>
                <th>Sightseeing Name</th>
                <th>Sightseeing Type</th>
                <th>Duration</th>
                <th>Rates</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="text-center text-danger">
                    Failed to fetch sightseeing
                  </td>
                </tr>
              ) : data?.data?.length > 0 ? (
                data?.data?.map((item: any) => (
                  <tr key={item._id}>
                    <td>{item._id?.slice(-6)}</td>
                    <td>{item.country}</td>
                    <td>{item.city}</td>
                    <td>{item.sightseeingName}</td>
                    <td>{item.category || "-"}</td>
                    <td>
                      {item.durationDays}D {item.durationMinutes}M
                    </td>
                    <td>{item.rates?.length > 0 ? "Yes" : "No"}</td>

                    <td>
                      <div className="d-flex flex-column gap-1">
                        {/* View */}
                        <Button
                          variant="success"
                          size="sm"
                          style={{ fontSize: "8px" }}
                          onClick={() => {
                            setSelectedId(item._id);
                            setViewSightseeing(true);
                          }}
                        >
                          <Icon icon="mdi:eye" />
                        </Button>

                        {/* Edit */}
                        <Button
                          variant="info"
                          size="sm"
                          style={{ fontSize: "8px" }}
                          onClick={() =>
                            router.push(
                              `/my-inventory/sightseeing/edit-sightseeing/${item._id}`
                            )
                          }
                        >
                          <Icon icon="mdi:pencil" />
                        </Button>

                        {/* Update Rate */}
                        <Button
                          variant="primary"
                          size="sm"
                          style={{ fontSize: "8px" }}
                          onClick={() =>
                            router.push(
                              `/my-inventory/sightseeing/my-rates/edit-sightseeing/${item._id}`
                            )
                          }
                        >
                          <Icon icon="mdi:update" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="danger"
                          size="sm"
                          style={{ fontSize: "8px" }}
                          onClick={() => handleDelete(item._id)}  // ← uncommented
                          disabled={isDeleting}
                        >
                          <Icon icon="mdi:delete" />
                        </Button>
                      </div>

                      {viewsightseeing && selectedId && (
                        <ViewSightseeingModal
                          sightseeingId={selectedId}
                          onClose={() => {
                            setViewSightseeing(false);
                            setSelectedId(null);
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No sightseeing found
                  </td>
                </tr>
              )}
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

export default Sightseeing;
