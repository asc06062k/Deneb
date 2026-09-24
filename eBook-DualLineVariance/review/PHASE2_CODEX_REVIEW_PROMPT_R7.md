# Phase 2 review request รอบ 7 (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของ Phase 2 — รอบ 6 `PASS` สำหรับ static + Workshop steps ([`qa/PHASE2_CODEX_VERDICT_R6.md`](../qa/PHASE2_CODEX_VERDICT_R6.md)) รอบนี้เป็น **หลักฐานแรกจาก Power BI Desktop + Deneb จริงของผู้ใช้** ซึ่งพบปัญหาที่ Design Plan ไม่ได้คาดไว้ และมีการเพิ่ม Design Lock ใหม่ M-11 ยังเป็น Known limitation ตามคำตัดสินผู้ใช้ ไม่ต้องรีวิวซ้ำ

## หลักฐานจากเครื่องจริง (ภาพใน `qa/evidence/phase2-powerbi/` — เปิดดูได้)

บันทึกใน [`qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md`](../qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md) และ [`qa/PHASE2_STATIC_TEST_LOG.md`](../qa/PHASE2_STATIC_TEST_LOG.md) ส่วน M code:

- **M code compile ผ่าน** ได้ 52 แถว (ผู้ใช้รายงาน)
- **T30 PASS**: ชื่อ UI ทุกจุดตรงกับเอกสาร (ภาพ T30-01 ถึง T30-04)
- **T36-A PASS**: Signals `yDomainMin` 340.4 / `yDomainMax` 639.6, data set = `dataset`, แกน X/Y แสดงครบ (ภาพ T36A-01)
- **T23 รอบที่ 1 FAIL**: dataset เหลือ 12 แถว (ภาพ T23-01) — สมมติฐาน: `Actual`/`Reference` ผูกเป็น Sum (implicit measure เพื่อให้มี `__highlight`) และแถว Boundary/Crossing มีค่า Blank ตาม Field contract → Power BI ตัดแถวที่ measure ทุกตัว Blank
- **T23 รอบที่ 2 PASS**: (1) เอา Actual/Reference ออก → 52 แถว (ภาพ T23-02) (2) ใส่กลับ + measure `DualLine Row Count = COUNTROWS ( DualLine_PlotData )` → 52 แถว พื้นที่สีแสดงครบ (ภาพ T23-03)

## การเปลี่ยนแปลง (ดู `git diff HEAD`)

- `review/PHASE1_DESIGN_PLAN.md` หัวข้อใหม่ **2.1.1** — Lock measure `DualLine Row Count` ต้องอยู่ใน Values เสมอ, ไม่เติมค่าใน Actual/Reference, ทางเลือก Don't summarize ถ้าไม่ต้องการ Cross-highlight
- `dax/workshop-measures.dax` เพิ่ม measure พร้อมคำอธิบาย
- `PROJECT_PLAN.md` บทที่ 4 เพิ่ม measure และวิธีผูก field
- Evidence template: วิธีผูก Values + ผล T23

## ขอให้ตรวจ

1. หลักฐานรองรับข้อสรุปเรื่องสาเหตุ (Blank-measure row suppression) เพียงพอหรือไม่ และการแก้ด้วย `COUNTROWS` ถูกต้อง/ปลอดภัยหรือไม่ — เช่น ผลต่อ Cross-highlight: measure ใหม่จะมี `__highlight` ของตัวเองหรือไม่, จะกระทบ `Actual__highlightStatus` หรือไม่, และเมื่อรับ Filter จาก Visual อื่นแถว Boundary/Crossing จะยังอยู่ครบตาม `Filter_Key` หรือไม่ (ระบุเป็นสิ่งที่ต้องทดสอบถ้ายืนยันไม่ได้)
2. ทางเลือก Don't summarize ที่ระบุไว้ถูกต้องหรือไม่
3. การบันทึกผล T23/T30/T36-A ไม่ overclaim (เช่น T30 ยังไม่มีเลขเวอร์ชัน Power BI/Deneb)
4. เอกสารที่ต้องแก้ตาม amendment นี้ครบทุกจุดหรือไม่ (Test matrix, Template limitation T27, บทที่ 9)

ตอบในรูปแบบเดิม (Verdict สำหรับ static + Workshop steps + Power BI evidence ที่ได้มาแล้วเท่านั้น — ไม่ใช่ Phase 2 ทั้งหมด, Mandatory findings, Optional improvements, คำถามที่รอหลักฐานผู้ใช้) เป็นภาษาไทย
