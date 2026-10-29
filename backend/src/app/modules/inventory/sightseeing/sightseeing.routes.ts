import express from "express";
import {
  createSightseeing,
  getSightseeing,
  getSightseeingById,
  updateSightseeing,
  deleteSightseeing,
} from "./sightseeing.controller";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: My Inventory - Sightseeing
 *   description: Manages sightseeing attractions, timings, activities, visitor rules, and operational metadata
 */

/**
 * @swagger
 * /v1/api/inventory/sightseeing:
 *   post:
 *     summary: Create sightseeing entry
 *     tags: [My Inventory - Sightseeing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 example: India
 *               city:
 *                 type: string
 *                 example: Goa
 *               sightseeingName:
 *                 type: string
 *                 example: Dudhsagar Falls
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               image:
 *                 type: string
 *               address:
 *                 type: string
 *               isUnique:
 *                 type: boolean
 *               details:
 *                 type: string
 *               category:
 *                 type: string
 *                 example: Nature
 *               activities:
 *                 type: string
 *               difficultyLevel:
 *                 type: string
 *                 example: Moderate
 *               season:
 *                 type: string
 *               daysOfWeek:
 *                 type: string
 *               popularity:
 *                 type: string
 *               thingsToCarry:
 *                 type: string
 *               pickupPoint:
 *                 type: string
 *               pickupTime:
 *                 type: string
 *               minPax:
 *                 type: number
 *               maxPax:
 *                 type: number
 *               durationDays:
 *                 type: number
 *               durationMinutes:
 *                 type: number
 *               minAge:
 *                 type: number
 *               maxAge:
 *                 type: number
 *               operatingTime:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                     to:
 *                       type: string
 *               otherInclusions:
 *                 type: string
 *               advisory:
 *                 type: string
 *               cancellationPolicy:
 *                 type: string
 *               refundPolicy:
 *                 type: string
 *               confirmationPolicy:
 *                 type: string
 *               termsConditions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sightseeing created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createSightseeing);
/**
 * @swagger
 * /v1/api/inventory/sightseeing:
 *   get:
 *     summary: Get all sightseeing entries
 *     tags: [My Inventory - Sightseeing]
 *     parameters:
 *       - in: query
 *         name: sightseeingName
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sightseeing list retrieved successfully
 */
router.get("/", getSightseeing);
/**
 * @swagger
 * /v1/api/inventory/sightseeing/{id}:
 *   get:
 *     summary: Get sightseeing by ID
 *     tags: [My Inventory - Sightseeing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sightseeing retrieved successfully
 *       404:
 *         description: Sightseeing not found
 */
router.get("/:id", getSightseeingById);
/**
 * @swagger
 * /v1/api/inventory/sightseeing/{id}:
 *   put:
 *     summary: Update sightseeing entry
 *     tags: [My Inventory - Sightseeing]
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
 *         description: Updated successfully
 */
router.put("/:id", updateSightseeing);
/**
 * @swagger
 * /v1/api/inventory/sightseeing/{id}:
 *   delete:
 *     summary: Delete sightseeing entry
 *     tags: [My Inventory - Sightseeing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete("/:id", deleteSightseeing);

export const sightseeingRouter = router;