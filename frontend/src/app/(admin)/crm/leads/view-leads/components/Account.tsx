import React from 'react'
import { Button, Card, CardHeader, Row, Col, CardBody , Form, Table} from 'react-bootstrap';
const Account = () => {
  return (
    <div>
      <Card className='p-2'>
        <div className="table-responsive">
           <table
            className="table table-sm table-bordered mb-0 align-middle "
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead >
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th><span>Contacts</span></th>
              </tr>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }} className='bg-light'>
                    <th style={{ width: "100px" }}>Date</th>

                <th style={{ width: "260px" }}>Service</th>

                <th style={{ width: "140px" }}>Reference</th>

                <th style={{ width: "110px" }}>Dr</th>
                <th style={{ width: "110px" }}>Cr</th>
                <th style={{ width: "110px" }}>Balance</th>
              
              </tr>
           </thead>
           </table>
        </div>
      </Card>
    </div>
  )
}

export default Account
