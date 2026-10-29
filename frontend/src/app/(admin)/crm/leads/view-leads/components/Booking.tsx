import React from 'react'
import { Button, Card, CardHeader, Row, Col, CardBody , Form, Table} from 'react-bootstrap';
const Booking = () => {
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
                            <th>Booking List</th>
                        </tr>
                      <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }} className='bg-light'>
                      
        
                        <th style={{ width: "100px" }}>Query ID - Proposal ID</th>
      
                        <th style={{ width: "110px" }}>Type</th>
                        <th style={{ width: "110px" }}>Booking Date</th>
                        <th style={{ width: "110px" }}>Travel Date</th>
                        <th style={{ width: "110px" }}>Particulars</th>
                        <th style={{ width: "110px" }}>Selling Price</th>
                        <th style={{ width: "110px" }}>Received</th>
                        <th style={{ width: "110px" }}>Balance</th> 
                        <th style={{ width: "110px" }}>Stage</th>
                        <th style={{ width: "70px" }} className="text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
        
                    <tbody style={{ fontSize: "12px" }}>
                      <tr>
                    <td colSpan={10}>No record found</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
      </Card>
    </>
  )
}

export default Booking
