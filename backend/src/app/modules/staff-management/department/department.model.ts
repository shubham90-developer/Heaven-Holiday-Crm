import mongoose, { Schema } from "mongoose";
import { IDepartment } from "./department.interface";

const departmentSchema = new Schema<IDepartment>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        isOperations: {
            type: Boolean,
            default: false,
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

export const DepartmentModel = mongoose.model<IDepartment>(
    "Department",
    departmentSchema
);