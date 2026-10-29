import { Router } from "express";
import {
  createB2CLeads,
  getAllB2CLeads,
  filterB2CLeads,
  getLeadsById,
  updateLead,
  deleteLead,
  bulkUploadB2CLeads,
  assignB2CLeads
  // updateB2CLead
} from "./b2cLead.controller";
import { upload } from "../../middleware/multer";
const router: Router = Router();
/**
 * @swagger
 * /v1/api/b2c-leads:
 *   post:
 *     tags:
 *       - CRM / Sales - B2C Customers (Business-to-Customers)
 *     summary: Create B2C Lead
 *     description: Creates a new Business-to-Customer (B2C) lead by capturing individual customer inquiry details for sales engagement, lead tracking, and future CRM enrichment.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - mobile
 *               - salutation
 *               - firstName
 *               - lastName
 *               - leadSource
 *               - leadStage
 *
 *             properties:
 *               email:
 *                 type: string
 *                 example: customer@example.com
 *
 *               mobile:
 *                 type: string
 *                 example: 9876543210
 *
 *               salutation:
 *                 type: string
 *                 enum: [Mr., Ms., Mrs., Miss, Dr., Prof.]
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
 *               leadSource:
 *                 type: string
 *                 example: Website
 *
 *               leadStage:
 *                 type: string
 *                 enum:
 *                   - New
 *                   - Follow Up
 *                   - Call Back
 *                   - Wrong Number
 *                   - Cannot Be Contacted
 *                   - Not Interested
 *                   - Junk Lead
 *                   - Lost Lead
 *                   - Duplicate
 *                   - Destination Closed
 *                   - Unanswered
 *                   - Not Reachable
 *                   - Contacted
 *                 example: New
 *
 *     responses:
 *       200:
 *         description: B2C lead created successfully
 *
 *       400:
 *         description: Validation failed or lead already exists
 *
 *       500:
 *         description: Internal server error
 */
router.post("/", createB2CLeads);
/**
 * @swagger
 * /v1/api/b2c-leads:
 *   get:
 *     tags:
 *       - CRM / Sales - B2C Customers (Business-to-Customers)
 *     summary: Get All B2C Leads
 *     description: Retrieves all B2C leads with pagination, search, and optional filtering by lead stage or lead source.
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 20
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: Rahul
 *
 *       - in: query
 *         name: leadStage
 *         schema:
 *           type: string
 *         example: New
 *
 *       - in: query
 *         name: leadSource
 *         schema:
 *           type: string
 *         example: Website
 *
 *     responses:
 *       200:
 *         description: Leads fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllB2CLeads);
/**
 * @swagger
 * /v1/api/b2c-leads/filter:
 *   get:
 *     tags:
 *       - CRM / Sales - B2C Customers (Business-to-Customers)
 *     summary: Filter B2C Leads
 *     description: Filters B2C leads based on customer details, lead source, ownership, and search criteria.
 *
 *     parameters:
 *       - in: query
 *         name: mobile
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: customerName
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: leadSource
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Filtered leads fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/filter", filterB2CLeads);
/**
 * @swagger
 * /v1/api/b2c-leads/{id}:
 *   get:
 *     tags:
 *       - CRM / Sales - B2C Customers (Business-to-Customers)
 *     summary: Get B2C Lead By ID
 *     description: Retrieves complete details of a specific B2C lead.
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
 *         description: Lead fetched successfully
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getLeadsById);
/**
 * @swagger
 * /v1/api/b2c-leads/{id}:
 *   put:
 *     tags:
 *       - CRM / Sales - B2C Customers (Business-to-Customers)
 *     summary: Update B2C Lead
 *     description: Updates an existing B2C lead including profile details, preferences, remarks, todos, and CRM lifecycle information.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Lead updated successfully
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateLead);
/**
 * @swagger
 * /v1/api/b2c-leads/{id}:
 *   patch:
 *     tags:
 *       - CRM / Sales - B2C Customers (Business-to-Customers)
 *     summary: Soft Delete B2C Lead
 *     description: Marks a B2C lead as deleted without permanently removing it from the database.
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
 *         description: Lead deleted successfully
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */
router.patch("/assign-b2c", assignB2CLeads);
router.patch("/:id", deleteLead);
/**
 * @swagger
 * /v1/api/b2c-leads/bulk-upload:
 *   post:
 *     tags:
 *       - CRM / Sales - B2C Customers (Business-to-Customers)
 *     summary: Bulk Upload B2C Leads
 *     description: Uploads multiple B2C leads through CSV file import.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: Bulk upload completed
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Database or server error
 */
router.post("/bulk-upload", upload.single("file"), bulkUploadB2CLeads);

export const b2cLeadRouter = router;