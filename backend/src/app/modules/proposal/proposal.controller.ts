import { Request, Response } from "express";
import {
    generateProposalAiContent,
    ProposalGeneratePayload,
} from "./proposal.service";

export const generateProposalContent = async (req: Request, res: Response) => {
    try {
        const payload = (req.body || {}) as ProposalGeneratePayload;
        const data = await generateProposalAiContent(payload);

        return res.status(200).json({
            success: true,
            message: "Proposal content generated",
            data,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to generate proposal content",
        });
    }
};
