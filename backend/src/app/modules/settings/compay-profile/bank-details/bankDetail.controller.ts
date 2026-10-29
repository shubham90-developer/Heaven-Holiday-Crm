import { Request, Response } from "express";
import { BankDetail } from "./bankDetail.model";
import { CompanyProfile } from "../companyProfile.model";
import {
    createBankDetailValidation,
    updateBankDetailValidation
} from "./bankDetail.validation";

export const createBankDetail = async (
    req: Request,
    res: Response
): Promise<any> => {

    try {

        const {
            accountHolderName,
            accountNumber,
            ifscCode,
            accountType,
            bankName,
            branch,
            country,
            city
        } = req.body;

        //check mandatory fields
        if (
            !accountHolderName ||
            !accountNumber ||
            !ifscCode ||
            !accountType ||
            !bankName ||
            !branch ||
            !country ||
            !city
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all mandatory fields"
            });
        }

        const validatedData =
            createBankDetailValidation.parse(req.body);

        const userId = req.user.userId;

        const companyProfile =
            await CompanyProfile.findOne({
                userId
            });

        if (!companyProfile) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const bankDetail =
            await BankDetail.create({
                userId,
                companyProfileId: companyProfile._id,
                ...validatedData
            });

        return res.status(201).json({
            success: true,
            message: "Bank detail created successfully",
            data: bankDetail
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getBankDetails = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {

        const userId = req.user.userId;

        const bankDetails =
            await BankDetail.find({ userId });

        return res.status(200).json({
            success: true,
            data: bankDetails
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getBankDetailById = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {

        const bankDetail =
            await BankDetail.findById(req.params.id);

        if (!bankDetail) {
            return res.status(404).json({
                success: false,
                message: "Bank detail not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: bankDetail
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const updateBankDetail = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {

        const validatedData =
            updateBankDetailValidation.parse(req.body);

        const updatedBankDetail =
            await BankDetail.findByIdAndUpdate(
                req.params.id,
                validatedData,
                { new: true }
            );

        if (!updatedBankDetail) {
            return res.status(404).json({
                success: false,
                message: "Bank detail not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Bank detail updated successfully",
            data: updatedBankDetail
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteBankDetail = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {

        const deletedBankDetail =
            await BankDetail.findByIdAndDelete(
                req.params.id
            );

        if (!deletedBankDetail) {
            return res.status(404).json({
                success: false,
                message: "Bank detail not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Bank detail deleted successfully"
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const setActiveBankDetail = async (
    req: Request,
    res: Response
): Promise<any> => {
    try {

        const userId = req.user.userId;

        await BankDetail.updateMany(
            { userId },
            { isActive: false }
        );

        const activeBankDetail =
            await BankDetail.findByIdAndUpdate(
                req.params.id,
                { isActive: true },
                { new: true }
            );

        return res.status(200).json({
            success: true,
            message: "Active bank updated successfully",
            data: activeBankDetail
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};