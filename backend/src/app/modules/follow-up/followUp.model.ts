import mongoose, { Schema, Document, Types } from 'mongoose'
import { IFollowUp } from './followUp.interface';

const ScheduleSchema = new Schema(
    {
        day: {
            type: String,
            enum: ['Today', 'Tomorrow', 'In2Days', 'In3Days', 'Custom'],
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
    },
    { _id: false }
)

const FollowUpSchema = new Schema<IFollowUp>(
    {
        leadId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'leadModel',
        },

        leadModel: {
            type: String,
            enum: ['B2CLead', 'B2BLead'],
            required: true,
        },

        type: {
            type: String,
            enum: ['Call', 'ToDo'],
            required: true,
        },

        direction: {
            type: String,
            enum: ['Incoming', 'Outgoing'],
        },

        outcome: {
            type: String,
            enum: ['Answered', 'Unanswered', 'NotReachable'],
        },

        nextStep: {
            type: String,
            enum: ['CallBack', 'Meeting', 'CreateQuery', 'Lost'],
        },

        schedule: {
            type: ScheduleSchema,
            required: true,
        },

        completedAt: Date,

        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Overdue'],
            default: 'Pending',
        },

        details: String,
    },
    { timestamps: true }
)

// Auto-calculate schedule.date from schedule.day
FollowUpSchema.pre('validate', function (this: IFollowUp) {
    if (!this.schedule) return

    const now = new Date()

    switch (this.schedule.day) {
        case 'Today':
            this.schedule.date = now
            break

        case 'Tomorrow':
            this.schedule.date = new Date(now.setDate(now.getDate() + 1))
            break

        case 'In2Days':
            this.schedule.date = new Date(now.setDate(now.getDate() + 2))
            break

        case 'In3Days':
            this.schedule.date = new Date(now.setDate(now.getDate() + 3))
            break

        case 'Custom':
            // keep user-provided date
            break
    }
})

export default mongoose.model<IFollowUp>(
    'FollowUp',
    FollowUpSchema
)