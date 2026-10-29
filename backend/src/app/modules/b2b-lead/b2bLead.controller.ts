import { Request, Response } from "express";
import B2BLead from "./b2bLead.model";
import csv from "csv-parser";
import stream from "stream";
import { StaffModel } from "../staff-management/staff/staff.model";

//Create B2B Lead (POST)
// export const createB2BLead = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const leadData = req.body;

//         // List of required fields (except 'remarks')
//         const requiredFields = [
//             "type",
//             "companyName",
//             "email",
//             "salutation",
//             "firstName",
//             "lastName",
//             "mobile",
//             "rm",
//             "leadSource",
//             "country",
//             "state",
//             "city",
//             "area",
//             "pincode",
//             "address",
//         ];

//         // Check each required field
//         const missingFields = requiredFields.filter(
//             (field) => !leadData[field] || leadData[field].toString().trim() === ""
//         );

//         if (missingFields.length > 0) {
//             res.status(400).json({
//                 success: false,
//                 message: `Missing required field(s): ${missingFields.join(", ")}`,
//             });
//             return;
//         }

//         const newLead = await B2BLead.create(leadData);
//         res.status(203).json({
//             message: "B2B lead created successfully",
//             data: newLead
//         })

//     } catch (error) {
//         const err = error as Error;
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: err.message,
//         });
//     }
// }
export const createB2BLead = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            type, companyName, email, salutation,
            firstName, lastName, mobile, rm, leadSource,
            address, country, state, city, area, pincode,
        } = req.body;

        const requiredFields = { type, companyName, email, salutation, firstName, lastName, mobile, rm, leadSource, address, country, state, city, area, pincode };

        const missingFields = Object.keys(requiredFields).filter(k => !requiredFields[k as keyof typeof requiredFields]?.toString().trim());

        if (missingFields.length) {
            res.status(400).json({ success: false, message: `Missing required field(s): ${missingFields.join(", ")}` });
            return;
        }

        const newLead = await B2BLead.create({
            type, companyName, email, salutation, firstName, lastName, mobile, rm, leadSource,
            address: {
                addressLine: address,   // "WTC, Tower - 1, SBI Bank"
                country,
                state,
                city,
                area,
                pincode,
            },
        });

        res.status(201).json({ success: true, message: "B2B lead created successfully", data: newLead });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: (error as Error).message });
    }
};

//Fetch all B2B Leads (GET)
export const getAllB2BLeads = async (req: Request, res: Response): Promise<void> => {

    try {
        const leads = await B2BLead.find({  
            isDeleted: false, }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: leads });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

// Filter B2B Leads
export const filterB2BLeads = async (req: Request, res: Response) => {
    try {
        const {
            mobile,
            firstName,
            lastName,
            customerName,
            companyName,
            email,
            leadSource,
            rm,
            textSearch,
            status,
        } = req.query;

        const filter: any = { isDeleted: false };

        // Exact matches
        if (mobile) filter.mobile = mobile;
        if (companyName) filter.companyName = { $regex: companyName as string, $options: "i" };
        if (email) filter.email = { $regex: email as string, $options: "i" };
        if (leadSource) filter.leadSource = leadSource;
        if (rm) filter.rm = rm;
        if (status) filter.status = status;

        // Name filter: either firstName + lastName or full name in one field
        if (firstName || lastName || customerName) {
            const nameRegex = new RegExp(
                (customerName?.toString().trim() || `${firstName?.toString().trim() || ""} ${lastName?.toString().trim() || ""}`).trim(),
                "i"
            );
            filter.$or = [
                { firstName: { $regex: nameRegex } },
                { lastName: { $regex: nameRegex } },
            ];
        }

        // Text search across multiple fields
        if (textSearch) {
            const searchRegex = new RegExp(textSearch as string, "i");
            filter.$or = [
                ...(filter.$or || []),
                { firstName: { $regex: searchRegex } },
                { lastName: { $regex: searchRegex } },
                { companyName: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { mobile: { $regex: searchRegex } },
            ];
        }

        const leads = await B2BLead.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: leads });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

//Fetch a B2B Lead (GET)
export const getB2BLeadById = async (req: Request, res: Response) => {

    try {
        const lead = await B2BLead.findOne({ _id: req.params.id, isDeleted: false });

        if (!lead) {
            res.status(404).json({ success: false, message: "Lead not found" });
            return;
        }

        res.status(200).json({ success: true, data: lead });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

//Update a B2B Lead completely (PUT)
export const updateB2BLead = async (req: Request, res: Response) => {

    try {
        const updatedLead = await B2BLead.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedLead) return res.status(404).json({ success: false, message: "Lead not found" });

        return res.status(200).json({
            success: true,
            message: "B2B updated successfully",
            data: updatedLead
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

// Soft delete a B2B Lead (set isDeleted = true)
export const deleteB2BLead = async (req: Request, res: Response) => {
    try {

        const deletedLead = await B2BLead.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!deletedLead) {
            return res.status(404).json({ success: false, message: "Lead not found" });
        }

        res.status(200).json({ success: true, message: "Lead deleted successfully", data: deletedLead });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};

export const assignB2BLeads = async (req: Request, res: Response): Promise<void> => {
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

        await B2BLead.updateMany(
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

export const bulkUploadB2BLeads = async (req: Request, res: Response) => {
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
                // ✅ Required field validation (based on your schema)
                if (
                    !data.type ||
                    !data.companyName ||
                    !data.email ||
                    !data.salutation ||
                    !data.firstName ||
                    !data.lastName ||
                    !data.mobile ||
                    !data.rm ||
                    !data.leadSource ||
                    !data.country ||
                    !data.state ||
                    !data.city ||
                    !data.area ||
                    !data.pincode ||
                    !data.address
                ) {
                    errors.push({
                        row: data,
                        error: "Missing required fields",
                    });
                    return;
                }

                // ✅ Enum validation
                const type = data.type.toLowerCase();
                const validTypes = ["agency", "corporate"];

                const validSalutations = ["Mr.", "Mrs.", "Ms.", "Miss.", "Dr.", "Prof."];

                if (!validTypes.includes(type)) {
                    errors.push({
                        row: data,
                        error: "Invalid type (must be agency or corporate)",
                    });
                    return;
                }

                if (!validSalutations.includes(data.salutation)) {
                    errors.push({
                        row: data,
                        error: "Invalid salutation",
                    });
                    return;
                }

                // ✅ Push valid data
                results.push({
                    type,
                    companyName: data.companyName,
                    email: data.email,
                    salutation: data.salutation,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    mobile: data.mobile,
                    rm: data.rm,
                    leadSource: data.leadSource,
                    country: data.country,
                    state: data.state,
                    city: data.city,
                    area: data.area,
                    pincode: data.pincode,
                    address: data.address,
                    remarks: data.remarks || "",
                });
            })
            .on("end", async () => {
                try {
                    const inserted = await B2BLead.insertMany(results, {
                        ordered: false, // ✅ continue even if some fail
                    });

                    return res.status(200).json({
                        success: true,
                        message: "Bulk upload completed",
                        total: results.length + errors.length,
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