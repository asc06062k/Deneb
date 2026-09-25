# Deneb Dual-Line Variance Chart eBook — สถานะโครงการ

โครงการนี้แยกจาก `D:\DATA\Deneb\eBook` (Bullet Chart) ตามที่ผู้ใช้ยืนยันเมื่อ 23 กันยายน 2026 (Asia/Bangkok) ดูรายละเอียดขอบเขตและ Workflow ใน [PROJECT_PLAN.md](PROJECT_PLAN.md)

Workflow ของโครงการนี้: **Claude Code เขียน, Codex CLI รีวิว** (สลับบทบาทจากโครงการ Bullet Chart)

## สถานะ Quality Gate

**Phase 0: ผ่าน Quality Gate (`PASS`)** — Codex CLI ให้ผล `PASS` ครั้งแรกรอบที่ 7 เมื่อ 23 กันยายน 2026 (แก้ Mandatory finding รวม 11 ข้อ M-01 ถึง M-11A) จากนั้นผู้ใช้ขอเพิ่ม Requirement ใหม่ 2 ข้อ (Responsive + field `Business_Type`) ส่งกลับให้ Codex รีวิว Addendum อีก 4 รอบ (รอบ 8–11) จนได้ `PASS` อีกครั้งที่รอบ 11 ดูรายละเอียดทุกรอบใน `qa/PHASE0_CODEX_VERDICT.md` ถึง `qa/PHASE0_CODEX_VERDICT_R11_ADDENDUM.md`

ประเด็นสำคัญที่ Lock ไว้จาก Phase 0 (ต้องใช้ต่อใน Phase 1 เป็นต้นไป)

- Cross-filter ใช้ `Expose cross-filtering values for dataset rows` (Simple mode) + ฟิลด์ `__selected__` — **อัปเดต 24 ก.ย. 2026**: ผู้ใช้ตัดสินให้สอนเฉพาะการตั้งค่า ไม่ encode `__selected__` ใน spec
- Cross-highlight ต้องเปิด 2 ระดับ: `Expose cross-highlight values for measures` ของ Visual แล้วเปิด Supporting field (`Highlight value`/`Highlight status`/`Highlight comparator`) รายฟิลด์ต่อ measure ใน "Supporting Fields: dataset" — ทั้งหมดอยู่ใน Project setup pane เดียวกันคนละ section
- ฝั่ง Power BI ต้องตั้ง `Edit interactions` ของ Visual ต้นทางเป็น `Highlight` (แนะนำ Clustered bar/column chart) — **ห้ามใช้ Slicer ทดสอบ Highlight** เพราะ Slicer มีเฉพาะ `Filter`/`None`
- Context menu ใช้ `Show context menu on right-click` และ `Attempt to resolve data point-specific actions`
- Context menu ใช้ `Show context menu on right-click` และ `Attempt to resolve data point-specific actions`
- ทุกผลทดสอบ Interaction บน Power BI จริงต้องมี Evidence record ครบตามแบบที่ Lock ไว้ มิฉะนั้นระบุ `NOT TESTED`

**อัปเดตจาก Phase 1** (แทนที่ข้อสมมติฐานบางข้อของ Phase 0):

- **Crossing-case พิสูจน์แล้วว่าเป็นไปได้จริง** ด้วยอัลกอริทึม per-segment (ตรงกับ `segmentFill.ts` ของต้นแบบ) — ดูรายละเอียดใน `review/PHASE1_DESIGN_PLAN.md` หัวข้อ 2.0
- **`Business_Type` เปลี่ยนเป็น Power Query Column** (ไม่ใช่ DAX Measure ตามที่ Phase 0 เคย Lock ไว้) เพราะสถาปัตยกรรม Phase 1 ใช้ตารางเฉพาะ `DualLine_PlotData` ที่ Power Query ควบคุม grain เองอยู่แล้ว ทำให้ Column ปลอดภัยกว่าและตรงไปตรงมากว่า Measure
- **Cross-filter ทิศทางออกจาก Area (พื้นที่สี) ยังเป็นความเสี่ยงที่ไม่มี mitigation ที่พิสูจน์แล้ว** — วิเคราะห์พบว่าอาจกรอง Visual อื่นผิดหลาย Category พร้อมกัน เป็น **Phase 2 hard gate** (ห้าม Phase 2 `PASS` จนกว่าจะพิสูจน์ปลอดภัยหรือเปลี่ยน architecture เช่น Advanced cross-filtering mode)
- **Responsive**: Data label ของ Actual/Reference ต้อง re-evaluate ทุกครั้งที่ resize และ "ลดการชน" เท่านั้น (Group A) ส่วน **Category axis label ต้องไม่ทับซ้อนกันเลย** ภายใน 6 ขนาด viewport ที่ Test matrix กำหนด (Group B คำสัญญาที่แข็งกว่าต้นแบบ)
- ทุกฟีเจอร์แบ่งเป็นกลุ่ม A (เทียบเท่าต้นแบบ มีหลักฐานจาก source) และกลุ่ม B (ส่วนขยายเฉพาะ Deneb)

## ไฟล์และโครงสร้าง

สร้างโฟลเดอร์ตามแผนแล้ว: `manuscript`, `data`, `dax`, `specs`, `templates`, `images/chapter-01` ถึง `chapter-10`, `cover`, `review/chapters`, `qa`, และ `release`

Visual อ้างอิงคือ Custom Visual จริงที่ `D:\DATA\Custom viz\dualLineVarianceChart` — อ่านโดยตรงจาก `capabilities.json`, `interfaces.ts`, `visual.ts` เพื่อดึง Field contract และพฤติกรรมจริง ไม่ได้เดาจากชื่อไฟล์

## ข้อจำกัดสำคัญ

- Claude/Codex ไม่มีสิทธิ์เปิด Power BI Desktop หรือ Deneb Editor จริงบนเครื่องผู้ใช้ ภาพหน้าจอและผลทดสอบ Interaction (Cross-filter/Cross-highlight) ต้องได้รับการยืนยันจากผู้ใช้บนเครื่องจริงก่อนถือว่าผ่าน
- ก่อนหน้านี้ไม่มีการบันทึกภาพ UI จากการคาดเดา และจะรักษามาตรฐานนี้ต่อในโครงการนี้

## Phase log

### Phase 0 — 23 กันยายน 2026 — PASS
- สร้างโฟลเดอร์และ `PROJECT_PLAN.md`
- ส่งรีวิวให้ Codex CLI ผ่าน `review/PHASE0_CODEX_REVIEW_PROMPT.md` รวม 7 รอบ (REVISE 6 ครั้ง, PASS รอบที่ 7)
- ทุก Mandatory finding ตรวจสอบไขว้กับเอกสาร Deneb ทางการ (deneb.guide) และ Microsoft Learn ก่อนยอมรับหรือปฏิเสธ ไม่ใช้คำตัดสินของ Codex ตรงๆโดยไม่ตรวจสอบ
- ผลรีวิวทุกรอบ: `qa/PHASE0_CODEX_VERDICT.md` (รอบ 1), `..._R2.md` ถึง `..._R7.md`

### Phase 0 Addendum — 23 กันยายน 2026 — PASS
- ผู้ใช้ขอเพิ่ม 2 Requirement ก่อนเริ่ม Phase 1: (1) Responsive resize ไม่ให้ Category label ทับซ้อน (2) field ใหม่ `Business_Type` (Higher is Good / Lower is Good) ผูกกับข้อมูลแทน Format pane setting คงที่ของต้นแบบ
- ปรับ `PROJECT_PLAN.md` แล้วส่ง Codex รีวิวซ้ำ 4 รอบ (รอบ 8–11) แก้ Mandatory finding M-12 ถึง M-15 (แยกคำสัญญา Group A "ลดการชน" ของ Actual/Reference data label ออกจาก Group B "ไม่ทับซ้อน" ของ Category axis label, ล็อก `Business_Type` เป็น DAX Measure ค่าคงที่เพื่อไม่กระทบ grain, เพิ่ม prototype gate ใน Phase 1)
- ผลรีวิว: `qa/PHASE0_CODEX_VERDICT_R8_ADDENDUM.md` ถึง `..._R11_ADDENDUM.md` (`PASS` ที่รอบ 11)

### Phase 1 — 23 กันยายน 2026 — PASS
- ทดสอบความเป็นไปได้ทางเทคนิคจริงใน Vega-Lite Editor (ผ่าน Browser pane) ก่อนเขียน Design Plan: crossing-case color-split, `Business_Type` dynamic switching, และ `labelOverlap` responsive — ผลอยู่ใน `qa/PHASE1_PROTOTYPE_TEST_LOG.md` และ spec ทดสอบใน `specs/phase1-proto-*.vl.json`
- เขียน `review/PHASE1_DESIGN_PLAN.md` ส่งให้ Codex CLI รีวิวรวม **13 รอบ** (REVISE 12 ครั้ง, `PASS` รอบที่ 13) แก้ Mandatory finding รวม 23+ ข้อ (M-01 ถึง M-23R) รวมการค้นพบสำคัญ 3 เรื่อง:
  1. Dataset ต้องเป็นตารางเดียว (`DualLine_PlotData`) มี `Row_Type` (`Original`/`Boundary`/`Crossing`) แยกบทบาท Identity กับ Fill/plotting อย่างเด็ดขาด
  2. ต้องมี Relationship คนละคอลัมน์สำหรับ Cross-filter (`Filter_Key`) แยกจาก `Category` ที่ใช้แสดงผล มิฉะนั้น Filter จะตัดพื้นที่สีทั้งหมดหรือกรองผิด
  3. Area (พื้นที่สี) interaction ยังไม่มี mitigation ที่พิสูจน์แล้วว่าปลอดภัย — ต้องพิสูจน์จริงใน Phase 2 (T18/T22) ก่อน ไม่ใช่ข้อสรุปที่ Lock ได้จาก Design เพียงอย่างเดียว
- ผลรีวิวทุกรอบ: `qa/PHASE1_CODEX_VERDICT.md` (รอบ 1) ถึง `..._R13.md`
- แก้ `PROJECT_PLAN.md` เพิ่มเติมหลายจุดตามผลรีวิว (ย้าย UI screen verification และ Business_Type/Responsive prototype proof ไปเป็น Phase 2 gate อย่างเป็นทางการ, เพิ่ม Phase 2 ข้อ 7 บังคับพิสูจน์ Area interaction)

### Phase 2 — 24 กันยายน 2026 — PASS (Codex รอบ 19)
- 23 ก.ย. 2026: Dataset, Power Query M, final spec, static tests — Codex รีวิว 3 รอบ ค้างที่ `REVISE` ด้วย M-11 (เส้น `monotone` กับพื้นที่สีเส้นตรงไม่ sync) ซึ่งผู้ใช้ตัดสินใจเก็บไว้เป็น Known limitation ดู `qa/PHASE2_STATIC_TEST_LOG.md`
- 24 ก.ย. 2026: **Phase 2 ข้อ 4 — แตก Prototype เป็น Workshop steps** 10 ไฟล์ใน `specs/steps/` (บทที่ 5–8) สร้างอัตโนมัติจาก final spec ด้วย `qa/scripts/build-workshop-steps.mjs` ทดสอบด้วย `qa/scripts/run-workshop-step-tests.mjs` (compile+render headless ด้วย vega-lite 6.4.3 จริง) ดู `review/PHASE2_WORKSHOP_STEPS.md`
  - พบและแก้บั๊ก **final spec ไม่มีแกน X/Y เลย** (`"axis": null` บน layer พื้นที่สีที่อยู่ก่อน `line_actual`) — แก้ทั้ง final และ static-test spec พร้อม regression test
  - Codex รอบ 4 `REVISE` (M-12: generator เพิ่ม `mark.tooltip = null` ที่ไม่มีใน final spec) → แก้ + เพิ่ม structural-subset assertion → **รอบ 5 `PASS`** สำหรับขอบเขต static + Workshop steps (`qa/PHASE2_CODEX_VERDICT_R4.md`, `..._R5.md`)
- **ยังเหลือก่อน Phase 2 `PASS` ทั้งหมด**: Phase 2 ข้อ 5–7 ต้องให้ผู้ใช้ทดสอบบน Power BI Desktop 2.157.1354.0 + Deneb 2.0.0.0 จริงตาม `qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md` (T14–T23, T25–T30, T33–T36) และ compile M code จริง
- 24 ก.ย. 2026 **คำตัดสินผู้ใช้**: (1) แกน Y ทำตามต้นแบบ ±18% → เพิ่ม `params` + `scale.domain` ใน final spec และ Step ใหม่ CH05-S05 (รวม 11 Step, 338/338 ผ่าน) (2) บทที่ 8 สอนเฉพาะการตั้งค่า Cross-filter ไม่ encode `__selected__` (3) คงเส้นโค้ง M-11 ไว้ — บันทึกใน `PROJECT_PLAN.md` แล้ว
  - Codex รอบ 6 `PASS` หลังเพิ่มแกน Y ±18% (`qa/PHASE2_CODEX_VERDICT_R6.md`) และเพิ่ม T36 (แกน Y บน Power BI จริง) ใน Evidence template

- 24 ก.ย. 2026 **ทดสอบบน Power BI Desktop 2.157.1354.0 + Deneb 2.0.0.0 จริง** (`deneb demo.pbix`) — หลักฐานใน `qa/evidence/phase2-powerbi/` และ `qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md`; สิ่งที่ค้นพบและแก้ระหว่างทาง:
  - ต้องมี measure `DualLine Row Count = COUNTROWS ( DualLine_PlotData )` มิฉะนั้น Power BI ตัดแถว Boundary/Crossing (Design Plan 2.1.1)
  - Deneb 2.0 ส่ง `__highlightStatus = "on"` ทุกแถวขณะ highlight (ต่างจากเอกสาร) → เงื่อนไขจางใหม่ (Design Plan 2.2.3); รูปแบบจางตามคำขอผู้ใช้: เส้นไม่จาง จุด/connector/label เดือนอื่น 0.5
  - คลิกพื้นที่สีเลือก "เดือนต้นช่วง" — ผู้ใช้ยอมรับและให้เขียนในบทที่ 8 (Design Plan 2.2.2)
  - แกน X อ่านชื่อจาก Category แบบ dynamic (T09/T10) + แก้ label ทับที่ขนาดแคบ (spec rev 7)
  - Template ที่ Deneb export มีบั๊ก escaping → template ส่งมอบที่แก้แล้ว `templates/dual-line-variance.deneb-template.json`
- Codex รอบ 4–19 (REVISE หลายรอบ แก้ M-12 ถึง M-28 ทั้งหมด) → **รอบ 19 PASS**: gate ข้อ 5, 6, 7, 8 ผ่านครบ; M-11 (เส้นโค้ง) ยังเป็น Known limitation ตามคำตัดสินผู้ใช้
- Final spec: `specs/dual-line-variance-final.vl.json` (rev 7), Workshop steps 11 ไฟล์ใน `specs/steps/`, tests 464/464 + axis overlap sim 18/18

### Phase 3 — กำลังดำเนินการ (เขียนทีละบท)

| บท | สถานะ | Review |
| --- | --- | --- |
| 1 รู้จัก Deneb | **PASS** (24 ก.ย. 2026) | `review/chapters/CH01_CODEX_VERDICT.md` (REVISE) → `..._R2.md` (PASS) |
| 2 เตรียม Power BI และ Deneb | **PASS** (25 ก.ย. 2026) ภาพจริง 2-1 ถึง 2-20 ใน images/chapter-02 ใช้ Workshop_Data 12 แถว | `review/chapters/CH02_CODEX_VERDICT.md` (REVISE, M-01 ถึง M-07) → `..._R2.md` (PASS) |
| 3 โครงสร้างภาษา Vega-Lite | **PASS** (25 ก.ย. 2026) ตัวอย่าง 9 ชิ้นทดสอบด้วย `qa/scripts/run-ch03-example-tests.mjs` (65 ผ่าน) ภาพ 3-1 ถึง 3-9 เป็น render headless ไม่ใช่ภาพหน้าจอ Power BI | `review/chapters/CH03_CODEX_VERDICT.md` (REVISE) → `..._R2.md` (PASS) |
| 4 ชุดข้อมูล Workshop | **PASS** (25 ก.ย. 2026, Codex รอบแรก ไม่มี Mandatory) ภาพจริง 4-1 ถึง 4-10, ตัวเลขตรวจด้วย `qa/scripts/run-ch04-claims-check.mjs` (8 ผ่าน) กรณีข้อมูลผิดปกติของ query ยังไม่ทดสอบบน Power Query จริง (บท 4.7, ไปทดสอบในบท 9) | `review/chapters/CH04_CODEX_VERDICT.md` (PASS) |
| 5 กราฟสองเส้นแรก | **รอภาพหน้าจอจริง** (ดูรายการด้านล่าง) ยังไม่เขียนต้นฉบับ | – |
| 6–10 | ยังไม่เริ่ม | – |

**งานค้างก่อนบทที่ 4 (ตัดสินเมื่อ 25 ก.ย. 2026)**: ผู้ใช้ต้องตั้งหน้าจอ Power BI แล้วพิมพ์ "ถ่าย" (หรือวางภาพขนาดเต็ม 1920×1020) ตามรายการ (1) Get data > Text/CSV ของ `DualLineVariance_Settings.csv` (2) Power Query Editor เห็น query `DualLineVariance_Workshop_Data` และ `DualLineVariance_Settings` (3) New Blank Query แล้ว Advanced Editor วาง `specs/DualLine_PlotData_PowerQuery.pq` (4) ตัวอย่างผลของ `DualLine_PlotData` ใน Power Query (52 แถว, คอลัมน์ Row_Type/Segment_ID/Plot_Position ฯลฯ) (5) Close & Apply (6) New measure `DualLine Row Count` (7) ช่อง Values ของ Deneb ผูก field ครบพร้อม Don't summarize / Sum ตามตาราง field ของบทที่ 4 (8) Model view เห็น Relationship `Filter_Key` (ถ้าใช้ภาพ T18-00 จาก qa/evidence ต้องตรวจก่อนว่าไม่มีชื่อบัญชี) ภาพทั้งหมดใช้ตาราง Workshop 12 แถว และต้องบอกชัดว่าตารางไหนใช้กับภาพไหน (บทเรียนจากบทที่ 2)

**งานค้างก่อน Phase 4 (จาก review บทที่ 1)**: ถ่ายภาพ 1-1 ใหม่จาก spec rev 7 ความละเอียดสูง (ปัจจุบันเป็นภาพ rev 5 crop 556×318 พร้อม disclosure ใน caption); พิจารณาเก็บภาพหน้าต่าง About ที่ปิดบัง User ID/Session ID/ชื่อบัญชี

**แผนบทที่ 2 (วางไว้ 24 ก.ย. 2026)** — 5 Step ตามมาตรฐาน 12 หัวข้อ: S01 ติดตั้ง Deneb จาก AppSource (Build pane `…` > Get more visuals หรือ Insert > More visuals > From AppSource), S02 นำเข้า `data/DualLineVariance_Workshop_Data.csv` (Get data > Text/CSV), S03 วาง Deneb บนหน้าใหม่และผูก Category + Actual (ดู landing page ก่อน/หลังใส่ field), S04 เปิด Editor (visual header `…` > Edit) แล้วสร้างจาก template Vega-Lite > "Interactive bar chart", S05 ทัวร์ Editor: แท็บ Specification/Config/**Project setup** (เอกสารเรียก Settings แต่หน้าจอจริงเรียก Project setup), ปุ่ม Apply (Ctrl+Enter) / Auto-apply (Ctrl+Shift+Enter), Preview + viewport marker, Debug pane Source/Data/Signals/Logs, zoom, status bar "Show compiled Vega", Back to report — ชื่อจาก deneb.guide/docs/visual-editor และภาพจริง

**ภาพจริงที่ต้องเก็บ (ผู้ใช้ตั้งหน้าจอแล้วพิมพ์ "ถ่าย" — Claude จับภาพด้วย PowerShell CopyFromScreen แล้ว crop ตัดชื่อบัญชีมุมขวาบน)**: (1) เมนู `…` ของ Build pane ที่มี Get more visuals (2) หน้าต่าง AppSource ค้นหา Deneb (3) หน้า preview ของ Text/CSV (4) Deneb landing page ตอนว่าง (5) landing page หลังใส่ field (6) เมนู `…` ของ visual ที่มี Edit (7) Create dialog เลือก Vega-Lite + รายการ template (8) หน้าจับคู่ placeholder (9) Editor หลัง Create (10) Debug pane แท็บ Source/Data/Signals/Logs (11) Show compiled Vega — ทำบน Page 2 ของ deneb demo.pbix
