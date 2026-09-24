# Phase 3 — บทที่ 1 review รอบ 2 (สำหรับ Codex CLI)

รอบ 1 `REVISE` ([`CH01_CODEX_VERDICT.md`](CH01_CODEX_VERDICT.md)) — แก้แล้ว (ดู `git diff HEAD -- manuscript/chapter-01.md`) บริบทดู [`CH01_CODEX_REVIEW_PROMPT.md`](CH01_CODEX_REVIEW_PROMPT.md)

- **M-01**: alt text ไม่เรียกว่า "ทำเสร็จแล้ว"; caption ภาพ 1-1 ระบุชัดว่าเป็น spec rev 5, Visual ตั้ง 800×450, ไฟล์ crop 556×318 px และสิ่งที่ rev 7 ต่างไป (แกน X, รูปแบบจางเมื่อ highlight) — ภาพ rev 7 ความละเอียดสูงจะขอผู้ใช้ถ่ายก่อน Phase 4 (ตามกฎภาพ)
- **M-02**: ข้อจำกัดข้อ 3 ขยายเป็น 3 ผลกระทบ: Slicer/Filter ตัดเดือนทำให้พื้นที่ "ค้าง" + ทางเลือกสำรองบทที่ 9 (Design Plan 2.3), linear Y scale เท่านั้น (2.5), Template ไม่ plug-and-play
- Optional ที่ทำ: แยก Cross-filtering ขาออก/Cross-highlighting ขาเข้าพร้อม Edit interactions; ลดถ้อยคำ "ทำได้ทุกอย่าง" ในตารางเปรียบเทียบ; วันที่ 1.0.0 ระบุทั้ง changelog (13 พ.ย. 2021 — ตรวจแล้วที่ deneb.guide/docs/archive/changelog-002) และ GitHub release (24 พ.ย. 2021)
- คำถามข้อ 1 (หลักฐานเวอร์ชัน/Publisher): บันทึกไว้ใน `qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md` หัวข้อ "สภาพแวดล้อมที่ใช้ทดสอบจริง" (ภาพ About ไม่เก็บเพราะมี User ID/Session ID) และ Vega-Lite 6.4.3 เห็นที่แถบล่างของ Deneb Editor ในภาพ `qa/evidence/phase2-powerbi/T30-*.png`

ขอให้ตรวจว่า M-01/M-02 ปิดได้หรือไม่ ตอบรูปแบบเดิม ภาษาไทย
