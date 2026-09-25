## Verdict: PASS

บทที่ 4 พร้อมส่งต่อ Phase 3 ไม่มีข้อผิดพลาดบังคับแก้ พบว่าข้อเท็จจริง ลำดับ Workshop โครงสร้าง Step ภาพประกอบ และข้อจำกัดที่เปิดเผย สอดคล้องกับหลักฐานต้นทาง

### Mandatory findings

| ID | ตำแหน่ง | ข้อค้นพบ | สิ่งที่ต้องแก้ |
|---|---|---|---|
| — | — | ไม่พบ Mandatory finding | — |

### ผลการตรวจสำคัญ

- Step ทั้ง 5 มีหัวข้อมาตรฐาน 12 หัวข้อครบและเรียงลำดับทำตามได้จริง
- ภาพ 4-1 ถึง 4-10 อ้างอิงถูกจุด และชื่อไฟล์ `CH04-S01` ถึง `CH04-S05` ตรงกับ Step
- ไม่พบชื่อบัญชีในภาพทั้ง 10 ภาพ คำว่า `deneb demo` เป็นชื่อไฟล์/รายงาน ไม่ใช่ชื่อบัญชี
- Caption ภาพ 4-6 อธิบายสถานะปุ่ม ✕/✓ กับ measure ใน Data pane ตามสิ่งที่เห็นจริง
- Caption ภาพ 4-8 ระบุถูกว่าริบบิ้น `Column tools` เกิดจากการเลือก `Segment_ID` และไม่เกี่ยวกับขั้นตอน
- Caption ภาพ 4-9 เปิดเผยการ crop และข้อจำกัดว่าไม่เห็น field ที่ถูกคลิกชัดเจนแล้ว จึงไม่ทำให้เข้าใจผิด

การตรวจตัวเลขด้วย [`run-ch04-claims-check.mjs`](D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/run-ch04-claims-check.mjs) ผ่าน 8/8:

- 12 เดือน 11 ช่วง
- A = 0, B = 9, C = 2
- Fill = 40: `Boundary` 22 และ `Crossing` 18
- รวม `Original` 12 เป็น 52 แถว
- ม.ค.–ก.พ. ได้ `t=0.4`, `Plot_Position=1.4`, ค่า 404
- แบบฝึกหัด ก.พ.–มี.ค. ได้ `Plot_Position=2.5`
- ตรงกับ `workshop-plotdata.json` และภาพ 4-4 ที่แสดง `12 COLUMNS, 52 ROWS`

ชื่อ query, field และ error code ตรงกับ [`DualLine_PlotData_PowerQuery.pq`](D:/DATA/Deneb/eBook-DualLineVariance/specs/DualLine_PlotData_PowerQuery.pq):

- `DualLine_PlotData`
- `DualLine.DuplicateCategory`
- `DualLine.SettingsRowCountInvalid`
- `DualLine.BusinessTypeInconsistent`
- `Filter_Key`, `Business_Type` และโครงสร้าง `Original`/`Boundary`/`Crossing`

เหตุผลการผูก `Actual`/`Reference` เป็น Sum และใช้ `DualLine Row Count` รองรับโดย Design Plan 2.1.1 และ [`workshop-measures.dax`](D:/DATA/Deneb/eBook-DualLineVariance/dax/workshop-measures.dax) อย่างตรงไปตรงมา ส่วน `Filter_Key`, cardinality `*:1` และทิศทาง `Both` ตรงกับ Design Plan 2.2.1 และหลักฐาน T18

ความครบตาม PROJECT_PLAN ผ่านทั้งหมด:

- มีโครงสร้างและที่มาของทั้ง 12 คอลัมน์
- มีกรณี A/B/C และตารางพฤติกรรมข้อมูลผิดปกติ
- แยก measure สำหรับ Visual อื่นออกจาก `DualLine_PlotData`
- มี `DualLine Row Count`
- `Plot_*`, `Run_Sign`, `Sort_Order` เป็น Don't summarize
- `Actual`, `Reference` เป็น Sum
- `Business_Type` เป็น Power Query column ที่ stamp ค่าเดียวทั้งตาราง

ข้อสมมติที่ผู้เขียนแจ้งไม่ถือเป็น overclaim:

- เมนูใต้ปุ่ม Load มีทางเลือกสำรองที่ทำตามได้
- Privacy Levels ระบุชัดว่าไม่พบระหว่างทดสอบ
- ตาราง 4.7 ระบุชัดว่ากรณี edge case ยังไม่ได้ทดสอบบน Power Query จริง
- ไม่ได้นำผล JavaScript มาอ้างว่าเป็นการทดสอบ Power Query จริงแทน

### Optional improvements

1. Step 1 ข้อ 3 อาจปรับเป็น “ถ้ามีเมนู **Transform Data** ให้เลือกเมนูนี้…” เพื่อให้ลำดับหลักไม่ดูเหมือนรับประกันว่า UI ทุกเครื่องต้องมีตัวเลือกดังกล่าว
2. หัวข้อ 4.7 อาจเพิ่มประโยคสั้น ๆ ว่า “ตารางนี้เป็นสัญญาพฤติกรรมตามโค้ด M ไม่ใช่หลักฐาน runtime ของแต่ละ edge case” แม้ข้อความปัจจุบันจะชัดเพียงพอแล้ว
3. ภาพ 4-9 อาจระบุเพิ่มว่าเมนูใช้ยืนยัน “รูปแบบตัวเลือก” เท่านั้น ไม่ได้ใช้ยืนยันว่า field ใดกำลังถูกตั้งค่า

### คำถามที่ต้องรอหลักฐานจากผู้ใช้

ไม่มีสำหรับการตัดสินบทนี้ตามข้อความปัจจุบัน

หากภายหลังต้องการเปลี่ยนสถานะกรณีในตาราง 4.7 จาก “ยังไม่ได้ทดสอบ” เป็น “ทดสอบแล้ว” จึงค่อยต้องขอหลักฐาน Power Query จริงสำหรับทั้งสี่กรณีแยกกัน.