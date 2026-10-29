import { Schema, model } from "mongoose";
import { IArea } from "./areaMaster.interface";

const areaSchema = new Schema<IArea>(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export const AreaModel = model<IArea>("Area", areaSchema);