"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useCreateBankMutation } from "@/store/services/supplierBankApi";
import toast from "react-hot-toast";

interface BankForm {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  swiftCode: string;
  isPrimary: boolean;
  country: string;
  city: string;
  comments: string;
}

type FormKeys = keyof BankForm;

const fieldLabels: Record<FormKeys, string> = {
  accountName: "Account Name",
  accountNumber: "Account Number",
  bankName: "Bank Name",
  ifscCode: "IFSC Code",
  swiftCode: "Swift Code",
  isPrimary: "Is Primary",
  country: "Country",
  city: "City",
  comments: "Comments",
};

const AddBankModal = () => {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<BankForm>({
    accountName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    swiftCode: "",
    isPrimary: false,
    country: "",
    city: "",
    comments: "",
  });

  const [createBank, { isLoading }] = useCreateBankMutation();

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "yes" : value,
    }));
  };

  const resetForm = () => {
    setForm({
      accountName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      swiftCode: "",
      isPrimary: false,
      country: "",
      city: "",
      comments: "",
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("handleSubmit fired"); // ← Add this
    console.log("form values:", form);

    const requiredFields: FormKeys[] = ["accountName", "accountNumber", "swiftCode", "city"];

    for (let field of requiredFields) {
      const value = form[field];
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        toast.error(`Please fill in the ${fieldLabels[field]} field`);
        return;
      }
    }

    try {
      await createBank(form).unwrap();
      setShow(false);
      resetForm();
      toast.success("Bank added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error adding bank!");
    }
  };

  return (
    <>
      <Button
        size="sm"
        style={{ fontSize: "8px" }}
        onClick={() => setShow(true)}
      >
        <Icon icon="mdi:plus" className="me-1" /> Add
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header
          style={{ background: "#274c6b", color: "#fff" }}
          className="d-flex justify-content-between"
        >
          <Modal.Title style={{ fontSize: "14px" }}>
            Add Supplier Bank
          </Modal.Title>

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

        {/* BODY */}
        <Modal.Body style={{ fontSize: "12px" }}>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Account Name
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="accountName"
                  value={form.accountName}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Account Number *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Bank Name
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange} />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  IFSC Code
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="ifscCode"
                  value={form.ifscCode}
                  onChange={handleChange} />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Swift Code *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="swiftCode"
                  value={form.swiftCode}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Is Primary
                </Form.Label>

                <div className="d-flex align-items-center gap-3">
                  <Form.Check
                    type="radio"
                    label="Yes"
                    name="isPrimary"
                    value="yes"
                    style={{ fontSize: "12px" }}
                    checked={form.isPrimary === true}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="No"
                    name="isPrimary"
                    value="no"
                    style={{ fontSize: "12px" }}
                    checked={form.isPrimary === false}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-2 mb-2">
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Country
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="country"
                  value={form.country}
                  onChange={handleChange} />
              </Col>
              <Col md={6}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  City *
                </Form.Label>
                <Form.Control size="sm" style={{ fontSize: "12px" }}
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={12}>
                <Form.Label
                  className="text-primary"
                  style={{ fontSize: "12px" }}
                >
                  Comments
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  size="sm"
                  style={{ fontSize: "12px" }}
                  name="comments"
                  value={form.comments}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Modal.Footer className="d-flex justify-content-between">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setShow(false)}
                style={{ fontSize: "12px" }}
              >
                Cancel
              </Button>

              <Button type="submit" variant="success" size="sm" style={{ fontSize: "12px" }}>
                <Icon icon="akar-icons:check" className="me-1" />  {isLoading ? "Saving..." : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>

        {/* FOOTER */}
        {/* <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setShow(false)}
            style={{ fontSize: "12px" }}
          >
            Cancel
          </Button>

          <Button variant="success" size="sm" style={{ fontSize: "12px" }}>
            <Icon icon="akar-icons:check" className="me-1" />  {isLoading ? "Saving..." : "Submit"}
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default AddBankModal;
