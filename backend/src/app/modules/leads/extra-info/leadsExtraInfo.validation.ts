import { z } from "zod";

export const createLeadExtraInfoValidation =
    z.object({

        leadId:
            z.string().min(1),

        dob:
            z.string().optional(),

        anniversary:
            z.string().optional(),
    });


export const updateLeadExtraInfoValidation =
    createLeadExtraInfoValidation.partial();