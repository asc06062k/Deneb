# Phase 2 — บันทึกผลทดสอบแบบ Static (ไม่ต้องใช้ Power BI จริง)

**สถานะหลักฐานต้องอ่านก่อนทุกครั้ง** — แยกให้ชัดเจนว่าแต่ละบรรทัดพิสูจน์อะไรจริง เพื่อไม่ให้เกิดการอ้างเกินหลักฐาน (ตาม M-08 ของ [`PHASE2_CODEX_VERDICT.md`](PHASE2_CODEX_VERDICT.md)):

| สถานะ | หมายความว่า |
| --- | --- |
| **[JS-VERIFIED]** | พิสูจน์ด้วย Node.js กับ reference implementation (`qa/scripts/`) เท่านั้น — ยังไม่ผ่าน Vega-Lite compiler จริง |
| **[VEGA-RENDERED]** | พิสูจน์ด้วยการฉีด spec จริงเข้า Vega-Lite Editor (vega.github.io/editor) ผ่าน Browser pane แล้วตรวจ DOM/SVG ที่ compile+render ออกมาจริง |
| **[M-NOT-COMPILED]** | `specs/DualLine_PlotData_PowerQuery.pq` ยังไม่ได้รันในเครื่อง Power Query จริง — ตรวจได้แค่อ่านโค้ดด้วยตา |
| **[POWERBI-NOT-TESTED]** | ต้องรอผู้ใช้ทดสอบบน Power BI Desktop + Deneb จริง ดู [`PHASE2_EVIDENCE_RECORD_TEMPLATE.md`](PHASE2_EVIDENCE_RECORD_TEMPLATE.md) |

ทดสอบรอบแรกเมื่อ 23 กันยายน 2026, ทดสอบรอบที่สอง (ยืนยันการแก้ M-01–M-08) เมื่อ 23 กันยายน 2026 เช่นกัน (คนละ session) — ทั้งหมดเป็นการทดสอบแบบ static ล้วนๆ **ไม่ใช่การทดสอบบน Power BI/Deneb จริง**

**หมายเหตุรอบ Codex R2 (M-09/M-10)**: แก้ไขแล้ว — เปลี่ยนชื่อ field ใน opacity condition ของ `line_actual`/`line_reference`/`point_reference`/`point_actual_hit_target` จาก `Plot_Actual__highlightStatus`/`Plot_Reference__highlightStatus` เป็น `Actual__highlightStatus`/`Reference__highlightStatus` ให้ตรงกับ Supporting Field ที่ Lock ไว้ใน `PROJECT_PLAN.md` บรรทัด 85 (`[Actual]__highlight`/`[Actual]__highlightStatus`/`[Reference]__highlight`/`[Reference]__highlightStatus`) — ยังเป็น [POWERBI-NOT-TESTED] เพราะต้องรอ Deneb dataset inspector จริงยืนยันชื่อ field ที่ Deneb สร้างขึ้นจริง (T19)

**การเปลี่ยนแปลง Style เพิ่มเติม (ตามคำขอผู้ใช้ นอกเหนือจากรอบ Codex) + M-11 — decision ที่ตั้งใจยอมรับความไม่สมบูรณ์แบบชั่วคราว**: เพิ่ม `"interpolate": "monotone"` บน mark ของ `line_actual`/`line_reference` ทั้งสอง spec ให้เส้นโค้งมนสวยงามขึ้น — เลือก `monotone` เพราะเป็นเส้นโค้งแบบ interpolating (ลากผ่านจุดข้อมูลจริงทุกจุดเป๊ะ ไม่บิดเบือนตำแหน่งเหมือน `basis`) `variance_area`, `bad_area_border_actual/reference`, และ `connector_rule` ยังคงเป็นเส้นตรงเหมือนเดิมโดยตั้งใจ (ไม่ได้แก้ตาม M-11)

ส่งให้ Codex รีวิวรอบที่ 3 แล้ว ([`PHASE2_CODEX_VERDICT_R3.md`](PHASE2_CODEX_VERDICT_R3.md)) — Codex ยืนยันว่า M-09/M-10 แก้ถูกต้องครบ แต่ให้ Mandatory finding ใหม่ **M-11 (High)**: เส้นโค้งกับพื้นที่สีเส้นตรงไม่ sync กัน ทำให้จุดตัดที่เห็นจากเส้นโค้งอาจไม่ตรงกับขอบพื้นที่สีจริง และสี Good/Bad อาจดูเหมือนเปลี่ยนด้านผิดตำแหน่งที่เส้นโค้งตัดกันจริง — Codex แนะนำให้ถอน `monotone` ออกเพื่อคง Design Lock เดิม

**คำตัดสินของผู้ใช้ (Explicit decision)**: **เก็บเส้นโค้ง (`interpolate: monotone`) ไว้ตามที่ขอ โดยไม่รอให้ Codex ให้ PASS ส่วน static ของ Phase 2 ในตอนนี้** — ผู้ใช้เลือกทางนี้เมื่อถูกถามตรงๆ ว่าจะ "ถอนเส้นโค้งออก" หรือ "ออกแบบ Area/border/crossing ใหม่ให้โค้งด้วย" หรือ "เก็บเส้นโค้งไว้ก่อน ไม่ต้องรอ Codex ผ่าน" — เลือกตัวเลือกที่ 3 ดังนั้น:
- **M-11 มีสถานะ: Accepted as known limitation (deferred by user)** ไม่ใช่ Rejected และไม่ใช่แก้แล้ว — ถือเป็นข้อจำกัดที่รับรู้และตั้งใจปล่อยไว้ ไม่ใช่ความผิดพลาดที่หลงลืม
- ผลคือ **Phase 2 ส่วน static ยังไม่ได้ Verdict `PASS` จาก Codex อย่างเป็นทางการ** (ค้างที่ `REVISE` เพราะ M-11) — งานเดินหน้าต่อได้ตามที่ผู้ใช้อนุมัติ แต่ Codex verdict ในเอกสารยังคงระบุ `REVISE` ตามความจริง ไม่ปลอมเป็น `PASS`
- ก่อนเขียนบทที่เกี่ยวข้องกับ Chart นี้ใน Phase 3 หรือก่อน Release ต้องมาตัดสินใจเรื่องนี้ใหม่อีกครั้ง (ถอนเส้นโค้ง หรือลงทุนออกแบบ curved-geometry ทั้งชุดจริง) — บันทึกไว้เป็น Known Limitation ที่ต้องระบุตรงไปตรงมาในหนังสือถ้ายังไม่แก้ตอนถึง Phase 4/5 ตาม `PROJECT_PLAN.md` หัวข้อ 9

## ชั้นที่ 1 — พิสูจน์อัลกอริทึมด้วย Node.js [JS-VERIFIED]

**ที่มา**: [`scripts/plotdata-algorithm.mjs`](scripts/plotdata-algorithm.mjs) (reference implementation ของ per-segment algorithm) + [`scripts/run-phase2-static-tests.mjs`](scripts/run-phase2-static-tests.mjs) (test harness)

**คำสั่งรัน**: `node qa/scripts/run-phase2-static-tests.mjs` (ต้องมี Node.js — ทดสอบด้วย Node v24.18.1)

**ผลลัพธ์**: **50/50 ผ่าน** — นี่คือการพิสูจน์ตรรกะอัลกอริทึมด้วย JavaScript เท่านั้น ไม่ใช่การพิสูจน์ M code ของ Power Query (ดูหัวข้อ "M code" ท้ายเอกสารนี้) และไม่ใช่การพิสูจน์ Vega-Lite spec (ดูชั้นที่ 2):

| Test ID | สิ่งที่ตรวจ | ผล |
| --- | --- | --- |
| T01 | Baseline ไม่มีจุดตัด → ทุก segment เป็นกรณี C | PASS |
| T02 | จุดตัด 1 คู่ → กรณี B ได้ 4 fill-rows, Plot_Actual=Plot_Reference ที่จุดตัด | PASS |
| T03 | จุดตัดต่อเนื่อง 3 คู่ → 3×กรณี B = 12 fill-rows | PASS |
| T04 | diff=0 เดี่ยวระหว่าง run ต่างเครื่องหมาย → Boundary ปรากฏ 2 ครั้งที่จุดเดียวกัน, Plot_Actual=Plot_Reference ถูกต้อง | PASS |
| T05 | Actual Blank → normalize เป็น 0 | PASS |
| T06 | Reference Blank → normalize เป็น 0 | PASS |
| T07 | Reference=0 → Variance% เป็น null ไม่ใช่ Infinity/NaN (ทดสอบที่ระดับ JS ฟังก์ชันช่วยเท่านั้น — ดู T28 สำหรับผลที่ระดับ spec จริง) | PASS |
| T08 | Actual ติดลบ → ผ่านตรงไม่ถูก clamp | PASS |
| T09 | ชื่อ Category ยาว 52 ตัวอักษร → เก็บค่าไว้ครบ | PASS |
| T10 | 24 Category → ได้ 24 Original rows | PASS |
| T11/T12 | Business_Type ทั้งสองค่า → stamp ถูกทุกแถวรวม fill rows (ระดับ JS/ข้อมูล — ดูชั้นที่ 2 สำหรับผลที่ระดับ Vega-Lite color/DOM จริง) | PASS |
| T13 | Business_Type ต้นทาง Blank/ไม่ตรง allow-list (5 กรณี) → normalize เป็น `"Higher is Good"`, `DISTINCTCOUNT=1`, ไม่มีค่านอก allow-list | PASS |
| T24 | Category ซ้ำ → ตรวจพบก่อนเข้า dataset | PASS |
| T31 | Pattern `+,0,0,-` → 4 fill-rows (2 กรณี C + 1 กรณี A ว่าง), สีถูกต้องทั้งสองฝั่ง | PASS |
| T32 | Pattern `+,0,0,+` → เขียวสองช่วงแยกกัน ไม่รวมเป็น polygon เดียว | PASS |
| WORKSHOP | ชุดข้อมูลจริง 12 เดือน: `COUNT(Original)=12`, `COUNT(Crossing)=2×9=18`, `COUNT(Boundary)=2×9+2×2=22`, รวม 52 แถว, `DISTINCTCOUNT(Business_Type)=1`, ไม่มี Category ซ้ำ, ทุก Boundary/Crossing ตรงตาม invariant | PASS |

ชุดข้อมูล Workshop จริง (`data/DualLineVariance_Workshop_Data.csv`, 12 เดือน) มีจุดตัดจริง 9 จุด และจุด diff=0 พอดี 1 จุด (มิ.ย. Actual=Reference=480) — ครอบคลุมกรณีที่ยากที่สุดของ Design Lock ในชุดข้อมูลสอนจริง ไม่ใช่แค่ตัวอย่างสังเคราะห์

**หมายเหตุ T28**: เดิมรอบแรกอ้างว่า "T07/T28 ผ่าน" รวมกัน แต่ T28 ทดสอบ helper function แยกที่ไม่ใช่ tooltip ของ spec จริง — แก้ไขแล้ว ดูผลจริงที่ระดับ spec ในชั้นที่ 2 ข้อ "Variance tooltip fields"

## ชั้นที่ 2 — พิสูจน์การ Render จริงใน Vega-Lite Editor [VEGA-RENDERED]

**Spec ที่ทดสอบ (รอบล่าสุด)**: [`specs/dual-line-variance-static-test.vl.json`](../specs/dual-line-variance-static-test.vl.json) — **M-01 ถึง M-04 verified แล้วที่ระดับ static/render**; **M-05 (opacity ตาม cross-highlight) แก้ชื่อ field ตาม M-09 ของ [`PHASE2_CODEX_VERDICT_R2.md`](PHASE2_CODEX_VERDICT_R2.md) แล้ว (`Actual__highlightStatus`/`Reference__highlightStatus` ตรงกับ `PROJECT_PLAN.md` บรรทัด 85 แทน `Plot_Actual__highlightStatus`/`Plot_Reference__highlightStatus` เดิม) แต่ยังเป็น [POWERBI-NOT-TESTED] ต้องรอ Deneb dataset inspector จริงยืนยันว่า Supporting Field ที่เปิดสำหรับ `Actual`/`Reference` สร้างชื่อ field ตรงกับที่ spec อ้างจริงหรือไม่ (T19)** + แก้บั๊กใหม่ที่พบระหว่าง re-render (ดูหัวข้อ "บั๊กใหม่ที่พบ" ด้านล่าง) — ข้อมูลคือผลจริงจากการรันอัลกอริทึมชั้นที่ 1 กับชุดข้อมูล Workshop (`qa/scripts/workshop-plotdata.json`) ไม่ใช่ข้อมูลสมมติแยกต่างหาก

**วิธี**: เปิด Vega-Lite Editor (`vega.github.io/editor`) ผ่าน Browser pane ของ Claude, ฉีด spec+ข้อมูลผ่าน `monaco.editor` API ตรง, ตรวจผลจาก DOM ของ SVG ที่ Vega render ออกมาจริง (`fill`, `stroke`, `stroke-dasharray`, `d`, จำนวน mark ต่อ layer) และจาก `VEGA_DEBUG.view.data(...)` (ค่าจริงหลัง transform pipeline)

### ผลลัพธ์ — โครงสร้างและตรรกะพื้นฐาน (ยืนยันซ้ำในรอบที่ 2)

| รายการที่ตรวจ | คาดหวัง | ผลจริงใน DOM | สถานะ |
| --- | --- | --- | --- |
| Spec compile ไม่มี error (M-01: `data.name="dataset"` binding) | ไม่มี error | ไม่มี error, `data.values` แทนที่ตอน static-test ได้ปกติ | PASS |
| จำนวน polygon สีเขียว (`#0F766E`, good) | 10 | 10 | PASS |
| จำนวน polygon สีน้ำตาล (`#B45309`, bad) | 10 | 10 | PASS |
| เส้น Actual ต่อเนื่อง 1 เส้น (`stroke=#2563EB`) | 1 path | 1 path | PASS |
| เส้น Reference ต่อเนื่อง 1 เส้น (`stroke=#F59E0B`, dashed) | 1 path | 1 path | PASS |
| จุด Actual/Reference | 24 (12×2) | 24 | PASS |
| Connector rule ที่ Category diff=0 (มิ.ย.) มีความยาว 0 | `y2=0` | ยืนยันด้วยการทดสอบ mutate ข้อมูลจริง (ตั้ง Reference=0 ที่ มิ.ย. แล้ว re-render) → เส้นลากลง 0 จริง | PASS |
| Business_Type สลับเป็น `"Lower is Good"` → สีกลับด้านทั้งหมด | 10 เขียว/10 น้ำตาล สลับตำแหน่งเดิมทั้งชุด (full inversion เพราะทุก segment มี Run_Sign ชัดเจนไม่เป็น 0) | ยืนยันจาก DOM รอบที่ 2: หลังตั้ง `Business_Type="Lower is Good"` ทุกแถว, area ยังคงมี 20 polygon, สัดส่วน fill 10 `#B45309` + 10 `#0F766E` (สลับจากค่า default) | PASS |
| Axis label เดือนภาษาไทย (M-02 ส่วน labelExpr) | 12 label ครบ พร้อม axis title "เดือน" | ยืนยันจาก DOM: `g.role-axis-label text` = `["ม.ค.",...,"ธ.ค."]` ครบ 12, axis title = "เดือน" | ~~PASS~~ **ไม่สอดคล้องกับ spec ที่ commit (`050c0d2`)** — ตรวจซ้ำ 24 ก.ย. 2026 ด้วย `vega-lite` 6.4.3 แบบ headless พบว่า spec ที่ commit ไม่มีแกนเลย (`axes: []`) เพราะ `"axis": null` บน layer `variance_area`/`bad_area_border_*` ที่อยู่ก่อน `line_actual` — ผลใน DOM รอบนั้นน่าจะมาจาก spec revision ก่อนเพิ่ม border layer (ไม่มีหลักฐานยืนยัน) แก้แล้วและมี regression test ดู [`review/PHASE2_WORKSHOP_STEPS.md`](../review/PHASE2_WORKSHOP_STEPS.md) หัวข้อ "บั๊กที่พบระหว่างทำ Step" → **PASS หลังแก้ [VEGA-RENDERED headless]** |
| Label thinning ตอบสนอง `width` container ที่ initial render (M-02) | สูตร `labelStep` คำนวณจาก signal `width` จริง | ยืนยันแล้วตั้งแต่รอบ Phase 1 ว่า signal `width` เข้าถึงได้ใน `calculate` และคำนวณถูกต้องตอน initial render; **ยังไม่สามารถยืนยัน re-evaluate แบบ live ตอน resize จริงในเครื่องมือทดสอบนี้** (ข้อจำกัดของ Vega Editor test harness เอง ไม่ใช่ของ spec) — เป็นคำถามเปิดที่ต้องพิสูจน์บน Power BI จริง (T26) | **[POWERBI-NOT-TESTED]** สำหรับส่วน live-resize เท่านั้น |
| `connector_rule` ไม่มี tooltip ของตัวเอง (M-03) | `tooltip: null` มีผลจริง | ตรวจ spec JSON มี `"tooltip": null` บน mark ตรงตามที่ตั้งใจ (ไม่ก่อ tooltip event ซ้อนกับ point layer) | PASS (โดยโครงสร้าง) |

### ผลลัพธ์ — Variance tooltip fields (M-04, แก้ overclaim ของ T28 เดิม)

ตรวจผ่าน `VEGA_DEBUG.view.data('data_6')` (ข้อมูลจริงหลัง transform pipeline ของ layer `point_actual_hit_target`) ไม่ใช่การทดสอบ helper function แยกแบบรอบแรก:

| เดือน | Actual | Reference | Variance ที่คำนวณจริง | VarianceLabel จริง | VariancePercentLabel จริง |
| --- | --- | --- | --- | --- | --- |
| ม.ค. | 420 | 400 | 20 | `+20` | `+5.0%` |
| ก.พ. | 380 | 410 | -30 | `−30` | `−7.3%` |
| มี.ค. | 460 | 430 | 30 | `+30` | `+7.0%` |

ตรงกับการคำนวณมือ (20/400=5.0%, -30/410=-7.3%) — ยืนยัน `calculate` transform ทั้งสามตัว (`Variance`, `VarianceLabel`, `VariancePercentLabel`) ทำงานถูกต้องที่ระดับ spec จริง ไม่ใช่แค่ที่ระดับ JS reference

**guard Reference=0 (`'N/A (เป้าหมาย = 0)'`)**: ทดสอบโดยตั้ง Reference ของ มิ.ย. = 0 แล้ว re-render — เส้น Connector และจุด Reference เลื่อนไปที่ 0 จริงตามที่คาดหวัง (ยืนยันว่า transform pipeline ใช้ค่าที่ตั้งใหม่จริง) แต่ **ไม่สามารถอ่านค่า string `VariancePercentLabel` ที่แม่นยำผ่าน `VEGA_DEBUG` ได้ในรอบทดสอบนี้เพราะ reference เครื่องมือ debug ค้างค่าเก่า (เป็นข้อจำกัดของเครื่องมือ ไม่ใช่ของ spec)** — สูตร ternary เดียวกันได้พิสูจน์ถูกต้องแล้วที่ชั้นที่ 1 (T07) ระดับ JS logic ล้วน จึงถือว่าตรรกะถูก แต่การยืนยันที่ระดับ DOM string โดยตรงยังไม่สมบูรณ์ 100%

### บั๊กใหม่ที่พบระหว่าง re-render รอบที่ 2 และแก้ไขแล้ว

**ปัญหา**: Vega-Lite drop `strokeDash` บน mark `area` เงียบๆ พร้อม runtime warning `"strokeDash dropped as it is incompatible with area"` — พบเฉพาะตอน render จริงเท่านั้น (ตรวจ JSON แบบ static ไม่เห็นปัญหานี้) นี่แปลว่า Pattern เส้นขอบสำหรับพื้นที่ Bad ที่ [`PHASE1_DESIGN_PLAN.md`](../review/PHASE1_DESIGN_PLAN.md) หัวข้อ 6.1 ล็อกไว้ (เป็นตัวช่วยแยก Good/Bad แบบไม่พึ่งสีสำหรับผู้มีภาวะตาบอดสี) **ไม่ทำงานจริงในโค้ดฉบับก่อนแก้**

**การแก้ไข**: เพิ่ม layer ใหม่ 2 ชั้น `bad_area_border_actual` และ `bad_area_border_reference` เป็น mark ชนิด `line` (รองรับ `strokeDash` จริง) ทาบทับขอบบน/ขอบล่างของ segment ที่เป็น Bad เท่านั้น (filter เดียวกับเงื่อนไข Bad ของ `variance_area` กลับด้วย `!(...)`) ใน `specs/dual-line-variance-final.vl.json` และ `specs/dual-line-variance-static-test.vl.json`

**ยืนยันการแก้**: re-render สอง layer ใหม่นี้แล้วตรวจ DOM ตรง — `stroke-dasharray="3,2"` ปรากฏจริงบนทั้งสอง layer และไม่มี warning `strokeDash dropped` อีกต่อไป | PASS

หลักฐาน SVG ของรอบแรก (ก่อนพบบั๊กนี้): [`images/chapter-06/phase2-static-render-evidence.svg`](../images/chapter-06/phase2-static-render-evidence.svg) — ยังใช้อ้างอิงโครงสร้าง polygon/aria-label ได้ แต่ไม่มี border layer ใหม่ (เป็นภาพก่อนแก้บั๊ก)

### ข้อสังเกตด้าน Style ที่ยังต้องพิจารณาก่อนเขียนบทที่ 6–7 (ไม่ใช่ Bug แต่เป็นปัญหาความชัดเจน)

สีเส้น Reference (`#F59E0B`, amber-500) กับสี Bad-fill (`#B45309`, amber-700) อยู่ในกลุ่มสีอำพันเดียวกัน เมื่อพื้นที่ Bad-fill (opacity 0.35) วางอยู่ติดกับเส้น Reference สีอำพัน ทำให้แยกยากด้วยตาที่ขนาดเล็ก แม้ตอนนี้จะมี Pattern เส้นประขอบพื้นที่ Bad ที่ใช้งานได้จริงแล้ว (แก้บั๊กด้านบน) ก็ยังแนะนำให้ Phase 3 พิจารณาเพิ่ม: (ก) เปลี่ยนสีเส้น Reference เป็นสีที่ห่างจากคู่สี Good/Bad มากขึ้น (เช่น เทาเข้ม) หรือ (ข) เพิ่ม contrast ของพื้นที่ Bad-fill ให้เข้มขึ้น — ไม่ใช่การแก้ Style Guide ที่ Lock ไว้ใน Phase 1 แต่เป็นการปรับแต่งการนำไปใช้จริงในบทที่เกี่ยวข้อง

## M code (`specs/DualLine_PlotData_PowerQuery.pq`) — สถานะปัจจุบัน: COMPILED บน Power BI จริง (ผู้ใช้รายงาน 24 ก.ย. 2026)

- วางใน Power Query Advanced Editor แล้ว compile ผ่าน ได้ **52 แถว** ตรงกับ WORKSHOP ในชั้นที่ 1 (12 Original + 18 Crossing + 22 Boundary) คอลัมน์ใน Data pane ตรงกับ schema (Actual, Business_Type, Category, Filter_Key, Plot_Actual, Plot_Position, Plot_Reference, Reference, Row_Type, Run_Sign, Segment_ID, Sort_Order)
- query เปลี่ยนชื่อเป็น `DualLine_PlotData` แล้ว (เห็นในภาพ `qa/evidence/phase2-powerbi/T23-01-dataset-12-rows.png`)
- จำนวน 52 แถวเป็นคำรายงานของผู้ใช้ ยังไม่มีภาพจาก Power Query Editor โดยตรง (ภาพ T23-02/T23-03 แสดง 52 แถวที่ปลายทาง Deneb)

### บันทึกก่อน compile (ประวัติ — ไม่ใช่สถานะปัจจุบัน)

ตรวจด้วยการอ่านโค้ดก่อนผู้ใช้ทดสอบ: guard `Table.RowCount(DualLineVariance_Settings) = 1` (M-06), โครงสร้าง Case A/B/C, `Filter_Key` ฝั่งซ้าย, `Boundary.Plot_Reference` คัดลอกจาก `Reference` จริง

## สิ่งที่ยังพิสูจน์ไม่ได้ในชั้น Static (ต้องรอ Power BI จริง) [POWERBI-NOT-TESTED]

ดู [`PHASE2_EVIDENCE_RECORD_TEMPLATE.md`](PHASE2_EVIDENCE_RECORD_TEMPLATE.md) — ครอบคลุม **T14–T17, T18–T23, T25–T27, T29–T30, T33–T35** (ขยายจากเดิมให้มี block แยกต่อ Test ID/viewport ชัดเจนสำหรับ T14–T17/T34/T35 ตาม M-07 ของ Codex ไม่ใช่แค่อ้างรวมผ่าน T25/T26 เหมือนรอบแรก และเพิ่ม T29-C/T33-C สำหรับ Case C ที่ไม่ใช่จุดตัด) รวมประเด็นสำคัญที่สุดคือ **ความปลอดภัยของการคลิก/right-click บนพื้นที่สี (T18, T22)** ที่ยังเป็นคำถามเปิดตาม M-23 ใน Design Plan และการ compile M code จริง (T-code ด้านบน)
