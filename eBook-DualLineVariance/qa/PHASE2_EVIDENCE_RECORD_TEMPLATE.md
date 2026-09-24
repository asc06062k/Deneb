# Phase 2 — Evidence Record Template (ต้องทดสอบบน Power BI Desktop + Deneb จริง)

Claude/Codex ไม่มีสิทธิ์เข้าถึง Power BI Desktop หรือ Deneb Editor จริง — รายการนี้ต้องให้**ผู้ใช้เป็นผู้ทดสอบบนเครื่องจริง**แล้วกรอกผลกลับมา ตามรูปแบบที่ Lock ไว้ใน [PHASE1_DESIGN_PLAN.md](../review/PHASE1_DESIGN_PLAN.md) หัวข้อ 8 Test ใดไม่มี Evidence ครบ = สถานะ `NOT TESTED` และห้ามเข้า release ฉบับ Final ตาม `PROJECT_PLAN.md`

**เวอร์ชันที่ต้อง Lock ก่อนเริ่ม**: Power BI Desktop `2.157.1354.0` (64-bit), Deneb `2.0.0.0` — ถ้าเครื่องจริงใช้เวอร์ชันอื่น ให้บันทึกเวอร์ชันจริงและแจ้งกลับก่อนทดสอบต่อ เพราะชื่อ/ตำแหน่ง UI อาจเปลี่ยนไปจากที่เอกสารอ้างอิง

**ไฟล์ที่ต้องใช้**:
- Dataset: `data/DualLineVariance_Workshop_Data.csv`, `data/DualLineVariance_Settings.csv`
- Power Query: `specs/DualLine_PlotData_PowerQuery.pq` (วางใน Power Query Advanced Editor เพื่อสร้างตาราง `DualLine_PlotData`)
- DAX: `dax/workshop-measures.dax`
- Vega-Lite spec: `specs/dual-line-variance-final.vl.json` (วางใน Deneb Editor ผูก `data.name = "dataset"` เข้ากับ `DualLine_PlotData`)

**วิธีผูก Values ของ Deneb (เพิ่ม 24 ก.ย. 2026 หลังเห็นภาพ T30-01 ที่ผูกไว้เพียง 4 field จาก query ชื่อ `Query` จนได้ dataset 12 แถวและกราฟว่าง)** — ต้องผูกจากตาราง `DualLine_PlotData` (เปลี่ยนชื่อ query จาก `Query` ใน Power Query ก่อน):
- ตั้งเป็น **Don't summarize** (คลิกลูกศรที่ field ในช่อง Values): `Plot_Position`, `Plot_Actual`, `Plot_Reference`, `Run_Sign`, `Sort_Order` — ถ้าปล่อยเป็น Sum จะเหลือไม่ถึง 52 แถว (คอลัมน์ข้อความอย่างเดียวแยกแถวได้แค่ 50 แถว ตรวจจาก `qa/scripts/workshop-plotdata.json`)
- คอลัมน์ข้อความ: `Row_Type`, `Category`, `Segment_ID`, `Business_Type`, `Filter_Key`
- **คง Sum ไว้** (เป็น measure): `Actual`, `Reference` — เพื่อให้ Deneb สร้าง `Actual__highlight`/`Actual__highlightStatus`/`Reference__highlight`/`Reference__highlightStatus` ที่ spec ใช้ (แถว Boundary/Crossing มีค่า null อยู่แล้ว ผลรวมจึงไม่เปลี่ยนค่า)
- ชื่อใน Values ต้องเป็นชื่อ field ตรงตัว (เช่น `Actual` ไม่ใช่ `Sum of Actual`) — ถ้า Power BI เติม "Sum of" ให้ rename ในช่อง Values
- หลังผูกแล้ว Data pane ของ Deneb ต้องแสดง **1-52 of 52**

แบบฟอร์มด้านล่างมีทุกช่องพร้อม Test ID และ Expected ที่ Lock ไว้แล้ว — กรอกเฉพาะส่วนที่เหลือ (Actual, หลักฐาน, ผู้ทดสอบ, วันที่, ผลสรุป)

---

## T18 — Cross-filter ทิศทางออก (ความสำคัญสูงสุด — ดู M-23)

```text
Test ID: T18
Power BI Desktop version:
Deneb version:
PBIX file / hash:
Dataset/spec version หรือ hash: dual-line-variance-final.vl.json (Phase 2)
จำนวน Category / test scenario ที่ใช้: 12 (Workshop dataset)
Viewport (กว้าง×สูง px):
Display scaling ของ Windows (%):
Visual ต้นทาง (ชนิด) และ Interaction mode ที่ตั้ง (Highlight/Filter/None): N/A (นี่คือทิศทางออก — Visual นี้เป็นต้นทาง)
Supporting Fields ที่เปิด: N/A
Interactivity settings อื่นที่เปิดใน Deneb: Expose cross-filtering values for dataset rows (Simple mode), Relationship DualLine_PlotData<->Dimension ร่วม ตั้ง Cross-filter direction = Both
ขั้นตอนทำซ้ำ:
  (ก) คลิกที่จุดข้อมูล (Point layer) เดือนใดเดือนหนึ่ง แล้วดู Visual อื่นที่ผูกกับ Dimension เดียวกัน
  (ข) คลิกกลางแถบสี Area ในบริเวณที่ไม่มี Point/Connector คาบเกี่ยว แล้วดู Visual อื่น
Expected:
  (ก) Visual อื่นกรองเหลือเฉพาะเดือนที่คลิกจริง
  (ข) เป็นคำถามเปิด — บันทึกผลจริงว่า Visual อื่นเหลือ Category ใดบ้าง (ดู PHASE1_DESIGN_PLAN.md หัวข้อ 2.2 ว่าอาจกรองผิดหลาย Category พร้อมกัน)
Actual (ก):
Actual (ข):
หลักฐาน (ภาพ/วิดีโอ):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

**ถ้า (ข) กรองผิด**: ต้องเปลี่ยน interaction architecture (เช่น Advanced cross-filtering mode ของ Deneb) ก่อน Phase 2 จะ `PASS` ตาม `PROJECT_PLAN.md` Phase 2 ข้อ 7 — แจ้งผลกลับก่อนดำเนินการต่อ ไม่ต้องแก้เอง

---

## T19 — Cross-highlight (Visual ต้นทาง = Clustered bar chart)

```text
Test ID: T19
Power BI Desktop version:
Deneb version:
Visual ต้นทาง (ชนิด) และ Interaction mode ที่ตั้ง: Clustered bar chart, Edit interactions = Highlight
Supporting Fields ที่เปิด: Highlight value + Highlight status สำหรับ Actual และ Reference (Supporting Fields: dataset)
Interactivity settings อื่นที่เปิดใน Deneb: Expose cross-highlight values for measures
ขั้นตอนทำซ้ำ: คลิก/เลือกแถบใน Clustered bar chart แล้วดู Dual-Line Variance Chart
Expected: จุดข้อมูลที่ไม่ถูกเลือกแสดงผลจางลง/ต่างจากจุดที่ถูก highlight (ตาม __highlight/__highlightStatus)
Actual:
หลักฐาน (ภาพ/วิดีโอ):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T20 — Edit interactions = Filter

```text
Test ID: T20
Visual ต้นทาง: Clustered bar chart, Edit interactions = Filter
ขั้นตอนทำซ้ำ: เลือกแถบใน Visual ต้นทาง
Expected: Dual-Line Variance Chart ถูกกรองแบบ Filter ปกติ ไม่ใช่ Highlight fields
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T21 — Edit interactions = None

```text
Test ID: T21
Visual ต้นทาง: Clustered bar chart, Edit interactions = None
ขั้นตอนทำซ้ำ: เลือกแถบใน Visual ต้นทาง
Expected: Dual-Line Variance Chart ไม่ตอบสนองเลย
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T22 — Context menu (รวมกรณี Area ที่เป็นคำถามเปิดจาก M-23)

```text
Test ID: T22
Interactivity settings: Show context menu on right-click + Attempt to resolve data point-specific actions
ขั้นตอนทำซ้ำ:
  (ก) Right-click ที่ Point layer (จุดข้อมูล)
  (ข) Right-click กลางแถบสี Area (ไม่มี Point คาบเกี่ยว)
Expected:
  (ก) Context menu resolve เป็นแถว Original/Category จริง
  (ข) คำถามเปิด — บันทึกว่า resolve เป็นอะไรจริง (ไม่ควร resolve ผิด Category)
Actual (ก):
Actual (ข):
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T23 — Business_Type Column ไม่กระทบ grain

```text
Test ID: T23
ขั้นตอนทำซ้ำ: เปิด Data pane ของ Deneb ตรวจจำนวนแถวใน dataset เทียบกับจำนวนแถวจริงของ DualLine_PlotData (52 แถวสำหรับ Workshop dataset — ดู qa/scripts/workshop-plotdata.json)
Expected: จำนวนแถวตรงกันพอดี ไม่ถูก Deneb aggregate/group ซ้ำ
Actual:
หลักฐาน (screenshot ของ Data pane):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T36 — แกน Y อัตโนมัติ ±18% แบบต้นแบบ (เพิ่ม 24 ก.ย. 2026 ตามคำตัดสินผู้ใช้ + Codex R6)

spec คำนวณ domain จาก `data('dataset')` ทุกแถว ดู `params` ใน `specs/dual-line-variance-final.vl.json` — ทุกกรณีดูค่าต่ำสุด/สูงสุดของแกน Y ที่แสดง (หรือ signal `yDomainMin`/`yDomainMax` ใน Signal viewer ของ Deneb)

```text
Test ID: T36-A (ข้อมูลเต็ม ไม่มี filter)
Expected: Signal yDomainMin = 340.4, yDomainMax = 639.6 (ข้อมูล 380–600); แกน Y ไม่เริ่มที่ 0; ยืนยันด้วยว่า Deneb ใช้ชื่อ data source "dataset" จริง (ถ้าไม่ใช่ แกนจะเป็น [0, 1] หรือ error)
Actual:
หลักฐาน (screenshot กราฟ + Signal viewer):

Test ID: T36-B (รับ Filter จาก Visual อื่น — Edit interactions = Filter หรือ Slicer)
ขั้นตอนทำซ้ำ: กรองให้เหลือบางเดือน
Expected: แถวใน dataset ลดลง และ domain คำนวณใหม่จากเดือนที่เหลือ (±18% ของช่วงใหม่)
Actual:
หลักฐาน:

Test ID: T36-C (รับ Cross-highlight — Edit interactions = Highlight)
Expected: แถวใน dataset ไม่ลดลง domain ไม่เปลี่ยนจาก T36-A (เว้นแต่ host ส่งข้อมูลแบบลดแถว — ถ้าเป็นเช่นนั้นให้บันทึก)
Actual:
หลักฐาน:

Test ID: T36-D (คลิก Cross-filter จากกราฟนี้เอง — Simple mode)
Expected: domain ของกราฟนี้ไม่เปลี่ยน (การคลิกกรอง Visual อื่น ไม่ได้กรอง dataset ของตัวเอง)
Actual:
หลักฐาน:

Test ID: T36-E (Filter จนไม่เหลือข้อมูล)
Expected: ไม่มี error, domain = [0, 1]
Actual:
หลักฐาน:

Power BI Desktop version:
Deneb version:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED (แยกราย T36-A ถึง E)
```

---

## T14–T17, T34, T35 — Responsive ต่อขนาด viewport (Category axis label = Group B, Actual/Reference data label thinning = Group A)

หมายเหตุ: T25 คือผลรวม (ต้องผ่านทุกขนาดด้านล่างจึงตัดสิน T25 = PASS) และ T26 คือผลรวมของ Group A ในทำนองเดียวกัน — กรอกทีละขนาดก่อน แล้วค่อยสรุป T25/T26 ที่ท้ายหัวข้อนี้ ร่วมกับข้อมูล: Baseline (12 เดือน) + T09 (ชื่อยาว) + T10 (24 categories)

```text
Test ID: T14 (280×180 px — แคบสุด)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่ (Expected: ไม่ทับซ้อนเลย):
Group A — Actual/Reference data label ชนกันหรือไม่ (Expected: ลดการชน ไม่รับประกัน 100%):
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T15 (480×270 px)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T16 (800×450 px)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T17 (1200×675 px — กว้างสุด)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T34 (1200×220 px — กว้าง-เตี้ย)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T35 (320×700 px — แคบ-สูง)
จำนวน Category / test scenario ที่ใช้:
Group B — Category axis label ทับซ้อนหรือไม่:
Group A — Actual/Reference data label ชนกันหรือไม่:
หลักฐาน (screenshot):
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T25 (สรุป Group B — Category axis label ไม่ทับซ้อน ทุกขนาด)
Expected: T14–T17, T34, T35 ทั้งหมด Group B ต้อง PASS (ใช้ labelOverlap:"greedy" + width:"container")
ผลสรุป: PASS / FAIL / NOT TESTED (PASS ได้เฉพาะเมื่อ T14–T17, T34, T35 ทั้งหมด Group B = PASS)

Test ID: T26 (สรุป Group A — Actual/Reference data label ลดการชน ทุกขนาด, ไม่รับประกัน 100%)
Expected: label re-evaluate ทุกครั้งที่ resize (container width signal), ลดการชนแต่ไม่ต้องไม่ชนเลย
ผลสรุป: PASS / FAIL / NOT TESTED (พิจารณาจากผลรวม T14–T17, T34, T35 Group A — เกณฑ์ "ลดการชน" ไม่ใช่ collision-free)
```

---

## T27 — Template limitation (Export/Import แล้วนำไปใช้ข้อมูลใหม่)

```text
Test ID: T27
ขั้นตอนทำซ้ำ: Export Deneb Template จาก Workshop dataset แล้ว Import เข้า report ใหม่พร้อมข้อมูลอื่น
Expected: Field mapping ทำงาน แต่ crossing-case (ต้อง Power Query ใหม่) และ labelExpr array (ต้องแก้ manual) ไม่ทำงานอัตโนมัติ — ตามข้อจำกัดที่ระบุใน PHASE1_DESIGN_PLAN.md หัวข้อ 2.5/4.1
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T29 / T33 — Filter ตัด Category ฝั่งขวา/ฝั่งซ้ายของ segment ที่มี Boundary/Crossing (ครอบคลุมทั้ง Case B และ Case C)

```text
Test ID: T29 (ตัดฝั่งขวา — Case B, strict crossing)
ขั้นตอนทำซ้ำ: ใช้ Slicer กรอง Category ออก 1 ตัวที่เป็นฝั่งขวาของ segment ที่มีจุดตัด (เช่น กรอง "ก.พ." ออก ซึ่งเป็นฝั่งขวาของ segment 0-a/0-b, Row_Type=Crossing)
Expected: แถว Fill ของ segment นั้นยังไม่ถูกตัด (dangling) เพราะ Filter_Key ยังตรงกับฝั่งซ้าย (ม.ค.)
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED

Test ID: T33 (ตัดฝั่งซ้าย — Case B, strict crossing)
ขั้นตอนทำซ้ำ: กรอง Category ฝั่งซ้ายของ segment เดียวกันออก (เช่น กรอง "ม.ค." ออก)
Expected: แถว Fill ของ segment นั้นถูกตัดออกทั้งหมด เพราะ Filter_Key ของทุกแถว = key(ม.ค.)
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

```text
Test ID: T29-C (ตัดฝั่งขวา — Case C, ไม่มีจุดตัด/same-sign segment)
ขั้นตอนทำซ้ำ: ใช้ Slicer กรอง Category ออก 1 ตัวที่เป็นฝั่งขวาของ segment แบบ Case C (เช่น segment "4" ระหว่าง พ.ค.→มิ.ย. — กรอง "มิ.ย." ออก)
Expected: แถว Fill ของ segment "4" ยังไม่ถูกตัด เพราะ Filter_Key ของทั้งสองแถว Boundary = key(พ.ค.)
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED

Test ID: T33-C (ตัดฝั่งซ้าย — Case C, ไม่มีจุดตัด/same-sign segment)
ขั้นตอนทำซ้ำ: กรอง Category ฝั่งซ้ายของ segment "4" ออก (กรอง "พ.ค." ออก)
Expected: แถว Fill ของ segment "4" ถูกตัดออกทั้งหมด เพราะ Filter_Key ของทั้งสองแถว = key(พ.ค.)
Actual:
หลักฐาน:
ผู้ทดสอบ:
วันที่:
ผลสรุป: PASS / FAIL / NOT TESTED
```

---

## T30 — ยืนยันชื่อ/ตำแหน่ง UI จริงของ Deneb 2.0.0.0

```text
Test ID: T30
ขั้นตอนทำซ้ำ: เปิด Deneb Editor แล้วเทียบชื่อ/ตำแหน่งกับที่ Design Plan อ้างอิง:
  - Project setup pane
  - Expose cross-filtering values for dataset rows (+ โหมด Simple/Advanced)
  - Expose cross-highlight values for measures
  - Supporting Fields: dataset (Highlight value / Highlight status / Highlight comparator)
  - section Context menu (Show context menu on right-click / Attempt to resolve data point-specific actions)
Expected: ชื่อ/ตำแหน่งตรงกับที่อ้างจากเอกสาร deneb.guide
Actual (ระบุความต่างถ้ามี): [กรอกบางส่วนจากภาพที่ 1 — 24 ก.ย. 2026]
  - Editor มีแท็บ Specification / Config / Project setup — ตรง ("Project setup" คือแท็บ ไม่ใช่ pane แยก)
  - Cross-filtering: "Expose cross-filtering values for dataset rows" (เปิดอยู่) — ตรง
  - "Cross-filtering management": Simple ("Let Deneb attempt to resolve cross-filtering for me") / Advanced ("available for Vega only") — ตรง; มีการตั้งค่าเพิ่ม "Data point limit" = 50 (default) ที่เอกสารของเราไม่ได้อ้างถึง
  - Cross-highlighting: "Expose cross-highlight values for measures" (เปิดอยู่) — ตรง
  - "Supporting fields: dataset" — เป็น section ใน Project setup (ภาพที่ 2) แสดงรายการ field ที่ผูกไว้ (Category, Business_Type = ไอคอนตาราง; Actual, Reference = ไอคอน measure พร้อมจุดสี) แต่ละตัวขยายได้ — ภาพที่ 3–4: **measure** (Actual, Reference) มี "Highlight value" (ติ๊กไว้โดย default), "Highlight status", "Highlight comparator" (ไม่ติ๊กโดย default) — ตรงกับเอกสารและกับข้อความใน Plan ว่า "ค่าเริ่มต้นเปิดเฉพาะ Highlight value"; ทั้ง column และ measure มีตัวเลือกเพิ่มที่เอกสารเราไม่ได้อ้าง: "Format string", "Formatted value", "Treat as field parameter"
  - Context menu (ภาพที่ 2): "Show context menu on right-click" (เปิด) และ "Attempt to resolve data point-specific actions" (เปิด) — ตรงทั้งสองชื่อ
  - section อื่นที่พบแต่เอกสารเราไม่ได้อ้าง: "Semantic model integration", "Tooltips"
  - Data pane มี dropdown "Data set" = `dataset` — ยืนยันชื่อ data source ที่ spec ใช้ (`data: {name: "dataset"}` และ `data('dataset')` ใน params ของแกน Y)
  - Footer แสดง "Vega-Lite 6.4.3" — ตรงกับเวอร์ชันที่ใช้ทดสอบ headless
  - Data pane แสดงคอลัมน์ __row__, __selected__ (neutral), Actual__highlight... — ชื่อ highlight field ใช้ชื่อที่แสดงของ field ("Actual") สอดคล้องกับ spec (T19 ต้องยืนยัน Actual__highlightStatus ต่อ)
หลักฐาน (screenshot แต่ละหน้าตั้งค่า): qa/evidence/phase2-powerbi/T30-01-project-setup-crossfilter-highlight.png, T30-02-supporting-fields-context-menu.png, T30-03-supporting-fields-expanded-columns.png, T30-04-supporting-fields-expanded-measures.png
ผู้ทดสอบ: ผู้ใช้ (เครื่องจริง)
วันที่: 24 ก.ย. 2026
ผลสรุป: PASS — ทุกชื่อ UI ที่ Design Plan อ้างอิงตรงกับ Deneb จริง (ข้อสังเกต: "Project setup" เป็นแท็บของ Editor; "Supporting fields: dataset" เป็น section ใน Project setup แยกราย field; มี "Data point limit", "Semantic model integration", "Tooltips", "Format string", "Formatted value", "Treat as field parameter" เพิ่มเติม — ใช้ประกอบการเขียนบทที่ 2 และ 8) — Power BI Desktop/Deneb version ยังไม่ได้บันทึกจากเครื่องจริง (ภาพแสดงเฉพาะ Vega-Lite 6.4.3)
```

---

หลังกรอกครบทุก Test ID ข้างต้น ส่งไฟล์นี้กลับมาเพื่อนำผลไปสรุปใน `qa/PHASE2_DATASET_TEST_LOG.md` และตัดสิน Phase 2 gate ตาม `PROJECT_PLAN.md` Phase 2 ข้อ 5–7
