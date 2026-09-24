import { databaseMode } from "../config/database.js";
import { CuttingJobModel } from "../models/CuttingJob.js";
import { memoryStore } from "./memory.js";

async function insertJob(job) {
  if (databaseMode() === "mongo") {
    await CuttingJobModel.create(job);
    return job;
  }
  memoryStore.jobs.set(job._id, job);
  return job;
}

async function findJob(id) {
  if (databaseMode() === "mongo") {
    return CuttingJobModel.findById(id).lean();
  }
  return memoryStore.jobs.get(id) || null;
}

async function listJobs() {
  const rows = databaseMode() === "mongo"
    ? await CuttingJobModel.find().sort({ createdAt: -1 }).lean()
    : [...memoryStore.jobs.values()];
  return rows.map((job) => ({
    id: job._id,
    customerLabel: job.customerLabel,
    patternId: job.patternId,
    patternVersion: job.patternVersion,
    unit: job.unit,
    measurementSnapshot: job.measurementSnapshot,
    order: job.order || null,
  }));
}

export { insertJob, findJob, listJobs };
