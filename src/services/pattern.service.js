import { BASIC_BLOUSE_FRONT, runPattern } from "../engine/index.js";
import { findPattern, listPatterns, upsertPattern } from "../repositories/pattern.repository.js";

async function seedPatterns() {
  await upsertPattern(BASIC_BLOUSE_FRONT);
}

async function getPatterns() {
  const rows = await listPatterns();
  return rows.map((row) => ({
    id: row._id,
    name: row.name,
    version: row.version,
    measurements: row.definition.measurements,
  }));
}

async function getPattern(id) {
  const row = await findPattern(id);
  if (!row) return null;
  return row.definition;
}

function previewPattern(definition, measurements, unit) {
  return runPattern(definition, measurements, unit);
}

async function savePattern(definition) {
  if (!definition?.id || !definition.formulas || !definition.pieces?.length) {
    const error = new Error("Pattern needs an id, formulas, and pieces");
    error.status = 400;
    throw error;
  }
  await upsertPattern(definition);
  return definition;
}

export { seedPatterns, getPatterns, getPattern, previewPattern, savePattern };
