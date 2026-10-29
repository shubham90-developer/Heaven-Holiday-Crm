import express from "express";
import * as contactCtrl from "./supplierContact.controller";
import { Connection } from "mongoose";

const router = express.Router();
/**
 * @swagger
 * /v1/api/supplier-contact:
 *   post:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier Contact)
 *     summary: Create Supplier Contact
 *     description: Creates a new supplier contact person for communication, coordination, and supplier relationship management.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - mobileNumber
 *
 *             properties:
 *               salutation:
 *                 type: string
 *                 enum: [Mr., Ms., Mrs., Dr., Miss, Prof.]
 *                 example: Mr.
 *
 *               firstName:
 *                 type: string
 *                 example: Rahul
 *
 *               lastName:
 *                 type: string
 *                 example: Sharma
 *
 *               designation:
 *                 type: string
 *                 example: Sales Manager
 *
 *               department:
 *                 type: string
 *                 example: International Bookings
 *
 *               email:
 *                 type: string
 *                 example: rahul@supplier.com
 *
 *               mobileNumber:
 *                 type: string
 *                 example: 9876543210
 *
 *               country:
 *                 type: string
 *                 example: India
 *
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *
 *               city:
 *                 type: string
 *                 example: Mumbai
 *
 *               comments:
 *                 type: string
 *                 example: Primary contact for Europe packages
 *
 *               destinations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Dubai", "Singapore", "Thailand"]
 *
 *     responses:
 *       201:
 *         description: Supplier contact created successfully
 *
 *       400:
 *         description: Required fields missing
 *
 *       500:
 *         description: Internal server error
 */
router.post("/", contactCtrl.createContact);
/**
 * @swagger
 * /v1/api/supplier-contact:
 *   get:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier Contact)
 *     summary: Get All Supplier Contacts
 *     description: Fetches all supplier contacts available in the system.
 *
 *     responses:
 *       200:
 *         description: Supplier contacts fetched successfully
 *
 *       500:
 *         description: Internal server error
 */
router.get("/", contactCtrl.getSupplierContacts);
/**
 * @swagger
 * /v1/api/supplier-contact/{id}:
 *   get:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier Contact)
 *     summary: Get Supplier Contacts By Supplier ID
 *     description: Fetches all contacts associated with a specific supplier.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *
 *     responses:
 *       200:
 *         description: Supplier contacts fetched successfully
 *
 *       404:
 *         description: Supplier not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/:id", contactCtrl.getContactsBySupplier);

export const supplierContactRouter = router;