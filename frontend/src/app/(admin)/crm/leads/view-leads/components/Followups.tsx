import React from 'react'
import { Button, Card, CardHeader, Row, Col, CardBody, Form, Table } from 'react-bootstrap';
import { useSearchParams } from "next/navigation";
import { useGetFollowUpsByLeadIdQuery } from "../../../../../../store/services/followUp.Api";
import { Icon } from "@iconify/react";

const Followups = () => {
  const searchParams = useSearchParams();
  const leadId = searchParams.get("id");

  const { data: followUpsData, isLoading } = useGetFollowUpsByLeadIdQuery(leadId, {
    skip: !leadId,
  });

  const followUps = followUpsData?.data || [];
  return (
    <>
      <Card className='p-2'>
        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle "
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead >
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th><span>Customer To Do List</span></th>
              </tr>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }} className='bg-light'>
                <th style={{ width: "100px" }}>Due Date</th>

                <th style={{ width: "260px" }}>Subject</th>

                <th style={{ width: "140px" }}>Created By</th>

                <th style={{ width: "110px" }}>Assigned To</th>
                <th style={{ width: "110px" }}>Details</th>
                <th style={{ width: "110px" }}>Status</th>
                <th style={{ width: "110px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center" style={{ fontSize: "10px" }}>Loading...</td>
                </tr>
              ) : followUps.length > 0 ? (
                followUps.map((item: any) => (
                  <tr key={item._id} style={{ fontSize: "10px" }}>
                    <td>{new Date(item.schedule?.date).toLocaleDateString()}</td>
                    <td>{item.type} {item.direction ? `- ${item.direction}` : ""}</td>
                    <td>NA</td>
                    <td>NA</td>
                    <td>{item.details || "NA"}</td>
                    <td>{item.status}</td>
                    <td>
                      <Button size="sm" variant="outline-primary">
                        <Icon icon="mdi:pencil" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center" style={{ fontSize: "10px" }}>No record found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default Followups
