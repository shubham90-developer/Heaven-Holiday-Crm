import express from "express";
import {
  createMessage,
  getMessagesByLead,
} from "./message.controller";

const router = express.Router();

router.post("/", createMessage);
router.get("/:leadId", getMessagesByLead);

export const messageRouter = router;