import { Router } from "express";
import { requireAdmin, requireCustomer } from "../middleware/auth.middleware.js";
import { create, gcode, list, svg } from "../controllers/job.controller.js";

const jobRoutes = Router();

jobRoutes.get("/mine", requireCustomer, list);
jobRoutes.get("/", requireAdmin, list);
jobRoutes.post("/", requireCustomer, create);
jobRoutes.get("/:id/svg", svg);
jobRoutes.get("/:id/gcode", gcode);

export { jobRoutes };
