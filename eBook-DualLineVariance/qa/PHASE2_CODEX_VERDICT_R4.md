## Verdict: REVISE

สำหรับขอบเขต **static + Workshop steps เท่านั้น**

การแก้แกนผ่าน และการทดสอบซ้ำได้ผล `136 passed, 0 failed` แต่ยังมีข้อขัดแย้งหนึ่งจุดกับข้อกำหนดว่า Step ต้องไม่มีโค้ดใหม่ที่อยู่นอก final spec จึงยังให้ `PASS` ไม่ได้

## Mandatory findings

| ID | ระดับ | หลักฐาน | Finding | สิ่งที่ต้องแก้ |
|---|---|---|---|---|
| M-12 | Medium | [build-workshop-steps.mjs:2](D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/build-workshop-steps.mjs:2), [build-workshop-steps.mjs:28](D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/build-workshop-steps.mjs:28), [CH05-S03-points.vl.json:116](D:/DATA/Deneb/eBook-DualLineVariance/specs/steps/CH05-S03-points.vl.json:116), [final spec:135](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:135), [test script:54](D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/run-workshop-step-tests.mjs:54) | Generator ระบุว่า Step เป็น “strict subset” และเอกสารบอกว่าไม่มี property ใหม่ แต่ `noTooltip()` เพิ่ม `mark.tooltip = null` ให้ `point_actual_hit_target` ใน CH05-S03–CH06-S03 ทั้งที่ layer เดียวกันใน final spec ไม่มี property นี้ การตรวจ “subset” ปัจจุบันตรวจเพียงชื่อและลำดับ layer จึงไม่พบปัญหา | เปลี่ยน `l.mark.tooltip = null` เป็นการลบ/ไม่เพิ่ม property หรือแก้คำอ้างให้ตรงกับเจตนา หากต้องคงไว้จริง พร้อมเพิ่ม assertion เปรียบเทียบโครงสร้าง/property ของแต่ละ layer กับ final spec ไม่ใช่ตรวจเฉพาะชื่อ |

## ผลตรวจประเด็นหลัก

- การลบ `axis: null` แก้แกนหายจริง: compile ได้แกน X `"เดือน"` และ Y `"ยอดขาย (พันบาท)"` โดยไม่พบ compile warning
- ไม่พบแกนชื่อผิดหรือแกนซ้ำเชิงภาพ; Vega สร้างองค์ประกอบแกน/grid ตามปกติ
- Layer ของ final spec และ static-test spec เหมือนกันทุก layer รวมทั้งลำดับ, `resolve` และ `config`
- Step สุดท้าย `CH08-S01` เท่ากับ final spec ยกเว้น `description`
- ลำดับบท 5→6→7→8 และลำดับ layer เหมาะสมกับแผนการสอน
- จำนวน mark คำนวณจาก Workshop data จริง: area 20, bad borders 10+10, connector/points 12 และ line อย่างละ 1
- เอกสารแยก `[VEGA-RENDERED headless]` กับ `[POWERBI-NOT-TESTED]` ชัดเจน ไม่พบการอ้างว่า Phase 2 ผ่านสมบูรณ์
- M-11 คงสถานะ **Accepted as known limitation, deferred by user** ตามคำตัดสินเดิม ไม่ยกเป็น finding ซ้ำ

## Optional improvements

- เพิ่ม structural-subset assertion แบบ recursive เพื่อหาการเพิ่ม property หรือเปลี่ยนค่าที่ไม่ได้มาจาก final spec
- ตรวจว่า `manifest.layers` เท่ากับชื่อ layer ในไฟล์จริงทุก Step และตรวจชุด layer ที่คาดหวังราย Step ไม่ใช่เพียง cumulative/subsequence
- เก็บผลรันใหม่ที่แสดงภาษาไทยถูกต้องแทน `run-output.txt` เดิมซึ่งข้อความภาษาไทยเพี้ยนจาก code page

## ความเห็นต่อคำถามเปิด

1. **Y domain ต่างจากต้นแบบ:** ควรบันทึกเป็นความแตกต่างจากต้นแบบก่อน ยังไม่ควรเพิ่ม logic ในรอบนี้ เพราะไม่อยู่ใน Field contract/Feature lock ปัจจุบัน หากต้องการ parity ควรออกแบบและทดสอบเป็นงานใหม่; `zero: false` อย่างเดียวไม่ได้เทียบเท่า padding 18% ของต้นแบบทั้งหมด
2. **`__selected__`:** ยังไม่ควรเพิ่มใน final spec จนกว่าจะมีหลักฐานจาก Deneb จริงว่าฟิลด์ถูก expose และต้องใช้เพื่อพฤติกรรมใด Cross-filter ขาออกและ cross-highlight ขาเข้าเป็นคนละกลไก; ตอนนี้ควรสอนการตั้งค่า Deneb ตามที่เอกสารระบุ
3. **M-11 Step:** คง `CH05-S04` ได้ แต่ต้องแสดงคำเตือน Known limitation อย่างชัดเจนเหมือนปัจจุบัน หากภายหลังถอน monotone ให้ลบ Step นี้และปรับ Step ถัดไปพร้อมกัน

## หลักฐานที่ยังต้องรอจากผู้ใช้

ไม่มีหลักฐานเพิ่มที่จำเป็นต่อการตัดสิน static รอบนี้ แต่ก่อนให้ Phase 2 ผ่านทั้งหมด ยังต้องมีผลทดสอบ Power BI Desktop + Deneb จริงสำหรับข้อ 5–7 และ Evidence Record ของ T14–T23, T25–T30 และ T33–T35 ตามแผนโครงการ.