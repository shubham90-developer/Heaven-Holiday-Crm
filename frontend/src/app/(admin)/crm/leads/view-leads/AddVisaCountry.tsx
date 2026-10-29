"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Button, Modal, Card, Form, Row, Col, CardHeader, NavItem, CardBody } from "react-bootstrap";

const AddVisaCountry = ({
    visaCountry,
    setFormData,
}: any) => {

    const [showVisa, setShowVisa] = useState(
        visaCountry?.length || 0
    );

    const handleAddVisa = () => {

        setFormData((prev: any) => ({
            ...prev,

            visaCountry: [
                ...prev.visaCountry,

                {
                    country: "",
                    date: "",
                },
            ],
        }));

        setShowVisa(showVisa + 1);
    };

    const handleRemoveVisa = (index: number) => {

        setFormData((prev: any) => ({
            ...prev,

            visaCountry: prev.visaCountry.filter(
                (_: any, i: number) => i !== index
            ),
        }));

        setShowVisa(showVisa - 1);
    };

    const handleVisaChange = (
        index: number,
        field: string,
        value: string
    ) => {

        setFormData((prev: any) => {

            const updatedVisa =
                [...prev.visaCountry];

            updatedVisa[index][field] = value;

            return {
                ...prev,
                visaCountry: updatedVisa,
            };
        });
    };

    return (
        <>
            <div className="text-end">
                <Button variant="primary" size="sm" className="mb-2 justify-end"
                    style={{ fontSize: "10px" }}
                    onClick={handleAddVisa}
                >
                    <Icon icon="mdi:plus" className="me-1" />
                    Add Visa Country
                </Button>
            </div>

            {visaCountry?.map(
                (visa: any, index: any) => (

                    <Row
                        key={index}
                        className="mb-2"
                    >

                        <Col md={6}>

                            <Form.Label
                                className="text-primary"
                                style={{
                                    fontSize: "12px",
                                }}
                            >
                                Country
                            </Form.Label>

                            <Form.Control
                                size="sm"
                                style={{
                                    fontSize: "12px",
                                }}
                                value={visa.country}
                                onChange={(e) =>
                                    handleVisaChange(
                                        index,
                                        "country",
                                        e.target.value
                                    )
                                }
                            />

                        </Col>

                        <Col md={4}>

                            <Form.Label
                                className="text-primary"
                                style={{
                                    fontSize: "12px",
                                }}
                            >
                                Date
                            </Form.Label>

                            <Form.Control
                                type="date"
                                size="sm"
                                style={{
                                    fontSize: "12px",
                                }}
                                value={visa.date}
                                onChange={(e) =>
                                    handleVisaChange(
                                        index,
                                        "date",
                                        e.target.value
                                    )
                                }
                            />

                        </Col>

                        <Col md={2}>

                            <Button
                                variant="outline-dark"
                                size="sm"
                                className="mt-4"
                                onClick={() =>
                                    handleRemoveVisa(index)
                                }
                            >

                                <Icon icon="mdi:minus-circle" />

                            </Button>

                        </Col>

                    </Row>
                )
            )}

        </>
    )
}
export default AddVisaCountry;