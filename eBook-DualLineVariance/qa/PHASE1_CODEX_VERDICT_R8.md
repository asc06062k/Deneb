## Phase 1 Re-review — รอบ 8

**Verdict: REVISE**

สรุปผล: **CLOSED 1 (M-18), NEW 3 (M-19, M-20, M-21)**  
ยังให้ `PASS` ไม่ได้ เพราะมี Mandatory finding ใหม่ 3 รายการ

### ผลตรวจ Finding เดิม

| Finding | สถานะ | ผลตรวจ |
| --- | --- | --- |
| M-18 | **CLOSED** | T33 ครบตาม Required fix: ทดสอบตัด `row[i]` ฝั่งซ้ายโดยคง `row[i+1]`, ครอบคลุมทั้งกรณี B และ C และ assert ว่า Boundary/Crossing ทุกแถวถูกตัดเพราะใช้ `Filter_Key = key(row[i])` เหมือนกันทั้งหมด ขณะที่ T29 ครอบคลุมพฤติกรรมตรงข้ามเมื่อตัดฝั่งขวา จำนวน Test Matrix ปรับเป็น 33 รายการแล้ว |

M-13, M-14, M-16 และ M-17 ที่ปิดในรอบ 7 **ยังคง CLOSED** ไม่มี regression ที่ทำให้ต้องเปิดใหม่

### Mandatory findings ใหม่

#### M-19 — Axis field/type ใน `PROJECT_PLAN.md` ยังขัดกับ Design Lock

`PROJECT_PLAN.md` ส่วน Field contract ระบุว่า Category axis ต้องใช้ `Category` แบบ `nominal`/`ordinal` แต่ Design Plan หัวข้อ 2.4 ล็อกว่า:

- ทุก layer ใช้ `Plot_Position`
- encoding เป็น `quantitative`
- `Category` ใช้เพียง identity/tooltip และสร้าง axis label ผ่าน `labelExpr`

สถาปัตยกรรม crossing ที่ interpolate ตำแหน่งเศษส่วนจำเป็นต้องใช้ quantitative axis ดังนั้นข้อความเดิมใน Project Plan ไม่ใช่แค่คำอธิบายต่างมุม แต่เป็น contract ที่ขัดกันโดยตรง

**Required fix:** แก้แถว `Category axis type` ใน `PROJECT_PLAN.md` ให้ระบุว่า:

- ต้นแบบใช้ ordinal/scalePoint
- ฉบับ Deneb เลือกออกแบบต่างออกไปโดยใช้ `Plot_Position: quantitative` เพื่อรองรับจุดตัดระหว่าง Category
- Label ของ Category มาจาก `Sort_Order → Category` mapping/`labelExpr`
- ไม่ใช้ `Category` เป็น x encoding โดยตรง

#### M-20 — Test Matrix ยังไม่มี assertion ตรงสำหรับ `DISTINCTCOUNT(Business_Type) = 1`

`PROJECT_PLAN.md` Phase 1 ข้อ 3 บังคับให้ Test Matrix ครอบคลุมทั้ง fallback และ `DISTINCTCOUNT(Business_Type)=1` หลังสร้าง query แต่ T13 ปัจจุบันระบุเพียง:

> Business_Type ต้นทาง Blank/ไม่ตรง allow-list (ตรวจ Power Query fallback)

ส่วน QA invariant ถูกกล่าวไว้ใน prose หัวข้อ 2.0/3 แต่ยังไม่มี Expected assertion ใน Test Matrix ว่า Original, Boundary และ Crossing ถูก stamp ค่าเดียวกันทั้งตารางจริง

**Required fix:** ขยาย T13 หรือเพิ่ม Test ID ใหม่ให้ assert โดยตรงว่า:

- input Blank/invalid ถูก normalize เป็น `"Higher is Good"`
- ทุก Row_Type ได้แก่ Original, Boundary และ Crossing ได้ค่าเดียวกัน
- `DISTINCTCOUNT(Business_Type) = 1`
- ไม่มี Blank หรือค่าอื่นนอก allow-list หลังสร้าง `DualLine_PlotData`

#### M-21 — ชุด viewport ยังไม่ครอบคลุม “แคบ/กว้าง/เตี้ย/สูง” ตาม `PROJECT_PLAN.md`

Project Plan Phase 1 ข้อ 3 กำหนดให้ Test Matrix มีขนาดที่ครอบคลุม **แคบสุด, กว้างสุด, เตี้ย และสูง** แต่ T14–T17 ปัจจุบันคือ:

- 280×180
- 480×270
- 800×450
- 1200×675

ทุกขนาดเพิ่มทั้งความกว้างและความสูงไปพร้อมกันในสัดส่วน landscape ใกล้เคียงกัน จึงยังไม่แยกพิสูจน์ผลของ container ที่ “กว้างแต่เตี้ย” หรือ “แคบแต่สูง” โดยเฉพาะ ทั้งที่ Project Plan และบทที่ 9 สัญญาการทดสอบสูง–ต่ำไว้

**Required fix:** เลือกทางใดทางหนึ่ง:

1. เพิ่ม viewport ที่เปลี่ยน aspect ratio อย่างน้อยหนึ่งกรณีกว้าง–เตี้ยและหนึ่งกรณีแคบ–สูง พร้อมนำเข้า T25/T26; หรือ
2. ลด/แก้ requirement ใน `PROJECT_PLAN.md` ให้ตรงกับขอบเขตสี่ขนาด landscape ที่ตั้งใจรองรับจริง

### หมายเหตุไม่บังคับ

หัวข้อ 9 รายการ 6 ยังกล่าวถึงเฉพาะ T29 ควรแก้เป็น `T29/T33` เพื่อให้รายการงานที่ส่งต่อ Phase 2 สอดคล้องกับ Test Matrix แม้การตกหล่นนี้ยังไม่ทำให้ M-18 เปิดใหม่ เพราะ T33 ถูกกำหนดเป็น Power BI test และอยู่ภายใต้ข้อกำหนด Evidence แล้วอย่างชัดเจน

เมื่อแก้ M-19 ถึง M-21 ครบและไม่มี inconsistency เพิ่มเติม รอบถัดไปจึงควรให้ `PASS` ได้ครับ