// ======================================================
// FILE: validations/travelHistory.validation.ts
// ======================================================

import { z } from "zod";

export const createTravelHistoryValidation =
    z.object({

        leadId:
            z.string().min(1),

        country:
            z.string().min(2),

        city:
            z.string().min(2),

        type:
            z.enum([
                "⭐",
                "⭐⭐",
                "⭐⭐⭐",
                "⭐⭐⭐⭐",
                "⭐⭐⭐⭐⭐",
            ]),

        lastVisited:
            z.coerce.date(),

    });