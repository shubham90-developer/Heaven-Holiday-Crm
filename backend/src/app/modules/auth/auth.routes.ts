import express from 'express'
import { registerUser, login, logout, refreshAccessToken, verifyUser } from './auth.controller'
import { verifyToken } from '../../middleware/tokenVerification'

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication management APIs
 */

/**
 * @swagger
 * /v1/api/auth/register:
 *   post:
 *     summary: Register new admin user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Muskan Mujavar
 *               email:
 *                 type: string
 *                 example: admin@heavenholiday.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: User already exists / validation error
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerUser)
/**
 * @swagger
 * /v1/api/auth/login:
 *   post:
 *     summary: Login admin user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@heavenholiday.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', login)
/**
 * @swagger
 * /v1/api/auth/logout:
 *   post:
 *     summary: Logout authenticated user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Internal server error
 */
router.post("/logout", logout)
router.post('/refresh-token', refreshAccessToken)
router.get("/verify-user", verifyToken, verifyUser);

export const authRouter = router;