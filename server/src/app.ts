import express, { Application } from 'express';
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import routes from "./routes";

const app: Application = express();

// Middleware to parse the url encoded, allow cors or json requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API routes
app.use("/api", routes);

// Serve frontend in porduction
if (env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../client/dist")));

    app.get("*", (_req, res) => {
        res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
    });
}

export default app;