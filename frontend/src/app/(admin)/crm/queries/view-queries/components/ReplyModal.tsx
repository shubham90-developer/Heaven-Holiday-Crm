"use client";

import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
const ReplyModal = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* Open Button */}
      <Button
        variant="link"
        size="sm"
        onClick={() => setShow(true)}
      >
      <Icon icon="mdi:comment" />
      </Button>

      {/* Modal */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        size="lg"
      >
        {/* Header */}
        <Modal.Header
          style={{
            borderBottom: "none",
            paddingBottom: "0px",
          }}
        >
          <button
            onClick={() => setShow(false)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "28px",
              color: "#bdbdbd",
              marginLeft: "auto",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </Modal.Header>

        {/* Body */}
        <Modal.Body>
          
          {/* Input + Button */}
          <div className="d-flex align-items-end gap-3 mb-5">
            
            <Form.Group className="flex-grow-1">
              <Form.Label
                style={{ fontSize: "12px" }}
              >
                Reply to customer
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Control
                type="text"
                size="sm"
              />
            </Form.Group>

            <Button
              variant="success"
              size="sm"
              style={{
                height: "34px",
                padding: "0px 18px",
                fontWeight: "600",
              }}
            >
              Reply
            </Button>
          </div>

          {/* No Record */}
          <div
            style={{
              background: "#f9e5e5",
              color: "#c0392b",
              padding: "10px",
              fontSize: "12px",
            }}
          >
            No record Found
          </div>

        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReplyModal;