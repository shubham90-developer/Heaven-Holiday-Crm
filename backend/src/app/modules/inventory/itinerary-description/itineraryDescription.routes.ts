import express from "express";

import {
    createItinerary,
    getItineraries,
    getItineraryById,
    updateItinerary,
    deleteItinerary,
} from "./itineraryDescription.controller";

const router = express.Router();
/**
 * @swagger
 * /v1/api/inventory/itinerary:
 *   post:
 *     tags: ["My Inventory - Itinerary Description"]
 *     summary: Create itinerary description
 *     description: Add a new itinerary description to inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startCity
 *               - destinationCity
 *               - title
 *             properties:
 *               startCity:
 *                 type: string
 *               destinationCity:
 *                 type: string
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Itinerary created successfully
 */
router.post("/", createItinerary);
/**
 * @swagger
 * /v1/api/inventory/itinerary:
 *   get:
 *     tags: ["My Inventory - Itinerary Description"]
 *     summary: Get all itinerary descriptions
 *     description: Fetch all itinerary descriptions
 *     parameters:
 *       - in: query
 *         name: startCity
 *         schema:
 *           type: string
 *       - in: query
 *         name: destinationCity
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Itineraries fetched successfully
 */
router.get("/", getItineraries);
/**
 * @swagger
 * /v1/api/inventory/itinerary/{id}:
 *   get:
 *     tags: ["My Inventory - Itinerary Description"]
 *     summary: Get itinerary description by ID
 *     description: Fetch a specific itinerary description
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Itinerary fetched successfully
 *       404:
 *         description: Itinerary not found
 */
router.get("/:id", getItineraryById);
/**
 * @swagger
 * /v1/api/inventory/itinerary/{id}:
 *   put:
 *     tags: ["My Inventory - Itinerary Description"]
 *     summary: Update itinerary description
 *     description: Update itinerary details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Itinerary updated successfully
 *       404:
 *         description: Itinerary not found
 */
router.put("/:id", updateItinerary);
/**
 * @swagger
 * /v1/api/inventory/itinerary/{id}:
 *   delete:
 *     tags: ["My Inventory - Itinerary Description"]
 *     summary: Delete itinerary description
 *     description: Remove itinerary description from inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Itinerary deleted successfully
 *       404:
 *         description: Itinerary not found
 */
router.delete("/:id", deleteItinerary);

export const itineraryDescriptionRouter = router;