import app from "../src/app";
import connectDB from "../src/app/config/db.config";
import type { VercelRequest, VercelResponse } from "@vercel/node";

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  app(req, res);
}