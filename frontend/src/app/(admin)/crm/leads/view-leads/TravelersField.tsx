"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useRef, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import {
  PAX_FIELDS,
  type PaxDetails,
  normalizePaxDetails,
  paxTotal,
} from "../../utils/paxDetails";

type Props = {
  section: string;
  onChange: (section: any, field: string, value: any) => void;
  paxDetails?: Partial<PaxDetails> | null;
  travelers?: number;
};

export default function TravelersField({
  section,
  onChange,
  paxDetails,
  travelers,
}: Props) {
  const [open, setOpen] = useState(false);
  const seeded = useRef(false);
  const pax = normalizePaxDetails(paxDetails, travelers, { fallbackTwin: 2 });
  const total = paxTotal(pax);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (paxTotal(paxDetails) > 0) return;
    const seededPax = normalizePaxDetails(paxDetails, travelers, {
      fallbackTwin: 2,
    });
    onChange(section, "paxDetails", seededPax);
    onChange(section, "travelers", paxTotal(seededPax));
  }, [onChange, paxDetails, section, travelers]);

  const handlePaxChange = (key: string, value: number) => {
    const updated: PaxDetails = {
      ...pax,
      [key]: Math.max(0, value),
    };
    onChange(section, "paxDetails", updated);
    onChange(section, "travelers", paxTotal(updated));
  };

  return (
    <Col md={3}>
      <div style={{ position: "relative" }}>
        <Form.Group>
          <Form.Label style={{ fontSize: "10px" }} className="text-primary">
            Travelers
          </Form.Label>

          <div style={{ position: "relative" }}>
            <Form.Control
              readOnly
              value={total === 0 ? "Select Travelers" : String(total)}
              size="sm"
              onClick={() => setOpen(!open)}
              style={{
                cursor: "pointer",
                fontSize: "12px",
              }}
            />

            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "14px",
              }}
            >
              <Icon icon="mdi:chevron-down" />
            </span>
          </div>
        </Form.Group>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "70px",
              width: "100%",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            <h6 className="mb-3">Pax Details</h6>

            {PAX_FIELDS.map(({ label, key }) => (
              <Form.Group className="mb-2" key={key}>
                <Row className="align-items-center">
                  <Col xs={8}>
                    <Form.Label style={{ fontSize: "11px", marginBottom: 0 }}>
                      {label}
                    </Form.Label>
                  </Col>
                  <Col xs={4}>
                    <Form.Control
                      type="number"
                      min={0}
                      value={pax[key]}
                      onChange={(e) =>
                        handlePaxChange(key, parseInt(e.target.value, 10) || 0)
                      }
                      className="text-center"
                      size="sm"
                      style={{ fontSize: "12px" }}
                    />
                  </Col>
                </Row>
              </Form.Group>
            ))}

            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
              <span style={{ fontSize: "12px", fontWeight: 600 }}>
                Total: {total}
              </span>
            </div>

            <Button
              variant="primary"
              className="w-100 mt-3"
              onClick={() => setOpen(false)}
              style={{
                border: "none",
                fontWeight: 500,
              }}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </Col>
  );
}
