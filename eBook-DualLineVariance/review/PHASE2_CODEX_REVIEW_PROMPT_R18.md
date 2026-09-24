# Phase 2 review request รอบ 18 (สำหรับ Codex CLI)

รอบ 17 `REVISE` ([`qa/PHASE2_CODEX_VERDICT_R17.md`](../qa/PHASE2_CODEX_VERDICT_R17.md)) — แก้แล้ว (ดู `git diff HEAD`) M-11 ยังเป็น Known limitation

1. **Sort_Order ไม่ต่อเนื่อง**: `xAxisValues` ใช้ `sequence()` เฉพาะเมื่อช่วง min–max ≤ 1000 มิฉะนั้นเป็น `[]` (tick array มีเพดาน); เพิ่ม regression AXIS-edge-* (gaps → 14 ticks, hugeGap 1..100000 → 0, null บางแถว, dataset ว่าง) ไม่ error ทั้งหมด; เพิ่ม Field contract ของ Sort_Order ใน Design Plan 4.1 amendment — ผล 464/464
2. **Evidence T29/T33/T29-C/T33-C รายตัว** อัปเดตตามรอบ 2 แล้ว
3. **Template**: บันทึกใน Design Plan 4.1 ว่า Deneb template ไม่ tokenize ชื่อ field ในสตริงของ `pluck(...)` (params แกน X/Y) — template ใช้ได้เมื่อชื่อ field ตรง Field contract; template ส่งมอบต้อง export จาก rev 6 และแก้ escaping (Evidence T27 ระบุแล้ว)
4. T09/T10 บน Power BI — รอผู้ใช้ทดสอบ (ไม่อยู่ในรอบนี้)

รันซ้ำ: `VEGA_NODE_MODULES="C:/Users/MSI/AppData/Local/Temp/claude/D--DATA-Deneb-Course/e0eca914-7edf-4826-aab4-d1f1530c20da/scratchpad/node_modules" node qa/scripts/run-workshop-step-tests.mjs`

ขอให้ตรวจว่าข้อ 1–3 ปิดได้ และเหลืออะไรก่อน Phase 2 PASS ตอบในรูปแบบเดิม เป็นภาษาไทย
