import SupplierContact from "./supplierContact.model";
import { Request, Response } from "express";

// CREATE
export const createContact = async (req: Request, res: Response) => {
    try {

        // if (!req.query.id || typeof req.query.id !== "string") {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Valid supplier id is required"
        //     });
        // }

        // const supplierId = req.query.id;

        const {
            firstName, lastName, designation, department,
            email, mobileNumber, salutation, country, state, city, comments, destinations
        } = req.body;

        if (!firstName || !lastName || !email || !mobileNumber) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        const contact = await SupplierContact.create({
            // supplierId,
            firstName,
            lastName,
            designation,
            department,
            email,
            mobileNumber,
            salutation,
            country,
            state,
            city,
            comments,
            destinations
        });

        res.status(201).json({
            success: true,
            message: "Supplier contact created",
            data: contact
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating contact",
            error: err instanceof Error ? err.message : err
        });
    }
};

export const getSupplierContacts = async (req: Request, res: Response) => {

    try {

        const supplierContacts = await SupplierContact.find();

        res.status(200).json({
            success: true,
            message: "Supplier Contacts Data fetched",
            data: supplierContacts
        })

    } catch (error) {

        res.status(500).json({ message: "Error fetching banks" });
    }
}
// GET BY SUPPLIER
export const getContactsBySupplier = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const contacts = await SupplierContact.find({
            supplierId: id,
        });

        res.status(200).json({
            success: true,
            message: "Supplier fetched successfully",
            data: contacts
        });

    } catch {
        res.status(500).json({ message: "Error fetching contacts" });
    }
};

