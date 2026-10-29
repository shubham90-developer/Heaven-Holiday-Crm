import app from "./app";
import connectDB from "./app/config/db.config";
import envConfig from "./app/config/env.config";

const startServer = async (): Promise<void> => {
    // Connect to MongoDB first
    await connectDB();

    // Then start the server
    app.listen(envConfig.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${envConfig.PORT}`);
    });
};

startServer();