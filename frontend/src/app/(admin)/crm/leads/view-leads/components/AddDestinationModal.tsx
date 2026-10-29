import React from 'react'

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { on } from 'events';
import {
  useCreateDestinationMutation
} from "../../../../../../store/services/destinationApi";

import {
  useSearchParams
} from "next/navigation";
import toast from "react-hot-toast";

type AddDestinationModalProps = {
  onClose: () => void;
}
const AddDestinationModal = ({ onClose }: AddDestinationModalProps) => {

  const searchParams =
    useSearchParams();

  const leadId =
    searchParams.get("id");


  // RTK MUTATION
  const [
    createDestination,
    {
      isLoading,
    },
  ] =
    useCreateDestinationMutation();


  // FORM STATE
  const [
    country,
    setCountry,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");


  // SUBMIT
  const handleSubmit =
    async () => {

      if (
        !country ||
        !city ||
        !leadId
      ) {
        return;
      }

      try {

        await createDestination({
          leadId,
          country,
          city,
        }).unwrap();

        onClose();
        toast.success("Destination saved successfully");

      } catch (error: any) {

        console.log(error);
        toast.error(error?.data?.message || "Something went wrong");
      }
    };

  return (
    <>
      <Modal show={true} onHide={onClose} size="sm" centered>
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title style={{ fontSize: "14px" }}>
            I want to go
          </Modal.Title>

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
        <Modal.Body style={{ fontSize: "12px" }}>
          <Form>
            <Col md={12}>
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >Select Country</Form.Label>
              <Form.Select size="sm" style={{ fontSize: "12px" }} value={country}
                onChange={(e) =>
                  setCountry(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select
                </option>

                <option value="India">
                  India
                </option>

                <option value="Dubai">
                  Dubai
                </option>
              </Form.Select>
            </Col>
            <Col md={12} className="mt-2">
              <Form.Label
                className="text-primary"
                style={{ fontSize: "12px" }}
              >
                City
              </Form.Label>
              <Form.Control size="sm" style={{ fontSize: "12px" }} value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                } />
            </Col>
          </Form>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={onClose}
            style={{ fontSize: "12px" }}
          >
            Cancel
          </Button>

          <Button variant="success" size="sm" style={{ fontSize: "12px" }} onClick={handleSubmit}
            disabled={isLoading}>
            <Icon icon="akar-icons:check" className="me-1" />
            {
              isLoading
                ? "Submitting..."
                : "Submit"
            }
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default AddDestinationModal
