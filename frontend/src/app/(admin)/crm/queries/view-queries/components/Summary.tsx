import React from 'react'
import { useState } from 'react'
import { Button, Card, CardHeader, Row, Col, CardBody , Form, Table} from 'react-bootstrap';
import { Icon } from "@iconify/react/dist/iconify.js";
import ToDoModal from '../../../leads/view-leads/components/TodoModal';

const Summary = () => {
  return (
    <div>
      <Row>
        <Col md={6}>
        <Card>
            <CardHeader className='p-2' style={{ fontSize: "12px" }}>Preview</CardHeader>
            <CardBody className='p-2'>
                <div className='table-responsive'>
                    <table className='table table-bordered'>
                        <thead className=''>
                    <tr style={{ fontSize: "10px" }}>
  <td>
    <strong>Last Updated:</strong> 23-May-26
  </td>

  <td>
    <strong>Last Action:</strong> Submitted to Immigration/Embassy \ Proposal Sent
  </td>
</tr>

<tr style={{ fontSize: "10px" }}>
  <td>
    <strong>Proposal Sent:</strong> 1
  </td>

  <td>
    <strong>Query Status:</strong> Submitted to Immigration/Embassy
  </td>
</tr>

<tr style={{ fontSize: "10px" }}>
  <td>
    <strong>Next To Do:</strong> NA
  </td>

  <td>
    <strong>Travel Date:</strong> 16-Aug-26
  </td>
</tr>
                      </thead>
                      </table>
                      </div>
            </CardBody>
        </Card>
        </Col>

        <Col md={6}>

        <Card>
            <CardHeader  className='d-flex justify-content-between' style={{ fontSize: "12px" }}>
                ToDo List
        <ToDoModal/>
            </CardHeader>
            <CardBody>
                 <div className='table-responsive'>
                    <table className='table table-bordered'>
                        <thead className='bg-light'>
                    <tr style={{ fontSize: "12px" }}>
  <th>#</th>
<th>Subject</th>
<th>Due Date</th>
</tr>
</thead>
<tbody>
    <tr style={{ fontSize: "10px" }}>
      <td>No record found, Create new by clicking <span className='text-danger'>here</span>
      </td>
      </tr>
</tbody>
</table>
</div>
            </CardBody>
        </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Summary
