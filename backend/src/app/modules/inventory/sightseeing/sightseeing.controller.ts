import { Request, Response } from "express";
import Sightseeing from "./sightseeing.model";
import { sightseeingSchema } from "./sightseeing.validation";

export const createSightseeing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = sightseeingSchema.parse(req.body);

    const sightseeing = await Sightseeing.create(validatedData);

    res.status(201).json({
      success: true,
      message: "Sightseeing created successfully",
      data: sightseeing,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors || error.message,
    });
  }
};

export const getSightseeing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sightseeingName, country, city, category } = req.query;

    let query: any = {};

    if (sightseeingName) {
      query.sightseeingName = {
        $regex: sightseeingName,
        $options: "i",
      };
    }

    if (country) {
      query.country = country;
    }

    if (city) {
      query.city = city;
    }

    if (category) {
      query.category = category;
    }

    const data = await Sightseeing.find(query);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSightseeingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await Sightseeing.findById(req.params.id);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSightseeing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = sightseeingSchema.parse(req.body);

    const data = await Sightseeing.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors || error.message,
    });
  }
};

export const deleteSightseeing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await Sightseeing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};