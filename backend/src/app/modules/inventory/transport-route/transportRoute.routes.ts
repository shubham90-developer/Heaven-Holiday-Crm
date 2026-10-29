import express from "express";
import {
  createTransportRoute,
  getTransportRoutes,
  getTransportRouteById,
  updateTransportRoute,
  deleteTransportRoute,
} from "./transportRoute.controller";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: My Inventory - Transport Route
 *   description: Manage transport routes, transfer configurations, seasonal pricing, and route logistics
 */

/**
 * @swagger
 * /v1/api/inventory/transport-route:
 *   post:
 *     summary: Create transport route
 *     tags: [My Inventory - Transport Route]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: Point to Point Transfers
 *               transferTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *               transportType:
 *                 type: string
 *                 example: Cab
 *               startCity:
 *                 type: string
 *               destinationCity:
 *                 type: string
 *               routeName:
 *                 type: string
 *               citiesIncluded:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     city:
 *                       type: string
 *                     noOfDays:
 *                       type: number
 *                     destinationsCovered:
 *                       type: string
 *                     sightseeingCovered:
 *                       type: string
 *               description:
 *                 type: string
 *               pickupPointArea:
 *                 type: string
 *               dropPointArea:
 *                 type: string
 *               region:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               vehicleCostType:
 *                 type: string
 *               currency:
 *                 type: string
 *                 example: INR
 *               seasons:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                     to:
 *                       type: string
 *                     markUpType:
 *                       type: string
 *                     b2c:
 *                       type: number
 *                     b2b:
 *                       type: number
 *               website:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Transport route created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createTransportRoute);
/**
 * @swagger
 * /v1/api/inventory/transport-route:
 *   get:
 *     summary: Get all transport routes
 *     tags: [My Inventory - Transport Route]
 *     responses:
 *       200:
 *         description: Transport routes retrieved successfully
 */
router.get("/", getTransportRoutes);
/**
 * @swagger
 * /v1/api/inventory/transport-route/{id}:
 *   get:
 *     summary: Get transport route by ID
 *     tags: [My Inventory - Transport Route]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transport route retrieved successfully
 *       404:
 *         description: Route not found
 */
router.get("/:id", getTransportRouteById);
/**
 * @swagger
 * /v1/api/inventory/transport-route/{id}:
 *   put:
 *     summary: Update transport route
 *     tags: [My Inventory - Transport Route]
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
router.put("/:id", updateTransportRoute);
/**
 * @swagger
 * /v1/api/inventory/transport-route/{id}:
 *   delete:
 *     summary: Delete transport route
 *     tags: [My Inventory - Transport Route]
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
router.delete("/:id", deleteTransportRoute);

export const transportRouter = router;