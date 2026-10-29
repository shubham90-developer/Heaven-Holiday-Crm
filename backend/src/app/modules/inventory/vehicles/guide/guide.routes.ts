import { Router } from "express";
import {
  createGuide,
  getAllGuides,
  getGuideById,
  updateGuide,
  deleteGuide,
} from "./guide.controller";

const router = Router();
/**
 * @swagger
 * /v1/api/inventory/vehicle/guide:
 *   post:
 *     tags: ["My Inventory - Vehicles (Guide)"]
 *     summary: Create guide
 *     description: Add a new guide to inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guideName
 *               - destination
 *               - mobileNumber
 *               - languages
 *               - rates
 *             properties:
 *               guideName:
 *                 type: string
 *               destination:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               languages:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               rates:
 *                 type: object
 *                 properties:
 *                   currency:
 *                     type: string
 *                   perDayRate:
 *                     type: number
 *                   overnightCharges:
 *                     type: number
 *                   markupType:
 *                     type: string
 *                     enum: [Percentage, Flat]
 *                   markup:
 *                     type: number
 *                   taxes:
 *                     type: number
 *                   total:
 *                     type: number
 *     responses:
 *       201:
 *         description: Guide created successfully
 */
router.post("/guide", createGuide);
/**
 * @swagger
 * /v1/api/inventory/vehicle/guide:
 *   get:
 *     tags: ["My Inventory - Vehicles (Guide)"]
 *     summary: Get all guides
 *     description: Fetch all guide inventory records
 *     parameters:
 *       - in: query
 *         name: guideName
 *         schema:
 *           type: string
 *       - in: query
 *         name: mobileNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guides fetched successfully
 */
router.get("/guide", getAllGuides);
/**
 * @swagger
 * /v1/api/inventory/vehicle/guide/{id}:
 *   get:
 *     tags: ["My Inventory - Vehicles (Guide)"]
 *     summary: Get guide by ID
 *     description: Fetch a guide using guide ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide fetched successfully
 *       404:
 *         description: Guide not found
 */
router.get("/guide/:id", getGuideById);
/**
 * @swagger
 * /v1/api/inventory/vehicle/guide/{id}:
 *   put:
 *     tags: ["My Inventory - Vehicles (Guide)"]
 *     summary: Update guide
 *     description: Update guide details and pricing
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
 *         description: Guide updated successfully
 *       404:
 *         description: Guide not found
 */
router.put("/guide/:id", updateGuide);
/**
 * @swagger
 * /v1/api/inventory/vehicle/guide/{id}:
 *   delete:
 *     tags: ["My Inventory - Vehicles (Guide)"]
 *     summary: Delete guide
 *     description: Remove guide from inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide deleted successfully
 *       404:
 *         description: Guide not found
 */
router.delete("/guide/:id", deleteGuide);

export const guideRoute = router;