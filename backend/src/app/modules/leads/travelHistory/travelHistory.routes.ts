// ======================================================
// FILE: routes/travelHistory.routes.ts
// ======================================================

import express from "express";

import {
    createTravelHistory,
    getTravelHistoryByLead,
    deleteTravelHistory,
    getAllTravelHistory,
} from "./travelHistory.controllers";

const router = express.Router();
/**
 * @swagger
 * /v1/api/travel-history:
 *   post:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Travel History (Have Been To)
 *     summary: Create Travel History
 *     description: Creates a travel history record for a lead by storing previously visited countries, cities, travel rating, and last visited date. This information helps sales teams understand customer travel experience, travel preferences, and qualification details for future travel planning.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leadId
 *               - country
 *               - city
 *               - lastVisited
 *
 *             properties:
 *               leadId:
 *                 type: string
 *                 example: 6856c2f8c45a4a5f3a2e1234
 *
 *               country:
 *                 type: string
 *                 example: Thailand
 *
 *               city:
 *                 type: string
 *                 example: Bangkok
 *
 *               type:
 *                 type: string
 *                 enum:
 *                   - ⭐
 *                   - ⭐⭐
 *                   - ⭐⭐⭐
 *                   - ⭐⭐⭐⭐
 *                   - ⭐⭐⭐⭐⭐
 *                 example: ⭐⭐⭐⭐
 *
 *               lastVisited:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-15
 *
 *     responses:
 *       201:
 *         description: Travel history added successfully
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
router.post("/", createTravelHistory);
/**
 * @swagger
 * /v1/api/travel-history:
 *   get:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Travel History (Have Been To)
 *     summary: Get All Travel History Records
 *     description: Retrieves all travel history records stored across customer profiles. Results are sorted by most recently visited destinations first.
 *
 *     responses:
 *       200:
 *         description: Travel history records fetched successfully
 *
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllTravelHistory);
/**
 * @swagger
 * /v1/api/travel-history/{leadId}:
 *   get:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Travel History (Have Been To)
 *     summary: Get Travel History By Lead
 *     description: Retrieves all travel history records associated with a specific lead, including previously visited destinations, travel ratings, and visit dates.
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
 *         description: Travel history records fetched successfully
 *
 *       404:
 *         description: Travel history records not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/:leadId", getTravelHistoryByLead);
/**
 * @swagger
 * /v1/api/travel-history/{id}:
 *   delete:
 *     tags:
 *       - CRM / Sales - Leads - Customer Profile - Travel History (Have Been To)
 *     summary: Delete Travel History
 *     description: Permanently removes a travel history record from a customer profile when the information is no longer required or was entered incorrectly.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Travel History Record ID
 *
 *     responses:
 *       200:
 *         description: Travel history deleted successfully
 *
 *       404:
 *         description: Travel history record not found
 *
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteTravelHistory);

export const travelHistoryRouter = router;