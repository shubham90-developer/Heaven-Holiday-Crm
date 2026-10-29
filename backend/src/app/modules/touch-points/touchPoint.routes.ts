import { Router } from "express";
import {
    createTouchPoint,
    getTouchPointsByQuery,
} from "./touchPoint.controller";

const router = Router();

router.post("/", createTouchPoint);
router.get("/query/:queryId", getTouchPointsByQuery);

export const touchPointRouter = router;
