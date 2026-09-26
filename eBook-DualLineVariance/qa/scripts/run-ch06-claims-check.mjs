// Verifies manuscript/chapter-06.md against the real Step files, the CSV and screenshots:
//  - every <!-- excerpt: ... --> JSON block equals the matching layer in specs/steps/*.vl.json
//  - cumulative layer order / structure claims per step
//  - Good/Bad classification per month recomputed from the CSV (Higher is Good and Lower is Good)
//  - every image referenced exists; figures 6-1..6-6 sequential
// Run: node qa/scripts/run-ch06-claims-check.mjs
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { isDeepStrictEqual } from "util";
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const md = readFileSync(join(root, "manuscript", "chapter-06.md"), "utf8");
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
  } else check(label, false, "unknown excerpt kind");
}
check("excerpt blocks found (3)", n === 3, `${n}`);

const S5 = spec("CH05-S05-y-domain"), S1 = spec("CH06-S01-variance-area"), S2 = spec("CH06-S02-bad-area-border"), S3 = spec("CH06-S03-connector-rule");
const names = (x) => x.layer.map((l) => l.name);
const j = (l) => JSON.stringify(l);
check("S01 = CH05-S05 layers + variance_area first (params identical)", names(S1)[0] === "variance_area" && j(S1.layer.slice(1)) === j(S5.layer) && j(S1.params) === j(S5.params));
check("S02 layer order", isDeepStrictEqual(names(S2), ["variance_area", "bad_area_border_actual", "bad_area_border_reference", "line_reference", "line_actual", "point_reference", "point_actual_hit_target"]));
check("S03 layer order (connector before lines and points)", isDeepStrictEqual(names(S3), ["variance_area", "bad_area_border_actual", "bad_area_border_reference", "connector_rule", "line_reference", "line_actual", "point_reference", "point_actual_hit_target"]));
check("S02 = S01 with the two border layers inserted after variance_area", j(S2.layer.filter((l) => !l.name.startsWith("bad_area"))) === j(S1.layer));
check("S03 = S02 with connector_rule inserted", j(S3.layer.filter((l) => l.name !== "connector_rule")) === j(S2.layer));
const area = S1.layer[0];
check("area: type area, opacity 0.35, tooltip null, y=Plot_Actual, y2=Plot_Reference, detail=Segment_ID", area.mark.type === "area" && area.mark.opacity === 0.35 && area.mark.tooltip === null && area.encoding.y.field === "Plot_Actual" && area.encoding.y2.field === "Plot_Reference" && area.encoding.detail.field === "Segment_ID");
check("area filter Boundary||Crossing; Good #0F766E else Bad #B45309; stroke same; strokeWidth 1", area.transform[0].filter === "datum.Row_Type == 'Boundary' || datum.Row_Type == 'Crossing'" && area.encoding.color.condition.value === "#0F766E" && area.encoding.color.value === "#B45309" && area.encoding.stroke.condition.value === "#0F766E" && area.encoding.stroke.value === "#B45309" && area.encoding.strokeWidth.value === 1);
check("area test uses Run_Sign > 0 for Higher, < 0 for Lower", area.encoding.color.condition.test === "(datum.Business_Type == 'Higher is Good' && datum.Run_Sign > 0) || (datum.Business_Type == 'Lower is Good' && datum.Run_Sign < 0)");
const bA = S2.layer.find((l) => l.name === "bad_area_border_actual"), bR = S2.layer.find((l) => l.name === "bad_area_border_reference");
check("borders: line, dash [3,2], width 1, #B45309, filter negates Good test", [bA, bR].every((l) => l.mark.type === "line" && isDeepStrictEqual(l.mark.strokeDash, [3, 2]) && l.mark.strokeWidth === 1 && l.mark.color === "#B45309" && l.transform[0].filter.includes("!((datum.Business_Type == 'Higher is Good' && datum.Run_Sign > 0)")));
check("borders: actual uses Plot_Actual, reference uses Plot_Reference, detail Segment_ID", bA.encoding.y.field === "Plot_Actual" && bR.encoding.y.field === "Plot_Reference" && [bA, bR].every((l) => l.encoding.detail.field === "Segment_ID"));
check("reference line dash is [5,3] (borders finer)", isDeepStrictEqual(S3.layer.find((l) => l.name === "line_reference").mark.strokeDash, [5, 3]));
const con = S3.layer.find((l) => l.name === "connector_rule");
check("connector: rule on Original rows, y=Plot_Actual y2=Plot_Reference, width 3 Good / 2 Bad, tooltip null", con.mark.type === "rule" && con.mark.tooltip === null && con.transform[0].filter === "datum.Row_Type == 'Original'" && con.encoding.y.field === "Plot_Actual" && con.encoding.y2.field === "Plot_Reference" && con.encoding.strokeWidth.condition.value === 3 && con.encoding.strokeWidth.value === 2);
check("connector test compares Plot_Actual with Plot_Reference (strict), not Run_Sign", con.encoding.color.condition.test.includes("datum.Plot_Actual > datum.Plot_Reference") && con.encoding.color.condition.test.includes("datum.Plot_Actual < datum.Plot_Reference") && !con.encoding.color.condition.test.includes("Run_Sign"));

// Good/Bad per month recomputed from the CSV.
const rows = readFileSync(join(root, "data", "DualLineVariance_Workshop_Data.csv"), "utf8").trim().split(/\r?\n/).slice(1).map((l) => l.split(","));
const diff = rows.map(([, , a, r]) => +a - +r);
check("diff row in 6.1 = +20 -30 +30 -10 +30 0 -10 +30 -20 +30 -20 +30", diff.join() === [20, -30, 30, -10, 30, 0, -10, 30, -20, 30, -20, 30].join(), diff.join());
const good = (d, bt) => bt === "Higher is Good" ? d > 0 : d < 0;
check("Higher is Good months = ม.ค. มี.ค. พ.ค. ส.ค. ต.ค. ธ.ค. (6)", rows.filter((_, i) => good(diff[i], "Higher is Good")).map((r) => r[1]).join(" ") === "ม.ค. มี.ค. พ.ค. ส.ค. ต.ค. ธ.ค.");
check("Higher is Good, Bad months incl. equal = ก.พ. เม.ย. มิ.ย. ก.ค. ก.ย. พ.ย.", rows.filter((_, i) => !good(diff[i], "Higher is Good")).map((r) => r[1]).join(" ") === "ก.พ. เม.ย. มิ.ย. ก.ค. ก.ย. พ.ย.");
const conn = diff.filter((d) => d !== 0);
check("connectors visible = 11: Good 6 (thick) / Bad 5 (thin) under Higher is Good", conn.length === 11 && conn.filter((d) => d > 0).length === 6 && conn.filter((d) => d < 0).length === 5);
check("Lower is Good flips: Jan Bad, Feb Good", !good(diff[0], "Lower is Good") && good(diff[1], "Lower is Good"));
check("Jun diff 0 -> Bad colour but zero-length under both directions", diff[5] === 0 && !good(0, "Higher is Good") && !good(0, "Lower is Good"));

// PlotData structure claims (same algorithm output as chapter 4).
const pd = JSON.parse(readFileSync(join(root, "qa", "scripts", "workshop-plotdata.json"), "utf8"));
const seg = [...new Set(pd.filter((r) => r.Row_Type !== "Original").map((r) => r.Segment_ID))];
check("9 crossing segments (18 a/b ids) + 2 touching segments (4, 5)", seg.filter((s) => s.includes("-")).length === 18 && seg.filter((s) => !s.includes("-")).join() === "4,5");
check("May-Jun segment 4 is Run_Sign +1 (Good), Jun-Jul segment 5 is -1 (Bad)", pd.filter((r) => r.Segment_ID === "4").every((r) => r.Run_Sign === 1) && pd.filter((r) => r.Segment_ID === "5").every((r) => r.Run_Sign === -1));
check("Jan-Feb crossing at 1.4 (Good then Bad)", pd.some((r) => r.Segment_ID === "0-a" && r.Plot_Position === 1.4 && r.Run_Sign === 1) && pd.some((r) => r.Segment_ID === "0-b" && r.Plot_Position === 1.4 && r.Run_Sign === -1));
check("Sep-Oct (8) starts Bad then Good", pd.some((r) => r.Segment_ID === "8-a" && r.Run_Sign === -1) && pd.some((r) => r.Segment_ID === "8-b" && r.Run_Sign === 1));

// Images and figure numbering.
const imgs = [...md.matchAll(/!\[[^\]]*\]\(\.\.\/images\/chapter-06\/([^)]+)\)/g)].map((x) => x[1]);
check("all referenced images exist", imgs.length > 0 && imgs.every((f) => existsSync(join(root, "images", "chapter-06", f))), imgs.join(", "));
const caps = [...md.matchAll(/^\*ภาพ 6-(\d+) /gm)].map((x) => +x[1]);
check("captions numbered 1..N sequentially, match image count (6)", caps.every((v, i) => v === i + 1) && caps.length === imgs.length && caps.length === 6, JSON.stringify(caps));
const refs = new Set([...md.matchAll(/ภาพ 6-(\d+)/g)].map((x) => +x[1]));
check("every text reference points to an existing figure", [...refs].every((v) => v >= 1 && v <= caps.length), JSON.stringify([...refs]));
check("derived figure 6-3 is disclosed as derived, not a screenshot", md.includes("ภาพ 6-3 เป็นภาพที่ผู้เขียนตัดและขยาย") && md.includes("*ภาพ 6-3 ภาพที่ผู้เขียนตัดและขยาย"));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
