# BulletChart — Deneb version

A Vega (v5) spec for the [Deneb](https://deneb.guide) custom visual that reproduces the look
and behaviour of [`bulletChart`](../../../Custom%20viz/bulletChart/src/visual.ts) (source untouched — this is a
separate, independent implementation). Covers every feature of the original **except** the
Pro/Trial license system, which has no equivalent in Deneb — so everything the original locks
behind a license (Bullet card, Status Label card, >5 categories) is simply always on here.

## How it was checked

- **Numbers vs. the original**: the spec was run through the real `vega` 5.33 runtime against a
  line-by-line JavaScript mirror of the layout/formatting/status math in `visual.ts` (using d3's
  own `scaleLinear().nice().ticks()` for the axis). 600+ assertions over 17 scenarios — default
  data, 1-decimal, K/M/B/None display units, conditional bar colors, axis off, value labels off,
  extra status band, 12 rows (cap 10), no cap, short viewport, blank/null/string/negative/zero-target
  rows, Thai + very long category names, all-negative data, empty dataset, tiny viewport,
  cross-filter dimming — chart margins, row positions, bar widths, target x, value/target/variance
  text, bar colors and status text all matched. The only differences are the ones listed under
  *Deliberate differences* below.
- **Rendering**: opened in a real browser with the SVG renderer and inspected visually (normal,
  conditional colors + status pills, edge cases, 10 rows in a short viewport, a small 300×150 viewport,
  empty state, dimmed rows; a 50×40 viewport was only checked numerically). One bug found this way (axis/gridlines still visible on an empty dataset)
  was fixed.
- **Animation/blink**: sampled in the browser — Target tick slides out first, Actual bars grow
  ~180 ms later and settle on the exact final geometry; the "OVER BURN" blink oscillates 0.25–1.0
  on a 1.6 s cycle like the original CSS keyframes.
- **Not tested inside Power BI Desktop / the Deneb visual itself.** Do a normal visual check after
  pasting it in (tooltips, click-to-filter).

## Setup in Power BI Desktop

1. Add a Deneb visual to the canvas.
2. In the Deneb **Fields** pane, add these fields to the `dataset` data source (rename each one
   exactly as listed — the spec references these names):
   - `category` — your category column (required; one bullet row per value)
   - `actual` — the Actual measure (required)
   - `target` — the Target / Budget measure (required for the target tick and Variance %)
   - `tooltip1`…`tooltip4` — optional extra fields shown in the tooltip as "Extra 1"…"Extra 4"
3. Open **Edit → Spec** and paste the contents of `spec.json` in wholesale.
4. In **Settings → Vega → Power BI Interactivity**:
   - Keep **Tooltip Handler** on (default) — the tooltip is attached to an invisible per-row hit
     rectangle whose rows are the original `dataset` rows (same wiring as `arrowBars3D`). If no
     tooltip shows in your Deneb version, turn the handler off; Vega's built-in tooltip renders the
     same content.
   - Turn on **Expose cross-filtering values for dataset rows** for click-to-filter. Deneb handles
     the click / clear events itself (multi-select behaviour follows your Deneb version); the spec only reads the `__selected__` field it
     injects to dim non-selected rows to 30 % opacity (the same dimming as the original).

## Tuning

There's no format-pane UI — the spec styles itself entirely from the `signals` block at the top
of `spec.json`. Edit the values directly (plain constants; no need to touch the data/mark logic):

| Signal(s) | Meaning | Default |
|---|---|---|
| `maxRows` | max categories drawn (0 = no limit) | 10 |
| `animation` | entrance animation on (re)load | true |
| `actualColor`, `targetColor`, `targetThickness`, `trackColor` | bar / target tick / track look | `#2A78D6` / `#EB6834` / 3 / `#E4E0D4` |
| `barThickness`, `rowSpacing` | bar height and spacing above/below each bar (px) | 25 / 12 |
| `conditionalColor`, `varianceThreshold1/2`, `colorLow/Mid/High` | color the Actual bar by Variance % (Low < t1 ≤ Mid < t2 ≤ High) | off, −5 / 10, green / blue / red |
| `showValueLabel`, `valueFont*`, `categoryFont*` | label toggles and typography | on, size 11 |
| `decimalPlaces`, `displayUnits` (`Auto`/`None`/`K`/`M`/`B`) | number formatting (also drives the axis) | 0, Auto |
| `axisShow`, `axisFontSize`, `axisFontColor` | axis ticks + gridlines. Tick count is at most 5 (like the original) and drops automatically when the labels (e.g. `100.00M`) would not fit side by side; any label that still collides is hidden | on, 10, `#898781` |
| `statusThreshold1/2`, `statusFont*`, `statusBold` | Status Label bands and font | −5 / 10, Segoe UI 11 bold |
| `statusLow*`, `statusMid*`, `statusHigh*` — `Text`, `FontColor`, `BackColor`, `ShowBackground`, `Blink` | per-band badge (blank text = hidden) | "UNDER BUDGET" green / hidden / "OVER BURN" red, blinking |
| `emptyMessage` | text shown when no rows | original wording |

## Deliberate differences vs. the original TypeScript visual

- **Text measurement**: Vega expressions can't measure rendered text, so the category column width,
  the value-label reserve, and the status pill width are *estimated* from character count × font
  size (the same 0.55 / 0.62-bold factors the original already uses for the right-hand margins).
  The original measures the category names precisely with `getBBox()`, so you may see a few px more
  or less gap left of the bars. Category truncation itself (`…`) uses Vega's real text `limit`, and
  the full name is always in the tooltip.
- **Scrolling**: the original keeps the bar thickness and scrolls the chart when rows don't fit
  even at minimum spacing. A Vega spec has no scroll container of its own (and I did not find a
  Deneb setting for it), so here the bars shrink to fit instead (thickness floor 3 px). With ≤ 10 rows and a reasonable visual height
  the layout is identical to the original.
- **Hover animation**: the original replays the grow animation on the hovered row before showing
  its tooltip. That is not reproduced — the tooltip shows immediately. The entrance animation and
  the status blink are kept (timer-driven signals, `animElapsed` / `blinkOpacity`); the entrance
  plays when the view is (re)created, not on a plain resize. `prefers-reduced-motion` is not
  detected — set `animation` to `false` / the `status*Blink` flags to `false` if you need that.
  If bars ever appear at zero width (e.g. a static export that doesn't run timers), set
  `animation` to `false`.
- **Tooltip labels**: the original uses the real field display names (e.g. "Revenue: 1.2M").
  Deneb doesn't hand the spec those names, so the tooltip rows are labelled **Category / Actual /
  Target / Variance / Status**. The status shows as plain text in the tooltip (no colored pill).
- **Number formatting**: uses d3-format (`,.Nf`) with the same round-half-away-from-zero rule as
  `toLocaleString`, so 0.95 → "1.0" like the original. One cosmetic difference: a small negative
  that rounds to zero shows as `0M`, where the original shows `-0M`. Your Deneb/Power BI locale
  controls separators.
- **Top margin**: 8 px. The original uses 22 px when licensed only to clear its "✓" license badge,
  which doesn't exist here.
- **Native `<title>` hover on a truncated category label** is dropped (the row tooltip already shows
  the full name).
- **License**, license language, shared-storage license sync and the "Clear saved license" toggle
  are not implemented (no Deneb equivalent).
