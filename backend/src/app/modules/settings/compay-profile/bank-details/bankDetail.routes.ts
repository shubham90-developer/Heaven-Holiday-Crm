import express from "express";

import {
    createBankDetail,
    getBankDetails,
    getBankDetailById,
    updateBankDetail,
    deleteBankDetail,
    setActiveBankDetail
} from "./bankDetail.controller";
import { verifyToken } from "../../../../middleware/tokenVerification";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Settings - Company Profile (Bank Details)
 *   description: Bank details management APIs
 */

/**
 * @swagger
 * /v1/api/settings/company-profile/bank-details:
 *   post:
 *     summary: Create bank detail
 *     tags: [Settings - Company Profile (Bank Details)]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountHolderName
 *               - accountNumber
 *               - ifscCode
 *               - accountType
 *               - bankName
 *               - branch
 *               - country
 *               - city
 *
 *             properties:
 *               accountHolderName:
 *                 type: string
 *                 example: Muskan Mujavar
 *
 *               accountNumber:
 *                 type: string
 *                 example: "1234567890"
 *
 *               ifscCode:
 *                 type: string
 *                 example: HDFC0001234
 *
 *               accountType:
 *                 type: string
 *                 enum: [Saving, Current]
 *                 example: Current
 *
 *               bankName:
 *                 type: string
 *                 example: HDFC Bank
 *
 *               branch:
 *                 type: string
 *                 example: Kharadi Branch
 *
 *               country:
 *                 type: string
 *                 example: India
 *
 *               city:
 *                 type: string
 *                 example: Pune
 *
 *     responses:
 *       201:
 *         description: Bank detail created successfully
 *
 *       400:
 *         description: Mandatory fields missing
 *
 *       404:
 *         description: Company profile not found
 *
 *       500:
 *         description: Internal server error
 */
router.post("/", verifyToken, createBankDetail);
/**
 * @swagger
 * /v1/api/settings/company-profile/bank-details:
 *   get:
 *     summary: Get all bank details
 *     tags: [Settings - Company Profile (Bank Details)]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Bank details fetched successfully
 *
 *       500:
 *         description: Internal server error
 */
router.get("/", verifyToken, getBankDetails);
/**
 * @swagger
 * /v1/api/settings/company-profile/bank-details/{id}:
 *   get:
 *     summary: Get bank detail by ID
 *     tags: [Settings - Company Profile (Bank Details)]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6640a8c3c95f1e8a12345678
 *
 *     responses:
 *       200:
 *         description: Bank detail fetched successfully
 *
 *       404:
 *         description: Bank detail not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/:id", verifyToken, getBankDetailById);
/**
 * @swagger
 * /v1/api/settings/company-profile/bank-details/{id}:
 *   patch:
 *     summary: Update bank detail
 *     tags: [Settings - Company Profile (Bank Details)]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6640a8c3c95f1e8a12345678
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               accountHolderName:
 *                 type: string
 *                 example: Muskan Mujavar
 *
 *               accountNumber:
 *                 type: string
 *                 example: "1234567890"
 *
 *               ifscCode:
 *                 type: string
 *                 example: HDFC0001234
 *
 *               accountType:
 *                 type: string
 *                 enum: [Saving, Current]
 *                 example: Saving
 *
 *               bankName:
 *                 type: string
 *                 example: ICICI Bank
 *
 *               branch:
 *                 type: string
 *                 example: Pune Branch
 *
 *               country:
 *                 type: string
 *                 example: India
 *
 *               city:
 *                 type: string
 *                 example: Mumbai
 *
 *     responses:
 *       200:
 *         description: Bank detail updated successfully
 *
 *       404:
 *         description: Bank detail not found
 *
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", verifyToken, updateBankDetail);
/**
 * @swagger
 * /v1/api/settings/company-profile/bank-details/{id}:
 *   delete:
 *     summary: Delete bank detail
 *     tags: [Settings - Company Profile (Bank Details)]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6640a8c3c95f1e8a12345678
 *
 *     responses:
 *       200:
 *         description: Bank detail deleted successfully
 *
 *       404:
 *         description: Bank detail not found
 *
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyToken, deleteBankDetail);
/**
 * @swagger
 * /v1/api/settings/company-profile/bank-details/{id}:
 *   patch:
 *     summary: Set active bank detail
 *     tags: [Settings - Company Profile (Bank Details)]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6640a8c3c95f1e8a12345678
 *
 *     responses:
 *       200:
 *         description: Active bank detail updated successfully
 *
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", verifyToken, setActiveBankDetail);

export const bankDetailRouter = router;