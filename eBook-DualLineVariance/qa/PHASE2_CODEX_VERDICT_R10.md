## Verdict: REVISE

หลักฐานใหม่รองรับได้เฉพาะข้อสรุปว่า **การคลิก Area ใน crossing segment สองตำแหน่งที่ทดสอบ เลือก Category เดียวตาม `Filter_Key` ฝั่งซ้าย** แต่ยังไม่เพียงพอสำหรับถ้อยคำแบบครอบจักรวาลว่า “เสมอ” หรือ “ความเสี่ยงตาม M-23 ไม่เกิดขึ้น”

### Mandatory finding — M-24: ข้อสรุปกว้างกว่าหลักฐาน และ Phase 2 ข้อ 7 ยังไม่ผ่าน gate

1. `T18-03` และ `T18-04` แสดงผลชัดเจนว่า highlight เพียงแท่งเดียว และตรงกับ Category ฝั่งซ้ายของ segment จริง แต่ทั้งสองภาพเป็น strict-crossing segment จึงพิสูจน์เฉพาะสองกรณีนี้

2. ต้องเพิ่มอย่างน้อยหนึ่งกรณี Case C/no-crossing ที่พื้นที่กว้างพอ คลิกกลาง Area โดยไม่มี Point/Line/Connector คาบเกี่ยว เช่น segment พ.ค.–มิ.ย. แต่หลีกเลี่ยงบริเวณที่พื้นที่แคบเป็นศูนย์ การทดสอบครั้งแรกที่ได้ มิ.ย. ถูกบันทึกไว้แล้วว่า `INCONCLUSIVE` จึงนำมาสนับสนุนคำว่า “ทุกครั้ง” ไม่ได้

3. ต้องทดสอบ T22 โดย `Clear selections` ก่อน แล้ว right-click กลาง Area พร้อมบันทึกผลหลังคลิกให้แยกจาก selection เดิมอย่างชัดเจน เพราะข้อความ gate ใน [PROJECT_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md) บังคับทั้ง T18 และ T22 และครอบคลุมทั้ง click/right-click หลักฐาน T22 ปัจจุบันยังไม่ตัดความเป็นไปได้ว่าแท่ง พ.ค. ถูก highlight จากการคลิกก่อนหน้า

4. Evidence record ยังไม่ครบข้อมูลบังคับ เช่น Power BI Desktop version, Deneb version, PBIX/hash, viewport และผู้ทดสอบ อีกทั้ง T18(ก) ยังรอไฟล์ภาพการคลิกจุด ต.ค. ดังนั้นยังไม่สามารถถือว่า Phase 2 ข้อ 7 ผ่าน “ในความหมายของ gate” ได้

### Required fixes

แก้ถ้อยคำในไฟล์ต่อไปนี้:

- [PHASE1_DESIGN_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:205)
- [PROJECT_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:229)
- [PHASE2_EVIDENCE_RECORD_TEMPLATE.md](/D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:51)

จากถ้อยคำประเภท:

> ทุกครั้งเลือก Category เดียว / เลือกเดือนต้นช่วงเสมอ / ความเสี่ยงตาม M-23 ไม่เกิดขึ้น / Phase 2 ข้อ 7 ผ่านแล้ว

เป็น:

> ใน crossing segment สองกรณีที่ทดสอบ การคลิก Area เลือก Category เดียวตาม `Filter_Key` ฝั่งซ้าย ไม่พบการเลือกหลาย Category ในสองกรณีนี้ ผู้ใช้ยอมรับพฤติกรรมที่พบและให้บันทึกเป็นข้อจำกัด แต่การสรุปครอบคลุม Area interaction ทั้งหมดและ Phase 2 ข้อ 7 ยังรอ Case C และ T22 หลัง Clear selections พร้อม Evidence record ครบถ้วน

คำตัดสินผู้ใช้เรื่อง “ยอมรับและเขียนในหนังสือ” บันทึกได้ตามเดิม และ M-11 ยังคงเป็น Known limitation ตามคำตัดสินผู้ใช้โดยไม่ต้องเปิดประเด็นใหม่ครับ