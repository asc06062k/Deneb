// =============================================================================
// DualLine_PlotData — Power Query (M) transform
// Implements PHASE1_DESIGN_PLAN.md section 2.0 (per-segment fill algorithm),
// section 2.2.1 (Filter_Key for the semantic-model relationship) and
// section 3 (Business_Type normalize-then-stamp).
//
// Inputs expected in the Power BI model before this query:
//   - DualLineVariance_Workshop_Data  (Sort_Order, Category, Actual, Reference)
//   - DualLineVariance_Settings       (Business_Type_Source), exactly 1 row
//
// Paste this as a New Blank Query named "DualLine_PlotData" in Power Query,
// then bind THIS query's Values to the Dual-Line Variance Chart visual —
// never bind DualLineVariance_Workshop_Data directly.
// =============================================================================
let
    // ---- Step 1: load and sort the raw input table --------------------------
    SourceRaw = DualLineVariance_Workshop_Data,
    Sorted = Table.Sort(SourceRaw, {{"Sort_Order", Order.Ascending}}),

    // ---- Step 2: QA guard — reject duplicate Category before building anything
    // (Field contract: Original rows must be unique per Category; T24)
    CategoryList = Table.Column(Sorted, "Category"),
    DistinctCategoryCount = List.Count(List.Distinct(CategoryList)),
    RowCount = Table.RowCount(Sorted),
    DuplicateCheck =
        if DistinctCategoryCount <> RowCount then
            error Error.Record(
                "DualLine.DuplicateCategory",
                "DualLineVariance_Workshop_Data has duplicate Category values. Fix the source data — this query will not guess how to merge them.",
                [DistinctCategoryCount = DistinctCategoryCount, RowCount = RowCount]
            )
        else
            Sorted,

    // ---- Step 3: Blank -> 0 on Actual/Reference (field contract) ------------
    Cleaned = Table.TransformColumns(
        DuplicateCheck,
        {
            {"Actual", each if _ = null then 0 else _, type number},
            {"Reference", each if _ = null then 0 else _, type number}
        }
    ),
    CleanedRecords = Table.ToRecords(Cleaned),

    // ---- Step 4: normalize Business_Type from Settings (section 3) ----------
    SettingsRowCount = Table.RowCount(DualLineVariance_Settings),
    SettingsGuard =
        if SettingsRowCount <> 1 then
            error Error.Record(
                "DualLine.SettingsRowCountInvalid",
                "DualLineVariance_Settings must contain exactly 1 row (Business_Type_Source). Fix the Settings table before this query can run.",
                [SettingsRowCount = SettingsRowCount]
            )
        else
            DualLineVariance_Settings{0}[Business_Type_Source],
    BusinessTypeRaw = Text.Trim(SettingsGuard),
    AllowedBusinessTypes = {"Higher is Good", "Lower is Good"},
    BusinessType =
        if List.Contains(AllowedBusinessTypes, BusinessTypeRaw) then
            BusinessTypeRaw
        else
            "Higher is Good", // fallback per Design Lock — logged nowhere else on purpose;
                               // the QA sanity check below is what actually catches misuse.

    // ---- Step 5: Original rows (Identity — Line/Point/Connector/Tooltip) ----
    OriginalRows = List.Transform(
        CleanedRecords,
        each [
            Row_Type = "Original",
            Category = [Category],
            Sort_Order = [Sort_Order],
            Actual = [Actual],
            Reference = [Reference],
            Plot_Position = [Sort_Order],
            Plot_Actual = [Actual],
            Plot_Reference = [Reference],
            Segment_ID = null,
            Run_Sign = null,
            Business_Type = BusinessType,
            Filter_Key = [Category]
        ]
    ),

    // ---- Step 6: per-segment fill rows (section 2.0, cases A/B/C) -----------
    Sign = (x as number) as number => if x > 0 then 1 else if x < 0 then -1 else 0,

    SegmentCount = List.Count(CleanedRecords) - 1,
    FillRowLists = List.Generate(
        () => [i = 0],
        each [i] < SegmentCount,
        each [i = [i] + 1],
        each
            let
                a = CleanedRecords{[i]},
                b = CleanedRecords{[i] + 1},
                d0 = a[Actual] - a[Reference],
                d1 = b[Actual] - b[Reference],
                Rows =
                    if d0 = 0 and d1 = 0 then
                        // Case A — fully flat segment: no fill, no area to draw.
                        {}
                    else if d0 * d1 < 0 then
                        // Case B — strict crossing: interpolate, split into two
                        // sub-polygons that share the exact crossing point.
                        let
                            t = d0 / (d0 - d1),
                            pos = a[Sort_Order] + t * (b[Sort_Order] - a[Sort_Order]),
                            val = a[Actual] + t * (b[Actual] - a[Actual])
                        in
                            {
                                [Row_Type = "Boundary", Category = null, Sort_Order = null, Actual = null, Reference = null,
                                 Plot_Position = a[Sort_Order], Plot_Actual = a[Actual], Plot_Reference = a[Reference],
                                 Segment_ID = Text.From([i]) & "-a", Run_Sign = Sign(d0), Business_Type = BusinessType, Filter_Key = a[Category]],
                                [Row_Type = "Crossing", Category = null, Sort_Order = null, Actual = null, Reference = null,
                                 Plot_Position = pos, Plot_Actual = val, Plot_Reference = val,
                                 Segment_ID = Text.From([i]) & "-a", Run_Sign = Sign(d0), Business_Type = BusinessType, Filter_Key = a[Category]],
                                [Row_Type = "Crossing", Category = null, Sort_Order = null, Actual = null, Reference = null,
                                 Plot_Position = pos, Plot_Actual = val, Plot_Reference = val,
                                 Segment_ID = Text.From([i]) & "-b", Run_Sign = Sign(d1), Business_Type = BusinessType, Filter_Key = a[Category]],
                                [Row_Type = "Boundary", Category = null, Sort_Order = null, Actual = null, Reference = null,
                                 Plot_Position = b[Sort_Order], Plot_Actual = b[Actual], Plot_Reference = b[Reference],
                                 Segment_ID = Text.From([i]) & "-b", Run_Sign = Sign(d1), Business_Type = BusinessType, Filter_Key = a[Category]]
                            }
                    else
                        // Case C — same sign, or exactly one side is zero: one
                        // polygon for the whole segment, colored by whichever
                        // side is non-zero.
                        let
                            s = if d0 <> 0 then Sign(d0) else Sign(d1)
                        in
                            {
                                [Row_Type = "Boundary", Category = null, Sort_Order = null, Actual = null, Reference = null,
                                 Plot_Position = a[Sort_Order], Plot_Actual = a[Actual], Plot_Reference = a[Reference],
                                 Segment_ID = Text.From([i]), Run_Sign = s, Business_Type = BusinessType, Filter_Key = a[Category]],
                                [Row_Type = "Boundary", Category = null, Sort_Order = null, Actual = null, Reference = null,
                                 Plot_Position = b[Sort_Order], Plot_Actual = b[Actual], Plot_Reference = b[Reference],
                                 Segment_ID = Text.From([i]), Run_Sign = s, Business_Type = BusinessType, Filter_Key = a[Category]]
                            }
            in
                Rows
    ),
    FillRows = List.Combine(List.Transform(FillRowLists, each _)),

    // ---- Step 7: combine Identity + Fill rows into one table ----------------
    AllRows = List.Combine({OriginalRows, FillRows}),
    Result = Table.FromRecords(
        AllRows,
        type table [
            Row_Type = text, Category = nullable text, Sort_Order = nullable number,
            Actual = nullable number, Reference = nullable number,
            Plot_Position = number, Plot_Actual = number, Plot_Reference = number,
            Segment_ID = nullable text, Run_Sign = nullable number,
            Business_Type = text, Filter_Key = text
        ]
    ),

    // ---- Step 8: QA sanity check — must never fire if steps 2-7 are correct -
    DistinctBusinessTypeCount = List.Count(List.Distinct(Table.Column(Result, "Business_Type"))),
    Final =
        if DistinctBusinessTypeCount <> 1 then
            error Error.Record(
                "DualLine.BusinessTypeInconsistent",
                "DISTINCTCOUNT(Business_Type) <> 1 after stamping — this should be impossible; check step 4/5/6.",
                [DistinctBusinessTypeCount = DistinctBusinessTypeCount]
            )
        else
            Result
in
    Final
