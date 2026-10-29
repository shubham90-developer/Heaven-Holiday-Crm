// src/test/setup.ts
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log("TEST DB:", process.env.MONGODB_URI_TEST);

beforeAll(async () => {
    const uri = process.env.MONGODB_URI_TEST as string;

    if (!uri) throw new Error("MONGODB_URI_TEST is not defined");

    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000, // fail fast if unreachable
        connectTimeoutMS: 10000,
    });
}, 30000); // <-- increase beforeAll timeout

beforeEach(async () => {
    // Guard: don't attempt cleanup if not connected
    if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB not connected in beforeEach");
    }

    const collections = mongoose.connection.collections;
    await Promise.all(
        Object.values(collections).map(col => col.deleteMany({}))
    );
}, 15000); // <-- increase beforeEach timeout

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}, 15000);