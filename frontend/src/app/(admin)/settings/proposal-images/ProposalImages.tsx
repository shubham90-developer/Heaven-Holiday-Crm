"use client";
import React, { useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useDeleteProposalImageMutation,
  useGetProposalImagesQuery,
} from "../../../../store/services/settings/proposal-images/proposalImageApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const imageSrc = (url: string) =>
  url.startsWith("http") ? url : `${API_URL}${url}`;

const ProposalImages = () => {
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const { data, isLoading, isError } = useGetProposalImagesQuery(null);
  const allItems = data?.data || [];
  const items = useMemo(
    () =>
      category === "all"
        ? allItems
        : allItems.filter((item: any) => item.category === category),
    [allItems, category]
  );
  const [deleteProposalImage, { isLoading: isDeleting }] =
    useDeleteProposalImageMutation();

  const counts = useMemo(() => {
    const list = allItems;
    return {
      all: list.length,
      destination: list.filter((item: any) => item.category === "destination").length,
      sightseeing: list.filter((item: any) => item.category === "sightseeing").length,
    };
  }, [allItems]);

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div>
          <p style={{ fontSize: "12px", marginBottom: "8px" }}>
            Delete this proposal image set? It will no longer appear in PDFs.
          </p>
          <div className="d-flex gap-2 justify-content-end">
            <button
              style={{ fontSize: "10px" }}
              className="btn btn-danger btn-sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteProposalImage(id).unwrap();
                  toast.success("Proposal images deleted");
                } catch {
                  toast.error("Failed to delete. Please try again.");
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
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div className="d-flex gap-2">
            {[
              { key: "all", label: `All (${counts.all})` },
              { key: "destination", label: `Destinations (${counts.destination})` },
              { key: "sightseeing", label: `Sightseeing (${counts.sightseeing})` },
            ].map((tab) => (
              <Button
                key={tab.key}
                size="sm"
                variant={category === tab.key ? "primary" : "outline-primary"}
                style={{ fontSize: "10px" }}
                onClick={() => setCategory(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              router.push("/settings/proposal-images/add-proposal-image")
            }
            style={{ fontSize: "10px" }}
          >
            <Icon icon="mdi:plus" /> Add Proposal Images
          </Button>
        </div>

        <div
          className="mb-3 p-2"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "11px" }}
        >
          Upload destination and sightseeing photos here. Custom proposal PDFs use
          only these images. Match names to the query destination / sightseeing
          (for example Thailand, Pattaya, Alcazar Show).
        </div>

        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "50px" }}>S.No</th>
                <th>Preview</th>
                <th>Category</th>
                <th>Name</th>
                <th>City</th>
                <th>Images</th>
                <th>Status</th>
                <th style={{ width: "120px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="text-center" style={{ fontSize: "12px" }}>
                    Loading...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={8} className="text-center text-danger" style={{ fontSize: "12px" }}>
                    Failed to load proposal images
                  </td>
                </tr>
              )}
              {!isLoading && !isError && items.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center" style={{ fontSize: "12px" }}>
                    No proposal images yet. Add destination and sightseeing photos.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                items.map((item: any, index: number) => (
                  <tr key={item._id} style={{ fontSize: "12px" }}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {(item.images || []).slice(0, 4).map((image: any) => (
                          <img
                            key={image.url}
                            src={imageSrc(image.url)}
                            alt=""
                            style={{
                              width: 56,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 3,
                              background: "#eee",
                            }}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="text-capitalize">{item.category}</td>
                    <td>{item.name}</td>
                    <td>{item.city || "—"}</td>
                    <td>{item.images?.length || 0}</td>
                    <td>
                      {item.enabled ? "Enabled" : "Disabled"} / {item.status}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="primary"
                          size="sm"
                          title="edit"
                          onClick={() =>
                            router.push(
                              `/settings/proposal-images/edit-proposal-image/${item._id}`
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

export default ProposalImages;
