"use client";

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    CUSTOMER_STORAGE_KEY,
    CustomerDetails,
} from "../types/packageBooking";

const B2BVoucherModal = () => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [type, setType] = useState("agency");
    const [showMore, setShowMore] = useState(false);
    const [form, setForm] = useState({
        companyName: "",
        email: "",
        salutation: "",
        firstName: "",
        lastName: "",
        mobile: "",
        rm: "RAJENDRA BUGADE",
        country: "",
        state: "",
        city: "",
        area: "",
        pincode: "",
        address: "",
        remarks: "",
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!form.companyName || !form.email || !form.mobile) {
            toast.error("Please fill Company Name, Email and Mobile");
            return;
        }

        const customerDetails: CustomerDetails = {
            customerType: "B2B",
            type,
            companyName: form.companyName,
            email: form.email,
            salutation: form.salutation,
            firstName: form.firstName,
            lastName: form.lastName,
            mobile: form.mobile,
            rm: form.rm,
            remarks: form.remarks,
        };

        sessionStorage.setItem(
            CUSTOMER_STORAGE_KEY,
            JSON.stringify(customerDetails)
        );
        setShow(false);
        router.push("/bookings/Packages/build-your-own");
    };

    return (
        <>
            <Button
                variant="outline-danger"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={handleShow}
            >
                <Icon icon="mdi:account-plus-outline" className="me-1" />
                B2B Voucher
            </Button>

            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header
                    style={{ background: "#274c6b", color: "#fff" }}
                    className="d-flex justify-content-between"
                >
                    <Modal.Title>Add-B2B-Agent</Modal.Title>
                    <button
                        onClick={handleClose}
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

                <Modal.Body>
                    <Form>
                        <Row className="mb-1 align-items-center">
                            <Col md={6}>
                                <Form.Label
                                    style={{ fontSize: "10px" }}
                                    className="text-primary"
                                >
                                    Type :
                                </Form.Label>
                                <div className="d-flex gap-3">
                                    <Form.Check
                                        type="radio"
                                        label="Agency"
                                        checked={type === "agency"}
                                        onChange={() => setType("agency")}
                                        style={{ fontSize: "10px" }}
                                        className="text-primary"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Corporate"
                                        checked={type === "corporate"}
                                        onChange={() => setType("corporate")}
                                        style={{ fontSize: "10px" }}
                                        className="text-primary"
                                    />
                                </div>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label
                                        style={{ fontSize: "10px" }}
                                        className="text-primary"
                                    >
                                        Company Name *
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.companyName}
                                        onChange={(e) =>
                                            handleChange("companyName", e.target.value)
                                        }
                                        style={{ fontSize: "10px" }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-1">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label
                                        style={{ fontSize: "10px" }}
                                        className="text-primary"
                                    >
                                        Email Id *
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email Id"
                                        value={form.email}
                                        onChange={(e) =>
                                            handleChange("email", e.target.value)
                                        }
                                        style={{ fontSize: "10px" }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label
                                        style={{ fontSize: "10px" }}
                                        className="text-primary"
                                    >
                                        Salutation
                                    </Form.Label>
                                    <Form.Select
                                        value={form.salutation}
                                        onChange={(e) =>
                                            handleChange("salutation", e.target.value)
                                        }
                                        style={{ fontSize: "10px" }}
                                    >
                                        <option value="">Select</option>
                                        <option>Mr.</option>
                                        <option>Ms.</option>
                                        <option>Mrs.</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label
                                        style={{ fontSize: "10px" }}
                                        className="text-primary"
                                    >
                                        First Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.firstName}
                                        onChange={(e) =>
                                            handleChange("firstName", e.target.value)
                                        }
                                        style={{ fontSize: "10px" }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-1">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label
                                        style={{ fontSize: "10px" }}
                                        className="text-primary"
                                    >
                                        Last Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.lastName}
                                        onChange={(e) =>
                                            handleChange("lastName", e.target.value)
                                        }
                                        style={{ fontSize: "10px" }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>&nbsp;</Form.Label>
                                    <Form.Control
                                        value="+91"
                                        readOnly
                                        style={{ fontSize: "10px" }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label
                                        style={{ fontSize: "10px" }}
                                        className="text-primary"
                                    >
                                        Mobile Number *
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.mobile}
                                        onChange={(e) =>
                                            handleChange("mobile", e.target.value)
                                        }
                                        style={{ fontSize: "10px" }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-1">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label
                                        style={{ fontSize: "10px" }}
                                        className="text-primary"
                                    >
                                        RM
                                    </Form.Label>
                                    <Form.Select
                                        value={form.rm}
                                        onChange={(e) =>
                                            handleChange("rm", e.target.value)
                                        }
                                        style={{ fontSize: "10px" }}
                                    >
                                        <option>RAJENDRA BUGADE</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div
                            className="mb-2"
                            style={{ color: "#ff6600", cursor: "pointer", fontSize: "10px" }}
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? "Show Less" : "Show More"}
                        </div>

                        {showMore && (
                            <>
                                <Row className="mb-1">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label
                                                style={{ fontSize: "10px" }}
                                                className="text-primary"
                                            >
                                                Country
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.country}
                                                onChange={(e) =>
                                                    handleChange("country", e.target.value)
                                                }
                                                style={{ fontSize: "10px" }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label
                                                style={{ fontSize: "10px" }}
                                                className="text-primary"
                                            >
                                                State
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.state}
                                                onChange={(e) =>
                                                    handleChange("state", e.target.value)
                                                }
                                                style={{ fontSize: "10px" }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-1">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label
                                                style={{ fontSize: "10px" }}
                                                className="text-primary"
                                            >
                                                City
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.city}
                                                onChange={(e) =>
                                                    handleChange("city", e.target.value)
                                                }
                                                style={{ fontSize: "10px" }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label
                                                style={{ fontSize: "10px" }}
                                                className="text-primary"
                                            >
                                                Area
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.area}
                                                onChange={(e) =>
                                                    handleChange("area", e.target.value)
                                                }
                                                style={{ fontSize: "10px" }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-1">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label
                                                style={{ fontSize: "10px" }}
                                                className="text-primary"
                                            >
                                                Pincode
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.pincode}
                                                onChange={(e) =>
                                                    handleChange("pincode", e.target.value)
                                                }
                                                style={{ fontSize: "10px" }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label
                                                style={{ fontSize: "10px" }}
                                                className="text-primary"
                                            >
                                                Address
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={form.address}
                                                onChange={(e) =>
                                                    handleChange("address", e.target.value)
                                                }
                                                style={{ fontSize: "10px" }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        )}

                        <Form.Group>
                            <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                                Remarks
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={form.remarks}
                                onChange={(e) =>
                                    handleChange("remarks", e.target.value)
                                }
                                style={{ fontSize: "10px" }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="outline-danger"
                        onClick={handleClose}
                        style={{ fontSize: "10px" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        style={{ fontSize: "10px" }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default B2BVoucherModal;
