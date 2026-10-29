import React, { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js';
import { Modal, Button, Card, Col, Row, Form } from 'react-bootstrap'

const ViewPriceDetailModal = () =>{
    const [showModal, setShowModal]=useState(false)
    return (
        <>
         <Button
                variant="outline-primary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={()=>setShowModal(true)}
              >
              View Price Details
              </Button>
        <Modal show={showModal} onHide={()=>setShowModal(false)} sentered>
              <Modal.Header
                          style={{ background: "#274c6b", color: "#fff" }}
                          className="d-flex justify-content-between"
                          >
                            <Modal.Title style={{ fontSize: "14px" }}>Price Details</Modal.Title>
                
                              <button
                            onClick={()=>setShowModal(false)}
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

                          <Modal.Body style={{fontSize:"12px"}}>
                            <table  className="table table-sm table-bordered mb-0 align-middle"
                style={{tableLayout: "fixed", width:"100%"}}
               >
                                <tbody style={{fontSize:"10px", whiteSpace:"nowrap"}}>
                                    <td>Total Price</td>
                                    <td>INR 0.00</td>
                                </tbody>
                            </table>
                          </Modal.Body>
        </Modal>

        </>
    )
}
export default ViewPriceDetailModal;