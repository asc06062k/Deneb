## Verdict: REVISE

เนื้อหาหลักถูกต้อง ตัวอย่างสอดคล้องกับ Vega-Lite 6 และตัวเลขจากข้อมูล Workshop ถูกต้อง แต่มี 4 ประเด็นที่ควรแก้ก่อนให้ `PASS` โดยเฉพาะ `$schema`, เงื่อนไขการเกิด supporting fields ของ Deneb และตารางอ้างอิงท้ายบท

### Mandatory findings

| ID | ตำแหน่ง | ข้อค้นพบ | สิ่งที่ต้องแก้ |
|---|---|---|---|
| CH03-M01 | [chapter-03.md:35](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-03.md:35) | ยังไม่ครบตาม `PROJECT_PLAN.md` ที่ระบุให้สอน `$schema` เป็นคอมโพเนนต์ ปัจจุบันบอกเพียงว่าภาพ 2-12 ไม่มีและตัวอย่างจึงไม่ใส่ เหตุผลจากเอกสาร Deneb คือ editor ใช้ schema ที่ resolve ภายใน; `$schema` ที่เป็น URL จะพยายามออกอินเทอร์เน็ตซึ่งถูกบล็อกใน certified visual และทำให้ validation/autocomplete มีปัญหา ไม่ใช่เพียงเพราะ template ในภาพไม่มี | เพิ่มหัวข้อสั้น เช่น “`$schema`: ใช้บอกเวอร์ชันภาษา แต่ทำไมไม่ใส่ใน Deneb” อธิบายว่า external Vega-Lite spec มักใช้ `https://vega.github.io/schema/vega-lite/v6.json` แต่ใน Deneb editor ควรละไว้ เพราะ Deneb resolve schema ภายในและถอดออกเมื่อนำเข้า template อ้าง [Deneb Templates](https://deneb.guide/docs/templates) และ [Deneb Visual Editor](https://deneb.guide/docs/visual-editor) |
| CH03-M02 | [chapter-03.md:37](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-03.md:37) | ประโยค “Deneb เติม `__row__` และ `__selected__` ให้เอง และเมื่อผูก measure จะมี `<ชื่อ>__highlight`” กว้างเกินจริงใน Deneb 2.0: `__row__` เติมเสมอ แต่ `__selected__` มีเมื่อเปิด cross-filtering; `__highlight` มีเฉพาะ measure เมื่อเปิด cross-highlighting และเปิด supporting field ที่เกี่ยวข้อง (`Highlight value` เป็นค่าเริ่มต้น ส่วน status ปิดโดยค่าเริ่มต้น) | แยกเป็นสามเงื่อนไขอย่างชัดเจน และบอกว่าภาพ 2-12/2-13 เป็นสถานะของโปรเจกต์ตัวอย่าง ไม่ใช่กฎว่าทุกโปรเจกต์จะมีทุกคอลัมน์ ดู [Deneb Dataset](https://deneb.guide/docs/dataset) และ [Cross-Filtering](https://deneb.guide/docs/interactivity-selection) |
| CH03-M03 | [chapter-03.md:142](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-03.md:142), [chapter-03.md:379](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-03.md:379) | ข้อความว่าเทคนิค `sort: {field, op}` “จะกลับมาในบทที่ 5” และตารางที่ระบุว่าใช้ในบท 5 ไม่ตรงกับ `specs/steps/CH05-*` หรือ final spec สเปกจริงใช้ `Plot_Position` แบบ quantitative พร้อม `xAxisSortOrders`, `xAxisValues` และ `labelExpr` ไม่พบ encoding property `"sort"` นอกจากนี้ตารางกล่าวถึง `transform filter` เฉพาะบท 5 แต่ `calculate` ถูกใช้หลายครั้งในบท 7 สำหรับ Variance, tooltip และ labels | เปลี่ยนเป็นว่าแนวคิดการจัดลำดับด้วย `Sort_Order` กลับมาใช้ในบท 5 แต่ final chart ใช้วิธีแกน quantitative/lookup ไม่ได้ใช้ `sort: {field, op}` โดยตรง แยกแถวตารางเป็น `transform.filter — บท 5–8` และ `transform.calculate — บท 7` หรือแจกแจงตามสเปกจริง |
| CH03-M04 | caption ภาพ 3-2 ถึง 3-9 เช่น [chapter-03.md:103](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-03.md:103)–[chapter-03.md:358](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-03.md:358) | มีเพียง caption ภาพ 3-1 ที่ระบุโดยตรงว่า “ไม่ใช่ภาพหน้าจอ Power BI” ภาพอื่นระบุเพียง “render ด้วย Vega-Lite 6.4.3” แม้หมายเหตุต้นบทจะครอบคลุมทั้งหมด แต่ยังไม่ผ่านกฎที่กำหนดว่า caption ต้องระบุชัด | เติมข้อความมาตรฐานใน caption ทุกภาพ เช่น “render ด้วย Vega-Lite 6.4.3; ไม่ใช่ภาพหน้าจอ Power BI” |

### สิ่งที่ตรวจแล้วถูกต้อง

- `mark`, `encoding`, `field/type`, `scale.domain`, `axis`, `layer`, ลำดับ `transform`, `calculate`, `filter`, `condition` และ `params` ใช้ syntax และอธิบายหลักการถูกต้องตามเอกสารทางการ [Vega-Lite specification](https://vega.github.io/vega-lite/docs/spec.html), [layer](https://vega.github.io/vega-lite/docs/layer.html), [transform](https://vega.github.io/vega-lite/docs/transform.html), [condition](https://vega.github.io/vega-lite/docs/condition.html)
- `sort: {"field":"Sort_Order","op":"min"}` ถูกต้อง: เป็นการ aggregate ค่า sort ต่อแต่ละ Category ก่อนเรียง
- selection ว่างถือว่าเลือกทุก datum โดย default จึงได้ opacity 1 ทุกแท่ง ถูกต้องตาม [Vega-Lite Parameters](https://vega.github.io/vega-lite/docs/parameter.html)
- ข้อความเรื่อง Vega-Lite selection ไม่ได้ส่งสถานะไปยัง Visual อื่นด้วยตัวมันเอง ถูกต้องและไม่ overclaim เมื่ออ่านว่า “parameter ตัวนี้เป็น interaction ภายใน view” การส่ง cross-filter ไป Power BI ต้องอาศัย Deneb bridge และการตั้งค่า Project setup อย่างไรก็ตามควรคงถ้อยคำว่า “ไม่ได้ส่งด้วย `params` เอง” เพื่อไม่ให้เข้าใจว่า Vega-Lite mark ไม่สามารถเป็นจุดคลิกให้ Deneb Simple mode resolve ได้
- ตัวเลขจาก CSV ถูกต้อง: 12 เดือน, กรอง ธ.ค. เหลือ 11 แท่ง, `Actual >= Reference` เป็นเขียว 7/ส้ม 5 และ target = 500
- ภาพที่สุ่มตรวจ ได้แก่ 3-6, 3-7 และ 3-8 ตรงกับข้อความและตัวเลข
- เลขอ้างภาพ 2-12, 2-13 และ 2-17 ตรงกับบทที่ 2; ภาพ 3-1 ถึง 3-9 เรียงต่อเนื่องและไฟล์มีครบ
- naming `CH03-S02` … `CH03-S09-*` ใช้ได้ แม้บทนี้ไม่มี Step เพราะ mapping กับหัวข้อชัดเจน และสองภาพใน 3.9 แยก slug ไม่ชนกัน

### Optional improvements

- [chapter-03.md:254](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-03.md:254): ประโยค “channel ที่รับค่าคงที่…รับ `condition` ได้” ถูกในขอบเขตตัวอย่าง แต่แคบกว่าภาษาจริง เพราะ condition รองรับ conditional field/datum definition ด้วย อาจเขียนว่า “encoding channel หลายชนิด เช่น color, opacity, size, text และ tooltip ใช้ `condition` เลือกระหว่าง value/datum/field ได้”
- [chapter-03.md:291](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-03.md:291): เปลี่ยน “อ้างถึงในนิพจน์ด้วย `{expr}`” เป็น “อ้างชื่อ parameter ภายใน expression; เมื่อ property ต้องการ expression reference เขียนเป็น `{expr: "target"}`” จะไม่ทำให้เข้าใจว่า parameter ใช้ได้เฉพาะรูป object นี้
- [chapter-03.md:360](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-03.md:360): แยก cross-filter กับ cross-highlight ในวงเล็บให้แม่นขึ้น—`__selected__` เป็นของ cross-filter ส่วน `<measure>__highlight`/`__highlightStatus` เป็นของ cross-highlight
- ในภาพ 3-6 ถึง 3-8 ป้ายชื่อเดือนถูก Vega-Lite หมุนอัตโนมัติ ซึ่งไม่ขัดกับข้อความ แต่ถ้าต้องการความอ่านง่ายสม่ำเสมอ อาจใส่ `axis: {"labelAngle": 0}` หรือระบุว่าเป็นพฤติกรรม auto-layout ของตัวอย่าง
- ผล `65 ผ่าน` เป็นหลักฐานที่ดี แต่ควรหลีกเลี่ยงการให้ “ไม่มี `$schema`” เป็นคุณสมบัติความถูกต้องทั่วไป เพราะไฟล์ workshop/final นอก Deneb มี `$schema` อย่างถูกต้องเช่นกัน

### คำถามที่ต้องรอหลักฐานจากผู้ใช้

1. เมื่อนำตัวอย่างไปวางใน Deneb Editor จริง หลังผูก `Category`, `Sort_Order`, `Actual`, `Reference` และ Rename for this visual แล้ว ได้ 12 แถวและชื่อ field ตรงหรือไม่
2. ตัวอย่าง hover ใน Deneb จริงให้แท่งที่ชี้ opacity 1 และแท่งอื่น 0.4 แล้วคืนเป็น 1 ทั้งหมดเมื่อ `pointerout` หรือไม่

สองข้อนี้ไม่ทำให้เนื้อหา Vega-Lite ถูกบล็อก เพราะบทติดป้าย `NOT TESTED` ไว้ตรงไปตรงมาแล้ว แต่ยังต้องมีหลักฐานก่อนเปลี่ยนข้อความเป็นคำรับรองว่า “วางใน Deneb แล้วทำงานได้จริง”