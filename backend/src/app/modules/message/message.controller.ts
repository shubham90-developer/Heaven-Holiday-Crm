import { Request, Response } from "express";
import mongoose from "mongoose";
import { Message } from "./message.model";
import B2CLead from "../b2c-lead/b2cLead.model";
import B2BLead from "../b2b-lead/b2bLead.model";

// CREATE MESSAGE (Send Message)
export const createMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            leadId,
            leadModel,
            channel,
            templateType,
            subject,
            content,
        } = req.body;

        // Basic validation (FIXED)
        if (!leadId || !leadModel || !channel || !content) {
            res.status(400).json({
                success: false,
                message: "Required fields missing",
            });
            return;
        }

        // Email-specific validation
        if (channel === "email" && !subject) {
            res.status(400).json({
                success: false,
                message: "Subject is required for email",
            });
            return;
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(leadId)) {
            res.status(400).json({
                success: false,
                message: "Invalid leadId",
            });
            return;
        }

        // Validate leadModel & check existence
        let leadExists = null;

        if (leadModel === "B2CLead") {
            leadExists = await B2CLead.findById(leadId);
        } else if (leadModel === "B2BLead") {
            leadExists = await B2BLead.findById(leadId);
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid leadModel",
            });
            return;
        }

        if (!leadExists) {
            res.status(404).json({
                success: false,
                message: "Lead not found",
            });
            return;
        }

        // Create message (FIXED)
        const newMessage = await Message.create({
            leadId,
            leadModel,
            channel,
            templateType,
            subject: subject || undefined, // avoid empty string issue
            content,
            status: "pending",
        });

        // Simulated sending logic
        try {
            // await sendWhatsApp() / sendSMS() / sendEmail()

            newMessage.status = "sent";
            newMessage.sentAt = new Date();
        } catch (sendError: any) {
            newMessage.status = "failed";
            newMessage.error = sendError.message;
        } finally {
            await newMessage.save();
        }

        res.status(201).json({
            success: true,
            message: "Message processed successfully",
            data: newMessage,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getMessagesByLead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { leadId } = req.params;

        const messages = await Message.find({ leadId })
            .populate("leadId") // dynamic populate
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};