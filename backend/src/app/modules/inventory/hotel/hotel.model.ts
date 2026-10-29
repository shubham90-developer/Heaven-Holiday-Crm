import mongoose, { Schema } from "mongoose";
import { THotel } from "./hotel.interface";

const weekendSchema = new Schema(
  {
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false },
  },
  { _id: false }
);

const hotelSchema = new Schema<THotel>(
  {
    hotelName: { type: String, required: true, trim: true },
    cityName: { type: String, required: true },
    contactEmail: { type: String },
    countryCode: { type: String, default: "+91" },
    contactNo: { type: String, required: true },
    starRating: { type: Number, min: 1, max: 5 },
    propertyType: { type: String, required: true },
    checkInTime: { type: String, required: true },
    checkOutTime: { type: String, required: true },
    weekend: { type: weekendSchema, required: true },
    roomType: { type: String },
    childAge: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Hotel = mongoose.model<THotel>("Hotel", hotelSchema);