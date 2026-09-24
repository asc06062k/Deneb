# Phase 2 review request รอบ 16 (สำหรับ Codex CLI)

รอบ 15 `REVISE` ([`qa/PHASE2_CODEX_VERDICT_R15.md`](../qa/PHASE2_CODEX_VERDICT_R15.md)) — M-28 แก้แล้ว (เติม Power BI/Deneb/PBIX ลงทุก Evidence record, commit cd33c78); M-26/M-27 ต้องรอหลักฐานผู้ใช้ ซึ่งได้เพิ่มแล้วบางส่วน (ดู `git diff cd33c78..HEAD`) ไม่มีการแก้ spec M-11 ยังเป็น Known limitation

## หลักฐานใหม่

- T36-B/C/D/E (`T36B-*`…`T36E-*`): B = 494.6/535.4 ตรงค่าที่คาด, C/D = 340.4/639.6, E = แกน 0–1 ไม่ error
- **M-26**: T18(ก) คลิกจุด ต.ค. หลังล้าง selection → highlight ต.ค. (`T18-07`); T22(ก) Include จุด ต.ค. → Included (1) = ต.ค. (Category) ... (`T22-06`)
- Design Plan 2.2.2 อัปเดตว่า Phase 2 ข้อ 7 หลักฐานครบ (รอ Codex ยืนยัน)

## ขอให้ตรวจ

1. M-26 ปิดได้หรือไม่ — Phase 2 ข้อ 7 ผ่าน gate แล้วหรือยัง
2. M-28 ปิดได้หรือไม่
3. การบันทึก T36 B–E ไม่ overclaim
4. M-27 (T09/T10) ยังค้าง — ข้อสังเกตเพิ่ม: แกน X ใช้ `labelExpr` ชื่อเดือนตายตัว 12 ค่าและ `values: [1..12]` ไม่ได้อ่าน field Category ดังนั้น T09 (ชื่อ Category ยาว) จะไม่กระทบแกนเลย และ T10 (24 categories) จะติด Template limitation ที่บันทึกไว้ใน Design Plan 4.1 — ขอความเห็นว่าควรจัดการ T09/T10 อย่างไรก่อน Phase 2 PASS (ลดคำสัญญาตาม Phase 2 ข้อ 6 ได้หรือไม่ หรือต้องทำแกน dynamic)

ตอบในรูปแบบเดิม เป็นภาษาไทย
