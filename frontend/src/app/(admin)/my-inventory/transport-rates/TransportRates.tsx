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
import Filter from './Filter';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  useGetTransportRoutesQuery,
} from "../../../../store/services/inventory/transport-route/transportRouteApi";

const TransportRates = () => {
  const router = useRouter()
  const {
    data,
    isLoading,
    isError,
  } = useGetTransportRoutesQuery({});

  const routes = data?.data || [];

  return (
    <>
      <div className='mb-2'>
        <Filter />
      </div>
      <Card className='p-2'>
        <div className='text-end mb-3'>
          <Button variant='primary' size='sm'
            onClick={() => router.push('/my-inventory/transport-rates/add-route')}
            style={{ fontSize: "10px" }} ><Icon icon="mdi:plus" className='me-1' />Add Transports Route</Button>
        </div>

        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th >S.No</th>
                <th >Route Name</th>
                <th >Start City</th>
                <th >Destination City</th>
                <th >End City</th>
                <th >Transport Type</th>
                <th >Transport Category</th>
                <th >No. Of Days</th>
                <th >DOW</th>
                <th >Cities Covered</th>
                <th >Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={11} className="text-center text-danger">
                    Failed to fetch transport routes
                  </td>
                </tr>
              ) : routes.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center">
                    No transport routes found
                  </td>
                </tr>
              ) : (
                routes.map((route: any, index: number) => (
                  <tr key={route._id} style={{ fontSize: "11px" }}>
                    <td>{index + 1}</td>
                    <td>{route.routeName}</td>
                    <td>{route.startCity}</td>
                    <td>{route.destinationCity}</td>
                    <td>
                      {route.citiesIncluded?.length > 0
                        ? route.citiesIncluded[
                          route.citiesIncluded.length - 1
                        ]?.city
                        : "-"}
                    </td>
                    <td>{route.transportType}</td>
                    <td>{route.category}</td>
                    <td>
                      {route.citiesIncluded?.reduce(
                        (sum: number, city: any) =>
                          sum + Number(city.noOfDays || 0),
                        0
                      )}
                    </td>
                    <td>-</td>
                    <td>
                      {route.citiesIncluded
                        ?.map((city: any) => city.city)
                        .join(", ") || "-"}
                    </td>
                    <td>
                      {/* <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                        >
                          <Icon icon="mdi:pencil" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-danger"
                        >
                          <Icon icon="mdi:delete" />
                        </Button>
                      </div> */}
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

export default TransportRates
