// Independent recomputation of the numeric claims in manuscript/chapter-04.md from the CSV
// (does NOT use qa/scripts/plotdata-algorithm.mjs or workshop-plotdata.json), plus a cross-check
// against workshop-plotdata.json. Run: node qa/scripts/run-ch04-claims-check.mjs
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const lines = readFileSync(join(root, "data", "DualLineVariance_Workshop_Data.csv"), "utf8").trim().split(/\r?\n/).slice(1);
const rows = lines.map((l) => { const [s, c, a, r] = l.split(","); return { s: +s, c, a: +a, r: +r }; }).sort((x, y) => x.s - y.s);
let pass = 0, fail = 0;
const check = (d, ok, detail = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${d}${detail ? " :: " + detail : ""}`); };

let A = 0, B = 0, C = 0; const caseOf = [];
for (let i = 0; i < rows.length - 1; i++) {
  const d0 = rows[i].a - rows[i].r, d1 = rows[i + 1].a - rows[i + 1].r;
  const k = d0 === 0 && d1 === 0 ? "A" : d0 * d1 < 0 ? "B" : "C";
  caseOf.push(k); ({ A, B, C } = { A: A + (k === "A"), B: B + (k === "B"), C: C + (k === "C") });
}
check("12 months, 11 segments", rows.length === 12 && caseOf.length === 11);
check("cases: A=0, B=9, C=2", A === 0 && B === 9 && C === 2, `A=${A} B=${B} C=${C}`);
check("case C segments are พ.ค.-มิ.ย. and มิ.ย.-ก.ค. (indices 4 and 5)", caseOf[4] === "C" && caseOf[5] === "C" && rows[5].c === "มิ.ย." && rows[5].a === rows[5].r);
const fill = B * 4 + C * 2;
check("fill rows = 9*4 + 2*2 = 40; total = 52", fill === 40 && fill + 12 === 52);
check("Boundary = 9*2 + 2*2 = 22; Crossing = 9*2 = 18", B * 2 + C * 2 === 22 && B * 2 === 18);
const t = (a, b) => { const d0 = a.a - a.r, d1 = b.a - b.r; const t = d0 / (d0 - d1); return { t, pos: a.s + t * (b.s - a.s), val: a.a + t * (b.a - a.a) }; };
const j = t(rows[0], rows[1]);
check("ม.ค.-ก.พ.: d0=20, d1=-30, t=0.4, pos=1.4, value=404", rows[0].a - rows[0].r === 20 && rows[1].a - rows[1].r === -30 && Math.abs(j.t - 0.4) < 1e-9 && Math.abs(j.pos - 1.4) < 1e-9 && Math.abs(j.val - 404) < 1e-9, JSON.stringify(j));
const f = t(rows[1], rows[2]);
check("exercise ก.พ.-มี.ค.: case B, pos 2.5", caseOf[1] === "B" && Math.abs(f.pos - 2.5) < 1e-9, JSON.stringify(f));

// Cross-check with the static test dataset used in Phase 2.
const pd = JSON.parse(readFileSync(join(root, "qa", "scripts", "workshop-plotdata.json"), "utf8"));
const cnt = pd.reduce((m, r) => ((m[r.Row_Type] = (m[r.Row_Type] || 0) + 1), m), {});
check("workshop-plotdata.json agrees: 52 = 12/22/18", pd.length === 52 && cnt.Original === 12 && cnt.Boundary === 22 && cnt.Crossing === 18, JSON.stringify(cnt));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
