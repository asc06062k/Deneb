// Prototype: can Vega-Lite derive the variance-area vertices (Boundary/Crossing rows) itself
// from ONLY Category, Actual, Reference, Business_Type? Compare with the Power Query output.
import { readFileSync } from "fs";
import { createRequire } from "module";
import { pathToFileURL } from "url";
const base = process.env.VEGA_NODE_MODULES;
const req = createRequire(base + "/noop.js");
const vl = await import(pathToFileURL(req.resolve("vega-lite")).href);
const vega = await import(pathToFileURL(req.resolve("vega")).href);
const root = "D:/DATA/Deneb/eBook-DualLineVariance";
const plot = JSON.parse(readFileSync(root + "/qa/scripts/workshop-plotdata.json", "utf8"));
const orig = plot.filter((r) => r.Row_Type === "Original").sort((a, b) => a.Sort_Order - b.Sort_Order);
const data = orig.map((r) => ({ Category: r.Category, Actual: r.Actual, Reference: r.Reference, Business_Type: r.Business_Type }));

const spec = {
  width: 600, height: 300,
  data: { values: data },
  transform: [
    { window: [{ op: "row_number", as: "pos" }, { op: "lead", field: "Actual", as: "A1" }, { op: "lead", field: "Reference", as: "R1" }] },
    { filter: "isValid(datum.A1)" },
    { calculate: "datum.Actual - datum.Reference", as: "d0" },
    { calculate: "datum.A1 - datum.R1", as: "d1" },
    { calculate: "datum.d0 > 0 ? 1 : datum.d0 < 0 ? -1 : 0", as: "sd0" },
    { calculate: "datum.d1 > 0 ? 1 : datum.d1 < 0 ? -1 : 0", as: "sd1" },
    { calculate: "datum.d0 != 0 ? datum.sd0 : datum.sd1", as: "s0" },
    { calculate: "datum.d0 * datum.d1 < 0", as: "cross" },
    { calculate: "datum.cross ? datum.d0 / (datum.d0 - datum.d1) : 0", as: "t" },
    { calculate: "datum.Actual + datum.t * (datum.A1 - datum.Actual)", as: "yc" },
    
    { calculate: "datum.d1 != 0 ? datum.sd1 : datum.sd0", as: "s1" },
    { calculate: "datum.cross ? [ {x: datum.pos, a: datum.Actual, r: datum.Reference, g: 'a', s: datum.sd0}, {x: datum.pos + datum.t, a: datum.yc, r: datum.yc, g: 'a', s: datum.sd0}, {x: datum.pos + datum.t, a: datum.yc, r: datum.yc, g: 'b', s: datum.sd1}, {x: datum.pos + 1, a: datum.A1, r: datum.R1, g: 'b', s: datum.sd1} ] : [ {x: datum.pos, a: datum.Actual, r: datum.Reference, g: '', s: datum.s0}, {x: datum.pos + 1, a: datum.A1, r: datum.R1, g: '', s: datum.s0} ]", as: "verts" },
    { flatten: ["verts"], as: ["v"] },
    { calculate: "datum.v.x", as: "Plot_Position" },
    { calculate: "datum.v.a", as: "Plot_Actual" },
    { calculate: "datum.v.r", as: "Plot_Reference" },
    { calculate: "datum.v.s", as: "Run_Sign" },
    { calculate: "datum.pos + '-' + datum.v.g", as: "Segment_ID" },
  ],
  mark: { type: "area", opacity: 0.15 },
  encoding: {
    x: { field: "Plot_Position", type: "quantitative" },
    y: { field: "Plot_Actual", type: "quantitative" },
    y2: { field: "Plot_Reference" },
    detail: { field: "Segment_ID", type: "nominal" },
    color: { condition: { test: "(datum.Business_Type == 'Higher is Good' && datum.Run_Sign > 0) || (datum.Business_Type == 'Lower is Good' && datum.Run_Sign < 0)", value: "#0F766E" }, value: "#B45309" },
  },
};
const view = new vega.View(vega.parse(vl.compile(spec).spec), { renderer: "none" });
await view.runAsync();
const cs = vl.compile(spec).spec; let rows = [];
for (const d of cs.data) { let dv; try { dv = view.data(d.name); } catch (e) { continue; } if (dv.length && dv[0].Plot_Position !== undefined) rows = dv; }
console.log("datasets:", cs.data.map((d) => d.name).join(","));
const got = rows.map((d) => ({ x: +(+d.Plot_Position).toFixed(6), a: +(+d.Plot_Actual).toFixed(6), r: +(+d.Plot_Reference).toFixed(6), s: d.Run_Sign, seg: d.Segment_ID }));
// expected from Power Query algorithm output (Boundary/Crossing rows). Position was 1-based (Sort_Order).
const exp = plot.filter((r) => r.Row_Type !== "Original").map((r) => ({ x: +(+r.Plot_Position).toFixed(6), a: +(+r.Plot_Actual).toFixed(6), r: +(+r.Plot_Reference).toFixed(6), s: r.Run_Sign, seg: r.Segment_ID }));
const key = (o) => `${o.x}|${o.a}|${o.r}|${o.s}`;
const gs = got.map(key).sort(), es = exp.map(key).sort();
console.log("derived rows:", got.length, " Power Query fill rows:", exp.length);
console.log("multiset equal (x, actual, reference, run_sign):", JSON.stringify(gs) === JSON.stringify(es));
if (JSON.stringify(gs) !== JSON.stringify(es)) {
  console.log("only derived:", gs.filter((k) => !es.includes(k)).slice(0, 8));
  console.log("only PQ:", es.filter((k) => !gs.includes(k)).slice(0, 8));
}
console.log("first derived rows:", got.slice(0, 6));
console.log("segment ids derived:", [...new Set(got.map((g) => g.seg))].join(" "));
view.finalize();
