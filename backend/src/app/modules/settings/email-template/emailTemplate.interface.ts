import { Types } from "mongoose";

export interface IEmailTemplate {

    templateName: string,
    subject: string,
    message: string
    status: "Active" | "InActive",
    isDeleted: boolean
}