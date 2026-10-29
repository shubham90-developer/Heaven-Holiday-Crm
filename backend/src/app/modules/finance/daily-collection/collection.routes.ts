import { Router } from "express";
import {
    createCollection,
    getCollections,
    approveCollection,
    rejectCollection,
} from "./collection.controller";

const router = Router();

router.post("/", createCollection);
router.get("/", getCollections);
router.patch("/:id/approve", approveCollection);
router.patch("/:id/reject", rejectCollection);

export const dailyCollectionRouter = router;
