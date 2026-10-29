"use client";

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    CUSTOMER_STORAGE_KEY,
    CustomerDetails,
} from "../types/packageBooking";

const leadSources = [
    { value: "4513", label: "Agency" },
    { value: "4514", label: "Website" },
    { value: "4515", label: "Facebook" },
    { value: "4516", label: "Tripsgateway" },
    { value: "4517", label: "Website B2B" },
    { value: "4518", label: "Proposal" },
    { value: "4519", label: "GTX Network" },
    { value: "4520", label: "GTX Network Web" },
    { value: "6888", label: "Instagram" },
    { value: "8412", label: "Old Customer" },
    { value: "8413", label: "Reference" },
    { value: "8414", label: "Walk-in" },
];

const B2CVoucherModal: React.FC = () => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        email: "",
        mobile: "",
        salutation: "",
        firstName: "",
        lastName: "",
        leadSource: "",
        leadStage: "53",
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!form.email || !form.mobile || !form.firstName) {
            toast.error("Please fill Email, Mobile and First Name");
            return;
        }

        const customerDetails: CustomerDetails = {
            customerType: "B2C",
            email: form.email,
            mobile: form.mobile,
            salutation: form.salutation,
            firstName: form.firstName,
            lastName: form.lastName,
            leadSource: form.leadSource,
            leadStage: form.leadStage,
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
                B2C Voucher
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header
                    style={{ background: "#274c6b", color: "#fff" }}
                    className="d-flex justify-content-between"
                >
                    <Modal.Title>Add Customer</Modal.Title>
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
                        <Row className="g-1">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label
                                        className="text-primary"
                                        style={{ fontSize: "10px" }}
                                    >
                                        Email ID *
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        size="sm"
                                        value={form.email}
                                        onChange={(e) =>
                                            handleChange("email", e.target.value)
                                        }
                                        style={{ fontSize: "10px", padding: "8px" }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label
                                        className="text-primary"
                                        style={{ fontSize: "10px" }}
                                    >
                                        Mobile Number *
                                    </Form.Label>
                                    <InputGroup size="sm" style={{ fontSize: "10px" }}>
                                        <InputGroup.Text>🇮🇳 +91</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            value={form.mobile}
                                            onChange={(e) =>
                                                handleChange("mobile", e.target.value)
                                            }
                                            style={{ fontSize: "10px", padding: "8px" }}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label
                                        className="text-primary"
                                        style={{ fontSize: "10px" }}
                                    >
                                        Salutation
                                    </Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={form.salutation}
                                        onChange={(e) =>
                                            handleChange("salutation", e.target.value)
                                        }
                                        style={{ fontSize: "10px", padding: "8px" }}
                                    >
                                        <option value="">Select</option>
                                        <option>Mr.</option>
                                        <option>Ms.</option>
                                        <option>Mrs.</option>
                                        <option>Miss</option>
                                        <option>Dr.</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={8}>
                                <Form.Group>
                                    <Form.Label
                                        className="text-primary"
                                        style={{ fontSize: "10px" }}
                                    >
                                        First Name *
                                    </Form.Label>
                                    <Form.Control
                                        size="sm"
                                        value={form.firstName}
                                        onChange={(e) =>
                                            handleChange("firstName", e.target.value)
                                        }
                                        style={{ fontSize: "10px", padding: "8px" }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label
                                        className="text-primary"
                                        style={{ fontSize: "10px" }}
                                    >
                                        Last Name
                                    </Form.Label>
                                    <Form.Control
                                        size="sm"
                                        value={form.lastName}
                                        onChange={(e) =>
                                            handleChange("lastName", e.target.value)
                                        }
                                        style={{ fontSize: "10px", padding: "8px" }}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label
                                        className="text-primary"
                                        style={{ fontSize: "10px" }}
                                    >
                                        Lead Source
                                    </Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={form.leadSource}
                                        onChange={(e) =>
                                            handleChange("leadSource", e.target.value)
                                        }
                                        style={{ fontSize: "12px" }}
                                    >
                                        <option value="">Select Lead Source</option>
                                        {leadSources.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label
                                        className="text-primary"
                                        style={{ fontSize: "10px" }}
                                    >
                                        Lead Stage
                                    </Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={form.leadStage}
                                        onChange={(e) =>
                                            handleChange("leadStage", e.target.value)
                                        }
                                        style={{ fontSize: "10px", padding: "8px" }}
                                    >
                                        <option value="53">New</option>
                                        <option value="52">Call Back</option>
                                        <option value="49">Not Interested</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer className="justify-content-between">
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleClose}
                        style={{ fontSize: "10px" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        style={{ fontSize: "10px" }}
                        onClick={handleSubmit}
                    >
                        <Icon icon="mdi:account-plus-outline" className="me-1" /> Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default B2CVoucherModal;
