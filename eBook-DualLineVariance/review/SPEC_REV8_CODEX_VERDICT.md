## Verdict: REVISE

อัลกอริทึมสร้างพื้นที่และโครงสร้าง Step/Template ถูกต้องโดยรวม และไม่พบข้อผิดพลาดที่ทำให้กราฟพื้นฐานหรือ crossing ผิด แต่ยังมีหนึ่งกรณีเชิงความหมายที่ต้องกำหนดนโยบายก่อนเขียนบท 4–8: การ cross-highlight แถวที่ค่าต้นฉบับเป็น Blank แต่ถูกแปลงเป็น `0`

ผมตรวจโครงสร้างโดยตรงได้ แต่รันชุดทดสอบปัจจุบันซ้ำไม่ได้ เพราะไม่มี `VEGA_NODE_MODULES` ในสภาพแวดล้อมนี้

## Mandatory findings

| ID | ตำแหน่ง | ข้อค้นพบ | สิ่งที่ต้องแก้ |
|---|---|---|---|
| M-01 | [dual-line-variance-final.vl.json](/D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:21), บรรทัด 118, 164, 180, 222, 257 | Top-level transform เปลี่ยน `Actual`/`Reference` จาก Blank เป็น `0` แต่ไม่ได้เปลี่ยน supporting field เช่น `Actual__highlight` เมื่อ Power BI ส่งค่าที่ highlight เป็น `null` ดังนั้นเงื่อนไข `datum.Actual__highlight === datum.Actual` จะเปรียบเทียบ `null === 0` และจุดที่มาจาก Blank อาจถูกลด opacity แม้เป็นเดือนที่ถูก highlight จริง ยิ่งกว่านั้น จากพฤติกรรม Deneb ที่บันทึกไว้ว่าแถวไม่ถูก highlight ก็ใช้ `status="on"` และ `__highlight=null` เช่นกัน จึงอาจแยก “แถว Blank ที่ถูกเลือก” ออกจาก “แถวไม่ถูกเลือก” ไม่ได้ด้วยข้อมูลปัจจุบัน | เพิ่มการทดสอบ Deneb จริง: visual ต้นทางเลือกเดือนที่ Actual หรือ Reference เป็น Blank แล้วบันทึก `__highlight`/`__highlightStatus` ทุกแถว จากนั้นเลือกอย่างใดอย่างหนึ่ง: (ก) ปรับ expression หากข้อมูลแยกสถานะได้ หรือ (ข) ระบุชัดว่าการ highlight ค่า Blank เป็นข้อจำกัดในบท 9 หากแยกไม่ได้ ห้ามอ้างว่าการ highlight รองรับ Blank อย่างสมบูรณ์ก่อนมีหลักฐานนี้ |

## ผลตรวจส่วนหลัก

อัลกอริทึมพื้นที่ผ่านการตรวจเชิงตรรกะ:

- `row_number` และ `lead` ที่ไม่มี `sort` สอดคล้องกับนโยบาย “ใช้ลำดับที่ Deneb ได้รับ” แต่ลำดับนี้เป็น dependency โดยตรง ไม่ใช่การเรียงเดือนภายใน spec
- Strict crossing ใช้ `Diff * NextDiff < 0` ถูกต้อง
- กรณีปลายด้านหนึ่งเป็นศูนย์ไม่ถูกแยกเป็น crossing และ `RunSign` เลือก sign ของด้านที่ไม่เป็นศูนย์ ถูกต้อง
- Crossing สร้าง 4 vertices แบ่ง `a/b`; non-crossing สร้าง 2 vertices
- `sign: -datum.RunSign` สำหรับครึ่งหลังของ strict crossing ถูกต้อง
- การกรอง `isValid(datum.NextActual)` ตัดเฉพาะแถวสุดท้าย เพราะ Blank ถูก normalize ก่อน `lead`
- `Diff=0` ทั้งช่วงให้ `RunSign=0`; ไม่เข้าฝั่ง Good จึงถูกจัดเป็น Bad แต่พื้นที่มีความสูงศูนย์ พฤติกรรมนี้ deterministic และตรงกับ EDGE-allEqual
- `datum.Vertex.sign` หลัง `flatten` ใช้ได้
- `"field": "Vertex.x"` เป็น nested-field access ที่ Vega-Lite รองรับ
- `window` และ `flatten` ไม่ได้ตั้งใจลบ field เดิม จึงยังคง `Category`, supporting fields และ metadata ของ Deneb สำหรับ interaction ของเดือนต้นช่วงได้ สอดคล้องกับหลักฐาน CF1–CF3
- Top-level `params` ที่ใช้ `data('dataset')` อ่านข้อมูลก่อน transform ตามที่ออกแบบไว้ จึงทำให้ `yHasBlank` ยังเห็น `null` ก่อนถูกแทนด้วยศูนย์
- การใช้ `MAX_VALUE`/`-MAX_VALUE` ทำให้ศูนย์เข้าร่วม extent เฉพาะเมื่อพบ Blank และไม่ลาก domain เข้าหาศูนย์ในข้อมูลปกติ ถูกต้อง
- กรณี empty dataset มี fallback `0..1`

Step generator ถูกต้อง:

- CH05-S01–S04 ใช้เฉพาะ transform index 2 (`row_number`)
- CH05-S05 ใช้ `[0,1,2]`
- ตั้งแต่ CH06 ใช้ transform ครบ `[0..9]`
- Test ตรวจทั้ง in-order subset, ลำดับ layer, cumulative layers และ Step สุดท้ายเท่ากับ final spec ยกเว้น description
- ไฟล์ Step สุดท้ายที่มีอยู่ตรงกับ final spec ตาม assertion ในชุดทดสอบ

Template replacement ถูกต้องสำหรับรูปแบบที่ final spec ใช้จริง:

- ครอบคลุม `datum.X`, highlight value/status, `"field"`, `"as"` และชื่อใน `pluck`
- regex ของ `datum.Actual` มี negative lookahead จึงไม่ชน `Actual__highlight` หลังจากแทนรูปแบบเฉพาะก่อน
- ไม่แตะ derived fields เช่น `NextActual`, `NextReference`, `lenA`
- round-trip check เป็น exact serialized-text comparison หลัง parse จึงมีน้ำหนักเพียงพอสำหรับการตรวจ generator
- แต่ยังไม่มีหลักฐานว่า template rev 8 นี้ import และ remap ได้จริงใน Deneb 2.0.0.0

## Optional improvements

- เพิ่ม regression สำหรับ `Blank + highlight` อย่างน้อยสี่กรณี: Actual blank, Reference blank, ทั้งคู่ blank หาก Power BI ยังส่งแถวมา, และ highlight เฉพาะ measure เดียว
- เพิ่ม VERT assertion ที่เปรียบเทียบ `Segment`/`part` ด้วย ปัจจุบันเปรียบเทียบ multiset ของ `x|actual|reference|sign` จึงอาจไม่จับกรณี vertices ถูกจัดกลุ่มเข้าพื้นที่ผิด segment แต่ค่าจุดรวมยังเท่าเดิม
- เพิ่ม mutation test สำหรับ crossing เช่นสลับ `part: 'a'/'b'` หรือเอา `-datum.RunSign` ออก เพื่อยืนยันว่า VERT/shape/color tests ล้มจริง
- เพิ่ม structural assertion ว่า CH05-S01–S04 มี transform “เท่ากับ” `[row_number]`, CH05-S05 เท่ากับ `[clean Actual, clean Reference, row_number]` และ CH06+ เท่ากับ transform ทั้งชุด ไม่ใช่เพียงเป็น subset
- เพิ่มกรณี `Business_Type` ว่างหรือสะกดนอก allow-list ปัจจุบันจะตกเป็น Bad ทั้งหมด ควรกำหนดว่าเป็น fallback ที่ตั้งใจหรือ invalid configuration
- เพิ่มกรณีค่าที่ไม่ใช่ finite number หาก Deneb/Power BI มีโอกาสส่ง `NaN` หรือ infinity
- เก็บผลรันล่าสุดใหม่: หลักฐานที่พบใน [run-output.txt](/D:/DATA/Deneb/eBook-DualLineVariance/qa/evidence/phase2-workshop-steps/run-output.txt) จบที่ `464 passed, 0 failed` และลงวันที่ 24 ก.ย. 2026 ขณะที่ชุดปัจจุบันอ้าง 487 รายการ จึงน่าจะเป็น log ก่อนเพิ่ม VERT/EDGE tests ไม่ใช่หลักฐานของชุดปัจจุบัน

ข้อจำกัดสองเรื่องที่ผู้ใช้เสนอให้เขียนในบท 9 ถือว่ายอมรับได้และไม่ใช่ defect ของ spec:

- ถ้าไม่ตั้ง `Category → Sort by column` พื้นที่และเส้นจะเชื่อมตามลำดับที่ Power BI/Deneb ส่งมา
- เมื่อ Actual และ Reference ว่างพร้อมกัน Power BI อาจไม่ส่งแถวนั้นมาเลย ทำให้ `Position` ของเดือนถัดไปเลื่อนและเส้นเชื่อมข้ามเดือนที่หายไป

## คำถามที่ต้องรอหลักฐานจากผู้ใช้

1. เมื่อ highlight เดือนที่ `Actual` หรือ `Reference` เป็น Blank จริง Deneb ส่ง `__highlight` และ `__highlightStatus` ของเดือนนั้นอย่างไร?
2. Template rev 8 import, map 4 fields, render, highlight และ area-click ผ่านบน Deneb 2.0.0.0 หรือไม่?
3. ขอผลรันชุดปัจจุบันที่แสดง `487 passed, 0 failed` พร้อมเวอร์ชัน `vega`/`vega-lite`; log ที่อยู่ใน repository ยังเป็นชุด 464 รายการ

หลังปิด M-01 และบันทึกข้อจำกัดสองข้อในบท 9 สถาปัตยกรรมนี้พร้อมใช้เป็นฐานเขียนบท 4–8 ใหม่ได้ โดยไม่ต้องย้อนกลับไปใช้ตาราง 13 field.