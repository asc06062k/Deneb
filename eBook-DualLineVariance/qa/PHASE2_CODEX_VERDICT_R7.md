## Verdict: REVISE

สำหรับขอบเขต **static + Workshop steps + หลักฐาน Power BI Desktop/Deneb ที่ส่งมา**

แนวทาง `DualLine Row Count` แก้ปัญหา T23 ได้อย่างสมเหตุสมผลและภาพสนับสนุนผลลัพธ์จริง แต่เอกสารยังไม่สอดคล้องกันครบ จึงยังปิด Phase 2 ไม่ได้

### Mandatory findings

1. **M-12 — Test matrix และ Phase 2 gate ยังไม่ได้รวม amendment ของ T23**

   - [PHASE1_DESIGN_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:361) ยังระบุ T23 เพียงว่า `Business_Type` ต้องไม่ทำให้ grain เพี้ยน โดยไม่กำหนด `DualLine Row Count`, วิธี bind `Actual`/`Reference` หรือการตรวจว่า 52 แถวยังคงอยู่เมื่อเปิด Cross-highlight
   - [PROJECT_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:182) และ Phase 2 gate ที่ [บรรทัด 193](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:193) ยังอธิบายสาเหตุเป็น `Business_Type` Column เท่านั้น

   ต้องแก้ Expected ของ T23 และ Phase 2 gate ให้ตรวจ configuration จริง: `Actual`/`Reference = Sum`, มี non-blank row-preservation measure, dataset = 52 rows และพื้นที่สีครบ

2. **M-13 — Template limitation/T27 และบทที่ 9 ยังไม่รองรับ dependency ใหม่**

   - T27 ที่ [PHASE1_DESIGN_PLAN.md:365](/D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:365) กล่าวเพียง crossing preprocessing และ `labelExpr`
   - บทที่ 9 ที่ [PROJECT_PLAN.md:150](/D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:150) ยังไม่ระบุว่าผู้นำ Template ไปใช้ต้องสร้าง measure บนตารางของตน ผูก measure เข้า Values และตรวจ row preservation หลัง remap
   - ข้อความใน amendment ระบุความจำเป็นนี้แล้ว แต่ test matrix และ chapter plan ยังไม่ enforce

   ต้องเพิ่มข้อจำกัดนี้ใน T27, บทที่ 9 และขั้นตอน export/import Template อย่างชัดเจน

3. **M-14 — ทางเลือก “Don't summarize” ยังกล่าวเกินหลักฐาน**

   [PHASE1_DESIGN_PLAN.md:174](/D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:174) ระบุว่าสามารถผูก `Actual`/`Reference` แบบ Don't summarize แล้วแถวจะไม่ถูกตัด แต่หลักฐาน T23-02 พิสูจน์เพียงกรณี **นำสอง field ออกจาก Values** ไม่ได้พิสูจน์กรณีผูกไว้แบบ Don't summarize

   ให้เปลี่ยนเป็น “ทางเลือกที่ยังต้องทดสอบ” หรือเพิ่มภาพ Data pane ที่แสดง `Actual`/`Reference` แบบ Don't summarize พร้อม 52 rows และยืนยันว่าไม่มี highlight fields

4. **M-15 — T36-A บันทึกผลขัดกับหลักฐาน**

   - [PHASE2_EVIDENCE_RECORD_TEMPLATE.md:158](/D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:158) ระบุชัดว่าภาพ T36A-01 ใช้ dataset เพียง 12 rows และควรตรวจซ้ำหลังแก้ T23
   - แต่ [บรรทัด 160](/D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:160) กลับสรุป `PASS (ยืนยันซ้ำหลังแก้ T23)` โดยไม่มีภาพหลังแก้รองรับ

   ต้องแก้สถานะเป็น `PASS WITH LIMITATION / RETEST REQUIRED` หรือแนบภาพ T36-A ใหม่ที่เห็น 52 rows และ `DualLine Row Count` อยู่ใน Values

5. **M-16 — บันทึก M code ใน Static Test Log ขัดกันเอง**

   หัวข้อยังติดป้าย `[M-NOT-COMPILED]` และย่อหน้าท้ายยังบอกว่าต้องรอ compile ทั้งที่ย่อหน้าแรกระบุว่าผู้ใช้ compile ผ่านแล้ว 52 rows ต้องลบสถานะและข้อความเก่า หรือแยก “บันทึกก่อนทดสอบ” ออกจากสถานะปัจจุบันให้ชัดเจน

### ผลประเมินหลักฐาน

- **T23 รอบแรก FAIL:** หลักฐานรองรับว่าเมื่อมี `Actual`/`Reference` แบบ measure แต่ไม่มี row-preservation measure dataset เหลือ 12 rows
- **T23 รอบสอง PASS แบบมีเงื่อนไข:** T23-02 และ T23-03 รองรับว่า dataset กลับเป็น 52 rows และพื้นที่สีครบเมื่อเพิ่ม `DualLine Row Count`
- สูตร `COUNTROWS ( DualLine_PlotData )` เหมาะกับวัตถุประสงค์นี้ เพราะให้ค่าที่ไม่ Blank ใน filter context ของแต่ละกลุ่ม และ spec ไม่จำเป็นต้องอ่าน field ดังกล่าว
- การเพิ่ม measure ไม่ควรทำให้ `Actual__highlightStatus` เสียหายโดยตัวมันเอง แต่ยังไม่มีหลักฐาน interaction จริงว่าการ cross-highlight แล้ว Boundary/Crossing ยังคงครบ 52 rows และ `Filter_Key` ยังทำงานถูกต้อง
- **T30:** ภาพรองรับชื่อและตำแหน่ง UI ที่บันทึกไว้ แต่ไม่รองรับการยืนยันว่าใช้ Power BI Desktop `2.157.1354.0` และ Deneb `2.0.0.0`; เอกสารยอมรับข้อจำกัดนี้แล้ว จึงไม่ควรอ้างว่าเป็น version-lock proof
- **T36-A:** ภาพรองรับค่า signals `340.4/639.6`, named dataset และแกน X/Y แต่ยังเป็น configuration 12 rows ไม่ใช่ configuration สุดท้าย

### Optional improvements

- เปลี่ยนชื่อ measure ให้สื่อหน้าที่มากขึ้น เช่น `DualLine Preserve Rows` พร้อมคำอธิบายว่าไม่ใช่ metric สำหรับรายงาน
- เพิ่ม assertion ใน T23 ว่า `COUNTROWS(dataset)=52`, `COUNT(Boundary)=22`, `COUNT(Crossing)=18` และ `COUNT(Original)=12`
- เพิ่มภาพ T23-03 หลังออกจากโหมดแก้สูตร เพื่อให้เห็นว่า measure ถูก commit แล้วอย่างชัดเจน
- ระบุว่า `DualLine Row Count` อาจสร้าง Supporting highlight fields ของตัวเอง แต่ spec ต้องไม่อ้างถึง fields เหล่านั้น

### หลักฐานที่ยังต้องการก่อนปิด Phase 2

1. Cross-highlight จาก Visual อื่น โดย `Actual`/`Reference = Sum` และมี `DualLine Row Count`: dataset ต้องยังครบ 52 rows, พื้นที่สีครบ และตรวจ `Actual__highlightStatus`
2. Filter จาก Visual อื่น: จำนวน rows อาจลดตาม filter แต่ Boundary/Crossing ของ Category ที่ยังอยู่ต้องไม่ถูกตัดเพราะ Blank measures และ `Filter_Key` ต้องให้ผลตาม T29/T33
3. T36-A หลังแก้ T23 โดยภาพเดียวกันแสดง 52 rows, Values configuration และ signals
4. หากจะคงคำแนะนำ Don't summarize ต้องมีหลักฐานทดสอบ configuration นั้นโดยตรง
5. บันทึกเลขเวอร์ชัน Power BI Desktop และ Deneb จากเครื่องจริง หรือจำกัดคำสรุป T30 ว่าเป็น UI verification โดยไม่ยืนยัน version lock

ไม่สามารถสร้าง `qa/PHASE2_CODEX_VERDICT_R7.md` ใน workspace ได้ เนื่องจาก session นี้มีสิทธิ์ filesystem แบบ read-only.