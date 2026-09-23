# BudgetFunnel — Deneb version

A Vega (v5) spec for the [Deneb](https://deneb.guide) custom visual that reproduces the look
and behaviour of [`budgetFunnelViz`](../../../Custom%20viz/budgetFunnelViz/src/visual.ts) (source untouched —
this is a separate, independent implementation). Covers every feature of the original
**except** the Pro/Trial license system, which has no equivalent in Deneb.

Validated by running the spec through the real `vega` npm runtime with three sample scenarios
(with Plan, without Plan, and a tiny Actual that triggers the floor indicator) — every
computed value (funnel widths, ratios, formatted labels, banded colors, tooltip text, the
floor-cap flag) matched the original TypeScript logic, and the full rendered SVG output was
inspected directly (not just the data pipeline) to confirm every mark gets a real `d`/position
— an earlier draft had a Vega nesting bug (a plain `group` mark nested inside another group
silently loses its parent's row data two levels down) that produced an entirely blank chart;
the current version avoids that by keeping all layer marks flat, each with an explicit
`from: {data: "stagesFinal"}`, the same pattern already proven working in `arrowBars3D`.

## Setup in Power BI Desktop

1. Add a Deneb visual to the canvas.
2. In the Deneb **Fields** pane, add these fields to the `dataset` data source (rename each
   one exactly as listed — the spec references these names):
   - `approved` — the "Approved Budget" measure (required)
   - `actual` — the "Actual Spend" measure (required)
   - `plan` — optional "Plan Budget" measure; when present the funnel gets a 3rd top layer
     and Approved is shown as a % of Plan. When absent, Approved becomes the 100% top layer,
     exactly like the original visual.
   - `tooltip1`…`tooltip4` — optional extra fields shown in the tooltip as "Extra 1"…"Extra 4"
3. Open **Edit → Spec** and paste the contents of `spec.json` in wholesale.
4. In **Project setup → Tooltips**, turn **Power BI tooltip handler OFF**. This visual's three
   funnel layers are computed from aggregated totals rather than being literal per-row
   `dataset` records, and Power BI's own tooltip handler couldn't reconcile that even after
   preserving row identity through the pipeline — it silently showed nothing. Vega's own
   built-in tooltip (used when the handler is off) renders the exact same content correctly,
   confirmed working. This visual has no click/cross-filter behaviour in the original either,
   so no other interactivity setting is needed.

   Vega's built-in tooltip is drawn *inside* the visual's own frame, so it is clipped if it is
   wider/taller than the space around the cursor (Vega tries bottom-right, bottom-left, top-right,
   top-left and falls back to top-left, which overflows). The tooltip content is therefore kept
   compact: short row labels (`Plan`, `Approved`, `vs Plan`, `Actual`, `vs Approved`,
   `Remaining`) and the floor-cap `Note` split over **two table rows** (`Note` / blank key). A `\n`
   inside one value does not work — Deneb's tooltip collapses it to a single line. Checked in a
   360×340 frame with the cursor over every layer: about 127 px wide without the Note and
   153 × 146 px with it, fully visible. Extra fields (`tooltip1`…`tooltip4`) with long text make it wider
   again, and a visual much narrower than ~340 px can still clip it.

## Tuning

There's no format-pane UI — this spec styles itself entirely from the `signals` block at the
top of `spec.json`. Open the file and edit the values directly:

| Signal group | Meaning | Notable defaults |
|---|---|---|
| `showSideLabels`, `showArrows`, `showBottomRemainLabel`, `backgroundColor`, `backgroundTransparency` | general layout toggles | true / true / true / `#F8FAFC` / 100 (fully transparent) |
| `floorShow`, `floorThresholdPercent`, `floorLineColor`, `floorLineStyle`, `floorLineWidth` | minimum-width readability floor + its dashed marker | true / 14 / `#0891B2` / dashed / 1.6 |
| `planColor`, `approvedColor`, `actualColor`, `borderColor`, `borderWidth` | layer fill/border | blue / violet / teal / white / 1.2 |
| `approvedConditional`/`actualConditional` + `*Threshold1`/`*Threshold2` + `*ColorLow`/`Mid`/`High` | red/amber/green banding by ratio | off by default |
| `planFieldLabel`/`approvedFieldLabel`/`actualFieldLabel` | side-label text (since Deneb doesn't expose the mapped field's real display name to the spec) | "Plan Budget" / "Approved Budget" / "Actual Spend" — **edit these to match your real field names** |
| `planCenterLabel`/`approvedCenterLabel`/`actualCenterLabel` | 2nd line of each layer's center label | "Plan" / "Approved" / "of Approved" |
| `plan*`/`approved*`/`actual*` font/background/unit/decimals signals | per-layer center-label styling + number formatting (`Auto`/`K`/`M`/`B`/`T`) | mirrors the original's per-stage format cards |
| `sideFont*`, `valueFont*`, `showSideBackground`, `showValueBackground`, `sideLineColor`, `sideLineWidth` | side label (field name + value, outside the funnel) styling | dark charcoal text, thin gray connector lines |
| `remaining*` | the "Remaining" row under the funnel (Approved − Actual) | dark charcoal text |

## Deliberate simplifications vs. the original TypeScript visual

- **Field display names**: Deneb doesn't hand the spec each mapped field's real Power BI
  display name, so the side-label text comes from the editable `planFieldLabel` /
  `approvedFieldLabel` / `actualFieldLabel` signals instead of being read automatically —
  set these to match your actual field names.
- **Gradient shading**: the original computes a true 5-stop `lighten()/darken()` gradient per
  layer color. This spec gets the identical visual result (RGB alpha-blending white/black over
  an opaque color is mathematically the same as mixing white/black into it) by layering two
  extra translucent white/black gradient overlays on top of the solid-color shape, instead of
  computing mixed hex colors — Vega expressions have no hex color math built in.
- **Glow filter**: the original's soft blur halo (`feGaussianBlur` SVG filter) is dropped.
  Raw Vega specs have no way to declare `<filter>` defs the way Deneb's pattern-fill feature
  lets you declare patterns; the layers still have their border, shading and hover lift.
- **Notch highlight**: the thin bright stroke traced inside each V-notch divider is omitted;
  the notch shape itself (the divider "arrow") is fully reproduced.
- **Rim ellipse color**: the first layer's inner-rim shadow uses a flat black overlay at low
  opacity instead of a darkened version of that layer's own color (same hex-math limitation
  as the gradient above).
- **No entrance animation**: the original staggers a fade+slide-in per layer on load/data
  change. This spec drops it entirely — driving it correctly needs a live timer signal read
  directly inside each mark's own `encode.update` (not baked into a data field, and not
  inherited through a nested group two levels deep, both of which silently break in Vega).
  Rather than risk another invisible-chart bug for a cosmetic effect, the layers just render
  immediately at full opacity. Hover still works: hovering a layer highlights its border and
  connector lines/labels.
- **High-contrast mode** and the `depth` funnel setting are not implemented — `depth` has no
  visible effect in the original source either (dead setting), so nothing is lost there.
- **Plan = 0** (deliberate change): the original computes Approved as `0 %` of Plan (a 0 % stub at
  the minimum width). Here a Plan total of 0 is treated as "no usable baseline": the Plan layer is
  drawn as a faint dashed outline (fill tunable via `ghostFillOpacity`) labelled `0%` / `Plan`,
  Approved becomes the 100 % reference exactly like when no Plan field is bound, Actual is its %
  of Approved, the conditional Approved color is skipped (a ratio against 0 is meaningless), and
  the tooltip shows `vs Plan: N/A`. A blank/null Plan still hides the Plan layer entirely.
- **Approved = 0** (deliberate change): the Approved layer is drawn the same way as the zero-Plan
  layer — a faint dashed outline in the Approved color, labelled `0%` / `Approved`. Its width still
  follows the normal sizing (100 % reference, or Approved-vs-Plan), the floor `*` marker is not shown on
  it, and Actual continues below as a floor-width stub (`0%` of Approved).
