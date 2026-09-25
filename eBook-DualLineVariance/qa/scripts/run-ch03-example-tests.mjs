// Compile + headless-render every example spec in manuscript/chapter-03.md with the real
// Vega-Lite/Vega libraries and the Workshop CSV (data/DualLineVariance_Workshop_Data.csv).
// vega / vega-lite / sharp are NOT project dependencies; install them in a scratch folder:
//   npm install --prefix <tmp> vega@6 vega-lite@6 sharp
//   VEGA_NODE_MODULES=<tmp>/node_modules node qa/scripts/run-ch03-example-tests.mjs
// Optional: CH03_IMG_OUT=<dir> writes each rendered example as <id>.png (needs sharp).
//
// An example is a fenced ```json block; the line right before it must be
//   <!-- example: CH03-Sxx-name -->
// to have it rendered under that id. Every fenced json block must carry such a marker.

import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createRequire } from "module";
import { fileURLToPath, pathToFileURL } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const base = process.env.VEGA_NODE_MODULES;
if (!base) throw new Error("set VEGA_NODE_MODULES to a node_modules folder containing vega, vega-lite (and sharp for PNG)");
const req = createRequire(join(base, "noop.js"));
const vl = await import(pathToFileURL(req.resolve("vega-lite")).href);
const vega = await import(pathToFileURL(req.resolve("vega")).href);
const imgOut = process.env.CH03_IMG_OUT;
let sharp = null;
if (imgOut) {
  sharp = (await import(pathToFileURL(req.resolve("sharp")).href)).default;
  mkdirSync(imgOut, { recursive: true });
}

// Workshop data exactly as the CSV (numbers parsed).
const csv = readFileSync(join(root, "data", "DualLineVariance_Workshop_Data.csv"), "utf8").trim().split(/\r?\n/);
const head = csv[0].split(",");
const rows = csv.slice(1).map((l) => {
  const c = l.split(",");
  const o = {};
  head.forEach((h, i) => (o[h] = h === "Category" ? c[i] : Number(c[i])));
  return o;
});

const md = readFileSync(join(root, "manuscript", "chapter-03.md"), "utf8");
const blocks = [];
const re = /(?:<!-- example: (\S+) -->\s*\n)?```json\n([\s\S]*?)```/g;
let m;
while ((m = re.exec(md))) blocks.push({ id: m[1] || null, text: m[2] });

let pass = 0, fail = 0;
const check = (id, desc, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${desc}${detail ? " :: " + detail : ""}`);
};

// Count items per mark type by walking the rendered scenegraph.
const countMarks = (view) => {
  const out = {};
  const walk = (n) => {
    if (n.marktype) out[n.marktype] = (out[n.marktype] || 0) + (n.items ? n.items.length : 0);
    (n.items || []).forEach((c) => c && c.items && walk(c));
  };
  walk(view.scenegraph().root);
  return out;
};

check("ALL", "chapter has example blocks", blocks.length > 0, `${blocks.length} blocks`);
const ids = new Set();

for (const b of blocks) {
  const id = b.id || "(no marker)";
  check(id, "fenced json block has an example marker", !!b.id);
  if (!b.id) continue;
  check(id, "id is unique", !ids.has(b.id));
  ids.add(b.id);

  let spec;
  try {
    spec = JSON.parse(b.text);
  } catch (e) {
    check(id, "parses as JSON", false, e.message);
    continue;
  }
  check(id, "parses as JSON", true);
  check(id, "data is { name: dataset } and no $schema", spec.data?.name === "dataset" && !("$schema" in spec));

  // Compile with warnings collected.
  const warns = [];
  const logger = { level: () => logger, error: (...a) => warns.push(["error", ...a]), warn: (...a) => warns.push(["warn", ...a]), info: () => {}, debug: () => {} };
  let vg;
  try {
    vg = vl.compile(spec, { logger }).spec;
  } catch (e) {
    check(id, "compiles with Vega-Lite", false, e.message);
    continue;
  }
  check(id, "compiles with Vega-Lite, no warnings", warns.length === 0, JSON.stringify(warns));

  // Render headless with the Workshop rows as `dataset`.
  const view = new vega.View(vega.parse(vg), { renderer: "none" }).initialize();
  view.insert("dataset", rows.map((r) => ({ ...r })));
  await view.runAsync();
  const svg = await view.toSVG();
  check(id, "renders non-empty SVG", svg.includes("<svg") && svg.length > 500);

  // Per-example expectations, written independently of the chapter text.
  const mc = countMarks(view);
  console.log("INFO", id, "marks:", JSON.stringify(mc));
  const x = (() => { try { return view.scale("x").domain(); } catch { return null; } })();
  if (id === "CH03-S02-minimal-bar") {
    check(id, "12 bars", mc.rect === 12, JSON.stringify(mc));
  }
  if (id === "CH03-S04-sort-by-sort-order") {
    check(id, "x domain follows Sort_Order (first ม.ค., last ธ.ค.)", x && x[0] === "ม.ค." && x[x.length - 1] === "ธ.ค." && x.length === 12, JSON.stringify(x));
  }
  if (id === "CH03-S07-calculate-filter") {
    check(id, "filter leaves 11 categories, ธ.ค. removed", x && x.length === 11 && !x.includes("ธ.ค."), JSON.stringify(x));
    const dsName = vg.data.map((d) => d.name).find((n) => { try { return (view.data(n) || []).some((d) => "Variance" in d); } catch { return false; } });
    const data = dsName ? view.data(dsName) : [];
    const variances = data.map((d) => d.Variance);
    check(id, "Variance = Actual - Reference (ม.ค. = 20, ก.พ. = -30)", data.find((d) => d.Category === "ม.ค.")?.Variance === 20 && data.find((d) => d.Category === "ก.พ.")?.Variance === -30, JSON.stringify(variances));
  }
  if (id === "CH03-S05-scale-axis") {
    const yd = view.scale("y").domain();
    check(id, "y domain is [350, 650]", yd[0] === 350 && yd[1] === 650, JSON.stringify(yd));
  }
  if (id === "CH03-S06-two-layers") {
    check(id, "two series x 12 points = 24 line items", mc.line === 24, JSON.stringify(mc));
  }
  if (id === "CH03-S08-condition-color") {
    // Actual >= Reference months from the CSV: ก.ค.? computed from data itself.
    const good = rows.filter((r) => r.Actual >= r.Reference).length;
    const green = (svg.match(/#2E7D32/gi) || []).length;
    const orange = (svg.match(/#B45F06/gi) || []).length;
    check(id, `green bars = ${good}, orange bars = ${12 - good}`, green === good && orange === 12 - good, `green ${green}, orange ${orange}`);
  }
  if (id === "CH03-S09-param-variable") {
    check(id, "param target = 500", view.signal("target") === 500, String(view.signal("target")));
  }
  if (id === "CH03-S09-param-selection") {
    // Without a selection, VL's default `empty: true` treats every point as selected.
    const rects = [];
    const walk = (n) => { if (n.marktype === "rect") rects.push(...n.items); (n.items || []).forEach((c) => c && c.items && walk(c)); };
    walk(view.scenegraph().root);
    const ops = [...new Set(rects.map((r) => r.opacity))];
    check(id, "12 bars rendered", rects.length === 12);
    check(id, "before any hover every bar is fully opaque (empty selection = all selected)", ops.length === 1 && ops[0] === 1, JSON.stringify(ops));
    console.log("INFO", id, "distinct bar opacity before any hover:", JSON.stringify(ops));
  }

  if (sharp) {
    await sharp(Buffer.from(svg), { density: 192 }).png().toFile(join(imgOut, `${b.id}.png`));
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
