"use client";
import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Modal,
  Tab,
} from "react-bootstrap";
import { useRouter } from 'next/navigation';
import ViewItineraryModal from './ViewItineraryModal';
import { Icon } from '@iconify/react/dist/iconify.js';
import Filter from './Filter';
import {
  useGetItinerariesQuery,
  useDeleteItineraryMutation
} from "../../../../../store/services/inventory/itinerary-description/itineraryDescriptionApi";
import toast from "react-hot-toast";

const Itinerary = () => {
  const router = useRouter()
  const [viewitinerary, setViewItinerary] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [filters, setFilters] = useState({
    startCity: "",
    destinationCity: "",
  });

  const { data, isLoading } =
    useGetItinerariesQuery(filters);
  const [deleteItinerary, { isLoading: deletingItinerary }] = useDeleteItineraryMutation();

  const itineraries = data?.data || [];

  return (
    <>
      <div className='mb-2'>
        <Filter filters={filters}
          setFilters={setFilters} />
      </div>
      <Card className="p-3">
        <div className='text-end mb-3'>
          <Button variant='primary' size='sm'
            onClick={() => router.push('/my-inventory/itinerary-description/add-itinerary')}
            style={{ fontSize: "10px" }} ><Icon icon="mdi:plus" className='me-1' />Add Itinerary</Button>

        </div>

        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "60px" }}>S.No</th>
                <th style={{ width: "150px" }}>Start City</th>
                <th style={{ width: "180px" }}>Destination City</th>
                <th style={{ width: "200px" }}>Title</th>
                <th style={{ width: "120px" }}>DOW</th>
                <th style={{ width: "120px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : itineraries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No itineraries found
                  </td>
                </tr>
              ) : (
                itineraries.map((item: any, index: number) => (
                  <tr key={item._id} style={{ fontSize: "12px" }}>
                    <td>{index + 1}</td>
                    <td>{item.startCity}</td>
                    <td>{item.destinationCity}</td>
                    <td>{item.title}</td>
                    <td>
                      <span
                        className={`badge ${item.status === "Active"
                          ? "bg-success"
                          : "bg-secondary"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {/* View */}
                        <Button
                          variant="success"
                          size="sm"
                          style={{ fontSize: "8px" }}
                          onClick={() => {
                            setSelectedId(item._id);
                            setViewItinerary(true);
                          }}
                        >
                          <Icon icon="mdi:eye" />
                        </Button>

                        {/* Edit */}
                        <Button
                          variant="primary"
                          size="sm"
                          style={{ fontSize: "8px" }}
                          onClick={() =>
                            router.push(
                              `/my-inventory/itinerary-description/edit-itinerary/${item._id}`
                            )
                          }
                        >
                          <Icon icon="mdi:edit" />
                        </Button>

                        {/* Toggle Status */}
                        <Button
                          variant="warning"
                          size="sm"
                          style={{ fontSize: "8px" }}
                        >
                          <Icon icon="mdi:check" />
                        </Button>

                        {/* Delete */}
                        <Button
                          variant="danger"
                          size="sm"
                          style={{ fontSize: "8px" }}
                          onClick={() => {
                            toast((t) => (
                              <div>
                                <p className="mb-2" style={{ fontSize: "13px" }}>
                                  Are you sure you want to delete this itinerary?
                                </p>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={async () => {
                                      toast.dismiss(t.id);
                                      try {
                                        await deleteItinerary(item._id).unwrap();
                                        toast.success("Itinerary deleted successfully");
                                      } catch (err) {
                                        toast.error("Failed to delete itinerary");
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
                          <Icon icon="mdi:delete" />
                        </Button>
                      </div>

                      {viewitinerary && selectedId && (
                        <ViewItineraryModal
                          itineraryId={selectedId}
                          onClose={() => {
                            setViewItinerary(false);
                            setSelectedId(null);
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </Card>
    </>
  )
}

export default Itinerary
