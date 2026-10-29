"use client";
import React, { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js';
import { Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import { useRouter } from 'next/navigation';
import Filter from './Filter';
import { useGetVisasQuery, useDeleteVisaMutation } from "../../../../../store/services/inventory/visa/visaApi";
import toast from "react-hot-toast";

const Visa = () => {
  const router = useRouter()
  const [filters, setFilters] = useState<any>({});

  const { data: response, isLoading, isError } = useGetVisasQuery(filters);
  const [deleteVisa, { isLoading: deletingVisa }] = useDeleteVisaMutation();

  const visas = response?.data || [];

  return (
    <>
      <div className='mb-2'>
        <Filter onApply={setFilters} />
      </div>
      <Card className='p-3'>
        <div className="mb-2">
          <div className='text-end'>
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push("/my-inventory/visa/add-visa")}
              style={{ fontSize: "10px", fontWeight: "bold" }}
            >
              <Icon icon="mdi:plus" />       Add Visa
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "80px" }}>Visa ID</th>
                <th style={{ width: "150px" }}>Nationality</th>
                <th style={{ width: "150px" }}>Country</th>
                <th style={{ width: "150px" }}>Visa Name</th>
                <th style={{ width: "120px" }}>Visa Required</th>
                <th style={{ width: "150px" }}>Visa Category</th>
                <th style={{ width: "150px" }}>Visa Type</th>
                <th style={{ width: "140px" }}>Processing Time</th>
                <th style={{ width: "180px" }}>Passport Expire (Days)</th>
                <th style={{ width: "120px" }}>Validity</th>
                <th style={{ width: "120px" }}>Duration</th>
                <th style={{ width: "120px" }}>Currency</th>
                <th style={{ width: "130px" }}>Adult Rates</th>
                <th style={{ width: "130px" }}>Child Rates</th>
                <th style={{ width: "130px" }}>Infant Rates</th>
                <th style={{ width: "100px" }}>DOW</th>
                <th style={{ width: "100px" }}>Status</th>
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={18} className="text-center">
                    Loading visas...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={18} className="text-center text-danger">
                    Failed to load data
                  </td>
                </tr>
              ) : visas.length > 0 ? (
                visas.map((visa: any, index: number) => (
                  <tr key={visa._id || index} style={{ fontSize: "12px" }}>
                    <td>{index + 1}</td>
                    <td>{visa.travelerNationality}</td>
                    <td>{visa.countriesCovered}</td>
                    <td>{visa.visaName}</td>
                    <td>{visa.visaType}</td>
                    <td>{visa.visaCategory}</td>
                    <td>{visa.entryType}</td>
                    <td>{visa.processingTime}</td>
                    <td>{visa.passportExpireDays}</td>
                    <td>{visa.validityDays}</td>
                    <td>{visa.duration}</td>
                    <td>{visa.embassyFeeCurrency}</td>
                    <td>{visa.adultFee}</td>
                    <td>{visa.childFee}</td>
                    <td>{visa.infantFee}</td>

                    <td>
                      <Form.Check />
                    </td>

                    <td>Active</td>

                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            router.push(`/my-inventory/visa/edit-visa/${visa._id}`)
                          }
                        >
                          <Icon icon="mdi:edit" />
                        </Button>

                        <Button variant="danger" size="sm" disabled={deletingVisa}
                          onClick={() => {
                            toast((t) => (
                              <div>
                                <p className="mb-2" style={{ fontSize: "13px" }}>
                                  Are you sure you want to delete this visa?
                                </p>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={async () => {
                                      toast.dismiss(t.id);
                                      try {
                                        await deleteVisa(visa._id).unwrap();
                                        toast.success("Visa deleted successfully");
                                      } catch (err) {
                                        toast.error("Failed to delete visa");
                                      }
                                    }}
                                  >
                                    Yes, Delete
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => toast.dismiss(t.id)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ), { duration: Infinity });
                          }}>
                          <Icon icon="mdi:close" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={18} className="text-center">
                    No visas found
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>
      </Card>
    </>
  )
}

export default Visa
