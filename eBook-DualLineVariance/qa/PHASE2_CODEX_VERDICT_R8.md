## Verdict: REVISE

สำหรับขอบเขต **static + Workshop steps + หลักฐาน Power BI Desktop/Deneb ที่ได้รับแล้วเท่านั้น**

M-12 ถึง M-16 แก้ครบและสอดคล้องกับ amendment 2.1.1 แล้ว แต่ยังมีการสรุปผล T23 เกินหลักฐานอยู่หนึ่งจุด จึงยังไม่ควรให้ `PASS`

### สถานะ M-12 ถึง M-16

- **M-12 — CLOSED:** T23, Design Plan และ Phase 2 gate ระบุ configuration ครบ ได้แก่ `Actual`/`Reference = Sum`, `DualLine Row Count`, คอลัมน์ Plot/Run/Sort = Don't summarize, 52 แถว = 12/22/18, พื้นที่สีครบ และต้องตรวจซ้ำระหว่าง Cross-highlight
- **M-13 — CLOSED:** T27 และบทที่ 9 บังคับให้ผู้ใช้ Template สร้าง row-preservation measure ของตนเอง ผูกเข้า Values และตรวจจำนวนแถวหลัง remap
- **M-14 — CLOSED:** ทางเลือก `Actual`/`Reference = Don't summarize` ถูกลดสถานะเป็น “ยังไม่ได้ทดสอบ ห้ามสอนจนกว่าจะมีหลักฐาน” และระบุว่า spec ต้องไม่อ้าง Supporting highlight fields ของ `DualLine Row Count`
- **M-15 — CLOSED:** T36-A เปลี่ยนเป็น `PASS WITH LIMITATION / RETEST REQUIRED`
- **M-16 — CLOSED:** Static Test Log แยกสถานะปัจจุบันที่ compile แล้วออกจากบันทึกก่อน compile ชัดเจน

ไม่พบข้อความอื่นในไฟล์ที่ตรวจซึ่งขัดกับ amendment 2.1.1 โดยตรง

### Mandatory finding

**M-17 — T23 สรุป `PASS` ทั้งที่ acceptance criterion เรื่อง Cross-highlight ยังไม่ได้ทดสอบ**

Expected ของ T23 ใน [PHASE2_EVIDENCE_RECORD_TEMPLATE.md](/D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:136) ระบุว่า dataset ต้องยังครบ 52 แถวขณะรับ Cross-highlight โดยตรวจร่วมกับ T19 แต่ผลสรุปรอบสองที่ [บรรทัด 146](/D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:146) บันทึกเป็น `PASS` โดยไม่มีข้อจำกัด ขณะที่ T19 ระบุชัดว่าพฤติกรรม highlight ยัง `NOT TESTED`

หลักฐานปัจจุบันพิสูจน์ได้เฉพาะ:

- Base configuration ที่มี `Actual`/`Reference = Sum` และ `DualLine Row Count` ให้ 52 แถวและพื้นที่สีครบ
- Supporting fields มีชื่อตรงตาม spec
- ยังไม่ได้พิสูจน์ว่าเมื่อเกิด Cross-highlight จริงแล้ว 52 แถวและพื้นที่สีจะยังอยู่ครบ

ควรเปลี่ยนผลสรุป T23 เป็นลักษณะใดลักษณะหนึ่ง เช่น:

> `PARTIAL / PASS BASE CONFIGURATION — Cross-highlight row preservation RETEST REQUIRED (T19)`

หรือแยก T23 เป็นผลย่อย “base configuration PASS” และ “ระหว่าง Cross-highlight NOT TESTED” ห้ามสรุป T23 เต็มรูปแบบเป็น `PASS` จนกว่าจะทดสอบ interaction จริง

### ผลประเมิน T19-01

การบันทึก T19-01 **ไม่ overclaim**:

- ภาพแสดง `Actual__highlight`, `Actual__highlightStatus`, `Reference__highlight` และ `Reference__highlightStatus` จริง
- แสดง `1-50 of 52` จึงรองรับว่าขณะถ่ายภาพ dataset มีทั้งหมด 52 แถว
- `DualLine Row Count` อยู่ใน Values และสูตรถูกสร้างแล้ว
- ภาพไม่แสดง Clustered bar chart ต้นทาง การเลือกแถบ หรือผลหลัง Highlight จึงไม่พิสูจน์พฤติกรรม interaction
- สถานะ `PARTIAL — ชื่อ field PASS, พฤติกรรม highlight NOT TESTED` จึงเหมาะสมและระมัดระวังแล้ว

### Static และ Workshop steps

- **Static:** ยังคงผ่านในขอบเขตที่เคยตรวจ การเปลี่ยนแปลงรอบนี้ส่วนใหญ่เป็นเอกสารและเพิ่ม DAX measure ที่ตรงกับหลักฐาน Power BI
- **Workshop steps:** ยังคงผ่านตามผลเดิม `338/338`; รอบนี้ไม่มีการแก้ final spec หรือ generated workshop JSON
- **Power BI evidence:** ผ่านเฉพาะ base row-preservation configuration และการยืนยันชื่อ highlight fields ยังไม่ผ่าน gate ด้าน interaction

### Optional improvements

- ใน [PHASE2_WORKSHOP_STEPS.md](/D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE2_WORKSHOP_STEPS.md) เปลี่ยนข้อความของ CH08-S01 จากชื่อ field `[POWERBI-NOT-TESTED]` เป็น “ชื่อ field verified; highlight behavior not tested” เพื่อให้ตรงกับ T19-01
- ใน T23 แยกผลนับ `Original 12 / Boundary 22 / Crossing 18` ออกจากการเห็นยอดรวม 52 เพราะภาพปัจจุบันยืนยันยอดรวมและเห็นตัวอย่างชนิดแถว แต่ไม่ได้แสดงการนับทั้งสามประเภทโดยตรง

### หลักฐานที่ยังต้องการ

1. ทำ Cross-highlight จริงจาก Clustered bar/column chart โดยตั้ง `Edit interactions = Highlight`
2. แสดงว่า หลังเลือกแถบแล้ว:
   - dataset ยังครบ 52 แถว
   - พื้นที่สียังครบ
   - มีค่า `off/on` หรือสถานะที่เปลี่ยนไปใน `Actual__highlightStatus`/`Reference__highlightStatus`
   - จุดหรือเส้นที่ไม่ถูก highlight จางลงตาม spec
3. ภาพ T36-A ใหม่ที่เห็น 52 แถว, `DualLine Row Count` ใน Values และ Signals พร้อมกัน
4. หลักฐาน Filter/T29/T33 และ Interaction tests อื่นตามรายการเดิมก่อนปิด Phase 2

เมื่อแก้สถานะ T23 ไม่ให้เป็น `PASS` เกินหลักฐานแล้ว รอบนี้สามารถปิด mandatory findings ด้านเอกสารได้ แต่ Phase 2 โดยรวมยังต้องรอหลักฐาน Power BI interaction ที่ระบุข้างต้น