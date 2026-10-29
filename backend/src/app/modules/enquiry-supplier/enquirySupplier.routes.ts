import express from "express";
import {
    getEnquirySupplierMailConfig,
    sendEnquiryToSuppliers,
} from "./enquirySupplier.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/enquiry-supplier/config:
 *   get:
 *     tags:
 *       - CRM / Sales - Enquiry Supplier Package
 *     summary: Get SMTP mail config (no secrets)
 *     responses:
 *       200:
 *         description: Mail config fetched
 */
router.get("/config", getEnquirySupplierMailConfig);

/**
 * @swagger
 * /v1/api/enquiry-supplier/send:
 *   post:
 *     tags:
 *       - CRM / Sales - Enquiry Supplier Package
 *     summary: Send package enquiry email to selected suppliers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - htmlBody
 *               - supplierIds
 *             properties:
 *               queryId:
 *                 type: string
 *               subject:
 *                 type: string
 *               htmlBody:
 *                 type: string
 *               cc:
 *                 type: string
 *               senderEmail:
 *                 type: string
 *               supplierIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Enquiry emails sent
 *       400:
 *         description: Validation or SMTP configuration error
 */
router.post("/send", sendEnquiryToSuppliers);

export const enquirySupplierRouter = router;
