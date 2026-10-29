"use client";
import React from 'react'
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
import { useRouter } from 'next/navigation';
import { useGetRestaurantsQuery } from "../../../../store/services/inventory/restaurants/restaurantApi";

const Restaturants = () => {
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
  } = useGetRestaurantsQuery(null);

  const restaurants = data?.data || [];

  return (
    <>
      <Card className="p-3">
        <div className='text-end mb-3'>
          <Button variant='primary' size='sm'
            onClick={() => router.push('/my-inventory/restaturants/add-restaturants')}
            style={{ fontSize: "10px" }}><Icon icon="mdi:plus" className='me-1' />Add Restaturants</Button>
        </div>
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "50px" }}>S.No</th>
                <th style={{ width: "150px" }}>Restaurant Area</th>
                <th style={{ width: "250px" }}>Address</th>
                <th style={{ width: "180px" }}>Supplier Name</th>
                <th style={{ width: "120px" }}>Country</th>
                <th style={{ width: "120px" }}>City</th>
                <th style={{ width: "120px" }}>Is Preferred</th>
                <th style={{ width: "100px" }}>Rates</th>
                <th style={{ width: "100px" }}>Update</th>

              </tr>
            </thead>

            <tbody style={{ fontSize: "10px" }}>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-3">
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={9} className="text-center text-danger py-3">
                    Failed to load restaurants
                  </td>
                </tr>
              ) : restaurants.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-3">
                    No restaurants found
                  </td>
                </tr>
              ) : (
                restaurants.map((restaurant: any, index: any) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{restaurant.restaurantArea}</td>
                    <td>{restaurant.address}</td>
                    <td>{restaurant.supplierName}</td>
                    <td>{restaurant.currency}</td>
                    <td>{restaurant.city}</td>
                    <td>{restaurant.preferred ? "Yes" : "No"}</td>
                    <td>{restaurant.mealName}</td>

                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        style={{ fontSize: "8px" }}
                        // onClick={() => router.push(`/my-inventory/restaturants/edit-restaturants/${restaurant._id}`)}
                      >
                        <Icon icon="mdi:edit" />
                      </Button>
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

export default Restaturants
