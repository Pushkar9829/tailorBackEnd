import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { create, detail, list, preview } from "../controllers/pattern.controller.js";

const patternRoutes = Router();

patternRoutes.get("/", list);
patternRoutes.post("/", requireAdmin, create);
patternRoutes.get("/:id", detail);
patternRoutes.post("/preview", preview);

export { patternRoutes };
