import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";

const sessions = new Map();

function login(username, password) {
  let role = null;
  if (username === env.adminUser && password === env.adminPassword) role = "tailor";
  if (username === env.customerUser && password === env.customerPassword) role = "customer";
  if (!role) return null;
  const token = randomUUID();
  sessions.set(token, { role, username });
  return { token, role, username };
}

function sessionFrom(req) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return sessions.get(token) || null;
}

function requireRole(role) {
  return function requireRoleMiddleware(req, res, next) {
    const session = sessionFrom(req);
    if (!session || session.role !== role) {
      res.status(401).json({ error: role === "tailor" ? "Tailor login required" : "Customer login required" });
      return;
    }
    req.user = session;
    next();
  };
}

const requireAdmin = requireRole("tailor");
const requireCustomer = requireRole("customer");

export { login, requireAdmin, requireCustomer };
