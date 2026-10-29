import FollowUp from "./followUp.model"
import { Request, Response } from "express";
import { followUpSchema } from "./followUp.validation";
import { Types } from "mongoose";

export const createFollowUp = async (
  req: Request<{ leadId: string }>,
  res: Response
) => {
  try {
    const { leadId } = req.params

    // Validate leadId
    if (!Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ message: "Invalid leadId" })
    }

    // Validate body
    const parsed = followUpSchema.parse(req.body)

    const {
      leadModel,
      type,
      direction,
      outcome,
      nextStep,
      schedule,
      details,
      completed,
    } = parsed

    // Convert date string → Date object
    const scheduleDate = new Date(schedule.date)

    // Build payload (NO undefined fields)
    const payload: any = {
      leadId,
      leadModel,
      type,
      schedule: {
        day: schedule.day,
        date: scheduleDate,
      },
    }

    // Optional fields (safe)
    if (details) payload.details = details

    if (type === "Call") {
      if (direction) payload.direction = direction
      if (outcome) payload.outcome = outcome
    }

    if (nextStep) payload.nextStep = nextStep

    // Handle completed
    if (completed) {
      payload.completedAt = new Date()
      payload.status = "Completed"
    }

    // Save to DB
    const followUp = await FollowUp.create(payload)

    const { logTouchPoint } = await import("../touch-points/touchPoint.service")
    await logTouchPoint({
      leadId,
      leadModel,
      queryId: req.body.queryId || undefined,
      type: type === "Call" ? "Call" : "Todo",
      title:
        type === "Call"
          ? `Call (${direction || "Outgoing"}) — ${outcome || "Logged"}`
          : `ToDo — ${completed ? "Completed" : "Pending"}`,
      description: details || "",
      createdBy: req.body.createdBy || "",
      meta: { followUpId: followUp._id, nextStep },
    })

    return res.status(201).json({
      message: "Follow-up created successfully",
      data: followUp,
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error?.issues || error?.errors || error.message,
    })
  }
}

export const getFollowUpById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }

    const followUp = await FollowUp.findById(id).populate(
      'assignedTo',
      'name email'
    )

    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' })
    }

    return res.status(200).json({ data: followUp })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const getAllFollowUps = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [data, total] = await Promise.all([
      FollowUp.find(filter)
        .populate("leadId")
        .sort({ "schedule.date": 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FollowUp.countDocuments(filter),
    ]);

    return res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowUpsByLeadId = async (
  req: Request<{ leadId: string }>,
  res: Response
) => {
  try {
    const { leadId } = req.params

    if (!Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ message: "Invalid leadId" })
    }

    const followUps = await FollowUp.find({ leadId })
      .sort({ createdAt: -1 }) // latest first so [0] = most recent
      .lean()                  // plain JS objects — faster read

    return res.status(200).json({ data: followUps })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
