import { Request, Response } from "express";
import Contact from "./contacts.model";

// CREATE CONTACT
export const createContact = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {

        const {
            leadId,
            leadModel,
            relation,
            firstName,
            mobileNumber,
            country,
            city,
            visaCountry,
        } = req.body;

        // REQUIRED FIELD VALIDATION
        if (
            !leadId ||
            !leadModel ||
            !relation ||
            !firstName ||
            !mobileNumber ||
            !country ||
            !city
        ) {
            return res.status(404).json({
                success: false,
                message: "Please enter all required fields",
            });
        }

        // VISA COUNTRY VALIDATION
        if (
            visaCountry &&
            Array.isArray(visaCountry)
        ) {

            for (const visa of visaCountry) {

                if (
                    !visa.country ||
                    !visa.date
                ) {
                    return res.status(404).json({
                        success: false,
                        message:
                            "Please fill all visa country fields",
                    });
                }
            }
        }

        const contact = await Contact.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: contact,
        });
    } catch (error: unknown) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};

// GET ALL CONTACTS OF LEAD
export const getLeadContacts = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { leadId } = req.params;

        const contacts = await Contact.find({
            leadId,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error: unknown) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};



// GET SINGLE CONTACT
export const getSingleContact = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const contact = await Contact.findById(
            req.params.contactId
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (error: unknown) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};



// UPDATE CONTACT
export const updateContact = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const contact =
            await Contact.findByIdAndUpdate(
                req.params.contactId,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Contact updated successfully",

            data: contact,
        });
    } catch (error: unknown) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};



// DELETE CONTACT
export const deleteContact = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const contact =
            await Contact.findByIdAndDelete(
                req.params.contactId
            );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Contact deleted successfully",
        });
    } catch (error: unknown) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};