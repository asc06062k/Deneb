## Verdict: REVISE

รันทดสอบซ้ำแล้วได้ **354 passed, 0 failed** และยืนยันว่า `CH08-S01` เท่ากับ final spec ยกเว้น `description` อย่างไรก็ตามยังมี Mandatory findings ก่อนปิดรอบนี้

### M-25 — Point opacity ไม่ปลอดภัยเมื่อ highlight value มีเพียงบาง measure

เงื่อนไข point ทั้งสอง layer ใช้ `Actual` และ `Reference` เชื่อมด้วย OR เหมือนกันที่ [dual-line-variance-final.vl.json](/D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:140) และ [dual-line-variance-final.vl.json](/D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:158)

ถ้าแถวที่เลือกมี:

- `Actual__highlight = Actual`
- แต่ `Reference__highlight = null`
- และ status ของทั้งคู่เป็น `"on"`

เงื่อนไขฝั่ง Reference จะทำให้ **จุด Actual ที่ถูกเลือกจางด้วย** ทั้งที่ Actual ตรงกับ highlight แล้ว กรณีกลับกันก็เกิดกับจุด Reference

ควรให้แต่ละ point layer ตรวจเฉพาะ measure ของตัวเอง:

- `point_actual_hit_target` ตรวจเฉพาะ `Actual__highlightStatus`, `Actual__highlight`, `Actual`
- `point_reference` ตรวจเฉพาะฝั่ง Reference

ค่า `0` ปลอดภัยกับ `!==`: `0 !== 0` เป็น false และ `isDefined(0)` เป็น true ส่วน `null` ถูก Vega มองว่า defined จึงยังใช้ตรวจความต่างจากค่าจริงได้ตามที่ต้องการ

### M-26 — HL tests ยังไม่ครอบคลุมกรณีสำคัญที่ขอให้ตรวจ

สถานการณ์ทั้งหมดใน [run-workshop-step-tests.mjs](/D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/run-workshop-step-tests.mjs:170) กำหนด Actual และ Reference ให้มีสถานะและ highlight เหมือนกัน จึงไม่พบ M-25

ต้องเพิ่มอย่างน้อย:

- highlighted Actual แต่ Reference highlight เป็น `null`/ไม่มี field
- highlighted Reference แต่ Actual highlight เป็น `null`/ไม่มี field
- Actual หรือ Reference มีค่าจริงและ highlight เท่ากับ `0`
- ค่า `__highlight` มีเฉพาะ measure เดียว

การทดสอบปัจจุบันไม่ได้ “ผ่านเสมอ”: หากนำเงื่อนไข rev 3 กลับมา สถานการณ์ `HL-observed` จะ FAIL เพราะทุกแถวมี status `"on"` ทำให้จุดที่ไม่เลือกและเส้นไม่จาง อย่างไรก็ตามควรเก็บ negative/regression test นี้เป็นโค้ดหรือบันทึกผลที่ทำซ้ำได้ แทนการกล่าวถึงเพียงเชิงสมมติฐาน

### M-27 — สรุป T19 ยังขัดกับรายละเอียดด้านบน

รายละเอียดบันทึกแล้วว่า rev 3 **FAIL และทราบสาเหตุ** แต่บรรทัดสรุปยังระบุ “พฤติกรรม highlight NOT TESTED” ที่ [PHASE2_EVIDENCE_RECORD_TEMPLATE.md](/D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:86)

ควรเปลี่ยนเป็นประมาณว่า:

> FAIL สำหรับ spec rev 3 — ยืนยันสาเหตุจาก T19-06; spec rev 4 ผ่านเฉพาะ headless tests และรอทดสอบซ้ำบน Deneb จริง

นอกจากนี้ T19-06 ที่เห็นรองรับ `Actual__highlight*` แต่ภาพไม่ได้แสดงคอลัมน์ Reference จึงยังไม่ควรเขียนว่า T19-06 ยืนยันพฤติกรรม `Reference__highlightStatus`/`Reference__highlight` ด้วยที่ [PHASE1_DESIGN_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:213) เว้นแต่มีหลักฐานเพิ่มเติม

ส่วน T20 ระบุว่าเป็น PASS เบื้องต้นและแจ้งข้อมูลที่ยังขาด, T23(ข) รองรับด้วย 1–52 of 52 และ T29/T33-C ระบุชัดว่าเป็นหลักฐานทางอ้อมพร้อมรอ Slicer test จึงไม่ถือว่า overclaim ส่วน Workshop steps และการเท่ากันของ CH08-S01 ผ่านตามที่อ้างครับ