import assert from "node:assert/strict";
import test from "node:test";
import { BASIC_BLOUSE_FRONT, exportSvg, runPattern } from "./index.js";

const base = {
  bust: 36,
  shoulder: 14,
  neck: 6,
  armhole: 16,
  length: 15,
  sleeveLength: 8,
  seamAllowance: 0.5,
};

function build(bust, extra = {}) {
  return runPattern(BASIC_BLOUSE_FRONT, { ...base, bust, ...extra }, "inch");
}

test("bust 36, 38, and 40 increase front width in mm", () => {
  const a = build(36);
  const b = build(38);
  const c = build(40);
  assert.equal(a.ok, true, a.errors.join("; "));
  assert.equal(b.ok, true, b.errors.join("; "));
  assert.equal(c.ok, true, c.errors.join("; "));
  assert.ok(a.derived.frontWidth < b.derived.frontWidth);
  assert.ok(b.derived.frontWidth < c.derived.frontWidth);
  assert.ok(Math.abs(a.derived.frontWidth - (36 * 25.4) / 4) < 0.05);
});

test("neck and armhole controls move when bust changes", () => {
  const a = build(36);
  const c = build(40);
  const neckA = a.pieces[0].segments.find((segment) => segment.id === "neck");
  const neckC = c.pieces[0].segments.find((segment) => segment.id === "neck");
  const armA = a.pieces[0].segments.find((segment) => segment.id === "armhole");
  const armC = c.pieces[0].segments.find((segment) => segment.id === "armhole");
  assert.notEqual(neckA.controls.c1.y, neckC.controls.c1.y);
  assert.notEqual(armA.controls.c1.x, armC.controls.c1.x);
});

test("neck stays on the piece and the armhole bends inward", () => {
  const result = build(36);
  const piece = result.pieces[0];
  const minY = Math.min(...piece.sewing.polyline.map((point) => point.y));
  assert.ok(minY >= -0.05);
  const armhole = piece.segments.find((segment) => segment.id === "armhole");
  const chordX = (armhole.start.x + armhole.end.x) / 2;
  const curveX = (armhole.start.x + 3 * armhole.controls.c1.x + 3 * armhole.controls.c2.x + armhole.end.x) / 8;
  assert.ok(curveX < chordX);
});

test("sewing outline is closed", () => {
  const result = build(36);
  const line = result.pieces[0].sewing.polyline;
  const start = line[0];
  const end = line[line.length - 1];
  assert.ok(Math.hypot(start.x - end.x, start.y - end.y) < 0.05);
});

test("negative length and oversized neck depth fail validation", () => {
  const negative = build(36, { length: -1 });
  assert.equal(negative.ok, false);
  assert.ok(negative.errors.some((error) => /length/i.test(error)));

  const deepNeck = build(36, { length: 2 });
  assert.equal(deepNeck.ok, false);
  assert.ok(deepNeck.errors.some((error) => /neck depth/i.test(error)));
});

test("front, back, sleeve, and neck facing are generated and assembled", () => {
  const result = build(36);
  assert.equal(result.ok, true, result.errors.join("; "));
  assert.deepEqual(result.pieces.map((piece) => piece.id), ["front", "back", "sleeve", "neckFacing"]);
  assert.ok(result.assembled.pieces.length > result.pieces.length);
  assert.ok(result.cuttingLayout.pieces.length === 4);
});

test("svg uses millimeters and matches the geometry bounds", () => {
  const result = build(36);
  const svg = exportSvg(result);
  assert.match(svg, /width="[\d.]+mm"/);
  assert.match(svg, /height="[\d.]+mm"/);
  assert.match(svg, /1 user unit = 1 mm/);
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const [minX, minY, width, height] = viewBox;
  assert.ok(Math.abs(minX - result.bbox.minX) < 0.05);
  assert.ok(Math.abs(minY - result.bbox.minY) < 0.05);
  assert.ok(Math.abs(width - result.bbox.width) < 0.05);
  assert.ok(Math.abs(height - result.bbox.height) < 0.05);
});
