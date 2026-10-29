import express from "express";
import {
  createPackage,
  getAllPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
} from "./package.controller";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: My Inventory - Packages
 *   description: This sub-module manages travel package master data including package definitions, travel modes, destination coverage, supplier allocation, themes, inclusives, package specifications, media assets, and reusable metadata for itinerary planning and package configuration.
 */

/**
 * @swagger
 * /v1/api/inventory/package:
 *   post:
 *     summary: Create a new travel package
 *     tags: [My Inventory - Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packageName
 *               - packageMode
 *               - packageType
 *               - startingFrom
 *               - endCity
 *               - destinationCovered
 *               - supplier
 *               - categories
 *               - theme
 *               - inclusives
 *               - specification
 *               - overview
 *             properties:
 *               packageName:
 *                 type: string
 *                 example: Goa Escape
 *               packageMode:
 *                 type: string
 *                 example: Flight
 *               packageType:
 *                 type: string
 *                 enum: [Domestic, Inbound, International]
 *               startingFrom:
 *                 type: string
 *                 example: Mumbai
 *               endCity:
 *                 type: string
 *                 example: Goa
 *               destinationCovered:
 *                 type: string
 *                 example: North Goa, South Goa
 *               supplier:
 *                 type: string
 *                 example: XYZ Travels
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Beach, Leisure]
 *               theme:
 *                 type: string
 *                 example: Honeymoon
 *               inclusives:
 *                 type: string
 *                 example: Hotel, Breakfast, Airport Transfer
 *               specification:
 *                 type: string
 *                 example: 4 Nights / 5 Days
 *               image:
 *                 type: string
 *               youtubeUrl:
 *                 type: string
 *               overview:
 *                 type: string
 *                 example: A relaxing Goa vacation package
 *     responses:
 *       201:
 *         description: Package created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createPackage);
/**
 * @swagger
 * /v1/api/inventory/package:
 *   get:
 *     summary: Get all travel packages
 *     tags: [My Inventory - Packages]
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 */
router.get("/", getAllPackages);
/**
 * @swagger
 * /v1/api/inventory/package/{id}:
 *   get:
 *     summary: Get single package by ID
 *     tags: [My Inventory - Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package retrieved successfully
 *       404:
 *         description: Package not found
 */
router.get("/:id", getSinglePackage);
/**
 * @swagger
 * /v1/api/inventory/package/{id}:
 *   patch:
 *     summary: Update package
 *     tags: [My Inventory - Packages]
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
 *         description: Package updated successfully
 */
router.patch("/:id", updatePackage);
/**
 * @swagger
 * /v1/api/inventory/package/{id}:
 *   delete:
 *     summary: Delete package
 *     tags: [My Inventory - Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package deleted successfully
 */
router.delete("/:id", deletePackage);

export const packageRouter = router;