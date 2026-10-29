"use client";
import { useRouter } from "next/navigation";
import { Card } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  useGetProposalImageByIdQuery,
  useUpdateProposalImageMutation,
} from "../../../../../../store/services/settings/proposal-images/proposalImageApi";
import ProposalImageForm from "../../ProposalImageForm";

const apiError = (err: any, fallback: string) => {
  const fieldError = Object.values(err?.data?.errors || {}).flat()[0];
  return err?.data?.message || (typeof fieldError === "string" ? fieldError : "") || fallback;
};

const EditProposalImage = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isLoading } = useGetProposalImageByIdQuery(id);
  const [updateProposalImage, { isLoading: isUpdating }] =
    useUpdateProposalImageMutation();
  const item = data?.data;

  if (isLoading) return <p style={{ fontSize: "12px" }}>Loading...</p>;
  if (!item) return <p style={{ fontSize: "12px" }}>Proposal image entry not found.</p>;

  return (
    <Card className="p-3">
      <ProposalImageForm
        mode="edit"
        isSubmitting={isUpdating}
        defaultValues={{
          category: item.category,
          name: item.name,
          city: item.city || "",
          status: item.status || "Active",
          enabled: item.enabled ? "true" : "false",
          images: item.images || [],
        }}
        onCancel={() => router.push("/settings/proposal-images")}
        onSubmit={async ({ formData }) => {
          try {
            await updateProposalImage({ id, formData }).unwrap();
            toast.success("Proposal images updated");
            router.push("/settings/proposal-images");
          } catch (err: any) {
            toast.error(apiError(err, "Failed to update proposal images"));
          }
        }}
      />
    </Card>
  );
};

export default EditProposalImage;
