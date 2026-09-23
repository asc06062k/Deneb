## Verdict: REVISE

การเพิ่ม Requirement ทั้งสองข้อมีทิศทางถูกต้อง และไม่กระทบ finding รอบ 7 ที่ปิดไปแล้ว แต่ยังมี Mandatory finding ใหม่ 2 ข้อก่อนเริ่ม Phase 1

## Mandatory findings

### M-12 — แยก “responsive เทียบเท่าต้นแบบ” ออกจาก “รับประกันไม่ทับซ้อน”

source ยืนยันว่า `visual.ts` อ่าน viewport และคำนวณ thinning ใหม่ทุก `update()` จริง จึงจัดพฤติกรรมต่อไปนี้เป็น Group A ได้:

- ปรับ layout ตาม viewport ใหม่
- คำนวณ Category tick thinning ใหม่เมื่อ resize
- คำนวณ Actual/Reference data-label thinning ใหม่เมื่อ resize

แต่ต้นแบบไม่ได้รับประกันว่า Category label จะไม่ทับซ้อนทุกกรณี:

- ใช้ความกว้างโดยประมาณ `length × fontSize × 0.62`
- บังคับให้ Category สุดท้ายแสดงเสมอ ซึ่งอาจอยู่ใกล้ label ก่อนหน้า
- ไม่มีการตรวจ bounding-box collision หลัง render

ดังนั้น requirement ใหม่ “Category label ต้องไม่ทับซ้อนกัน” แข็งกว่าพฤติกรรมที่ source พิสูจน์ได้

ต้องแก้โดย:

1. ให้ Group A ระบุเฉพาะ responsive re-evaluation และ thinning แบบต้นแบบ
2. ให้การรับประกัน Category label ไม่ทับซ้อนภายในขนาดที่กำหนดใน Test matrix เป็น Group B หรือ “quality enhancement”
3. แยกคำว่า label ให้ชัดทุกจุดว่าเป็น:

   - Category axis label
   - Actual/Reference data label

4. DoD ควรมี assertion แยกกัน เช่น:

   - Category axis labels: ต้องไม่ทับซ้อนในทุก viewport ที่กำหนด
   - Data labels: ลดการชนด้วย thinning/above-below แต่ไม่รับประกัน collision-free ทุกกรณี

แนวทาง Vega-Lite ที่ควรพิสูจน์ใน Phase 1 คือ `width`/`height: "container"`, `autosize.resize: true` ตามความจำเป็น และ axis `labelOverlap: "greedy"`/`labelSeparation` ไม่ควรผูกคำสัญญาไว้กับ width-based expression เพียงวิธีเดียวก่อนทำ prototype จริง [Vega-Lite sizing](https://vega.github.io/vega-lite/docs/size.html), [Vega-Lite axis](https://vega.github.io/vega-lite/docs/axis.html)

### M-13 — แก้คำว่า “เพิ่ม data role ใหม่” และ Lock ผลต่อ grain ของ `Business_Type`

ประโยคใน Group B ที่ว่า:

> “เพิ่ม data role ใหม่ชื่อ `Business_Type`”

ไม่ถูกต้องสำหรับงาน Deneb เพราะ eBook ไม่ได้แก้ `capabilities.json` หรือประกาศ custom data role ใหม่แบบต้นแบบ แต่เป็นการเพิ่มคอลัมน์/ฟิลด์เข้า Deneb Values/data pane เพื่อให้ปรากฏใน `dataset`

ควรแก้เป็นประมาณว่า:

> “เพิ่ม field `Business_Type` จาก semantic model เข้า Deneb Values/data pane เพื่อให้เป็นคอลัมน์ใน `dataset`”

นอกจากนี้ ต้องเพิ่มใน Phase 1 ว่าจะพิสูจน์ผลของการผูก text column นี้ต่อ dataset grain จริง เพราะถ้า `Business_Type` มีหลายค่าภายใต้ Category เดียว Power BI/Deneb อาจส่งมากกว่าหนึ่งแถวต่อ Category ก่อนที่ Vega-Lite จะมีโอกาสใช้นโยบาย “เลือกแถวแรกที่ไม่ Blank”

ดังนั้น inconsistent-row policy ปัจจุบันยังไม่พอ ต้อง Lock เพิ่มว่า:

- `Business_Type` ถูกสร้างเป็น column หรือ measure
- วางในช่องใดของ Deneb
- dataset ที่ Deneb ได้มีจำนวนแถวและ grain อย่างไร
- “first non-Blank” อ้างอิงลำดับใด เพื่อให้ deterministic
- ตรวจ inconsistency ก่อนหรือหลัง Power BI aggregation/grouping
- ถ้าการผูก column ทำให้ Category แตกหลายแถว จะ normalize ด้วย DAX/Power Query/model หรือ Vega-Lite อย่างไร

## Optional improvements

- เปลี่ยนค่า `"Higher is Good"` / `"Lower is Good"` ให้มีทั้ง display value และ canonical internal value เช่น `higherIsGood` / `lowerIsGood` เพื่อลดปัญหาช่องว่างและการสะกด แต่ไม่จำเป็นถ้าตั้งใจสอนแบบตรงตัว
- ระบุว่า fallback `"Higher is Good"` สอดคล้องกับ default ของต้นแบบจาก `settings.ts` แต่ policy fallback เมื่อ field หายเป็นการออกแบบใหม่ของ eBook
- เพิ่ม responsive Test ID แยกอย่างน้อย 3 ชุด:

  - Category-axis overlap
  - Actual/Reference data-label overlap reduction
  - resize แล้ว logic ถูกคำนวณใหม่โดยไม่ต้อง reload visual

- ระบุ minimum supported viewport ใน Style guide เพราะไม่มีระบบใดรับประกันข้อความอ่านได้เมื่อพื้นที่เล็กเกินขีดจำกัดทางกายภาพ

## คำถามที่ต้องรอหลักฐาน

1. Deneb/Vega-Lite เวอร์ชันที่ Lock แล้ว re-evaluate `width`, axis overlap และ data-label thinning จริงเมื่อ resize ภายใน Power BI หรือไม่
2. การเพิ่ม `Business_Type` แบบ text column ลง Deneb ทำให้ dataset grain เป็นอย่างไร โดยเฉพาะกรณี Category เดียวมีหลายค่า
3. วิธี width-responsive thinning ที่เลือก compile และทำงานใน Vega-Lite version ของ Deneb จริงหรือไม่
4. `labelOverlap: "greedy"` หรือวิธีที่เลือกสามารถทำให้ Category axis labels ไม่ทับซ้อนครบทุก viewport ใน Test matrix ได้จริงหรือไม่

หลังปิด M-12 และ M-13 แล้ว แผนสามารถกลับเป็น `PASS` และเริ่ม Phase 1 ได้ โดย findings เดิมจากรอบ 7 ยังถือว่า CLOSED ทั้งหมดครับ.