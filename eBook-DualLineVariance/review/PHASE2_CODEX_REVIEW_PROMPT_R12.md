# Phase 2 review request รอบ 12 (สำหรับ Codex CLI)

รอบ 11 `PASS` ([`qa/PHASE2_CODEX_VERDICT_R11.md`](../qa/PHASE2_CODEX_VERDICT_R11.md)) หลังจากนั้นมีหลักฐาน Power BI ใหม่และ **final spec เปลี่ยน** (ดู `git diff HEAD`) M-11 ยังเป็น Known limitation ตามคำตัดสินผู้ใช้

## หลักฐานใหม่ (`qa/evidence/phase2-powerbi/`)

- `T19-00`: Column chart ตัวเดิมเปิด "Show data point as a table" ทุกครั้งที่คลิก — แก้โดยสร้าง Column chart ใหม่
- `T19-03` (timeline จากวิดีโอ), `T19-02`: status = neutral เมื่อไม่มี highlight, 52 แถว
- `T20-01`: โหมด Filter เลือก ก.ค. → Dual-Line กรองตาม Filter_Key (จุด ก.ค. + พื้นที่ segment ก.ค.–ส.ค. ครบ, segment มิ.ย.–ก.ค. หาย, แกน Y ~496–534)
- `T19-05`: โหมด Highlight → Dual-Line ไม่จาง
- `T19-06`: Data pane ขณะ highlight ก.ค.: `Actual__highlight` = 510 เฉพาะแถว ก.ค., null แถวอื่น; `Actual__highlightStatus` = "on" **ทุกแถว** (ขัดกับ deneb.guide ที่ว่า non-highlighted = "off"); 1-52 of 52

## การเปลี่ยนแปลง

- final + static-test spec rev 4: เงื่อนไข opacity ของ point layers = off หรือ (on และ `__highlight !== value`) ฝั่ง Actual/Reference; line layers จางเมื่อ status != neutral; ทุกเงื่อนไขมี `isDefined` (ใช้ `isDefined` และ `!==` ของ Vega expression)
- `qa/scripts/run-workshop-step-tests.mjs`: เพิ่ม HL-* 4 สถานการณ์ (absent/neutral/observed/documented) ตรวจ opacity จริงใน scenegraph — 354/354 ผ่าน (`qa/evidence/phase2-workshop-steps/run-output.txt`, ภาพ `HL-observed-july-preview.png`)
- Design Plan หัวข้อใหม่ 2.2.3, Evidence template T19/T20/T23(ข)/T29/T33-C, Workshop steps doc

## ขอให้ตรวจ

1. ตรรกะเงื่อนไข rev 4 ถูกต้องและปลอดภัยทุกสถานการณ์ (รวม Reference = 0 หรือ Actual = 0 ที่ถูก highlight, measure ที่ `__highlight` เป็นค่าบางส่วน ถ้ามี)
2. HL-* tests ตรวจจริง (ไม่ผ่านเสมอ) — เช่น สถานการณ์ observed ควร FAIL กับ spec rev 3
3. การบันทึกหลักฐาน (T19 FAIL ของ rev 3 + รอทดสอบซ้ำ, T20 PASS เบื้องต้น, T23(ข) PASS, T29/T33-C หลักฐานทางอ้อม) ไม่ overclaim
4. Workshop steps ยังถูกต้อง (CH08-S01 = final spec)

รันซ้ำ: `VEGA_NODE_MODULES="C:/Users/MSI/AppData/Local/Temp/claude/D--DATA-Deneb-Course/e0eca914-7edf-4826-aab4-d1f1530c20da/scratchpad/node_modules" node qa/scripts/run-workshop-step-tests.mjs`

ตอบในรูปแบบเดิม เป็นภาษาไทย
