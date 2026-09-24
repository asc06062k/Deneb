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
  "CH05-S05": L05,
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
    const d = k === "params" ? isSubset(spec[k], finalSpec[k], "params") : same(spec[k], finalSpec[k]) ? null : "differs";
    check(step.id, `top-level ${k} ${k === "params" ? "is an in-order subset of" : "equals"} final spec`, !d, d || "");
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
  const wantsYDomain = !["CH05-S01", "CH05-S02", "CH05-S03", "CH05-S04"].includes(step.id);
  const hasYParams = (spec.params || []).some((p) => p.name === "yDomainMin");
  check(step.id, "Y-domain params + scale introduced only from CH05-S05", hasYParams === wantsYDomain && hasYParams === !!lineActual.encoding.y.scale);
  check(step.id, "x-axis label params present (dynamic Category axis)", (spec.params || []).some((p) => p.name === "xAxisCategories"));
  const yDom = view.scale("y").domain();
  const expDom = wantsYDomain ? [340.4, 639.6] : [0, 600];
  check(step.id, "rendered Y domain", Math.abs(yDom[0] - expDom[0]) < 1e-9 && Math.abs(yDom[1] - expDom[1]) < 1e-9, `got [${yDom}], expected [${expDom}]`);
  view.finalize();
}

// Cross-highlight dimming on the final spec (T19 evidence, 24 Sep 2026): real Deneb 2.0
// sent __highlightStatus = "on" on EVERY row while a highlight was active, with
// __highlight = value only on the highlighted row and null elsewhere (the docs say "off").
// rev 5 (user request): points and data labels dim on their own measure, the connector dims
// unless either measure is highlighted on that month, all to 0.5; lines and the area never dim.
{
  const HL = 7; // ก.ค.
  const orig = (r) => r.Row_Type === "Original";
  const hit = (r) => orig(r) && r.Sort_Order === HL;
  const fields = (r, m, status, hl) => ({ [m + "__highlight"]: hl, [m + "__highlightStatus"]: status });
  const observed = (m) => (r) => fields(r, m, "on", hit(r) ? r[m] : null);
  const documented = (m) => (r) => fields(r, m, hit(r) ? "on" : "off", hit(r) ? r[m] : null);
  const neutral = (m) => (r) => fields(r, m, "neutral", r[m]);
  const onNull = (m) => (r) => fields(r, m, "on", null); // measure not highlighted anywhere
  const DIM = 0.5;
  // per scenario: a/r = Actual/Reference supporting-field generators (null = fields absent),
  // pa/pr/cn = expected opacity per point/connector datum; lines are always 1
  const scen = {
    absent: { a: null, r: null, pa: () => 1, pr: () => 1, cn: () => 1 },
    neutral: { a: neutral("Actual"), r: neutral("Reference"), pa: () => 1, pr: () => 1, cn: () => 1 },
    observed: { a: observed("Actual"), r: observed("Reference"), pa: (x) => (hit(x) ? 1 : DIM), pr: (x) => (hit(x) ? 1 : DIM), cn: (x) => (hit(x) ? 1 : DIM) },
    documented: { a: documented("Actual"), r: documented("Reference"), pa: (x) => (hit(x) ? 1 : DIM), pr: (x) => (hit(x) ? 1 : DIM), cn: (x) => (hit(x) ? 1 : DIM) },
    // M-26: only one measure highlighted -> the other measure must not dim this point layer
    actualOnly: { a: observed("Actual"), r: onNull("Reference"), pa: (x) => (hit(x) ? 1 : DIM), pr: () => DIM, cn: (x) => (hit(x) ? 1 : DIM) },
    referenceOnly: { a: onNull("Actual"), r: observed("Reference"), pa: () => DIM, pr: (x) => (hit(x) ? 1 : DIM), cn: (x) => (hit(x) ? 1 : DIM) },
    // M-26: Reference supporting fields not enabled at all
    actualFieldsOnly: { a: observed("Actual"), r: null, pa: (x) => (hit(x) ? 1 : DIM), pr: () => 1, cn: (x) => (hit(x) ? 1 : DIM) },
    // M-26: highlighted value 0 must not dim (0 !== 0 is false)
    zeroValue: { zero: true, a: observed("Actual"), r: observed("Reference"), pa: (x) => (hit(x) ? 1 : DIM), pr: (x) => (hit(x) ? 1 : DIM), cn: (x) => (hit(x) ? 1 : DIM) },
  };
  const render = async (spec, sc) => {
    const s = JSON.parse(JSON.stringify(spec));
    s.data = {
      name: "dataset",
      values: plotData.map((r0) => {
        const r = sc.zero && hit(r0) ? { ...r0, Actual: 0, Reference: 0, Plot_Actual: 0, Plot_Reference: 0 } : { ...r0 };
        return { ...r, ...(sc.a ? sc.a(r) : {}), ...(sc.r ? sc.r(r) : {}) };
      }),
    };
    s.width = 640;
    s.height = 320;
    const view = new vega.View(vega.parse(vl.compile(s).spec), { renderer: "none" });
    await view.runAsync();
    const top = view.scenegraph().root.items[0].items;
    const items = (n) => (top.find((it) => it.name === n + "_marks") || { items: [] }).items;
    const out = { pa: items("point_actual_hit_target"), pr: items("point_reference"), cn: items("connector_rule"), la2: items("label_actual"), lr2: items("label_reference"), la: items("line_actual")[0], lr: items("line_reference")[0] };
    view.finalize();
    return out;
  };
  const wrong = (its, fn) => its.filter((it) => (it.opacity ?? 1) !== fn(it.datum)).length;
  for (const [name, sc] of Object.entries(scen)) {
    const o = await render(finalSpec, sc);
    check("HL-" + name, "point_actual_hit_target opacity per Actual measure", o.pa.length === 12 && wrong(o.pa, sc.pa) === 0, `${wrong(o.pa, sc.pa)} wrong of ${o.pa.length}`);
    check("HL-" + name, "point_reference opacity per Reference measure", o.pr.length === 12 && wrong(o.pr, sc.pr) === 0, `${wrong(o.pr, sc.pr)} wrong of ${o.pr.length}`);
    check("HL-" + name, "connector_rule opacity: dim unless either measure highlighted", o.cn.length === 12 && wrong(o.cn, sc.cn) === 0, `${wrong(o.cn, sc.cn)} wrong of ${o.cn.length}`);
    check("HL-" + name, "label_actual opacity per Actual measure", o.la2.length > 0 && wrong(o.la2, sc.pa) === 0, `${wrong(o.la2, sc.pa)} wrong of ${o.la2.length}`);
    check("HL-" + name, "label_reference opacity per Reference measure", o.lr2.length > 0 && wrong(o.lr2, sc.pr) === 0, `${wrong(o.lr2, sc.pr)} wrong of ${o.lr2.length}`);
    check("HL-" + name, "lines never dim", (o.la.opacity ?? 1) === 1 && (o.lr.opacity ?? 1) === 1, `actual ${o.la.opacity ?? 1}, reference ${o.lr.opacity ?? 1}`);
  }
  // Regression (M-26): the rev-3 "off"-only condition must be caught by HL-observed.
  const rev3 = JSON.parse(JSON.stringify(finalSpec));
  for (const l of rev3.layer) if (l.encoding.opacity) l.encoding.opacity.condition.test = "datum.Actual__highlightStatus == 'off' || datum.Reference__highlightStatus == 'off'";
  const o3 = await render(rev3, scen.observed);
  check("HL-regression", "rev-3 condition fails HL-observed expectations (test has teeth)", wrong(o3.pa, scen.observed.pa) > 0, `rev-3 wrong points ${wrong(o3.pa, scen.observed.pa)}`);
  // Regression (M-25): the rev-4a OR-of-both-measures point condition must be caught by HL-actualOnly.
  const rev4a = JSON.parse(JSON.stringify(finalSpec));
  const both = rev4a.layer.find((l) => l.name === "point_actual_hit_target").encoding.opacity.condition.test + " || " + rev4a.layer.find((l) => l.name === "point_reference").encoding.opacity.condition.test;
  for (const n of ["point_actual_hit_target", "point_reference"]) rev4a.layer.find((l) => l.name === n).encoding.opacity.condition.test = both;
  const o4 = await render(rev4a, scen.actualOnly);
  check("HL-regression", "OR-of-both point condition fails HL-actualOnly (test has teeth)", wrong(o4.pa, scen.actualOnly.pa) > 0, `wrong actual points ${wrong(o4.pa, scen.actualOnly.pa)}`);
}

// Dynamic Category axis (rev 6, T09/T10): x-axis labels are looked up from the dataset
// (Sort_Order -> Category), thinned by labelOverlap "greedy" and truncated by labelLimit.
// Label overlap is NOT asserted here: headless Vega has no canvas to measure text and
// over-estimates Thai glyph widths (combining vowels/tones count as characters), so its
// bounds disagree with the rendered text. Group B "no overlap" is judged on Power BI (T25).
{
  const sets = [
    ["baseline", "workshop-plotdata.json"],
    ["T09-long", "T09_LongCategory-plotdata.json"],
    ["T10-24", "T10_24Categories-plotdata.json"],
  ];
  const sizes = [[280, 180], [480, 270], [800, 450], [1200, 675], [1200, 220], [320, 700]];
  for (const [label, file] of sets) {
    const rows = JSON.parse(readFileSync(join(root, "qa", "scripts", file), "utf8"));
    const lineAxis = finalSpec.layer.find((l) => l.name === "line_actual").encoding.x.axis;
    check("AXIS-" + label, "axis uses greedy overlap + width-based labelLimit + no flush + separation", lineAxis.labelOverlap === "greedy" && !!lineAxis.labelLimit.expr && lineAxis.labelFlush === false && lineAxis.labelSeparation > 0);
    const names = rows.filter((r) => r.Row_Type === "Original").sort((a, b) => a.Sort_Order - b.Sort_Order).map((r) => r.Category);
    for (const [w, h] of sizes) {
      const s = JSON.parse(JSON.stringify(finalSpec));
      s.data = { name: "dataset", values: rows };
      s.width = w;
      s.height = h;
      const view = new vega.View(vega.parse(vl.compile(s).spec), { renderer: "none" });
      await view.runAsync();
      await view.runAsync(); // second pass after autosize fit
      // collect label items per axis; the x axis is the one whose labels are not numbers
      const axes = [];
      const walk = (m) => {
        if (m.role === "axis-label") axes.push(m.items.filter((it) => it.text !== "" && it.opacity !== 0));
        for (const it of m.items || []) for (const c of it.items || []) walk(c);
      };
      for (const m of view.scenegraph().root.items[0].items) walk(m);
      const xl = axes.find((a) => a.length && a.some((it) => isNaN(Number(String(it.text).replace(/,/g, ""))))) || [];
      const texts = xl.map((it) => String(it.text));
      const fromData = texts.every((tx) => names.some((n) => n === tx || (tx.endsWith("…") && n.startsWith(tx.slice(0, -1)))));
      const id = `AXIS-${label}-${w}x${h}`;
      check(id, "x-axis shows at least 2 labels", texts.length >= 2, texts.join(" | "));
      check(id, "every x-axis label comes from the Category field (or its truncation)", fromData, texts.join(" | "));
      check(id, "first label = first Category", texts[0] === names[0] || (texts[0].endsWith("…") && names[0].startsWith(texts[0].slice(0, -1))), texts[0]);
      view.finalize();
    }
  }
}

// Regression (Codex R17 M-27): Sort_Order edge cases must not crash and must bound the tick array.
{
  const base = JSON.parse(readFileSync(join(root, "qa", "scripts", "workshop-plotdata.json"), "utf8"));
  const orig = base.filter((r) => r.Row_Type === "Original");
  const cases = {
    // Original rows only with gaps: Sort_Order 1,2,5,6,... (positions follow Sort_Order per M code)
    gaps: orig.map((r, i) => ({ ...r, Sort_Order: i < 2 ? i + 1 : i + 3, Plot_Position: i < 2 ? i + 1 : i + 3 })),
    // one Original row with a huge Sort_Order: range > 1000 -> no explicit ticks (bounded)
    hugeGap: orig.map((r, i) => (i === orig.length - 1 ? { ...r, Sort_Order: 100000, Plot_Position: 100000 } : r)),
    // some Original rows with null Sort_Order (bad source data)
    nullSome: orig.map((r, i) => (i % 5 === 0 ? { ...r, Sort_Order: null } : r)),
    empty: [],
  };
  for (const [name, rows] of Object.entries(cases)) {
    const s = JSON.parse(JSON.stringify(finalSpec));
    s.data = { name: "dataset", values: rows };
    s.width = 640;
    s.height = 320;
    let ok = true, detail = "";
    try {
      const view = new vega.View(vega.parse(vl.compile(s).spec), { renderer: "none" });
      await view.toSVG();
      const vals = view.signal("xAxisValues");
      detail = `xAxisValues length ${vals.length}`;
      if (!Array.isArray(vals) || vals.length > 1001) ok = false;
      if (name === "gaps" && vals.length !== 14) ok = false; // 1..14 (2 blank ticks at 3,4)
      if (name === "hugeGap" && vals.length !== 0) ok = false;
      if (name === "empty" && vals.length !== 0) ok = false;
      view.finalize();
    } catch (e) {
      ok = false;
      detail = e.message;
    }
    check("AXIS-edge-" + name, "renders without error and tick array is bounded", ok, detail);
  }
}

const last = JSON.parse(readFileSync(join(root, "specs", "steps", manifest[manifest.length - 1].file), "utf8"));
const strip = (s) => { const c = JSON.parse(JSON.stringify(s)); delete c.description; return c; };
check("FINAL", "last step equals final spec (except description)", JSON.stringify(strip(last)) === JSON.stringify(strip(finalSpec)));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
