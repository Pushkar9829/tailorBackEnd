import { getPattern, getPatterns, previewPattern, savePattern } from "../services/pattern.service.js";
import { findPattern } from "../repositories/pattern.repository.js";

async function list(_req, res, next) {
  try {
    res.json(await getPatterns());
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const pattern = await getPattern(req.params.id);
    if (!pattern) {
      res.status(404).json({ error: "Pattern not found" });
      return;
    }
    res.json(pattern);
  } catch (error) {
    next(error);
  }
}

async function preview(req, res, next) {
  try {
    const { patternId = "basic-blouse-front", measurements, unit = "inch" } = req.body || {};
    const row = await findPattern(patternId);
    if (!row) {
      res.status(404).json({ error: "Pattern not found" });
      return;
    }
    const result = previewPattern(row.definition, measurements || {}, unit);
    res.status(result.ok ? 200 : 422).json(result);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const saved = await savePattern(req.body?.definition || req.body);
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
}

export { list, detail, preview, create };
