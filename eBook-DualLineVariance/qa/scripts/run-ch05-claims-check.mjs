// Verifies manuscript/chapter-05.md against the real Step files and screenshots:
//  - every <!-- excerpt: ... --> JSON block equals the matching part of specs/steps/*.vl.json
//  - numeric claims (Y-domain padding for the Workshop data)
//  - every image referenced exists; figure numbers 5-1..5-7 are unique and sequential
// Run: node qa/scripts/run-ch05-claims-check.mjs
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { isDeepStrictEqual } from "util";
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const md = readFileSync(join(root, "manuscript", "chapter-05.md"), "utf8");
let pass = 0, fail = 0;
const check = (d, ok, detail = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${d}${detail ? " :: " + detail : ""}`); };
const spec = (f) => JSON.parse(readFileSync(join(root, "specs", "steps", `${f}.vl.json`), "utf8"));

const re = /<!-- excerpt: (\S+) (.+?) -->\s*\n```json\n([\s\S]*?)```/g;
let m, n = 0;
while ((m = re.exec(md))) {
  n++;
  const [_, file, what, body] = m;
  const label = `${file} ${what}`;
  let obj;
  try { obj = JSON.parse("{" + body + "}"); } catch (e) { check(label, false, "JSON parse: " + e.message); continue; }
  const s = spec(file);
  if (what === "top") {
    check(label + " (top-level members equal)", Object.keys(obj).every((k) => isDeepStrictEqual(obj[k], s[k])));
  } else if (what === "params") {
    check(label + " (all params equal)", isDeepStrictEqual(obj.params, s.params));
  } else if (what.startsWith("params:")) {
    const names = what.slice(7).split(",");
    check(label + " (named params equal, in order)", isDeepStrictEqual(obj.params.map((p) => p.name), names) && obj.params.every((p) => isDeepStrictEqual(p, s.params.find((q) => q.name === p.name))));
  } else if (what.startsWith("layer:") && what.includes(" encoding.y")) {
    const name = what.slice(6).split(" ")[0];
    check(label, isDeepStrictEqual(obj.y, s.layer.find((l) => l.name === name).encoding.y));
  } else if (what.startsWith("layer:")) {
    const names = what.slice(6).split(",");
    check(label + " (layers equal)", isDeepStrictEqual(obj.layer.map((l) => l.name), names) && obj.layer.every((l) => isDeepStrictEqual(l, s.layer.find((q) => q.name === l.name))));
  } else if (what.startsWith("marks:")) {
    check(label, Object.entries(obj).every(([name, v]) => isDeepStrictEqual(v.mark, s.layer.find((l) => l.name === name).mark)));
  } else check(label, false, "unknown excerpt kind");
}
check("excerpt blocks found (9)", n === 9, `${n}`);

// Cumulative-step claims stated in the chapter.
const S = ["CH05-S01-line-actual", "CH05-S02-line-reference", "CH05-S03-points", "CH05-S04-monotone", "CH05-S05-y-domain"].map(spec);
const names = (x) => x.layer.map((l) => l.name);
check("S02 layer order: line_reference before line_actual", isDeepStrictEqual(names(S[1]), ["line_reference", "line_actual"]));
check("S03 adds two point layers after the lines", isDeepStrictEqual(names(S[2]), ["line_reference", "line_actual", "point_reference", "point_actual_hit_target"]));
check("S04 interpolate monotone on both lines only", S[3].layer.filter((l) => l.mark.interpolate === "monotone").map((l) => l.name).sort().join() === "line_actual,line_reference" && S[2].layer.every((l) => !l.mark.interpolate));
check("S05 adds exactly 5 params", S[4].params.length === S[0].params.length + 5);
check("line layers filter Row_Type == 'Original' in every step", S.every((s) => s.layer.every((l) => JSON.stringify(l.transform) === JSON.stringify([{ filter: "datum.Row_Type == 'Original'" }]))));
check("S01 x is Plot_Position quantitative; y is Plot_Actual", S[0].layer[0].encoding.x.field === "Plot_Position" && S[0].layer[0].encoding.x.type === "quantitative" && S[0].layer[0].encoding.y.field === "Plot_Actual");
check("line style: reference dashed [5,3] amber; actual solid blue", S[1].layer[0].mark.color === "#F59E0B" && isDeepStrictEqual(S[1].layer[0].mark.strokeDash, [5, 3]) && S[1].layer[1].mark.color === "#2563EB" && !S[1].layer[1].mark.strokeDash);
check("point size 40, filled", S[2].layer.filter((l) => l.mark.type === "point").every((l) => l.mark.size === 40 && l.mark.filled === true));
check("point_reference tooltip null; point_actual_hit_target has no tooltip null", S[2].layer.find((l) => l.name === "point_reference").mark.tooltip === null && !("tooltip" in S[2].layer.find((l) => l.name === "point_actual_hit_target").mark));

// Y domain arithmetic from the CSV (independent of the spec's expr).
const rows = readFileSync(join(root, "data", "DualLineVariance_Workshop_Data.csv"), "utf8").trim().split(/\r?\n/).slice(1).map((l) => l.split(",")).map(([, , a, r]) => [+a, +r]);
const all = rows.flat();
const lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo) * 0.18;
check("Workshop min=380 max=600 range=220 pad=39.6", lo === 380 && hi === 600 && Math.abs(pad - 39.6) < 1e-9, `${lo} ${hi} ${pad}`);
check("Y domain = [340.4, 639.6]", Math.abs(lo - pad - 340.4) < 1e-9 && Math.abs(hi + pad - 639.6) < 1e-9);
check("Actual: ม.ค.=420, ก.พ.=380 (min), ธ.ค.=600 (max); Reference ม.ค.=400, ธ.ค.=570", rows[0][0] === 420 && rows[1][0] === 380 && rows[11][0] === 600 && rows[0][1] === 400 && rows[11][1] === 570);
check("Jan actual > ref, Feb actual < ref (lines cross)", rows[0][0] > rows[0][1] && rows[1][0] < rows[1][1]);

// Images and figure numbering.
const imgs = [...md.matchAll(/!\[[^\]]*\]\(\.\.\/images\/chapter-05\/([^)]+)\)/g)].map((x) => x[1]);
check("all referenced images exist", imgs.length > 0 && imgs.every((f) => existsSync(join(root, "images", "chapter-05", f))), imgs.join(", "));
const caps = [...md.matchAll(/^\*ภาพ 5-(\d+) /gm)].map((x) => +x[1]);
check("captions numbered 1..N sequentially and match image count", caps.every((v, i) => v === i + 1) && caps.length === imgs.length, JSON.stringify(caps));
const refs = new Set([...md.matchAll(/ภาพ 5-(\d+)/g)].map((x) => +x[1]));
check("every text reference points to an existing figure", [...refs].every((v) => v >= 1 && v <= caps.length), JSON.stringify([...refs]));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
