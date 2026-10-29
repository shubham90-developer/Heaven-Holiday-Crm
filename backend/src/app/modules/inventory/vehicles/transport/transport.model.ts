import { Schema, model } from "mongoose";
import { ITransport } from "./transport.interface";

const transportSchema = new Schema<ITransport>(
    {
        carType: {
            type: String,
            enum: ["Luxury", "Standard"],
            required: true,
        },
        transportName: {
            type: String,
            required: true,
            trim: true,
        },
        seatingCapacity: {
            type: Number,
            required: true,
        },
        ac: {
            type: Boolean,
            required: true,
        },
        vehicleNo: {
            type: String,
            required: true,
            unique: true,
        },
        numberOfVehicles: {
            type: Number,
            required: true,
            default: 1,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const TransportModel = model<ITransport>(
    "Vehicle_Transport",
    transportSchema
);