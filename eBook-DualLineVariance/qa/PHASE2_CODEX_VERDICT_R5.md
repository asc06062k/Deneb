## Verdict: PASS

สำหรับขอบเขต **static + Workshop steps เท่านั้น**

### Mandatory findings

ไม่มี

M-12 แก้ครบแล้ว:

- `noTooltip()` ลบ `encoding.tooltip` และ calculate transforms โดยไม่เพิ่ม `mark.tooltip = null`
- Step ก่อน CH07 ไม่มี `mark.tooltip`, `encoding.tooltip` หรือ calculate transforms ใน `point_actual_hit_target`
- Structural-subset validation ตรวจ object แบบ recursive, primitive แบบ exact comparison และ array แบบ in-order subsequence ถูกต้อง
- Manifest, lesson-plan layers และ top-level properties ถูกตรวจเทียบครบ
- Step สุดท้ายเท่ากับ final spec ยกเว้น `description`

### ผลทดสอบ

- Workshop suite: **284 passed, 0 failed**
- Static algorithm suite: **50 passed, 0 failed**
  - ต้องรันแบบตัดขั้นตอนเขียน `workshop-plotdata.json` ออก เนื่องจาก workspace รอบนี้เป็น read-only
- final/static-test:
  - layers เหมือนกัน
  - `resolve` เหมือนกัน
  - `config` เหมือนกัน
- CH08-S01 เท่ากับ final spec ยกเว้น `description`
- แกน X/Y และชื่อภาษาไทยผ่านการ compile/render

### Optional improvements

- เพิ่ม unit tests ของ `isSubset()` โดยตรงสำหรับ primitive mismatch, nested-object mismatch, array order และ duplicate elements
- ทำ negative mutation test ของ `mark.tooltip = null` ให้เป็น automated test แทนการทดสอบด้วยมือ เพื่อป้องกัน assertion regression ในอนาคต

### คำถามเปิดและหลักฐานเพิ่มเติม

ไม่มีหลักฐานเพิ่มเติมที่จำเป็นต่อ verdict ในขอบเขตนี้

ข้อจำกัดเดิมเกี่ยวกับ Power BI Desktop/Deneb จริง, M-11, Y-domain และ `__selected__` ยังอยู่นอกคำตัดสิน static รอบนี้ตามที่กำหนดไว้

ไม่สามารถเขียนไฟล์ verdict ลง repository ได้ เพราะ session นี้ได้รับสิทธิ์ filesystem แบบ read-only.