import express from "express";
import {
    createArea,
    getAllAreas,
    getAreaById,
    updateArea,
    deleteArea,
} from "./areaMaster.controller";

const router = express.Router();
/**
 * @swagger
 * /v1/api/inventory/area-master:
 *   post:
 *     tags: ["My Inventory - Area Master"]
 *     summary: Create area
 *     description: Add a new area to area master inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - area
 *             properties:
 *               city:
 *                 type: string
 *               area:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Area created successfully
 */
router.post("/", createArea);
/**
 * @swagger
 * /v1/api/inventory/area-master:
 *   get:
 *     tags: ["My Inventory - Area Master"]
 *     summary: Get all areas
 *     description: Fetch all area master records
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Areas fetched successfully
 */
router.get("/", getAllAreas);
/**
 * @swagger
 * /v1/api/inventory/area-master/{id}:
 *   get:
 *     tags: ["My Inventory - Area Master"]
 *     summary: Get area by ID
 *     description: Fetch a specific area master record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Area fetched successfully
 *       404:
 *         description: Area not found
 */
router.get("/:id", getAreaById);
/**
 * @swagger
 * /v1/api/inventory/area-master/{id}:
 *   put:
 *     tags: ["My Inventory - Area Master"]
 *     summary: Update area
 *     description: Update area master details
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
 *         description: Area updated successfully
 *       404:
 *         description: Area not found
 */
router.put("/:id", updateArea);
/**
 * @swagger
 * /v1/api/inventory/area-master/{id}:
 *   delete:
 *     tags: ["My Inventory - Area Master"]
 *     summary: Delete area
 *     description: Remove area from master inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Area deleted successfully
 *       404:
 *         description: Area not found
 */
router.delete("/:id", deleteArea);

export const areaMasterRouter = router;