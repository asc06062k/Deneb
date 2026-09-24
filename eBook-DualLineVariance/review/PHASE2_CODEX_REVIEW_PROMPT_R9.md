# Phase 2 review request รอบ 9 (สำหรับ Codex CLI)

รอบ 8 ได้ `REVISE` ด้วย M-17 ข้อเดียว ([`qa/PHASE2_CODEX_VERDICT_R8.md`](../qa/PHASE2_CODEX_VERDICT_R8.md)) — Accepted และแก้แล้ว (ดู `git diff HEAD`) บริบทดู `review/PHASE2_CODEX_REVIEW_PROMPT_R7.md`/`_R8.md` M-11 ยังเป็น Known limitation ตามคำตัดสินผู้ใช้

## การแก้

- **M-17**: ผล T23 รอบที่ 2 ใน `qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md` เปลี่ยนจาก `PASS` เป็น `PARTIAL` — (ก) base configuration PASS (ระบุว่าภาพยืนยันยอดรวม 52 ไม่ได้นับแยก 12/22/18) (ข) row preservation ระหว่าง Cross-highlight NOT TESTED
- Optional: CH08-S01 ใน `review/PHASE2_WORKSHOP_STEPS.md` เปลี่ยนเป็น "ชื่อ field verified (T19-01); พฤติกรรม highlight NOT TESTED"

## หลักฐานใหม่ที่บันทึกหลังรอบ 8 (ขอให้ตรวจว่าไม่ overclaim)

- T22 เบื้องต้น: `qa/evidence/phase2-powerbi/T22-01-*.png`, `T22-02-*.png` — บันทึกเป็น PARTIAL พร้อมระบุสิ่งที่ยังไม่ทราบ (จุดคลิกจริง, ที่มาของ highlight บน column chart, relationship)

ตอบในรูปแบบเดิม (Verdict สำหรับ static + Workshop steps + หลักฐาน Power BI ที่ได้มาแล้วเท่านั้น, Mandatory findings, Optional improvements, หลักฐานที่ยังต้องการ) เป็นภาษาไทย
