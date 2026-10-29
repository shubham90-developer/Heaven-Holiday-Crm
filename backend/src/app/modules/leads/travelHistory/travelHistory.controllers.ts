// ======================================================
// FILE: controllers/travelHistory.controller.ts
// ======================================================
import mongoose from "mongoose";
import {
    Request,
    Response
} from "express";

import TravelHistory from
    "./travelHistory.model";

import {
    createTravelHistoryValidation
} from "./travelHistory.validation";
import B2CLead from
    "../../b2c-lead/b2cLead.model";
import B2BLead from
    "../../b2b-lead/b2bLead.model";


// CREATE
export const createTravelHistory = async (req: Request, res: Response) => {

    try {

        const validatedData =
            createTravelHistoryValidation.parse(
                req.body
            );

        const {
            leadId,
        } = validatedData;


        // VALIDATE OBJECT ID
        if (
            !mongoose.isValidObjectId(
                leadId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid leadId",
            });
        }


        // FIND LEAD
        const [
            b2cLead,
            b2bLead,
        ] = await Promise.all([

            B2CLead.findById(
                leadId
            ).select("_id"),

            B2BLead.findById(
                leadId
            ).select("_id"),

        ]);


        let leadModel:
            "B2CLead"
            | "B2BLead"
            | null = null;


        if (b2cLead) {

            leadModel =
                "B2CLead";

        }

        else if (b2bLead) {

            leadModel =
                "B2BLead";
        }


        // LEAD NOT FOUND
        if (!leadModel) {

            return res.status(404).json({

                success: false,

                message:
                    "Lead not found",
            });
        }


        // CREATE TRAVEL HISTORY
        const travelHistory =
            await TravelHistory.create({

                ...validatedData,

                leadModel,
            });


        return res.status(201).json({

            success: true,

            message:
                "Travel history added successfully",

            data: travelHistory,
        });

    } catch (error: any) {

        return res.status(500).json({

            success: false,

            message:
                error.message,
        });
    }
};


// GET ALL TRAVEL HISTORY
export const getAllTravelHistory =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const travelHistory =
                await TravelHistory.find()
                    .sort({
                        lastVisited: -1,
                    });

            return res.status(200).json({
                success: true,
                count: travelHistory.length,
                data: travelHistory,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };



// GET BY LEAD
export const getTravelHistoryByLead =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                leadId
            } = req.params;

            const travelHistory =
                await TravelHistory.find({
                    leadId,
                }).sort({
                    lastVisited: -1,
                });

            return res.status(200).json({
                success: true,
                data: travelHistory,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };



// DELETE
export const deleteTravelHistory =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                id
            } = req.params;

            await TravelHistory.findByIdAndDelete(
                id
            );

            return res.status(200).json({
                success: true,
                message:
                    "Travel history deleted successfully",
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };