"use client";

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import RemarkBox from "../components/RemarkBox";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "react-bootstrap";
{/*import EditCustomerModal from "./EditCustomerModal";
import NewQuery from "./NewQuery";
import ProfileInfo from "./components/ProfileInfo";
import Queries from "./components/Queries";
import Account from "./components/Account";
import Booking from "./components/Booking";
import Followups from "./components/Followups";
import Contacts from "./components/Contacts";
import Feedback from "./components/Feedback";
import Remarks from "./components/Remarks"; */}
import { useRouter } from "next/navigation";
import SmsModal from "../components/SmsModal";
import Summary from "../components/Summary";
import Proposals from "../components/Proposals";
import QueryContact from "../components/QueryContact";
import Remarks from "../components/Remarks";
import ModifyQuery from "../ModifyQuery";
import ToDoModal from "../../../leads/view-leads/components/TodoModal";
import { useParams } from "next/navigation";
import LeadToDo from "../components/LeadToDo";
import {
  useGetQueryByIdQuery,
  useGetQueriesByLeadIdQuery
} from "../../../../../../store/services/queriesApi";
import {
  detailsFromQueryItem,
  formatPaxCountFromDetails,
  formatRoomLabel,
} from "../../../utils/paxDetails";

const QueryDetail = () => {
  const [step, setStep] = useState(1);
  const router = useRouter()
  const [showQuery, setShowQuery] = useState(true);
  const [activeTab, setActiveTab] = useState("Summary");
  const [todo, setTodo] = useState(false);
  const [payment, setPayment] = useState(false);
  const [smstemp, setSmstemp] = useState(false);
  // const searchParams = useSearchParams();
  const [showAllQueries, setShowAllQueries] = useState(false);

  const params = useParams();
  const queryId = params?.id as string;

  const {
    data: queryResponse,
    isLoading,
    isError,
  } = useGetQueryByIdQuery(queryId, {
    skip: !queryId,
  });

  console.log(queryId);

  const query = queryResponse?.data;

  console.log(query);

  const lead = query?.leadId || {};

  const firstQuery = query?.queries?.[0] || {};

  console.log(firstQuery);

  const leadId = query?.leadId?._id;

  const {
    data: allQueries = [],
  } = useGetQueriesByLeadIdQuery(leadId, {
    skip: !leadId,
  });

  const getDestination = () => {
    if (firstQuery?.packageDetails?.goingTo)
      return firstQuery.packageDetails.goingTo;

    if (firstQuery?.flightDetails?.destinationCity)
      return firstQuery.flightDetails.destinationCity;

    if (firstQuery?.hotelDetails?.destination)
      return firstQuery.hotelDetails.destination;

    return "N/A";
  };

  const getTravelDate = () => {
    return (
      firstQuery?.packageDetails?.specificDate ||
      firstQuery?.flightDetails?.departureDate ||
      firstQuery?.hotelDetails?.checkIn ||
      null
    );
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
  };

  const getPax = () => {
    const details = detailsFromQueryItem(firstQuery);
    return formatPaxCountFromDetails(details);
  };

  const getInclusions = () => {
    return (
      firstQuery?.packageDetails?.inclusions ||
      firstQuery?.packageDetails?.theme ||
      "N/A"
    );
  };

  const getLeadType = () => {
    return query?.leadModel === "B2BLead" ? "B2B" : "B2C";
  };

  const getQueryType = () => {
    return firstQuery?.requirementType || "N/A";
  };

  const getCreatedAt = () => {
    return formatDate(query?.createdAt);
  };

  const getUpdatedAt = () => {
    return formatDate(query?.updatedAt);
  };

  const getOwner = () => {
    return query?.assignedOwner?.name || "Unassigned";
  };

  const getSource = () => {
    return (
      firstQuery?.packageDetails?.leadSource ||
      firstQuery?.flightDetails?.leadSource ||
      firstQuery?.transferDetails?.leadSource ||
      firstQuery?.visaDetails?.leadSource ||
      firstQuery?.hotelDetails?.leadSource ||
      firstQuery?.sightseeingDetails?.leadSource ||
      firstQuery?.miscellaneousDetails?.leadSource ||
      "N/A"
    );
  };

  const getRoomInfo = () => {
    const details = detailsFromQueryItem(firstQuery);
    const room = formatRoomLabel(details?.paxDetails, details?.travelers);
    if (room !== "N/A") return room;

    const hotel = firstQuery?.hotelDetails;
    if (!hotel) return "N/A";
    return `${hotel.travelers || 0} Traveler(s)`;
  };

  const getAdditionalReq = () => {
    return (
      firstQuery?.packageDetails?.theme ||
      firstQuery?.flightDetails?.remark ||
      firstQuery?.transferDetails?.remark ||
      firstQuery?.visaDetails?.remark ||
      firstQuery?.hotelDetails?.remark ||
      firstQuery?.sightseeingDetails?.remark ||
      firstQuery?.miscellaneousDetails?.remark ||
      "N/A"
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        Loading Query...
      </div>
    );
  }

  if (isError || !query) {
    return (
      <div className="p-4 text-danger text-center">
        Failed to load query
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-sm border-0">
        {/* Top Customer Details Section */}
        <Row className="px-3 py-3" style={{ fontSize: "12px" }}>

          {/* Left */}
          <Col md={3}>
            <div>
              Customer Name :{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => router.push("../leads/view-leads")}
              >
                {lead?.firstName} {lead?.lastName}
              </span>
            </div>

            <div>
              Customer Type :{" "}
              <span className="text-primary">{getLeadType()}</span>
            </div>

            <div>
              <strong>Last Remark :</strong>
            </div>
          </Col>

          {/* Center Left */}
          <Col md={3}>
            <div>Contact No : +91 {lead?.phone || lead?.mobile || "N/A"}</div>

            <div>
              Owner name :{" "}
              <span className="text-dark"> {getOwner()}</span>
            </div>
          </Col>

          {/* Center Right */}
          <Col md={3}>
            <div>
              Email ID :{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push("/customer-profile?tab=Queries")
                }
              >
                {lead?.email || "N/A"}
              </span>
            </div>
          </Col>

          {/* Right */}
          <Col md={3} className="text-md-end mt-2 mt-md-0">
            <div>
              Active Since :{" "}
              <span className="text-primary">
                {new Date(query?.createdAt).toLocaleString()}
              </span>
            </div>
          </Col>
        </Row>

        <hr className="my-1" />

        {/* Query Details Section */}
        <Row className="px-3 py-3" style={{ fontSize: "12px" }}>

          {/* Left */}
          <Col md={3}>
            <div>
              Query Title :{" "}
              <span className="text-primary">
                {query?._id?.slice(-7)?.toUpperCase()}
              </span>
            </div>

            <div className="mt-4">
              Created On :{" "}
              <span className="text-primary">{getCreatedAt()}</span>
            </div>

            <div>
              Lead Quality :{" "}
              <span className="text-primary">NA</span>
            </div>
          </Col>

          {/* Center Left */}
          <Col md={3}>
            <div>
              Type :{" "}
              <span className="text-primary">
                {getQueryType()} (Id: {query?._id?.slice(-6)})
              </span>
            </div>

            <div>
              No of Pax :{" "}
              <span className="text-primary">
                {getPax()}
              </span>
            </div>

            <div>
              Room :{" "}
              <span className="text-primary">
                {getRoomInfo()}
              </span>
            </div>

            <div className="mt-4">
              Updated On :{" "}
              <span className="text-primary">
                {getUpdatedAt()}
              </span>
            </div>

            <div>Source : {getSource()}</div>
          </Col>

          {/* Center Right */}
          <Col md={3}>
            <div>
              Query ID :{" "}
              <span className="text-primary">
                {query?._id?.slice(-7)?.toUpperCase()}
              </span>
            </div>

            <div>
              Travel Date :{" "}
              <span className="text-primary">
                {getTravelDate()
                  ? new Date(getTravelDate()).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <div className="mt-4">
              Additional Req :
            </div>

            <div>
              Last Remark :
            </div>
          </Col>

          {/* Right */}
          <Col md={3}>
            <div>
              Destination :{" "}
              <span className="text-primary">
                {getDestination()}
              </span>
            </div>

            <div>
              Inclusions/Theme :{" "}
              <span className="text-primary">
                {getInclusions()}
              </span>
            </div>

            <div>
              Status :{" "}
              <span className="text-primary">
                {query?.stage || "N/A"}
              </span>
            </div>
          </Col>
        </Row>

        <hr className="my-1" />

        {/* Bottom Action Section */}
        <Row className="px-3 py-3 align-items-center">

          <Col md={2}>
            <RemarkBox />
          </Col>

          <Col md={2}>
            <Button
              variant="outline-primary"
              size="sm"
              style={{ fontSize: "10px" }}
              onClick={() => setShowAllQueries(true)}
            >
              All Queries ({allQueries.length})
            </Button>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label
                style={{ fontSize: "10px" }}
              >
                Lead Status
              </Form.Label>

              <Form.Select
                size="sm"
                style={{ fontSize: "12px" }}
              >
                <option>{query?.stage || "N/A"}</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label
                style={{ fontSize: "10px" }}
              >
                Lead Quality
              </Form.Label>

              <Form.Select
                size="sm"
                style={{ fontSize: "12px" }}
              >
                <option>Warm</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col
            md={3}
            className="d-flex gap-2 mt-3 mt-md-0"
          >
            <SmsModal />

           <ToDoModal/>

            <Button
              variant="danger"
              size="sm"
              style={{ fontSize: "10px" }}
              onClick={() => setShowQuery(!showQuery)}
            >
              Send Proposal/Modify Query
            </Button>

            {/*} {todo && (
        <TodoModal
          onClose={() => setTodo(false)}
        />
      )} */}
          </Col>
        </Row>
      </Card>

       {showQuery && <ModifyQuery query={query} />} 

      <Card>
        <div className="d-flex justify-content-between p-2">
          <div className="d-flex gap-2">
            {["Summary", "Proposals", "Query Contact", "Remarks", "ToDo's/Follow up's"].map((item) => (
              <span key={item}
                onClick={() => setActiveTab(item)}
                style={{
                  fontSize: "12px",
                  cursor: "pointer",
                  borderBottom: activeTab === item ? "2px solid #000" : "none"
                }} >{item}</span>
            )
            )}
          </div>
      
        </div>
      </Card>

      <Card>
        {activeTab === "Summary" && (<Summary />)}
        {activeTab === "Proposals" && (
          <Proposals
            queryId={queryId}
            queryCode={query?._id?.toString().slice(-7).toUpperCase()}
            customerEmail={
              typeof query?.leadId === "object"
                ? query?.leadId?.email
                : undefined
            }
          />
        )}
        {activeTab === "Query Contact" && (<QueryContact />)}
        {activeTab === "Remarks" && (<Remarks />)}
        {activeTab === "ToDo's/Follow up's" && (<LeadToDo/>) }
      </Card>

      {/* <Modal
        show={showAllQueries}
        onHide={() => setShowAllQueries(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>All Queries</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {allQueries.map((q: any) => (
            <Card key={q._id} className="mb-2 p-2">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>ID:</strong>{" "}
                  {q._id?.slice(-7)?.toUpperCase()}
                </div>

                <div>
                  <strong>Status:</strong> {q.stage}
                </div>
              </div>

              <div>
                <strong>Created:</strong>{" "}
                {new Date(q.createdAt).toLocaleDateString()}
              </div>

              <div>
                <strong>Requirement:</strong>{" "}
                {q.queries?.[0]?.requirementType}
              </div>

              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  router.push(`/queries/view-queries?id=${q._id}`);
                  setShowAllQueries(false);
                }}
              >
                View Query
              </Button>
            </Card>
          ))}
        </Modal.Body>
      </Modal> */}

    </>
  );
};

export default QueryDetail;
