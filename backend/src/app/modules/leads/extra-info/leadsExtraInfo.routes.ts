import express from "express";

import {
    upsertLeadExtraInfo,
    getLeadExtraInfoByLeadId,
    updateLeadExtraInfo,
    deleteLeadExtraInfo,
} from "./leadsExtraInfo.controllers";

const router = express.Router();
/**
 * @swagger
 * /v1/api/leads-extra-info:
 *   post:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Leads Extra Info
 *     summary: Create or Update Lead Extra Info
 *     description: Creates or updates additional customer profile information such as date of birth and anniversary details for a lead. If extra information already exists for the lead, it will be updated automatically.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *
 *             properties:
 *               leadId:
 *                 type: string
 *                 example: 6856c2f8c45a4a5f3a2e1234
 *
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1998-05-15
 *
 *               anniversary:
 *                 type: string
 *                 format: date
 *                 example: 2022-12-10
 *
 *     responses:
 *       200:
 *         description: Lead extra info saved successfully
 *
 *       400:
 *         description: Invalid lead ID or validation failed
 *
 *       404:
 *         description: Lead not found
 *
 *       500:
 *         description: Internal server error
 */
router.post("/", upsertLeadExtraInfo);
/**
 * @swagger
 * /v1/api/leads-extra-info/lead/{leadId}:
 *   get:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Leads Extra Info
 *     summary: Get Lead Extra Info By Lead
 *     description: Retrieves additional customer profile information associated with a specific lead, including date of birth and anniversary details.
 *
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *
 *     responses:
 *       200:
 *         description: Lead extra info fetched successfully
 *
 *       400:
 *         description: Invalid lead ID
 *
 *       500:
 *         description: Internal server error
 */
router.get("/lead/:leadId", getLeadExtraInfoByLeadId);
/**
 * @swagger
 * /v1/api/leads-extra-info/{id}:
 *   patch:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Leads Extra Info
 *     summary: Update Lead Extra Info
 *     description: Updates existing additional customer profile information such as date of birth and anniversary details.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead Extra Info Record ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: 1998-05-15
 *
 *               anniversary:
 *                 type: string
 *                 format: date
 *                 example: 2022-12-10
 *
 *     responses:
 *       200:
 *         description: Lead extra info updated successfully
 *
 *       404:
 *         description: Extra info not found
 *
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", updateLeadExtraInfo);
/**
 * @swagger
 * /v1/api/leads-extra-info/{id}:
 *   delete:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Leads Extra Info
 *     summary: Delete Lead Extra Info
 *     description: Permanently removes additional customer profile information associated with a lead.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead Extra Info Record ID
 *
 *     responses:
 *       200:
 *         description: Lead extra info deleted successfully
 *
 *       404:
 *         description: Extra info not found
 *
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteLeadExtraInfo);

export const leadsExtraInfoRouter = router;