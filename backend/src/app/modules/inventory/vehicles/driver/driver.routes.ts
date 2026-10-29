import { Router } from "express";
import {
    createDriver,
    getDrivers,
    getDriverById,
    updateDriver,
    deleteDriver,
} from "./driver.controller";

const router = Router();
/**
 * @swagger
 * /v1/api/inventory/vehicle/driver:
 *   post:
 *     tags: ["My Inventory - Vehicles (Driver)"]
 *     summary: Create driver
 *     description: Add a new driver to vehicle inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverName
 *               - mobileNumber
 *               - languages
 *               - country
 *               - city
 *             properties:
 *               driverName:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               languages:
 *                 type: string
 *               address:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               drivingLicense:
 *                 type: string
 *               primaryVehicle:
 *                 type: string
 *               image:
 *                 type: string
 *               remark:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver created successfully
 */
router.post("/driver", createDriver);
/**
 * @swagger
 * /v1/api/inventory/vehicle/driver:
 *   get:
 *     tags: ["My Inventory - Vehicles (Driver)"]
 *     summary: Get all drivers
 *     description: Fetch all driver records
 *     parameters:
 *       - in: query
 *         name: driverName
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
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drivers fetched successfully
 */
router.get("/driver", getDrivers);
/**
 * @swagger
 * /v1/api/inventory/vehicle/driver/{id}:
 *   get:
 *     tags: ["My Inventory - Vehicles (Driver)"]
 *     summary: Get driver by ID
 *     description: Fetch driver details using ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver fetched successfully
 *       404:
 *         description: Driver not found
 */
router.get("/driver/:id", getDriverById);
/**
 * @swagger
 * /v1/api/inventory/vehicle/driver/{id}:
 *   put:
 *     tags: ["My Inventory - Vehicles (Driver)"]
 *     summary: Update driver
 *     description: Update driver details
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
 *         description: Driver updated successfully
 *       404:
 *         description: Driver not found
 */
router.put("/driver/:id", updateDriver);
/**
 * @swagger
 * /v1/api/inventory/vehicle/driver/{id}:
 *   delete:
 *     tags: ["My Inventory - Vehicles (Driver)"]
 *     summary: Delete driver
 *     description: Remove driver from inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *       404:
 *         description: Driver not found
 */
router.delete("/driver/:id", deleteDriver);

export const vehicleDriverRouter = router;