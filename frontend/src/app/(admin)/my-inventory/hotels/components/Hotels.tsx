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
import SupplierModal from "./AddModal";
import AddModal from "./AddModal";
import { useGetHotelsQuery, useDeleteHotelMutation } from "../../../../../store/services/inventory/hotel/hotelApi";
import toast, { Toaster } from "react-hot-toast";

const Hotels = () => {
  const { data, isLoading, isError } = useGetHotelsQuery(null);
  const [deleteHotel, { isLoading: deletingHotel }] = useDeleteHotelMutation();

  const router = useRouter();
  const hotels = data?.data || [];

  return (
    <>
      {/* filter */}
      <div className="mb-2">
        <Filter />
      </div>
      <Card className="p-3">
        {/* right side */}
        <div className="d-flex align-items-center  justify-content-end mb-2">
          <AddModal />
        </div>
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "40px" }}>S.No.</th>
                <th style={{ width: "110px" }}> Hotel ID</th>

                <th style={{ width: "250px" }}>Hotel Name</th>

                <th style={{ width: "110px" }}> City</th>

                <th style={{ width: "110px" }}>Contact Email</th>
                <th style={{ width: "110px" }}>Contact Number</th>

                <th style={{ width: "110px" }}>Category</th>

                <th style={{ width: "110px" }} className="text-center">
                  Type
                </th>
                <th style={{ width: "110px" }} className="text-center">
                  Check in
                </th>
                <th style={{ width: "100px" }} className="text-center">
                  Check Out
                </th>
                <th style={{ width: "110px" }} className="text-center">
                  Supplier
                </th>

                <th style={{ width: "50px" }} className="text-center">
                  Currency
                </th>

                <th style={{ width: "50px" }} className="text-center">
                  DOW
                </th>
                <th style={{ width: "50px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {isLoading ? (
                <tr>
                  <td colSpan={14} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={14} className="text-center text-danger">
                    Failed to load hotels
                  </td>
                </tr>
              ) : hotels.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center">
                    No hotels found
                  </td>
                </tr>
              ) : (
                hotels.map((hotel: any, index: number) => (
                  <tr key={hotel._id}>
                    <td>{index + 1}</td>
                    <td>{hotel._id?.slice(-6)}</td>

                    <td>{hotel.hotelName}</td>
                    <td>{hotel.cityName}</td>

                    <td>{hotel.contactEmail || "--"}</td>
                    <td>{hotel.contactNo || "--"}</td>

                    <td>{hotel.starRating ? `${hotel.starRating} Star` : "NA"}</td>

                    <td className="text-center">{hotel.propertyType}</td>

                    <td className="text-center">{hotel.checkInTime}</td>
                    <td className="text-center">{hotel.checkOutTime}</td>

                    <td className="text-center">--</td>
                    <td className="text-center">--</td>

                    <td className="text-center">
                      {hotel.weekend?.saturday ? "Sat " : ""}
                      {hotel.weekend?.sunday ? "Sun" : ""}
                    </td>

                    <td>
                      <div className="d-flex flex-column gap-1">
                        <Button
                          variant="info"
                          size="sm"
                          style={{ fontSize: "8px" }}
                        >
                          <Icon icon="mdi:pencil" />
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          style={{ fontSize: "8px" }}
                          disabled={deletingHotel}
                          onClick={() => {
                            toast((t) => (
                              <div>
                                <p className="mb-2" style={{ fontSize: "13px" }}>
                                  Are you sure you want to delete this hotel?
                                </p>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={async () => {
                                      toast.dismiss(t.id);
                                      try {
                                        await deleteHotel(hotel._id).unwrap();
                                        toast.success("Hotel deleted successfully");
                                      } catch (err) {
                                        toast.error("Failed to delete hotel");
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
                ))
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

export default Hotels;
