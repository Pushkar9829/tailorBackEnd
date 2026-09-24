import dotenv from "dotenv";

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || process.env.MONGO_URI || "",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  adminUser: process.env.ADMIN_USER || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "tailor",
  customerUser: process.env.CUSTOMER_USER || "customer",
  customerPassword: process.env.CUSTOMER_PASSWORD || "customer",
};

export { env };
