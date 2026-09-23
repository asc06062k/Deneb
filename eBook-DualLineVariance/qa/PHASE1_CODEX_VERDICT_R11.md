## Verdict: REVISE

ยังให้ `PASS` ไม่ได้ เพราะ M-23 ปิดไม่ครบ แม้การวิเคราะห์หลักและ T18 จะแก้ถูกต้องแล้ว ไม่พบ Mandatory finding ใหม่ที่เป็นคนละประเด็น แต่พบข้อความตกค้างและ Phase 2 gate ที่ยังไม่ถูกบันทึกครบใน `PROJECT_PLAN.md`

### ตรวจ Finding เดิม

| Finding | สถานะ | ผลตรวจ |
| --- | --- | --- |
| M-19 | **CLOSED** | Category axis ใช้ `Plot_Position: quantitative` ตรงกันแล้ว |
| M-20 | **CLOSED** | T13 มี Expected assertions ครบ |
| M-21 | **CLOSED** | T34/T35 และการอ้างถึงทั้ง 6 viewport ครบ |
| M-22 | **CLOSED** | ไม่พบคำว่า 4 ขนาดที่ขัดกับ Test matrix |
| M-23 | **PARTIALLY CLOSED** | การวิเคราะห์ propagation, T18 และการตัด opacity แก้ถูกต้อง แต่ยังมีข้อความ soft-fail ตกค้างและ Phase 2 gate ยังไม่อยู่ในแผนหลัก |

## Mandatory finding ที่ยังเหลือ

### M-23R — ถอน soft-fail claim และเพิ่ม Phase 2 gate ยังไม่ครบทุกจุด

ส่วนที่แก้ถูกต้องแล้ว:

- [PHASE1_DESIGN_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:165) วิเคราะห์ถูกต้องว่า `Category = Blank` อาจคง Fill rows จำนวนมากซึ่งมี `Filter_Key` หลายค่า และส่งผลกรองหลาย Category ผ่านความสัมพันธ์แบบ `Both`
- [PHASE1_DESIGN_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:168) กำหนดให้เปลี่ยน interaction architecture ถ้า Area-click กรองผิด
- [PHASE1_DESIGN_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:340) ขยาย T18 ให้ตรวจ Category ที่เหลือจริงแล้ว
- ไม่พบ “ลด opacity” เหลืออยู่ในรายการ mitigation ปัจจุบัน

แต่ยังเหลือ Mandatory สองส่วน:

1. ยังมีข้อความเรียก `Category Blank` ว่าเป็น soft-fail/mitigation

   - [PHASE1_DESIGN_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:54) ยังเขียนว่า `mitigation แบบ soft-fail (Category Blank บน Fill-only)`
   - [PHASE1_DESIGN_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:174) หัวข้อ Design Lock ยังระบุว่า `Category` “ใช้เพื่อ soft-fail”

   สองจุดนี้ขัดกับข้อสรุปใหม่ที่ว่าแนวทางดังกล่าวไม่ใช่ soft-fail ที่ปลอดภัย แม้จุดแรกจะอยู่ในประวัติการแก้รอบเก่า แต่เอกสารเดียวกันไม่ควรเก็บคำกล่าวอ้างที่ทราบแล้วว่าผิดโดยไม่มีหมายเหตุถอนคำกล่าวอ้าง

2. Phase 2 gate ยังไม่ถูกเพิ่มใน `PROJECT_PLAN.md`

   Design Plan ระบุ gate แล้ว แต่ `PROJECT_PLAN.md` Phase 2 ข้อ 1–7 ยังไม่มีข้อบังคับว่า T18/T22 ต้องพิสูจน์ Area-click และหากกรองผิดต้องเปลี่ยน interaction architecture ก่อน Phase 2 `PASS`

   ปัจจุบัน:

   - Phase 2 ข้อ 3 เพียงกำหนดว่าการทดสอบ Interaction ต้องทำบน Power BI จริง
   - Phase 2 ข้อ 5–6 กำหนด gate สำหรับ UI และ T23/T25/T26
   - Release gate ยอมให้ Interaction ที่ยังไม่พิสูจน์ออกเป็น Draft ได้

   ดังนั้นตามตัวบทปัจจุบัน Phase 2 ยังอาจผ่านก่อนแก้ Area-click แล้วค่อยค้างไว้ถึง Release ซึ่งไม่ตรง Required fix ของ M-23 ที่ระบุว่า “ก่อน Phase 2 PASS”

### Required fix รอบนี้

1. แก้บรรทัด 54 ให้ระบุว่าแนวคิด soft-fail เดิมถูกถอนในรอบ 11 หรือเอาคำว่า soft-fail/mitigation ออก
2. แก้หัวข้อบรรทัด 174 จาก “`Category` … ใช้เพื่อ soft-fail” เป็นบทบาทที่เป็นกลาง เช่น field แสดงผล/identity โดยไม่อ้างว่าป้องกัน Area interaction
3. เพิ่ม Phase 2 gate ใน `PROJECT_PLAN.md` โดยตรงว่า:

   - ต้องทำ T18 และ T22 บน Power BI จริงพร้อม Evidence record
   - ถ้า Area-click/right-click ทำให้เกิด selection/filter หรือ data-point resolution ที่ผิด ต้องเปลี่ยน interaction architecture และ regression-test ใหม่
   - ห้ามให้ Phase 2 `PASS` จนกว่าพฤติกรรม Area จะถูกแก้หรือพิสูจน์ว่าปลอดภัย

4. แนะนำให้อัปเดต Design Plan หัวข้อ 9 “สิ่งที่ยังไม่ปิดหลัง Phase 1” ให้รวม T18/T22 และ Area interaction architecture เพื่อไม่ให้รายการงาน Phase 2 ตกหล่น

## สรุป

- M-19/M-20/M-21/M-22: **CLOSED**
- M-23: **ยังปิดไม่ครบ**
- Mandatory finding ใหม่ที่เป็นประเด็นแยก: **ไม่มี**
- Mandatory ที่เหลือ: **1 รายการต่อเนื่อง — M-23R**
- Verdict: **REVISE**