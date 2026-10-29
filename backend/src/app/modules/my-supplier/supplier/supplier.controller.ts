import { Request, Response } from "express";
import Supplier from "./supplier.model";

// CREATE
export const createSupplier = async (req: Request, res: Response) => {
    try {

        const { companyName, currencyType, gstRegister, panNumber, salutation,
            firstName, lastName, designation, email, mobileNumber, addressLine1,
            country, state, city, comments, category, services, destinationOffered
        } = req.body;

        if (!companyName || !currencyType || !gstRegister || !panNumber || !salutation ||
            !firstName || !lastName || !designation || !email || !mobileNumber || !addressLine1 ||
            !country || !state || !city || !comments || !category || !services || !destinationOffered
        ) {

            res.status(400).json({
                success: false,
                message: "Please enter all the required fields"
            });
            return;
        }

        const supplier = await Supplier.create({
            companyName,
            currencyType,
            gstRegister,
            panNumber,
            salutation,
            firstName,
            lastName,
            designation,
            email,
            mobileNumber,
            addressLine1,
            country,
            state,
            city,
            comments,
            category,
            services,
            destinationOffered
        });

        res.status(201).json({
            success: true,
            message: "supplier created successfully",
            data: supplier
        });

    } catch (err) {
        res.status(500).json({ message: "Error creating supplier", err });
    }
};

export const createQuickSupplier = async (req: Request, res: Response) => {
    try {
        const {
            companyName,
            salutation,
            firstName,
            lastName,
            email,
            mobileNumber,
            country,
            state,
            city,
            services,
            category,
            destinationOffered,
        } = req.body;

        if (!companyName || !firstName || !email || !mobileNumber || !country || !city || !services) {
            res.status(400).json({
                success: false,
                message: "Company name, first name, email, mobile, country, city and services are required",
            });
            return;
        }

        const existing = await Supplier.findOne({
            email: String(email).trim().toLowerCase(),
            isDeleted: { $ne: true },
        });

        if (existing) {
            res.status(409).json({
                success: false,
                message: "Supplier with this email already exists",
            });
            return;
        }

        const supplier = await Supplier.create({
            companyName: String(companyName).trim(),
            currencyType: "INR",
            gstRegister: false,
            panNumber: "NA",
            salutation: salutation || "Mr.",
            firstName: String(firstName).trim(),
            lastName: String(lastName || "").trim() || "-",
            designation: "Contact",
            email: String(email).trim().toLowerCase(),
            mobileNumber: String(mobileNumber).trim(),
            addressLine1: String(city).trim(),
            country: String(country).trim(),
            state: String(state || "").trim(),
            city: String(city).trim(),
            comments: "Added from enquiry supplier package",
            category: String(category || "Packages").trim(),
            services: String(services).trim(),
            destinationOffered: Array.isArray(destinationOffered)
                ? destinationOffered
                : destinationOffered
                    ? [destinationOffered]
                    : [],
        });

        res.status(201).json({
            success: true,
            message: "Supplier added successfully",
            data: supplier,
        });
    } catch (err: any) {
        if (err?.code === 11000) {
            res.status(409).json({
                success: false,
                message: "Supplier with this email already exists",
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Error creating supplier",
            err,
        });
    }
};

// GET ALL
export const getSuppliers = async (req: Request, res: Response) => {
    try {
        const suppliers = await Supplier.find({ isDeleted: false });  // ← filter out deleted

        res.status(200).json({
            success: true,
            message: "Suppliers fetched successfully",
            data: suppliers
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching suppliers" });
    }
};

// GET ONE
export const getSupplierById = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const supplier = await Supplier.findById(id);

        res.status(200).json({
            success: true,
            message: "supplier fetched successfully",
            data: supplier
        });

    } catch {
        res.status(500).json({ message: "Error fetching supplier" });
    }
};

// UPDATE
export const updateSupplier = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const updated = await Supplier.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "supplier updated successfully",
            data: updated
        });

    } catch {
        res.status(500).json({ message: "Error updating supplier" });
    }
};

// DELETE
export const deleteSupplier = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updated = await Supplier.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },  // ← soft delete
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Supplier deleted successfully",
            data: updated
        });

    } catch (err) {
        res.status(500).json({ message: "Error deleting supplier" });
    }
};