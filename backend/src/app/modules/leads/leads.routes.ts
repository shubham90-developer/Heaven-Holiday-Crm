import { Router } from "express";
import express from "express";
import {
    filterLeads, getLeadsByTab,
    getArchivedLeads, assignLeads,
    getLeadById, archiveLeads,
    getUnassignedLeads
} from "./leads.controller";

const router: Router = express.Router();
/**
 * @swagger
 * /v1/api/leads/filter:
 *   get:
 *     tags:
 *       - CRM / Sales - Leads
 *     summary: Filter Leads (B2C + B2B)
 *     description: Retrieves combined B2C and B2B leads with optional filtering by lead stage, lead type, and computed follow-up status.
 *
 *     parameters:
 *       - in: query
 *         name: leadStage
 *         schema:
 *           type: string
 *         example: Call Back
 *
 *       - in: query
 *         name: leadType
 *         schema:
 *           type: string
 *           enum: [B2C, B2B]
 *         example: B2C
 *
 *     responses:
 *       200:
 *         description: Leads fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/filter", filterLeads);
/**
 * @swagger
 * /v1/api/leads/tab:
 *   get:
 *     tags:
 *       - CRM / Sales - Leads
 *     summary: Get Leads By Tab View
 *     description: Returns combined B2C and B2B leads grouped into UI tabs such as callback and in-process based on computed follow-up stage.
 *
 *     parameters:
 *       - in: query
 *         name: tab
 *         schema:
 *           type: string
 *           enum: [callback, inprocess]
 *         example: callback
 *
 *     responses:
 *       200:
 *         description: Tab-based leads fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/tab", getLeadsByTab);
/**
 * @swagger
 * /v1/api/leads/archived:
 *   get:
 *     tags:
 *       - CRM / Sales - Archived Leads
 *     summary: Get Archived Leads
 *     description: Retrieves all archived leads from both B2C and B2B modules. Archived leads are those not in active workflow stages such as New, Call Back, Answered, or In Process.
 *
 *     responses:
 *       200:
 *         description: Archived leads fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/archived", getArchivedLeads);
router.get("/unassigned", getUnassignedLeads);
router.patch("/assign", assignLeads);
router.patch("/archive-leads", archiveLeads);
router.get("/:id", getLeadById);

export const leadsRouter = router;