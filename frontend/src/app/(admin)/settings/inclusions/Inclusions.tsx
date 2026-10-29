"use client";
import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import {
  useGetInclusionsQuery,
  useDeleteInclusionMutation,
} from "../../../../store/services/settings/inclusions/inclusionApi";
import toast from "react-hot-toast";

const Inclusions = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetInclusionsQuery(null);
  const inclusions = data?.data || [];
  const [deleteInclusion, { isLoading: isDeleting }] =
    useDeleteInclusionMutation();

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div>
          <p style={{ fontSize: "12px", marginBottom: "8px" }}>
            Are you sure you want to delete this inclusion?
          </p>
          <div className="d-flex gap-2 justify-content-end">
            <button
              style={{ fontSize: "10px" }}
              className="btn btn-danger btn-sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteInclusion(id).unwrap();
                  toast.success("Inclusion deleted successfully");
                } catch {
                  toast.error("Failed to delete inclusion. Please try again.");
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
      ),
      { duration: Infinity }
    );
  };

  return (
    <div>
      <Card className="p-3">
        <div className="text-end mb-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/settings/inclusions/add-inclusion")}
            style={{ fontSize: "10px" }}
          >
            <Icon icon="mdi:plus" /> Add Inclusion
          </Button>
        </div>

        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "60px" }}>S.No</th>
                <th>Title</th>
                <th style={{ width: "100px" }}>Enabled</th>
                <th style={{ width: "100px" }}>Status</th>
                <th style={{ width: "120px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center"
                    style={{ fontSize: "12px" }}
                  >
                    Loading...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-danger"
                    style={{ fontSize: "12px" }}
                  >
                    Failed to load inclusions
                  </td>
                </tr>
              )}

              {!isLoading && !isError && inclusions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center"
                    style={{ fontSize: "12px" }}
                  >
                    No inclusions found
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                inclusions.map((item: any, index: number) => (
                  <tr key={item._id} style={{ fontSize: "12px" }}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>
                      {item.enabled && (
                        <Form.Check.Input
                          type="checkbox"
                          className="border border-2 border-primary"
                          checked
                          readOnly
                          style={{ margin: 0 }}
                        />
                      )}
                    </td>
                    <td>{item.status}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="primary"
                          size="sm"
                          title="edit"
                          onClick={() =>
                            router.push(
                              `/settings/inclusions/edit-inclusion/${item._id}`
                            )
                          }
                          style={{ fontSize: "10px" }}
                        >
                          <Icon icon="mdi:edit" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          title="delete"
                          style={{ fontSize: "10px" }}
                          disabled={isDeleting}
                          onClick={() => handleDelete(item._id)}
                        >
                          <Icon icon="mdi:delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Inclusions;
