"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export const IMAGE_SPECS = {
  formats: "JPG, JPEG, PNG, WEBP",
  maxBytes: 2 * 1024 * 1024,
  destination: { width: 1200, height: 700, label: "1200 × 700 px landscape" },
  sightseeing: { width: 800, height: 500, label: "800 × 500 px landscape" },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const readDimensions = (file: File) =>
  new Promise<{ width: number; height: number }>((resolve) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });

type ExistingImage = {
  url: string;
  originalName?: string;
};

type FilePreview = {
  file: File;
  url: string;
  width: number;
  height: number;
};

type ProposalImageFormProps = {
  mode: "add" | "edit";
  isSubmitting?: boolean;
  defaultValues?: {
    category: string;
    name: string;
    city: string;
    status: string;
    enabled: string;
    images?: ExistingImage[];
  };
  onCancel: () => void;
  onSubmit: (payload: { formData: FormData }) => Promise<void>;
};

const ProposalImageForm = ({
  mode,
  isSubmitting,
  defaultValues,
  onCancel,
  onSubmit,
}: ProposalImageFormProps) => {
  const [category, setCategory] = useState(defaultValues?.category || "destination");
  const [name, setName] = useState(defaultValues?.name || "");
  const [city, setCity] = useState(defaultValues?.city || "");
  const [status, setStatus] = useState(defaultValues?.status || "Active");
  const [enabled, setEnabled] = useState(defaultValues?.enabled || "true");
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [existing, setExisting] = useState<ExistingImage[]>(
    defaultValues?.images || []
  );
  const [error, setError] = useState("");
  const previewsRef = useRef<FilePreview[]>([]);
  previewsRef.current = previews;

  useEffect(() => {
    if (!defaultValues) return;
    setCategory(defaultValues.category || "destination");
    setName(defaultValues.name || "");
    setCity(defaultValues.city || "");
    setStatus(defaultValues.status || "Active");
    setEnabled(defaultValues.enabled || "true");
    setExisting(defaultValues.images || []);
  }, [defaultValues]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  const spec =
    category === "sightseeing" ? IMAGE_SPECS.sightseeing : IMAGE_SPECS.destination;

  const validateFiles = (list: File[]) => {
    for (const file of list) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        return `${file.name} is not a supported format. Use JPG, PNG or WEBP.`;
      }
      if (file.size > IMAGE_SPECS.maxBytes) {
        return `${file.name} is ${formatBytes(file.size)}. Maximum allowed is 2 MB.`;
      }
    }
    return "";
  };

  const handleFiles = async (list: FileList | null) => {
    const next = Array.from(list || []);
    const message = validateFiles(next);
    setError(message);
    if (message) return;

    const loaded = await Promise.all(
      next.map(async (file) => ({
        file,
        url: URL.createObjectURL(file),
        ...(await readDimensions(file)),
      }))
    );
    setPreviews((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url));
      return loaded;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!existing.length && !previews.length) {
      setError("Please upload at least one image");
      return;
    }
    const files = previews.map((item) => item.file);
    const message = validateFiles(files);
    if (message) {
      setError(message);
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("name", name.trim());
    formData.append("city", category === "sightseeing" ? city.trim() : "");
    formData.append("status", status);
    formData.append("enabled", enabled);
    formData.append("keepUrls", JSON.stringify(existing.map((item) => item.url)));
    files.forEach((file) => formData.append("images", file));
    await onSubmit({ formData });
  };

  const sizeHint = useMemo(
    () =>
      category === "sightseeing"
        ? "Use this name exactly as the sightseeing / activity (example: Alcazar Show)."
        : "Use this name exactly as the destination or city (example: Thailand or Pattaya).",
    [category]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <div
        className="mb-3 p-3"
        style={{ background: "#fff7ed", border: "1px solid #fed7aa", fontSize: "12px" }}
      >
        <div className="fw-semibold mb-2">Upload requirements</div>
        <Row className="g-2">
          <Col md={4}>
            <div className="text-muted" style={{ fontSize: "10px" }}>
              Recommended size
            </div>
            <div className="fw-semibold">{spec.label}</div>
          </Col>
          <Col md={4}>
            <div className="text-muted" style={{ fontSize: "10px" }}>
              Supported formats
            </div>
            <div className="fw-semibold">{IMAGE_SPECS.formats}</div>
          </Col>
          <Col md={4}>
            <div className="text-muted" style={{ fontSize: "10px" }}>
              Maximum file size
            </div>
            <div className="fw-semibold">2 MB per image</div>
          </Col>
        </Row>
        <div className="mt-2 text-muted">{sizeHint}</div>
      </div>

      <Row className="g-2">
        <Col md={4}>
          <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
            Category *
          </Form.Label>
          <Form.Select
            size="sm"
            style={{ fontSize: "10px" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="destination">Destination</option>
            <option value="sightseeing">Sightseeing</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
            {category === "sightseeing" ? "Sightseeing name *" : "Destination name *"}
          </Form.Label>
          <Form.Control
            size="sm"
            style={{ fontSize: "10px" }}
            placeholder={
              category === "sightseeing" ? "Alcazar Show" : "Thailand / Pattaya"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Col>
        {category === "sightseeing" && (
          <Col md={4}>
            <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
              City
            </Form.Label>
            <Form.Control
              size="sm"
              style={{ fontSize: "10px" }}
              placeholder="Pattaya"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>
        )}
        <Col md={4}>
          <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
            Status *
          </Form.Label>
          <Form.Select
            size="sm"
            style={{ fontSize: "10px" }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
            Enabled *
          </Form.Label>
          <Form.Select
            size="sm"
            style={{ fontSize: "10px" }}
            value={enabled}
            onChange={(e) => setEnabled(e.target.value)}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Form.Select>
        </Col>
      </Row>

      <div className="mt-3">
        <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
          Images {mode === "add" ? "*" : "(optional extra uploads)"}
        </Form.Label>
        <Form.Control
          type="file"
          size="sm"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple
          onChange={(e) => {
            const input = e.target as HTMLInputElement;
            void handleFiles(input.files);
            input.value = "";
          }}
        />
        {error && (
          <div className="text-danger mt-1" style={{ fontSize: "11px" }}>
            {error}
          </div>
        )}
      </div>

      {existing.length > 0 && (
        <div className="mt-3">
          <div style={{ fontSize: "11px", fontWeight: 600 }} className="mb-2">
            Current images
          </div>
          <div className="d-flex flex-wrap gap-2">
            {existing.map((image) => (
              <div key={image.url} className="position-relative">
                <img
                  src={image.url.startsWith("http") ? image.url : `${API_URL}${image.url}`}
                  alt=""
                  style={{
                    width: 110,
                    height: 72,
                    objectFit: "cover",
                    borderRadius: 4,
                    background: "#eee",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  style={{ fontSize: "10px", padding: "0 5px" }}
                  onClick={() =>
                    setExisting((prev) => prev.filter((item) => item.url !== image.url))
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="mt-3">
          <div style={{ fontSize: "11px", fontWeight: 600 }} className="mb-2">
            New uploads
          </div>
          <div className="d-flex flex-wrap gap-2">
            {previews.map((item) => {
              const sizeOk =
                item.width >= spec.width * 0.7 && item.height >= spec.height * 0.7;
              return (
                <div key={item.url} style={{ width: 130 }}>
                  <img
                    src={item.url}
                    alt={item.file.name}
                    style={{
                      width: 130,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 4,
                      background: "#eee",
                    }}
                  />
                  <div style={{ fontSize: "10px", lineHeight: 1.3 }} className="mt-1">
                    {item.width && item.height
                      ? `${item.width} × ${item.height} px`
                      : "Size unknown"}
                    <br />
                    {formatBytes(item.file.size)}
                    {!sizeOk && item.width > 0 && (
                      <>
                        <br />
                        <span className="text-warning">
                          Recommended {spec.label}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="d-flex gap-2 justify-content-end mt-3">
        <Button
          variant="outline-danger"
          size="sm"
          onClick={onCancel}
          style={{ fontSize: "10px" }}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          size="sm"
          type="submit"
          style={{ fontSize: "10px" }}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Submitting..."
            : mode === "edit"
              ? "Update"
              : "Submit"}
        </Button>
      </div>
    </Form>
  );
};

export default ProposalImageForm;
