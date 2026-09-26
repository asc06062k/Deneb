# Spec rev 8 (สถาปัตยกรรม 4 field) — review request สำหรับ Codex CLI

บทที่ 1–8 เดิม `PASS` แล้วบนสถาปัตยกรรม 13 field (ตาราง `DualLine_PlotData` จาก Power Query) ผู้ใช้ตัดสิน (26 ก.ย. 2026) ให้ส่งเข้า Deneb แค่ 4 field: `Category`, `Actual`, `Reference` (measure Sum เปลี่ยนชื่อ) และ `Business_Type` (measure ค่าคงที่) แล้วให้ spec สร้างพื้นที่ Good/Bad เอง งานนี้คือ **รีวิววิศวกรรมของ spec/ชุดทดสอบ/template** ก่อนเขียนบทที่ 4–8 ใหม่ (บทต้นฉบับยังไม่ถูกแก้ ตั้งใจ)

อ่านตามลำดับ: `review/PHASE1_DESIGN_PLAN.md` หัวข้อ 0.6 (สรุปการเปลี่ยน), `specs/dual-line-variance-final.vl.json` (spec ใหม่ 4 field), `specs/experiments/four-field-variance.vl.json` + `qa/scripts/proto-four-field-variance-area.mjs` (ต้นแบบที่พิสูจน์แนวคิด), `qa/scripts/build-workshop-steps.mjs` (สร้าง Step 11 ไฟล์ใน `specs/steps/` จาก final spec: top-level `transform` ต่อ Step ตามดัชนี), `qa/scripts/run-workshop-step-tests.mjs` (487 รายการ: โครงสร้าง subset ต่อ Step, compile/render, จำนวน mark, แกน Y, HL-* สถานการณ์ highlight, AXIS-*, **VERT-*** เทียบจุดยอดพื้นที่ที่ spec คำนวณกับอัลกอริทึม Power Query เดิม `qa/scripts/plotdata-algorithm.mjs` สำหรับ Workshop/T09/T10, **EDGE-*** กรณีขอบ), `qa/scripts/build-template.mjs` + `templates/dual-line-variance.deneb-template.json` (สร้างจาก final spec พร้อม round-trip check), `dax/workshop-measures.dax`

หลักฐานบน Deneb จริง (Power BI 2.157.1354.0 + Deneb 2.0.0.0, `qa/evidence/four-field-experiment/`): T1 Values 4 field, T2 dataset 12 แถวเรียง ม.ค.–ธ.ค. เมื่อ Category ตั้ง Sort by column = Sort_Order (Deneb สร้าง `Actual__highlight...` ให้ครบ), T3 กราฟวาดครบ, CF1–CF3 คลิกจุด ต.ค. → แท่ง ต.ค.; คลิกพื้นที่ ม.ค.–ก.พ. ชิด ก.พ. → ม.ค.; คลิกพื้นที่ พ.ค.–มิ.ย. ชิด พ.ค. → พ.ค. (เดือนต้นช่วง เหมือนสถาปัตยกรรมเดิม)

## ขอให้ตรวจ (ตรรกะและความเสี่ยงจริง ไม่ใช่รูปแบบ)

1. **ความถูกต้องของอัลกอริทึมใน spec**: `window` `row_number` และ `lead` (ไม่มี `sort`/`frame`: พึ่งลำดับข้อมูล), `Diff`/`NextDiff`/`RunSign` (กรณีช่วงแตะ Diff = 0 ที่ปลายด้านเดียว), `CrossT`/`CrossY`, อาร์เรย์ `Vertices` 4/2 จุด, `flatten`, การกรอง `isValid(datum.NextActual)` ของแถวสุดท้าย, การใช้ `datum.Vertex.sign` ในเงื่อนไขสี, พฤติกรรมเมื่อ Diff = 0 ทุกช่วง
2. **นโยบายค่าว่าง**: `calculate` เขียนทับ field `Actual`/`Reference` (blank → 0) ที่ระดับ top-level และผลต่อเงื่อนไข highlight (`datum.Actual__highlight === datum.Actual`), `yHasBlank` + `MAX_VALUE`/`-MAX_VALUE` ในพารามิเตอร์แกน Y
3. **Deneb-specific**: top-level `transform` ใน layered spec, การอ้าง field ซ้อน `Vertex.x` (`field` มีจุด), การคง field ของ Deneb/`__row__` ผ่าน window/flatten (ใช้กับการเลือกเดือนต้นช่วง), `params` ที่ `pluck(data('dataset'), ...)` อ่านข้อมูลดิบก่อน transform
4. **Step ที่สร้างจาก final spec**: `T_POSITION` (Step 1–4 ของบทที่ 5 มี top-level transform แค่ `row_number`), `T_POSITION_CLEAN` (Step 5), `T_ALL` (บทที่ 6 เป็นต้นไป), Step ทุกไฟล์ต้องเป็น subset ของ final spec และ Step สุดท้ายต้องเท่ากับ final spec
5. **Template**: placeholder `__dataset.N__` ครอบคลุมทุกรูปแบบการอ้าง field (datum.X, datum.X__highlight, datum.X__highlightStatus, `"field"`, `"as"`, `'X'` ใน `pluck`) โดยไม่กระทบชื่อ derived (`NextActual`, `lenA` ฯลฯ) ผู้เขียนยังไม่ได้ทดสอบ import template นี้บน Deneb จริง (บอกในผลสรุปไม่ overclaim)
6. ชุดทดสอบ: จับความผิดพลาดจริงหรือไม่ (มี regression ที่ล้มเมื่อระดับ opacity ผิด), ช่องโหว่ที่ควรเพิ่ม
7. ความเสี่ยงที่ยังไม่ครอบคลุม: ข้อมูลที่ Power BI ส่งมาไม่เรียงตามเดือนเมื่อไม่ตั้ง Sort by column, แถวที่ตัดทิ้งเมื่อ Actual และ Reference ว่างพร้อมกัน (ตำแหน่งเดือนเลื่อน) ยอมรับเป็นข้อจำกัดที่ต้องเขียนในบทที่ 9

หมายเหตุสภาพแวดล้อมตรวจ: ชุดทดสอบต้องมี `VEGA_NODE_MODULES` (โฟลเดอร์ node_modules ที่มี vega และ vega-lite) และเขียนไฟล์ผลชั่วคราวไม่ได้ในโหมด read-only ถ้ารันซ้ำไม่ได้ ให้ตรวจโครงสร้างและตรรกะจากไฟล์โดยตรง

ตอบรูปแบบเดิม: Verdict (PASS/REVISE/BLOCKED), Mandatory findings (ตาราง มี ID ตำแหน่ง ข้อค้นพบ สิ่งที่ต้องแก้), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้ — ภาษาไทย
