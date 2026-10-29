import { useState } from 'react'
import React from 'react'
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import AddContactModal from './AddContactModal';
import EditContactModal from './EditContactModal';
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useGetLeadContactsQuery } from "../../../../../../store/services/customerContactApi";

const Contacts = () => {
  const [addContact, setaddContact] = useState(false);
  const [editContact, seteditContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const searchParams = useSearchParams();

  const leadId = searchParams.get("id");

  // FETCH CONTACTS
  const {
    data: contactsData,
    isLoading,
    isError,
  } = useGetLeadContactsQuery(leadId, {
    skip: !leadId,
  });

  return (
    <>
      <Card className='p-2'>
        <div className='text-end mb-2'>
          <Button variant='outline-danger' size='sm'
            style={{ fontSize: '10px', fontWeight: 'bold' }}
            onClick={() => setaddContact(true)}>
            Add Contacts
          </Button>
        </div>
        {addContact && <AddContactModal onClose={() => setaddContact(false)} />}
        <div className='table-responsive'>
          <table
            className="table table-sm table-bordered mb-0 align-middle "
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead >
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th><span>Contacts</span></th>
              </tr>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }} className='bg-light'>


                <th style={{ width: "100px" }}>Customer Name</th>

                <th style={{ width: "260px" }}>Email</th>

                <th style={{ width: "140px" }}>Mobile</th>

                <th style={{ width: "110px" }}>Relation</th>
                <th style={{ width: "110px" }}>Passport Number</th>
                <th style={{ width: "110px" }}>Documents</th>
                <th style={{ width: "110px" }}>Status</th>

                <th style={{ width: "70px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {isLoading && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center"
                  >
                    Loading...
                  </td>
                </tr>
              )}

              {/* ERROR */}
              {isError && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-danger"
                  >
                    Failed to fetch contacts
                  </td>
                </tr>
              )}

              {/* NO DATA */}
              {!isLoading &&
                contactsData?.data?.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center"
                    >
                      No Contacts Found
                    </td>
                  </tr>
                )}

              {/* DYNAMIC DATA */}
              {!isLoading &&
                contactsData?.data?.map(
                  (contact: any) => (
                    <tr key={contact._id}>

                      <td>
                        {contact.salutation}{" "}
                        {contact.firstName}{" "}
                        {contact.lastName}
                      </td>

                      <td>
                        {contact.email || "NA"}
                      </td>

                      <td>
                        {contact.mobileNumber || "NA"}
                      </td>

                      <td>
                        {contact.relation || "NA"}
                      </td>

                      <td>
                        {contact.passportNumber ||
                          "NA"}
                      </td>

                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          Add
                        </Button>
                      </td>

                      <td>
                        <span className="badge bg-success">
                          Active
                        </span>
                      </td>

                      <td className="text-center">

                        <div
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <Icon
                            icon="mdi:pencil"
                            onClick={() => {
                              setSelectedContact(contact);
                              seteditContact(true);
                            }}
                            style={{
                              cursor: "pointer",
                              fontSize: "16px",
                            }}
                          />
                        </div>

                      </td>

                    </tr>
                  )
                )}
            </tbody>
          </table>
          {editContact && <EditContactModal contact={selectedContact}
            onClose={() => {
              seteditContact(false);
              setSelectedContact(null);
            }} />}
        </div>
      </Card>
    </>
  )
}

export default Contacts
