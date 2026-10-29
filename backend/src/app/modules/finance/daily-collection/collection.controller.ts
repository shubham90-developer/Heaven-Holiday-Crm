import { Request, Response } from "express";
import mongoose from "mongoose";
import { DailyCollectionModel } from "./collection.model";
import { PackageBookingModel } from "../../booking/packages/packages.model";
import Query from "../../queries/queries.model";
import { getNextSequence } from "../../../utils/counter.model";

const getCustomerName = (booking: {
    customerDetails?: {
        customerType?: string;
        companyName?: string;
        firstName?: string;
        lastName?: string;
        salutation?: string;
    };
}) => {
    const c = booking.customerDetails || {};
    if (c.customerType === "B2B") {
        return c.companyName || "Agency";
    }
    return `${c.salutation || ""} ${c.firstName || ""} ${c.lastName || ""}`.trim() || "Customer";
};

const syncBookingPaymentStatus = async (bookingId: string) => {
    const booking = await PackageBookingModel.findById(bookingId);
    if (!booking || booking.isDeleted) return null;

    const packageCost = Number(booking.sellingPrice || booking.totalSalesPrice || 0);
    const received = Number(booking.received || 0);
    const balance = Math.max(packageCost - received, 0);

    let paymentStatus: "none" | "pending" | "partial" | "paid" = "none";

    const pendingCount = await DailyCollectionModel.countDocuments({
        bookingId,
        isDeleted: false,
        status: "pending",
    });

    if (received >= packageCost && packageCost > 0) {
        paymentStatus = "paid";
    } else if (received > 0) {
        paymentStatus = "partial";
    } else if (pendingCount > 0) {
        paymentStatus = "pending";
    }

    const updates: Record<string, unknown> = {
        received,
        balance,
        paymentStatus,
    };

    const isFullyPaid = packageCost > 0 && received >= packageCost;

    if (isFullyPaid) {
        updates.status = "confirmed";
        updates.bookingStage = "Confirmed";
    }

    const updatedBooking = await PackageBookingModel.findByIdAndUpdate(
        bookingId,
        updates,
        { new: true }
    );

    if (isFullyPaid && booking.queryId) {
        await Query.findByIdAndUpdate(booking.queryId, {
            stage: "confirmed",
        });
    }

    return updatedBooking;
};

export const createCollection = async (req: Request, res: Response) => {
    try {
        const {
            bookingId,
            amount,
            mode,
            paymentChannel = "offline",
            reference,
            transactionNo,
            remarks,
            particulars,
            receivedBy,
            collectionDate,
        } = req.body;

        if (!bookingId || !mongoose.isValidObjectId(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Valid bookingId is required",
            });
        }

        const paymentAmount = Number(amount);
        if (!paymentAmount || paymentAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid payment amount is required",
            });
        }

        if (!mode) {
            return res.status(400).json({
                success: false,
                message: "Payment mode is required",
            });
        }

        const booking = await PackageBookingModel.findOne({
            _id: bookingId,
            isDeleted: false,
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Package booking not found",
            });
        }

        const packageCost = Number(booking.sellingPrice || booking.totalSalesPrice || 0);
        const alreadyReceived = Number(booking.received || 0);
        const pendingAgg = await DailyCollectionModel.aggregate([
            {
                $match: {
                    bookingId: booking._id,
                    isDeleted: false,
                    status: "pending",
                },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const pendingAmount = Number(pendingAgg[0]?.total || 0);
        const outstanding = Math.max(packageCost - alreadyReceived - pendingAmount, 0);

        if (packageCost > 0 && paymentAmount > outstanding) {
            return res.status(400).json({
                success: false,
                message: `Amount exceeds available outstanding balance of ${outstanding}`,
            });
        }

        const receiptNo = await getNextSequence("dailyCollectionReceiptNo");
        const customerName = getCustomerName(booking);

        const collection = await DailyCollectionModel.create({
            receiptNo,
            bookingId: booking._id,
            queryId: booking.queryId || undefined,
            proposalId: booking.proposalId,
            enquiryId: booking.enquiryId,
            customerName,
            customerEmail: booking.customerDetails?.email || "",
            customerMobile: booking.customerDetails?.mobile || "",
            amount: paymentAmount,
            currency: booking.currency || "INR",
            mode,
            paymentChannel:
                paymentChannel === "online" || String(mode).startsWith("Online")
                    ? "online"
                    : "offline",
            reference: reference || "",
            transactionNo: transactionNo || "",
            remarks: remarks || "",
            particulars: particulars || "Package Booking Payment",
            owner: booking.owner || "",
            status: "pending",
            receivedBy: receivedBy || "",
            bookingDate: booking.travelDate || "",
            collectionDate: collectionDate ? new Date(collectionDate) : new Date(),
        });

        await PackageBookingModel.findByIdAndUpdate(bookingId, {
            paymentStatus: alreadyReceived > 0 ? "partial" : "pending",
            paymentMode: mode,
            bookingStage:
                booking.bookingStage === "Proposal" ||
                booking.bookingStage === "Proposal Shared"
                    ? "Booking Requested"
                    : booking.bookingStage,
        });

        if (booking.queryId) {
            const query = await Query.findById(booking.queryId);
            if (
                query &&
                !["confirmed", "verbal_confirmed", "Confirmed - Booking Request", "Verbal Confirmed"].includes(
                    query.stage || ""
                )
            ) {
                query.stage = "booking_requested";
                await query.save();
            }
        }

        res.status(201).json({
            success: true,
            message: "Offline payment recorded. Pending finance approval.",
            data: collection,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};

export const getCollections = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = (page - 1) * limit;

        const filter: Record<string, unknown> = { isDeleted: false };

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.paymentChannel) {
            filter.paymentChannel = req.query.paymentChannel;
        }

        if (req.query.mode) {
            filter.mode = req.query.mode;
        }

        if (req.query.bookingId && mongoose.isValidObjectId(req.query.bookingId as string)) {
            filter.bookingId = new mongoose.Types.ObjectId(req.query.bookingId as string);
        }

        if (req.query.fromDate || req.query.toDate) {
            const dateFilter: Record<string, Date> = {};
            if (req.query.fromDate) {
                const from = new Date(req.query.fromDate as string);
                from.setHours(0, 0, 0, 0);
                dateFilter.$gte = from;
            }
            if (req.query.toDate) {
                const to = new Date(req.query.toDate as string);
                to.setHours(23, 59, 59, 999);
                dateFilter.$lte = to;
            }
            filter.collectionDate = dateFilter;
        }

        if (req.query.search) {
            const search = req.query.search as string;
            filter.$or = [
                { customerName: { $regex: search, $options: "i" } },
                { customerEmail: { $regex: search, $options: "i" } },
                { customerMobile: { $regex: search, $options: "i" } },
                { owner: { $regex: search, $options: "i" } },
                { receivedBy: { $regex: search, $options: "i" } },
                { reference: { $regex: search, $options: "i" } },
                { transactionNo: { $regex: search, $options: "i" } },
            ];

            if (!Number.isNaN(Number(search))) {
                (filter.$or as unknown[]).push({ receiptNo: Number(search) });
                (filter.$or as unknown[]).push({ proposalId: Number(search) });
                (filter.$or as unknown[]).push({ enquiryId: Number(search) });
            }
        }

        const [data, total, summaryAgg] = await Promise.all([
            DailyCollectionModel.find(filter)
                .populate("bookingId", "proposalId enquiryId goingTo status paymentStatus sellingPrice received balance")
                .sort({ collectionDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            DailyCollectionModel.countDocuments(filter),
            DailyCollectionModel.aggregate([
                { $match: { ...filter, status: "approved" } },
                {
                    $group: {
                        _id: "$paymentChannel",
                        total: { $sum: "$amount" },
                    },
                },
            ]),
        ]);

        const summary = {
            totalCollection: 0,
            online: 0,
            offline: 0,
        };

        for (const row of summaryAgg) {
            summary.totalCollection += row.total || 0;
            if (row._id === "online") summary.online = row.total || 0;
            if (row._id === "offline") summary.offline = row.total || 0;
        }

        res.json({
            success: true,
            data,
            summary,
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

export const approveCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { approvedBy } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid collection id",
            });
        }

        const collection = await DailyCollectionModel.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found",
            });
        }

        if (collection.status === "approved") {
            return res.status(400).json({
                success: false,
                message: "Payment already approved",
            });
        }

        if (collection.status === "rejected") {
            return res.status(400).json({
                success: false,
                message: "Rejected payment cannot be approved",
            });
        }

        const booking = await PackageBookingModel.findOne({
            _id: collection.bookingId,
            isDeleted: false,
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Linked package booking not found",
            });
        }

        collection.status = "approved";
        collection.approvedBy = approvedBy || "Finance";
        collection.approvedAt = new Date();
        await collection.save();

        const packageCost = Number(booking.sellingPrice || booking.totalSalesPrice || 0);
        const newReceived = Number(booking.received || 0) + Number(collection.amount || 0);
        const newBalance = Math.max(packageCost - newReceived, 0);

        booking.received = newReceived;
        booking.balance = newBalance;
        await booking.save();

        const updatedBooking = await syncBookingPaymentStatus(String(booking._id));

        res.json({
            success: true,
            message:
                updatedBooking?.paymentStatus === "paid"
                    ? "Payment approved. Booking fully paid and query confirmed."
                    : "Payment approved successfully",
            data: {
                collection,
                booking: updatedBooking,
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

export const rejectCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rejectedBy, rejectionReason } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid collection id",
            });
        }

        const collection = await DailyCollectionModel.findOne({
            _id: id,
            isDeleted: false,
        });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: "Collection not found",
            });
        }

        if (collection.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Only pending payments can be rejected (current: ${collection.status})`,
            });
        }

        collection.status = "rejected";
        collection.rejectedBy = rejectedBy || "Finance";
        collection.rejectedAt = new Date();
        collection.rejectionReason = rejectionReason || "";
        await collection.save();

        await syncBookingPaymentStatus(String(collection.bookingId));

        res.json({
            success: true,
            message: "Payment rejected",
            data: collection,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: (error as Error).message,
        });
    }
};
