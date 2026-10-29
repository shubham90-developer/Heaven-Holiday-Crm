import { Request, Response } from "express";
import { GuideModel } from "./guide.model";
import { createGuideSchema, updateGuideSchema } from "./guide.validation";

// CREATE
export const createGuide = async (req: Request, res: Response) => {
    try {
        const parsed = createGuideSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const guide = await GuideModel.create(parsed.data);

        return res.status(201).json({
            message: "Guide created successfully",
            data: guide,
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// GET ALL
export const getAllGuides = async (req: Request, res: Response) => {
    try {
        const { guideName, mobileNumber, email } = req.query;

        let filter: any = {};

        // Apply only UI filters
        if (guideName) {
            filter.guideName = { $regex: guideName, $options: "i" };
        }

        if (mobileNumber) {
            filter.mobileNumber = { $regex: mobileNumber, $options: "i" };
        }

        if (email) {
            filter.email = { $regex: email, $options: "i" };
        }

        // Fetch filtered OR all
        const guides = await GuideModel.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Fetched successfully",
            count: guides.length,
            data: guides,
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// GET BY ID
export const getGuideById = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const guide = await GuideModel.findById(id);

        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }

        res.json(guide);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE
export const updateGuide = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const parsed = updateGuideSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const guide = await GuideModel.findByIdAndUpdate(
            id,
            parsed.data,
            { new: true }
        );

        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }

        res.json(guide);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
export const deleteGuide = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const guide = await GuideModel.findByIdAndDelete(id);

        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }

        res.json({ message: "Deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};