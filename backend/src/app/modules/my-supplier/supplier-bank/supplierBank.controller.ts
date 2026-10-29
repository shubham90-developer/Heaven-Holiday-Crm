import SupplierBank from "./supplierBank.model";
import { Request, Response } from "express";

// CREATE
// export const createBank = async (req: Request, res: Response) => {
//     try {
//         // if (!req.query.id || typeof req.query.id !== "string") {
//         //     return res.status(400).json({
//         //         success: false,
//         //         message: "Valid supplier id is required"
//         //     });
//         // }

//         // const supplierId = req.query.id;

//         const {
//             accountName, accountNumber, bankName,
//             ifscCode, swiftCode, isPrimary,
//             country, city, comments
//         } = req.body;

//         if (!accountName || !accountNumber || isPrimary === undefined) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Required fields missing"
//             });
//         }

//         // ensure only one primary bank
//         if (isPrimary) {
//             await SupplierBank.updateMany(
//                 { supplierId },
//                 { isPrimary: false }
//             );
//         }

//         const bank = await SupplierBank.create({
//             // supplierId,
//             accountName,
//             accountNumber,
//             bankName,
//             ifscCode,
//             swiftCode,
//             isPrimary,
//             country,
//             city,
//             comments
//         });

//         res.status(201).json({
//             success: true,
//             message: "Bank created successfully",
//             data: bank
//         });

//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: "Error creating bank",
//             error: err instanceof Error ? err.message : err
//         });
//     }
// };
export const createBank = async (req: Request, res: Response) => {
    try {
        const {
            accountName,
            accountNumber,
            bankName,
            ifscCode,
            swiftCode,
            isPrimary = false,
            country,
            city,
            comments
        } = req.body;

        // Validation
        if (!accountName || !accountNumber) {
            return res.status(400).json({
                success: false,
                message: "Account name and account number are required"
            });
        }

        // If this is primary → remove primary from ALL others
        if (isPrimary) {
            await SupplierBank.updateMany(
                {},
                { $set: { isPrimary: false } }
            );
        }

        const bank = await SupplierBank.create({
            accountName,
            accountNumber,
            bankName,
            ifscCode,
            swiftCode,
            isPrimary,
            country,
            city,
            comments
        });

        res.status(201).json({
            success: true,
            message: "Bank created successfully",
            data: bank
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating bank",
            error: err instanceof Error ? err.message : err
        });
    }
};

export const getSupplierBanks = async (req: Request, res: Response) => {

    try {

        const supplierBanks = await SupplierBank.find();

        res.status(200).json({
            success: true,
            message: "Supplier Banks Data fetched",
            data: supplierBanks
        })

    } catch (error) {

        res.status(500).json({ message: "Error fetching banks" });
    }
}
// GET BY SUPPLIER
export const getBanksBySupplier = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const banks = await SupplierBank.find({
            supplierId: id,
        });

        res.status(200).json({
            success: true,
            message: "Supplier Bank details fetched successfully",
            data: banks
        });

    } catch {
        res.status(500).json({ message: "Error fetching banks" });
    }
};

export const deleteBank = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await SupplierBank.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Bank not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Bank deleted successfully",
            data: deleted
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting bank",
            error: err instanceof Error ? err.message : err
        });
    }
};