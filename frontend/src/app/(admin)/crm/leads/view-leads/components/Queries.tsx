import React from 'react'
import { Button, Card, CardHeader, Row, Col, CardBody, Form, Table } from 'react-bootstrap';
import {
  useGetQueriesByLeadIdQuery,
} from "../../../../../../store/services/queriesApi";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatPaxCountFromDetails } from "../../../utils/paxDetails";

const Queries = () => {
  const [addQuery, setAddQuery] =
    useState(false);

  const searchParams =
    useSearchParams();

  const leadId =
    searchParams.get("id");

  // FETCH QUERIES
  const {
    data: queriesData,
    isLoading,
    isError,
  } = useGetQueriesByLeadIdQuery(
    leadId,
    {
      skip: !leadId,
    }
  );

  // FORMAT DATE
  const formatDate = (
    date: string
  ) => {

    if (!date) return "NA";

    return new Date(
      date
    ).toLocaleDateString("en-IN");
  };

  // GET QUERY DETAILS
  const getQueryDetails = (
    query: any
  ) => {

    const queryItem =
      query?.queries?.[0];

    if (!queryItem)
      return {};

    switch (
    queryItem.requirementType
    ) {

      case "Package":
        return {
          source:
            queryItem
              ?.packageDetails
              ?.goingFrom,

          destination:
            queryItem
              ?.packageDetails
              ?.goingTo,

          travelDate:
            queryItem
              ?.packageDetails
              ?.specificDate,

          pax: formatPaxCountFromDetails(queryItem?.packageDetails),

          leadSource:
            queryItem
              ?.packageDetails
              ?.leadSource,
        };

      case "Flight":
        return {
          source:
            queryItem
              ?.flightDetails
              ?.sourceCity,

          destination:
            queryItem
              ?.flightDetails
              ?.destinationCity,

          travelDate:
            queryItem
              ?.flightDetails
              ?.departureDate,

          pax:
            (queryItem
              ?.flightDetails
              ?.adults || 0) +
            (queryItem
              ?.flightDetails
              ?.children || 0),

          leadSource:
            queryItem
              ?.flightDetails
              ?.leadSource,
        };

      case "Visa":
        return {
          source: "NA",

          destination:
            queryItem
              ?.visaDetails
              ?.country,

          travelDate:
            queryItem
              ?.visaDetails
              ?.dateOfTravel,

          pax:
            queryItem
              ?.visaDetails
              ?.adults,

          leadSource:
            queryItem
              ?.visaDetails
              ?.leadSource,
        };

      case "Hotel":
        return {
          source: "NA",

          destination:
            queryItem
              ?.hotelDetails
              ?.destination,

          travelDate:
            queryItem
              ?.hotelDetails
              ?.checkIn,

          pax:
            queryItem
              ?.hotelDetails
              ?.travelers,

          leadSource:
            queryItem
              ?.hotelDetails
              ?.leadSource,
        };

      default:
        return {};
    }
  };

  return (
    <>
      <Card className='p-2'>
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle "
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead >
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th>Queries</th>
              </tr>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }} className='bg-light'>


                <th style={{ width: "100px" }}>Query Date</th>

                <th style={{ width: "260px" }}>Query ID</th>

                <th style={{ width: "140px" }}>Travel Date</th>

                <th style={{ width: "110px" }}>Type</th>
                <th style={{ width: "110px" }}>Source</th>
                <th style={{ width: "110px" }}>Destination</th>
                <th style={{ width: "110px" }}>PAX</th>
                <th style={{ width: "110px" }}>Last Update</th>
                <th style={{ width: "110px" }}>Proposals</th>
                <th style={{ width: "110px" }}>Stage</th>
                <th style={{ width: "110px" }}>Owner</th>
                <th style={{ width: "70px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {/* DYNAMIC DATA */}
              {isLoading && (
                <tr>
                  <td colSpan={12} className="text-center text-muted py-3">
                    Loading queries...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={12} className="text-center text-danger py-3">
                    Failed to load queries.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && (!queriesData || queriesData.length === 0) && (
                <tr>
                  <td colSpan={12} className="text-center text-muted py-3">
                    No queries found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                queriesData?.map((queryDoc: any) =>
                  queryDoc?.queries?.map((queryItem: any) => {
                    const details = getQueryDetails({
                      queries: [queryItem],
                    });

                    return (
                      <tr key={queryItem._id}>
                        {/* QUERY DATE */}
                        <td>
                          {formatDate(queryItem.createdAt)}
                        </td>

                        {/* QUERY ID */}
                        <td>
                          {queryItem._id}
                        </td>

                        {/* TRAVEL DATE */}
                        <td>
                          {formatDate(details.travelDate)}
                        </td>

                        {/* TYPE */}
                        <td>
                          {queryItem.requirementType}
                        </td>

                        {/* SOURCE */}
                        <td>
                          {details.source || "NA"}
                        </td>

                        {/* DESTINATION */}
                        <td>
                          {details.destination || "NA"}
                        </td>

                        {/* PAX */}
                        <td>
                          {details.pax || "NA"}
                        </td>

                        {/* LAST UPDATE */}
                        <td>
                          {formatDate(queryItem.updatedAt)}
                        </td>

                        {/* PROPOSALS */}
                        <td>
                          0
                        </td>

                        {/* STAGE */}
                        <td>
                          <span className="badge bg-primary">
                            {queryDoc.stage}
                          </span>
                        </td>

                        {/* OWNER */}
                        <td>
                          {queryDoc?.assignedToSales?.name || "Unassigned"}
                        </td>

                        {/* ACTION */}
                        <td className="text-center">
                          Edit
                        </td>
                      </tr>
                    );
                  })
                )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default Queries
