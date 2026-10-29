// ======================================================
// FILE: routes/destination.routes.ts
// ======================================================

import express from "express";

import {
    createDestination,
    getDestinationsByLead,
    getAllDestinations,
    deleteDestination,
} from "./destination.controllers";

const router = express.Router();
/**
 * @swagger
 * /v1/api/destination:
 *   post:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Destination (Want To Go)
 *     summary: Create Destination
 *     description: Creates a destination preference for a lead by storing the country and city the customer wishes to visit. This information is maintained within the customer profile for travel planning and lead qualification purposes.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *               - leadModel
 *               - country
 *               - city
 *
 *             properties:
 *               leadId:
 *                 type: string
 *                 example: 6856c2f8c45a4a5f3a2e1234
 *
 *               leadModel:
 *                 type: string
 *                 enum:
 *                   - B2CLead
 *                   - B2BLead
 *                 example: B2CLead
 *
 *               country:
 *                 type: string
 *                 example: Thailand
 *
 *               city:
 *                 type: string
 *                 example: Bangkok
 *
 *     responses:
 *       200:
 *         description: Destination created successfully
 *
 *       400:
 *         description: Validation failed
 *
 *       500:
 *         description: Internal server error
 */
router.post("/", createDestination);
/**
 * @swagger
 * /v1/api/destination:
 *   get:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Destination (Want To Go)
 *     summary: Get All Destinations
 *     description: Retrieves all destination records stored across customer profiles for reporting, management, and operational purposes.
 *
 *     responses:
 *       200:
 *         description: Destinations fetched successfully
 *
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllDestinations);
/**
 * @swagger
 * /v1/api/destination/{leadId}:
 *   get:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Destination (Want To Go)
 *     summary: Get Destinations By Lead
 *     description: Retrieves all destination preferences associated with a specific lead. Multiple destination records may exist for a single customer profile.
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
 *         description: Destinations fetched successfully
 *
 *       404:
 *         description: Lead destinations not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/:leadId", getDestinationsByLead);
/**
 * @swagger
 * /v1/api/destination/{id}:
 *   delete:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Destination (Want To Go)
 *     summary: Delete Destination
 *     description: Permanently removes a destination record from a customer profile when the destination is no longer relevant or was added incorrectly.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination ID
 *
 *     responses:
 *       200:
 *         description: Destination deleted successfully
 *
 *       404:
 *         description: Destination not found
 *
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteDestination);

export const destinationRouter = router;