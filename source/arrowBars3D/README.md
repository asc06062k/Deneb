# ArrowBars3D — Deneb version

A Vega (v5) spec for the [Deneb](https://deneb.guide) custom visual that reproduces the look
and behaviour of [`arrowBarsViz`](../../../Custom%20viz/arrowBarsViz/src/visual.ts) (source untouched — this
is a separate, independent implementation). Covers every feature of the original **except**
the Pro/Trial license system, which has no equivalent in Deneb.

Validated by running the spec through the real `vega` npm runtime with sample rows (see
`spec.json`'s data/signal graph) — geometry, sorting, conditional formatting and tooltip
output all confirmed to compute correctly. It has not been opened inside Power BI Desktop
itself, so do a normal visual check after pasting it in.

## Setup in Power BI Desktop

1. Add a Deneb visual to the canvas.
2. In the Deneb **Fields** pane, add these fields to the `dataset` data source (rename each
   one exactly as listed — the spec references these names):
   - `category` — your category/dimension column (required)
   - `actual` — the measure that drives the bar (required)
   - `target` — optional measure; when present the bar height/label switch from "Actual" to
     "Actual ÷ Target × 100%" (Ratio %), exactly like the original visual
   - `tooltip1`…`tooltip4` — optional extra measures shown in the tooltip as "Extra 1"…"Extra 4"
3. Open **Edit → Spec** and paste the contents of `spec.json` in wholesale.
4. In **Settings → Vega → Power BI Interactivity**:
   - Keep **Tooltip Handler** on (default) — tooltips are wired via the `tooltip` property
     on the invisible per-bar hit rectangle.
   - Turn on **Expose cross-filtering values for dataset rows** if you want click-to-filter.
     Deneb handles the click/clear events itself; the spec only reads the `__selected__`
     field it injects to dim non-selected bars (see the `fillOpacity` encodes in `spec.json`).

## Tuning

There's no format-pane UI — this spec styles itself entirely from the `signals` block at the
top of `spec.json`. Open the file and edit the values directly (all plain constants, no need
to touch the transform/mark logic below them):

| Signal | Meaning | Default |
|---|---|---|
| `apexRatioRaw` | apex height as % of bar width (10–100) | 20 |
| `riserMidRaw` / `riserBottomRaw` | 3D platform riser heights (px) | 90 / 50 |
| `leanOffsetRaw` | how far the platform leans outward (px) | 80 |
| `showValue` / `showCategory` | toggle the two badge labels | true |
| `valueFont*`, `categoryFont*` | label typography/colors | — |
| `legendShow`, `legendPos` (`left`/`center`/`right`), `legendFontSize` | legend | true / center / 12 |
| `animation` | fade+slide entrance on load | true |
| `sortBy` (`none`/`ratio-asc`/`ratio-desc`) | bar order | none |
| `cfEnabled`, `cfMode` (`gradient`/`rules`), `cfBasedOn` (`ratio`/`goal`/`value`) | conditional formatting | off |
| `cfMinColor`/`cfMidColor`/`cfMaxColor` | gradient mode colors | red/yellow/green |
| `cfRedColor`/`cfYellowColor`/`cfGreenColor`, `cfRedUpTo`/`cfYellowUpTo` | rules mode | same, 80/100 |
| `categoryColorScheme` | Vega color scheme name for per-category color | tableau10 |

## Deliberate simplifications vs. the original TypeScript visual

- **NA hatch**: uses Deneb's built-in `pbiPatternSVG('diagonal-stripe-3', ...)` pattern fill
  instead of a hand-rolled SVG `<pattern>` (raw Vega has no `<defs>` injection point for that;
  Deneb's pattern-fill feature is the supported way to do this and looks the same).
- **Riser shading**: the darker "side" of the platform is a black overlay at partial opacity
  on top of the same shape, instead of computing an actual darker hex color — avoids needing
  hex color math inside a Vega expression.
- **Legend**: single-row horizontal flow (no wrap-to-multiple-rows); still supports
  left/center/right alignment like the original.
- **Value/category badges**: rendered as fully-rounded rectangles (a "stadium" shape) instead
  of a true SVG ellipse, since Vega has no ellipse mark primitive. Visually near-identical.
  Badge width is estimated from character count × font size (same technique the original
  code already used for its own legend sizing), not measured DOM text — good enough for
  short labels, may run slightly wide/narrow for unusual fonts.
- **Number formatting**: uses plain d3-format specifiers (`,.0f`, `.1f`) rather than each
  field's actual Power BI format string — edit the `format(...)` calls in the `bars`/`barsBase`
  data transforms in `spec.json` if you need currency symbols, different decimal places, etc.
- **Animation**: a single fade + slide-in for the whole chart on load, not the original's
  per-bar staggered entrance (Vega core has no built-in per-element tween/delay the way the
  original's D3 code used).
- **High-contrast mode** is not implemented.
