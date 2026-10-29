import { Router } from "express";
import {
    createTheme,
    getThemes,
    getThemeById,
    updateTheme,
    deleteTheme,
} from "./theme.controller";

const router = Router();

router.post("/", createTheme);
router.get("/", getThemes);
router.get("/:id", getThemeById);
router.put("/:id", updateTheme);
router.patch("/:id", deleteTheme);

export const themeRouter = router;
