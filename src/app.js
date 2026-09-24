import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { api } from "./routes/index.js";

function createApp() {
  const app = express();
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.use("/api", api);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export { createApp };
