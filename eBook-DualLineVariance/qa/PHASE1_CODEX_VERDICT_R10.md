## Verdict: REVISE

ยังให้ `PASS` ไม่ได้ แม้ M-22 ปิดครบแล้ว แต่พบ Mandatory finding ใหม่ 1 รายการเกี่ยวกับ Area selection และ `Filter_Key`

### ตรวจ Finding เดิม

| Finding | สถานะ | ผลตรวจ |
| --- | --- | --- |
| M-19 | **CLOSED** | `Category axis type` ตรงกับ Design Lock แล้ว |
| M-20 | **CLOSED** | T13 มี Expected assertions ครบ |
| M-21 | **CLOSED** | T34/T35 รวมอยู่ใน T25/T26 และ Phase 2 gate ครบ |
| M-22 | **CLOSED** | ไม่พบข้อความ `4 ขนาด` ในสองไฟล์เป้าหมาย และทั้ง Design Plan หัวข้อ 9 ข้อ 2 กับ `PROJECT_PLAN.md` Phase 2 ข้อ 6 ระบุครบ **6 ขนาด: T14–T17, T34, T35** |

### Mandatory finding ใหม่

**M-23 — การอ้างว่า `Category = Blank` ทำให้ Area selection กรองไปที่ “(Blank)” เป็น soft-fail ยังไม่สอดคล้องกับ Relationship บน `Filter_Key`**

หลักฐาน:

- [PHASE1_DESIGN_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:158) ระบุว่าเมื่อ Area resolve ได้เป็น `Category = Blank` ผล cross-filter จะไปที่ `"(Blank)"` และจำกัดความเสียหาย
- [PHASE1_DESIGN_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:171) ระบุว่า `Category` ไม่ได้ใช้เป็น Relationship key
- [PHASE1_DESIGN_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:172) กำหนดให้ Fill rows ที่มี `Category = Blank` มี `Filter_Key` ของ Category ฝั่งซ้ายหลายค่า
- [PHASE1_DESIGN_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:175) ใช้ Relationship แบบ `Both`

ดังนั้น หากการคลิก Area สร้าง filter `DualLine_PlotData[Category] = Blank` จริง แถว Fill-only จำนวนมากจะยังเหลืออยู่ และแถวเหล่านั้นมี `Filter_Key` หลายค่า เมื่อใช้ Relationship แบบ `Both` ค่าเหล่านี้อาจ propagate กลับไปยัง Dimension และ Visual อื่นเป็นหลาย Category—not necessarily Dimension `"(Blank)"` ตามที่เอกสารสรุปไว้

การตรวจเพียงว่า “Category ที่ resolve ได้เป็น Blank” ใน T18 จึงยังไม่พิสูจน์ว่า soft-fail ปลอดภัย นอกจากนี้ การลด opacity ของ Area ตามทางเลือกในหัวข้อ 2.2 ไม่ได้ทำให้ mark หยุดรับ click/hit-testing โดยตัวมันเอง

**Required fix:**

1. ถอนข้อสรุปในหัวข้อ 2.2 และ 2.2.1 ข้อ 4 ว่า `Category = Blank` จะทำให้ cross-filter ไปที่ `"(Blank)"` หรือจำกัดความเสียหายได้แน่นอน
2. ระบุเป็นคำถามเปิดว่า Area selection อาจ propagate ชุด `Filter_Key` ของ Fill rows ผ่าน bidirectional relationship
3. ขยาย T18 ให้ตรวจผลปลายทางจริงหลังคลิก Area:
   - selection/filter เกิดหรือไม่
   - filter ใดถูกสร้าง
   - Dimension และ Visual อื่นเหลือ Category ใดบ้าง
   - การเลือกเดิมถูกล้างหรือเปลี่ยนอย่างไร
4. กำหนด Phase 2 gate ว่า หาก Area click ทำให้ Visual อื่นถูกกรองผิด ต้องเปลี่ยน interaction architecture เช่น Advanced cross-filtering หรือวิธีที่พิสูจน์แล้วว่าตัด Area ออกจาก hit-testing ก่อนผ่าน Phase 2
5. ตัด “ลด opacity” ออกจากรายการ mitigation ด้าน interaction เว้นแต่มีมาตรการ hit-testing อื่นประกอบและมีหลักฐานทดสอบ

### สรุป

- M-22: **CLOSED**
- Mandatory finding ใหม่: **1 รายการ (M-23)**
- Verdict: **REVISE**