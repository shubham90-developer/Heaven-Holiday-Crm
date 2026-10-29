"use client"

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

import  Offcanvas from "react-bootstrap/Offcanvas";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import CustomFlatpickr from "@/components/CustomFlatpickr";

function OffCanvasExample({name, ...props}:any){
    const [show, setShow]=useState(false);

    const handleClose = ()=> setShow(false);
    const handleShow = ()=> setShow(true);

    return (
        <>
          <Button
                variant="outline-primary"
                onClick={handleShow}
                className="me-2"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
              >
                <Icon icon="tabler:filter" width="12" /> {name}
              </Button>

              <Offcanvas 
              show={show}
              onHide={handleClose}
              placement="end"
              style={{width:"900px"}}
              >
                <Offcanvas.Header
                style={{
                    background: "#274c6b",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
                >
                    <Offcanvas.Title>
                        <Icon icon="tabler:filter" className="me-2"/>
                        Filter Results
                    </Offcanvas.Title>

                    <button
                    onClick={handleClose}
                    style={{
                        background:"transparent",
                        border:"none",
                        color:"#fff",
                        fontSize:"18px",
                        cursor: "ponter",
                    }}
                    >
                         ✕
                    </button>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <Row className="g-3">
                             <Col md={3}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "12px" }}
                  className="text-primary"
                >
                Proposal ID
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} />
              </Form.Group>
            </Col>

             <Col md={3}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "12px" }}
                  className="text-primary"
                >
                  Visa Name
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} />
              </Form.Group>
            </Col>

             <Col md={3}>
                          <Form.Group>
                            <Form.Label
                              style={{ fontSize: "12px" }}
                              className="text-primary"
                            >
                              Pax Name
                            </Form.Label>
                            <Form.Control size="sm" style={{ fontSize: "12px" }} />
                          </Form.Group>
                        </Col>

                         <Col md={3}>
                                      <Form.Group>
                                        <Form.Label
                                          style={{ fontSize: "12px" }}
                                          className="text-primary"
                                        >
                                         Passport Number
                                        </Form.Label>
                                        <Form.Control size="sm" style={{ fontSize: "12px" }} />
                                      </Form.Group>
                                    </Col>

                                     <Col md={3}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "12px" }}
                  className="text-primary"
                >
                  Country
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }} />
              </Form.Group>
            </Col>

                <Col md={3}>
                        <Form.Group>
                            <Form.Label
                            style={{fontSize:"12px"}}
                            className="text-primary"
                            >Booking Date</Form.Label>
                            <CustomFlatpickr
                            className="form-control"
                            options={{enableTime: false}}
                            style={{fontSize : "12px"}}
                            />
                            </Form.Group>
                            </Col>

                        <Col md={3}>
              <Form.Group>
                <Form.Label
                  style={{ fontSize: "12px" }}
                  className="text-primary"
                >
               Ops Users
                </Form.Label>
                <Form.Select size="sm" style={{ fontSize: "12px" }}>
                  <option>Select Ops Users</option>
                  <option value={1}>PRAJWAL BUGADE </option>
                  <option value={2}>PRANAV KADAM </option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
                          <Form.Group>
                            <Form.Label
                              style={{ fontSize: "12px" }}
                              className="text-primary"
                            >
                          Visa Status
                            </Form.Label>
                            <Form.Select size="sm" style={{ fontSize: "12px" }}>
                              <option>Select Visa Status</option>
                              <option value={1}>Visa Approved  </option>
                              <option value={2}>Visa Rejected </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                    </Row>

                    <div style={{borderTop: "1px dotted #000"}} className="mt-5"></div>
                      <div className="d-flex justify-content-end mt-1 gap-2">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  style={{ fontSize: "12px", fontWeight: "bold" }}
                                >
                                  Reset
                                </Button>
                    
                                <Button
                                  variant="success"
                                  size="sm"
                                  style={{ fontSize: "12px", fontWeight: "bold" }}
                                >
                                  <Icon
                                    icon="tabler:search"
                                    className="me-1"
                                    style={{ fontSize: "12px" }}
                                  />
                                  Filter
                                </Button>
                              </div>
                </Offcanvas.Body>
              </Offcanvas>
        </>
    )
}

function Filter(){
    return (
        <>
        <OffCanvasExample placement="end" name="Filter"/>
        </>
    )
}

export default Filter;