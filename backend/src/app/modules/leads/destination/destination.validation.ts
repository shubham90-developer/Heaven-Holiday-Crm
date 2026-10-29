import { z } from "zod";

export const createDestinationValidation =
    z.object({

        leadId:
            z.string(),

        country:
            z.string()
                .min(1, "Country is required"),

        city:
            z.string()
                .min(1, "City is required"),

    });
