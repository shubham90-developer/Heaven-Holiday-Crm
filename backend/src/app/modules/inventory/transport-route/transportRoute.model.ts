import mongoose, { Schema } from "mongoose";
import { ITransportRoute } from "./transportRoute.interface";

const transportSchema = new Schema<ITransportRoute>(
  {
    category: String,

    transferTypes: [String],

    transportType: String,

    startCity: String,
    destinationCity: String,
    routeName: String,

    citiesIncluded: [
      {
        city: String,
        noOfDays: Number,
        destinationsCovered: String,
        sightseeingCovered: String,
      },
    ],

    description: String,

    pickupPointArea: String,
    dropPointArea: String,

    region: String,
    state: String,
    country: String,

    vehicleCostType: String,

    currency: String,

    seasons: [
      {
        from: String,
        to: String,
        markUpType: String,
        b2c: Number,
        b2b: Number,
      },
    ],

    website: Boolean,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransportRoute>(
  "TransportRoute",
  transportSchema
);