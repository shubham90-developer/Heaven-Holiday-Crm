import { Schema, model, Document } from "mongoose";
import {
    IProposalImage,
    IProposalImageFile,
    ProposalImageCategory,
    ProposalImageStatus,
} from "./proposalImage.interface";

export interface IProposalImageDocument extends IProposalImage, Document {}

const imageFileSchema = new Schema<IProposalImageFile>(
    {
        fileName: { type: String, required: true },
        url: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
    },
    { _id: false }
);

const proposalImageSchema = new Schema<IProposalImageDocument>(
    {
        category: {
            type: String,
            enum: ["destination", "sightseeing"] as ProposalImageCategory[],
            required: true,
        },
        name: { type: String, required: true, trim: true },
        city: { type: String, trim: true, default: "" },
        images: { type: [imageFileSchema], default: [] },
        status: {
            type: String,
            enum: ["Active", "Inactive"] as ProposalImageStatus[],
            default: "Active",
        },
        enabled: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

proposalImageSchema.index({ category: 1, name: 1, isDeleted: 1 });
proposalImageSchema.index({ enabled: 1, status: 1, isDeleted: 1 });

export const ProposalImageModel = model<IProposalImageDocument>(
    "ProposalImage",
    proposalImageSchema
);
