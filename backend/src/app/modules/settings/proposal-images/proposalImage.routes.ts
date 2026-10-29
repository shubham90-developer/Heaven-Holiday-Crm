import { Request, Response, NextFunction, Router } from "express";
import multer from "multer";
import { proposalImageUpload } from "../../../middleware/proposalImageUpload";
import {
    createProposalImage,
    getProposalImages,
    getProposalImageById,
    updateProposalImage,
    deleteProposalImage,
} from "./proposalImage.controller";

const router = Router();

router.post("/", proposalImageUpload.array("images", 15), createProposalImage);
router.get("/", getProposalImages);
router.get("/:id", getProposalImageById);
router.put("/:id", proposalImageUpload.array("images", 15), updateProposalImage);
router.patch("/:id", deleteProposalImage);

router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "Each image must be 2 MB or smaller",
        });
    }
    if (err?.message) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Failed to upload image",
    });
});

export const proposalImageRouter = router;
