"use client";

import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Table
} from "react-bootstrap";

const ViewEmail = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* Open Button */}
      <span className="text-primary" onClick={()=>setShow(true)} style={{cursor: "pointer"}}>
            View Email
          </span>

    <Modal
  show={show}
  onHide={() => setShow(false)}
  size="lg"
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Email Preview</Modal.Title>
  </Modal.Header>

  <Modal.Body
    style={{
      maxHeight: "75vh",
      overflowY: "auto",
      fontSize: "14px",
    }}
  >
    <h5 className="fw-bold">Dear Mr Samyak Arwade,</h5>

    <p className="mt-4">
      This is <strong>RAJENDRA BUGADE</strong> and I will be working with you
      to plan your trip to Thailand.
    </p>

    <p>
      Please find below details for your trip and feel free to call me at
      +91 8602410707 or{" "}
      <span
        style={{
          color: "#d1004b",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        click here
      </span>{" "}
      to view more details about this trip.
    </p>

    {/* Query Details */}
    <div className="mt-4">
      <div
        style={{
          background: "#d1004b",
          color: "#fff",
          padding: "8px 12px",
          fontWeight: 600,
        }}
      >
        Query Details
      </div>

      <Table bordered size="sm" className="mb-4">
        <tbody>
          <tr>
            <td><b>#Code :</b></td>
            <td>QS/26/2101613 (2183822)</td>
            <td><b>Total Guests :</b></td>
            <td>4</td>
          </tr>
          <tr>
            <td><b>No. of Nights :</b></td>
            <td>8 Nights & 9 Days</td>
            <td><b>Child :</b></td>
            <td>0</td>
          </tr>
          <tr>
            <td><b>Start City :</b></td>
            <td>Mumbai</td>
            <td><b>Start Date :</b></td>
            <td>Tue, 08 Sep, 2026</td>
          </tr>
          <tr>
            <td><b>Destination covered :</b></td>
            <td>Pattaya, Bangkok, Krabi, Phuket</td>
            <td><b>End Date :</b></td>
            <td>Wed, 16 Sep, 2026</td>
          </tr>
        </tbody>
      </Table>
    </div>

    {/* Proposed Inclusions */}
    <div
      style={{
        background: "#222",
        color: "#fff",
        padding: "8px 12px",
        fontWeight: 600,
      }}
    >
      Proposed Inclusions:
    </div>

    <Table bordered size="sm" className="mb-4">
      <tbody>
        <tr>
          <td width="28%">
            <b>Hotels</b>
          </td>
          <td>
            3N-Pattaya | 1N-Bangkok | 2N-Phuket
          </td>
        </tr>
        <tr>
          <td>
            <b>Flight</b>
          </td>
          <td>
            Mumbai to Bangkok (Flight) | Bangkok to Krabi (Flight) |
            Phuket to Mumbai (Flight)
          </td>
        </tr>
      </tbody>
    </Table>

    {/* Flight Option */}
    <div
      style={{
        background: "#222",
        color: "#fff",
        padding: "8px 12px",
        fontWeight: 600,
      }}
    >
      Flight Option
    </div>

    <div className="border p-2">
      <div
        style={{
          background: "#777",
          color: "#fff",
          padding: "8px",
          fontWeight: 600,
        }}
      >
        Mumbai to Bangkok Flight
      </div>

      <Table bordered size="sm" className="mb-0">
        <thead>
          <tr>
            <th>Airline / Flight No</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Stop</th>
            <th>Refundable</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Thai Vietjet Air
              <br />
              VZ-761
            </td>
            <td>
              Mumbai Airport (BOM)
              <br />
              08-Sep-26 | 00:55
            </td>
            <td>
              Bangkok Airport (BKK)
              <br />
              08-Sep-26 | 06:50
            </td>
            <td>Non Stop</td>
            <td>No</td>
          </tr>
        </tbody>
      </Table>
    </div>

    {/* Accommodation */}
<div
  style={{
    background: "#222",
    color: "#fff",
    padding: "8px 12px",
    fontWeight: 600,
    marginTop: "20px",
  }}
>
  Accommodation
</div>

<div className="small py-3">
  CP/BB-Bed & Breakfast MAP/Half Board-Breakfast, Lunch/Dinner
  AP/Full Board-Breakfast, Lunch & Dinner EP- Room Only
  AI- All Inclusive.
</div>

<Table bordered size="sm">
  <thead style={{ background: "#f0f0f0", color: "#fff" }}>
    <tr>
      <th>CITY</th>
      <th>HOTEL NAME</th>
      <th>CHECK IN - OUT</th>
      <th>NGT</th>
      <th>RATINGS</th>
      <th>ROOM DETAILS</th>
      <th>ROOMS</th>
      <th>ADULT (TWIN)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Pattaya</b></td>
      <td>Any 4 Star Hotel</td>
      <td>08-Sep-26 - 11-Sep-26</td>
      <td>3</td>
      <td>NA</td>
      <td>Standard(CP)</td>
      <td>2</td>
      <td>4</td>
    </tr>

    <tr>
      <td><b>Bangkok</b></td>
      <td>Any 4 Star Hotel</td>
      <td>11-Sep-26 - 12-Sep-26</td>
      <td>1</td>
      <td>NA</td>
      <td>Standard(CP)</td>
      <td>2</td>
      <td>4</td>
    </tr>

    <tr>
      <td><b>Phuket</b></td>
      <td>Any 4 Star Hotel</td>
      <td>14-Sep-26 - 16-Sep-26</td>
      <td>2</td>
      <td>NA</td>
      <td>Standard(CP)</td>
      <td>2</td>
      <td>4</td>
    </tr>
  </tbody>
</Table>

{/* Package Price Details */}
<div
  style={{
    background: "#222",
    color: "#fff",
    padding: "8px 12px",
    fontWeight: 600,
    marginTop: "20px",
  }}
>
  Package Price Details
</div>

<Table bordered size="sm">
  <thead style={{ background: "##f0f0f0", color: "#fff" }}>
    <tr>
      <th>PAX TYPE</th>
      <th>NO OF PAX</th>
      <th>COST PER PERSON</th>
      <th>TOTAL COST</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td><b>Adult Twin Sharing</b></td>
      <td>4</td>
      <td>INR 1,01,900</td>
      <td>INR 4,07,600</td>
    </tr>

    <tr>
      <td><b>Total Cost (Excl. GST)</b></td>
      <td>4</td>
      <td></td>
      <td>INR 4,07,600</td>
    </tr>

    <tr>
      <td colSpan={3} className="text-end fw-bold">
        Package Price (Excl. GST)
      </td>
      <td>INR 407600</td>
    </tr>

    <tr>
      <td colSpan={3} className="text-end fw-bold">
        Total GST
      </td>
      <td>INR 20380</td>
    </tr>

    <tr>
      <td colSpan={3} className="text-end fw-bold">
        Package Price (Incl. GST)
      </td>
      <td>INR 4,27,980</td>
    </tr>
  </tbody>
</Table>

{/* CTA Button */}
<div className="text-center my-4">
  <Button
    style={{
      background: "#d1004b",
      border: "none",
      borderRadius: 0,
      padding: "10px 30px",
      fontWeight: 600,
    }}
  >
    CLICK HERE to view more details and book online.
  </Button>
</div>

{/* Itinerary Details */}
<div
  style={{
    background: "#222",
    color: "#fff",
    padding: "8px 12px",
    fontWeight: 600,
    marginTop: "20px",
  }}
>
  Itinerary Details
</div>

{/* Day 1 */}
<div className="border mt-3">
  <div className="d-flex">
    <div
      style={{
        width: "28%",
        background: "#efefef",
        padding: "10px",
        fontWeight: 600,
      }}
    >
      Day 1: 08-Sep-26
    </div>

    <div
      style={{
        flex: 1,
        background: "#f8f8f8",
        padding: "10px",
      }}
    >
      MUMBAI TO BANGKOK - PATTAYA - ALCASER SHOW
    </div>
  </div>

  <div className="p-3">
    <div className="row">
      <div className="col-md-3">
        <img
          src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600"
          alt="Alcazar Show"
          className="img-fluid"
        />
      </div>

      <div className="col-md-9">
        <p>
          Welcome to A Heaven Holiday. Catch early morning flight to
          Bangkok from Mumbai. Arrival at Bangkok transfer to Pattaya
          check-in to hotel and take a lunch and some time rest.
          In the evening we will enjoy a Alcaser Show. Then we will
          enjoy a dinner. Overnight stay in Pattaya.
        </p>

        <p>
          <strong>Sightseeing(s):</strong> Alcazar Show |
          <span style={{ color: "#d1004b", fontWeight: 600 }}>
            {" "}click here
          </span>{" "}
          to view package details
        </p>

        <p>
          <strong>Meal:</strong> Lunch, Dinner
        </p>
      </div>
    </div>
  </div>
</div>

{/* Day 2 */}
<div className="border mt-4">
  <div className="d-flex">
    <div
      style={{
        width: "28%",
        background: "#efefef",
        padding: "10px",
        fontWeight: 600,
      }}
    >
      Day 2: 09-Sep-26
    </div>

    <div
      style={{
        flex: 1,
        background: "#f8f8f8",
        padding: "10px",
      }}
    >
      Pattaya Coral Island Tour
    </div>
  </div>

  <div className="p-3">
    <div className="row">
      <div className="col-md-3">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
          alt="Coral Island"
          className="img-fluid"
        />
      </div>

      <div className="col-md-9">
        <p>
          After a scrumptious breakfast, speedboat your way to the
          idyllic Coral Island (Koh Lan) followed by lunch through the
          sparkling aqua blue waters of the Gulf of Thailand. Then enjoy
          water activities (own cost). After that enjoy Dinner and
          overnight stay at Pattaya.
        </p>

        <p>
          <strong>Sightseeing(s):</strong> Coral Island |
          <span style={{ color: "#d1004b", fontWeight: 600 }}>
            {" "}click here
          </span>{" "}
          to view package details
        </p>

        <p>
          <strong>Meal:</strong> Breakfast, Lunch, Dinner
        </p>
      </div>
    </div>
  </div>
</div>


  </Modal.Body>
</Modal>
    
    </>
  );
};

export default ViewEmail;