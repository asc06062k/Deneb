# Spec rev 8 — review รอบ 2 (Codex CLI)

รอบ 1 (`review/SPEC_REV8_CODEX_VERDICT.md`) `REVISE` ด้วย Mandatory ข้อเดียว **M-01**: highlight เดือนที่ Actual/Reference เป็น Blank (spec แปลงเป็น 0 แต่ `__highlight` เป็น null)

การจัดการ: ข้อมูลที่ Deneb ส่งแยกไม่ได้ (status `on` + `__highlight` null ทั้งแถวไม่ถูกเลือกและเดือน Blank ที่ถูกเลือก) จึงเลือกทางเลือก (ข): **บันทึกเป็นข้อจำกัด ไม่อ้างว่ารองรับ** ใน `review/PHASE1_DESIGN_PLAN.md` หัวข้อ 0.6 ท้ายไฟล์ (ข้อ 1) พร้อมชุดทดสอบ `EDGE-blankHighlight` ที่ยืนยันพฤติกรรม (highlight เดือน Blank → จุด Actual จางทั้ง 12) และกำหนดให้ทดสอบบน Deneb จริงในบทที่ 9

ข้อเสนอเสริมที่ทำแล้ว (ชุดทดสอบ `qa/scripts/run-workshop-step-tests.mjs` ตอนนี้ 503 รายการ ผ่านหมด vega 6.4.0 / vega-lite 6.4.3 ผลรันที่ `qa/evidence/spec-rev8/run-output.txt`):
- `VERT-*` เทียบ segment index และ part (a/b) ด้วย ไม่ใช่แค่ค่าจุด
- `VERT-mutation` 3 แบบ (ไม่กลับเครื่องหมายครึ่งหลัง, สลับ part, ไม่เลื่อน x ของจุดตัด) ต้องถูกจับได้
- ตรวจ top-level transform ของแต่ละ Step ว่า **เท่ากับ** ชุดที่วางแผน (S01–S04 = row_number, S05 = clean×2 + row_number, บท 6+ ครบ 10)
- `EDGE-businessTypeInvalid`: ค่านอก allow-list → ทุกช่วงเป็น Bad (ตั้งใจ: ไม่ fallback)
- ข้อจำกัดข้อ 2–5 บันทึกไว้แล้วในไฟล์เดียวกัน; ไม่ได้เพิ่มกรณี NaN/Infinity (Power BI ไม่ส่ง)

ขอให้ตรวจว่า (ก) M-01 ปิดตามแนวทาง (ข) ยอมรับได้ (ข) ไม่มี Mandatory ใหม่ (ค) ยอมรับให้เริ่มเขียนบทที่ 4–8 ใหม่บนสถาปัตยกรรมนี้ โดยมี template import และ highlight เดือนว่างเป็นงานทดสอบค้างของบทที่ 9 ตอบรูปแบบเดิม ภาษาไทย
