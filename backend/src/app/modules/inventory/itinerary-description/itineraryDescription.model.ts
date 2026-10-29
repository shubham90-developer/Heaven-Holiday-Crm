import mongoose, { Schema, Document } from "mongoose";
import { IItinerary } from "./itineraryDescription.interface";

export interface ItineraryDocument extends IItinerary, Document { }

const itinerarySchema = new Schema<ItineraryDocument>(
    {
        startCity: {
            type: String,
            required: true,
            trim: true,
        },
        destinationCity: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    { timestamps: true }
);

export default mongoose.model<ItineraryDocument>(
    "Itinerary",
    itinerarySchema
);