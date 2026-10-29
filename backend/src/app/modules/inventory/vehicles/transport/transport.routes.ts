import { Router } from "express";
import {
    createTransport,
    getTransports,
    getTransportById,
    updateTransport,
    deleteTransport,
} from "./transport.controller";

const router = Router();
/**
 * @swagger
 * /v1/api/inventory/vehicle/transport:
 *   post:
 *     tags: ["My Inventory - Vehicles (Transport)"]
 *     summary: Create transport
 *     description: Add a new transport vehicle to inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carType
 *               - transportName
 *               - seatingCapacity
 *               - ac
 *               - vehicleNo
 *               - numberOfVehicles
 *             properties:
 *               carType:
 *                 type: string
 *                 enum: [Luxury, Standard]
 *               transportName:
 *                 type: string
 *               seatingCapacity:
 *                 type: number
 *               ac:
 *                 type: boolean
 *               vehicleNo:
 *                 type: string
 *               numberOfVehicles:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transport created successfully
 */
router.post("/transport", createTransport);
/**
 * @swagger
 * /v1/api/inventory/vehicle/transport:
 *   get:
 *     tags: ["My Inventory - Vehicles (Transport)"]
 *     summary: Get all transports
 *     description: Fetch all transport inventory records
 *     parameters:
 *       - in: query
 *         name: transportName
 *         schema:
 *           type: string
 *       - in: query
 *         name: carType
 *         schema:
 *           type: string
 *           enum: [Luxury, Standard]
 *     responses:
 *       200:
 *         description: Transports fetched successfully
 */
router.get("/transport", getTransports);
/**
 * @swagger
 * /v1/api/inventory/vehicle/transport/{id}:
 *   get:
 *     tags: ["My Inventory - Vehicles (Transport)"]
 *     summary: Get transport by ID
 *     description: Fetch a specific transport vehicle
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transport fetched successfully
 *       404:
 *         description: Transport not found
 */
router.get("/transport/:id", getTransportById);
/**
 * @swagger
 * /v1/api/inventory/vehicle/transport/{id}:
 *   put:
 *     tags: ["My Inventory - Vehicles (Transport)"]
 *     summary: Update transport
 *     description: Update transport inventory details
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
 *         description: Transport updated successfully
 *       404:
 *         description: Transport not found
 */
router.put("/transport/:id", updateTransport);
/**
 * @swagger
 * /v1/api/inventory/vehicle/transport/{id}:
 *   delete:
 *     tags: ["My Inventory - Vehicles (Transport)"]
 *     summary: Delete transport
 *     description: Remove transport from inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transport deleted successfully
 *       404:
 *         description: Transport not found
 */
router.delete("/transport/:id", deleteTransport);

export const vehicleTransportRouter = router;