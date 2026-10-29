import { Router } from "express";
import {
  createB2BLead,
  getAllB2BLeads,
  filterB2BLeads,
  getB2BLeadById,
  updateB2BLead,
  deleteB2BLead,
  bulkUploadB2BLeads,
  assignB2BLeads
} from "./b2bLead.controller";
import { upload } from "../../middleware/multer";
const router: Router = Router();
/**
 * @swagger
 * /v1/api/b2b-leads:
 *   post:
 *     tags:
 *       - CRM / Sales - B2B Customers (Business-to-Business)
 *     summary: Create B2B Lead
 *     description: Creates a new B2B lead for agency or corporate customers.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - companyName
 *               - email
 *               - salutation
 *               - firstName
 *               - lastName
 *               - mobile
 *               - rm
 *               - leadSource
 *               - country
 *               - state
 *               - city
 *               - area
 *               - pincode
 *               - address
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [agency, corporate]
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *               salutation:
 *                 type: string
 *                 enum: [Mr., Mrs., Ms., Miss., Dr., Prof.]
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mobile:
 *                 type: string
 *               rm:
 *                 type: string
 *               leadSource:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               area:
 *                 type: string
 *               pincode:
 *                 type: string
 *               address:
 *                 type: string
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: B2B lead created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", createB2BLead);
/**
 * @swagger
 * /v1/api/b2b-leads:
 *   get:
 *     tags:
 *       - CRM / Sales - B2B Customers (Business-to-Business)
 *     summary: Get all B2B leads
 *     description: Fetch all active B2B leads sorted by latest created date.
 *     responses:
 *       200:
 *         description: B2B leads fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllB2BLeads);
/**
 * @swagger
 * /v1/api/b2b-leads/filter:
 *   get:
 *     tags:
 *       - CRM / Sales - B2B Customers (Business-to-Business)
 *     summary: Filter B2B leads
 *     description: Filter B2B leads using mobile, company name, email, lead source, RM, status, or text search.
 *     parameters:
 *       - in: query
 *         name: mobile
 *         schema:
 *           type: string
 *         description: Filter by mobile number
 *
 *       - in: query
 *         name: companyName
 *         schema:
 *           type: string
 *         description: Filter by company name
 *
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email
 *
 *       - in: query
 *         name: leadSource
 *         schema:
 *           type: string
 *         description: Filter by lead source
 *
 *       - in: query
 *         name: rm
 *         schema:
 *           type: string
 *         description: Filter by relationship manager
 *
 *       - in: query
 *         name: textSearch
 *         schema:
 *           type: string
 *         description: Global text search across lead fields
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by lead status
 *
 *     responses:
 *       200:
 *         description: Filtered B2B leads fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/filter", filterB2BLeads);
/**
 * @swagger
 * /v1/api/b2b-leads/{id}:
 *   get:
 *     tags:
 *       - CRM / Sales - B2B Customers (Business-to-Business)
 *     summary: Get B2B lead by ID
 *     description: Fetch a single B2B lead using lead ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB lead ID
 *
 *     responses:
 *       200:
 *         description: B2B lead fetched successfully
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getB2BLeadById);
/**
 * @swagger
 * /v1/api/b2b-leads/{id}:
 *   put:
 *     tags:
 *       - CRM / Sales - B2B Customers (Business-to-Business)
 *     summary: Update B2B lead
 *     description: Update an existing B2B lead completely.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB lead ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *     responses:
 *       200:
 *         description: B2B lead updated successfully
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateB2BLead);
/**
 * @swagger
 * /v1/api/b2b-leads/{id}:
 *   patch:
 *     tags:
 *       - CRM / Sales - B2B Customers (Business-to-Business)
 *     summary: Soft delete B2B lead
 *     description: Soft deletes a B2B lead by setting isDeleted to true.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB lead ID
 *
 *     responses:
 *       200:
 *         description: B2B lead deleted successfully
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */

router.patch("/assign-b2b", assignB2BLeads);
router.patch("/:id", deleteB2BLead);
/**
 * @swagger
 * /v1/api/b2b-leads/bulk-upload:
 *   post:
 *     tags:
 *       - CRM / Sales - B2B Customers (Business-to-Business)
 *     summary: Bulk upload B2B leads
 *     description: Upload a CSV file to create multiple B2B leads at once.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: Bulk upload completed successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Internal server error
 */
router.post("/bulk-upload", upload.single("file"), bulkUploadB2BLeads);

export const b2bLeadRouter = router;