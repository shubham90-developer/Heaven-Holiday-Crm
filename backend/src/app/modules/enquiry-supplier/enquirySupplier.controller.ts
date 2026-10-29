import { Request, Response } from "express";
import mongoose from "mongoose";
import Supplier from "../my-supplier/supplier/supplier.model";
import { getMailConfig, isSmtpConfigured, sendMail } from "../../utils/mailer";
import { parseEmailList, personalizeSupplierEmail } from "../../utils/supplierEmail";

const getSupplierDisplayName = (supplier: {
    companyName?: string;
    salutation?: string;
    firstName?: string;
    lastName?: string;
}) => {
    const contact = [supplier.salutation, supplier.firstName, supplier.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();
    return supplier.companyName || contact || "Supplier";
};

export const getEnquirySupplierMailConfig = async (_req: Request, res: Response) => {
    try {
        res.status(200).json({
            success: true,
            data: getMailConfig(),
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to load mail config",
        });
    }
};

export const sendEnquiryToSuppliers = async (req: Request, res: Response) => {
    try {
        if (!isSmtpConfigured()) {
            res.status(400).json({
                success: false,
                message:
                    "SMTP is not configured. Add SMTP_HOST, SMTP_USER and SMTP_PASS in backend .env",
            });
            return;
        }

        const { subject, htmlBody, cc, senderEmail, supplierIds } = req.body as {
            subject?: string;
            htmlBody?: string;
            cc?: string;
            senderEmail?: string;
            supplierIds?: string[];
        };

        if (!subject?.trim()) {
            res.status(400).json({ success: false, message: "Email subject is required" });
            return;
        }

        if (!htmlBody?.trim()) {
            res.status(400).json({ success: false, message: "Email body is required" });
            return;
        }

        const ids = (supplierIds || []).filter((id) => mongoose.isValidObjectId(id));
        if (!ids.length) {
            res.status(400).json({
                success: false,
                message: "Select at least one supplier",
            });
            return;
        }

        const suppliers = await Supplier.find({
            _id: { $in: ids },
            isDeleted: { $ne: true },
        });

        if (!suppliers.length) {
            res.status(404).json({
                success: false,
                message: "No valid suppliers found",
            });
            return;
        }

        const ccList = parseEmailList(cc);
        const results: Array<{
            supplierId: string;
            email?: string;
            name: string;
            status: "sent" | "failed" | "skipped";
            error?: string;
        }> = [];

        for (const supplier of suppliers) {
            const name = getSupplierDisplayName(supplier);
            const email = (supplier.email || "").trim();

            if (!email) {
                results.push({
                    supplierId: String(supplier._id),
                    name,
                    status: "skipped",
                    error: "Supplier email is missing",
                });
                continue;
            }

            try {
                const personalized = personalizeSupplierEmail(htmlBody, name);
                await sendMail({
                    to: email,
                    cc: ccList.length ? ccList : undefined,
                    subject: subject.trim(),
                    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;line-height:1.5;max-width:720px;">${personalized}</div>`,
                    replyTo: senderEmail?.trim() || undefined,
                });

                results.push({
                    supplierId: String(supplier._id),
                    email,
                    name,
                    status: "sent",
                });
            } catch (error: any) {
                results.push({
                    supplierId: String(supplier._id),
                    email,
                    name,
                    status: "failed",
                    error: error.message || "Failed to send email",
                });
            }
        }

        const sentCount = results.filter((item) => item.status === "sent").length;

        res.status(sentCount ? 200 : 500).json({
            success: sentCount > 0,
            message:
                sentCount > 0
                    ? `Enquiry sent to ${sentCount} supplier${sentCount > 1 ? "s" : ""}`
                    : "Failed to send enquiry emails",
            data: results,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to send enquiry emails",
        });
    }
};
