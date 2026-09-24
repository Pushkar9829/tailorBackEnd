import { BASIC_BLOUSE_FRONT } from "../engine/index.js";
import { listJobs } from "../repositories/job.repository.js";
import { upsertPattern } from "../repositories/pattern.repository.js";
import { createJob } from "../services/job.service.js";

function variant(id, name, formulas) {
  const pattern = structuredClone(BASIC_BLOUSE_FRONT);
  pattern.id = id;
  pattern.name = name;
  pattern.version = 1;
  Object.assign(pattern.formulas, formulas);
  return pattern;
}

const PATTERNS = [
  BASIC_BLOUSE_FRONT,
  variant("deep-neck-blouse", "Deep neck blouse", {
    neckWidth: "neck / 2.1",
    neckDepth: "bust / 5.5",
    backNeckWidth: "neck / 4.2",
    backNeckDepth: "bust / 16",
    sleeveLength: "length * 0.28",
    sleeveCapHeight: "armholeDepth * 0.42",
  }),
  variant("full-sleeve-blouse", "Full sleeve blouse", {
    sleeveLength: "length * 0.95",
    sleeveCapHeight: "armholeDepth * 0.55",
    sleeveBicep: "armhole / 1.9",
  }),
  variant("double-puff-blouse", "Double puff blouse", {
    sleeveLength: "length * 0.32",
    sleeveCapHeight: "armholeDepth * 0.95",
    sleeveBicep: "armhole / 1.35",
    sleeveCuff: "sleeveBicep * 0.55",
  }),
  variant("boat-neck-blouse", "Boat neck blouse", {
    neckWidth: "neck / 1.35",
    neckDepth: "bust / 18",
    backNeckWidth: "neck / 2.4",
    backNeckDepth: "bust / 32",
  }),
];

const SIZES = {
  bust: 36,
  shoulder: 14,
  neck: 6,
  armhole: 16,
  length: 15,
  sleeveLength: 8,
  seamAllowance: 0.5,
};

const ORDERS = [
  {
    patternId: "deep-neck-blouse",
    customerLabel: "customer",
    measurements: { ...SIZES, bust: 36, length: 15 },
    order: { blouse: "basic", sleeve: "short", frontNeck: "deep", backNeck: "round", phone: "9810011122", orderDate: "2026-09-20", label: "3 dart basic / Short sleeve / Deep neck / Round neck" },
  },
  {
    patternId: "full-sleeve-blouse",
    customerLabel: "customer",
    measurements: { ...SIZES, bust: 38, shoulder: 14.5, length: 16 },
    order: { blouse: "basic", sleeve: "full", frontNeck: "round", backNeck: "round", phone: "9810011122", orderDate: "2026-09-18", label: "3 dart basic / Full sleeve / Round neck / Round neck" },
  },
  {
    patternId: "double-puff-blouse",
    customerLabel: "Anita",
    measurements: { ...SIZES, bust: 34, shoulder: 13.5, length: 14.5 },
    order: { blouse: "fourDart", sleeve: "puff", frontNeck: "glass", backNeck: "round", phone: "9822233344", orderDate: "2026-09-22", label: "4 dart / Double puff / Glass neck / Round neck" },
  },
  {
    patternId: "boat-neck-blouse",
    customerLabel: "Meera",
    measurements: { ...SIZES, bust: 40, shoulder: 15, length: 15.5 },
    order: { blouse: "boat", sleeve: "elbow", frontNeck: "boat", backNeck: "boat", phone: "9833344455", orderDate: "2026-09-21", label: "Boat neck / Elbow sleeve / Boat neck / Boat neck" },
  },
];

async function seedDemo() {
  for (const pattern of PATTERNS) {
    await upsertPattern(pattern);
  }
  const existing = await listJobs();
  if (existing.length) return { patterns: PATTERNS.length, jobs: existing.length };
  for (const order of ORDERS) {
    await createJob({ ...order, unit: "inch", definition: PATTERNS.find((pattern) => pattern.id === order.patternId) });
  }
  return { patterns: PATTERNS.length, jobs: ORDERS.length };
}

export { seedDemo };
