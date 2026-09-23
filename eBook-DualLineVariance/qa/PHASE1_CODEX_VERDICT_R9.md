## Verdict: REVISE

ยังให้ `PASS` ไม่ได้ เพราะ M-21 ปิดไม่ครบทั้งเอกสาร

### ตรวจ Finding เดิม

| Finding | สถานะ | ผลตรวจ |
| --- | --- | --- |
| M-19 | **CLOSED** | `PROJECT_PLAN.md` แถว Category axis type เปลี่ยนเป็น `Plot_Position: quantitative` พร้อมเหตุผลเรื่องตำแหน่งจุดตัดแบบเศษส่วน และระบุที่มาของ label ผ่าน `Sort_Order → Category` mapping/`labelExpr` แล้ว ตรงกับ Design Lock |
| M-20 | **CLOSED** | T13 มี Expected ครบทั้ง 4 assertion: normalize ก่อน stamp, ค่าเดียวกันทุก `Row_Type`, `DISTINCTCOUNT=1`, และไม่มี Blank/ค่านอก allow-list |
| M-21 | **PARTIALLY CLOSED** | เพิ่ม T34/T35 และแก้ T25/T26 ให้ครอบคลุมทั้ง 6 ขนาดแล้ว แต่ยังมีข้อความตกค้างที่บังคับพิสูจน์เพียง “4 ขนาด” |

### Mandatory finding ใหม่

**M-22 — Responsive Phase 2 gate ยังอ้างเพียง 4 viewport ขัดกับ Test Matrix 6 viewport**

หลักฐาน:

1. `PHASE1_DESIGN_PLAN.md` หัวข้อ 9 ข้อ 2 ยังเขียนว่า:

   > Category axis label responsive proof ... ที่ 4 ขนาด viewport (T25)

2. `PROJECT_PLAN.md` Phase 2 ข้อ 6 ยังเขียนว่า:

   > Category axis label ไม่ทับซ้อนจริงเมื่อ resize ที่ 4 ขนาด viewport ที่ Lock ไว้ (T25)

แต่ T25/T26 และหัวข้อ 4.3 กำหนดไว้แล้วทั้งหมด 6 ขนาด ได้แก่ T14–T17, T34 และ T35 ทำให้ Phase 2 สามารถตีความว่าผ่าน gate หลังทดสอบเพียง 4 ขนาด โดยไม่ทดสอบ aspect ratio ใหม่ทั้งสองแบบ

**Required fix:**

- แก้ `PHASE1_DESIGN_PLAN.md` หัวข้อ 9 ข้อ 2 จาก “4 ขนาด” เป็น “6 ขนาด: T14–T17, T34, T35” หรืออ้างว่า “ทุกขนาดที่กำหนดใน T25”
- แก้ `PROJECT_PLAN.md` Phase 2 ข้อ 6 เช่นเดียวกัน
- แนะนำให้ระบุ T26 ใน Phase 2 gate ว่าต้องตรวจครบ 6 ขนาดด้วย เพื่อให้ตรงกับ Expected ของ T26 โดยไม่มีช่องตีความ

### สรุป

- M-19: CLOSED
- M-20: CLOSED
- M-21: ยังไม่ปิดสมบูรณ์ เนื่องจาก M-22
- Mandatory คงเหลือ: **1 ข้อ (M-22)**
- Verdict: **REVISE**