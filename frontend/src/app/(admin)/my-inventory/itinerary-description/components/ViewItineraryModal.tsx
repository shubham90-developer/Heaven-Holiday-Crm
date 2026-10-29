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
import {
  useGetItineraryByIdQuery,
} from "../../../../../store/services/inventory/itinerary-description/itineraryDescriptionApi";

type ViewItineraryModalProps = {
  onClose: () => void;
  itineraryId: string;
}
const ViewItineraryModal = ({ onClose, itineraryId }: ViewItineraryModalProps) => {

  const { data, isLoading } =
    useGetItineraryByIdQuery(itineraryId);

  const itinerary = data?.data;

  return (
    <>
      <Modal show={true} onHide={onClose} centered size="lg">
        {/* Header */}
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title>View Itinerary</Modal.Title>

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
            <p>Loading...</p>
          ) : (
            <Form>
              <Row className="g-2" style={{ fontSize: "12px" }}>
                <Col md={6}>
                  <strong>Start City:</strong>{" "}
                  {itinerary?.startCity}
                </Col>

                <Col md={6}>
                  <strong>Destination City:</strong>{" "}
                  {itinerary?.destinationCity}
                </Col>

                <Col md={12}>
                  <strong>Title:</strong>{" "}
                  {itinerary?.title}
                </Col>

                <Col md={12}>
                  <strong>Status:</strong>{" "}
                  {itinerary?.status}
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>

      </Modal>
    </>
  )
}

export default ViewItineraryModal
