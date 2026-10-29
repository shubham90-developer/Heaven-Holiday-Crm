// ======================================================
// FILE: controllers/destination.controller.ts
// ======================================================
import mongoose from "mongoose";
import {
    Request,
    Response
} from "express";

import Destination from
    "./destination.model";

import {
    createDestinationValidation
} from "./destination.validation";
import B2CLead from
    "../../b2c-lead/b2cLead.model";
import B2BLead from
    "../../b2b-lead/b2bLead.model";


// CREATE DESTINATION
// CREATE DESTINATION
export const createDestination = async (req: Request, res: Response) => {

        try {

            const validatedData =
                createDestinationValidation.parse(
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


            // CREATE DESTINATION
            const destination =
                await Destination.create({

                    ...validatedData,

                    leadModel,
                });


            return res.status(201).json({

                success: true,

                message:
                    "Destination added successfully",

                data: destination,
            });

        } catch (error: any) {

            return res.status(500).json({

                success: false,

                message:
                    error.message,
            });
        }
    };


// GET DESTINATIONS BY LEAD
export const getDestinationsByLead =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                leadId
            } = req.params;

            const destinations =
                await Destination.find({
                    leadId,
                }).sort({
                    createdAt: -1,
                });

            return res.status(200).json({
                success: true,
                data: destinations,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };


// GET ALL DESTINATIONS
export const getAllDestinations =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const destinations =
                await Destination.find()
                    .sort({
                        createdAt: -1,
                    });

            return res.status(200).json({
                success: true,
                count: destinations.length,
                data: destinations,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };


// DELETE DESTINATION
export const deleteDestination =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                id
            } = req.params;

            await Destination.findByIdAndDelete(
                id
            );

            return res.status(200).json({
                success: true,
                message:
                    "Destination deleted successfully",
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };