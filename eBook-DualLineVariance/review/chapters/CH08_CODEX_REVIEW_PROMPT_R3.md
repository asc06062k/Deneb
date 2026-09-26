# Phase 3 — บทที่ 8 delta review (รอบ 3, สำหรับ Codex CLI)

บทที่ 8 `PASS` รอบ 2 แล้ว (`CH08_CODEX_VERDICT_R2.md`) ต่อมาผู้ใช้ตัดสิน (26 ก.ย. 2026) ให้แยกระดับความจางของ Cross-highlight ตามชั้น: **จุดทั้งสองชั้น 0.5 (เท่าเดิม), ป้ายตัวเลขทั้งสองชั้น 0.3, Connector 0.2** ตรรกะ `test` ไม่เปลี่ยน ผู้ใช้ไม่ต้องการถ่ายภาพใหม่ ให้ใช้ภาพเดิมและปรับเฉพาะ spec กับหนังสือ

การแก้:
- `specs/dual-line-variance-final.vl.json`, `specs/dual-line-variance-static-test.vl.json`, `templates/dual-line-variance.deneb-template.json`: เปลี่ยน `value` ของ opacity condition เฉพาะ `connector_rule` → 0.2, `label_actual` และ `label_reference` → 0.3 (จุด 0.5 คงเดิม) รัน generator ได้ `specs/steps/CH08-S01-cross-highlight-opacity.vl.json` ต่างจากเดิมเฉพาะ 3 บรรทัดนี้
- `qa/scripts/run-workshop-step-tests.mjs`: ชุดทดสอบ HL-* ปรับให้คาดค่า 3 ระดับ (จุด 0.5, Connector 0.2, ป้าย 0.3) ผ่าน 464/464 (ก่อนปรับชุดทดสอบ 17 รายการล้มเพราะค่าคาดเดิม ยืนยันว่าชุดทดสอบจับได้) และ static 50/50
- `manuscript/chapter-08.md`: เป้าหมาย Step 3, ข้อ 7 ของขั้นตอน, caption 8-12/8-13 (ระบุว่าถ่ายก่อนแยกระดับ ทุกอย่างจาง 0.5), excerpt Connector (value 0.2), ย่อหน้าใหม่ "ระดับความจางต่างกันตามชั้น", ผลลัพธ์ที่ควรได้ และกล่องหมายเหตุภาพต้นบท
- `review/PHASE1_DESIGN_PLAN.md` เพิ่มบันทึก rev 8, `qa/scripts/run-ch08-claims-check.mjs` (25 ผ่าน) ตรวจระดับ 0.5/0.3/0.2 และข้อความในบท

ขอให้ตรวจ: (ก) ค่าใน spec/Step/template ตรงกัน และ excerpt ในบทตรงไฟล์จริง (ข) ข้อความในบท 8 ไม่ขัดกันหรือ overclaim เรื่องภาพ 8-12/8-13 ที่ถ่ายก่อนแยกระดับ (caption และกล่องหมายเหตุเปิดเผยแล้ว) และไม่ต้องถ่ายซ้ำสำหรับ PASS (ค) ไม่มี Mandatory ใหม่ ตอบรูปแบบเดิม ภาษาไทย
