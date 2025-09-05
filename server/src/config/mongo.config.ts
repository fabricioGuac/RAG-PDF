import mongoose from "mongoose";
import { env } from "./env";

async function connectMongo(): Promise<void> {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error: ", error);
        process.exit(1);
    }
}

export default connectMongo;