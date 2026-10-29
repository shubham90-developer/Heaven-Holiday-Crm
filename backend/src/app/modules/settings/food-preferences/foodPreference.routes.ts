import { Router } from "express";
import {
    createFoodPreference,
    getFoodPreferences,
    getFoodPreferenceById,
    updateFoodPreference,
    deleteFoodPreference,
} from "./foodPreference.controller";

const router = Router();

router.post("/", createFoodPreference);
router.get("/", getFoodPreferences);
router.get("/:id", getFoodPreferenceById);
router.put("/:id", updateFoodPreference);
router.patch("/:id", deleteFoodPreference);

export const foodPreferenceRouter = router;
