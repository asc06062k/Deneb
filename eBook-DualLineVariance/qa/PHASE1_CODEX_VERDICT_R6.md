# Phase 1 Codex Re-review — รอบ 6

**Verdict: `REVISE`**

| Finding | สถานะ |
| --- | --- |
| M-13 | **PARTIALLY CLOSED** |
| M-14 | **PARTIALLY CLOSED** |
| M-15 | **CLOSED** |
| M-16 (ใหม่) | **OPEN — Mandatory** |
| M-17 (ใหม่) | **OPEN — Mandatory** |

ยังมี Mandatory findings ค้างอยู่ จึงยังให้ `PASS` ไม่ได้

## M-13 — PARTIALLY CLOSED

ส่วน invariant หลักแก้ถูกต้องแล้วใน [PHASE1_DESIGN_PLAN.md:97](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:97):

- Boundary คัดลอก Actual/Reference แยกกัน
- Boundary ที่ต้นทาง `Actual ≠ Reference` ต้องมี Plot สองค่าไม่เท่ากัน
- Boundary ที่ต้นทาง `diff=0` มี `Plot_Actual = Plot_Reference` ได้อย่างถูกต้อง
- Crossing ต้องมี Plot สองค่าเท่ากัน

แต่ Required fix ด้าน Test Matrix ยังไม่ครบ:

- [T04](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:287) ตรวจเพียงรูปทรงและการสัมผัสกันของเส้น
- [T31](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:314) ตรวจสี จำนวนแถว และช่องว่าง
- [T32](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:315) ตรวจ polygon และช่องว่าง

ทั้งสามรายการยังไม่ได้ระบุ assertion โดยตรงว่า Boundary ที่ endpoint `diff=0` ต้องมี:

```text
Row_Type = Boundary
Plot_Actual = Actual ของ Original ต้นทาง
Plot_Reference = Reference ของ Original ต้นทาง
Plot_Actual = Plot_Reference
```

Required fix: เพิ่ม field-level assertions ข้างต้นลงใน Expected ของ T04/T31/T32 โดยตรง ไม่ใช่ระบุไว้เฉพาะข้อความก่อน Test Matrix

## M-14 — PARTIALLY CLOSED

ส่วนสำคัญแก้แล้ว:

- Field Contract แยก Original/Boundary/Crossing ครบทุก field ที่ [PHASE1_DESIGN_PLAN.md:210](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:210)
- Relationship key กำหนดให้ Blank ทั้ง Boundary และ Crossing ที่ [PHASE1_DESIGN_PLAN.md:145](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:145)

แต่หัวข้อ Business_Type ยังระบุว่า stamp ลงทุกแถว แล้ววงเล็บว่า “ทั้ง Original และ Crossing” ที่ [PHASE1_DESIGN_PLAN.md:181](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:181) ซึ่งตก `Boundary` และขัดกับ Field Contract ที่กำหนดว่า Boundary ต้องมี Business_Type ค่าเดียวกันด้วย

Required fix: เปลี่ยนเป็น:

> stamp ลงทุกแถว (`Original`, `Boundary`, และ `Crossing`) ของ `DualLine_PlotData`

## M-15 — CLOSED

Phase gate สอดคล้องกันแล้ว:

- Phase 1 ข้อ 4 เปลี่ยนเป็นการ Lock สมมติฐาน/แนวทาง ที่ [PROJECT_PLAN.md:180](D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:180)
- Proof จริง T23/T25/T26 ย้ายเป็น Phase 2 ข้อ 6 และเป็นเงื่อนไขก่อน Phase 2 PASS ที่ [PROJECT_PLAN.md:191](D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:191)
- Codex review ถูก renumber เป็น Phase 2 ข้อ 7 ที่ [PROJECT_PLAN.md:192](D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:192)

ไม่มี Phase 1/Phase 2 gate conflict เดิมเหลืออยู่

## M-16 — Test execution classification ขัดกัน

**Mandatory — ใหม่**

ในตาราง T31/T32 ถูกจัดเป็น `Static` แต่ข้อความสรุปหลังตารางที่ [PHASE1_DESIGN_PLAN.md:317](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:317) ระบุเฉพาะ T01–T13, T24, T28 ว่าเป็น static และบอกว่า “ที่เหลือ” ต้องมี Evidence จาก Power BI จริง

ดังนั้น T31/T32 ถูกจัดเป็นทั้ง:

- Static ตามตาราง
- Power BI จริงตามข้อความสรุป

Required fix: เพิ่ม T31/T32 ในรายการ static เช่น:

> T01–T13, T24, T28, T31 และ T32 ทดสอบแบบ static ได้...

## M-17 — Blank relationship key ขัดกับ T20/T29

**Mandatory — ใหม่**

Design Lock กำหนดให้ relationship key ของ Boundary/Crossing เป็น Blank ทั้งหมด แต่ยังคงคาดหวังว่า:

- T20: เมื่อ Visual ต้นทางใช้ `Filter` ต้องกรอง Visual นี้แบบปกติ
- T29/หัวข้อ 2.3: เมื่อกรอง Category จะเกิด Crossing row “ค้าง” และ polygon ผิดรูป

เมื่อ Dimension filter ลง `DualLine_PlotData` ผ่าน relationship แถว Fill ที่ key เป็น Blank จะไม่ match Category ที่เลือก จึงมีแนวโน้มถูกตัดออกทั้งหมด ไม่ใช่เหลือ Crossing row แบบ dangling ตามคำอธิบายปัจจุบัน พื้นที่ Variance อาจหายไปทั้งชุด ขณะที่ Original rows ยังเหลืออยู่

จุดที่ขัดกัน:

- Blank fill keys: [PHASE1_DESIGN_PLAN.md:145](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:145)
- ข้อจำกัด Filter/Slicer: [PHASE1_DESIGN_PLAN.md:244](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:244)
- T20: [PHASE1_DESIGN_PLAN.md:303](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:303)
- T29: [PHASE1_DESIGN_PLAN.md:312](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:312)

Required fix: เลือกและ Lock ให้ชัดเจนหนึ่งทาง:

1. ยอมรับว่า Category filter ทำให้ Fill rows ถูกตัดและ Variance area อาจหาย พร้อมแก้หัวข้อ 2.3, T20 และ T29 ให้ตรงกัน หรือ
2. เปลี่ยน data-model/filter-key architecture เพื่อให้ Fill rows ตอบสนองต่อ Category filter ตามพฤติกรรมที่ต้องการ แล้วเพิ่ม test ที่พิสูจน์ semantics ดังกล่าว

สรุป: **M-15 ปิดครบ แต่ M-13 และ M-14 ยังปิดไม่สมบูรณ์ และมี Mandatory ใหม่ 2 รายการ จึงเป็น `REVISE`**