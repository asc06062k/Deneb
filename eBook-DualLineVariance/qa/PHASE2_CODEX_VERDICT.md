## 1. Verdict: REVISE

สำหรับ “ส่วน static ของ Phase 2” เท่านั้น

อัลกอริทึม per-segment และชุดข้อมูล Workshop ถูกต้องเป็นส่วนใหญ่: ผมรันชุดทดสอบซ้ำได้ผล 50/50 หลังปิดเฉพาะขั้นตอนเขียนไฟล์ที่ติดข้อจำกัด read-only และยืนยันได้ว่า Workshop มี 12 เดือน, strict crossing 9 segment, diff=0 หนึ่งจุด, Fill 40 แถว และรวม 52 แถว

อย่างไรก็ตาม ยังมี Mandatory findings ใน Vega-Lite spec, ความเท่าเทียมระหว่าง JS กับ M, test coverage และ evidence record จึงยังไม่ควรส่ง spec ปัจจุบันให้ผู้ใช้ทดสอบใน Power BI

## 2. Mandatory findings

| ID | ความรุนแรง | ไฟล์/บรรทัด | ปัญหา | เหตุผล/หลักฐาน | ข้อเสนอแก้ไข |
|---|---|---|---|---|---|
| M-01 | High | [dual-line-variance-final.vl.json:7](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:7) | Final spec ระบุ `"data": {"name":"dataset","values":[]}` | ไฟล์นี้ถูกสั่งให้ผู้ใช้ paste เข้า Deneb แต่ `values: []` ทำให้มีความเสี่ยงสูงว่า inline data ว่างจะทับ/ขัดกับ named dataset; ตอนทดสอบ Editor ต้องฉีด values ใหม่จึง render ได้ ดังนั้นไฟล์บน disk ยังไม่ใช่ Deneb-ready artifact ที่ถูกทดสอบตรงตัว | Final Deneb spec ต้องใช้ `"data":{"name":"dataset"}` เท่านั้น แยก static fixture/spec ที่ฝัง `values` เป็นอีกไฟล์ และ render-test final artifact หลังการแยก |
| M-02 | High | [dual-line-variance-final.vl.json:4](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:4), [dual-line-variance-final.vl.json:5](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:5), label layersช่วงบรรทัด 120–160; เทียบ [PHASE1_DESIGN_PLAN.md:238](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:238) | ไม่มี data-label thinning algorithm และความสูง fix ที่ `320` | Design Lock กำหนดให้ port `computeThinningStep` เป็น Vega expression ที่คำนวณจาก `width` signal และ re-evaluate ตอน resize แต่ spec แสดง label ครบทุกจุดเสมอ ไม่มี filter/thinning ใด ๆ ขณะที่ T26 คาดหวังพฤติกรรมนี้ ความสูงคงที่ยังไม่รองรับ viewport 280×180/1200×220 ตามที่อ้าง | Implement thinning/filter สำหรับ label_actual และ label_reference ตามสูตรที่ Lock และพิจารณา `height:"container"` หรือกลไกที่พิสูจน์ได้ว่าปรับตามความสูงจริง |
| M-03 | High | [dual-line-variance-final.vl.json:47](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:47); เทียบ [PHASE1_DESIGN_PLAN.md:167](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:167) | Connector ไม่มี `tooltip:null` | Design Lock กำหนดว่า Point hit-target เป็น layer เดียวที่มี tooltip; Connector/rule ไม่ควรแสดง tooltip เพื่อให้ ownership ชัด แต่ connector ใช้เพียง `"mark":{"type":"rule"}` | เพิ่ม `"tooltip":null` ให้ Connector และตรวจทุก non-hit-target layer อีกครั้ง ส่วนการไม่ใช้ `interactive:false` ถูกต้องแล้ว |
| M-04 | High | Tooltip ของ point ที่ [dual-line-variance-final.vl.json](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json); test ที่ [run-phase2-static-tests.mjs:86](D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/run-phase2-static-tests.mjs:86) โดยประมาณ | Tooltip ไม่มี Variance และ Variance % แต่ log อ้าง T07/T28 ผ่าน | Spec มีเพียง Category, Actual, Reference ขณะที่ Source of truth กำหนด Variance และ Variance % พร้อมข้อความแทนเปอร์เซ็นต์เมื่อ Reference=0 การทดสอบ T07/T28 ทดสอบ helper function แยกต่างหากซึ่งไม่ได้ถูกใช้ใน Vega-Lite spec จึงไม่ได้พิสูจน์ tooltip จริง | เพิ่ม calculate transforms/tooltip fields สำหรับ Variance และ Variance %, guard Reference=0 ด้วยข้อความตาม Design Lock และทดสอบ compiled/rendered tooltip จริง |
| M-05 | High | [dual-line-variance-final.vl.json](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json), [PHASE2_EVIDENCE_RECORD_TEMPLATE.md:49](D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:49) | Spec ยังไม่มี cross-highlight encoding | T19 คาดว่าจุดที่ไม่ถูกเลือกจะจางลงตาม highlight fields แต่ไม่มี encoding ที่อ้าง `__highlight` หรือ `__highlightStatus` จึงไม่มี implementation ให้ Power BI ทดสอบ และจะ fail ตาม expected behavior | เพิ่ม Supporting-field encodings/opacity logic ตาม Design Lock ก่อนส่งให้ผู้ใช้ทำ T19 แล้วทดสอบ fallback เมื่อ highlight fields เป็น neutral/ไม่มีค่า |
| M-06 | High | [DualLine_PlotData_PowerQuery.pq:46](D:/DATA/Deneb/eBook-DualLineVariance/specs/DualLine_PlotData_PowerQuery.pq:46), [plotdata-algorithm.mjs](D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/plotdata-algorithm.mjs) | JS กับ M ไม่เท่ากันเรื่อง Settings cardinality และ QA behavior | M อ่านแถว `{0}` โดยตรง: zero-row จะ error แบบทั่วไป ส่วนหลายแถวจะเลือกแถวแรกเงียบ ๆ แม้ contract ระบุ exactly 1 row; JS ไม่มีแนวคิด settings table จึงไม่ทดสอบกรณีนี้ นอกจากนี้ JS T24 เพียงรายงาน duplicate แต่ M throw error | เพิ่ม guard `Table.RowCount(Settings)=1` พร้อม Error.Record ที่ชัดเจน และเพิ่ม reference tests สำหรับ zero/multiple Settings rows หรือระบุ gap อย่างตรงไปตรงมา |
| M-07 | Medium | [PHASE2_EVIDENCE_RECORD_TEMPLATE.md:137](D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:137), [PHASE2_EVIDENCE_RECORD_TEMPLATE.md:174](D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md:174) | Evidence template ยังไม่ครอบคลุม Test ID/กรณีครบตาม Lock | T34/T35 ปรากฏเฉพาะในหัวข้อและขนาด viewport แต่ไม่มีช่อง `Test ID`, Actual/evidence/result แยก; T14–T17 ไม่มี record โดยตรง แม้ Static Log อ้างว่าครบ T14–T23 นอกจากนี้ T29/T33 ใช้เฉพาะ strict-crossing Case B แต่ Design Plan กำหนดให้ทดสอบทั้ง Case B และ Case C อย่างน้อยอย่างละหนึ่งตัวอย่าง | ทำ record แยก T14–T17/T34/T35 หรือ matrix ที่มี Test ID, Actual, evidence, result ต่อขนาด; เพิ่ม Case C ใน T29 และ T33 |
| M-08 | Medium | [PHASE2_STATIC_TEST_LOG.md:11](D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_STATIC_TEST_LOG.md:11), [PHASE2_STATIC_TEST_LOG.md:34](D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_STATIC_TEST_LOG.md:34), [PHASE2_STATIC_TEST_LOG.md:61](D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_STATIC_TEST_LOG.md:61) | Log overclaims บางส่วน | 50/50 พิสูจน์ JS reference เท่านั้น ไม่ได้พิสูจน์ M; T28 ไม่ได้ทดสอบ spec tooltip; SVG snapshot รองรับผล default Business_Type แต่ไม่สามารถเป็นหลักฐานของการ toggle `"Lower is Good"` ได้ด้วยตัวมันเอง และข้อความ “template ครอบคลุม T14–T23…” ไม่ตรงกับ template | แยกสถานะเป็น JS verified / Vega rendered / M not compiled / Power BI not tested; เก็บ artifact หรือ DOM dump สำหรับ Lower-is-Good แยก และแก้ claim เรื่อง coverage |

## ผลตรวจ M code โดยตรง

ส่วนอัลกอริทึม A/B/C สอดคล้องกับ Design Plan:

- Case A: `d0=0 && d1=0` ให้ศูนย์ fill rows
- Case B: strict crossing ให้ Boundary/Crossing สอง polygon รวม 4 แถว
- Case C: same sign หรือข้างหนึ่งเป็นศูนย์ ให้ 2 Boundary rows
- `Filter_Key` ของ fill rows ทั้ง Case B และ C ผูกกับ `a[Category]` ทุกแถวจริง ที่ [บรรทัด 103–127](D:/DATA/Deneb/eBook-DualLineVariance/specs/DualLine_PlotData_PowerQuery.pq:103)
- Boundary ใช้ `a/b[Reference]` จริง ไม่ได้ใช้ `Plot_Actual` ที่ [บรรทัด 102, 111, 123, 126](D:/DATA/Deneb/eBook-DualLineVariance/specs/DualLine_PlotData_PowerQuery.pq:102)
- Crossing เท่านั้นที่ตั้ง `Plot_Actual=Plot_Reference=val`
- รูปแบบ `List.Generate` accumulator และ `Table.FromRecords(..., type table [...])` ไม่พบ syntax defect จาก static inspection

อย่างไรก็ดี ยังไม่ควรรับรองว่า M “compile ผ่านจริง” จนกว่าจะ paste และ Refresh ใน Power Query Editor เพราะรอบนี้ไม่มี M engine ให้ compile โดยตรง

## 3. Optional improvements

- เปลี่ยน path แบบ absolute ใน [run-phase2-static-tests.mjs](D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/run-phase2-static-tests.mjs) ให้ resolve จาก `import.meta.url` เพื่อรันจาก checkout อื่นได้
- แยก test กับ export ออกจากกัน หรือเพิ่ม `--no-write`; ปัจจุบัน test ผ่านครบแล้วแต่ process จบด้วย `EPERM` ใน read-only environment ก่อนพิมพ์สรุป
- ให้ JS throw duplicate Category เหมือน M หรือมี test ยืนยันทั้ง “ตรวจพบ” และ “reject” เพื่อไม่ให้ T24 ดูเหมือน behavior เท่ากันทั้งสอง implementation
- เพิ่ม guard สำหรับ duplicate/invalid `Sort_Order`, null Category และ non-numeric Actual/Reference
- สี Reference กับ Bad-fill ใกล้กันตามที่ log ระบุ ควรแก้ก่อนจัดทำบทจริง
- เก็บ compiled Vega/Vega-Lite version, DOM dump และ hash ของ spec/data คู่กับ SVG เพื่อให้หลักฐานทำซ้ำได้

## 4. คำถามที่ต้องรอหลักฐานจากผู้ใช้บน Power BI จริง

หลังแก้ Mandatory findings แล้ว ยังต้องรอผลดังนี้:

1. M query paste/compile/refresh ผ่านจริงหรือไม่ และได้ 52 แถวตาม expected
2. T18: Point click filter ถูก Category หรือไม่ และ Area click ส่ง filter อะไรออกไป
3. T22: right-click Point resolve ถูกแถวหรือไม่ และ Area resolve ผิด Category หรือไม่
4. T19–T21: Highlight/Filter/None ทำงานตรงกับ spec หลังเพิ่ม highlight encoding หรือไม่
5. T23: Deneb dataset มี 52 แถวโดยไม่ aggregate/group เพิ่ม
6. T14–T17/T25/T26/T34/T35: axis และ data-label thinning ตอบสนองจริงในทั้งหก viewport รวม T09/T10
7. T27: Template export/import รักษา field mapping และแสดงข้อจำกัด crossing/label mapping ตามเอกสาร
8. T29/T33: ผล filter ฝั่งซ้าย/ขวาตรง expected ทั้ง Case B และ Case C
9. T30: ชื่อและตำแหน่ง UI ใน Power BI Desktop/Deneb เวอร์ชันจริงตรงกับเอกสารหรือไม่

สรุปคือ core crossing algorithm และ Workshop dataset ใช้ได้ แต่ final Vega-Lite artifact กับ evidence package ยังมีช่องว่างที่ทำให้การส่งต่อไปทดสอบ Power BI ตอนนี้มีแนวโน้ม fail โดยทราบล่วงหน้า จึงเป็น `REVISE` ไม่ใช่ `PASS` หรือ `BLOCKED` ครับ