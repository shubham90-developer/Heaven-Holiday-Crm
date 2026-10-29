import { Request, Response } from "express";
import csv from "csv-parser";
import stream from "stream";
import B2CLead from "./b2cLead.model";
import { updateB2CLeadSchema } from "./b2cLead.validation";
import { StaffModel } from "../staff-management/staff/staff.model";

export const createB2CLeads = async (req: Request, res: Response): Promise<void> => {

    try {
        //get fields
        const { email, mobile, salutation, firstName, lastName, leadSource, leadStage } = req.body;

        //validate if fields are missing
        if (!email || !mobile || !salutation || !firstName || !lastName || !leadSource || !leadStage) {
            res.status(400).json({ message: "Please enter all the mandatory fields" });
            return;
        }

        //check if lead/customer already exists
        const leadExists = await B2CLead.findOne({
            $or: [{ email: email.toLowerCase() }, { mobile }],
        });

        if (leadExists) {
            res.status(400).json({ message: "Lead with this email & mobile already exists!" });
            return;
        }

        //create new lead
        const newLead = await B2CLead.create({
            email,
            mobile,
            salutation,
            firstName,
            lastName,
            leadSource,
            leadStage: leadStage || "New",
        });

        res.status(200).json({ message: "Lead created successfully", data: newLead });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

export const getAllB2CLeads = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        // Search
        const search = req.query.search as string;
        // Exclude archived leads
        const filter: any = {
            leadStatus: { $ne: "Archived" },
        };

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by leadStage
        if (req.query.leadStage) {
            filter.leadStage = req.query.leadStage;
        }

        // Filter by leadSource
        if (req.query.leadSource) {
            filter.leadSource = req.query.leadSource;
        }

        const total = await B2CLead.countDocuments(filter);
        const leads = await B2CLead.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: leads,
        });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const filterB2CLeads = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            mobile,
            customerName,
            email,
            leadSource,
            owner,
            status,
            search,
            page = 1,
            limit = 20,
        } = req.query;

        const filter: any = {
            isDeleted: { $ne: true },
        };

        const orConditions: any[] = [];

        // ✅ Mobile
        if (mobile) {
            filter.mobile = { $regex: mobile, $options: "i" };
        }

        // ✅ Email
        if (email) {
            filter.email = { $regex: email, $options: "i" };
        }

        // ✅ Lead Source
        if (leadSource) {
            filter.leadSource = leadSource;
        }

        // ✅ Owner
        if (owner) {
            filter.assignedTo = owner;
        }

        // ✅ Status (Active / Deactive)
        if (status) {
            filter.status = status === "1"; // assuming boolean true/false
        }

        // ✅ Customer Name (First + Last)
        if (customerName) {
            orConditions.push(
                { firstName: { $regex: customerName, $options: "i" } },
                { lastName: { $regex: customerName, $options: "i" } }
            );
        }

        // ✅ Global Text Search
        if (search) {
            orConditions.push(
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } }
            );
        }

        // ✅ Apply OR conditions safely
        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }

        // ✅ Pagination
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 20;
        const skip = (pageNumber - 1) * limitNumber;

        const total = await B2CLead.countDocuments(filter);

        const leads = await B2CLead.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            data: leads,
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const getLeadsById = async (req: Request, res: Response): Promise<void> => {

    try {

        const { id } = req.params;

        const lead = await B2CLead.findById(id);

        if (!lead) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }

        res.status(200).json({ data: lead });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

export const updateLead = async (req: Request, res: Response): Promise<void> => {
    try {

        const { id } = req.params;
        const updatedLead = await B2CLead.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!updatedLead) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }

        res.status(200).json({ message: "Leads data updated successfully", data: updatedLead });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

export const deleteLead = async (req: Request, res: Response): Promise<void> => {

    try {

        const { id } = req.params;

        const lead = await B2CLead.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!lead) {
            res.status(404).json({ message: "Lead not found" });
            return;
        }

        res.status(200).json({ message: "Leads data deleted successfully", data: lead });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

export const bulkUploadB2CLeads = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const results: any[] = [];
        const errors: any[] = [];

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        bufferStream
            .pipe(csv())
            .on("data", (data) => {
                // Basic validation
                if (!data.email || !data.mobile || !data.firstName) {
                    errors.push({
                        row: data,
                        error: "Missing required fields",
                    });
                } else {
                    results.push({
                        email: data.email,
                        mobile: data.mobile,
                        salutation: data.salutation,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        leadSource: data.leadSource,
                    });
                }
            })
            .on("end", async () => {
                try {
                    // Insert valid data
                    const inserted = await B2CLead.insertMany(results, {
                        ordered: false, // continue even if some fail
                    });

                    return res.status(200).json({
                        success: true,
                        message: "Bulk upload completed",
                        total: results.length,
                        inserted: inserted.length,
                        failed: errors.length,
                        errors,
                    });
                } catch (dbError: any) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error",
                        error: dbError.message,
                    });
                }
            });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const assignB2CLeads = async (req: Request, res: Response): Promise<void> => {
    try {
        const { leadIds, staffId } = req.body;

        if (!leadIds?.length || !staffId) {
            res.status(400).json({
                success: false,
                message: "leadIds and staffId are required",
            });
            return;
        }

        const staff = await StaffModel.findById(staffId);

        if (!staff) {
            res.status(404).json({
                success: false,
                message: "Staff not found",
            });
            return;
        }

        const ownerSnapshot = {
            _id: staff._id,
            name: `${staff.firstName} ${staff.lastName}`,
        };

        await B2CLead.updateMany(
            { _id: { $in: leadIds } },  // array, and filter/update are separate arguments
            {
                $set: {
                    assignedOwner: ownerSnapshot,
                    leadStatus: "In Process",
                },
            }
        );

        res.status(200).json({
            success: true,
            message: "Leads assigned successfully",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
}

// export const updateB2CLead = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;

//         // validate request body
//         const parsed = updateB2CLeadSchema.safeParse(req.body);
//         if (!parsed.success) {
//             res.status(400).json({
//                 success: false,
//                 message: "Validation failed",
//                 errors: parsed.error.flatten().fieldErrors,
//             });
//             return;
//         }

//         // check lead exists
//         const lead = await B2CLead.findById(id);
//         if (!lead) {
//             res.status(404).json({ success: false, message: "Lead not found" });
//             return;
//         }

//         // update lead
//         const updatedLead = await B2CLead.findByIdAndUpdate(
//             id,
//             { $set: parsed.data },
//             { new: true, runValidators: true }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Lead updated successfully",
//             data: updatedLead,
//         });

//     } catch (error) {
//         const err = error as Error;
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: err.message,
//         });
//     }
// };