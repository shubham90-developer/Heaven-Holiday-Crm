import { z } from 'zod'
import mongoose from "mongoose";

export const followUpSchema = z.object({
    // leadId: z
    //     .string()
    //     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    //         message: 'Invalid leadId',
    //     }),

    // required for dynamic ref
    leadModel: z.enum(['B2CLead', 'B2BLead']),

    type: z.enum(['Call', 'ToDo']),

    direction: z.enum(['Incoming', 'Outgoing']).optional(),

    // only used during completion
    outcome: z
        .enum(['Answered', 'Unanswered', 'NotReachable'])
        .optional(),

    nextStep: z
        .enum(['CallBack', 'Meeting', 'CreateQuery', 'Lost'])
        .optional(),

    schedule: z.object({
        day: z.enum(['Today', 'Tomorrow', 'In2Days', 'In3Days', 'Custom']),

        date: z
            .string()
            .datetime({ message: 'Invalid date-time format' }),
    }),

    details: z
        .string()
        .max(500, 'Details must be under 500 characters')
        .optional(),

    // UI helper (NOT stored directly)
    completed: z.boolean().optional(),
})