import express from "express";
import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} from "./department.controllers";

const router = express.Router();
/**
 * @swagger
 * /v1/api/staff-management/department:
 *   post:
 *     tags:
 *       - Staff Management - Department
 *     summary: Create Department
 *     description: Creates a new department for organizing staff roles, operational teams, and internal workflow management.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sales
 *
 *               isOperations:
 *                 type: boolean
 *                 example: false
 *
 *               isActive:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       201:
 *         description: Department created successfully
 *
 *       400:
 *         description: Validation error
 */
router.post("/", createDepartment);
/**
 * @swagger
 * /v1/api/staff-management/department:
 *   get:
 *     tags:
 *       - Staff Management - Department
 *     summary: Get All Departments
 *     description: Fetches all active departments.
 *
 *     responses:
 *       200:
 *         description: Departments fetched successfully
 *
 *       400:
 *         description: Error fetching departments
 */
router.get("/", getDepartments);
/**
 * @swagger
 * /v1/api/staff-management/department/{id}:
 *   get:
 *     tags:
 *       - Staff Management - Department
 *     summary: Get Department By ID
 *     description: Fetches details of a specific department.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *
 *     responses:
 *       200:
 *         description: Department fetched successfully
 *
 *       404:
 *         description: Department not found
 */
router.get("/:id", getDepartmentById);
/**
 * @swagger
 * /v1/api/staff-management/department/{id}:
 *   patch:
 *     tags:
 *       - Staff Management - Department
 *     summary: Update Department
 *     description: Updates department information such as name or operational status.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
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
 *                 example: Operations
 *
 *               isOperations:
 *                 type: boolean
 *                 example: true
 *
 *               isActive:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Department updated successfully
 *
 *       400:
 *         description: Validation error
 */
router.patch("/:id", updateDepartment);
/**
 * @swagger
 * /v1/api/staff-management/department/{id}:
 *   patch:
 *     tags:
 *       - Staff Management - Department
 *     summary: Deactivate Department
 *     description: Soft deletes a department by marking it inactive.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *
 *     responses:
 *       200:
 *         description: Department deactivated successfully
 *
 *       400:
 *         description: Error deactivating department
 */
router.delete("/:id", deleteDepartment);

export const departmentRouter = router;