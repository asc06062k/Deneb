// Reference implementation of the Phase 1 Design Plan per-segment algorithm
// (PHASE1_DESIGN_PLAN.md section 2.0), used to verify invariants before
// translating to Power Query M. Not shipped to readers.

const ALLOWED_BUSINESS_TYPES = ["Higher is Good", "Lower is Good"];

export function normalizeBusinessType(raw) {
  const trimmed = (raw ?? "").toString().trim();
  return ALLOWED_BUSINESS_TYPES.includes(trimmed) ? trimmed : "Higher is Good";
}

function sign(x) {
  if (x > 0) return 1;
  if (x < 0) return -1;
  return 0;
}

// rows: [{Sort_Order, Category, Actual, Reference}], must be pre-sorted by Sort_Order.
// Actual/Reference blank(null/undefined) -> 0 per field contract, applied here.
export function buildPlotData(rows, businessTypeSourceRaw) {
  const businessType = normalizeBusinessType(businessTypeSourceRaw);

  const categories = rows.map((r) => r.Category);
  const dupSet = new Set();
  const duplicates = [];
  for (const c of categories) {
    if (dupSet.has(c)) duplicates.push(c);
    dupSet.add(c);
  }

  const clean = rows.map((r) => ({
    Sort_Order: r.Sort_Order,
    Category: r.Category,
    Actual: r.Actual == null ? 0 : r.Actual,
    Reference: r.Reference == null ? 0 : r.Reference,
  }));

  const originalRows = clean.map((r) => ({
    Row_Type: "Original",
    Category: r.Category,
    Sort_Order: r.Sort_Order,
    Actual: r.Actual,
    Reference: r.Reference,
    Plot_Position: r.Sort_Order,
    Plot_Actual: r.Actual,
    Plot_Reference: r.Reference,
    Segment_ID: null,
    Run_Sign: null,
    Business_Type: businessType,
    Filter_Key: r.Category,
  }));

  const fillRows = [];
  const segmentLog = [];

  for (let i = 0; i < clean.length - 1; i++) {
    const a = clean[i];
    const b = clean[i + 1];
    const d0 = a.Actual - a.Reference;
    const d1 = b.Actual - b.Reference;

    if (d0 === 0 && d1 === 0) {
      segmentLog.push({ i, case: "A", rows: 0 });
      continue;
    }

    if (d0 * d1 < 0) {
      const t = d0 / (d0 - d1);
      const pos = a.Sort_Order + t * (b.Sort_Order - a.Sort_Order);
      const val = a.Actual + t * (b.Actual - a.Actual);
      const valRef = a.Reference + t * (b.Reference - a.Reference);
      // val and valRef must coincide (both represent the crossing Y); assert closeness.
      const closeEnough = Math.abs(val - valRef) < 1e-9;

      fillRows.push({
        Row_Type: "Boundary", Category: null, Sort_Order: null,
        Actual: null, Reference: null,
        Plot_Position: a.Sort_Order, Plot_Actual: a.Actual, Plot_Reference: a.Reference,
        Segment_ID: `${i}-a`, Run_Sign: sign(d0), Business_Type: businessType, Filter_Key: a.Category,
      });
      fillRows.push({
        Row_Type: "Crossing", Category: null, Sort_Order: null,
        Actual: null, Reference: null,
        Plot_Position: pos, Plot_Actual: val, Plot_Reference: val,
        Segment_ID: `${i}-a`, Run_Sign: sign(d0), Business_Type: businessType, Filter_Key: a.Category,
      });
      fillRows.push({
        Row_Type: "Crossing", Category: null, Sort_Order: null,
        Actual: null, Reference: null,
        Plot_Position: pos, Plot_Actual: val, Plot_Reference: val,
        Segment_ID: `${i}-b`, Run_Sign: sign(d1), Business_Type: businessType, Filter_Key: a.Category,
      });
      fillRows.push({
        Row_Type: "Boundary", Category: null, Sort_Order: null,
        Actual: null, Reference: null,
        Plot_Position: b.Sort_Order, Plot_Actual: b.Actual, Plot_Reference: b.Reference,
        Segment_ID: `${i}-b`, Run_Sign: sign(d1), Business_Type: businessType, Filter_Key: a.Category,
      });
      segmentLog.push({ i, case: "B", rows: 4, crossingCloseEnough: closeEnough });
    } else {
      const s = d0 !== 0 ? sign(d0) : sign(d1);
      fillRows.push({
        Row_Type: "Boundary", Category: null, Sort_Order: null,
        Actual: null, Reference: null,
        Plot_Position: a.Sort_Order, Plot_Actual: a.Actual, Plot_Reference: a.Reference,
        Segment_ID: `${i}`, Run_Sign: s, Business_Type: businessType, Filter_Key: a.Category,
      });
      fillRows.push({
        Row_Type: "Boundary", Category: null, Sort_Order: null,
        Actual: null, Reference: null,
        Plot_Position: b.Sort_Order, Plot_Actual: b.Actual, Plot_Reference: b.Reference,
        Segment_ID: `${i}`, Run_Sign: s, Business_Type: businessType, Filter_Key: a.Category,
      });
      segmentLog.push({ i, case: "C", rows: 2 });
    }
  }

  return { originalRows, fillRows, businessType, duplicates, segmentLog };
}
