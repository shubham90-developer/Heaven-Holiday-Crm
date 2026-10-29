"use client";

import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import CollapsibleSection from "./CollapsibleSection";
import ProposalRichTextEditor from "./ProposalRichTextEditor";

const PricingAndItemsSection = () => {
  const [internalRemarks, setInternalRemarks] = useState("");
  const [costSheetType, setCostSheetType] = useState("perPerson");

  return (
    <>
      <CollapsibleSection title="Other Items" headerVariant="gray">
        <div className="table-responsive">
          <table className="ccp-cost-table">
            <thead>
              <tr>
                <th>Item Name *</th>
                <th>Cost Type</th>
                <th>Adult</th>
                <th>Supplier Name *</th>
                <th>Currency *</th>
                <th>Per Adult Cost</th>
                <th>Total Cost</th>
                <th>Total Markup</th>
                <th>Final Price</th>
                <th>Selected</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Form.Control size="sm" className="ccp-input" /></td>
                <td>
                  <Form.Select size="sm" className="ccp-input" defaultValue="Per Person">
                    <option>Per Person</option>
                    <option>Total</option>
                  </Form.Select>
                </td>
                <td>
                  <Form.Select size="sm" className="ccp-input" defaultValue="2">
                    <option>2</option>
                  </Form.Select>
                </td>
                <td><Form.Control size="sm" className="ccp-input" /></td>
                <td>
                  <Form.Select size="sm" className="ccp-input">
                    <option>INR</option>
                  </Form.Select>
                </td>
                <td><Form.Control size="sm" className="ccp-input" type="number" /></td>
                <td><Form.Control size="sm" className="ccp-input" readOnly /></td>
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <IconifyIcon icon="mdi:information-outline" className="text-primary" />
                    <Form.Check type="checkbox" defaultChecked />
                    <Form.Control size="sm" className="ccp-input" type="number" />
                  </div>
                </td>
                <td><Form.Control size="sm" className="ccp-input" readOnly /></td>
                <td><Form.Check type="checkbox" defaultChecked /></td>
                <td>
                  <button type="button" className="btn btn-link text-danger p-0">
                    <IconifyIcon icon="mdi:delete-outline" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-end mt-2">
          <button type="button" className="ccp-add-more-btn">Add More</button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title={
          <span className="d-flex align-items-center gap-2">
            Pricing Info
            <IconifyIcon icon="mdi:upload" />
          </span>
        }
        headerVariant="blue"
      >
        <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
          <span style={{ fontSize: "12px", fontWeight: 600 }}>Cost Sheet (Break-Up):</span>
          <Form.Check
            type="radio"
            name="costSheet"
            label="Per Person"
            checked={costSheetType === "perPerson"}
            onChange={() => setCostSheetType("perPerson")}
            style={{ fontSize: "12px" }}
          />
          <Form.Check
            type="radio"
            name="costSheet"
            label="Total"
            checked={costSheetType === "total"}
            onChange={() => setCostSheetType("total")}
            style={{ fontSize: "12px" }}
          />
          <Form.Check type="checkbox" label="Approx Price" style={{ fontSize: "12px" }} />
        </div>

        <div className="table-responsive mb-3">
          <table className="ccp-cost-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Total Cost</th>
                <th>Total Markup (INR)</th>
                <th>Total With Markup</th>
                <th>Tax Type</th>
                <th>Tax Amount</th>
                <th>Sales Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Control
                    size="sm"
                    className="ccp-input"
                    defaultValue="Package Opt 1"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Share in source"
                    style={{ fontSize: "10px" }}
                    className="mt-1"
                  />
                </td>
                <td>INR 0.00</td>
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <IconifyIcon icon="mdi:lock-outline" />
                    <Form.Control size="sm" className="ccp-input" defaultValue="0.00" />
                  </div>
                </td>
                <td>INR 0.00</td>
                <td>
                  <Form.Select size="sm" className="ccp-input" defaultValue="Tax Extra With Markup">
                    <option>Tax Extra With Markup</option>
                  </Form.Select>
                </td>
                <td>INR 0.00</td>
                <td>INR 0.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Row className="g-2 mb-3">
          <Col md={3}>
            <label className="ccp-field-label">Currency</label>
            <Form.Select size="sm" className="ccp-input" defaultValue="INR">
              <option>INR</option>
            </Form.Select>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Form.Check type="checkbox" label="Share in Base Currency (INR)" style={{ fontSize: "11px" }} />
          </Col>
          <Col md={3}>
            <label className="ccp-field-label">Conversion Rate</label>
            <Form.Control size="sm" className="ccp-input" defaultValue="1" />
          </Col>
          <Col md={3}>
            <label className="ccp-field-label">Advance Required to Book</label>
            <Form.Select size="sm" className="ccp-input" defaultValue="25 %">
              <option>25 %</option>
              <option>50 %</option>
              <option>100 %</option>
            </Form.Select>
          </Col>
        </Row>

        <div className="mb-3">
          <span style={{ fontSize: "12px", fontWeight: 600 }}>TCS Applicable</span>
          <div className="d-flex gap-3 mt-1">
            <Form.Check type="checkbox" label="TCS Package" style={{ fontSize: "12px" }} />
            <Form.Check type="checkbox" label="Display on Proposal" style={{ fontSize: "12px" }} />
          </div>
        </div>

        <div>
          <label className="ccp-field-label">Internal Remarks</label>
          <ProposalRichTextEditor
            value={internalRemarks}
            onChange={setInternalRemarks}
          />
        </div>
      </CollapsibleSection>
    </>
  );
};

export default PricingAndItemsSection;
