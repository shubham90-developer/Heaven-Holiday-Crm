"use client";
import { useRouter } from "next/navigation";
import { Card } from "react-bootstrap";
import toast from "react-hot-toast";
import { useCreateProposalImageMutation } from "../../../../../store/services/settings/proposal-images/proposalImageApi";
import ProposalImageForm from "../ProposalImageForm";

const apiError = (err: any, fallback: string) => {
  const fieldError = Object.values(err?.data?.errors || {}).flat()[0];
  return err?.data?.message || (typeof fieldError === "string" ? fieldError : "") || fallback;
};

const AddProposalImage = () => {
  const router = useRouter();
  const [createProposalImage, { isLoading }] = useCreateProposalImageMutation();

  return (
    <Card className="p-3">
      <ProposalImageForm
        mode="add"
        isSubmitting={isLoading}
        onCancel={() => router.push("/settings/proposal-images")}
        onSubmit={async ({ formData }) => {
          try {
            await createProposalImage(formData).unwrap();
            toast.success("Proposal images saved");
            router.push("/settings/proposal-images");
          } catch (err: any) {
            toast.error(apiError(err, "Failed to save proposal images"));
          }
        }}
      />
    </Card>
  );
};

export default AddProposalImage;
