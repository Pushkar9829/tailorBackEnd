import { createJob, getJobGcode, getJobSvg } from "../services/job.service.js";
import { listJobs } from "../repositories/job.repository.js";

async function create(req, res, next) {
  try {
    const { patternId = "basic-blouse-front", measurements, unit = "inch", definition, order } = req.body || {};
    const job = await createJob({
      patternId,
      customerLabel: req.user.username,
      measurements,
      unit,
      definition,
      order,
    });
    res.status(201).json({
      id: job._id,
      patternId: job.patternId,
      patternVersion: job.patternVersion,
      svgPath: `/api/jobs/${job._id}/svg`,
    });
  } catch (error) {
    next(error);
  }
}

async function svg(req, res, next) {
  try {
    const body = await getJobSvg(req.params.id);
    if (!body) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(body);
  } catch (error) {
    next(error);
  }
}

async function gcode(req, res, next) {
  try {
    const body = await getJobGcode(req.params.id);
    if (!body) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="${req.params.id}.nc"`);
    res.send(body);
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const jobs = await listJobs();
    if (req.user?.role === "customer") {
      res.json(jobs.filter((job) => job.customerLabel === req.user.username));
      return;
    }
    res.json(jobs);
  } catch (error) {
    next(error);
  }
}

export { create, svg, gcode, list };
