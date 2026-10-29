import { Types } from "mongoose";

export type ScheduleDay =
  | 'Today'
  | 'Tomorrow'
  | 'In2Days'
  | 'In3Days'
  | 'Custom'

export interface IFollowUp {
  _id?: string

  leadId: Types.ObjectId
  leadModel: 'B2CLead' | 'B2BLead'

  type: 'Call' | 'ToDo'
  direction?: 'Incoming' | 'Outgoing'

  outcome?: 'Answered' | 'Unanswered' | 'NotReachable'
  nextStep?: 'CallBack' | 'Meeting' | 'CreateQuery' | 'Lost'

  schedule: {
    day: ScheduleDay
    date?: Date // optional because backend calculates
  }

  completedAt?: string
  status?: 'Pending' | 'Completed' | 'Overdue'

  details?: string

  createdAt?: string
  updatedAt?: string
}