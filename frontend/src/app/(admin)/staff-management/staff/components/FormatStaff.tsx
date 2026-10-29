import React from 'react'
import { useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import { Icon } from '@iconify/react/dist/iconify.js';
const FormatStaff = () => {
  const router = useRouter()
  return (
    <>
      <div className="table-responsive mt-2">
        <table className="table table-sm table-bordered mb-0 align-middle" style={{ tableLayout: "fixed", width: "100%" }}>
          <thead>
            <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
              <th style={{ width: "200px" }}>Staff Details</th>
              <th>Role</th>
              <th>Report To</th>
              <th>Department</th>
              <th>WA / WA Admin</th>
              <th>Secure Login</th>
              <th>API Booking</th>
              <th>Masking</th>
              <th>Finance</th>
              <th>Archived</th>
              <th style={{ width: "150px" }}>Action</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "12px" }} className='table-dark'>
            <tr>
              <td>
                <div>
                  <Icon icon="mdi:account" className="me-1" />
                  Anagha KV
                </div>
                <div>
                  <Icon icon="mdi:email" className="me-1" />
                  anaghakv.aheaven@gmail.com
                </div>
                <div>
                  <Icon icon="mdi:phone" className="me-1" />
                  91 7510216302
                </div>
              </td>
              <td>Sales</td>
              <td>RAJENDRA BUGADE</td>
              <td>Sales</td>
              <td>No</td>

              <td><Form.Check style={{ fontSize: "10px" }} /></td>

              <td><Form.Check style={{ fontSize: "10px" }} /></td>


              <td><Form.Check style={{ fontSize: "10px" }} /></td>


              <td><Form.Check style={{ fontSize: "10px" }} /></td>

              <td><Form.Check style={{ fontSize: "10px" }} /></td>
              <td>
                <div className='d-flex gap-1'>
                  <span>
                    <Button variant="success"
                      onClick={() => { router.push('./staff/view-staff') }}
                      size="sm">
                      <Icon icon="mdi:eye" />
                    </Button>
                  </span>

                  <span>
                    <Button variant="primary"
                      onClick={() => { router.push('./staff/edit-staff') }}
                      size="sm">
                      <Icon icon="mdi:edit" />
                    </Button>
                  </span>

                  <span>
                    <Button variant="secondary"
                      onClick={() => { router.push('./staff/') }}
                      size="sm">
                      <Icon icon="mdi:account-off-outline" />
                    </Button>
                  </span>

                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </>
  )
}

export default FormatStaff
