import express, { Application } from 'express';
import cors from "cors";

import routes from "./routes";

const app: Application = express();

// Middleware to parse the url encoded, allow cors or json requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API routes
app.use("/api", routes);

export default app;