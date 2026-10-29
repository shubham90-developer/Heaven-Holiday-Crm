import mongoose, { Schema } from "mongoose";
import { IPackage } from "./package.interface";

const PackageSchema = new Schema<IPackage>(
    {
        packageName: { type: String, required: true },
        packageMode: { type: String, required: true },
        packageType: {
            type: String,
            enum: ["Domestic", "Inbound", "International"],
            required: true,
        },
        startingFrom: String,
        endCity: String,
        destinationCovered: String,
        supplier: String,
        categories: [String],
        theme: String,
        inclusives: String,
        specification: String,
        image: String,
        youtubeUrl: String,
        overview: String,
        // createdBy: {
        //     type: Schema.Types.ObjectId,
        //     ref: "Staff",
        //     required: true,
        // },
    },
    {
        timestamps: true,
    }
);

export const Package = mongoose.model<IPackage>(
    "Package",
    PackageSchema
);