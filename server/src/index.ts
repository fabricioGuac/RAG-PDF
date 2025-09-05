import app from "./app";
import { env } from "./config/env";
import connectMongo from "./config/mongo.config";

const PORT =  env.PORT;

async function startServer() {
    try {
        // Connect to MongoDB
        await connectMongo();
        // Starts the Express server
        app.listen(PORT,() => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Failed to start server ${error}`);
        process.exit(1); // exit with error code
    }
}

startServer();