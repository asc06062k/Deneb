## Verdict: REVISE

### สถานะ Finding เดิม

- **M-12: ยังปิดไม่ครบ**
- **M-13: CLOSED**

### Mandatory finding ที่ยังเหลือ

**M-12 — Learning Outcome ข้อ 5 ยังสัญญาว่า Data label จะไม่ชนกันหลัง resize**

ข้อความปัจจุบัน:

> “เพิ่ม Connector line, Data label ที่ลดการชนกัน ... พร้อมทำให้ label ไม่ชนกันซ้ำเมื่อผู้ใช้ปรับขนาด Visual (Responsive)”

คำว่า “ทำให้ label ไม่ชนกันซ้ำ” ยังอ่านตรงตัวว่า Actual/Reference data label จะ collision-free หลัง resize ซึ่งขัดกับ Group A ที่รับประกันเพียง:

1. ลดการชนกัน
2. re-evaluate ใหม่ทุก resize
3. ไม่รับประกันว่าไม่ชน 100%

ควรแก้เป็นประมาณ:

> “เพิ่ม Connector line, Data label ที่ลดการชนกัน (ไม่รับประกันว่าไม่ชนทุกกรณี) และ Tooltip หลายค่า พร้อมทำให้กลไกจัดตำแหน่งและ thinning ของ Data label ประเมินใหม่ทุกครั้งที่ผู้ใช้ปรับขนาด Visual”

หากต้องการครอบคลุม Group B ใน Learning Outcomes ด้วย ควรแยกอีกประโยค เช่น:

> “ทำให้ Category axis label ไม่ทับซ้อนกันภายในช่วงขนาดที่ผ่าน Test matrix ตามกลไกที่พิสูจน์และ Lock ใน Phase 1”

**M-14 — Cross-reference ของ Evidence record ล้าสมัยหลังเพิ่ม Phase 1 ข้อ 4**

หัวข้อ 9 ระบุว่า:

> “ผลทดสอบ ... ต้องมี Evidence record ครบตามที่ Lock ไว้ใน Phase 1 ข้อ 4”

แต่ Evidence record อยู่ใน **Phase 1 ข้อ 5** แล้ว ส่วนข้อ 4 เป็น prototype ของ `Business_Type` grain และ Category axis label responsiveness

ต้องแก้ `Phase 1 ข้อ 4` เป็น `Phase 1 ข้อ 5` เพื่อไม่ให้ release governance อ้างผิดข้อ

### ผลตรวจ M-13

M-13 ปิดครบแล้ว:

- ไม่มีคำสัญญาว่าเพิ่ม data role ใหม่
- ระบุว่าเพิ่ม field จาก Semantic model เข้า Deneb Values/data pane
- แยกชัดว่าไม่ได้แก้ `capabilities.json`
- Lock `Business_Type` เป็น DAX Measure ค่าคงที่ ไม่ใช่ Column
- กำหนด fallback และ defensive guard
- Phase 1 ข้อ 4 บังคับพิสูจน์จาก prototype ว่าจำนวนแถวใน `dataset` เท่ากับจำนวน Category

นอกเหนือจาก **M-12** และ **M-14** ไม่พบ Mandatory finding เพิ่มจากฉบับที่ให้ตรวจนี้ หลังแก้สองจุดดังกล่าวจึงพร้อมส่ง re-review เพื่อพิจารณา `PASS` ได้