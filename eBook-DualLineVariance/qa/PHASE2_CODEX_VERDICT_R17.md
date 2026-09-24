## Verdict: REVISE

ตรวจครบตาม prompt รอบ 17 แล้ว สรุปดังนี้:

- M-27 ยังปิดไม่ได้ — ตรรกะแกน dynamic ทำงานกับข้อมูลปกติ, `null Sort_Order`, dataset ว่าง และการกรองบางเดือนโดยไม่ crash แต่ [`xAxisValues`](/D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:12) สร้างค่าทุกจำนวนระหว่าง min–max ด้วย `sequence()` ทำให้ `Sort_Order` ที่ไม่ต่อเนื่องสร้าง tick ว่างจำนวนมาก และอาจใช้หน่วยความจำสูงมากเมื่อช่วงห่างกว้าง ควรสร้าง values จากค่า `Sort_Order` ที่ valid และมีอยู่จริง หรือกำหนด Field contract ว่าต้องเป็นเลขจำนวนเต็มต่อเนื่องพร้อม validation/test ที่บังคับเงื่อนไขนี้
- ชุดทดสอบผ่าน `460/460` แต่ T09/T10 ใช้เฉพาะ `Sort_Order` ต่อเนื่อง จึงยังจับปัญหาข้างต้นไม่ได้ ควรเพิ่ม regression สำหรับ null บางแถว, ลำดับขาดช่วง และ dataset ว่าง
- การถอด assertion “label ไม่ทับซ้อน” จาก headless สมเหตุสมผล เพราะการวัด glyph ภาษาไทยของ renderer นี้ใช้ตัดสินภาพจริงไม่ได้ และ [`run-workshop-step-tests.mjs`](/D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/run-workshop-step-tests.mjs:239) กับ Design Plan ระบุชัดว่า Group B ต้องตัดสินบน Power BI จริง
- T29/T33 รอบ 2 ตรงกับภาพทั้งสี่และไม่ overclaim ส่วน T27 ระบุครบว่าทดสอบไฟล์ที่แก้แล้วกับข้อมูลชุดเดิม, template rev 5 และยังไม่ได้ทดสอบข้อมูลใหม่ จึงเหมาะสมกับ `PASS WITH LIMITATION`
- Evidence T29/T33 ยังไม่สอดคล้องกันภายในไฟล์: ส่วนสรุปประกาศ PASS จากรอบ 2 ที่ [`PHASE2_EVIDENCE_RECORD_TEMPLATE.md`](/D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:333) แต่ record ราย Test ID ด้านล่างยังเว้น Actual/หลักฐาน/ผู้ทดสอบ/วันที่ และยังเขียน `PASS / FAIL / NOT TESTED` ที่บรรทัด 341–377 ต้องอัปเดต record รายตัวให้ตรงกับ T29-02/T33-02/T29C-02/T33C-02 ก่อนปิดรอบ
- T25/T26 ยังคง `PARTIAL` อย่างถูกต้อง ยังไม่มีหลักฐาน T09/T10 บน Power BI ด้วย spec rev 6

สถานะ gate:

- ข้อ 5: PASS
- ข้อ 6: PARTIAL
- ข้อ 7: PASS
- Phase 2 โดยรวม: ยังไม่ PASS

สิ่งที่เหลือก่อน Phase 2 PASS:

1. แก้หรือกำหนด contract สำหรับ `Sort_Order` ไม่ต่อเนื่อง พร้อม regression tests
2. อัปเดต Evidence record รายตัวของ T29/T33 ให้ตรงกับหลักฐานรอบ 2
3. ผู้ใช้ทดสอบ T09 และ T10 ด้วย spec rev 6 บน Power BI ครบ 6 viewport และบันทึก Group B; สำหรับ T26 ควรบันทึก Group A และยืนยันการประเมินใหม่เมื่อ resize ด้วย
4. Export/import template จาก spec rev 6 ใหม่ หรือบันทึกชัดเจนว่า template ส่งมอบต้องผ่านขั้นตอนแก้ escaping เดิม

workspace รอบนี้เป็น read-only จึงไม่ได้สร้าง `qa/PHASE2_CODEX_VERDICT_R17.md` ครับ