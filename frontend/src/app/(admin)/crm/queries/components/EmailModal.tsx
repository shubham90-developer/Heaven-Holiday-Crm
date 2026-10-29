"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Button, Modal, Table, Form } from "react-bootstrap";

const EmailModal = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      {/* BUTTON */}
     <Button
                   variant="warning"
                   size="sm"
                   className="ql-btn-orange"
                   onClick={()=>setShow(true)}
                 >
                   Email
                 </Button>

      {/* ================= HISTORY MODAL ================= */}
      <Modal show={show} onHide={() => setShow(false)} size="sm" centered>
        <Modal.Header
          style={{
            background: "#274c6b",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Modal.Title>Alert !</Modal.Title>

          <button
            onClick={() => setShow(false)}
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

        <Modal.Body style={{ fontSize: "11px" }}>
            
            <span>Please select at least one record for action.</span>

<div className="text-end">
     <Button variant='primary' size='sm'
      style={{ fontSize: "10px" }}
      onClick={()=>setShow(false)}>OK</Button>
</div>
          </Modal.Body>

          </Modal>
          </>
  )
}

export default EmailModal;