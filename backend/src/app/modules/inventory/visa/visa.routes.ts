import { Router } from "express";
import {
    createVisa,
    getAllVisa,
    getVisaById,
    updateVisa,
    deleteVisa,
} from "./visa.controller";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: My Inventory - Visa
 *   description: Manage visa configurations, fees, suppliers, service providers, and processing rules
 */

/**
 * @swagger
 * /v1/api/inventory/visa:
 *   post:
 *     summary: Create visa record
 *     tags: [My Inventory - Visa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - travelerNationality
 *               - countriesCovered
 *               - visaName
 *             properties:
 *               travelerNationality:
 *                 type: string
 *                 example: Indian
 *               countriesCovered:
 *                 type: string
 *                 example: Dubai
 *               visaName:
 *                 type: string
 *                 example: Dubai Tourist Visa
 *               visaType:
 *                 type: string
 *                 enum: [e Visa, Sticker Visa]
 *               visaCategory:
 *                 type: string
 *                 enum: [Tourism, Business]
 *               entryType:
 *                 type: string
 *                 enum: [Single Entry, Multiple Entry]
 *               processingTime:
 *                 type: string
 *                 example: 3-5 Working Days
 *               passportExpireDays:
 *                 type: number
 *               validityDays:
 *                 type: number
 *               duration:
 *                 type: string
 *               supplier:
 *                 type: string
 *               embassyFeeCurrency:
 *                 type: string
 *                 example: AED
 *               adultFee:
 *                 type: number
 *               childFee:
 *                 type: number
 *               childAge:
 *                 type: number
 *               infantFee:
 *                 type: number
 *               markup:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     marketPlace:
 *                       type: string
 *                       enum: [B2C, B2B]
 *                     currency:
 *                       type: string
 *                     markUpType:
 *                       type: string
 *                       enum: [Amount, Percentage]
 *                     adult:
 *                       type: number
 *                     child:
 *                       type: number
 *                     infant:
 *                       type: number
 *               serviceProviders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     display:
 *                       type: boolean
 *                     serviceName:
 *                       type: string
 *                     currency:
 *                       type: string
 *                     fees:
 *                       type: number
 *                     markup:
 *                       type: number
 *                     taxable:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Visa created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createVisa);
/**
 * @swagger
 * /v1/api/inventory/visa:
 *   get:
 *     summary: Get all visa records
 *     tags: [My Inventory - Visa]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *       - in: query
 *         name: visaType
 *         schema:
 *           type: string
 *       - in: query
 *         name: visaName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visa records fetched successfully
 */
router.get("/", getAllVisa);
/**
 * @swagger
 * /v1/api/inventory/visa/{id}:
 *   get:
 *     summary: Get visa by ID
 *     tags: [My Inventory - Visa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visa retrieved successfully
 *       404:
 *         description: Visa not found
 */
router.get("/:id", getVisaById);
/**
 * @swagger
 * /v1/api/inventory/visa/{id}:
 *   put:
 *     summary: Update visa
 *     tags: [My Inventory - Visa]
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
 *         description: Visa updated successfully
 *       404:
 *         description: Visa not found
 */
router.put("/:id", updateVisa);
/**
 * @swagger
 * /v1/api/inventory/visa/{id}:
 *   delete:
 *     summary: Delete visa
 *     tags: [My Inventory - Visa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Visa not found
 */
router.delete("/:id", deleteVisa);

export const visaRouter = router;