import {
    Request,
    Response,
} from "express";
import mongoose from "mongoose";
import LeadExtraInfo from "./leadsExtraInfo.model";
import B2CLead from "../../b2c-lead/b2cLead.model";
import B2BLead from "../../b2b-lead/b2bLead.model";
import {
    createLeadExtraInfoValidation,
    updateLeadExtraInfoValidation,
} from "./leadsExtraInfo.validation";


// CREATE / UPSERT
export const upsertLeadExtraInfo = async (req: Request, res: Response) => {

    try {

        const validatedData =
            createLeadExtraInfoValidation.parse(
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


        // UPSERT
        const extraInfo =
            await LeadExtraInfo.findOneAndUpdate(

                {
                    leadId,
                },

                {
                    ...validatedData,
                    leadModel,
                },

                {
                    new: true,
                    upsert: true,
                }
            );


        return res.status(200).json({

            success: true,

            message:
                "Lead extra info saved successfully",

            data: extraInfo,
        });

    } catch (error: any) {

        return res.status(500).json({

            success: false,

            message:
                error.message,
        });
    }
};


// GET BY LEAD ID
export const getLeadExtraInfoByLeadId = async (req: Request, res: Response) => {

    try {

        const {
            leadId,
        } = req.params;


        // VALIDATE
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


        const extraInfo =
            await LeadExtraInfo.findOne({

                leadId,
            });


        return res.status(200).json({

            success: true,

            data: extraInfo,
        });

    } catch (error: any) {

        return res.status(500).json({

            success: false,

            message:
                error.message,
        });
    }
};


// UPDATE
export const updateLeadExtraInfo = async (req: Request, res: Response) => {

    try {

        const {
            id,
        } = req.params;

        const validatedData =
            updateLeadExtraInfoValidation.parse(
                req.body
            );


        const updatedExtraInfo =
            await LeadExtraInfo.findByIdAndUpdate(

                id,
                validatedData,
                {
                    new: true,
                }
            );


        if (!updatedExtraInfo) {

            return res.status(404).json({

                success: false,

                message:
                    "Extra info not found",
            });
        }


        return res.status(200).json({

            success: true,

            message:
                "Lead extra info updated successfully",

            data: updatedExtraInfo,
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
export const deleteLeadExtraInfo = async (req: Request, res: Response) => {

    try {

        const {
            id,
        } = req.params;


        const deletedExtraInfo =
            await LeadExtraInfo.findByIdAndDelete(
                id
            );


        if (!deletedExtraInfo) {

            return res.status(404).json({

                success: false,

                message:
                    "Extra info not found",
            });
        }


        return res.status(200).json({

            success: true,

            message:
                "Lead extra info deleted successfully",
        });

    } catch (error: any) {

        return res.status(500).json({

            success: false,

            message:
                error.message,
        });
    }
};