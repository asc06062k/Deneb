# Phase 2 review request รอบ 17 (สำหรับ Codex CLI)

รอบ 16 `REVISE` เหลือ M-27 (T09/T10) ([`qa/PHASE2_CODEX_VERDICT_R16.md`](../qa/PHASE2_CODEX_VERDICT_R16.md)) — **ผู้ใช้เลือกทำ Category axis แบบ dynamic ตามคำแนะนำของ Codex** → final spec rev 6 (ดู `git diff f206402..HEAD` ส่วนที่เกี่ยวกับ specs/, qa/scripts/, data/test/) ระหว่างนั้นมีหลักฐาน Power BI เพิ่ม (T29/T33 รอบ 1–2, T27 รอบ 1–2) M-11 ยังเป็น Known limitation

## การเปลี่ยนแปลง rev 6

- params ใหม่ `xAxisSortOrders`, `xAxisCategories`, `xAxisSortExtent`, `xAxisValues` จาก `data('dataset')`; `line_actual` axis: `values: {expr: xAxisValues}`, `labelExpr` lookup Category ตาม Sort_Order, `labelLimit: 120`, คง `labelOverlap: greedy`
- Generator: params `xAxis*` ใส่ตั้งแต่ CH05-S01, y-domain params ตั้งแต่ CH05-S05 (test params เป็น in-order subset)
- ชุดข้อมูลทดสอบ: `qa/scripts/build-test-datasets.mjs` → `data/test/DualLineVariance_T09_LongCategory.csv` (ชื่อยาวสุด 38 ตัวอักษร), `data/test/DualLineVariance_T10_24Categories.csv` (24 categories) + PlotData JSON
- Tests AXIS-*: ทุก label มาจาก Category (หรือตัดด้วย "…"), label แรก = Category แรก, ≥ 2 labels ทุก 6 viewport × 3 ชุด — **ถอด assertion "ไม่ทับซ้อน" แบบ headless** เพราะ Vega headless ไม่มี canvas วัดความกว้างอักษรไทย (debug พบ bounds ประมาณเกินจริงและไม่ตรงกับภาพ) → Group B ตัดสินบน Power BI (T25) — ผล 460/460
- Design Plan 4.1 amendment, PROJECT_PLAN บทที่ 5, Evidence T27 หมายเหตุ

## หลักฐาน Power BI ใหม่ (ตรวจว่าไม่ overclaim)

- T29/T33 รอบ 1 (Slicer = DualLine_PlotData[Category]) แถว Fill ไม่ถูกตัด; รอบ 2 (Slicer = Workshop_Data[Category]) ผ่านทั้ง 4 แบบ (`T29-02`, `T33-02`, `T29C-02`, `T33C-02`)
- T27: template export มีบั๊ก escaping (`\'` 66 จุด) → ILLEGAL token; แก้ไฟล์แล้ว import บน Deneb จริงได้ (`T27-03`)

## ขอให้ตรวจ

1. ตรรกะ rev 6 ถูกต้อง/ปลอดภัย (null Sort_Order, filter เอาบางเดือนออก, Sort_Order ไม่ต่อเนื่อง, dataset ว่าง)
2. การถอด headless overlap assertion สมเหตุสมผลหรือไม่ และเอกสารระบุชัดว่า Group B ต้องตัดสินบน Power BI
3. T29/T33/T27 บันทึกไม่ overclaim
4. เหลืออะไรก่อน Phase 2 PASS (คาดว่า: ผู้ใช้ทดสอบ T09/T10 × 6 viewport บน Power BI ด้วย spec rev 6)

รันซ้ำ: `VEGA_NODE_MODULES="C:/Users/MSI/AppData/Local/Temp/claude/D--DATA-Deneb-Course/e0eca914-7edf-4826-aab4-d1f1530c20da/scratchpad/node_modules" node qa/scripts/run-workshop-step-tests.mjs`

ตอบในรูปแบบเดิม เป็นภาษาไทย
