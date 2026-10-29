"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useGetThemeByIdQuery,
  useUpdateThemeMutation,
} from "../../../../../../store/services/settings/themes/themeApi";

const EditTheme = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isLoading } = useGetThemeByIdQuery(id);
  const [updateTheme, { isLoading: isUpdating }] = useUpdateThemeMutation();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { title: "", status: "Active", enabled: "true" },
  });

  useEffect(() => {
    if (data?.data) {
      reset({
        title: data.data.title || "",
        status: data.data.status || "Active",
        enabled: data.data.enabled ? "true" : "false",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: any) => {
    try {
      await updateTheme({
        id,
        title: formData.title,
        status: formData.status,
        enabled: formData.enabled === "true",
      }).unwrap();
      toast.success("Theme updated successfully");
      router.push("/settings/themes");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update theme. Please try again.");
    }
  };

  if (isLoading) return <p style={{ fontSize: "12px" }}>Loading...</p>;

  return (
    <div>
      <Card className="p-3">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Theme Name *
              </Form.Label>
              <Form.Control
                size="sm"
                placeholder="Enter theme name"
                style={{ fontSize: "10px" }}
                {...register("title", { required: true })}
              />
            </Col>
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Status *
              </Form.Label>
              <Form.Select size="sm" style={{ fontSize: "10px" }} {...register("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label className="text-primary small" style={{ fontSize: "10px" }}>
                Enabled *
              </Form.Label>
              <Form.Select style={{ fontSize: "10px" }} size="sm" {...register("enabled")}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Col>
          </Row>
          <div className="d-flex gap-2 justify-content-end mt-3">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => router.push("/settings/themes")}
              style={{ fontSize: "10px" }}
            >
              Cancel
            </Button>
            <Button variant="success" size="sm" type="submit" style={{ fontSize: "10px" }}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditTheme;
