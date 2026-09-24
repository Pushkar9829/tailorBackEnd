import { databaseMode } from "../config/database.js";
import { PatternModel } from "../models/Pattern.js";
import { memoryStore } from "./memory.js";

async function upsertPattern(definition) {
  const record = {
    _id: definition.id,
    name: definition.name,
    version: definition.version,
    definition,
  };
  if (databaseMode() === "mongo") {
    await PatternModel.findByIdAndUpdate(definition.id, record, { upsert: true, new: true });
    return record;
  }
  memoryStore.patterns.set(definition.id, record);
  return record;
}

async function listPatterns() {
  if (databaseMode() === "mongo") {
    return PatternModel.find().lean();
  }
  return [...memoryStore.patterns.values()];
}

async function findPattern(id) {
  if (databaseMode() === "mongo") {
    return PatternModel.findById(id).lean();
  }
  return memoryStore.patterns.get(id) || null;
}

export { upsertPattern, listPatterns, findPattern };
