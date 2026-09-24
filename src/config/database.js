import mongoose from "mongoose";
import { env } from "./env.js";

let mode = "memory";

async function connectDatabase() {
  if (!env.mongoUri) {
    mode = "memory";
    return mode;
  }
  try {
    await mongoose.connect(env.mongoUri);
    mode = "mongo";
  } catch (error) {
    mode = "memory";
    console.warn(`MongoDB unavailable, using memory store: ${error.message}`);
  }
  return mode;
}

function databaseMode() {
  return mode;
}

export { connectDatabase, databaseMode };
