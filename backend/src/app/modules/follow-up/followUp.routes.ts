import express from "express";
import { Router } from "express";
import { createFollowUp, getAllFollowUps, getFollowUpById, getFollowUpsByLeadId } from "./followUp.controller";
const router: Router = Router();

router.get("/", getAllFollowUps);
router.post("/:leadId", createFollowUp);
router.get("/:leadId", getFollowUpsByLeadId)
router.get("/:id", getFollowUpById);

export const followUpRouter = router;