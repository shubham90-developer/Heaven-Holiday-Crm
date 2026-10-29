import express from "express";
import {
    createPackageBooking,
    getAllPackageBookings,
    getPackageBookingById,
    updatePackageBooking,
    deletePackageBooking,
} from "./packages.controller";

const router = express.Router();

router.post("/", createPackageBooking);
router.get("/", getAllPackageBookings);
router.get("/:id", getPackageBookingById);
router.patch("/:id", updatePackageBooking);
router.delete("/:id", deletePackageBooking);

export const packageBookingRouter = router;
