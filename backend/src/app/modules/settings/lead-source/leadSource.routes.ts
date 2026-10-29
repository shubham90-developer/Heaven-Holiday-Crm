import express from "express";
import {
    createLeadSource, getLeadSources, getLeadSourceById,
    updateLeadSource, deleteLeadSource
} from "./leadSource.controller";
const router = express.Router();

router.post("/", createLeadSource);
router.get("/", getLeadSources);
router.get("/:id", getLeadSourceById);
router.put("/:id", updateLeadSource);
router.patch("/:id", deleteLeadSource);

export const leadSourceRouter = router;