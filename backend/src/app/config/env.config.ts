// src/app/config/env.config.ts

import dotenv from "dotenv";

dotenv.config({ quiet: true });

const envConfig = {
  PORT: process.env.PORT || 5000,
  // MONGODB_URI: process.env.MONGODB_URI as string,
  //   NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI:
    process.env.NODE_ENV === "test"
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI,

  NODE_ENV: process.env.NODE_ENV || "development",

  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_SECURE: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER || "",
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || "A HEAVEN HOSPITALITY PVT LTD",
};

export default envConfig;