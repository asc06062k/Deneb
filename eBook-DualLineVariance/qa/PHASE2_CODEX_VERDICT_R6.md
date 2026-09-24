## Verdict: PASS

สำหรับขอบเขต **static + Workshop steps เท่านั้น**

### Mandatory findings

ไม่มี

ผลตรวจสำคัญ:

- สูตร Y-domain ใน [dual-line-variance-final.vl.json](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:8) ตรงกับ `visual.ts:167-174` สำหรับข้อมูลปกติ:
  - padding `(max − min) × 0.18`
  - fallback `|max| × 0.1` และ `1`
  - guard ให้ `domainMax > domainMin`
  - เพิ่ม `isFinite()` อย่างเหมาะสมเพื่อให้ข้อมูลว่างได้ `[0, 1]`
- Blank ปลอดภัยภายใต้ Field contract ที่ normalize เป็น `0` ก่อนเข้า Deneb; static suite ยืนยัน T05/T06 ผ่าน
- `data('dataset')` อ้างถึง named dataset ถูกต้องทั้ง final spec และการทดสอบ inline ซึ่งยังคง `{name: "dataset", values: ...}`
- `scale` ที่กำหนดบน `line_actual` ถูกใช้ร่วมกับทุก layer เพราะ `resolve.scale.y = "shared"`; compile/render ทั้ง 11 Step ไม่มี warning และ area/border/connector/point/label ใช้ Y scale เดียวกัน
- การแก้เรื่อง `__selected__` ใน [PROJECT_PLAN.md](D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:36) ครบจุดที่เคยกำหนดให้ encode:
  - ขอบเขตหลัก
  - Cross-filtering requirement
  - บทที่ 8
- การกล่าวถึง `__selected__` ที่ยังอยู่ใน Phase 1 และ Definition of Done เป็นคำอธิบายกลไก/หลักฐานที่ต้องยืนยัน ไม่ได้บังคับให้ encode จึงไม่ขัดกับคำตัดสินใหม่
- Generator เพิ่ม CH05-S05 อย่างถูกลำดับ และใส่ `params` เฉพาะเมื่อมี layer อ้างถึง Y-domain scale
- Step สุดท้ายเท่ากับ final spec ยกเว้น `description`

### ผลทดสอบ

- Workshop suite ที่รันซ้ำ: **338 passed, 0 failed**
- Static algorithm suite ที่รันซ้ำ: **50 passed, 0 failed**
  - รันโดยตัดเฉพาะขั้นตอนเขียน `workshop-plotdata.json` ออกในหน่วยความจำ เพราะ workspace เป็น read-only
- Rendered Y-domain:
  - ก่อน CH05-S05: `[0, 600]`
  - ตั้งแต่ CH05-S05: `[340.4, 639.6]`
- ไม่มี Vega-Lite compile warning หรือ shared-scale conflict
- Regression เดิมเรื่องแกน X/Y, layer structure, mark count, monotone introduction และ final-step equality ผ่านทั้งหมด

### Optional improvements

- เพิ่ม empty dataset และ constant-value dataset เข้า automated Workshop suite โดยตรง ปัจจุบันสองกรณีนี้เป็นการทดสอบแยก
- เพิ่ม test ที่ตรวจว่า area, connector และ label อ่าน domain เดียวกับ `line_actual` โดยตรง แม้ผล render และการไม่มี warning จะยืนยันพฤติกรรมนี้แล้ว
- ปรับข้อความ Definition of Done ที่ว่า “`__selected__` กับ `__highlight`...” ให้ชัดขึ้นว่า `__selected__` เป็นฟิลด์ที่ Deneb อาจ expose แต่หนังสือรอบนี้ไม่อ่านหรือ encode เพื่อลดโอกาสตีความผิดในอนาคต

### คำถามที่รอหลักฐานผู้ใช้

ยังต้องตรวจบน Power BI Desktop + Deneb 2.0 จริง โดยไม่กระทบ PASS สำหรับ static + Workshop steps รอบนี้:

1. ยืนยันว่า Deneb inject ข้อมูลภายใต้ชื่อ `dataset` ตามที่ spec ใช้ใน runtime จริง
2. ตรวจ Y-domain ในสถานการณ์ต่อไปนี้:
   - คลิก Cross-filter แบบ Simple จากกราฟนี้
   - รับ filter จาก Visual อื่น ซึ่งคาดว่าแถวใน `dataset` จะลดลงและ domain ควรคำนวณใหม่
   - รับ cross-highlight ซึ่งคาดว่า base rows จะยังอยู่และ domain ไม่ควรเปลี่ยน เว้นแต่ host ส่ง dataset แบบลดแถว
   - filter จนไม่เหลือข้อมูล ซึ่งควรได้ `[0, 1]`
3. เก็บ Evidence record ตาม template พร้อม Power BI/Deneb version, interaction mode, Expected/Actual และภาพหรือวิดีโอ

ไม่สามารถเขียนไฟล์ verdict รอบ 6 ลง repository ได้ เนื่องจาก session นี้มีสิทธิ์ filesystem แบบ read-only.