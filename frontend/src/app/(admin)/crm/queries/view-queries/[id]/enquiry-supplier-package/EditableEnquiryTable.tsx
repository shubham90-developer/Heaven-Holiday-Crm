"use client";

import type { ChangeEvent } from "react";
import type { EnquiryDetails } from "./enquirySupplierUtils";

type EditableEnquiryTableProps = {
  details: EnquiryDetails;
  onChange: (field: keyof EnquiryDetails, value: string) => void;
};

const EditableEnquiryTable = ({ details, onChange }: EditableEnquiryTableProps) => {
  const setField =
    (field: keyof EnquiryDetails) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      onChange(field, value);
      if (field === "pax") {
        onChange("paxHtml", value.replace(/\n/g, "<br/>"));
      }
    };

  return (
    <table className="esp-editable-table">
      <tbody>
        <tr>
          <td className="esp-cell-label" style={{ width: "16%" }}>
            Customer Name
          </td>
          <td>
            <input
              className="esp-cell-input"
              value={details.customerName}
              onChange={setField("customerName")}
            />
          </td>
          <td className="esp-cell-label" style={{ width: "16%" }}>
            Enquiry ID
          </td>
          <td>
            <input
              className="esp-cell-input"
              value={details.enquiryId}
              onChange={setField("enquiryId")}
            />
          </td>
          <td className="esp-cell-label" style={{ width: "16%" }}>
            Enquiry For
          </td>
          <td>
            <input
              className="esp-cell-input"
              value={details.enquiryFor}
              onChange={setField("enquiryFor")}
            />
          </td>
        </tr>
        <tr>
          <td className="esp-cell-section" colSpan={6}>
            Enquiry Details
          </td>
        </tr>
        <tr>
          <td className="esp-cell-label">Check In</td>
          <td>
            <input
              className="esp-cell-input"
              value={details.checkIn}
              onChange={setField("checkIn")}
            />
          </td>
          <td className="esp-cell-label">Check Out</td>
          <td>
            <input
              className="esp-cell-input"
              value={details.checkOut}
              onChange={setField("checkOut")}
            />
          </td>
          <td className="esp-cell-label">No Of Days</td>
          <td>
            <input
              className="esp-cell-input"
              value={details.noOfDays}
              onChange={setField("noOfDays")}
            />
          </td>
        </tr>
        <tr>
          <td className="esp-cell-label">Destination</td>
          <td>
            <input
              className="esp-cell-input"
              value={details.destination}
              onChange={setField("destination")}
            />
          </td>
          <td className="esp-cell-label">No of Pax</td>
          <td colSpan={3}>
            <textarea
              className="esp-cell-input esp-cell-textarea"
              rows={2}
              value={details.pax}
              onChange={setField("pax")}
            />
          </td>
        </tr>
        <tr>
          <td className="esp-cell-label">Hotel Preference:</td>
          <td colSpan={5}>
            <input
              className="esp-cell-input"
              value={details.hotelPreference}
              onChange={setField("hotelPreference")}
            />
          </td>
        </tr>
        <tr>
          <td className="esp-cell-label">Inclusions:</td>
          <td colSpan={5}>
            <input
              className="esp-cell-input"
              value={details.inclusions}
              onChange={setField("inclusions")}
            />
          </td>
        </tr>
        <tr>
          <td className="esp-cell-label">Theme:</td>
          <td colSpan={5}>
            <input
              className="esp-cell-input"
              value={details.theme}
              onChange={setField("theme")}
            />
          </td>
        </tr>
        <tr>
          <td className="esp-cell-label">Food Preference:</td>
          <td colSpan={5}>
            <input
              className="esp-cell-input"
              value={details.foodPreference}
              onChange={setField("foodPreference")}
            />
          </td>
        </tr>
        <tr>
          <td className="esp-cell-label">Remarks:</td>
          <td colSpan={5}>
            <input
              className="esp-cell-input"
              value={details.remarks}
              onChange={setField("remarks")}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default EditableEnquiryTable;
