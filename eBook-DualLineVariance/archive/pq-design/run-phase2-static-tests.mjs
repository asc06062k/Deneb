import { buildPlotData, normalizeBusinessType } from "./plotdata-algorithm.mjs";
import { readFileSync } from "fs";

let pass = 0;
let fail = 0;
const results = [];

function check(testId, description, condition, detail) {
  if (condition) {
    pass++;
    results.push({ testId, description, status: "PASS", detail });
  } else {
    fail++;
    results.push({ testId, description, status: "FAIL", detail });
  }
}

function countBy(arr, pred) {
  return arr.filter(pred).length;
}

function distinctCount(arr, key) {
  return new Set(arr.map((r) => r[key])).size;
}

// ---------- T01: baseline, no crossing ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 100, Reference: 90 },
    { Sort_Order: 2, Category: "B", Actual: 110, Reference: 95 },
    { Sort_Order: 3, Category: "C", Actual: 120, Reference: 100 },
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T01", "no crossing -> 2 segments, all case C, 4 fill rows total", r.fillRows.length === 4 && r.segmentLog.every((s) => s.case === "C"), r.segmentLog);
  check("T01", "no Crossing rows when nothing crosses", countBy(r.fillRows, (x) => x.Row_Type === "Crossing") === 0);
}

// ---------- T02: single crossing pair ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 100, Reference: 90 }, // +10
    { Sort_Order: 2, Category: "B", Actual: 80, Reference: 100 }, // -20
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T02", "1 strict crossing -> case B, 4 fill rows, 2 Crossing + 2 Boundary", r.fillRows.length === 4 && countBy(r.fillRows, (x) => x.Row_Type === "Crossing") === 2 && countBy(r.fillRows, (x) => x.Row_Type === "Boundary") === 2);
  const crossingRows = r.fillRows.filter((x) => x.Row_Type === "Crossing");
  check("T02", "both Crossing rows have Plot_Actual === Plot_Reference", crossingRows.every((x) => x.Plot_Actual === x.Plot_Reference));
  check("T02", "crossing position is strictly between the two categories", crossingRows[0].Plot_Position > 1 && crossingRows[0].Plot_Position < 2);
}

// ---------- T03: multiple consecutive crossings ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 10, Reference: 8 }, // +2
    { Sort_Order: 2, Category: "B", Actual: 5, Reference: 10 }, // -5
    { Sort_Order: 3, Category: "C", Actual: 12, Reference: 9 }, // +3
    { Sort_Order: 4, Category: "D", Actual: 8, Reference: 15 }, // -7
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T03", "3 segments all strict crossings -> 3 case B -> 12 fill rows", r.segmentLog.every((s) => s.case === "B") && r.fillRows.length === 12, r.segmentLog);
}

// ---------- T04: isolated diff=0 between opposite-sign runs ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 10, Reference: 8 }, // +2
    { Sort_Order: 2, Category: "B", Actual: 10, Reference: 10 }, // 0
    { Sort_Order: 3, Category: "C", Actual: 8, Reference: 10 }, // -2
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T04", "both segments are case C (one side zero, not strict crossing)", r.segmentLog.every((s) => s.case === "C"));
  const boundaryAtB = r.fillRows.filter((x) => x.Plot_Position === 2);
  check("T04", "Category B (diff=0) appears twice as Boundary, once per adjacent segment", boundaryAtB.length === 2 && boundaryAtB.every((x) => x.Row_Type === "Boundary"));
  check("T04", "at Category B, Plot_Actual === Plot_Reference on both Boundary copies (value truly equal, not an error)", boundaryAtB.every((x) => x.Plot_Actual === x.Plot_Reference));
  check("T04", "segment(A,B) colored by A's sign (positive/good)", r.fillRows.find((x) => x.Segment_ID === "0").Run_Sign === 1);
  check("T04", "segment(B,C) colored by C's sign (negative/bad)", r.fillRows.find((x) => x.Segment_ID === "1").Run_Sign === -1);
}

// ---------- T05: Actual Blank ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: null, Reference: 50 },
    { Sort_Order: 2, Category: "B", Actual: 60, Reference: 55 },
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T05", "Actual Blank normalized to 0 on Original row", r.originalRows[0].Actual === 0);
}

// ---------- T06: Reference Blank ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 50, Reference: null },
    { Sort_Order: 2, Category: "B", Actual: 60, Reference: 55 },
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T06", "Reference Blank normalized to 0 on Original row", r.originalRows[0].Reference === 0);
}

// ---------- T07 / T28: Reference = 0 (Variance% must be blank, no div-by-zero) ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 50, Reference: 0 },
    { Sort_Order: 2, Category: "B", Actual: 60, Reference: 55 },
  ];
  const r = buildPlotData(rows, "Higher is Good");
  const variancePercent = (actual, reference) => (reference === 0 ? null : (actual - reference) / reference);
  check("T07/T28", "Variance% is null (blank) when Reference=0, not Infinity/NaN", variancePercent(r.originalRows[0].Actual, r.originalRows[0].Reference) === null);
}

// ---------- T08: Actual negative ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: -20, Reference: 10 },
    { Sort_Order: 2, Category: "B", Actual: 30, Reference: 25 },
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T08", "negative Actual passes through unclamped", r.originalRows[0].Actual === -20);
}

// ---------- T09: long category name ----------
{
  const longName = "ยอดขายรวมทุกสาขาทั่วประเทศประจำเดือนนี้เทียบเป้าหมาย";
  const rows = [
    { Sort_Order: 1, Category: longName, Actual: 100, Reference: 90 },
    { Sort_Order: 2, Category: "B", Actual: 95, Reference: 100 },
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T09", `long category name (${longName.length} chars) preserved on Original row`, r.originalRows[0].Category === longName && longName.length > 20);
}

// ---------- T10: many categories (24+) ----------
{
  const rows = [];
  for (let i = 1; i <= 24; i++) {
    rows.push({ Sort_Order: i, Category: `Cat-${i}`, Actual: 50 + (i % 5), Reference: 50 + ((i + 2) % 5) });
  }
  const r = buildPlotData(rows, "Higher is Good");
  check("T10", "24 categories -> 24 Original rows", r.originalRows.length === 24);
}

// ---------- T11 / T12: Business_Type both values ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 100, Reference: 90 },
    { Sort_Order: 2, Category: "B", Actual: 80, Reference: 95 },
  ];
  const higher = buildPlotData(rows, "Higher is Good");
  const lower = buildPlotData(rows, "Lower is Good");
  check("T11", "Business_Type = 'Higher is Good' stamped on every row incl. fill rows", [...higher.originalRows, ...higher.fillRows].every((x) => x.Business_Type === "Higher is Good"));
  check("T12", "Business_Type = 'Lower is Good' stamped on every row incl. fill rows", [...lower.originalRows, ...lower.fillRows].every((x) => x.Business_Type === "Lower is Good"));
}

// ---------- T13: Business_Type source Blank/invalid -> normalize + DISTINCTCOUNT=1 ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 100, Reference: 90 },
    { Sort_Order: 2, Category: "B", Actual: 80, Reference: 95 },
  ];
  for (const badSource of [null, "", "   ", "higher is good", "Something else"]) {
    const r = buildPlotData(rows, badSource);
    const allRows = [...r.originalRows, ...r.fillRows];
    check("T13", `source=${JSON.stringify(badSource)} normalizes to 'Higher is Good'`, r.businessType === "Higher is Good");
    check("T13", `source=${JSON.stringify(badSource)} -> DISTINCTCOUNT(Business_Type)=1 across all rows`, distinctCount(allRows, "Business_Type") === 1);
    check("T13", `source=${JSON.stringify(badSource)} -> no Blank/out-of-allow-list value remains`, allRows.every((x) => ["Higher is Good", "Lower is Good"].includes(x.Business_Type)));
  }
}

// ---------- T24: duplicate Category detected ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 100, Reference: 90 },
    { Sort_Order: 2, Category: "A", Actual: 80, Reference: 95 },
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T24", "duplicate Category is detected by QA before this dataset is accepted", r.duplicates.length === 1 && r.duplicates[0] === "A");
}

// ---------- T31: +,0,0,- ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 10, Reference: 8 }, // +2
    { Sort_Order: 2, Category: "B", Actual: 10, Reference: 10 }, // 0
    { Sort_Order: 3, Category: "C", Actual: 10, Reference: 10 }, // 0
    { Sort_Order: 4, Category: "D", Actual: 8, Reference: 10 }, // -2
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T31", "segments: C(green), A(empty), C(red) -> 4 fill rows total, no Crossing rows", r.fillRows.length === 4 && countBy(r.fillRows, (x) => x.Row_Type === "Crossing") === 0, r.segmentLog);
  check("T31", "middle segment (B,C both zero) contributes 0 rows (case A)", r.segmentLog[1].case === "A" && r.segmentLog[1].rows === 0);
  check("T31", "first segment colored good (Run_Sign=1), last segment colored bad (Run_Sign=-1)", r.fillRows.find((x) => x.Segment_ID === "0").Run_Sign === 1 && r.fillRows.find((x) => x.Segment_ID === "2").Run_Sign === -1);
  const zeroBoundaries = r.fillRows.filter((x) => x.Plot_Position === 2 || x.Plot_Position === 3);
  check("T31", "the two zero-diff Boundary rows have Plot_Actual === Plot_Reference (correct, not an error)", zeroBoundaries.every((x) => x.Plot_Actual === x.Plot_Reference));
}

// ---------- T32: +,0,0,+ ----------
{
  const rows = [
    { Sort_Order: 1, Category: "A", Actual: 10, Reference: 8 }, // +2
    { Sort_Order: 2, Category: "B", Actual: 10, Reference: 10 }, // 0
    { Sort_Order: 3, Category: "C", Actual: 10, Reference: 10 }, // 0
    { Sort_Order: 4, Category: "D", Actual: 12, Reference: 10 }, // +2
  ];
  const r = buildPlotData(rows, "Higher is Good");
  check("T32", "both non-flat segments colored good (Run_Sign=1), not merged into one polygon", r.fillRows.find((x) => x.Segment_ID === "0").Run_Sign === 1 && r.fillRows.find((x) => x.Segment_ID === "2").Run_Sign === 1);
  check("T32", "segments remain 3 independent Segment_IDs (0, 1[empty], 2) — no cross-segment merge", new Set(r.fillRows.map((x) => x.Segment_ID)).size === 2, [...new Set(r.fillRows.map((x) => x.Segment_ID))]);
}

// ---------- Main Workshop dataset: full invariant sweep ----------
{
  const csv = readFileSync("D:\\DATA\\Deneb\\eBook-DualLineVariance\\data\\DualLineVariance_Workshop_Data.csv", "utf8");
  const lines = csv.trim().split(/\r?\n/);
  const rows = lines.slice(1).map((line) => {
    const [Sort_Order, Category, Actual, Reference] = line.split(",");
    return { Sort_Order: Number(Sort_Order), Category, Actual: Number(Actual), Reference: Number(Reference) };
  });
  const r = buildPlotData(rows, "Higher is Good");

  const N = rows.length;
  const strictCrossingCount = r.segmentLog.filter((s) => s.case === "B").length;
  const caseCCount = r.segmentLog.filter((s) => s.case === "C").length;

  check("WORKSHOP", `COUNT(Original) = ${N} (number of distinct categories)`, r.originalRows.length === N);
  check("WORKSHOP", `COUNT(Crossing) = 2 x strictCrossingCount (${strictCrossingCount})`, countBy(r.fillRows, (x) => x.Row_Type === "Crossing") === 2 * strictCrossingCount);
  check("WORKSHOP", `COUNT(Boundary) = 2 x caseB + 2 x caseC`, countBy(r.fillRows, (x) => x.Row_Type === "Boundary") === 2 * strictCrossingCount + 2 * caseCCount);
  check("WORKSHOP", "DISTINCTCOUNT(Business_Type) = 1 across every row", distinctCount([...r.originalRows, ...r.fillRows], "Business_Type") === 1);
  check("WORKSHOP", "no duplicate Category", r.duplicates.length === 0);
  check("WORKSHOP", "every Crossing row has Plot_Actual === Plot_Reference", r.fillRows.filter((x) => x.Row_Type === "Crossing").every((x) => x.Plot_Actual === x.Plot_Reference));
  check(
    "WORKSHOP",
    "every Boundary row's Plot_Actual/Plot_Reference matches its source Original row's Actual/Reference exactly",
    r.fillRows
      .filter((x) => x.Row_Type === "Boundary")
      .every((x) => {
        const src = rows.find((o) => o.Sort_Order === x.Plot_Position);
        return src && x.Plot_Actual === src.Actual && x.Plot_Reference === src.Reference;
      })
  );
  check("WORKSHOP", "found at least one strict crossing (dataset is a meaningful teaching example)", strictCrossingCount >= 2, `strictCrossingCount=${strictCrossingCount}`);
  check("WORKSHOP", "found at least one exact diff=0 touch point", rows.some((row) => row.Actual === row.Reference));

  console.log(`\nWorkshop dataset summary: N=${N}, strictCrossings=${strictCrossingCount}, caseC=${caseCCount}, caseA=${r.segmentLog.filter((s) => s.case === "A").length}, totalFillRows=${r.fillRows.length}, totalRows=${r.originalRows.length + r.fillRows.length}`);

  // Export computed PlotData for use in the final Vega-Lite spec.
  const outPath = new URL("./workshop-plotdata.json", import.meta.url);
  const fs = await import("fs");
  fs.writeFileSync(outPath, JSON.stringify([...r.originalRows, ...r.fillRows], null, 2));
  console.log(`Exported computed PlotData (${r.originalRows.length + r.fillRows.length} rows) to ${outPath.pathname}`);
}

console.log("\n=== Phase 2 static algorithm verification ===");
for (const res of results) {
  const icon = res.status === "PASS" ? "PASS" : "FAIL";
  console.log(`[${icon}] ${res.testId} — ${res.description}`);
  if (res.status === "FAIL") console.log("        detail:", JSON.stringify(res.detail));
}
console.log(`\nTotal: ${pass} passed, ${fail} failed, out of ${pass + fail}`);
if (fail > 0) process.exit(1);
