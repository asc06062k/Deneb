# Phase 2 review request รอบ 5 (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของงาน Phase 2 ขอบเขต **static + Workshop steps** — รอบ 4 ได้ `REVISE` ด้วย M-12 ข้อเดียว ([`qa/PHASE2_CODEX_VERDICT_R4.md`](../qa/PHASE2_CODEX_VERDICT_R4.md)) บริบทเต็มดู [`review/PHASE2_CODEX_REVIEW_PROMPT_R4.md`](PHASE2_CODEX_REVIEW_PROMPT_R4.md) — M-11 ยังคงเป็น Known limitation ตามคำตัดสินผู้ใช้ ไม่ต้องรีวิวซ้ำ

## การแก้ในรอบนี้

- **M-12 (Accepted)**: `noTooltip()` ใน [`qa/scripts/build-workshop-steps.mjs`](../qa/scripts/build-workshop-steps.mjs) ไม่เพิ่ม `mark.tooltip = null` อีกแล้ว (ลบเฉพาะ `encoding.tooltip` และ `calculate` transforms) regenerate `specs/steps/` ใหม่
- เพิ่ม assertion ใน [`qa/scripts/run-workshop-step-tests.mjs`](../qa/scripts/run-workshop-step-tests.mjs) ตาม Optional improvements ทั้งหมด:
  - `isSubset()` แบบ recursive: ทุก property ของ layer ใน Step ต้องมีใน layer ชื่อเดียวกันของ final spec ด้วยค่าเดียวกัน array ต้องเป็น subsequence ตามลำดับ
  - top-level property อื่น (ยกเว้น `description`/`layer`) ต้องเท่ากับ final spec
  - manifest layers = layer ในไฟล์จริง และชุด layer ราย Step ตรงกับ `EXPECTED_LAYERS` ที่เขียนแยกจาก generator
  - negative test: ใส่ `mark.tooltip = null` กลับเข้า CH05-S03 ด้วยมือ → test FAIL ที่ `point_actual_hit_target.mark.tooltip: property not in final spec` (แล้ว regenerate กลับ)
- `qa/evidence/phase2-workshop-steps/run-output.txt` เขียนใหม่เป็น UTF-8 (ภาษาไทยอ่านได้) ผล **284 passed, 0 failed**
- `review/PHASE2_WORKSHOP_STEPS.md` อัปเดตตามข้างต้นและบันทึกความเห็น R4 ต่อคำถามเปิด 3 ข้อ (ยังรอคำตัดสินผู้ใช้ ไม่แก้ final spec)

## รันซ้ำ

```bash
VEGA_NODE_MODULES="C:/Users/MSI/AppData/Local/Temp/claude/D--DATA-Deneb-Course/e0eca914-7edf-4826-aab4-d1f1530c20da/scratchpad/node_modules" node qa/scripts/run-workshop-step-tests.mjs
```

## ขอให้ตรวจ

1. M-12 แก้ครบ ไม่มี property อื่นใน `specs/steps/` ที่ไม่อยู่ใน final spec
2. `isSubset()` ถูกต้องทางตรรกะ (ไม่มีกรณีผ่านผิด เช่น array matching หรือ primitive compare)
3. ไม่มี regression ในส่วนที่ PASS แล้วในรอบ 4 (แกน, spec สองไฟล์ตรงกัน, Step สุดท้าย = final spec)

ตอบในรูปแบบเดิม (Verdict สำหรับ static + Workshop steps เท่านั้น, Mandatory findings, Optional improvements, คำถามที่รอหลักฐานผู้ใช้) เป็นภาษาไทย
