// Approximate Group B (x-axis label overlap) check with REAL text metrics.
// Needs `vega`, `vega-lite` AND the `canvas` npm package in VEGA_NODE_MODULES, e.g.:
//   npm install --prefix <tmp> vega@6 vega-lite@6 canvas
//   VEGA_NODE_MODULES=<tmp>/node_modules node qa/scripts/run-axis-overlap-sim.mjs
// Simulates Deneb's autosize "fit" (several dataflow passes). Fonts differ from Power BI
// (Segoe UI), so this is a regression guard, not a substitute for T25 on Power BI:
// it reproduced the rev-6 overlap (T09 280x180) that Power BI showed on 24 Sep 2026.
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { createRequire } from "module";
import { fileURLToPath, pathToFileURL } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const req = createRequire(join(process.env.VEGA_NODE_MODULES, "noop.js"));
const vl = await import(pathToFileURL(req.resolve("vega-lite")).href);
const vega = await import(pathToFileURL(req.resolve("vega")).href);
if (!vega.textMetrics.canvas) throw new Error("canvas package not found - text metrics would be estimates");

const spec = JSON.parse(readFileSync(join(root, "specs", "dual-line-variance-final.vl.json"), "utf8"));
const sets = { baseline: "workshop-plotdata.json", T09: "T09_LongCategory-plotdata.json", T10: "T10_24Categories-plotdata.json" };
const sizes = [[280, 180], [480, 270], [800, 450], [1200, 675], [1200, 220], [320, 700]];
let fail = 0;
for (const [name, file] of Object.entries(sets)) {
  for (const [w, h] of sizes) {
    const s = JSON.parse(JSON.stringify(spec));
    s.data = { name: "dataset", values: JSON.parse(readFileSync(join(root, "qa", "scripts", file), "utf8")) };
    s.width = w;
    s.height = h;
    const v = new vega.View(vega.parse(vl.compile(s).spec), { renderer: "none" });
    for (let i = 0; i < 3; i++) await v.runAsync();
    const axes = [];
    const walk = (m) => {
      if (m.role === "axis-label") {
        const vis = m.items.filter((it) => it.opacity !== 0 && it.text && isNaN(Number(String(it.text).replace(/,/g, ""))));
        if (vis.length) axes.push(vis);
      }
      for (const it of m.items || []) for (const c of it.items || []) walk(c);
    };
    for (const m of v.scenegraph().root.items[0].items) walk(m);
    const xl = (axes[0] || []).map((it) => it.bounds).sort((a, b) => a.x1 - b.x1);
    let ov = 0;
    for (let i = 1; i < xl.length; i++) if (xl[i].x1 < xl[i - 1].x2) ov++;
    if (ov) fail++;
    console.log(`${ov ? "FAIL" : "PASS"} ${name} ${w}x${h} labels=${xl.length} overlaps=${ov}`);
    v.finalize();
  }
}
console.log(fail ? `${fail} viewport(s) overlap` : "no overlaps");
process.exit(fail ? 1 : 0);
