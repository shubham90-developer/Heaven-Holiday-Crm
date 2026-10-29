import mongoose from "mongoose";
import { TouchPointModel } from "./touchPoint.model";
import { TouchPointType } from "./touchPoint.interface";

type LogTouchPointInput = {
    queryId?: string | mongoose.Types.ObjectId | null;
    leadId?: string | mongoose.Types.ObjectId | null;
    leadModel?: "B2CLead" | "B2BLead" | null;
    type: TouchPointType;
    title: string;
    description?: string;
    createdBy?: string;
    meta?: Record<string, unknown>;
};

export const logTouchPoint = async (input: LogTouchPointInput) => {
    try {
        const payload: Record<string, unknown> = {
            type: input.type,
            title: input.title,
            description: input.description || "",
            createdBy: input.createdBy || "",
            meta: input.meta || {},
        };

        if (input.queryId && mongoose.isValidObjectId(String(input.queryId))) {
            payload.queryId = new mongoose.Types.ObjectId(String(input.queryId));
        }
        if (input.leadId && mongoose.isValidObjectId(String(input.leadId))) {
            payload.leadId = new mongoose.Types.ObjectId(String(input.leadId));
        }
        if (input.leadModel) {
            payload.leadModel = input.leadModel;
        }

        if (!payload.queryId && !payload.leadId) {
            return null;
        }

        return await TouchPointModel.create(payload);
    } catch (error) {
        console.error("Failed to log touch point:", error);
        return null;
    }
};
