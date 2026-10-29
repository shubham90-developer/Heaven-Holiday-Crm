import React from 'react'
import { Button, Card, CardHeader, Row, Col, CardBody, Form, Table } from 'react-bootstrap';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSearchParams } from "next/navigation";
import {
  useGetRemarksByLeadIdQuery,
  useDeleteLeadRemarkMutation
} from "../../../../../../store/services/leadRemarkApi";

const Remarks = () => {

  const searchParams = useSearchParams();
  const leadId = searchParams.get("id");

  const { data: remarksData, isLoading: remarksLoading } =
    useGetRemarksByLeadIdQuery({ leadId, page: 1, limit: 20 }, {
      skip: !leadId,
    });

  const [deleteLeadRemark] = useDeleteLeadRemarkMutation();

  const remarks = remarksData?.data || [];

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
                <th><span>Customer Remarks</span></th>
              </tr>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }} className='bg-light'>
                <th style={{ width: "100px" }}>#</th>

                <th style={{ width: "100px" }}>Create Date</th>

                <th style={{ width: "260px" }}>Remark</th>

                <th style={{ width: "110px" }}>Updated By</th>
                <th style={{ width: "110px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {remarksLoading ? (
                <tr>
                  <td colSpan={5} className="text-center">Loading...</td>
                </tr>
              ) : remarks.length > 0 ? (
                remarks.map((item: any, index: number) => (
                  <tr key={item._id} style={{ fontSize: "10px" }}>
                    <td>{index + 1}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{item.remark}</td>
                    <td>NA</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => deleteLeadRemark(item._id)}
                      >
                        <Icon icon="mdi:delete" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">No record found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

export default Remarks
