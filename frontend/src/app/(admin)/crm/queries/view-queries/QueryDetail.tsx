"use client";

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import RemarkBox from "./components/RemarkBox";
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
import SmsModal from "./components/SmsModal";
import Summary from "./components/Summary";
import Proposals from "./components/Proposals";
import ModifyQuery from "./ModifyQuery";
import QueryContact from "./components/QueryContact";
import Remarks from "./components/Remarks";
import TodoModal from "../../leads/view-leads/components/TodoModal";

const QueryDetail = () => {
  const [editname, setEditName] = useState(false)
  const [step, setStep] = useState(1);
  const router = useRouter()
const[showQuery, setShowQuery] = useState(true);
const [activeTab, setActiveTab] = useState("Profile");
const [todo , setTodo] = useState(false);
const [payment, setPayment] = useState(false);
const [smstemp, setSmstemp] = useState(false);
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
          Yash Gargatti
       </span>
      </div>

      <div>
        Customer Type :{" "}
        <span className="text-primary">B2C</span>
      </div>

      <div>
        <strong>Last Remark :</strong>
      </div>
    </Col>

    {/* Center Left */}
    <Col md={3}>
      <div>Contact No : +91 9886450031</div>

      <div>
        Owner name :{" "}
        <span className="text-dark" onClick={() => setEditName(!editname)}
        >Pallavi Laskeshri</span>
        { editname && ( 
          <>
          <Form.Control size="sm" />
          <Icon icon="mdi: close" onClick={()=>setEditName(!editname)} />
          </>
        )}
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
          9886450031.aheaven@gmail.com
        </span>
      </div>
    </Col>

    {/* Right */}
    <Col md={3} className="text-md-end mt-2 mt-md-0">
      <div>
        Active Since :{" "}
        <span className="text-primary">
          22-May-26 03:57:07
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
          Q/26/2100564-KUTA,SEMINYAK-Package
        </span>
      </div>

      <div className="mt-4">
        Created On :{" "}
        <span className="text-primary">22-May-26</span>
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
          Package (Id: )
        </span>
      </div>

      <div>
        No of Pax :{" "}
        <span className="text-primary">
          2 Adults
        </span>
      </div>

      <div>
        Room :{" "}
        <span className="text-primary">
          1 [Adults: 2]
        </span>
      </div>

      <div className="mt-4">
        Updated On :{" "}
        <span className="text-primary">
          22-May-26
        </span>
      </div>

      <div>Source : Agency Default</div>
    </Col>

    {/* Center Right */}
    <Col md={3}>
      <div>
        Query ID :{" "}
        <span className="text-primary">
          Q/26/2100564
        </span>
      </div>

      <div>
        Travel Date :{" "}
        <span className="text-primary">
          16-Aug-26
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
          Kuta,Seminyak
        </span>
      </div>

      <div>
        Inclusions/Theme :{" "}
        <span className="text-primary">
          Flight,Hotel,All Tours,
          Intercity Transfers,Sightseeing,
          Guided Tours,Visa / Group Tours
        </span>
      </div>

      <div>
        Status :{" "}
        <span className="text-primary">
          Proposal Sent
        </span>
      </div>
    </Col>
  </Row>

  <hr className="my-1" />

  {/* Bottom Action Section */}
  <Row className="px-3 py-3 align-items-center">
    
    <Col md={2}>
     <RemarkBox/>
    </Col>

    <Col md={2}>
      <Button
        variant="outline-primary"
        size="sm"
        style={{ fontSize: "12px" }}
      >
        All Queries
      </Button>
    </Col>

    <Col md={2}>
      <Form.Group>
        <Form.Select
          size="sm"
          style={{ fontSize: "12px" }}
        >
            <option>Select Lead Status</option>
          <option>Proposal Sent</option>
        </Form.Select>
      </Form.Group>
    </Col>

    <Col md={2}>
      <Form.Group>
        <Form.Select
          size="sm"
          style={{ fontSize: "12px" }}
        >
            <option>Select Lead Quality</option>
          <option>Warm</option>
        </Form.Select>
      </Form.Group>
    </Col>

    <Col
      md={4}
      className="text-md-end mt-3 mt-md-0"
    >
        <div className="d-flex gap-2">
      <SmsModal/>

          <TodoModal/>
    
      <Button
        variant="danger"
        size="sm"
        style={{ fontSize: "10px" }}
        onClick={() => setShowQuery(!showQuery)}
      >
        Send Proposal/Modify Query
      </Button>
</div>
    
    </Col>
  </Row>
</Card>

       {showQuery && <ModifyQuery/>  } 

        <Card>
          <div className="d-flex justify-content-between p-2">
          <div className="d-flex gap-2">
            {["Summary","Proposals","Query Contact","Remarks", "ToDo's/Follow up's"].map((item)=>(
              <span key={item}
              onClick={()=>setActiveTab(item)} 
              style={{fontSize:"12px",
                cursor:"pointer",
              borderBottom:activeTab===item? "2px solid #000":"none"}} >{item}</span>
            )
            )}
          </div>
          <Button variant="outline-danger" size="sm" className="me-2" style={{fontSize:"10px"}} onClick={()=>setActiveTab("Bookings")}>Update Payment</Button>
        </div>
        </Card>

        <Card>
          { activeTab === "Summary" && ( <Summary/>)}
          { activeTab === "Proposals" && ( <Proposals queryId="" />)}
          { activeTab === "Query Contact" && ( <QueryContact/>)}
          { activeTab === "Remarks" && ( <Remarks/>)}
    
        
        </Card>
     
    </>
  );
};

export default QueryDetail;
