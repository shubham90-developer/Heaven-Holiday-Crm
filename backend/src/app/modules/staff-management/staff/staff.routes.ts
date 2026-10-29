import express from "express";
import {
    createStaff,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff,
} from "./staff.controller";

const router = express.Router();
/**
 * @swagger
 * /v1/api/staff-management/staff:
 *   post:
 *     tags:
 *       - Staff Management - Staff
 *     summary: Create Staff Member
 *     description: Creates a new staff profile with department, role, permissions, reporting hierarchy, and communication settings.
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
 *               - phone
 *               - role
 *               - department
 *               - reportingManager
 *
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Rahul
 *
 *               lastName:
 *                 type: string
 *                 example: Sharma
 *
 *               email:
 *                 type: string
 *                 example: rahul@company.com
 *
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *
 *               role:
 *                 type: string
 *                 example: 665e8ab1f4a12f001234567
 *
 *               department:
 *                 type: string
 *                 example: 665e8ab1f4a12f001234568
 *
 *               reportingManager:
 *                 type: string
 *                 example: Operations Head
 *
 *               isSelfSender:
 *                 type: boolean
 *                 example: false
 *
 *               senderEmail:
 *                 type: string
 *                 example: sales@company.com
 *
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["create_leads", "view_queries"]
 *
 *               address:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   fullAddress:
 *                     type: string
 *
 *               profileImage:
 *                 type: string
 *
 *               signatureType:
 *                 type: string
 *                 enum: [default, custom]
 *
 *               signature:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Staff created successfully
 *
 *       400:
 *         description: Validation error or duplicate email
 */
router.post("/", createStaff);
/**
 * @swagger
 * /v1/api/staff-management/staff:
 *   get:
 *     tags:
 *       - Staff Management - Staff
 *     summary: Get All Staff
 *     description: Fetches all active staff members with populated role and department details.
 *
 *     responses:
 *       200:
 *         description: Staff fetched successfully
 */
router.get("/", getStaff);
/**
 * @swagger
 * /v1/api/staff-management/staff/{id}:
 *   get:
 *     tags:
 *       - Staff Management - Staff
 *     summary: Get Staff By ID
 *     description: Fetches detailed information of a specific staff member.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *
 *     responses:
 *       200:
 *         description: Staff fetched successfully
 *
 *       404:
 *         description: Staff not found
 */
router.get("/:id", getStaffById);
/**
 * @swagger
 * /v1/api/staff-management/staff/{id}:
 *   patch:
 *     tags:
 *       - Staff Management - Staff
 *     summary: Update Staff
 *     description: Updates staff profile details, permissions, hierarchy, or communication settings.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
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
 *         description: Staff updated successfully
 *
 *       400:
 *         description: Validation error
 */
router.patch("/:id", updateStaff);
/**
 * @swagger
 * /v1/api/staff-management/staff/{id}:
 *   delete:
 *     tags:
 *       - Staff Management - Staff
 *     summary: Deactivate Staff
 *     description: Soft deletes a staff member by marking them inactive.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Staff ID
 *
 *     responses:
 *       200:
 *         description: Staff deactivated successfully
 */
router.delete("/:id", deleteStaff);

export const staffRouter = router;