import { Request, Response } from "express";
import { VisaModel } from "./visa.model";
import { createVisaSchema, updateVisaSchema } from "./visa.validation";

// CREATE
export const createVisa = async (req: Request, res: Response) => {
    try {
        const parsed = createVisaSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const visa = await VisaModel.create(parsed.data);

        res.status(201).json({
            message: "Visa created successfully",
            data: visa,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL / FILTER VISAS
export const getAllVisa = async (req: Request, res: Response) => {
    try {
        const { country, visaType, visaName } = req.query;

        const filter: any = {};

        // Apply filters only if present
        if (country) {
            filter.countriesCovered = {
                $regex: country,
                $options: "i", // case-insensitive
            };
        }

        if (visaType) {
            // adjust based on your schema
            filter.entryType = visaType;
            // OR: filter.visaType = visaType;
        }

        if (visaName) {
            filter.visaName = {
                $regex: visaName,
                $options: "i",
            };
        }

        const visas = await VisaModel.find(filter).sort({ createdAt: -1 });

        res.json({
            message: "Fetched successfully",
            count: visas.length,
            data: visas,
        });

    } catch (error: any) {
        console.error("FETCH VISA ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// GET BY ID
export const getVisaById = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const visa = await VisaModel.findById(id);

        if (!visa) {
            return res.status(404).json({ message: "Visa not found" });
        }

        res.json(visa);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE
export const updateVisa = async (req: Request, res: Response) => {
    try {
        const parsed = updateVisaSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const visa = await VisaModel.findByIdAndUpdate(
            req.params.id,
            parsed.data,
            { new: true }
        );

        if (!visa) {
            return res.status(404).json({ message: "Visa not found" });
        }

        res.json(visa);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
export const deleteVisa = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const visa = await VisaModel.findByIdAndDelete(id);

        if (!visa) {
            return res.status(404).json({ message: "Visa not found" });
        }

        res.json({ message: "Deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};