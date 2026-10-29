import express from "express";
import {
    AddEmailTemplate, getAllEmailTemplates, getEmailTemplateById,
    updateEmailTemplate, deleteEmailTemplateById
} from "./emailTemplate.controller";
const router = express.Router();

router.post("/", AddEmailTemplate);
router.get("/", getAllEmailTemplates);
router.get("/:id", getEmailTemplateById);
router.put("/:id", updateEmailTemplate);
router.patch("/:id", deleteEmailTemplateById);

export const emailTemplateRouter = router;