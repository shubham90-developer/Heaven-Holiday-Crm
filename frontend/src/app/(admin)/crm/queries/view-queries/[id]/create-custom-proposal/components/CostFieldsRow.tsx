"use client";

import { Form } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

type CostFieldsRowProps = {
  adultCount?: number;
  showTaxType?: boolean;
  showMarkupInfo?: boolean;
};

const CostFieldsRow = ({
  adultCount = 2,
  showTaxType = false,
  showMarkupInfo = true,
}: CostFieldsRowProps) => {
  return (
    <div className="table-responsive mt-2">
      <table className="ccp-cost-table">
        <thead>
          <tr>
            <th>
              Supplier Name <span className="text-danger">*</span>
            </th>
            <th>
              Currency <span className="text-danger">*</span>
            </th>
            <th>Per Adult Cost (x{adultCount})</th>
            <th>Total Cost</th>
            <th>
              Total Markup{" "}
              {showMarkupInfo && (
                <IconifyIcon icon="mdi:information-outline" className="text-primary" />
              )}
            </th>
            {showTaxType && <th>Tax Type</th>}
            <th>Final Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Form.Control size="sm" className="ccp-input" />
            </td>
            <td>
              <Form.Select size="sm" className="ccp-input">
                <option value="">Select</option>
                <option>INR</option>
                <option>USD</option>
              </Form.Select>
            </td>
            <td>
              <Form.Control size="sm" className="ccp-input" type="number" />
            </td>
            <td>
              <Form.Control size="sm" className="ccp-input" readOnly />
            </td>
            <td>
              <div className="d-flex align-items-center gap-1">
                <Form.Check type="checkbox" />
                <Form.Control size="sm" className="ccp-input" type="number" />
              </div>
            </td>
            {showTaxType && (
              <td>
                <Form.Select size="sm" className="ccp-input">
                  <option>Tax Extra With Markup</option>
                  <option>Tax Included</option>
                </Form.Select>
              </td>
            )}
            <td>
              <Form.Control size="sm" className="ccp-input" readOnly />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CostFieldsRow;
