import React from 'react'

import { Icon } from "@iconify/react";
import { useState } from "react";
import { Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import {
  useGetSightseeingByIdQuery,
} from "../../../../../store/services/inventory/sightseeing/sightSeeingApi";

type ViewSightseeingModalProps = {
  sightseeingId: string;
  onClose: () => void;
};

const data = {
  country: "Sri Lanka",
  city: "Nuwara Eliya",
  name: "ravana lake",
  categoryGroup: "N/A",
  categoryType: "N/A",
  operatingTime: "",
  duration: "0",
  difficulty: "N/A",
  thingsToCarry: "NA",
};

const ViewSightseeingModal = ({
  sightseeingId,
  onClose,
}: ViewSightseeingModalProps) => {

  const { data, isLoading, error } =
    useGetSightseeingByIdQuery(sightseeingId);

  const sightseeing = data?.data;

  return (
    <>
      <Modal show={true} onHide={onClose} centered >
        {/* Header */}
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title> View Sightseeing (
            {sightseeing?.sightseeingName || "Loading..."}
            )</Modal.Title>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </Modal.Header>

        {/* BODY */}

        <Modal.Body>

          {isLoading ? (
            <div className="text-center py-4">
              Loading sightseeing details...
            </div>
          ) : error ? (
            <div className="text-danger text-center py-4">
              Failed to load sightseeing details
            </div>
          ) : (
            <Row className="mb-3" style={{ fontSize: "12px" }}>
              <Col md={4} className="mb-3">
                <strong>Country</strong>
                <div>{sightseeing?.country || "N/A"}</div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>City</strong>
                <div>{sightseeing?.city || "N/A"}</div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Sightseeing Name</strong>
                <div>{sightseeing?.sightseeingName || "N/A"}</div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Category</strong>
                <div>{sightseeing?.category || "N/A"}</div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Activities</strong>
                <div>{sightseeing?.activities || "N/A"}</div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Difficulty Level</strong>
                <div>{sightseeing?.difficultyLevel || "N/A"}</div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Season</strong>
                <div>{sightseeing?.season || "N/A"}</div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Days of Week</strong>
                <div>{sightseeing?.daysOfWeek || "N/A"}</div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Popularity</strong>
                <div>{sightseeing?.popularity || "N/A"}</div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Duration</strong>
                <div>
                  {sightseeing?.durationDays || 0} Days{" "}
                  {sightseeing?.durationMinutes || 0} Minutes
                </div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Min / Max Pax</strong>
                <div>
                  {sightseeing?.minPax} / {sightseeing?.maxPax}
                </div>
              </Col>

              <Col md={4} className="mb-3">
                <strong>Age Group</strong>
                <div>
                  {sightseeing?.minAge} - {sightseeing?.maxAge} yrs
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <strong>Operating Time</strong>
                <div>
                  {sightseeing?.operatingTime?.length > 0 ? (
                    sightseeing.operatingTime.map(
                      (slot: any, index: number) => (
                        <div key={index}>
                          {slot.from} - {slot.to}
                        </div>
                      )
                    )
                  ) : (
                    "N/A"
                  )}
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <strong>Things To Carry</strong>
                <div>{sightseeing?.thingsToCarry || "N/A"}</div>
              </Col>

              <Col md={6} className="mb-3">
                <strong>Pickup Point</strong>
                <div>{sightseeing?.pickupPoint || "N/A"}</div>
              </Col>

              <Col md={6} className="mb-3">
                <strong>Pickup Time</strong>
                <div>{sightseeing?.pickupTime || "N/A"}</div>
              </Col>

              <Col md={12} className="mb-3">
                <strong>Address</strong>
                <div>{sightseeing?.address || "N/A"}</div>
              </Col>

              <Col md={12} className="mb-3">
                <strong>Details</strong>
                <div>{sightseeing?.details || "N/A"}</div>
              </Col>

              <Col md={12} className="mb-3">
                <strong>Other Inclusions</strong>
                <div>{sightseeing?.otherInclusions || "N/A"}</div>
              </Col>

              <Col md={12} className="mb-3">
                <strong>Advisory</strong>
                <div>{sightseeing?.advisory || "N/A"}</div>
              </Col>

              <Col md={12} className="mb-3">
                <strong>Cancellation Policy</strong>
                <div>{sightseeing?.cancellationPolicy || "N/A"}</div>
              </Col>

              <Col md={12} className="mb-3">
                <strong>Refund Policy</strong>
                <div>{sightseeing?.refundPolicy || "N/A"}</div>
              </Col>

              <Col md={12} className="mb-3">
                <strong>Confirmation Policy</strong>
                <div>{sightseeing?.confirmationPolicy || "N/A"}</div>
              </Col>

              <Col md={12}>
                <strong>Terms & Conditions</strong>
                <div>{sightseeing?.termsConditions || "N/A"}</div>
              </Col>
            </Row>
          )}

        </Modal.Body>
      </Modal>
    </>
  )
}

export default ViewSightseeingModal
