import express from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "./restaurant.controller";

const router = express.Router();
/**
 * @swagger
 * /v1/api/inventory/restaurant:
 *   post:
 *     tags: ["My Inventory - Restaurants"]
 *     summary: Create restaurant
 *     description: Add a new restaurant to inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - address
 *               - restaurantArea
 *               - supplierName
 *               - currency
 *               - mealName
 *             properties:
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               restaurantArea:
 *                 type: string
 *               supplierName:
 *                 type: string
 *               currency:
 *                 type: string
 *                 enum: [INR, USD]
 *               mealName:
 *                 type: string
 *               preferred:
 *                 type: boolean
 *               veg:
 *                 type: boolean
 *               nonVeg:
 *                 type: boolean
 *               ai:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 */
router.post("/", createRestaurant);
/**
 * @swagger
 * /v1/api/inventory/restaurant:
 *   get:
 *     tags: ["My Inventory - Restaurants"]
 *     summary: Get all restaurants
 *     description: Fetch all restaurant inventory records
 *     responses:
 *       200:
 *         description: Restaurants fetched successfully
 */
router.get("/", getRestaurants);
/**
 * @swagger
 * /v1/api/inventory/restaurant/{id}:
 *   get:
 *     tags: ["My Inventory - Restaurants"]
 *     summary: Get restaurant by ID
 *     description: Fetch a restaurant using restaurant ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant fetched successfully
 *       404:
 *         description: Restaurant not found
 */
router.get("/:id", getRestaurantById);
/**
 * @swagger
 * /v1/api/inventory/restaurant/{id}:
 *   put:
 *     tags: ["My Inventory - Restaurants"]
 *     summary: Update restaurant
 *     description: Update restaurant details
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
 *         description: Restaurant updated successfully
 *       404:
 *         description: Restaurant not found
 */
router.put("/:id", updateRestaurant);
/**
 * @swagger
 * /v1/api/inventory/restaurant/{id}:
 *   delete:
 *     tags: ["My Inventory - Restaurants"]
 *     summary: Delete restaurant
 *     description: Remove restaurant from inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       404:
 *         description: Restaurant not found
 */
router.delete("/:id", deleteRestaurant);

export const restaurantRouter = router;