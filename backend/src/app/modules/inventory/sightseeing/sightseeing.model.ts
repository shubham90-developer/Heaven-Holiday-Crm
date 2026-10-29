import mongoose, { Schema } from "mongoose";
import { ISightseeing } from "./sightseeing.interface";

const sightseeingSchema = new Schema<ISightseeing>(
  {
    country: String,
    city: String,
    sightseeingName: String,
    latitude: String,
    longitude: String,
    image: String,
    address: String,
    isUnique: Boolean,

    details: String,

    category: String,
    activities: String,
    difficultyLevel: String,
    season: String,
    daysOfWeek: String,
    popularity: String,
    thingsToCarry: String,
    pickupPoint: String,
    pickupTime: String,

    minPax: Number,
    maxPax: Number,

    durationDays: Number,
    durationMinutes: Number,

    minAge: Number,
    maxAge: Number,

    operatingTime: [
      {
        from: String,
        to: String,
      },
    ],

    otherInclusions: String,
    advisory: String,
    cancellationPolicy: String,
    refundPolicy: String,
    confirmationPolicy: String,
    termsConditions: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISightseeing>(
  "Sightseeing",
  sightseeingSchema
);