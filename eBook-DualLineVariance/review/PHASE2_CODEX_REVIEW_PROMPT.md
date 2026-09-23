# Phase 2 review request (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของงาน Phase 2 (Dataset และ Vega-Lite Prototype) ของโครงการ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb — อ้างอิง `PROJECT_PLAN.md` และ `review/PHASE1_DESIGN_PLAN.md` (ผ่าน `PASS` แล้วที่รอบ 13) เป็น Source of truth

## สิ่งที่ทำในรอบนี้ (ส่วนที่ไม่ต้องใช้ Power BI จริง)

1. `data/DualLineVariance_Workshop_Data.csv` — ชุดข้อมูล Workshop จริง 12 เดือน มีจุดตัด (crossing) 9 จุด และจุด diff=0 พอดี 1 จุด
2. `data/DualLineVariance_Settings.csv` — Business_Type source
3. `specs/DualLine_PlotData_PowerQuery.pq` — M code ที่ implement อัลกอริทึม per-segment ตาม PHASE1_DESIGN_PLAN.md หัวข้อ 2.0 ทุกกรณี (A/B/C) พร้อม QA guard (duplicate Category, Business_Type normalize + sanity check)
4. `dax/workshop-measures.dax` — DAX measures สำหรับ Visual อื่นบนหน้ารายงาน (ไม่ใช่สำหรับ Dual-Line Variance Chart เอง)
5. `specs/dual-line-variance-final.vl.json` — Vega-Lite spec ฉบับสมบูรณ์ (ทุก layer ตาม Design Lock หัวข้อ 2.2: Area filtered Boundary/Crossing, Line/Connector/Point/Label filtered Original)
6. `qa/scripts/plotdata-algorithm.mjs` + `qa/scripts/run-phase2-static-tests.mjs` — reference implementation (JavaScript ไม่ใช่ M) ที่ใช้พิสูจน์ correctness ของอัลกอริทึมก่อนแปลงเป็น M, รันแล้วผ่าน 50/50 รวมชุดข้อมูล Workshop จริง
7. `qa/PHASE2_STATIC_TEST_LOG.md` — สรุปผลทั้งสองชั้น (Node.js algorithm verification + Vega-Lite Editor rendering verification ผ่าน DOM inspection จริง ไม่ใช่แค่ดู screenshot)
8. `qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md` — แบบฟอร์มเปล่าให้ผู้ใช้กรอกผลทดสอบจริงบน Power BI (T18-T23, T25-T27, T29-T30, T33-T35)
9. `images/chapter-06/phase2-static-render-evidence.svg` — SVG จริงที่ Vega render ออกมา พร้อม aria-label ระบุ Plot_Position/Plot_Actual/Plot_Reference/Segment_ID ทุก polygon

## ขอให้ตรวจประเด็นต่อไปนี้เป็นหลัก

1. **`specs/DualLine_PlotData_PowerQuery.pq`** — M code นี้ implement อัลกอริทึม 3 กรณี (A/B/C) ตรงตาม PHASE1_DESIGN_PLAN.md หัวข้อ 2.0 หรือไม่ โดยเฉพาะ: `Filter_Key` ผูกกับฝั่งซ้าย (`a[Category]`) เสมอทั้งกรณี B และ C ตรงตามหัวข้อ 2.2.1 หรือไม่, `Plot_Reference` ของแถว Boundary คัดลอกจาก `Reference` จริง (ไม่ใช่ `= Plot_Actual`) ตรงตามการแก้ M-13 หรือไม่, ตรวจว่า M syntax ถูกต้อง (List.Generate accumulator, Table.FromRecords กับ type ที่ประกาศ) จะ compile ได้จริงหรือไม่ — ถ้าไม่แน่ใจให้ระบุว่าต้องทดสอบจริงใน Power Query Editor ก่อนยืนยัน
2. **`specs/dual-line-variance-final.vl.json`** — layer structure ตรงกับ Design Lock หัวข้อ 2.2 ทุกจุดหรือไม่ (filter, tooltip:null, ไม่มี claim ผิดเรื่อง interactive:false)
3. **ชุดข้อมูล Workshop** — สมเหตุสมผลเป็นตัวอย่างสอนหรือไม่ (12 เดือน, มีจุดตัดพอทดสอบ feature หลัก, มีจุด diff=0 พอดี)
4. **`qa/scripts/`** — reference implementation JS ตรงกับ pseudocode ใน Design Plan หรือไม่ มี gap ระหว่าง JS version กับ M version หรือไม่ (เช่น edge case ที่ JS จับได้แต่ M ไม่ได้ หรือกลับกัน)
5. **`qa/PHASE2_STATIC_TEST_LOG.md`** — ผลที่รายงานสอดคล้องกับหลักฐาน (SVG evidence file, ผลรัน script) จริงหรือไม่ มีการอ้างว่าผ่านอะไรที่ยังไม่มีหลักฐานรองรับหรือไม่
6. **`qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md`** — ครอบคลุมทุก Test ID ที่ `PROJECT_PLAN.md` Phase 2 ข้อ 5-7 กำหนดหรือไม่ (T18/T22 Area safety, T23 grain, T25/T26/T34/T35 responsive, T27 Template, T29/T33 filter behavior, T30 UI verification)
7. ความเสี่ยงหรือ gap อื่นที่ควรแก้ก่อนพิจารณาว่า "ส่วน static ของ Phase 2" พร้อมส่งต่อให้ผู้ใช้ทดสอบจริงบน Power BI

## ข้อจำกัดที่ต้องรู้ก่อนรีวิว

- ส่วน static นี้ **ไม่ใช่ Phase 2 ที่ PASS สมบูรณ์** — Phase 2 ข้อ 5-7 ของ `PROJECT_PLAN.md` (UI verification, Business_Type/Responsive prototype proof, Area interaction safety) ยังต้องให้ผู้ใช้ทดสอบบน Power BI Desktop + Deneb จริงก่อน ถือเป็นคนละ Gate จากที่รีวิวรอบนี้
- ห้าม PASS ส่วน static นี้ถ้ามี Mandatory finding ที่กระทบความถูกต้องของ M code หรือ Vega-Lite spec เพราะจะส่งต่อไปให้ผู้ใช้ทดสอบของที่ผิดอยู่แล้ว

ตอบกลับในรูปแบบเดิม

1. Verdict: PASS, REVISE, หรือ BLOCKED (สำหรับ "ส่วน static" เท่านั้น ไม่ใช่ Phase 2 ทั้งหมด)
2. Mandatory findings (ตาราง: ID, ความรุนแรง, ไฟล์/บรรทัดที่เกี่ยวข้อง, ปัญหา, เหตุผล/หลักฐาน, ข้อเสนอแก้ไข)
3. Optional improvements
4. คำถามที่ต้องรอหลักฐานจากผู้ใช้ (Power BI จริง)
