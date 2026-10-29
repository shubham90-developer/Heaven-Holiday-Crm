import { Request, Response } from "express";
import { Package } from "./package.model";

export const createPackage = async (
    req: Request,
    res: Response
) => {
    const {
        packageName,
        packageMode,
        packageType,
        startingFrom,
        endCity,
        destinationCovered,
        supplier,
        categories,
        theme,
        inclusives,
        specification,
        overview
    } = req.body;

    if (
        !packageName ||
        !packageMode ||
        !packageType ||
        !startingFrom ||
        !endCity ||
        !destinationCovered ||
        !supplier ||
        !categories?.length ||
        !theme ||
        !inclusives ||
        !specification ||
        !overview
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all required fields",
        });
    }
    const result = await Package.create(req.body);

    res.status(201).json({
        success: true,
        message: "Package created successfully",
        data: result,
    });
};

export const getAllPackages = async (
    req: Request,
    res: Response
) => {
    const result = await Package.find();

    res.json({
        success: true,
        data: result,
    });
};

export const getSinglePackage = async (
    req: Request,
    res: Response
) => {
    const result = await Package.findById(req.params.id);

    res.json({
        success: true,
        data: result,
    });
};

export const updatePackage = async (
    req: Request,
    res: Response
) => {
    const result = await Package.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json({
        success: true,
        data: result,
    });
};

export const deletePackage = async (
    req: Request,
    res: Response
) => {
    await Package.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: "Deleted successfully",
    });
};