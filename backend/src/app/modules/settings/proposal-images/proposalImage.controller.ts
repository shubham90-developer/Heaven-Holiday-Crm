import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { ProposalImageModel } from "./proposalImage.model";
import {
    createProposalImageSchema,
    updateProposalImageSchema,
} from "./proposalImage.validation";
import { IProposalImageFile } from "./proposalImage.interface";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "proposal-images");
const MIME_EXT: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

const parseEnabled = (value: unknown) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value === "true" || value === "Yes";
    return true;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findDuplicate = (
    category: string,
    name: string,
    excludeId?: string
) =>
    ProposalImageModel.findOne({
        ...(excludeId ? { _id: { $ne: excludeId } } : {}),
        category,
        name: new RegExp(`^${escapeRegex(name)}$`, "i"),
        isDeleted: false,
    });

const saveFiles = async (files: Express.Multer.File[] = []): Promise<IProposalImageFile[]> => {
    if (!files.length) return [];
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const saved: IProposalImageFile[] = [];
    for (const file of files) {
        const ext = MIME_EXT[file.mimetype] || ".jpg";
        const fileName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
        await fs.writeFile(path.join(UPLOAD_DIR, fileName), file.buffer);
        saved.push({
            fileName,
            url: `/uploads/proposal-images/${fileName}`,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
        });
    }
    return saved;
};

const deleteFiles = async (images: IProposalImageFile[] = []) => {
    await Promise.all(
        images.map(async (image) => {
            try {
                await fs.unlink(path.join(UPLOAD_DIR, image.fileName));
            } catch {
                /* file may already be gone */
            }
        })
    );
};

export const createProposalImage = async (req: Request, res: Response) => {
    try {
        const parsed = createProposalImageSchema.safeParse({
            ...req.body,
            enabled: parseEnabled(req.body?.enabled),
        });
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const files = (req.files as Express.Multer.File[]) || [];
        if (!files.length) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image",
            });
        }

        const existing = await findDuplicate(parsed.data.category, parsed.data.name);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "An entry with this category and name already exists",
            });
        }

        const images = await saveFiles(files);
        const result = await ProposalImageModel.create({
            ...parsed.data,
            enabled: parseEnabled(parsed.data.enabled),
            city: parsed.data.category === "sightseeing" ? parsed.data.city || "" : "",
            images,
        });

        return res.status(201).json({
            success: true,
            message: "Proposal images saved successfully",
            data: result,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
};

export const getProposalImages = async (req: Request, res: Response) => {
    try {
        const onlyActive = req.query.active === "true";
        const category = req.query.category as string | undefined;
        const filter: Record<string, unknown> = { isDeleted: false };
        if (onlyActive) {
            filter.status = "Active";
            filter.enabled = true;
        }
        if (category === "destination" || category === "sightseeing") {
            filter.category = category;
        }

        const data = await ProposalImageModel.find(filter).sort({
            category: 1,
            name: 1,
        });

        return res.status(200).json({
            success: true,
            message: "Proposal images fetched successfully",
            data,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const getProposalImageById = async (req: Request, res: Response) => {
    try {
        const result = await ProposalImageModel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Proposal image entry not found",
            });
        }
        return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const updateProposalImage = async (req: Request, res: Response) => {
    try {
        const parsed = updateProposalImageSchema.safeParse({
            ...req.body,
            enabled:
                req.body?.enabled === undefined
                    ? undefined
                    : parseEnabled(req.body.enabled),
        });
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const current = await ProposalImageModel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!current) {
            return res.status(404).json({
                success: false,
                message: "Proposal image entry not found",
            });
        }

        if (parsed.data.name || parsed.data.category) {
            const duplicate = await findDuplicate(
                parsed.data.category || current.category,
                parsed.data.name || current.name,
                req.params.id as string
            );
            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "An entry with this category and name already exists",
                });
            }
        }

        let keepUrls: string[] = current.images.map((image) => image.url);
        if (typeof req.body.keepUrls === "string" && req.body.keepUrls) {
            try {
                const parsedKeep = JSON.parse(req.body.keepUrls);
                if (Array.isArray(parsedKeep)) keepUrls = parsedKeep;
            } catch {
                keepUrls = current.images.map((image) => image.url);
            }
        }

        const kept = current.images.filter((image) => keepUrls.includes(image.url));
        const removed = current.images.filter((image) => !keepUrls.includes(image.url));
        await deleteFiles(removed);

        const newFiles = await saveFiles((req.files as Express.Multer.File[]) || []);
        const images = [...kept, ...newFiles];
        if (!images.length) {
            return res.status(400).json({
                success: false,
                message: "Please keep or upload at least one image",
            });
        }

        const category = parsed.data.category || current.category;
        const result = await ProposalImageModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            {
                ...parsed.data,
                city: category === "sightseeing" ? parsed.data.city ?? current.city : "",
                images,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Proposal images updated successfully",
            data: result,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
};

export const deleteProposalImage = async (req: Request, res: Response) => {
    try {
        const result = await ProposalImageModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Proposal image entry not found",
            });
        }
        await deleteFiles(result.images || []);
        return res.status(200).json({
            success: true,
            message: "Proposal image entry deleted successfully",
            data: result,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};
