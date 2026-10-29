import { Request, Response } from "express";
import mongoose from "mongoose";
import { PackageBookingModel } from "./packages.model";
import { getNextSequence } from "../../../utils/counter.model";

const computePricingTotals = (data: Record<string, unknown>) => {
    const flightCost = (data.flightCost as Record<string, number>) || {};
    const visaCost = (data.visaCost as Record<string, number>) || {};
    const landPackageCost = (data.landPackageCost as Record<string, number>) || {};

    const flightTotal =
        Number(flightCost.cost || 0) + Number(flightCost.markup || 0);
    const visaTotal =
        Number(visaCost.cost || 0) + Number(visaCost.markup || 0);
    const landTotal =
        Number(landPackageCost.cost || 0) + Number(landPackageCost.markup || 0);

    flightCost.total = flightTotal;
    visaCost.total = visaTotal;
    landPackageCost.total = landTotal;

    const discount = Number(data.discount || 0);
    const totalSalesPrice = flightTotal + visaTotal + landTotal - discount;
    const advanceRequiredPercent = Number(data.advanceRequiredPercent || 10);
    const advance = Math.round((totalSalesPrice * advanceRequiredPercent) / 100);
    const totalBalance = totalSalesPrice - advance;

    return {
        flightCost,
        visaCost,
        landPackageCost,
        totalSalesPrice,
        advance,
        totalBalance,
        sellingPrice: totalSalesPrice,
        balance: totalBalance,
    };
};

const buildDayItineraries = (
    noOfDays: number,
    travelDate: string,
    location: string
) => {
    const days = [];
    const startDate = travelDate ? new Date(travelDate) : new Date();

    for (let i = 0; i < Math.max(noOfDays, 1); i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        days.push({
            dayNumber: i + 1,
            date: date.toISOString().split("T")[0],
            location: location || "",
            title: "",
            description: "",
            saveAsMaster: false,
            meals: { breakfast: false, lunch: false, dinner: false },
            itineraryType: "Flight",
            flight: null,
            transport: null,
            accommodation: null,
            sightseeing: null,
            cruise: null,
            guide: null,
            mealsItinerary: null,
            visaItinerary: null,
            others: null,
        });
    }

    return days;
};

const normalizeIncomingDays = (days: unknown) => {
    if (!Array.isArray(days)) return [];

    return days.map((day: Record<string, unknown>, index: number) => ({
        ...day,
        dayNumber: Number(day.dayNumber) || index + 1,
        date: String(day.date || ""),
        location: String(day.location || ""),
        title: String(day.title || ""),
        description:
            typeof day.description === "string" ? day.description : "",
        saveAsMaster: Boolean(day.saveAsMaster),
        meals: {
            breakfast: Boolean(
                (day.meals as { breakfast?: boolean } | undefined)?.breakfast
            ),
            lunch: Boolean(
                (day.meals as { lunch?: boolean } | undefined)?.lunch
            ),
            dinner: Boolean(
                (day.meals as { dinner?: boolean } | undefined)?.dinner
            ),
        },
        itineraryType: String(day.itineraryType || "Flight"),
    }));
};

export const createPackageBooking = async (req: Request, res: Response) => {
    try {
        const { customerDetails, goingTo, travelDate } = req.body;

        if (!customerDetails?.customerType) {
            return res.status(400).json({
                success: false,
                message: "Customer details are required",
            });
        }

        if (!goingTo || !travelDate) {
            return res.status(400).json({
                success: false,
                message: "Going To and Travel Date are required",
            });
        }

        const proposalId = await getNextSequence("packageProposalId");
        const enquiryId = await getNextSequence("packageEnquiryId");
        const noOfDays = Number(req.body.noOfDays) || 1;
        const days =
            req.body.days?.length > 0
                ? normalizeIncomingDays(req.body.days)
                : buildDayItineraries(
                      noOfDays,
                      travelDate,
                      goingTo.split("(")[0]?.trim() || goingTo
                  );

        const pricing = computePricingTotals(req.body);

        const customerName =
            customerDetails.customerType === "B2B"
                ? customerDetails.companyName
                : `${customerDetails.firstName || ""} ${customerDetails.lastName || ""}`.trim();

        const hotelStayCities = Array.isArray(req.body.hotelStayCities)
            ? req.body.hotelStayCities.map(
                  (city: {
                      cityName?: string;
                      checkIn?: string;
                      checkOut?: string;
                      nights?: number;
                  }) => ({
                      cityName: city.cityName || "",
                      checkIn: city.checkIn || "",
                      checkOut: city.checkOut || "",
                      nights: Number(city.nights) || 1,
                  })
              )
            : [];

        const result = await PackageBookingModel.create({
            ...req.body,
            proposalId,
            enquiryId,
            noOfDays,
            days,
            hotelStayCities,
            ...pricing,
            owner: req.body.owner || customerDetails.rm || customerName,
            received: req.body.received || 0,
            status: req.body.status || "draft",
            currentStep: req.body.currentStep || 1,
        });

        res.status(201).json({
            success: true,
            message: "Package booking created successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};

export const getAllPackageBookings = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit;

        const filter: Record<string, unknown> = { isDeleted: false };

        if (req.query.queryId) {
            const qid = req.query.queryId as string;
            if (mongoose.isValidObjectId(qid)) {
                filter.queryId = new mongoose.Types.ObjectId(qid);
            }
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.customerType) {
            filter["customerDetails.customerType"] = req.query.customerType;
        }

        if (req.query.search) {
            const search = req.query.search as string;
            filter.$or = [
                { goingTo: { $regex: search, $options: "i" } },
                { goingFrom: { $regex: search, $options: "i" } },
                { "customerDetails.firstName": { $regex: search, $options: "i" } },
                { "customerDetails.lastName": { $regex: search, $options: "i" } },
                { "customerDetails.companyName": { $regex: search, $options: "i" } },
                { "customerDetails.email": { $regex: search, $options: "i" } },
                { "customerDetails.mobile": { $regex: search, $options: "i" } },
            ];
        }

        if (req.query.fromDate || req.query.toDate) {
            filter.travelDate = {};
            if (req.query.fromDate) {
                (filter.travelDate as Record<string, string>).$gte =
                    req.query.fromDate as string;
            }
            if (req.query.toDate) {
                (filter.travelDate as Record<string, string>).$lte =
                    req.query.toDate as string;
            }
        }

        const [data, total] = await Promise.all([
            PackageBookingModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            PackageBookingModel.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};

export const getPackageBookingById = async (req: Request, res: Response) => {
    try {
        const result = await PackageBookingModel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Package booking not found",
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};

export const updatePackageBooking = async (req: Request, res: Response) => {
    try {
        const existing = await PackageBookingModel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Package booking not found",
            });
        }

        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.__v;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.proposalId;
        delete updateData.enquiryId;

        if (
            updateData.flightCost ||
            updateData.visaCost ||
            updateData.landPackageCost ||
            updateData.discount !== undefined
        ) {
            const merged = {
                flightCost: updateData.flightCost || existing.flightCost,
                visaCost: updateData.visaCost || existing.visaCost,
                landPackageCost:
                    updateData.landPackageCost || existing.landPackageCost,
                discount:
                    updateData.discount !== undefined
                        ? updateData.discount
                        : existing.discount,
                advanceRequiredPercent:
                    updateData.advanceRequiredPercent !== undefined
                        ? updateData.advanceRequiredPercent
                        : existing.advanceRequiredPercent,
            };
            Object.assign(updateData, computePricingTotals(merged));
        }

        const hasDaysArray = Array.isArray(updateData.days);
        if (hasDaysArray && updateData.days.length > 0) {
            updateData.days = normalizeIncomingDays(updateData.days);
        } else if (
            updateData.noOfDays &&
            updateData.travelDate &&
            (!hasDaysArray || updateData.days.length === 0)
        ) {
            updateData.days = buildDayItineraries(
                updateData.noOfDays,
                updateData.travelDate,
                (updateData.goingTo || existing.goingTo)
                    .split("(")[0]
                    ?.trim() || updateData.goingTo
            );
        }

        // Always persist hotel stay cities when provided
        if (Array.isArray(updateData.hotelStayCities)) {
            updateData.hotelStayCities = updateData.hotelStayCities.map(
                (city: {
                    cityName?: string;
                    checkIn?: string;
                    checkOut?: string;
                    nights?: number;
                }) => ({
                    cityName: city.cityName || "",
                    checkIn: city.checkIn || "",
                    checkOut: city.checkOut || "",
                    nights: Number(city.nights) || 1,
                })
            );
        }

        const result = await PackageBookingModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (
            result &&
            (result.status === "shared" ||
                result.bookingStage === "Proposal Shared") &&
            (updateData.status === "shared" ||
                updateData.bookingStage === "Proposal Shared" ||
                existing.status !== "shared")
        ) {
            const { logTouchPoint } = await import(
                "../../touch-points/touchPoint.service"
            );
            const customerName =
                result.customerDetails?.customerType === "B2B"
                    ? result.customerDetails?.companyName
                    : `${result.customerDetails?.firstName || ""} ${result.customerDetails?.lastName || ""}`.trim();
            const destination =
                result.goingTo?.split("(")[0]?.trim() || result.goingTo || "";
            const travelDate = result.travelDate
                ? new Date(result.travelDate).toLocaleDateString("en-GB")
                : "";
            const emailTitle = `${result.proposalId || result.enquiryId} - ${customerName || "Customer"} /${result.travelers || 1}/${travelDate}/${result.owner || ""}/${destination}`;

            await logTouchPoint({
                queryId: result.queryId,
                leadId: result.customerDetails?.leadId,
                type: "Email",
                title: emailTitle,
                description: "Proposal shared with customer",
                createdBy: result.owner || "",
                meta: { bookingId: result._id, proposalId: result.proposalId },
            });

            await logTouchPoint({
                queryId: result.queryId,
                leadId: result.customerDetails?.leadId,
                type: "Status",
                title: "Proposal Sent",
                description: `Proposal #${result.proposalId || result.enquiryId}`,
                createdBy: result.owner || "",
                meta: { bookingId: result._id },
            });
        }

        res.json({
            success: true,
            message: "Package booking updated successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};

export const deletePackageBooking = async (req: Request, res: Response) => {
    try {
        const result = await PackageBookingModel.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Package booking not found",
            });
        }

        res.json({
            success: true,
            message: "Package booking deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};
