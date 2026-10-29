"use client";
import { useRouter } from 'next/navigation';
import React from 'react'
import { useState } from "react";
import { Button, Form, Row, Col, Card, Table } from "react-bootstrap";
import { Icon } from '@iconify/react/dist/iconify.js';
import toast from "react-hot-toast";
import styles from "./communications.module.scss";

const tabs: string[] = [
    "Sender Email Id",
    "Default CC Email Id",
    "Greeting Message",
    "Support Contact",
    "Sender Id (Auto Follow Up)",
    "Whatsapp Template",
    "Query Pages",
    "Default PDF"
]

const Communication = () => {
    const router = useRouter()
    const [activetab, setActiveTab] = useState<number>(0);

    // "Add" button in the top-right of the tab bar changes with the active tab
    const addAction: { label: string; path: string } | null =
        activetab === 0 ? { label: "Add Sender ID", path: "/settings/communications/add-senderid" }
        : activetab === 1 ? { label: "Add Default CC Email Id", path: "/settings/communications/add-defaultsenderid" }
        : activetab === 5 ? { label: "Add Template", path: "/settings/communications/add-template" }
        : null;

  return (
    <>
      <Card className={`p-3 ${styles.pageCard}`}>
        <div className={styles.tabBar}>
          <div className={styles.tabList}>
            {tabs.map((tab, item) => (
              <button
                key={item}
                type="button"
                className={`${styles.tabBtn} ${activetab === item ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(item)}
              >
                {tab}
              </button>
            ))}
          </div>

          {addAction && (
            <Button variant="primary" size="sm" className={styles.addBtn} onClick={() => router.push(addAction.path)}>
              <Icon icon="mdi:plus" className="me-1" />
              {addAction.label}
            </Button>
          )}
        </div>

        <hr className="mt-3 mb-3" />

        { activetab === 0 && ( <SenderEmailId/> )}
        { activetab === 1 && ( <DefaultEmailId/>)}
        { activetab === 2 && ( <GreetingMessage/>)}
        { activetab === 3 && ( <SupportContact/>)}
        { activetab === 4 && ( <Followup/> )}
        { activetab === 5 && ( <Whatsup/>)}
        { activetab === 6 && ( <QueryPages/> )}
        { activetab === 7 && ( <DefaultPdf/> )}
      </Card>
    </>
  )
}

export default Communication

const PAGE_SIZE = 10;

type SenderRow = { id: string; email: string; status: "Active" | "Inactive" };

const SenderEmailId: React.FC = () => {
    // TODO: replace with the sender-id API query once the endpoint exists
    const [senders, setSenders] = useState<SenderRow[]>([
        { id: "1", email: "b2b.aheaven@gmail.com", status: "Active" },
    ]);
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(senders.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const visible = senders.slice(start, start + PAGE_SIZE);

    const handleDelete = (id: string) => {
        toast((t) => (
            <div>
                <p style={{ fontSize: "12px", marginBottom: "8px" }}>
                    Are you sure you want to remove this sender email?
                </p>
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        style={{ fontSize: "10px" }}
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            toast.dismiss(t.id);
                            // TODO: call the delete mutation here
                            setSenders((prev) => prev.filter((s) => s.id !== id));
                        }}
                    >
                        Yes, Remove
                    </button>
                    <button style={{ fontSize: "10px" }} className="btn btn-secondary btn-sm" onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    return (
        <>
            <div className="table-responsive">
                <table className={`table table-bordered mb-0 align-middle ${styles.table}`}>
                    <thead>
                        <tr>
                            <th style={{ width: "80px" }}>S.No</th>
                            <th>Sender Email ID</th>
                            <th style={{ width: "220px" }}>Status</th>
                            <th style={{ width: "160px" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visible.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-3">No record found</td>
                            </tr>
                        )}
                        {visible.map((item, index) => (
                            <tr key={item.id}>
                                <td>{start + index + 1}</td>
                                <td>{item.email}</td>
                                <td>{item.status}</td>
                                <td>
                                    <button
                                        type="button"
                                        title="Remove"
                                        className={styles.removeBtn}
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Icon icon="mdi:minus-circle" width={22} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {senders.length > 0 && (
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            type="button"
                            className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ""}`}
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </>
    )
}

const DefaultEmailId: React.FC = () =>{
    const router=useRouter()
    return (
        <>
          <div className='text-end'>
                    <Button variant='primary' size='sm'
                    onClick={()=>router.push('/settings/communications/add-defaultsenderid')}
                    style={{fontSize:"10px"}}><Icon icon="mdi:plus" className='me-1'/>Add Default CC Email Id</Button>
                </div>
               <hr/>
                         <div className="table-responsive">
                          <table
                            className="table table-sm table-bordered mb-0 align-middle"
                            style={{ tableLayout: "fixed", width: "100%" }}
                          >
                            <thead>
                              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                         <th style={{ width: "60px" }}>S.No</th>
    <th style={{ width: "250px" }}>Sender Email ID</th>
    <th style={{ width: "120px" }}>Status</th>
    <th style={{ width: "120px" }} className="text-center">Action</th>
                            </tr>
                            </thead>
                    <tbody>
                        <tr style={{fontSize:"12px"}}>
                        <td colSpan={4}>No record found</td>
                        </tr>
                    </tbody>
                            </table>
                            </div> 
        </>
    )
}

const GreetingMessage : React.FC = () =>{
    const router=useRouter()
    const [msg, setMsg]=useState(false)
    return (
        <>
        <div className='p-3'>
                                 <div className="table-responsive">
                          <table
                            className="table table-sm table-bordered mb-0 align-middle"
                            style={{ tableLayout: "fixed", width: "100%" }}
                          >
                            <thead>
                              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                       <th style={{ width: "120px" }}>Type</th>
    <th style={{ width: "140px" }}>Allow Display</th>
    <th style={{ width: "250px" }}>Greeting Message</th>
    <th style={{ width: "120px" }}>
      Action
    </th>  
             </tr>
                            </thead>
                    <tbody>
                        <tr style={{fontSize:"12px"}}>
                      <td>B2C Message</td>
                      <td><Form.Check/></td>
                      <td>{msg ? <Form.Control as="textarea" rows={3} size='sm' /> : <span>no data</span>}</td>
                      <td>
                        { msg ?   <Button variant='danger' size='sm'
                        onClick={()=>setMsg(!msg)}
                    style={{fontSize:"10px"}}>Save</Button>:
                          <Button variant='primary' size='sm'
                          title='Edit'
                          onClick={()=>setMsg(!msg)}
                    style={{fontSize:"10px"}}><Icon icon="mdi:edit" /></Button> }
                      </td>
                        </tr>
                    </tbody>
                            </table>
                            </div> 
                            </div>
        </>
    )
}

const SupportContact: React.FC =() =>{
  const [contact, setContact]=useState(0)
  return (
       <div className='p-3'>
                                 <div className="table-responsive">
                          <table
                            className="table table-sm table-bordered mb-0 align-middle"
                            style={{ tableLayout: "fixed", width: "100%" }}
                          >
                            <thead>
                              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                         <th>Contact</th>
      <th>Services</th>
      <th>Market Type</th>
      <th>Type</th>
      <th>Email</th>
      <th>Action</th>
                     
                              </tr>
                            </thead>
                    <tbody>
                        <tr style={{fontSize:"12px"}}>
                 <td>
                     <Form.Select size="sm" style={{ fontSize: "10px" }}>
                       <option>RAJENDRA BUGADE</option>
                       <option>RAJENDRA BUGADE</option>
                     </Form.Select></td>

                          <td>
                     <Form.Select size="sm" style={{ fontSize: "10px" }}>
                       <option>Package</option>
                       <option>Flight</option>
                     </Form.Select></td>

                        <td>
                     <Form.Select size="sm" style={{ fontSize: "10px" }}>
                       <option>B2C</option>
                       <option>B2B</option>
                     </Form.Select></td>

                   <td>
                     <Form.Select size="sm" style={{ fontSize: "10px" }}>
                       <option>Domestic</option>
                       <option>International</option>
                     </Form.Select></td>

                     <td><Form.Check type="checkbox" /></td>

                     <td><Button variant='primary' size='sm'
                        onClick={()=>setContact(contact+1)}
                    style={{fontSize:"10px"}}><Icon icon="mdi:plus" /></Button></td>
                        </tr>

      { [...Array(contact)].map((_, index)=>(
                 <tr style={{fontSize:"12px"}} key={index}>
                 <td>
                     <Form.Select size="sm" style={{ fontSize: "10px" }}>
                       <option>RAJENDRA BUGADE</option>
                       <option>RAJENDRA BUGADE</option>
                     </Form.Select></td>

                          <td>
                     <Form.Select size="sm" style={{ fontSize: "10px" }}>
                       <option>Package</option>
                       <option>Flight</option>
                     </Form.Select></td>

                        <td>
                     <Form.Select size="sm" style={{ fontSize: "10px" }}>
                       <option>B2C</option>
                       <option>B2B</option>
                     </Form.Select></td>

                   <td>
                     <Form.Select size="sm" style={{ fontSize: "10px" }}>
                       <option>Domestic</option>
                       <option>International</option>
                     </Form.Select></td>

                     <td><Form.Check type="checkbox" /></td>

                     <td><Button variant='outline-primary' size='sm'
                        onClick={()=>setContact(contact-1)}
                    style={{fontSize:"10px"}}><Icon icon="mdi:minus" /></Button></td>
                        </tr>
      ))}
                    </tbody>
                            </table>
                            </div> 
                            </div>
  )
}

const Followup: React.FC = () =>{
  return (
     <div className='p-3'>
                                 <div className="table-responsive">
                          <table
                            className="table table-sm table-bordered mb-0 align-middle"
                            style={{ tableLayout: "fixed", width: "100%" }}
                          >
                            <thead>
                              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                       <th>Greeting Message</th>
    <th>Action</th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr>
                         <td>  <Form.Select size="sm" style={{ fontSize: "10px" }}>
                       <option>RAJENDRA BUGADE</option>
                       <option>RAJENDRA BUGADE</option>
                     </Form.Select></td>

                    <td> <Button variant='primary' size='sm'
                    style={{fontSize:"10px"}}>Save</Button>
                     </td>
                     </tr>  
                      </tbody>
                      </table>
                      </div>
                      </div>
  )
}

const Whatsup: React.FC = () =>{
const router=useRouter()
  return(
      <div className='p-3'>
        <div className='text-end'>
          <Button variant='primary' size='sm'
          onClick={()=>router.push('/settings/communications/add-template')}
                    style={{fontSize:"10px"}}><Icon icon="mdi:plus" className='me-1'/>Add Template</Button>
        </div>
                                 <div className="table-responsive mt-3">
                          <table
                            className="table table-sm table-bordered mb-0 align-middle"
                            style={{ tableLayout: "fixed", width: "100%" }}
                          >
                            <thead>
                              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                     <th>S.No</th>
    <th>Template Name</th>
    <th>Type</th>
    <th>Category</th>
    <th>Template ID</th>
    <th>Status</th>
    <th>Action</th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr style={{ fontSize: "12px"}}>
                        <td colSpan={7}>
                          No record found
                        </td>
                     </tr>  
                      </tbody>
                      </table>
                      </div>
                      </div>
  )
}

const QueryPages:React.FC = () =>{
  return (
    <div className='p-3'>
       <Form>

    <h6 style={{ fontSize: "12px", fontWeight: "600" }}>
      Generate B2B Query URL
    </h6>

    <Row className="align-items-end mt-2">
      <Col md={3}>
        <Form.Label style={{ fontSize: "10px" }}>
          Lead Source
        </Form.Label>
        <Form.Select size="sm" style={{ fontSize: "10px" }}>
          <option>Select</option>
          <option>Website</option>
          <option>Facebook</option>
        </Form.Select>
      </Col>

      <Col md={3}>
        <Form.Label style={{ fontSize: "10px" }}>
          Assign To
        </Form.Label>
        <Form.Select size="sm" style={{ fontSize: "10px" }}>
          <option>Select</option>
          <option>User 1</option>
          <option>User 2</option>
        </Form.Select>
      </Col>

      <Col md={3}>
        <Button
          size="sm"
          style={{ fontSize: "10px", marginTop: "20px" }}
        >
          Generate B2B Query URL
        </Button>
      </Col>
    </Row>

    <Row className="mt-2">
      <Col md={6}>
        <Form.Label style={{ fontSize: "10px"}} className='text-primary'>
          Copy Short URL
        </Form.Label>
        <Form.Control size="sm" style={{ fontSize: "10px" }} />
      </Col>
    </Row>

    {/* -------- B2C QUERY -------- */}
    <h6 className="mt-4" style={{ fontSize: "12px"}}>
      Generate B2C Query URL
    </h6>

    <Row className="align-items-end mt-2">
      <Col md={3}>
        <Form.Label style={{ fontSize: "10px" }}>
          Lead Source
        </Form.Label>
        <Form.Select size="sm" style={{ fontSize: "10px" }}>
          <option>Select</option>
          <option>Website</option>
          <option>Instagram</option>
        </Form.Select>
      </Col>

      <Col md={3}>
        <Form.Label style={{ fontSize: "10px" }}>
          Assign To
        </Form.Label>
        <Form.Select size="sm" style={{ fontSize: "10px" }}>
          <option>Select</option>
          <option>User 1</option>
          <option>User 2</option>
        </Form.Select>
      </Col>

      <Col md={3}>
        <Button
          size="sm"
          style={{ fontSize: "10px", marginTop: "20px" }}
        >
          Generate B2C Query URL
        </Button>
      </Col>
    </Row>

    <Row className="mt-2">
      <Col md={6}>
        <Form.Label style={{ fontSize: "10px"}} className='text-primary'>
          Copy Short URL
        </Form.Label>
        <Form.Control size="sm" style={{ fontSize: "10px" }} />
      </Col>
    </Row>

  </Form>
    </div>
  )
}

const DefaultPdf:React.FC=()=>{

  return(
    <div className='p-3'>
         <div className="table-responsive">
      <table
        className="table table-sm table-bordered mb-0 align-middle"
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        <thead>
          <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
            <th style={{ width: "10%" }}>S.No</th>
            <th style={{ width: "40%" }}>Title</th>
            <th style={{ width: "25%" }}>View</th>
            <th style={{ width: "25%" }}>Default</th>
          </tr>
        </thead>

        <tbody style={{ fontSize: "10px" }}>
         <tr>
    <td>1</td>
    <td>PDF 1</td>
    <td style={{ color: "#0d6efd", cursor: "pointer" }}>View</td>
    <td>
      <Form.Check type="radio" name="defaultPdf" />
    </td>
  </tr>

  <tr>
    <td>2</td>
    <td>PDF 2</td>
    <td style={{ color: "#0d6efd", cursor: "pointer" }}>View</td>
    <td>
      <Form.Check type="radio" name="defaultPdf" />
    </td>
  </tr>

  <tr>
    <td>3</td>
    <td>PDF 3</td>
    <td style={{ color: "#0d6efd", cursor: "pointer" }}>View</td>
    <td>
      <Form.Check type="radio" name="defaultPdf" />
    </td>
  </tr>
        </tbody>
      </table>
    </div>

    {/* -------- PDF HEADER IMAGE -------- */}
    <div className="table-responsive mt-3">
      <table
        className="table table-sm table-bordered mb-0 align-middle"
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        <tbody style={{ fontSize: "12px" }}>
          <tr>
            <td style={{ width: "30%" }}>PDF Header Image</td>
            <td style={{ width: "50%" }}>
              <Form.Control type="file" size='sm'/>
            </td>
            <td style={{ width: "20%" }}>
              <Button
               size='sm' variant='danger'
                style={{
                  fontSize: "10px",
                }}
              >
                Upload
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="table-responsive mt-3">
      <table
        className="table table-sm table-bordered mb-0 align-middle"
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        <thead>
          <tr style={{ fontSize: "10px" }}>
            <th colSpan={2}>Default PDF Component</th>
          </tr>
        </thead>

        <tbody style={{ fontSize: "10px" }}>
          <tr>
            <td style={{ width: "50%" }}>1. Cover page</td>
            <td></td>
            <td colSpan={2}></td>
          </tr>

          <tr>
            <td>
              2. Trip Snapshot
            </td>
            <td>
                <Form.Check type="checkbox" />
            </td>
            <td>
              3. Trip Summary
            </td>
            <td>
                <Form.Check type="checkbox" />
            </td>
          </tr>

          <tr>
  <td>4. Route Plan</td>
  <td><Form.Check type="checkbox" /></td>
  <td>5. Detailed Itinerary</td>
  <td><Form.Check type="checkbox" defaultChecked /></td>
</tr>

<tr>
  <td>6. Accommodation Details</td>
  <td><Form.Check type="checkbox" defaultChecked /></td>
  <td>7. Flight Details</td>
  <td><Form.Check type="checkbox" defaultChecked /></td>
</tr>

<tr>
  <td>8. Transfers Details</td>
  <td><Form.Check type="checkbox" defaultChecked /></td>
  <td>9. Sightseeing Details</td>
  <td><Form.Check type="checkbox" defaultChecked /></td>
</tr>

<tr>
  <td>10. Price Details</td>
  <td><Form.Check type="checkbox" defaultChecked /></td>
  <td>11. How to Book</td>
  <td><Form.Check type="checkbox" defaultChecked /></td>
</tr>
        </tbody>
      </table>
    </div>
    </div>
  )
}