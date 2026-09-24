import { Router } from "express";
import { login } from "../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/login", (req, res) => {
  const session = login(req.body?.username || "", req.body?.password || "");
  if (!session) {
    res.status(401).json({ error: "Wrong username or password" });
    return;
  }
  res.json(session);
});

export { authRoutes };
