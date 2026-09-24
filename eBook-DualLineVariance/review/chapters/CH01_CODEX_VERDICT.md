## Verdict: REVISE

บทที่ 1 ครบตามโครงสร้างที่กำหนด อ่านง่าย และสอดคล้องกับ spec/หลักฐาน Phase 2 เกือบทั้งหมด แต่ยังมี Mandatory findings 2 ข้อเกี่ยวกับภาพจริงและข้อจำกัดสำคัญ จึงยังให้ PASS ไม่ได้

## Mandatory findings

| ID | ระดับ | ตำแหน่ง | ข้อค้นพบ | สิ่งที่ต้องแก้ |
|---|---|---|---|---|
| M-01 | Mandatory | [chapter-01.md:107](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-01.md:107), ภาพ 1-1 | Alt text เรียกภาพนี้ว่า “ทำเสร็จแล้ว” และ caption ไม่ระบุว่าเป็นภาพจาก spec rev 5 ทั้งที่ spec ปัจจุบันคือ rev 7 นอกจากนี้ไฟล์ภาพมีความละเอียดจริง 556×318 px ไม่ใช่ 800×450 px ตาม caption; `800×450` เป็นขนาด viewport/test scenario ต้นทาง ไม่ใช่ขนาดไฟล์ภาพ | ระบุให้ตรงไปตรงมาว่าเป็นภาพจริงที่บันทึกระหว่างทดสอบ **spec rev 5**, ขนาด Visual ที่ทดสอบ 800×450 แต่ภาพถูก crop/ลดความละเอียดเหลือ 556×318 และอาจต่างจาก rev 7 ในส่วนแกน X หรือเปลี่ยนเป็นภาพจริงจาก rev 7 ก่อนเรียกว่า “ฉบับเสร็จแล้ว” |
| M-02 | Mandatory | [chapter-01.md:139](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-01.md:139) | รายการข้อจำกัดยังไม่ครอบคลุม Design Lock 2.3/2.5: เทคนิคแบ่งสีตรงจุดตัดไม่รองรับหน้าที่มี Slicer/Filter ตัด Category แบบ interactive เพราะ crossing rows คำนวณตอน Power Query refresh และอาจเกิดพื้นที่ค้าง รวมถึงรองรับเฉพาะ linear Y scale ไม่ใช่ log/non-linear scale คำว่า “ต้องเตรียมด้วย Power Query” เพียงอย่างเดียวยังไม่เตือนผลกระทบเหล่านี้ | ขยายข้อ 3 หรือเพิ่มข้อจำกัดแยก โดยระบุ (1) ไม่ใช้กับ Slicer/Filter ที่ตัด Category ของ Visual แบบ interactive และชี้ไปบท 9 สำหรับ fallback แบบทาสีทั้งช่วง (2) จุดตัดคำนวณใน linear value space เท่านั้น หากใช้ log/non-linear scale ตำแหน่งแบ่งสีจะไม่ถูกต้อง |

## Optional improvements

- [chapter-01.md:129](D:/DATA/Deneb/eBook-DualLineVariance/manuscript/chapter-01.md:129): แยกคำให้ชัดว่า “คลิก Deneb เพื่อส่ง cross-filter” ส่วน Visual ปลายทางอาจแสดงผลเป็น filter หรือ highlight ตาม `Edit interactions` ของ Power BI เพื่อลดความสับสนกับหัวข้อ Cross-highlighting ถัดไป
- ตารางเปรียบเทียบควรลดถ้อยคำกว้างว่า Custom Visual “ทำได้ทุกอย่างที่เขียนโค้ดได้” และ Deneb “ทำได้ทุกอย่างที่ Vega/Vega-Lite บรรยายได้” โดยเติมเงื่อนไขว่าความสามารถยังอยู่ภายใต้ sandbox, certification และ Power BI Custom Visual API
- แถวประวัติ 1.0.0 ควรบอกชนิดวันที่ให้ชัด เช่น “เผยแพร่ GitHub release วันที่ 24 พ.ย. 2021” เพราะเอกสาร changelog รุ่นเก่าระบุวันที่ 13 พ.ย. 2021 ต่างกัน อาจเป็นวันที่ build/changelog กับวันที่เผยแพร่ release
- Caption ภาพ 1-2 ผ่านเกณฑ์แล้ว: ระบุชัดว่าเป็นแผนผัง ไม่ใช่ภาพหน้าจอจริง, อ้าง spec ฉบับสุดท้าย และชื่อไฟล์เป็นไปตาม `CHxx-Syy-*`
- การไม่มี Step ปฏิบัติในบทนี้เหมาะสม เพราะเป็นบทปูพื้น มาตรฐาน 12 หัวข้อใช้เฉพาะเมื่อมี Step
- เนื้อหาครบทั้ง Deneb คืออะไร, ความสัมพันธ์ Vega/Vega-Lite, ประวัติ, การเปรียบเทียบ Native/Custom และภาพรวม Visual ปลายทาง
- ข้อเท็จจริงหลักเรื่อง Deneb 2.0.0, Vega 6.4.0, Vega-Lite 6.4.3, rewritten pipeline และ Continuous view ตรงกับ [Deneb changelog](https://deneb.guide/docs/changelog) ส่วน AppSource certification และข้อจำกัด remote images ตรงกับ [Getting Started](https://deneb.guide/docs/getting-started) และ [Enterprise FAQ](https://deneb.guide/enterprise)
- คำอธิบาย Vega-Lite ว่าเป็น high-level grammar และ compile เป็น Vega ถูกต้องตาม [Vega-Lite documentation](https://vega.github.io/vega-lite/docs/) ปุ่ม Show compiled Vega ที่ status bar ก็ตรงกับ [Visual Editor documentation](https://deneb.guide/docs/visual-editor)

## คำถาม/หลักฐานที่ต้องรอจากผู้ใช้

1. ขอภาพ About หรือหลักฐานเทียบเท่าที่เห็น `Daniel Marsh-Patrick`, Deneb `2.0.0.0`, Power BI Desktop `2.157.1354.0` และ Vega-Lite `6.4.3` เพื่อรองรับข้อความในตารางข้อเท็จจริงและ caption ภาพ 1-1; ขณะนี้รายการเหล่านี้ยังไม่ยืนยันจากไฟล์หลักฐานที่พบใน repository
2. ต้องการคงภาพจริง rev 5 ไว้พร้อม disclosure ชัดเจน หรือจะถ่ายภาพ 1-1 ใหม่จาก spec rev 7? ทางเลือกหลังเหมาะกว่าเพราะภาพถูกนำเสนอเป็น Visual ปลายทางของเล่ม
3. วันที่ Deneb 1.0.0 ต้องการยึด GitHub release API วันที่ 24 พ.ย. 2021 หรือ changelog วันที่ 13 พ.ย. 2021 ควรบันทึกหลักฐานและนิยามวันที่ที่เลือกไว้เพื่อไม่ให้ผู้อ่านเห็นข้อมูลขัดกันภายหลัง