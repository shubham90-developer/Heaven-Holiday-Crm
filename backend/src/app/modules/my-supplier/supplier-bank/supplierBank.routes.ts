import express, { Router } from "express";
import * as bankCtrl from "./supplierBank.controller";

const router = express.Router();
/**
 * @swagger
 * /v1/api/supplier-bank:
 *   post:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier Bank)
 *     summary: Create supplier bank account
 *     description: Adds banking details for a supplier including account information, IFSC/SWIFT codes, and primary bank status.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountName
 *               - accountNumber
 *
 *             properties:
 *               accountName:
 *                 type: string
 *                 example: Heaven Holiday Pvt Ltd
 *
 *               accountNumber:
 *                 type: string
 *                 example: 123456789012
 *
 *               bankName:
 *                 type: string
 *                 example: HDFC Bank
 *
 *               ifscCode:
 *                 type: string
 *                 example: HDFC0001234
 *
 *               swiftCode:
 *                 type: string
 *                 example: HDFCINBB
 *
 *               isPrimary:
 *                 type: boolean
 *                 example: true
 *
 *               country:
 *                 type: string
 *                 example: India
 *
 *               city:
 *                 type: string
 *                 example: Mumbai
 *
 *               comments:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Supplier bank created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       500:
 *         description: Internal server error
 */
router.post("/", bankCtrl.createBank);
/**
 * @swagger
 * /v1/api/supplier-bank:
 *   get:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier Bank)
 *     summary: Get all supplier bank accounts
 *     description: Fetches all supplier banking records.
 *
 *     responses:
 *       200:
 *         description: Supplier banks fetched successfully
 *
 *       500:
 *         description: Server error
 */
router.get("/", bankCtrl.getSupplierBanks);
/**
 * @swagger
 * /v1/api/supplier-bank/{id}:
 *   get:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier Bank)
 *     summary: Get supplier bank details
 *     description: Fetches bank details for a specific supplier.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Supplier bank details fetched successfully
 *
 *       404:
 *         description: Bank details not found
 *
 *       500:
 *         description: Server error
 */
router.get("/:id", bankCtrl.getBanksBySupplier);
router.delete("/:id", bankCtrl.deleteBank);

export const supplierBankRouter = router;