import express from "express";
import * as supplierCtrl from "./supplier.controller";

const router = express.Router();
/**
 * @swagger
 * /v1/api/supplier:
 *   post:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier)
 *     summary: Create supplier
 *     description: Creates a new supplier with company details, contact information, services, and compliance data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - currencyType
 *               - panNumber
 *               - firstName
 *               - lastName
 *               - designation
 *               - email
 *               - mobileNumber
 *               - category
 *               - services
 *             properties:
 *               companyName:
 *                 type: string
 *               currencyType:
 *                 type: string
 *               gstRegister:
 *                 type: boolean
 *               panNumber:
 *                 type: string
 *               salutation:
 *                 type: string
 *                 enum: [Mr., Ms., Mrs., Dr., Miss, Prof.]
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               designation:
 *                 type: string
 *               email:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               addressLine1:
 *                 type: string
 *               addressLine2:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               category:
 *                 type: string
 *               services:
 *                 type: string
 *               comments:
 *                 type: string
 *               destinationOffered:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", supplierCtrl.createSupplier);
/**
 * @swagger
 * /v1/api/supplier/quick:
 *   post:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier)
 *     summary: Quick-add supplier from enquiry package page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - firstName
 *               - email
 *               - mobileNumber
 *               - country
 *               - city
 *               - services
 *     responses:
 *       201:
 *         description: Supplier added successfully
 *       409:
 *         description: Email already exists
 */
router.post("/quick", supplierCtrl.createQuickSupplier);
/**
 * @swagger
 * /v1/api/supplier:
 *   get:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier)
 *     summary: Get all suppliers
 *     description: Fetches all suppliers with their details.
 *     responses:
 *       200:
 *         description: Suppliers fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/", supplierCtrl.getSuppliers);
/**
 * @swagger
 * /v1/api/supplier/{id}:
 *   get:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier)
 *     summary: Get supplier by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier fetched successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.get("/:id", supplierCtrl.getSupplierById);
/**
 * @swagger
 * /v1/api/supplier/{id}:
 *   put:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier)
 *     summary: Update supplier
 *     description: Updates supplier details including company, contact, and service information.
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
 *         description: Supplier updated successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.put("/:id", supplierCtrl.updateSupplier);
/**
 * @swagger
 * /v1/api/supplier/{id}:
 *   delete:
 *     tags:
 *       - CRM / Sales - My Suppliers (Supplier)
 *     summary: Delete supplier
 *     description: Deletes a supplier record from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", supplierCtrl.deleteSupplier);

export const supplierRouter = router;