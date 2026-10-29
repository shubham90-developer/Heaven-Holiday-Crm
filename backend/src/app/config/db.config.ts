import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {

    try {
        const MONGO_URI = process.env.MONGODB_URI as string;
        const conn = await mongoose.connect(MONGO_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        });

        if (conn) {
            console.log("DB connected ✔");
        }
    } catch (error) {
        const err = error as Error;
        console.error("DB connection failed ❌", err.message);
        process.exit(1);
    }
}

export default connectDB;