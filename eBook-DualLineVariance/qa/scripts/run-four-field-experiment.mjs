// Headless check of specs/experiments/four-field-variance.vl.json with the 12 Workshop rows (4 fields only).
import { readFileSync } from "fs";
import { createRequire } from "module";
import { pathToFileURL } from "url";
const req = createRequire(process.env.VEGA_NODE_MODULES + "/noop.js");
const vl = await import(pathToFileURL(req.resolve("vega-lite")).href);
const vega = await import(pathToFileURL(req.resolve("vega")).href);
const root = "D:/DATA/Deneb/eBook-DualLineVariance";
const spec = JSON.parse(readFileSync(root + "/specs/experiments/four-field-variance.vl.json", "utf8"));
const csv = readFileSync(root + "/data/DualLineVariance_Workshop_Data.csv", "utf8").trim().split(/\r?\n/).slice(1).map((l) => l.split(","));
const mk = (bt) => csv.map(([s, c, a, r]) => ({ Category: c, Actual: +a, Reference: +r, Business_Type: bt }));
const run = async (bt, w = 800, h = 450) => {
  const s = JSON.parse(JSON.stringify(spec));
  s.data = { name: "dataset", values: mk(bt) };
  s.width = w; s.height = h;
  const logs = [];
  const view = new vega.View(vega.parse(vl.compile(s, { logger: { level: () => 0, warn: (...m) => logs.push(m.join(" ")), info() {}, debug() {}, error: (...m) => logs.push("ERR " + m.join(" ")) } }).spec), { renderer: "none" });
  await view.runAsync();
  const top = view.scenegraph().root.items[0].items;
  const items = (n) => (top.find((it) => it.name === n + "_marks") || { items: [] }).items;
  const areaGroups = items("variance_area");
  const areaRows = areaGroups; const nVerts = areaGroups.reduce((n, g) => n + (g.items ? g.items.length : 0), 0);
  const out = {
    areaShapes: areaRows.length, areaVertices: nVerts,
    lineMarks: items("line_actual").length,
    pts: items("point_actual_hit_target").length,
    fills: [...new Set(areaRows.map((r) => r.fill))],
    axisText: (top.filter((it) => it.role === "axis" && it.items[0] && it.items[0].items).flatMap((ax) => ax.items[0].items.flatMap((g) => (g.items || []).filter((x) => x.text).map((x) => x.text)))),
    logs,
  };
  const svg = await view.toSVG();
  view.finalize();
  return { out, svg };
};
const a = await run("Higher is Good");
console.log("Higher:", { ...a.out, axisText: a.out.axisText.join(" ") });
const b = await run("Lower is Good");
console.log("Lower fills:", b.out.fills, " Higher fills:", a.out.fills);
const c = await run("Higher is Good", 280, 180);
console.log("280x180 ok, axis:", c.out.axisText.join(" "));
import { writeFileSync } from "fs";
writeFileSync(process.env.OUT_SVG, a.svg);
