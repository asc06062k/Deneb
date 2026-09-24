# Phase 2 review request รอบ 14 (สำหรับ Codex CLI)

รอบ 13 `PASS` ([`qa/PHASE2_CODEX_VERDICT_R13.md`](../qa/PHASE2_CODEX_VERDICT_R13.md)) หลังจากนั้น spec rev 4 ทดสอบบน Deneb จริงแล้วจางถูกต้อง (T19-07/08) แต่**ผู้ใช้ขอเปลี่ยนรูปแบบการจาง** → final spec rev 5 (ดู `git diff HEAD`) M-11 ยังเป็น Known limitation

## คำขอผู้ใช้ (ไม่ต้องโต้แย้งเชิงนโยบาย ให้ตรวจว่าทำถูก)

"ให้เส้นเชื่อมกับจุดของเดือนที่เลือกเข้ม เดือนอื่นจางลง 0.5 เส้นกราฟเหมือนเดิม" + "พื้นที่สีเหมือนเดิม แต่ป้ายตัวเลขเดือนที่เลือกเข้ม เดือนอื่นจาง"

## การเปลี่ยนแปลง

- final + static-test spec rev 5: line layers ไม่มี opacity; point_* และ label_* จาง 0.5 ตาม measure ของตัวเอง (เงื่อนไขเดียวกับ rev 4); connector_rule จาง 0.5 เมื่อ highlight active และไม่มี measure ใดของแถวถูก highlight
- Generator: connector (CH06-S03) และ label (CH07-S02) ถูกตัด opacity จนถึง CH08-S01
- Tests: HL-* ตรวจ point/connector/label/เส้น ครบ 8 สถานการณ์ + regression — 388/388 (`qa/evidence/phase2-workshop-steps/run-output.txt`, ภาพ `HL-observed-july-preview.png`)
- Design Plan 2.2.3 (rev 5), Evidence T19 (rev 5 ยังไม่ทดสอบบน Deneb), Workshop steps doc

## ขอให้ตรวจ

1. rev 5 ตรงกับคำขอผู้ใช้ และเงื่อนไข connector/label ถูกต้องทุกสถานการณ์ (รวม label ที่ถูก thinning — datum ยังมี highlight fields หลัง transform หรือไม่)
2. Step specs ยังเป็น structural subset และ CH08-S01 = final
3. เอกสารไม่ overclaim (rev 5 ยังไม่ได้ทดสอบบน Deneb)

รันซ้ำ: `VEGA_NODE_MODULES="C:/Users/MSI/AppData/Local/Temp/claude/D--DATA-Deneb-Course/e0eca914-7edf-4826-aab4-d1f1530c20da/scratchpad/node_modules" node qa/scripts/run-workshop-step-tests.mjs`

ตอบในรูปแบบเดิม เป็นภาษาไทย
