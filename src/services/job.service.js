import { randomUUID } from "node:crypto";
import { findPattern } from "../repositories/pattern.repository.js";
import { findJob, insertJob } from "../repositories/job.repository.js";
import { exportGcode } from "../engine/pattern/gcodeExporter.js";
import { layoutPieces } from "../engine/pattern/layout.js";
import { previewPattern } from "./pattern.service.js";

async function createJob({ patternId, customerLabel, measurements, unit, definition, order }) {
  const row = await findPattern(patternId);
  if (!row && !definition) {
    const error = new Error("Pattern not found");
    error.status = 404;
    throw error;
  }
  const result = previewPattern(definition || row.definition, measurements, unit);
  if (!result.ok || !result.svg) {
    const error = new Error(result.errors.join("; ") || "Invalid pattern");
    error.status = 422;
    error.details = result.errors;
    throw error;
  }
  const job = {
    _id: randomUUID(),
    customerLabel: customerLabel || "",
    patternId: definition?.id || row?.definition.id,
    patternVersion: definition?.version || row?.definition.version,
    order: order || null,
    unit,
    measurementSnapshot: measurements,
    measurementsMm: result.measurementsMm,
    geometry: {
      derived: result.derived,
      pieces: result.pieces,
      bbox: result.bbox,
    },
    svg: result.svg,
    gcode: result.gcode,
  };
  await insertJob(job);
  return job;
}

async function getJobSvg(id) {
  const job = await findJob(id);
  if (!job) return null;
  return job.svg;
}

async function getJobGcode(id) {
  const job = await findJob(id);
  if (!job) return null;
  if (job.gcode) return job.gcode;
  if (!job.geometry?.pieces?.length) return null;
  return exportGcode({ cuttingLayout: layoutPieces(job.geometry.pieces) });
}

export { createJob, getJobSvg, getJobGcode };
