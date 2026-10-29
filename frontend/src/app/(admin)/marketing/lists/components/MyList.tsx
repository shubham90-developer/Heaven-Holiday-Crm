"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";

const groupPillStyle = (active: boolean): React.CSSProperties => ({
  border: active ? "none" : "1px solid #d9dee8",
  background: active ? "#1361e8" : "#fff",
  color: active ? "#fff" : "#374151",
  borderRadius: 6,
  padding: "6px 14px",
  fontSize: 11,
  fontWeight: 600,
});

// TODO: replace with real lists from your list API
const LISTS = [
  {
    id: "1",
    name: "B2B_All_Clients",
    fromEmail: "b2b.aheaven@gmail.com",
    fromName: "A HEAVEN HOSPITALITY PVT LTD",
    contacts: 52,
    status: "Active",
  },
  {
    id: "2",
    name: "B2C_All_Clients",
    fromEmail: "b2b.aheaven@gmail.com",
    fromName: "A HEAVEN HOSPITALITY PVT LTD",
    contacts: 3026,
    status: "Active",
  },
];

const MyList = () => {
  const router = useRouter();
  const [createdBy, setCreatedBy] = useState<"auto" | "own">("auto");
  const [listType, setListType] = useState<"customer" | "birthday" | "anniversary" | "query">("customer");
  const [selectedLists, setSelectedLists] = useState<string[]>([]);

  const handleAction = (action: string, listName: string) => {
    toast(`${action}: ${listName}`, { icon: "🚧" });
  };

  return (
    <>
      <div className="d-flex gap-2 mb-3">
        <button type="button" style={groupPillStyle(createdBy === "auto")} onClick={() => setCreatedBy("auto")}>
          Auto Created List
        </button>
        <button type="button" style={groupPillStyle(createdBy === "own")} onClick={() => setCreatedBy("own")}>
          Own Created List
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            style={groupPillStyle(listType === "customer")}
            onClick={() => setListType("customer")}
          >
            Customer List
          </button>
          <button
            type="button"
            style={groupPillStyle(listType === "birthday")}
            onClick={() => setListType("birthday")}
          >
            Birthday Customer List
          </button>
          <button
            type="button"
            style={groupPillStyle(listType === "anniversary")}
            onClick={() => setListType("anniversary")}
          >
            Anniversary Customer List
          </button>
          <button
            type="button"
            style={groupPillStyle(listType === "query")}
            onClick={() => setListType("query")}
          >
            Query List
          </button>
        </div>
      </div>

      <Card className="p-3">
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
            {/* Left Section */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={() => toast("New View is coming soon", { icon: "🚧" })}
              >
                <Icon icon="mdi:open-in-new" className="me-1" /> New View
              </Button>
            </div>

            {/* right side */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                style={{ fontSize: "10px", fontWeight: "bold" }}
                onClick={() => router.push("/marketing/lists/add-list")}
              >
                <Icon icon="mdi:plus" className="me-1" /> Create List
              </Button>
              <Button variant="outline-secondary" size="sm" style={{ fontSize: "10px", fontWeight: "bold" }}>
                <Icon icon="mdi:file-export" />
              </Button>
            </div>
          </div>

          <Row className="align-items-center">
            <Col lg={8}>
              <h6 className="fw-bold">
                Total Record Found :- <span className="text-primary">{LISTS.length}</span>
              </h6>
            </Col>
            <Col lg={4}>
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
                style={{ fontSize: "10px" }}
              />
            </Col>
          </Row>
        </div>

        <div className="table-responsive">
          <table
            className="table table-sm table-bordered mb-0 align-middle"
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={selectedLists.length === LISTS.length}
                    onChange={(e) =>
                      setSelectedLists(e.target.checked ? LISTS.map((l) => l.id) : [])
                    }
                  />
                </th>
                <th style={{ width: "220px" }}>List Name</th>
                <th style={{ width: "220px" }}>From Email Id</th>
                <th style={{ width: "260px" }}>From Email Name</th>
                <th style={{ width: "120px" }}>No of Contact</th>
                <th style={{ width: "100px" }}>Status</th>
                <th style={{ width: "90px" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "12px" }}>
              {LISTS.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center">
                    No lists found
                  </td>
                </tr>
              )}

              {LISTS.map((list) => (
                <tr key={list.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedLists.includes(list.id)}
                      onChange={(e) =>
                        setSelectedLists((prev) =>
                          e.target.checked ? [...prev, list.id] : prev.filter((id) => id !== list.id)
                        )
                      }
                    />
                  </td>
                  <td className="fw-semibold">{list.name}</td>
                  <td>{list.fromEmail}</td>
                  <td>{list.fromName}</td>
                  <td>{list.contacts}</td>
                  <td>
                    <span className="badge bg-success">{list.status}</span>
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <Button
                        variant="success"
                        size="sm"
                        style={{ fontSize: "8px" }}
                        onClick={() => handleAction("View Contacts", list.name)}
                      >
                        <Icon icon="mdi:eye-outline" />
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        style={{ fontSize: "8px" }}
                        onClick={() => handleAction("Edit", list.name)}
                      >
                        <Icon icon="mdi:pencil-outline" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        style={{ fontSize: "8px" }}
                        onClick={() => handleAction("Delete", list.name)}
                      >
                        <Icon icon="mdi:trash-can-outline" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default MyList;
