import nodemailer from "nodemailer";
import envConfig from "../config/env.config";

export const isSmtpConfigured = () =>
    Boolean(envConfig.SMTP_HOST && envConfig.SMTP_USER && envConfig.SMTP_PASS);

export const getMailConfig = () => ({
    smtpConfigured: isSmtpConfigured(),
    fromEmail: envConfig.SMTP_FROM || envConfig.SMTP_USER || "",
    fromName: envConfig.SMTP_FROM_NAME,
});

const getTransporter = () => {
    if (!isSmtpConfigured()) {
        throw new Error(
            "SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in backend .env"
        );
    }

    return nodemailer.createTransport({
        host: envConfig.SMTP_HOST,
        port: envConfig.SMTP_PORT,
        secure: envConfig.SMTP_SECURE,
        auth: {
            user: envConfig.SMTP_USER,
            pass: envConfig.SMTP_PASS,
        },
    });
};

export const sendMail = async (options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    cc?: string | string[];
    replyTo?: string;
}) => {
    const transporter = getTransporter();
    const fromAddress = envConfig.SMTP_FROM || envConfig.SMTP_USER;
    const from = envConfig.SMTP_FROM_NAME
        ? `"${envConfig.SMTP_FROM_NAME}" <${fromAddress}>`
        : fromAddress;

    return transporter.sendMail({
        from,
        to: options.to,
        cc: options.cc,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
    });
};
