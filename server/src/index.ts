import app from "./app";
import { env } from "./config/env";

const PORT =  env.PORT;

async function startServer() {
    try {
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