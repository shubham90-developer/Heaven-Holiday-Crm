import express from "express";
import { createOrUpdateTermsConditions, getTermsConditions } from "./termsConditions.controller";
const router = express.Router();

router.post("/", createOrUpdateTermsConditions);
router.get("/", getTermsConditions);

export const termsCoditionsRouter = router;