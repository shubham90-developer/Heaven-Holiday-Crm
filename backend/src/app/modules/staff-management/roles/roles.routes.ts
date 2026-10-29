import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "./roles.controller";

const router = express.Router();
/**
 * @swagger
 * /v1/api/staff-management/role:
 *   post:
 *     tags:
 *       - Staff Management - Roles
 *     summary: Create Role
 *     description: Creates a new staff role for access control, responsibility assignment, and organizational hierarchy management.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - roleType
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sales Executive
 *
 *               roleType:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - SALES
 *                   - MANAGER
 *                   - BACK_OFFICE
 *                 example: SALES
 *
 *               description:
 *                 type: string
 *                 example: Handles customer lead management and sales follow-ups
 *
 *               isActive:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Role created successfully
 *
 *       400:
 *         description: Validation error
 */
router.post("/", createRole);
/**
 * @swagger
 * /v1/api/staff-management/role:
 *   get:
 *     tags:
 *       - Staff Management - Roles
 *     summary: Get All Roles
 *     description: Fetches all active staff roles.
 *
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *
 *       400:
 *         description: Error fetching roles
 */
router.get("/", getAllRoles);
/**
 * @swagger
 * /v1/api/staff-management/role/{id}:
 *   get:
 *     tags:
 *       - Staff Management - Roles
 *     summary: Get Role By ID
 *     description: Fetches a specific role by its ID.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *
 *     responses:
 *       200:
 *         description: Role fetched successfully
 *
 *       404:
 *         description: Role not found
 */
router.get("/:id", getRoleById);
/**
 * @swagger
 * /v1/api/staff-management/role/{id}:
 *   put:
 *     tags:
 *       - Staff Management - Roles
 *     summary: Update Role
 *     description: Updates role details such as name, type, or description.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Senior Sales Executive
 *
 *               roleType:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - SALES
 *                   - MANAGER
 *                   - BACK_OFFICE
 *
 *               description:
 *                 type: string
 *
 *               isActive:
 *                 type: boolean
 *
 *     responses:
 *       200:
 *         description: Role updated successfully
 *
 *       400:
 *         description: Validation error
 */
router.put("/:id", updateRole);
/**
 * @swagger
 * /v1/api/staff-management/role/{id}:
 *   patch:
 *     tags:
 *       - Staff Management - Roles
 *     summary: Deactivate Role
 *     description: Soft deletes a role by marking it inactive.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *
 *     responses:
 *       200:
 *         description: Role deactivated successfully
 *
 *       404:
 *         description: Role not found
 */
router.patch("/:id", deleteRole);

export const rolesRouter = router;