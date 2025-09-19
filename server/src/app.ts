import express, { Application } from 'express';
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import routes from "./routes";

const app: Application = express();

// Middleware to parse the url encoded, allow cors or json requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const allowedOrigins = [
    'http://localhost:5173', // local  dev
    'https://rag-pdf-psi.vercel.app' // deployed url
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    }
}));


// API routes
app.use("/api", routes);

export default app;