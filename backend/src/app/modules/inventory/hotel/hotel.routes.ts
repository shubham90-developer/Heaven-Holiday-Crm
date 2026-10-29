import express from "express";
import {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
} from "./hotel.controller";

const router = express.Router();
/**
 * @swagger
 * /v1/api/inventory/hotel:
 *   post:
 *     tags: ["My Inventory - Hotels"]
 *     summary: Create a new hotel
 *     description: Hotel inventory management APIs
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hotelName
 *               - cityName
 *               - contactNo
 *               - propertyType
 *               - checkInTime
 *               - checkOutTime
 *               - weekend
 *             properties:
 *               hotelName:
 *                 type: string
 *               cityName:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               countryCode:
 *                 type: string
 *                 example: "+91"
 *               contactNo:
 *                 type: string
 *               starRating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               propertyType:
 *                 type: string
 *               checkInTime:
 *                 type: string
 *                 example: "12:00 PM"
 *               checkOutTime:
 *                 type: string
 *                 example: "11:00 AM"
 *               weekend:
 *                 type: object
 *                 properties:
 *                   saturday:
 *                     type: boolean
 *                   sunday:
 *                     type: boolean
 *               roomType:
 *                 type: string
 *               childAge:
 *                 type: number
 *     responses:
 *       201:
 *         description: Hotel created successfully
 */
router.post("/", createHotel);
/**
 * @swagger
 * /v1/api/inventory/hotel:
 *   get:
 *     tags: ["My Inventory - Hotels"]
 *     summary: Get all hotels
 *     description: Fetch all hotel inventory records
 *     responses:
 *       200:
 *         description: Hotels fetched successfully
 */
router.get("/", getAllHotels);
/**
 * @swagger
 * /v1/api/inventory/hotel/{id}:
 *   get:
 *     tags: ["My Inventory - Hotels"]
 *     summary: Get hotel by ID
 *     description: Fetch a single hotel using hotel ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel fetched successfully
 *       404:
 *         description: Hotel not found
 */
router.get("/:id", getHotelById);
/**
 * @swagger
 * /v1/api/inventory/hotel/{id}:
 *   patch:
 *     tags: ["My Inventory - Hotels"]
 *     summary: Update hotel
 *     description: Update hotel inventory details
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
 *         description: Hotel updated successfully
 *       404:
 *         description: Hotel not found
 */
router.patch("/:id", updateHotel);
/**
 * @swagger
 * /v1/api/inventory/hotel/{id}:
 *   delete:
 *     tags: ["My Inventory - Hotels"]
 *     summary: Delete hotel
 *     description: Delete hotel inventory record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       404:
 *         description: Hotel not found
 */
router.delete("/:id", deleteHotel);

export const hotelRouter = router;