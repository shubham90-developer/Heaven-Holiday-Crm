"use client";
import React from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Modal,
  Tabs,
  Tab,
  Accordion,
  AccordionBody,
  AccordionItem,
  AccordionHeader,
  CardHeader,
  CardBody
} from "react-bootstrap";
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import toast from "react-hot-toast";
import {
  useGetAllEmailTemplatesQuery,
  useDeleteEmailTemplateMutation
} from "../../../../store/services/settings/email-template/emailTemplateApi";

const EmailTemplate = () => {
  const router = useRouter()
  const { data, isLoading } = useGetAllEmailTemplatesQuery(null);
  const [deleteEmailTemplate] = useDeleteEmailTemplateMutation();

  const handleDelete = (id: any) => {
    toast((t) => (
      <div>
        <p style={{ fontSize: "12px", marginBottom: "8px" }}>
          Are you sure you want to delete this template?
        </p>
        <div className="d-flex gap-2 justify-content-end">
          <button
            style={{ fontSize: "10px" }}
            className="btn btn-danger btn-sm"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteEmailTemplate(id).unwrap();
                toast.success("Email template deleted successfully");
              } catch (err) {
                toast.error("Failed to delete template. Please try again.");
              }
            }}
          >
            Yes, Delete
          </button>
          <button
            style={{ fontSize: "10px" }}
            className="btn btn-secondary btn-sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <>
      <Card className="p-2">
        <div className='text-end mb-3'>
          <Button variant='primary' size='sm'
            onClick={() => router.push('/settings/email-templates/add-template')}
            style={{ fontSize: "10px" }}><Icon icon="mdi:plus" />Add Email Template</Button>
        </div>

        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th>Template Name</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center" style={{ fontSize: "10px" }}>
                    Loading...
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center" style={{ fontSize: "10px" }}>
                    No email templates found
                  </td>
                </tr>
              ) : (
                data?.data?.map((template: any) => (
                  <tr key={template._id} style={{ fontSize: "12px" }}>
                    <td>{template.templateName}</td>
                    <td>{template.subject}</td>
                    <td>
                      <span className={`badge ${template.status === "Active" ? "bg-success" : "bg-secondary"}`}
                        style={{ fontSize: "10px" }}>
                        {template.status}
                      </span>
                    </td>
                    <td>
                      <div className='d-flex gap-2'>
                        <Button
                          variant='primary'
                          size='sm'
                          title='edit'
                          onClick={() => router.push(`/settings/email-templates/edit-template/${template._id}`)}
                          style={{ fontSize: "10px" }}
                        >
                          <Icon icon="mdi:edit" />
                        </Button>
                        <Button
                          variant='danger'
                          size='sm'
                          title='delete'
                          onClick={() => handleDelete(template._id)}
                          style={{ fontSize: "10px" }}
                        >
                          <Icon icon="mdi:delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </>
  )
}

export default EmailTemplate
