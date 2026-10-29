import express from "express";
import { Router } from "express";
import {
    createQuery, getAllQueries,
    getQueryById,
    deleteQueryById, updateQueryStage,
    getAllConfirmedQueries, getCallBackQueries, 
    getInProcessQueries, getRecentQueries, 
    getUnAssignedQueries,
     getWIP_PackagesQueries,
    getQueryStatusReportOverall,
    getQueriesByLeadId,
    getRecentQueriesByLeadId,
    assignQueries,
    getRejectedQueries,
    exportQueries,
    bulkUpdateQueries,
} from "./queries.controller"
const router: Router = Router();
/**
 * @swagger
 * /v1/api/query:
 *   post:
 *     tags:
 *       - CRM / Sales - Queries 
 *     summary: Create a new Query for a lead
 *     description: |
 *       Creates a new enquiry (query) for a B2C or B2B lead.  
 *       Each query represents a travel requirement such as Package, Flight, Visa, Hotel, Transfer, Sightseeing, or Miscellaneous service.
 *
 *     parameters:
 *       - in: query
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lead ID (B2C or B2B)
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requirementType
 *             properties:
 *               requirementType:
 *                 type: string
 *                 enum:
 *                   - Package
 *                   - Flight
 *                   - Transfer
 *                   - Visa
 *                   - Hotel
 *                   - Sightseeing
 *                   - Miscellaneous
 *
 *               packageDetails:
 *                 type: object
 *               flightDetails:
 *                 type: object
 *               transferDetails:
 *                 type: object
 *               visaDetails:
 *                 type: object
 *               hotelDetails:
 *                 type: object
 *               sightseeingDetails:
 *                 type: object
 *               miscellaneousDetails:
 *                 type: object
 *
 *               stage:
 *                 type: string
 *                 example: Query Created
 *
 *               remark:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Query created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */
router.post("/", createQuery);
/**
 * @swagger
 * /v1/api/query:
 *   get:
 *     tags:
 *       - CRM / Sales - Queries
 *     summary: Get all queries with filters
 *     description: Fetches all queries with optional filtering by stage, requirement type, lead, assignment, or category.
 *
 *     parameters:
 *       - in: query
 *         name: stage
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: requirementType
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: leadId
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: assigned
 *         schema:
 *           type: boolean
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [in-progress, confirmed, rejected, callback, unassigned, overall]
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of query items per page
 *
 *     responses:
 *       200:
 *         description: Queries fetched successfully (flattened enquiry items, newest first)
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllQueries);
router.get("/recent/:leadId", getRecentQueriesByLeadId);
router.get("/report", getQueryStatusReportOverall);
/**
 * @swagger
 * /v1/api/query/confirmed:
 *   get:
 *     tags:
 *       - CRM / Sales - Confirmed Queries
 *     summary: Get all confirmed queries
 *     description: Returns queries that are in confirmed or booking stages.
 *
 *     responses:
 *       200:
 *         description: Confirmed queries fetched
 *       500:
 *         description: Server error
 */
router.get("/confirmed", getAllConfirmedQueries)
router.get("/callback", getCallBackQueries);
router.get("/in-process", getInProcessQueries);
router.get("/unassigned", getUnAssignedQueries);
router.get("/rejected", getRejectedQueries);
router.get("/recent-queries", getRecentQueries);
/**
 * @swagger
 * /v1/api/query/wip-packages:
 *   get:
 *     tags:
 *       - CRM / Sales - Queries
 *     summary: Get Work-In-Progress queries
 *     description: Fetches all active queries excluding confirmed and lost stages.
 *
 *     responses:
 *       200:
 *         description: WIP queries fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/wip-packages", getWIP_PackagesQueries)
router.get("/export", exportQueries);
/**
 * @swagger
 * /v1/api/query/lead/{leadId}:
 *   get:
 *     tags:
 *       - CRM / Sales - Queries
 *     summary: Get all queries for a lead
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Queries fetched successfully
 *       400:
 *         description: Invalid lead ID
 *       500:
 *         description: Server error
 */
router.get("/lead/:leadId", getQueriesByLeadId);
/**
 * @swagger
 * /v1/api/query/{id}:
 *   get:
 *     tags:
 *       - CRM / Sales - Queries
 *     summary: Get query by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Query fetched successfully
 *       404:
 *         description: Query not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getQueryById);
/**
 * @swagger
 * /v1/api/query/{queryId}:
 *   patch:
 *     tags:
 *       - CRM / Sales - Queries 
 *     summary: Update query stage
 *
 *     parameters:
 *       - in: path
 *         name: queryId
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
 *             required:
 *               - stage
 *             properties:
 *               stage:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Query stage updated
 *       404:
 *         description: Query not found
 *       500:
 *         description: Server error
 */
router.patch("/assign", assignQueries);
router.patch("/bulk", bulkUpdateQueries);
router.patch("/:queryId", updateQueryStage);
// router.patch("/assign", assignQueries);
/**
 * @swagger
 * /v1/api/query/{id}:
 *   patch:
 *     tags:
 *       - CRM / Sales - Queries
 *     summary: Soft delete query
 *     description: Marks a query as deleted instead of removing it permanently.
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
 *         description: Query deleted successfully
 *       500:
 *         description: Server error
 */
router.patch("/:id", deleteQueryById);

export const queryRouter = router;