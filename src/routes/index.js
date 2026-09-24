import { Router } from "express";
import { preview } from "../controllers/pattern.controller.js";
import { authRoutes } from "./auth.routes.js";
import { jobRoutes } from "./job.routes.js";
import { patternRoutes } from "./pattern.routes.js";

const api = Router();

api.get("/health", (_req, res) => {
  res.json({ ok: true });
});
api.use("/auth", authRoutes);
api.use("/patterns", patternRoutes);
api.post("/jobs/preview", preview);
api.use("/jobs", jobRoutes);

export { api };
