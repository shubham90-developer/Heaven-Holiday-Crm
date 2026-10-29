import mongoose, { Schema } from "mongoose";
import { IRestaurant } from "./restaurant.interface";

const restaurantSchema = new Schema<IRestaurant>(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    restaurantArea: {
      type: String,
      required: true,
      trim: true,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ["INR", "USD"],
    },
    mealName: {
      type: String,
      required: true,
      trim: true,
    },
    preferred: {
      type: Boolean,
      default: false,
    },
    veg: {
      type: Boolean,
      default: false,
    },
    nonVeg: {
      type: Boolean,
      default: false,
    },
    ai: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRestaurant>(
  "Restaurant",
  restaurantSchema
);