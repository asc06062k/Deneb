## Verdict: REVISE

ผลตรวจรอบ 5:

| Finding เดิม | สถานะ |
| --- | --- |
| M-01R | **CLOSED** |
| M-12 | **CLOSED** |
| M-13 (Critical) | **PARTIALLY CLOSED** |

ยังมี Mandatory findings ค้างอยู่ จึงยังให้ `PASS` ไม่ได้

### M-01R — CLOSED

แก้ครบตามที่ร้องขอแล้ว:

- Area layer ระบุ filter จริงเป็น `Row_Type == 'Boundary' || Row_Type == 'Crossing'`
- Original rows จึงไม่หลุดเข้า Area layer
- อธิบายถูกต้องแล้วว่า `tooltip: null` ปิดเฉพาะ tooltip ไม่ได้ปิด click/selection/context-menu
- ไม่กล่าวอ้างว่า Point เป็น layer เดียวที่รับ event
- ความเสี่ยงของ Area interaction ถูกระบุเป็นคำถามเปิดสำหรับ T18/T22 อย่างตรงไปตรงมา

### M-12 — CLOSED

ข้อความใน `PROJECT_PLAN.md` สอดคล้องกับ Power Query Column architecture แล้ว:

- Phase 1 ข้อ 3 ใช้กรณี “ค่าต้นทาง Blank/ไม่ตรง allow-list ก่อน stamp”
- มี QA `DISTINCTCOUNT(Business_Type)=1` หลังสร้าง query
- Features กลุ่ม B บังคับ bind Column เข้า Deneb Values เสมอ
- fallback ไม่ถูกอธิบายว่าใช้ในกรณีไม่ bind field อีกแล้ว

### M-13 — PARTIALLY CLOSED

ส่วนที่แก้ถูกต้องแล้ว:

- Schema table กำหนด `Boundary.Plot_Reference = Reference` ของ Original ต้นทาง
- Pseudocode กรณี B/C คัดลอก `Actual` และ `Reference` แยกจากกัน
- สูตรนับ Boundary/Crossing rows สอดคล้องกับ per-segment algorithm

แต่ invariant ยังมีข้อความผิด:

> “มีเฉพาะแถว `Crossing` เท่านั้นที่ `Plot_Actual = Plot_Reference` เสมอ”

ข้อความนี้ไม่จริง เพราะกรณี C เช่น `+,0` หรือ `0,-` จะสร้างแถว `Boundary` จาก Original endpoint ที่ `Actual = Reference` ด้วย ดังนั้น Boundary ที่ปลาย `diff=0` ย่อมมี `Plot_Actual = Plot_Reference` อย่างถูกต้อง

Required fix:

- เปลี่ยน invariant เป็นประมาณว่า:
  - ทุก Boundary ต้องรักษา `Plot_Actual = Actual` และ `Plot_Reference = Reference` ของ Original ต้นทางเสมอ
  - ถ้า Original ต้นทางมี `Actual ≠ Reference` ค่า Plot ทั้งสองต้องไม่เท่ากัน
  - ถ้า Original ต้นทางมี `Actual = Reference` ค่า Plot ทั้งสองเท่ากันได้โดยถูกต้อง
  - ทุก Crossing ต้องมี `Plot_Actual = Plot_Reference`
- ห้ามกล่าวว่า equality พบได้เฉพาะ Crossing
- ให้ T04/T31/T32 ตรวจ zero-diff Boundary ด้วย ไม่ใช่ตรวจเฉพาะ nonzero Boundary

## Mandatory findings ใหม่

### M-14 — Field Contract ยังไม่ครอบคลุม Boundary rows

หัวข้อ 5 ระบุหลาย field ว่า Blank หรือมี plotting semantics เฉพาะ Crossing แต่ตาราง schema หัวข้อ 2.1 กำหนดว่า Boundary ก็มีพฤติกรรมดังกล่าว เช่น:

- `Category`: หัวข้อ 5 บอก Blank บน Crossing แต่ Boundary ก็ Blank
- `Actual`/`Reference`: หัวข้อ 5 บอก Blank บน Crossing แต่ Boundary ก็ Blank
- `Plot_Position`, `Plot_Actual`, `Plot_Reference`: คำอธิบายกล่าวถึง Original และ Crossing แต่ละ Boundary ไว้
- หัวข้อ 2.2.1 บอก relationship key “Blank บนแถว Crossing” ทั้งที่ถ้าใช้ `Category` ตาม schema แถว Boundary ก็ Blank เช่นกัน

นี่เป็น Mandatory เพราะหัวข้อ 5 ประกาศว่าเป็น Field Contract ฉบับเต็ม และความคลาดเคลื่อนอาจทำให้สร้าง Power Query/schema หรือ relationship ผิดได้

Required fix: เขียน semantics ครบทั้ง Original/Boundary/Crossing หรืออ้างตาราง 2.1 อย่างชัดเจน และแก้ relationship key ให้ระบุว่า Blank บน fill rows ทั้ง Boundary และ Crossing เว้นแต่จะเพิ่ม key คนละคอลัมน์พร้อมนิยามใหม่

### M-15 — Phase 1 gate ยังขัดกับสถานะ “ส่งต่อ Phase 2”

`PROJECT_PLAN.md` Phase 1 ข้อ 4 ยังบังคับให้พิสูจน์บน Power BI จริงภายใน Phase 1:

- Business_Type grain
- Category label resize
- Data-label thinning เมื่อ resize

แต่ Design Plan หัวข้อ 3, 4 และ 9 ระบุว่ายังไม่ได้พิสูจน์และส่งต่อเป็น T23/T25/T26 ใน Phase 2 อีกทั้ง Phase 1 ข้อ 2 อธิบายว่าไม่มีสิทธิ์เข้าถึง Power BI จริง

ดังนั้นตาม `PROJECT_PLAN.md` ปัจจุบัน Phase 1 ยังทำ Definition of Phase ไม่ครบ แม้ตัว Design จะยอมรับว่าเป็นงาน Phase 2 แล้วก็ตาม

Required fix: เลือกให้สอดคล้องทางเดียว:

- ย้าย proof ทั้งสามรายการใน Phase 1 ข้อ 4 ไปเป็น Phase 2 gates อย่างเป็นทางการและแก้ cross-reference; หรือ
- จัด Evidence จาก Power BI จริงให้ครบก่อนขอ Phase 1 PASS

หมายเหตุไม่บังคับ: หัวข้อ Test Matrix ยังเขียนว่า “เพิ่มเป็น 30 รายการ” แต่ตารางมี T01–T32 ควรแก้เป็น 32 รายการเพื่อไม่ให้เอกสารคลาดเคลื่อน

**สรุปรอบ 5: CLOSED 2, PARTIALLY CLOSED 1, NEW Mandatory 2 — Verdict `REVISE`.**