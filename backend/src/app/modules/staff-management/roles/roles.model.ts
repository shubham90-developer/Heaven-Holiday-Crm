import mongoose, { Schema } from "mongoose";
import { IRole } from "./roles.interface";

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    roleType: {
      type: String,
      enum: ["ADMIN", "SALES", "MANAGER", "BACK_OFFICE"],
      required: true,
    },

    description: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RoleModel = mongoose.model<IRole>("Role", roleSchema);