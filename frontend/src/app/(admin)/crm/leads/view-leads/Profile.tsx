"use client";

import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import RemarkBox from "./RemarkBox";
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
import EditCustomerModal from "./EditCustomerModal";
import EditB2CCustomerModal from "./EditB2CCustomerModal";
import NewQuery from "./NewQuery";
import ProfileInfo from "./components/ProfileInfo";
import Queries from "./components/Queries";
import Account from "./components/Account";
import Booking from "./components/Booking";
import Followups from "./components/Followups";
import Contacts from "./components/Contacts";
import Feedback from "./components/Feedback";
import Remarks from "./components/Remarks";
import TodoModal from "./components/TodoModal";
import { useSearchParams } from "next/navigation";
import { useGetLeadByIdQuery } from "../../../../../store/services/leadsApi";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import {
  useCreateOrUpdateLeadExtraInfoMutation,
} from "../../../../../store/services/leadsExtraInfoApi";
import { useCreateLeadRemarkMutation, useGetRemarksByLeadIdQuery } from "../../../../../store/services/leadRemarkApi";
import { useGetQueriesByLeadIdQuery } from "../../../../../store/services/queriesApi";
import { useGetB2CLeadByIdQuery } from "../../../../../store/services/b2cLeadApi";
import toast from "react-hot-toast";

const Profile = () => {
  const [step, setStep] = useState(1);
  const [showQuery, setShowQuery] = useState(true);
  const [activeTab, setActiveTab] = useState("Profile");
  const searchParams = useSearchParams();
  const [updatepayment, setUpdatePayment] = useState(false);
  const [dob, setDob] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [remark, setRemark] = useState("");
  const [remarkType, setRemarkType] = useState("Customer");
  const id = searchParams.get("id");
  console.log("ID:", id);

  const { data, isLoading } = useGetLeadByIdQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const lead = data;

  console.log("TYPE:", typeof data);
  console.log("IS ARRAY:", Array.isArray(data));
  console.log("DATA:", data);

  const [
    createOrUpdateLeadExtraInfo,
    { isLoading: saving }
  ] =
    useCreateOrUpdateLeadExtraInfoMutation();

  const [createLeadRemark, { isLoading: savingRemark }] = useCreateLeadRemarkMutation();
  const { data: remarksData, isLoading: remarksLoading } = useGetRemarksByLeadIdQuery(
    { leadId: id, page: 1, limit: 1 },  // limit: 1 fetches only the latest
    { skip: !id }
  );

  const latestRemark = remarksData?.data?.[0] ?? null;


  // ============================
  // SAVE DOB + ANNIVERSARY
  // ============================

  const handleSaveLeadExtraInfo = async () => {

    try {

      const payload = {
        leadId: id,
        dob,
        anniversary: anniversaryDate,
      };

      await createOrUpdateLeadExtraInfo({
        data: payload,
      }).unwrap();

      console.log("PAYLOAD:", JSON.stringify(payload));

      toast.success("Saved Successfully");

    } catch (error: any) {

      console.error(error);

      toast.error("Failed to Save");
    }
  };

  const handleSaveRemark = async () => {

    if (!remark.trim()) return;

    try {

      await createLeadRemark({
        leadId: id,
        remarkType: "Customer",
        remark,
      }).unwrap();

      setRemark("");
      toast.success("Remark Added");

    } catch (error: any) {
      console.error(error);
      toast.error("Failed to Save Remark");
    }
  };


  if (!id) {
    return <div>Invalid Lead ID</div>;
  }

  return (
    <>
      <Card>
        <Row className="align-items-center mb-2 px-3 py-1">
          <Col md={6}>
            <div>
              Customer Name : {lead?.salutation} {lead?.firstName} {lead?.lastName} {" "}
              {lead?.leadModel === "B2BLead" ? (<EditCustomerModal lead={lead} />) : (<EditB2CCustomerModal lead={lead} />)}
            </div>
            <div>
              Owner name :{" "}
              <span className="text-primary">{lead?.assignedOwner?.name || "NA"}</span>
            </div>
            <div>
              <strong>Last Remark : {remarksLoading ? (
                <span className="text-muted" style={{ fontSize: "12px" }}>Loading...</span>
              ) : latestRemark ? (
                <span style={{ fontSize: "12px" }}>
                  <span className="text-muted me-2" style={{ fontSize: "11px" }}>
                    [{new Date(latestRemark.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric"
                    })}]
                  </span>
                  <span className="badge bg-secondary me-1" style={{ fontSize: "10px" }}>
                    {latestRemark.remarkType}
                  </span>
                  {latestRemark.remark}
                </span>
              ) : (
                <span className="text-muted" style={{ fontSize: "12px" }}>No remarks yet</span>
              )}</strong>
            </div>
          </Col>

          <Col md={3}>
            <div>
              Contact No : +91 {lead?.mobile || "NA"}
            </div>
            <div>
              Customer Type : {lead?.leadModel === "B2BLead" ? "B2B" : "B2C"}
            </div>
          </Col>

          <Col md={3} className="text-end">
            <div>
              Email ID :{" "}
              <span className="text-primary">
                {lead?.email || "NA"}
              </span>
            </div>
            <div>
              Active Since :{" "}
              <span className="text-primary">
                {lead?.activeSince
                  ? new Date(lead.activeSince).toLocaleString()
                  : "NA"}
              </span>
            </div>
          </Col>
        </Row>

        <hr />

        <Row className="align-items-center px-3 mb-2">
          <Col md={2}>

            <RemarkBox remark={remark}
              setRemark={setRemark}
              onSave={handleSaveRemark} />
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label
                style={{ fontSize: "10px" }}
                className="fw-bold"
              >
                Date of Birth
              </Form.Label>
              <Form.Control type="date" size="sm" style={{ fontSize: "12px" }} value={dob}
                onChange={(e) =>
                  setDob(e.target.value)
                } />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label
                style={{ fontSize: "10px" }}
                className="fw-bold"
              >
                Anniversary
              </Form.Label>
              <Form.Control type="date" size="sm" style={{ fontSize: "12px" }} value={anniversaryDate}
                onChange={(e) =>
                  setAnniversaryDate(
                    e.target.value
                  )
                } />
            </Form.Group>
          </Col>

          <Col md={1}>
            <Button variant="outline-danger" size="sm"
              style={{ fontSize: "10px", fontWeight: "bold" }} onClick={handleSaveLeadExtraInfo}
              disabled={saving}>
              {
                saving
                  ? "Saving..."
                  : "Save"
              }
            </Button>
          </Col>

          <Col md={3} className="text-end mt-3 mt-md-0">
            <Button variant="outline-primary" size="sm" className="me-2">
              <Icon icon="mdi:thumb-up-outline" width="18" />
            </Button>
            <TodoModal />
            <Button variant="danger" size="sm"
              onClick={() => setShowQuery(!showQuery)}
            >
              <Icon icon="mdi:plus" className="me-1" />New Query
            </Button>
          </Col>
        </Row>

      </Card>

      {showQuery && <NewQuery />}

      <Card>
        <div className="d-flex justify-content-between p-2">
          <div className="d-flex gap-2">
            {["Profile", "Queries", "Bookings", "Accounts", "ToDo's/Follow up's", "Contacts", "Feedback", "Remarks"].map((item) => (
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
          <Button variant="outline-danger" size="sm" className="me-2" onClick={() => setActiveTab("Bookings")}>Update Payment</Button>
        </div>
      </Card>

      <Card>
        {activeTab === "Profile" && (<ProfileInfo />)}
        {activeTab === "Queries" && (<Queries />)}
        {activeTab === "Bookings" && (<Booking />)}
        {activeTab === "Accounts" && (<Account />)}
        {activeTab === "ToDo's/Follow up's" && (<Followups />)}
        {activeTab === "Contacts" && (<Contacts />)}
        {activeTab === "Feedback" && (<Feedback />)}
        {activeTab === "Remarks" && (<Remarks />)}
      </Card>

    </>
  );
};

export default Profile;
