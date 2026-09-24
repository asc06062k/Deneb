// Test datasets for T09 (long Category names) and T10 (24 categories).
// Writes CSVs with the same columns as data/DualLineVariance_Workshop_Data.csv (for Power BI)
// and the matching PlotData JSON (for headless Vega tests) built by the reference algorithm.
// Run: node qa/scripts/build-test-datasets.mjs

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { buildPlotData } from "./plotdata-algorithm.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const csv = readFileSync(join(root, "data", "DualLineVariance_Workshop_Data.csv"), "utf8").trim().split(/\r?\n/).slice(1);
const base = csv.map((l) => {
  const [Sort_Order, Category, Actual, Reference] = l.split(",");
  return { Sort_Order: +Sort_Order, Category, Actual: +Actual, Reference: +Reference };
});

// T09: same 12 values, Category names of 24-40 characters (Thai + mixed).
const branches = ["สำนักงานใหญ่กรุงเทพมหานคร", "สาขาเชียงใหม่ภาคเหนือตอนบน", "สาขาขอนแก่นภาคตะวันออกเฉียงเหนือ", "สาขาภูเก็ตภาคใต้ฝั่งอันดามัน"];
const t09 = base.map((r, i) => ({ ...r, Category: `${r.Category} ${branches[i % branches.length]}` }));

// T10: 24 months over two years (2025-2026); year 2 = year 1 shifted with a different
// Actual/Reference offset so crossings still occur.
const months = base.map((r) => r.Category);
const t10 = [
  ...base.map((r, i) => ({ Sort_Order: i + 1, Category: `${months[i]} 68`, Actual: r.Actual, Reference: r.Reference })),
  ...base.map((r, i) => ({ Sort_Order: i + 13, Category: `${months[i]} 69`, Actual: r.Actual + 40, Reference: r.Reference + (i % 2 ? 55 : 25) })),
];

const outDir = join(root, "data", "test");
mkdirSync(outDir, { recursive: true });
for (const [name, rows] of [["T09_LongCategory", t09], ["T10_24Categories", t10]]) {
  const lines = ["Sort_Order,Category,Actual,Reference", ...rows.map((r) => `${r.Sort_Order},${r.Category},${r.Actual},${r.Reference}`)];
  writeFileSync(join(outDir, `DualLineVariance_${name}.csv`), lines.join("\n") + "\n", "utf8");
  const pd = buildPlotData(rows, "Higher is Good");
  if (pd.duplicates.length) throw new Error(`${name}: duplicate categories`);
  const plot = [...pd.originalRows, ...pd.fillRows];
  writeFileSync(join(root, "qa", "scripts", `${name}-plotdata.json`), JSON.stringify(plot, null, 2) + "\n", "utf8");
  console.log(`${name}: ${rows.length} categories, ${plot.length} PlotData rows, longest name ${Math.max(...rows.map((r) => r.Category.length))} chars`);
}
