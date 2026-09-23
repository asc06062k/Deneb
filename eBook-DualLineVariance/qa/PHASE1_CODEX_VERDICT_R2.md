## 1. Verdict: REVISE

ข้อแก้ส่วนใหญ่มีทิศทางถูกต้อง แต่ยังไม่ควร `PASS` เพราะ:

- M-01 ยังปิดไม่ครบในส่วน mark interactivity และ semantic-model propagation
- M-10 เป็นเพียงข้อเสนอแก้ขอบเขต แต่ `PROJECT_PLAN.md` ซึ่งเป็น source of truth ยังไม่ได้แก้จริง
- พบ Mandatory finding ใหม่ 1 รายการเกี่ยวกับการระบุ grain/จำนวน Crossing rows ที่ขัดกันเอง

สรุป: ปิดครบแล้ว 8 ข้อ, ปิดบางส่วน 1 ข้อ, ยังไม่ปิด 1 ข้อ และมี finding ใหม่ 1 ข้อ

## 2. สถานะ findings รอบ 1

| ID | สถานะ | ผลตรวจ |
|---|---|---|
| M-01 | **PARTIALLY CLOSED** | Schema dataset เดียวและการ filter `Row_Type` แก้ปัญหา data source ได้ดี แต่คำกล่าวว่า “มี mark ให้คลิกได้เฉพาะ Point/Rule” ยังไม่จริงตาม design เพราะ Area และ Line ยังคงเป็น marks ที่รับ pointer event ได้ และ Area ใช้ Crossing rows โดยตรง นอกจากนี้ยังไม่ระบุ relationship/identity path ที่ทำให้การเลือก `DualLine_PlotData[Category]` cross-filter Visual อื่นได้จริง |
| M-02 | **CLOSED** | ระบุข้อจำกัดของ Power Query refresh-time ชัดเจน มี fallback ที่ไม่ใช้ Crossing rows และเพิ่ม T29 แล้ว |
| M-03 | **CLOSED** | การเปลี่ยนเป็น Column ที่ stamp จาก source ค่าเดียว พร้อม validate ก่อน stamp ตัด root cause ของค่าขัดกันระหว่างแถวได้เหมาะสมกว่า runtime guard เดิม |
| M-04 | **CLOSED** | ไม่กล่าวอ้าง dynamic lookup เกินหลักฐาน และระบุภาระการแก้ `labelExpr` array เมื่อเปลี่ยนข้อมูลชัดเจน |
| M-05 | **CLOSED** | ลด 280×180 เป็น Provisional และกำหนด viewport ที่ทำซ้ำได้ 4 ขนาด พร้อม long/dense scenarios |
| M-06 | **CLOSED** | นำ `KPI_ID` ออกจาก mandatory field contract แล้ว |
| M-07 | **CLOSED** | แยก text contrast ออกจาก non-text distinguishability ถูกต้อง เพิ่ม solid/dashed encoding และยกเลิก claim ว่าผ่าน CVD simulation แล้ว |
| M-08 | **CLOSED** | Matrix ครอบคลุมรายการที่ขาดจากรอบแรกแล้ว การไม่สร้าง test “ค่า Business_Type ขัดกันระหว่างแถว” แยกต่างหากยอมรับได้ เพราะสถาปัตยกรรม stamp ค่าเดียวทำให้กรณีนั้นเกิดไม่ได้ และมี distinct-value sanity check |
| M-09 | **CLOSED** | Evidence record มี viewport, scaling, dataset/spec identifier, scenario/category count และ Supporting Fields แล้ว |
| M-10 | **OPEN** | เห็นด้วยกับหลักการย้ายการยืนยัน UI จริงไป Phase 2 และไม่จำเป็นต้อง `BLOCKED` จากการไม่มี Power BI ใน Phase 1 แต่ไฟล์ [PROJECT_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md) ยังมี requirement เดิม จึงเกิด source-of-truth conflict กับ Design Plan การเสนอ amendment ภายใน Design Plan ยังไม่เท่ากับแก้แผนโครงการอย่างเป็นทางการ |

## 3. Mandatory findings ที่ยังเหลือ

### M-01R — Mark interactivity และ cross-filter identity ยังไม่ถูก Lock ครบ

**Severity:** High  
**หัวข้อ:** Dataset binding / Selection / Context menu

ข้อความในหัวข้อ 2.2 ที่ว่า “มี mark ให้คลิกได้เฉพาะจาก layer ที่ filter แล้ว (Point/Rule)” ไม่สอดคล้องกับ layer design เพราะ Area, Actual line และ Reference line ก็เป็น marks เช่นกัน โดยเฉพาะ Area mark มี Crossing rows อยู่ใน backing tuples

ผลกระทบที่ยังไม่ได้ป้องกัน:

1. การคลิกหรือ right-click บริเวณ Area อาจ resolve ไปยัง Crossing tuple ซึ่งไม่มี `Category`
2. Line mark อาจ resolve เป็น multi-row series แทน point identity
3. การกำหนด tooltip ไว้ที่ Point layerไม่ได้ทำให้ layer อื่นหยุดรับ pointer/context-menu event โดยอัตโนมัติ
4. แม้เลือก Original row สำเร็จ ยังไม่ระบุว่า `DualLine_PlotData[Category]` เชื่อมกับ semantic model อย่างไรให้ filter Visual อื่นได้จริง

**Required fix:**

- Lock interaction ownership ให้ชัด เช่นมี dedicated hit-target Point layer จาก Original rows
- ระบุวิธีป้องกัน Area/Line/Crossing tuples จาก selection และ context-menu resolution ด้วยกลไกที่ Deneb รองรับจริง และนำไปพิสูจน์ใน T18/T22
- ระบุ semantic-model relationship หรือ category identity strategy ของ `DualLine_PlotData` ที่ทำให้ outbound cross-filter ไปยัง Visual อื่นได้
- ปรับถ้อยคำจาก “ไม่มีทางชี้ไป Crossing” เป็น “ต้องพิสูจน์ใน T18/T22” จนกว่าจะมีหลักฐาน Power BI จริง

### M-10R — ต้องแก้ PROJECT_PLAN.md จริง

**Severity:** High  
**หัวข้อ:** Phase gate / Source of truth

ข้อเสนอการย้าย UI verification ไป Phase 2 สมเหตุสมผลและยอมรับได้ แต่ต้องแก้ [PROJECT_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md) โดยตรงอย่างน้อยใน:

- Phase 1 ข้อ 2
- Phase 2 gate
- ข้อกำหนดที่อ้างว่า UI ต้อง Lock ใน Phase 1
- ส่วน Definition of Done หรือข้อความอื่นที่ยังขัดกับ T30

เมื่อแก้แล้ว M-10 ถือว่าปิดได้ ไม่ต้องรอผล T30 เพื่อให้ Phase 1 ผ่าน เพราะ T30 จะเป็น Phase 2 gate ตาม amendment ใหม่

### M-11 — จำนวน Crossing rows และ grain ขัดกันเอง

**Severity:** High  
**หัวข้อ:** Field contract / Grain

หัวข้อ 2.1 ระบุชัดว่า Crossing point หนึ่งจุดถูกทำซ้ำสองแถว คนละ `Run_ID` แต่หัวข้อ Grain เขียนว่า:

> “บวกแถว Crossing ที่จำนวนเท่ากับจุดตัดที่พบ”  
> และต่อด้วย “ปรากฏ 2 แถวต่อจุดตัด”

สองข้อความนี้ขัดกัน จำนวนแถว Crossing ที่ถูกต้องตาม design คือ:

```text
Crossing row count = 2 × จำนวน strict crossings
```

ยกเว้น design จะกำหนดกติกาพิเศษสำหรับ endpoint equality หรือ run ที่มี `diff = 0`

**Required fix:**

- แก้ grain formula ให้ชัด
- Lock กฎ `diff = 0` ว่า:
  - ไม่สร้าง interpolated Crossing row เมื่อจุดเท่ากันอยู่ที่ Original category หรือไม่
  - Original equality point เป็นสมาชิกของ run ฝั่งใด/ทั้งสองฝั่ง
  - ป้องกัน zero-length run และ Crossing rows ซ้ำอย่างไร
- เพิ่ม expected result ให้ T04 ไม่ใช่ระบุเพียงสถานการณ์ทดสอบ

## 4. Optional improvements

- แยก `Dataset version/hash` และ `Spec version/hash` เป็นคนละบรรทัดใน Evidence record เพื่อลดความกำกวม
- T29 ควรใช้ผลคาดหมายว่า “ข้อจำกัดถูกตรวจพบและ fallback ถูกแนะนำ” แทนการนิยาม polygon ผิดรูปว่าเป็นพฤติกรรมที่ยอมรับได้เฉยๆ
- เพิ่ม invariant สำหรับ QA เช่น `OriginalCount = distinct Sort_Order`, `CrossingCount = 2 × StrictCrossingCount` และ `BusinessTypeDistinctCount = 1`
- ระบุชัดว่า `Sort_Order` ต้องเรียงเพิ่มขึ้นและมี spacing เท่ากัน หากความหมายของ `Plot_Position` คือระยะ Category แบบเท่ากัน

## 5. เงื่อนไขสำหรับรอบถัดไป

Phase 1 จะ `PASS` ได้เมื่อ:

1. แก้ M-01R โดย Lock interaction ownership และ semantic-model propagation
2. แก้ `PROJECT_PLAN.md` จริงตาม M-10R
3. แก้ grain และ equality/run policy ตาม M-11

หลังสามรายการนี้ ไม่มีความจำเป็นต้องเปิด Power BI จริงเพื่อปิด Phase 1; การพิสูจน์ UI และ interaction จริงคงเป็น mandatory gate ของ Phase 2 ตาม T18–T23 และ T30.