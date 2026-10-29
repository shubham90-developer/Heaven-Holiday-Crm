"use client";

import { useMemo, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import CustomFlatpickr from "@/components/CustomFlatpickr";

const SHARING_OPTIONS = [
  "Single Sharing",
  "Twin Sharing",
  "Triple Sharing",
  "Quad Sharing",
  "Quint Sharing",
  "Hexa Sharing",
] as const;

type SharingOption = (typeof SHARING_OPTIONS)[number];

type RoomConfig = {
  id: number;
  sharing: SharingOption;
  adults: number;
  children: number;
  infants: number;
};

const createRoom = (id: number, adults = 2): RoomConfig => ({
  id,
  sharing: "Twin Sharing",
  adults,
  children: 0,
  infants: 0,
});

type ModifyQueryPanelProps = {
  initialDate?: string;
  initialAdults?: number;
  onCancel: () => void;
  onUpdate?: (data: { travelDate: string; rooms: RoomConfig[] }) => void;
};

const ModifyQueryPanel = ({
  initialDate = "",
  initialAdults = 2,
  onCancel,
  onUpdate,
}: ModifyQueryPanelProps) => {
  const [travelDate, setTravelDate] = useState(initialDate);
  const [rooms, setRooms] = useState<RoomConfig[]>([createRoom(1, initialAdults)]);
  const [travelersOpen, setTravelersOpen] = useState(false);
  const [draftRooms, setDraftRooms] = useState<RoomConfig[]>([createRoom(1, initialAdults)]);

  const totalAdults = useMemo(
    () => rooms.reduce((sum, room) => sum + room.adults, 0),
    [rooms]
  );

  const travelersLabel = `Travelers: ${totalAdults} Adult${totalAdults !== 1 ? "s" : ""}`;

  const openTravelers = () => {
    setDraftRooms(rooms.map((room) => ({ ...room })));
    setTravelersOpen(true);
  };

  const updateDraftRoom = (
    roomId: number,
    field: keyof Omit<RoomConfig, "id">,
    value: string | number
  ) => {
    setDraftRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    );
  };

  const addRoom = () => {
    setDraftRooms((prev) => [
      ...prev,
      createRoom(prev.length > 0 ? Math.max(...prev.map((r) => r.id)) + 1 : 1),
    ]);
  };

  const removeRoom = (roomId: number) => {
    if (draftRooms.length === 1) return;
    setDraftRooms((prev) => prev.filter((room) => room.id !== roomId));
  };

  const handleTravelersDone = () => {
    setRooms(draftRooms);
    setTravelersOpen(false);
  };

  const handleUpdate = () => {
    onUpdate?.({ travelDate, rooms });
    onCancel();
  };

  return (
    <div className="ccp-modify-query-section">
      <div className="ccp-modify-query-header">Modify Query</div>
      <div className="ccp-modify-query-body">
        <Row className="g-2 align-items-center">
          <Col md={3}>
            <CustomFlatpickr
              className="form-control ccp-modify-input"
              placeholder="Select date"
              value={travelDate}
              onChange={(dates: Date[]) => {
                if (dates[0]) {
                  setTravelDate(dates[0].toISOString().split("T")[0]);
                }
              }}
            />
          </Col>
          <Col md={5}>
            <div className="ccp-travelers-field">
              <button
                type="button"
                className="ccp-modify-input ccp-travelers-trigger"
                onClick={openTravelers}
              >
                <span>{travelersLabel}</span>
                <IconifyIcon icon="mdi:chevron-down" />
              </button>

              {travelersOpen && (
                <>
                  <div
                    className="ccp-travelers-backdrop"
                    onClick={() => setTravelersOpen(false)}
                  />
                  <div className="ccp-travelers-popover">
                    <div className="ccp-travelers-popover-inner">
                      {draftRooms.map((room, index) => (
                        <div key={room.id} className="ccp-room-block">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="ccp-room-title">
                              Room {index + 1}
                            </span>
                            {draftRooms.length > 1 && (
                              <button
                                type="button"
                                className="ccp-room-delete-btn"
                                onClick={() => removeRoom(room.id)}
                                aria-label="Remove room"
                              >
                                <IconifyIcon icon="mdi:delete-outline" />
                              </button>
                            )}
                          </div>

                          <Row className="g-2 mb-3">
                            {SHARING_OPTIONS.map((option) => (
                              <Col xs={6} md={4} key={option}>
                                <Form.Check
                                  type="checkbox"
                                  id={`sharing-${room.id}-${option}`}
                                  label={option}
                                  checked={room.sharing === option}
                                  onChange={() =>
                                    updateDraftRoom(room.id, "sharing", option)
                                  }
                                  className="ccp-sharing-check"
                                />
                              </Col>
                            ))}
                          </Row>

                          <Row className="g-2">
                            <Col md={4}>
                              <label className="ccp-pax-label">
                                ADULTS (+12 YRS)
                              </label>
                              <Form.Select
                                size="sm"
                                className="ccp-modify-input"
                                value={room.adults}
                                onChange={(e) =>
                                  updateDraftRoom(
                                    room.id,
                                    "adults",
                                    Number(e.target.value)
                                  )
                                }
                              >
                                {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                  (n) => (
                                    <option key={n} value={n}>
                                      {n}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                            </Col>
                            <Col md={4}>
                              <label className="ccp-pax-label">
                                CHILDREN (0-11 YRS)
                              </label>
                              <Form.Select
                                size="sm"
                                className="ccp-modify-input"
                                value={room.children}
                                onChange={(e) =>
                                  updateDraftRoom(
                                    room.id,
                                    "children",
                                    Number(e.target.value)
                                  )
                                }
                              >
                                {Array.from({ length: 6 }, (_, i) => i).map(
                                  (n) => (
                                    <option key={n} value={n}>
                                      {n}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                            </Col>
                            <Col md={4}>
                              <label className="ccp-pax-label">
                                INFANT (0-2 YRS)
                              </label>
                              <Form.Select
                                size="sm"
                                className="ccp-modify-input"
                                value={room.infants}
                                onChange={(e) =>
                                  updateDraftRoom(
                                    room.id,
                                    "infants",
                                    Number(e.target.value)
                                  )
                                }
                              >
                                {Array.from({ length: 6 }, (_, i) => i).map(
                                  (n) => (
                                    <option key={n} value={n}>
                                      {n}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>

                    <div className="ccp-travelers-popover-footer">
                      <button
                        type="button"
                        className="ccp-add-room-btn"
                        onClick={addRoom}
                      >
                        Add More Room
                      </button>
                      <button
                        type="button"
                        className="ccp-travelers-done-btn"
                        onClick={handleTravelersDone}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Col>
          <Col md={4} className="d-flex justify-content-md-end gap-2">
            <button
              type="button"
              className="ccp-modify-cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="ccp-modify-update-btn"
              onClick={handleUpdate}
            >
              Update Query
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ModifyQueryPanel;
