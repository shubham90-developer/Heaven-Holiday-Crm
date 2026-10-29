import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = multer.memoryStorage();

export const proposalImageUpload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {
        if (ALLOWED.has(file.mimetype)) {
            cb(null, true);
            return;
        }
        cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    },
});
