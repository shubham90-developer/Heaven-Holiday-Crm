import express from "express";
import { generateProposalContent } from "./proposal.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/proposal/generate-content:
 *   post:
 *     tags: ["CRM / Sales - Custom Proposal"]
 *     summary: Generate AI itinerary copy and image prompts via OpenRouter Grok
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Generated proposal content
 */
router.post("/generate-content", generateProposalContent);

export const proposalRouter = router;
