import { Schema, model } from "mongoose";
import { IDriver } from "./driver.interface";

const driverSchema = new Schema<IDriver>(
    {
        driverName: {
            type: String,
            required: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
        },
        languages: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        country: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        drivingLicense: {
            type: String,
        },
        primaryVehicle: {
            type: Schema.Types.ObjectId,
            ref: "Vehicle_Transport",
            required: false,
        },
        image: {
            type: String,
        },
        remark: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const DriverModel = model<IDriver>("Vehicle_Driver", driverSchema);