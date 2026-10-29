import express from "express";
import {
    createLeadRemark,
    getRemarksByLeadId,
    getRemarkById,
    updateLeadRemark,
    deleteLeadRemark,
} from "./remark.controllers";

const router = express.Router();
/**
 * @swagger
 * /v1/api/remark:
 *   post:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Remark
 *     summary: Create Remark
 *     description: Creates a new remark for a lead to record customer interactions, follow-ups, meetings, callbacks, sales discussions, and other CRM-related activities.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *               - remarkType
 *               - remark
 *
 *             properties:
 *               leadId:
 *                 type: string
 *                 example: 6856c2f8c45a4a5f3a2e1234
 *
 *               remarkType:
 *                 type: string
 *                 enum:
 *                   - Customer
 *                   - Follow Up
 *                   - Interested
 *                   - Not Interested
 *                   - Callback
 *                   - Meeting
 *                   - Closed
 *                 example: Follow Up
 *
 *               remark:
 *                 type: string
 *                 example: Customer requested a callback next week regarding holiday packages.
 *
 *     responses:
 *       201:
 *         description: Remark added successfully
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
router.post("/", createLeadRemark);
/**
 * @swagger
 * /v1/api/remark/lead/{leadId}:
 *   get:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Remark
 *     summary: Get Remarks By Lead
 *     description: Retrieves all remarks associated with a specific lead. Results are returned in descending order of creation date with pagination support.
 *
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 20
 *
 *     responses:
 *       200:
 *         description: Remarks fetched successfully
 *
 *       400:
 *         description: Invalid lead ID
 *
 *       500:
 *         description: Internal server error
 */
router.get("/lead/:leadId", getRemarksByLeadId);
/**
 * @swagger
 * /v1/api/remark/{id}:
 *   get:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Remark
 *     summary: Get Remark By ID
 *     description: Retrieves detailed information for a specific remark associated with a lead.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Remark ID
 *
 *     responses:
 *       200:
 *         description: Remark fetched successfully
 *
 *       400:
 *         description: Invalid remark ID
 *
 *       404:
 *         description: Remark not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getRemarkById);
/**
 * @swagger
 * /v1/api/remark/{id}:
 *   patch:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Remark
 *     summary: Update Remark
 *     description: Updates an existing remark, including its remark type and content, to reflect the latest customer interaction details.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Remark ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               remarkType:
 *                 type: string
 *                 enum:
 *                   - Customer
 *                   - Follow Up
 *                   - Interested
 *                   - Not Interested
 *                   - Callback
 *                   - Meeting
 *                   - Closed
 *
 *               remark:
 *                 type: string
 *                 example: Customer confirmed meeting for Friday.
 *
 *     responses:
 *       200:
 *         description: Remark updated successfully
 *
 *       400:
 *         description: Invalid remark ID or validation failed
 *
 *       404:
 *         description: Remark not found
 *
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", updateLeadRemark);
/**
 * @swagger
 * /v1/api/remark/{id}:
 *   delete:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Remark
 *     summary: Delete Remark
 *     description: Permanently removes a remark from a lead's communication history when it is no longer required or was entered incorrectly.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Remark ID
 *
 *     responses:
 *       200:
 *         description: Remark deleted successfully
 *
 *       400:
 *         description: Invalid remark ID
 *
 *       404:
 *         description: Remark not found
 *
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteLeadRemark);

export const leadRemarksRouter = router;