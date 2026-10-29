import React from 'react'
import { Button, Card, CardHeader, Row, Col, CardBody , Form, Table} from 'react-bootstrap';
const Feedback = () => {
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
                <th><span>Customer Feedbacks</span></th>
              </tr>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }} className='bg-light'>
                    <th style={{ width: "100px" }}>#</th>
                   
                    <th style={{ width: "100px" }}>Date</th>

                <th style={{ width: "260px" }}>Status</th>

                <th style={{ width: "140px" }}>Destination</th>

                <th style={{ width: "110px" }}>Travel Month</th>
                <th style={{ width: "110px" }}>Experience</th>
                <th style={{ width: "110px" }}>Review Title</th>
               <th style={{ width: "110px" }}>Review</th>
                <th style={{ width: "110px" }}>Action</th>
              </tr>
           </thead>
           </table>
        </div>
      </Card>
    </>
  )
}

export default Feedback
