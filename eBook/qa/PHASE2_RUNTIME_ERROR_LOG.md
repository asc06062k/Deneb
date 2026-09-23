# Phase 2 Runtime Error Log

## 2026-09-21 — Deneb Editor screenshot

Evidence: user supplied screenshot `codex-clipboard-933d9123-3442-4cf9-8a0c-86843f3d6fd0.png`.

Observed:

- Project setup has **Provider = Vega** selected.
- Log shows `VegaEmbed error: Duplicate signal name: "rowSelect_tuple"`.
- Log shows `Validation: /data must be array of #/properties/data/type`.

Diagnosis:

- `eBook/specs/Bullet_Chart_Prototype_Draft.json` is a **Vega-Lite** specification. Its schema is `https://vega.github.io/schema/vega-lite/v5.json`, its `data` is `{ "name": "dataset" }`, and its `params` selection is compiled by Vega-Lite into signals such as `rowSelect_tuple`.
- Pasting that file while Provider = Vega makes the Vega parser validate Vega-Lite objects as Vega objects. The `/data must be array` warning is the provider mismatch. The duplicate signal is a secondary symptom of the invalid provider/spec state or stale selection state in the editor; the file contains only one `rowSelect` parameter.

Correction procedure:

1. In Project setup, select **Vega-Lite**.
2. Create a new blank Vega-Lite specification, or clear the current editor before pasting. Do not append the JSON to an existing Vega specification.
3. Paste the complete contents of `Bullet_Chart_Prototype_Draft.json` into the Specification tab and run it.
4. If the old signal error remains, close the current specification and create a new Vega-Lite specification so stale compiled signals are discarded.
5. Confirm the log no longer contains `/data must be array` or `Duplicate signal name`; record the actual Data Pane field names next.

## Corrective revision

The draft was reduced to a baseline render candidate:

- removed the selection `params` block temporarily, so no `rowSelect_tuple` signal is generated;
- replaced unsupported `scale.domain.fields` with a numeric domain `[-100, 1500000000]` so the schema validator receives an array;
- removed the top-level selection-dependent opacity encoding while validating the six static layers.

The JSON still parses successfully. After the baseline renders, selection and a data-driven domain will be added as separate, tested revisions. This evidence does not prove the chart renders yet. The prototype remains at Phase 2 runtime validation until the corrected specification is run and the visual output is captured from Power BI Desktop.

## Render observation from the supplied screenshot

The baseline did render, but the shared raw-value domain made the large-value KPI dominate the axis. The other KPI bars were visually compressed near zero. This is a design defect for a multi-KPI bullet chart because the rows use different units and magnitudes.

The next candidate is [Bullet_Chart_Prototype_Normalized.json](../specs/Bullet_Chart_Prototype_Normalized.json). It calculates ratios against each row's positive Target (`Actual / Target`, range endpoints divided by Target), uses a fixed ratio domain from -50% to 150%, and keeps raw Actual/Target/Variance in the tooltip. It has been JSON-parsed locally but still requires a Deneb render check.

## Normalized render observation

The supplied screenshot confirms the normalized bars are readable across rows. It also exposed a marker defect: the Target rule rendered as a horizontal baseline and appeared on rows with Target N/A. The normalized candidate was patched to set `orient: "vertical"` and filter the rule layer to valid positive Target values. Re-run the patched file before recording the prototype as passed.

The following supplied screenshot confirms the patch:

- Actual bars are visible across the ratio domain, including -20%, 60%, 70%, 82.3%, 90%, 100% and 125%.
- Positive Target values show a vertical marker at 100%.
- Target = 0/Blank rows show `Target N/A` and no marker.
- Actual Blank shows the missing-state label without a fabricated bar.

This is evidence that the normalized static visual renders correctly for the visible fixtures. It does not yet pass the full Phase 2 gate because selection, cross-highlight, resize/scroll and performance remain untested.

## Cross-highlight field evidence

The supplied Project setup screenshot confirms `Expose cross-highlight values for measures` is enabled and the Data pane exposes `Actual Value__highlight`. The field is `null` when no external highlight is active, which is expected. The normalized specification now includes a filtered highlight layer using this exact field; re-test with another visual set to Highlight and capture the Data pane plus Preview.

The following supplied screenshot confirms the re-test: selecting rows in the Table produces faded base bars plus darker highlighted bars in Deneb. T16 is recorded as PASS.
