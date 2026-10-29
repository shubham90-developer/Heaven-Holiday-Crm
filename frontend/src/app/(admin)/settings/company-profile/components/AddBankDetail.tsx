"use client"
import React from 'react'
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import {
  useCreateBankDetailMutation, useUpdateBankDetailMutation
} from "../../../../../store/services/settings/company-profile/bankDetailsApi";
import toast from "react-hot-toast";

type AddBankDetailProps = {
  onClose: () => void;
  bankData?: any;
}

const AddBankDetail = ({ onClose, bankData }: AddBankDetailProps) => {

  const [createBankDetail, { isLoading }] = useCreateBankDetailMutation();
  const [updateBankDetail, { isLoading: isUpdating }] = useUpdateBankDetailMutation();

  const [formData, setFormData] = useState({
    accountHolderName: bankData?.accountHolderName || "",
    accountNumber: bankData?.accountNumber || "",
    ifscCode: bankData?.ifscCode || "",
    accountType: bankData?.accountType || "Saving",
    bankName: bankData?.bankName || "",
    branch: bankData?.branch || "",
    country: bankData?.country || "",
    city: bankData?.city || "",
  });

  const handleChange = (
    field: string,
    value: string
  ) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

  };

  const handleSubmit = async () => {
  try {
    if (bankData?._id) {
      const response = await updateBankDetail({ id: bankData._id, bankData: formData }).unwrap();
      toast.success(response.message || "Bank detail updated successfully");
    } else {
      const response = await createBankDetail(formData).unwrap();
      toast.success(response.message || "Bank detail added successfully");
    }
    onClose();
  } catch (error: any) {
    toast.error(error?.data?.message || "Something went wrong");
  }
};

  return (
    <>
      <Modal show={true} onHide={onClose} centered >
        {/* Header */}
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title>Add Bank Detail</Modal.Title>

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

        <Modal.Body>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Account Holder Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "10px" }}
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    handleChange(
                      "accountHolderName",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Account Number *
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "10px" }}
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleChange(
                      "accountNumber",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  IFSC / Sort Code *
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "10px" }}
                  value={formData.ifscCode}
                  onChange={(e) =>
                    handleChange(
                      "ifscCode",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Account Type *
                </Form.Label>
                <Form.Select style={{ fontSize: "10px" }} value={formData.accountType}
                  onChange={(e) =>
                    handleChange(
                      "accountType",
                      e.target.value
                    )
                  }>
                  <option value="Saving">Saving</option>
                  <option value="Current">Current</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Bank *
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "10px" }}
                  value={formData.bankName}
                  onChange={(e) =>
                    handleChange(
                      "bankName",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Branch *
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "10px" }}
                  value={formData.branch}
                  onChange={(e) =>
                    handleChange(
                      "branch",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  Country *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Country"
                  style={{ fontSize: "10px" }}
                  value={formData.country}
                  onChange={(e) =>
                    handleChange(
                      "country",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </Col>


            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ fontSize: "10px" }} className="text-primary">
                  City *
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ fontSize: "10px" }}
                  value={formData.city}
                  onChange={(e) =>
                    handleChange(
                      "city",
                      e.target.value
                    )
                  }
                />
              </Form.Group>
            </Col>
          </Row>

        </Modal.Body>

        <Modal.Footer>
          <div className='d-flex justify-content-end gap-2'>
            <Button
              size="sm"
              onClick={onClose}
              variant="outline-danger"
              style={{ fontSize: "12px" }}
            >
              Close
            </Button>
            <Button
              size="sm"
              variant="success"
              style={{ fontSize: "12px" }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {
                isLoading
                  ? "Submitting..."
                  : "Submit"
              }
            </Button>

          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddBankDetail
