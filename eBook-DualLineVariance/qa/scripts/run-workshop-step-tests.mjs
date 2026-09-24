// Compile + headless-render every Workshop step spec with the real Vega-Lite/Vega
// libraries and the Workshop PlotData (qa/scripts/workshop-plotdata.json).
// vega / vega-lite are NOT project dependencies; point VEGA_NODE_MODULES at a folder
// that has them installed, e.g.:
//   npm install --prefix <tmp> vega@6 vega-lite@6
//   VEGA_NODE_MODULES=<tmp>/node_modules node qa/scripts/run-workshop-step-tests.mjs

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { createRequire } from "module";
import { fileURLToPath, pathToFileURL } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const base = process.env.VEGA_NODE_MODULES;
if (!base) throw new Error("set VEGA_NODE_MODULES to a node_modules folder containing vega and vega-lite");
const req = createRequire(join(base, "noop.js"));
const vl = await import(pathToFileURL(req.resolve("vega-lite")).href);
const vega = await import(pathToFileURL(req.resolve("vega")).href);

const plotData = JSON.parse(readFileSync(join(root, "qa", "scripts", "workshop-plotdata.json"), "utf8"));
const finalSpec = JSON.parse(readFileSync(join(root, "specs", "dual-line-variance-final.vl.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(root, "specs", "steps", "steps-manifest.json"), "utf8"));
const svgOut = process.env.STEP_SVG_OUT; // optional: write rendered SVGs here

let pass = 0, fail = 0;
const check = (id, desc, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${desc}${detail ? " :: " + detail : ""}`);
};

// Expected mark count per layer for the 12-month Workshop data (Higher is Good).
const nOriginal = plotData.filter((r) => r.Row_Type === "Original").length;
const good = (r) => (r.Business_Type === "Higher is Good" && r.Run_Sign > 0) || (r.Business_Type === "Lower is Good" && r.Run_Sign < 0);
const fill = plotData.filter((r) => r.Row_Type === "Boundary" || r.Row_Type === "Crossing");
const segs = new Set(fill.map((r) => r.Segment_ID)).size;
const badSegs = new Set(fill.filter((r) => !good(r)).map((r) => r.Segment_ID)).size;
const expectedMarks = {
  variance_area: segs,
  bad_area_border_actual: badSegs,
  bad_area_border_reference: badSegs,
  connector_rule: nOriginal,
  line_reference: 1,
  line_actual: 1,
  point_reference: nOriginal,
  point_actual_hit_target: nOriginal,
};

// Expected layer set per step, written independently of the generator (review/PHASE2_WORKSHOP_STEPS.md).
const L05 = ["line_reference", "line_actual", "point_reference", "point_actual_hit_target"];
const L06 = ["variance_area", "bad_area_border_actual", "bad_area_border_reference", "connector_rule", ...L05];
const EXPECTED_LAYERS = {
  "CH05-S01": ["line_actual"],
  "CH05-S02": ["line_reference", "line_actual"],
  "CH05-S03": L05,
  "CH05-S04": L05,
  "CH06-S01": ["variance_area", ...L05],
  "CH06-S02": ["variance_area", "bad_area_border_actual", "bad_area_border_reference", ...L05],
  "CH06-S03": L06,
  "CH07-S01": L06,
  "CH07-S02": [...L06, "label_actual", "label_reference"],
  "CH08-S01": [...L06, "label_actual", "label_reference"],
};

// Structural subset: every property in `a` exists in `b` with the same value;
// arrays in `a` must be an in-order subsequence of `b` (e.g. transform lists with steps removed).
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function isSubset(a, b, path = "") {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return `${path}: array vs non-array`;
    let j = 0;
    for (let i = 0; i < a.length; i++) {
      while (j < b.length && isSubset(a[i], b[j], `${path}[${i}]`)) j++;
      if (j === b.length) return `${path}[${i}]: not found in final (in order)`;
      j++;
    }
    return null;
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object" || Array.isArray(b)) return `${path}: object vs non-object`;
    for (const k of Object.keys(a)) {
      if (!(k in b)) return `${path}.${k}: property not in final spec`;
      const r = isSubset(a[k], b[k], `${path}.${k}`);
      if (r) return r;
    }
    return null;
  }
  return same(a, b) ? null : `${path}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`;
}

let prevLayers = [];
for (const step of manifest) {
  const spec = JSON.parse(readFileSync(join(root, "specs", "steps", step.file), "utf8"));
  const names = spec.layer.map((l) => l.name);

  check(step.id, "manifest layers match file layers", same(step.layers, names), `manifest=${step.layers.join(",")}`);
  check(step.id, "layer set matches the expected lesson plan", same(EXPECTED_LAYERS[step.id], names), `got ${names.join(",")}`);
  for (const l of spec.layer) {
    const f = finalSpec.layer.find((x) => x.name === l.name);
    const diff = f ? isSubset(l, f, l.name) : `${l.name}: layer not in final spec`;
    check(step.id, `layer ${l.name} is a structural subset of final spec`, !diff, diff || "");
  }
  for (const k of Object.keys(spec).filter((k) => !["description", "layer"].includes(k))) {
    check(step.id, `top-level ${k} equals final spec`, same(spec[k], finalSpec[k]));
  }

  check(step.id, "data binds to Deneb dataset", spec.data && spec.data.name === "dataset" && !spec.data.values);
  check(step.id, "layer order is a subsequence of final spec order", names.every((n, i) => i === 0 || finalSpec.layer.findIndex((l) => l.name === n) > finalSpec.layer.findIndex((l) => l.name === names[i - 1])));
  check(step.id, "cumulative: keeps every layer of previous step", prevLayers.every((n) => names.includes(n)), `prev=${prevLayers.join(",")}`);
  prevLayers = names;

  const testSpec = JSON.parse(JSON.stringify(spec));
  testSpec.data = { name: "dataset", values: plotData };
  testSpec.width = 640;
  testSpec.height = 320;
  const warnings = [];
  const logger = { level() { return this; }, warn: (...a) => warnings.push(a.join(" ")), info() {}, debug() {}, error: (...a) => warnings.push("ERROR " + a.join(" ")) };
  let compiled;
  try {
    compiled = vl.compile(testSpec, { logger }).spec;
    check(step.id, "vega-lite compile", true);
  } catch (e) {
    check(step.id, "vega-lite compile", false, e.message);
    continue;
  }
  check(step.id, "no compile warnings", warnings.length === 0, warnings.join(" | "));
  // Regression: a layer with "axis": null listed before line_actual suppresses the shared axes.
  const axisTitles = (compiled.axes || []).map((a) => a.title).filter(Boolean);
  check(step.id, "x and y axes present with Thai titles", axisTitles.includes("เดือน") && axisTitles.includes("ยอดขาย (พันบาท)"), JSON.stringify(axisTitles));

  const view = new vega.View(vega.parse(compiled), { renderer: "none" });
  const svg = await view.toSVG();
  check(step.id, "renders to SVG", svg.startsWith("<svg"));
  if (svgOut) {
    mkdirSync(svgOut, { recursive: true });
    writeFileSync(join(svgOut, step.file.replace(".vl.json", ".svg")), svg, "utf8");
  }

  for (const name of names) {
    if (!(name in expectedMarks)) continue;
    // line/area marks draw one SVG path per group: ungrouped -> "<name>_marks" is one path;
    // grouped by detail -> "<name>_pathgroup" holds one child group (= one path) per Segment_ID.
    const top = view.scenegraph().root.items[0].items;
    const g = top.find((it) => it.name === name + "_marks");
    const pg = top.find((it) => it.name === name + "_pathgroup");
    const count = pg ? pg.items.length
      : !g ? -1
      : g.marktype === "line" || g.marktype === "area" ? (g.items.length ? 1 : 0)
      : g.items.length;
    check(step.id, `mark count ${name}`, count === expectedMarks[name], `got ${count}, expected ${expectedMarks[name]}`);
  }

  const lineActual = spec.layer.find((l) => l.name === "line_actual");
  const wantsMonotone = !["CH05-S01", "CH05-S02", "CH05-S03"].includes(step.id);
  check(step.id, "monotone introduced only from CH05-S04", (lineActual.mark.interpolate === "monotone") === wantsMonotone);
  view.finalize();
}

const last = JSON.parse(readFileSync(join(root, "specs", "steps", manifest[manifest.length - 1].file), "utf8"));
const strip = (s) => { const c = JSON.parse(JSON.stringify(s)); delete c.description; return c; };
check("FINAL", "last step equals final spec (except description)", JSON.stringify(strip(last)) === JSON.stringify(strip(finalSpec)));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
