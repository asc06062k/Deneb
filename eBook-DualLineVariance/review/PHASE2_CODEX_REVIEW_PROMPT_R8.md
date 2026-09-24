# Phase 2 review request รอบ 8 (สำหรับ Codex CLI)

รอบ 7 ได้ `REVISE` ด้วย M-12 ถึง M-16 ([`qa/PHASE2_CODEX_VERDICT_R7.md`](../qa/PHASE2_CODEX_VERDICT_R7.md)) — บริบทเต็มดู [`review/PHASE2_CODEX_REVIEW_PROMPT_R7.md`](PHASE2_CODEX_REVIEW_PROMPT_R7.md) ทุก finding ถูกตัดสิน **Accepted** และแก้แล้ว (ดู `git diff HEAD`) M-11 ยังเป็น Known limitation ตามคำตัดสินผู้ใช้

## การแก้

- **M-12**: T23 ใน Test matrix (`review/PHASE1_DESIGN_PLAN.md`) และ `PROJECT_PLAN.md` Phase 1 ข้อ 4(ก), Phase 2 ข้อ 6(ก) เขียนใหม่ให้ตรวจ configuration จริง (Actual/Reference = Sum, `DualLine Row Count`, Don't summarize, 52 แถว = 12/22/18, พื้นที่สีครบ, ยังครบเมื่อรับ Cross-highlight) — Evidence template T23 Expected ปรับตาม
- **M-13**: T27 และบทที่ 9 ระบุว่าผู้ใช้ Template ต้องสร้าง measure กันแถวหาย ผูกเข้า Values และตรวจจำนวนแถวหลัง remap
- **M-14**: ทางเลือก Don't summarize เปลี่ยนเป็น "ยังไม่ได้ทดสอบ ห้ามสอนจนกว่าจะมีหลักฐาน" + เพิ่มหมายเหตุว่า measure นี้อาจมี highlight fields ของตัวเองที่ spec ต้องไม่อ้าง (Optional improvement)
- **M-15**: T36-A เปลี่ยนเป็น `PASS WITH LIMITATION / RETEST REQUIRED`
- **M-16**: หัวข้อ M code ใน `qa/PHASE2_STATIC_TEST_LOG.md` แยกสถานะปัจจุบัน (compiled, ผู้ใช้รายงาน) ออกจากบันทึกก่อน compile

ไม่ทำ Optional: เปลี่ยนชื่อ measure (ผู้ใช้สร้างชื่อ `DualLine Row Count` ในไฟล์ PBIX แล้ว และคำอธิบายใน DAX/Design Plan ระบุหน้าที่ชัดแล้ว)

## หลักฐานเพิ่มหลังรอบ 7

- `qa/evidence/phase2-powerbi/T19-01-highlightstatus-fields.png`: เปิด Highlight status แล้ว มี `Actual__highlightStatus`/`Reference__highlightStatus` ชื่อตรงกับ spec, ยัง 52 แถว — บันทึกใน T19 เป็น PARTIAL (ชื่อ field PASS, พฤติกรรม highlight NOT TESTED)

## ขอให้ตรวจ

1. M-12 ถึง M-16 แก้ครบ ไม่มีจุดอื่นในเอกสารที่ยังขัดกับ amendment 2.1.1
2. การบันทึก T19-01 ไม่ overclaim

ตอบในรูปแบบเดิม (Verdict สำหรับ static + Workshop steps + หลักฐาน Power BI ที่ได้มาแล้วเท่านั้น, Mandatory findings, Optional improvements, หลักฐานที่ยังต้องการ) เป็นภาษาไทย
