import React, { useState } from 'react'
import { Button, Card, CardHeader, Row, Col, CardBody, Form, Table } from 'react-bootstrap';
import { Icon } from "@iconify/react/dist/iconify.js";
import AddDestinationModal from './AddDestinationModal';
import AddVisitModal from './AddVisitModal';
import AddToDoModal from './AddToDoModal';
import {
  useGetDestinationsByLeadQuery,
  useDeleteDestinationMutation
} from "../../../../../../store/services/destinationApi";
import {
  useGetTravelHistoryByLeadQuery,
  useDeleteTravelHistoryMutation
} from "../../../../../../store/services/travelHistoryApi";
import {
  useGetRecentQueriesByLeadIdQuery
} from "../../../../../../store/services/queriesApi";
import {
  useGetLeadExtraInfoByLeadIdQuery
} from "../../../../../../store/services/leadsExtraInfoApi";
import { useGetQueriesByLeadIdQuery } from "../../../../../../store/services/queriesApi";
import { useGetRemarksByLeadIdQuery, useDeleteLeadRemarkMutation } from "../../../../../../store/services/leadRemarkApi";
import { useGetFollowUpsByLeadIdQuery } from "../../../../../../store/services/followUp.Api";
import { useSearchParams } from "next/navigation";
import { useGetB2CLeadByIdQuery } from "../../../../../../store/services/b2cLeadApi";
import ToDoModal from './TodoModal';

type ProfileInfoProps = {
  title?: string
  children?: React.ReactNode
}

type SectionCardProps = {
  title: string
  children?: React.ReactNode
  showButton?: boolean;
  onAdClick?: () => void;

}

const SectionCard = ({ title, children, showButton = true, onAdClick }: SectionCardProps) => (
  <Card className="shadow-sm mb-2 p-2">
    <CardHeader className="d-flex justify-content-between align-items-center">
      <span>{title}</span>
      {showButton && (
        <Button variant='outline-primary' style={{ fontSize: "12px" }} size='sm' onClick={onAdClick}> + Add</Button>
      )}
    </CardHeader>
    <CardBody className="p-0">{children}</CardBody>
  </Card>
)

const ProfileInfo = () => {
  const [addDestination, setAddDestination] = useState(false);
  const [addVisit, setAddVisit] = useState(false);
  const [addtodo, setAddtodo] = useState(false);
  const searchParams = useSearchParams();
  const leadId = searchParams.get("id");

  const { data: b2cLeadData } = useGetB2CLeadByIdQuery(leadId, { skip: !leadId });
  const b2cLead = b2cLeadData?.data;

  const { data, isLoading } = useGetDestinationsByLeadQuery(leadId,
    {
      skip: !leadId,
    }
  );

  const [deleteDestination] = useDeleteDestinationMutation();

  const destinations = data?.data || [];
  console.log(destinations);

  // TRAVEL HISTORY
  const {
    data: travelHistoryData,
    isLoading: travelHistoryLoading,
  } =
    useGetTravelHistoryByLeadQuery(
      leadId,
      {
        skip: !leadId,
      }
    );

  const [
    deleteTravelHistory
  ] =
    useDeleteTravelHistoryMutation();

  const travelHistory = travelHistoryData?.data || [];
  console.log(travelHistory);

  // RECENT QUERIES
  const {
    data: recentQueriesData,
    isLoading: recentQueriesLoading,
  } = useGetRecentQueriesByLeadIdQuery(leadId, {
    skip: !leadId,
  });

  const recentQueries = recentQueriesData ? [recentQueriesData] : [];
  console.log(recentQueries);

  const { data: extraInfo, isLoading: extraInfoLoading } =
    useGetLeadExtraInfoByLeadIdQuery(leadId, {
      skip: !leadId,
    });

  console.log("EXTRA INFO:", extraInfo);

  const { data: remarksData, isLoading: remarksLoading } =
    useGetRemarksByLeadIdQuery({ leadId, page: 1, limit: 20 }, {
      skip: !leadId,
    });

  const [deleteLeadRemark] = useDeleteLeadRemarkMutation();

  const remarks = remarksData?.data || [];

  const { data: queriesData, isLoading: queriesLoading } =
    useGetQueriesByLeadIdQuery(leadId, { skip: !leadId });

  const queries: any[] = queriesData || [];

  // Flatten all query items across all query documents
  const allQueryItems = queries.flatMap((q: any) => q.queries || []);

  // Derive preferences from the most recent relevant entry
  const latestFlight = allQueryItems.findLast((q: any) => q.flightDetails);
  const latestHotel = allQueryItems.findLast((q: any) => q.hotelDetails);

  const seatPreference = latestFlight?.flightDetails?.flightClass || "NA";
  const foodPreferenceRaw = latestHotel?.hotelDetails?.foodPreference;
  const foodPreference = Array.isArray(foodPreferenceRaw)
    ? foodPreferenceRaw.join(", ") || "NA"
    : foodPreferenceRaw || "NA";
  const hotelPreference = latestHotel?.hotelDetails?.starRating || "NA";

  const { data: followUpsData, isLoading: followUpsLoading } = useGetFollowUpsByLeadIdQuery(leadId, {
    skip: !leadId,
  });

  const followUps = followUpsData?.data || [];

  return (
    <>
      <Card className='shadow-sm mb-8'>

        <div className="d-flex justify-content-between p-2">
          <div className='d-flex justify-content-between' style={{ fontWeight: "bold", gap: "80px" }}>
            <span>Payments:</span>
            <span>Total Billed: 0</span>
            <span>Total Paid: 0.0</span>
            <span>Pending: 0.0</span>
          </div>
          <Button size="sm" variant="outline-primary">View</Button>
        </div>

      </Card>

      <Row className='g-2 mb-2'>
        <Col md={6}>
          <Card className='shadow-sm h-100 mb-2'>
            <CardHeader>
              <strong>Recent Queries</strong>
            </CardHeader>
            <CardBody>
              <div className='table-responsive'>
                <table className='table table-bordered'>
                  <thead className='bg-light'>
                    <tr>
                      <th>Date</th>
                      <th>Destination</th>
                      <th>Plan Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>

                    {recentQueriesLoading ? (
                      <tr>
                        <td colSpan={4} className="text-center">Loading...</td>
                      </tr>

                    ) : recentQueries.length > 0 ? (

                      recentQueries.map((query: any) =>
                        query.recentQueries?.map((item: any) => {  // 👈 recentQueries instead of queries

                          const destination =
                            item.packageDetails?.goingTo ||
                            item.flightDetails?.destinationCity ||
                            item.transferDetails?.goingTo ||
                            item.visaDetails?.country ||
                            item.hotelDetails?.destination ||
                            item.sightseeingDetails?.destination ||
                            item.miscellaneousDetails?.destination ||
                            "N/A";

                          return (
                            <tr key={item._id}>
                              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                              <td>{destination}</td>
                              <td>{item.requirementType}</td>
                              <td>{query.stage}</td>
                            </tr>
                          );
                        })
                      )

                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">No Recent Queries Found</td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>

        {b2cLead && (
          <Col md={6}>
            <Card className='shadow-sm  h-100 mb-2'>
              <CardHeader className="d-flex justify-content-between">
                <strong>Customer Profile/Preferences:</strong>
                <strong>Category:{b2cLead?.preferences?.category || "NA"}</strong>
              </CardHeader>
              <CardBody>
                <div className='table-responsive'>
                  <table className="table table-sm table-bordered mb-0 align-middle" style={{ tableLayout: "fixed", width: "100%", overflowY: "auto", display: "block", height: "200px" }}>
                    <tbody>
                      <tr >
                        <td>Date of Birth / Anniversary:</td>
                        <td>
                          {extraInfo?.dob
                            ? new Date(extraInfo?.dob).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                            : "NA"}
                          {" / "}
                          {extraInfo?.anniversary
                            ? new Date(extraInfo?.anniversary).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                            : "NA"}
                        </td>
                      </tr>
                      <tr>
                        <td>Seat Preference</td>
                        <td>{b2cLead?.preferences?.seatPreference || "NA"}</td>
                      </tr>
                      <tr>
                        <td>Food</td>
                        <td><b>{b2cLead?.preferences?.food || "NA"}</b></td>
                      </tr>
                      <tr>
                        <td>Hotel</td>
                        <td>{b2cLead?.preferences?.hotelStars?.join(", ") || "NA"}</td>
                      </tr>
                      <tr>
                        <td>Passport</td>
                        <td>
                          {b2cLead?.personalInfo?.passport?.hasPassport
                            ? `${b2cLead.personalInfo.passport.passportNumber || ""} (${b2cLead.personalInfo.passport.expiryDate
                              ? new Date(b2cLead.personalInfo.passport.expiryDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                              : "No Expiry"
                            })`
                            : "NA"}
                        </td>
                      </tr>
                      <tr>
                        <td>Marrital Status</td>
                        <td>
                          <Form.Select disabled value={b2cLead?.personalInfo?.maritalStatus || ""} size="sm">
                            <option value="">NA</option>
                            <option value="Married">Married</option>
                            <option value="Unmarried">Unmarried</option>
                            <option value="Divorced">Divorced</option>
                          </Form.Select>
                        </td>
                      </tr>
                      <tr>
                        <td>Visa Country (Exp.Date)</td>
                        <td> {b2cLead?.preferences?.visa?.hasVisa
                          ? `${b2cLead.preferences.visa.country || ""} (${b2cLead.preferences.visa.expiryDate
                            ? new Date(
                              b2cLead.preferences.visa.expiryDate
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                            : "No Expiry"
                          })`
                          : "NA"}</td>
                      </tr>
                      <tr>
                        <td>Company Name</td>
                        <td>{b2cLead?.personalInfo?.companyName || "NA"}</td>
                      </tr>
                      <tr>
                        <td>Remarks</td>
                        <td>{b2cLead?.remarks || "NA"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
        )}

      </Row>

      <Row className="g-3">

        {/* I want to go */}
        <Col md={6}>
          <SectionCard title="I want to go :" onAdClick={() => setAddDestination(true)}>
            <Table className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Destination</th>
                  <th style={{ width: "120px" }}>Action</th>
                </tr>
              </thead>
              <tbody>

                {
                  isLoading ? (

                    <tr>
                      <td
                        colSpan={2}
                        className="text-center"
                      >
                        Loading...
                      </td>
                    </tr>

                  ) : destinations.length > 0 ? (

                    destinations.map(
                      (destination: any) => (

                        <tr key={destination._id}>

                          <td>
                            {destination.city},
                            {" "}
                            {destination.country}
                          </td>

                          <td>

                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() =>
                                deleteDestination(
                                  destination._id
                                )
                              }
                            >

                              <Icon
                                icon="mdi:delete"
                              />

                            </Button>

                          </td>

                        </tr>
                      )
                    )

                  ) : (

                    <tr>
                      <td
                        colSpan={2}
                        className="text-center"
                      >
                        No record found
                      </td>
                    </tr>

                  )
                }

              </tbody>
            </Table>
          </SectionCard>

          {addDestination && (
            <AddDestinationModal onClose={() => setAddDestination(false)} />
          )}
        </Col>

        {/* Have Been To */}
        <Col md={6}>
          <SectionCard title="Have Been To:" onAdClick={() => setAddVisit(true)}>
            <Table bordered className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Last Visited</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Type</th>
                  <th style={{ width: "120px" }}>Action</th>
                </tr>
              </thead>
              <tbody>

                {
                  travelHistoryLoading ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="text-center"
                      >
                        Loading...
                      </td>

                    </tr>

                  ) : travelHistory.length > 0 ? (

                    travelHistory.map(
                      (item: any) => (

                        <tr key={item._id}>

                          <td>
                            {
                              new Date(
                                item.lastVisited
                              ).getFullYear()
                            }
                          </td>

                          <td>
                            {item.country}
                          </td>

                          <td>
                            {item.city}
                          </td>

                          <td>
                            {item.type}
                          </td>

                          <td>

                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() =>
                                deleteTravelHistory(
                                  item._id
                                )
                              }
                            >

                              <Icon
                                icon="mdi:delete"
                              />

                            </Button>

                          </td>

                        </tr>
                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan={5}
                        className="text-center"
                      >
                        No record found
                      </td>

                    </tr>

                  )
                }

              </tbody>

            </Table>
          </SectionCard>

          {addVisit && (
            <AddVisitModal onClose={() => setAddVisit(false)} />
          )}
        </Col>

        {/* To Do List */}
        <Col md={6}>
          <SectionCard title="To Do List" onAdClick={() => setAddtodo(true)}>
            <Table bordered className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: "120px" }}>Update</th>
                  <th>Subject (Details)</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {followUpsLoading ? (
                  <tr>
                    <td colSpan={3} className="text-center">Loading...</td>
                  </tr>
                ) : followUps.length > 0 ? (
                  followUps.map((item: any) => (
                    <tr key={item._id}>
                      <td>
                        <Button size="sm" variant="outline-primary">Update</Button>
                      </td>
                      <td>{item.type} {item.direction ? `- ${item.direction}` : ""} {item.details ? `(${item.details})` : ""}</td>
                      <td>{new Date(item.schedule?.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">No record found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </SectionCard>
        </Col>

        {addtodo && (<AddToDoModal onClose={() => setAddtodo(false)} />)}
        {/* Remarks */}
        <Col md={6}>
          <SectionCard title="Remarks:" showButton={false}>
            <Table bordered className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>#</th>
                  <th>Create Date</th>
                  <th>Remark Type</th>
                  <th>Remark</th>
                  <th style={{ width: "120px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {remarksLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center">Loading...</td>
                  </tr>
                ) : remarks.length > 0 ? (
                  remarks.map((item: any, index: number) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>{item.remarkType}</td>
                      <td>{item.remark}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => deleteLeadRemark(item._id)}
                        >
                          <Icon icon="mdi:delete" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">No record found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </SectionCard>
        </Col>

      </Row>

    </>
  )
}

export default ProfileInfo
