import { Router } from "express";
import {
    createInclusion,
    getInclusions,
    getInclusionById,
    updateInclusion,
    deleteInclusion,
} from "./inclusion.controller";

const router = Router();

router.post("/", createInclusion);
router.get("/", getInclusions);
router.get("/:id", getInclusionById);
router.put("/:id", updateInclusion);
router.patch("/:id", deleteInclusion);

export const inclusionRouter = router;
