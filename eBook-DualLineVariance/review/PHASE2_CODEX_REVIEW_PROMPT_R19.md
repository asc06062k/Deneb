# Phase 2 review request รอบ 19 — ขอคำตัดสิน Phase 2 ทั้งหมด (สำหรับ Codex CLI)

รอบ 18 `REVISE` เหลือ 4 รายการ ([`qa/PHASE2_CODEX_VERDICT_R18.md`](../qa/PHASE2_CODEX_VERDICT_R18.md)) — ดู `git diff aa3b115..HEAD` M-11 ยังเป็น Known limitation ตามคำตัดสินผู้ใช้

## สิ่งที่ทำหลังรอบ 18

1. **T09 บน Power BI**: spec rev 6 ทับซ้อนที่ 280×180 และ 320×700 (ภาพ `T09-rev6-*`) → วิเคราะห์ด้วย `qa/scripts/run-axis-overlap-sim.mjs` (Vega + node-canvas วัดอักษรจริง) จำลองปัญหาได้ (greedy ตัดสินก่อน autosize fit ย่อพื้นที่ + labelFlush) → **spec rev 7**: `labelFlush: false`, `labelLimit: {expr: max(40, width/3)}`, `labelSeparation: 4` → sim 18/18 ไม่ทับ → **Power BI: T09 rev 7 ผ่านครบ 6 viewport** (`T09-rev7-*`)
2. **T10 บน Power BI (rev 7) ผ่านครบ 6 viewport** (`T10-rev7-*`) — Source เปลี่ยนผ่าน Power BI modeling MCP ตามคำขอผู้ใช้ ยืนยันด้วย DAX (24/108 แถว) แล้วเปลี่ยนกลับ (12/52 แถว)
3. **Template ส่งมอบ** `templates/dual-line-variance.deneb-template.json`: ฐานจาก export rev 6 ของผู้ใช้ (`T27-rev6-template-export.json`) + แก้ escaping 66 จุด + patch rev6→rev7 — จำลอง import เท่ากับ final spec; **import บน Deneb จริงแล้ว render ได้** (`T27-04`…`T27-07`) พบ Deneb จับคู่ Reference → "Sum of Actual" อัตโนมัติ ต้องแก้ก่อน Create (บันทึกเป็นบทเรียนบทที่ 9)
4. **แก้ข้อความผิดที่ผมเคยเขียน**: Design Plan เคยระบุว่า Deneb ไม่ tokenize ชื่อ field ใน `pluck(...)` — ตรวจไฟล์ template จริงพบว่า tokenize — ถอนข้อความแล้ว
5. Evidence T25 = PASS (baseline rev 5 + T09/T10 rev 7), T26 = PASS WITH LIMITATION (ไม่ได้บันทึกการลาก resize ต่อเนื่อง), T27 = PASS (template rev 7)

**หมายเหตุด้านวิธีเก็บหลักฐาน**: ภาพ T09-rev7 (4 ขนาดหลัง), T10-rev7 และ T27-04…07 เป็นภาพเต็มจอที่ Claude จับด้วย PowerShell `CopyFromScreen` หลังผู้ใช้ตั้งค่าเองแล้วสั่ง "ถ่าย" (Claude ไม่ได้คลิก/พิมพ์ใน Power BI — มีความพยายามควบคุมอัตโนมัติ 1 ครั้งที่คลิกผิดพิกัด ผู้ใช้ undo แล้ว ภาพ `shot-171006` แสดงกราฟกลับเป็นปกติ ไม่ได้ใช้เป็นหลักฐาน)

รันซ้ำ: `VEGA_NODE_MODULES="C:/Users/MSI/AppData/Local/Temp/claude/D--DATA-Deneb-Course/e0eca914-7edf-4826-aab4-d1f1530c20da/scratchpad/node_modules" node qa/scripts/run-workshop-step-tests.mjs` (464/464) และ `... node qa/scripts/run-axis-overlap-sim.mjs` (ต้องมี canvas ใน node_modules เดียวกัน — ติดตั้งแล้ว)

## ขอคำตัดสิน

1. รายการค้างทั้ง 4 ของรอบ 18 ปิดได้หรือไม่
2. Phase 2 ข้อ 5, 6, 7, 8 ของ `PROJECT_PLAN.md` ผ่านหรือไม่ → **Phase 2 PASS ทั้งหมดหรือไม่**
3. ถ้ายังไม่ผ่าน ระบุรายการที่เหลือให้ชัด

ตอบในรูปแบบเดิม เป็นภาษาไทย
