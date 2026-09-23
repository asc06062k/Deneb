# Claude review handoff

Status: **PASS in round 3**.

The user ran Claude CLI directly and supplied round 1 feedback covering the manuscript, sample data, specs, and images.

## Round 1 revisions

- Changed the threshold exercise to −4% and +11%, with the exact fields to edit in Vega-Lite and Vega and the expected IT/HR changes.
- Reworked image 05 to show a full-width gray track, Actual labels, orange Target ticks, and OVER BURN badges when conditionalColor is on. Explained the change in the manuscript.
- Added the Vega interactivity settings for cross-filtering and tooltips.
- Directed readers to create a new Vega spec, clarified Values field names and summarization, and corrected the tick snippet.
- Expanded the CSV editing exercises and boundary checks.
- Corrected the decimalPlaces default in the source README from 0 to 1.

## Round 2 revisions

- Removed the background pill behind OVER BURN to match the default `statusHighShowBackground: false`.
- Moved each Actual value label to the end of its bar and right-aligned status text.
- Changed the illustration to a 0–1.3M example scale with gridlines and axis labels; clarified in the eBook that exact spacing depends on Vega and visual size.
- Clarified the creation and field binding of a new Vega visual in step 4.
- Explained the empty low-status label for IT and disappearing high-status label for HR in the threshold exercise.

## Round 3 verdict

Claude reviewed `ebook.md` and `images/05-final.svg` again and returned **PASS**. It confirmed fixes A–D and found no new issue that blocks the workshop. Its only non-blocking note was that the Operations value label can overlap the Target tick in the illustration because the label follows the end of the Actual bar, matching the specification's placement rule.

Suggested prompt:

> This is round 3. Re-review D:\DATA\Deneb\workshop\ebook.md and D:\DATA\Deneb\workshop\images\05-final.svg against your round 2 findings, using the related CSV, JSON specs, and source bulletChart README/spec as needed. Confirm fixes A–D, check for new blockers, and return PASS or FAIL. If FAIL, give numbered actionable corrections. Do not edit files.

Review cycle completed. The manuscript and illustration passed round 3.
