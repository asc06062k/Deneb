# Phase 2 review request รอบ 13 (สำหรับ Codex CLI)

รอบ 12 `REVISE` ด้วย M-25/M-26/M-27 ([`qa/PHASE2_CODEX_VERDICT_R12.md`](../qa/PHASE2_CODEX_VERDICT_R12.md)) — ทั้งหมด Accepted และแก้แล้ว (ดู `git diff HEAD`) บริบทดู `review/PHASE2_CODEX_REVIEW_PROMPT_R12.md` M-11 ยังเป็น Known limitation

- **M-25**: `point_actual_hit_target` ดูเฉพาะ `Actual__*`, `point_reference` ดูเฉพาะ `Reference__*` ทั้ง final และ static-test spec (layer ยังเท่ากัน); line layers คงเดิม
- **M-26**: HL tests ใหม่ใน `qa/scripts/run-workshop-step-tests.mjs` — 8 สถานการณ์ (absent, neutral, observed, documented, actualOnly, referenceOnly, actualFieldsOnly, zeroValue) + regression เป็นโค้ด 2 ข้อ: เงื่อนไข rev 3 ต้อง FAIL HL-observed และเงื่อนไข OR สอง measure ต้อง FAIL HL-actualOnly — ผล 364/364 (`qa/evidence/phase2-workshop-steps/run-output.txt`)
- **M-27**: สรุป T19 = FAIL สำหรับ rev 3 / rev 4 ผ่านเฉพาะ headless รอทดสอบซ้ำ; ถอนการอ้างพฤติกรรมฝั่ง Reference จาก T19-06 ใน Design Plan 2.2.3 และ Evidence template

รันซ้ำ: `VEGA_NODE_MODULES="C:/Users/MSI/AppData/Local/Temp/claude/D--DATA-Deneb-Course/e0eca914-7edf-4826-aab4-d1f1530c20da/scratchpad/node_modules" node qa/scripts/run-workshop-step-tests.mjs`

ขอให้ตรวจว่า M-25–M-27 ปิดได้ ตอบในรูปแบบเดิม เป็นภาษาไทย
