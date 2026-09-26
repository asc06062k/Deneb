// Verifies manuscript/chapter-07.md against the real Step files, the CSV and screenshots:
//  - every <!-- excerpt: ... --> JSON block equals the matching part of specs/steps/*.vl.json
//  - cumulative step claims (S01 changes only point_actual_hit_target; S02 appends two label layers)
//  - tooltip values and percentages recomputed from the CSV
//  - labelStep thresholds and the observed label months at 800x450 and 280x180 recomputed from the formula
//  - every image referenced exists; figures 7-1..7-8 sequential
// Run: node qa/scripts/run-ch07-claims-check.mjs
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { isDeepStrictEqual } from "util";
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const md = readFileSync(join(root, "manuscript", "chapter-07.md"), "utf8");
let pass = 0, fail = 0;
const check = (d, ok, detail = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${d}${detail ? " :: " + detail : ""}`); };
const spec = (f) => JSON.parse(readFileSync(join(root, "specs", "steps", `${f}.vl.json`), "utf8"));

const re = /<!-- excerpt: (\S+) (.+?) -->\s*\n```json\n([\s\S]*?)```/g;
let m, n = 0;
while ((m = re.exec(md))) {
  n++;
  const [, file, what, body] = m;
  const label = `${file} ${what}`;
  let obj;
  try { obj = JSON.parse("{" + body + "}"); } catch (e) { check(label, false, "JSON parse: " + e.message); continue; }
  const s = spec(file);
  if (what.startsWith("layer:")) {
    const names = what.slice(6).split(",");
    check(label + " (layers equal)", isDeepStrictEqual(obj.layer.map((l) => l.name), names) && obj.layer.every((l) => isDeepStrictEqual(l, s.layer.find((q) => q.name === l.name))));
  } else if (what.startsWith("marks:")) {
    check(label + " (marks equal)", Object.entries(obj).every(([name, v]) => isDeepStrictEqual(v.mark, s.layer.find((l) => l.name === name).mark)));
  } else check(label, false, "unknown excerpt kind");
}
check("excerpt blocks found (3)", n === 3, `${n}`);

const S6 = spec("CH06-S03-connector-rule"), S1 = spec("CH07-S01-tooltip"), S2 = spec("CH07-S02-data-labels");
const names = (x) => x.layer.map((l) => l.name);
const j = (v) => JSON.stringify(v);
check("S01 = CH06-S03 except point_actual_hit_target (params too)", j(S1.params) === j(S6.params) && names(S1).join() === names(S6).join() && S1.layer.filter((l) => l.name !== "point_actual_hit_target").every((l) => j(l) === j(S6.layer.find((q) => q.name === l.name))) && j(S1.layer.find((l) => l.name === "point_actual_hit_target")) !== j(S6.layer.find((l) => l.name === "point_actual_hit_target")));
check("S02 = S01 + label_actual, label_reference appended last", names(S2).join() === [...names(S1), "label_actual", "label_reference"].join() && j(S2.layer.slice(0, -2)) === j(S1.layer));
const pt = S1.layer.find((l) => l.name === "point_actual_hit_target");
check("tooltip: 5 fields, titles เดือน/ยอดขายจริง/เป้าหมาย/ผลต่าง/ผลต่าง %", pt.encoding.tooltip.map((t) => t.title).join("|") === "เดือน|ยอดขายจริง|เป้าหมาย|ผลต่าง|ผลต่าง %" && pt.encoding.tooltip.map((t) => t.field).join() === "Category,Plot_Actual,Plot_Reference,VarianceLabel,VariancePercentLabel");
check("calculate order Variance -> VarianceLabel -> VariancePercentLabel; formats '+,.0f' and '+.1%'; zero guard text", pt.transform.slice(1).map((t) => t.as).join() === "Variance,VarianceLabel,VariancePercentLabel" && pt.transform[2].calculate === "format(datum.Variance, '+,.0f')" && pt.transform[3].calculate.includes("'+.1%'") && pt.transform[3].calculate.includes("N/A (เป้าหมาย = 0)"));
check("tooltip null on every other layer of S01 (incl. point_reference), not on the hit-target", S1.layer.filter((l) => l.name !== "point_actual_hit_target").every((l) => l.mark.tooltip === null) && !("tooltip" in pt.mark));
const lr = S2.layer.find((l) => l.name === "label_reference"), la = S2.layer.find((l) => l.name === "label_actual");
check("label layers: text mark, fontSize 10 bold, tooltip null, colors #2563EB / #B45309", [la, lr].every((l) => l.mark.type === "text" && l.mark.fontSize === 10 && l.mark.fontWeight === "bold" && l.mark.tooltip === null) && la.mark.color === "#2563EB" && lr.mark.color === "#B45309");
check("dy: actual -12 when Actual>=Reference else 12; reference is the mirror", la.mark.dy.expr === "datum.Plot_Actual >= datum.Plot_Reference ? -12 : 12" && lr.mark.dy.expr === "datum.Plot_Actual >= datum.Plot_Reference ? 12 : -12");
check("label_reference differs from label_actual only in count field, y, text, dy, color", (() => { const x = JSON.parse(j(lr)), y = JSON.parse(j(la)); for (const o of [x, y]) { o.name = ""; o.mark.dy = ""; o.mark.color = ""; o.transform[4].joinaggregate[1].field = ""; o.encoding.y.field = ""; o.encoding.text.field = ""; } return j(x) === j(y) && lr.transform[4].joinaggregate[1].field === "Plot_Reference" && lr.encoding.y.field === "Plot_Reference" && lr.encoding.text.field === "Plot_Reference"; })());
check("transform order of labels: filter, lenA, lenR, maxLen, joinaggregate, labelStep, showLabel, filter", la.transform.map((t) => t.filter ? "filter" : t.joinaggregate ? "joinaggregate" : t.as).join() === "filter,lenA,lenR,maxLen,joinaggregate,labelStep,showLabel,filter");
check("labelStep formula text and joinaggregate outputs (globalMaxLen,n,lastSort)", la.transform[5].calculate === "max(1, ceil((datum.globalMaxLen * 10 * 0.62 + 14) / (width / datum.n)))" && la.transform[4].joinaggregate.map((a) => a.as).join() === "globalMaxLen,n,lastSort" && la.transform[6].calculate === "(datum.Sort_Order - 1) % datum.labelStep == 0 || datum.Sort_Order == datum.lastSort");

// Data-derived claims.
const rows = readFileSync(join(root, "data", "DualLineVariance_Workshop_Data.csv"), "utf8").trim().split(/\r?\n/).slice(1).map((l) => l.split(",")).map(([s, c, a, r]) => ({ s: +s, c, a: +a, r: +r }));
const byName = (c) => rows.find((r) => r.c === c);
const pct = (r) => (((r.a - r.r) / r.r) * 100);
const fmt = (v) => (v >= 0 ? "+" : "-") + Math.abs(v).toFixed(1) + "%";
const expect = { "ม.ค.": [20, "+5.0%"], "ก.พ.": [-30, "-7.3%"], "มี.ค.": [30, "+7.0%"], "พ.ค.": [30, "+6.4%"], "ธ.ค.": [30, "+5.3%"] };
for (const [c, [v, p]] of Object.entries(expect)) { const r = byName(c); check(`tooltip ${c}: ${r.a}/${r.r} variance ${v} pct ${p}`, r.a - r.r === v && fmt(pct(r)) === p, `${r.a - r.r} ${fmt(pct(r))}`); }
check("Jun has no expected pct claim (zero variance)", byName("มิ.ย.").a === byName("มิ.ย.").r && !/\| มิ\.ย\. \| 480/.test(md));
check("tooltip table rows in chapter match (ม.ค. ก.พ. มี.ค. พ.ค. ธ.ค.)", Object.keys(expect).every((c) => { const r = byName(c); const line = md.split("\n").find((l) => l.startsWith(`| ${c} | ${r.a} | ${r.r} |`)); return line && line.includes(fmt(pct(r)).replace("-", "−")) && line.includes((r.a - r.r >= 0 ? "+" : "−") + Math.abs(r.a - r.r)); }));

const maxLen = Math.max(...rows.flatMap((r) => [String(r.a).length, String(r.r).length]));
const need = maxLen * 10 * 0.62 + 14, N = rows.length;
const step = (w) => Math.max(1, Math.ceil(need / (w / N)));
check("globalMaxLen 3, N 12, need 32.6 px per label", maxLen === 3 && N === 12 && Math.abs(need - 32.6) < 1e-9, `${maxLen} ${N} ${need}`);
const table = [[391.2, 1], [195.6, 2], [130.4, 3], [97.8, 4]];
check("threshold table: step at lower bound and just below", table.every(([w, s]) => step(w + 0.01) === s && step(w - 0.01) === s + 1 || (s === 1 && step(w + 0.01) === 1 && step(w - 0.01) === 2)));
const months = (w, ) => rows.filter((r) => (r.s - 1) % step(w) === 0 || r.s === rows.length).map((r) => r.s);
check("step 1 shows all 12 months (=24 labels)", months(700).length === 12);
check("step 2 shows 1,3,5,7,9,11,12", months(300).join() === "1,3,5,7,9,11,12");
check("step 3 shows 1,4,7,10,12 (observed at 280x180)", months(150).join() === "1,4,7,10,12");
check("step 4 shows 1,5,9,12", months(110).join() === "1,5,9,12");
check("question 5 answer: width 150 -> 32.6/12.5 = 2.608 -> step 3", step(150) === 3 && Math.abs(need / (150 / 12) - 2.608) < 1e-3);
check("observed months in figure 7-8 caption are 1,4,7,10,12 with the stated label pairs", (() => { const p = (c) => byName(c); return p("ม.ค.").a === 420 && p("ม.ค.").r === 400 && p("เม.ย.").a === 440 && p("เม.ย.").r === 450 && p("ก.ค.").a === 510 && p("ก.ค.").r === 520 && p("ต.ค.").a === 560 && p("ต.ค.").r === 530 && p("ธ.ค.").a === 600 && p("ธ.ค.").r === 570; })());
check("label placement claims: Feb Actual<Ref (380 below), Oct Actual>Ref, Jun equal -> Actual above", byName("ก.พ.").a < byName("ก.พ.").r && byName("ต.ค.").a > byName("ต.ค.").r && byName("มิ.ย.").a === byName("มิ.ย.").r);

// Images and figure numbering.
const imgs = [...md.matchAll(/!\[[^\]]*\]\(\.\.\/images\/chapter-07\/([^)]+)\)/g)].map((x) => x[1]);
check("all referenced images exist", imgs.length > 0 && imgs.every((f) => existsSync(join(root, "images", "chapter-07", f))), imgs.join(", "));
const caps = [...md.matchAll(/^\*ภาพ 7-(\d+) /gm)].map((x) => +x[1]);
check("captions numbered 1..N sequentially, match image count (8)", caps.every((v, i) => v === i + 1) && caps.length === imgs.length && caps.length === 8, JSON.stringify(caps));
const refs = new Set([...md.matchAll(/ภาพ 7-(\d+)/g)].map((x) => +x[1]));
check("every text reference points to an existing figure", [...refs].every((v) => v >= 1 && v <= caps.length), JSON.stringify([...refs]));
check("derived figure 7-8 is disclosed as derived", md.includes("ภาพ 7-8 เป็นภาพที่ผู้เขียนตัดและขยาย") && md.includes("*ภาพ 7-8 ภาพที่ผู้เขียนตัดและขยาย"));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
