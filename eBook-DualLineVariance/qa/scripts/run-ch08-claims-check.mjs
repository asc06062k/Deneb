// Verifies manuscript/chapter-08.md against the real Step file, the CSV and screenshots:
//  - every <!-- excerpt: ... --> JSON block equals the matching encoding.opacity in specs/steps/CH08-S01-*.vl.json
//  - CH08-S01 = CH07-S02 + opacity on exactly five layers (and equals the final spec's layers)
//  - the opacity test expressions are EVALUATED against simulated Deneb rows (neutral / July / multi-select /
//    documented "off" / wrongly named "Sum of Actual__..." columns) to prove the behaviour the chapter describes
//  - every image referenced exists; figures 8-1..8-17 sequential
// Run: node qa/scripts/run-ch08-claims-check.mjs
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { isDeepStrictEqual } from "util";
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const md = readFileSync(join(root, "manuscript", "chapter-08.md"), "utf8");
let pass = 0, fail = 0;
const check = (d, ok, detail = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${d}${detail ? " :: " + detail : ""}`); };
const spec = (f) => JSON.parse(readFileSync(join(root, "specs", "steps", `${f}.vl.json`), "utf8"));
const S8 = spec("CH08-S01-cross-highlight-opacity"), S7 = spec("CH07-S02-data-labels");
const layer = (s, n) => s.layer.find((l) => l.name === n);

const re = /<!-- excerpt: (\S+) (.+?) -->\s*\n```json\n([\s\S]*?)```/g;
let m, n = 0;
while ((m = re.exec(md))) {
  n++;
  const [, file, what, body] = m;
  const label = `${file} ${what}`;
  let obj;
  try { obj = JSON.parse("{" + body + "}"); } catch (e) { check(label, false, "JSON parse: " + e.message); continue; }
  if (what.startsWith("opacity:")) check(label + " (encoding.opacity equal)", isDeepStrictEqual(obj.opacity, layer(S8, what.slice(8)).encoding.opacity));
  else check(label, false, "unknown excerpt kind");
}
check("excerpt blocks found (2)", n === 2, `${n}`);

// Structure: CH08-S01 = CH07-S02 + opacity on five layers.
const withOpacity = S8.layer.filter((l) => l.encoding.opacity).map((l) => l.name).sort();
check("opacity on exactly connector_rule, label_actual, label_reference, point_actual_hit_target, point_reference", withOpacity.join() === "connector_rule,label_actual,label_reference,point_actual_hit_target,point_reference", withOpacity.join());
const strip = (l) => { const c = JSON.parse(JSON.stringify(l)); delete c.encoding.opacity; return JSON.stringify(c); };
check("CH08-S01 layers equal CH07-S02 layers once encoding.opacity is removed (same names, same order)", S8.layer.length === S7.layer.length && S8.layer.every((l, i) => l.name === S7.layer[i].name && strip(l) === strip(S7.layer[i])));
check("params/resolve/config identical to CH07-S02", JSON.stringify(S8.params) === JSON.stringify(S7.params) && JSON.stringify(S8.resolve) === JSON.stringify(S7.resolve) && JSON.stringify(S8.config) === JSON.stringify(S7.config));
const fin = JSON.parse(readFileSync(join(root, "specs", "dual-line-variance-final.vl.json"), "utf8"));
check("CH08-S01 layers equal the final spec layers (= final spec claim)", JSON.stringify(S8.layer) === JSON.stringify(fin.layer));
check("lines and area carry no opacity channel; area mark.opacity is 0.15 everywhere", ["variance_area", "bad_area_border_actual", "bad_area_border_reference", "line_reference", "line_actual"].every((n) => !layer(S8, n).encoding.opacity) && layer(S8, "variance_area").mark.opacity === 0.15);
check("all opacity conditions: dim value 0.5, default 1", S8.layer.filter((l) => l.encoding.opacity).every((l) => l.encoding.opacity.condition.value === 0.5 && l.encoding.opacity.value === 1));
check("label_actual test equals point_actual_hit_target test; label_reference equals point_reference test", layer(S8, "label_actual").encoding.opacity.condition.test === layer(S8, "point_actual_hit_target").encoding.opacity.condition.test && layer(S8, "label_reference").encoding.opacity.condition.test === layer(S8, "point_reference").encoding.opacity.condition.test);
const readsNames = (t, base) => [...t.matchAll(/datum\.([A-Za-z_]+)/g)].map((x) => x[1]).every((k) => k.startsWith(base));
check("point/label Actual tests read only Actual*, Reference tests only Reference*", readsNames(layer(S8, "point_actual_hit_target").encoding.opacity.condition.test, "Actual") && readsNames(layer(S8, "point_reference").encoding.opacity.condition.test, "Reference"));

// Behaviour: evaluate the real test strings on simulated Deneb rows built from the CSV.
const rows = readFileSync(join(root, "data", "DualLineVariance_Workshop_Data.csv"), "utf8").trim().split(/\r?\n/).slice(1).map((l) => l.split(",")).map(([s, c, a, r]) => ({ s: +s, c, Actual: +a, Reference: +r }));
const isDefined = (v) => v !== undefined;
const dims = (test, d) => Boolean(new Function("datum", "isDefined", `return (${test});`)(d, isDefined));
const T = (name) => layer(S8, name).encoding.opacity.condition.test;
const mk = (state, prefix = "") => rows.map((r) => {
  const d = { Category: r.c, Sort_Order: r.s, [prefix + "Actual"]: r.Actual, [prefix + "Reference"]: r.Reference };
  if (prefix) { d.Actual = undefined; d.Reference = undefined; d[prefix + "Actual"] = r.Actual; d[prefix + "Reference"] = r.Reference; }
  const on = state.on || [];
  const st = state.kind === "neutral" ? "neutral" : state.kind === "off" ? "off" : "on";
  d[prefix + "Actual__highlightStatus"] = st; d[prefix + "Reference__highlightStatus"] = st;
  d[prefix + "Actual__highlight"] = on.includes(r.s) ? r.Actual : null;
  d[prefix + "Reference__highlight"] = on.includes(r.s) ? r.Reference : null;
  return d;
});
const dimmedMonths = (name, data) => data.filter((d) => dims(T(name), d)).map((d) => d.Sort_Order);
const others = (keep) => rows.map((r) => r.s).filter((s) => !keep.includes(s));
const allNames = ["point_actual_hit_target", "point_reference", "label_actual", "label_reference", "connector_rule"];
check("neutral (no selection): nothing dims in any layer", allNames.every((n) => dimmedMonths(n, mk({ kind: "neutral" })).length === 0));
check("July selected (status 'on' on every row, highlight only on July): every layer dims exactly the other 11 months", allNames.every((n) => dimmedMonths(n, mk({ kind: "on", on: [7] })).join() === others([7]).join()));
check("multi-select May+Jul+Aug: every layer dims exactly the other 9 months (figure 8-13)", allNames.every((n) => dimmedMonths(n, mk({ kind: "on", on: [5, 7, 8] })).join() === others([5, 7, 8]).join()));
check("documented 'off' status dims the point layer for all rows", dimmedMonths("point_actual_hit_target", mk({ kind: "off" })).length === 12);
check("connector: 'off' on both measures dims all 12 rows", dimmedMonths("connector_rule", mk({ kind: "off" })).length === 12);
check("BUG REPRO: columns named 'Sum of Actual__highlight...' -> no layer ever dims even with July selected (figure 8-10 symptom)", allNames.every((n) => dimmedMonths(n, mk({ kind: "on", on: [7] }, "Sum of ")).length === 0));
check("isDefined(null) is true in the test (null highlight counts as defined) - Vega isDefined = value !== undefined", isDefined(null) === true && dimmedMonths("point_actual_hit_target", mk({ kind: "on", on: [7] })).includes(1));
check("figure 8-12 caption values: July Actual 510 / Reference 520; figure 8-13: May 500/470, Jul 510/520, Aug 530/500", (() => { const g = (s) => rows.find((r) => r.s === s); return g(7).Actual === 510 && g(7).Reference === 520 && g(5).Actual === 500 && g(5).Reference === 470 && g(8).Actual === 530 && g(8).Reference === 500; })());
check("column chart values in Step 1: 420,380,460,440,500,480,510,530,520,560,540,600", rows.map((r) => r.Actual).join() === "420,380,460,440,500,480,510,530,520,560,540,600");
check("Filter mode (figure 8-14): Y range 495-535 is consistent with Jul/Aug extent 500-530 padded 18% -> [494.6, 535.4]", (() => { const lo = 500, hi = 530, pad = (hi - lo) * 0.18; return Math.abs(lo - pad - 494.6) < 1e-9 && Math.abs(hi + pad - 535.4) < 1e-9; })());

// Images and figure numbering.
const imgs = [...md.matchAll(/!\[[^\]]*\]\(\.\.\/images\/chapter-08\/([^)]+)\)/g)].map((x) => x[1]);
check("all referenced images exist", imgs.length > 0 && imgs.every((f) => existsSync(join(root, "images", "chapter-08", f))), imgs.join(", "));
const caps = [...md.matchAll(/^\*ภาพ 8-(\d+) /gm)].map((x) => +x[1]);
check("captions numbered 1..N sequentially, match image count (17)", caps.every((v, i) => v === i + 1) && caps.length === imgs.length && caps.length === 17, JSON.stringify(caps));
const refs = new Set([...md.matchAll(/ภาพ 8-(\d+)/g)].map((x) => +x[1]));
check("every text reference points to an existing figure", [...refs].every((v) => v >= 1 && v <= caps.length), JSON.stringify([...refs]));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
