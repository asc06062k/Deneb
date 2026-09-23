## Verdict: REVISE

สำหรับส่วน static เท่านั้น

M-09 และ M-10 ได้รับการแก้ไขครบถ้วน แต่การเพิ่ม `interpolate: "monotone"` ทำให้เส้นที่ผู้ใช้งานมองเห็นไม่สอดคล้องกับพื้นที่ Variance และจุดตัดที่คำนวณแบบเส้นตรง จึงยังไม่สามารถ PASS ส่วน static ได้

## Mandatory findings

| ID | ระดับ | หลักฐาน | Finding | สิ่งที่ต้องแก้ |
|---|---|---|---|---|
| M-11 | High | [final spec:88](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:88), [final spec:101](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:101), [static-test spec:884](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-static-test.vl.json:884), [static-test spec:921](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-static-test.vl.json:921), [QA log:16](D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_STATIC_TEST_LOG.md:16), [PROJECT_PLAN.md:75](D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:75), [PHASE1_DESIGN_PLAN.md:115](D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:115) | เส้น Actual/Reference ใช้ monotone แต่ Area/Bad borders และ crossing rows ยังคำนวณด้วย linear interpolation ทำให้พื้นที่สีไม่ใช่ “พื้นที่ระหว่างสองเส้น” ที่แสดงจริงระหว่าง Category อีกต่อไป จุดตัดของเส้นโค้งสองเส้นอาจเลื่อนจากจุดตัดเชิงเส้น และสี Good/Bad อาจเปลี่ยนด้านไม่ตรงตำแหน่งที่เส้นมองเห็นตัดกัน ปัญหานี้ไม่ใช่เพียงช่องว่างเชิงสไตล์เล็กน้อย และขัดกับ Design Lock เรื่อง crossing/polygon ที่จุดตัดพอดี รวมถึงเจตนาของ T02/T03 | ทางแก้ที่ปลอดภัยคือเอา `interpolate: "monotone"` ออกจาก `line_actual` และ `line_reference` ทั้งสอง spec ให้ทุกองค์ประกอบกลับมาใช้ linear เหมือนกัน หากต้องการคงเส้นโค้ง ต้องออกแบบ Area, borders และวิธีคำนวณ crossing ใหม่ให้สอดคล้องกับเส้น monotone พร้อมเพิ่ม test cases/หลักฐาน pixel-level ซึ่งเป็นการเปลี่ยน Design Lock ที่ใหญ่กว่า |

## ผลตรวจ M-09 และ M-10

- M-09: แก้ถูกต้องครบทั้งสอง spec

  - ไม่พบ `Plot_Actual__highlightStatus` หรือ `Plot_Reference__highlightStatus` ใน spec
  - ทั้งสี่ layer ใช้ `Actual__highlightStatus`/`Reference__highlightStatus` แล้ว ได้แก่ `line_actual`, `line_reference`, `point_reference` และ `point_actual_hit_target`
  - JSON ทั้งสองไฟล์ parse ได้ และโครงสร้าง condition ถูกผูกกับ layer ตามที่ระบุ

- M-10: แก้ถูกต้อง

  - [QA log:51](D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_STATIC_TEST_LOG.md:51) ระบุชัดว่า M-01–M-04 verified เฉพาะระดับ static/render
  - ระบุ M-05 เป็น `[POWERBI-NOT-TESTED]` และรอ dataset inspector/T19
  - ไม่พบการกล่าวอ้างว่า M-05 หรือ Phase 2 ผ่านสมบูรณ์

- ตำแหน่ง `interpolate` ถูกจำกัดไว้เฉพาะ `line_actual`/`line_reference` จริง ไม่ได้หลุดเข้า `variance_area`, bad-area borders หรือ `connector_rule` แต่การแยก interpolation ระหว่างองค์ประกอบเหล่านี้เองคือสาเหตุของ M-11

## Optional improvements

- เพิ่ม structural regression test ที่ยืนยันว่า line, area และ border ใช้ interpolation model เดียวกัน หรือบังคับว่าไม่มี `interpolate` จนกว่าจะรองรับ curved crossing อย่างครบชุด
- หลังแก้ M-11 ให้ render crossing cases T02/T03 ใหม่ และเก็บ SVG/path evidence ใหม่ ไม่ควรอาศัยเพียงการตรวจว่า line มีคำสั่ง `C` และ area มี `L` เพราะหลักฐานนั้นยืนยันความไม่สอดคล้องของ geometry มากกว่ายืนยันความถูกต้อง
- สคริปต์ static test เริ่มทำงานและรายงาน `N=12`, strict crossings 9, total rows 52 ได้ แต่รันจนจบไม่ได้ในสภาพแวดล้อมรีวิวแบบ read-only เพราะสคริปต์พยายามเขียนทับ `qa/scripts/workshop-plotdata.json`

## คำถามที่ต้องรอหลักฐานจากผู้ใช้

- T19: Deneb dataset inspector สร้างชื่อจริงเป็น `Actual__highlightStatus` และ `Reference__highlightStatus` หรือไม่ และ Highlight/Filter/None ให้ opacity ถูกต้องหรือไม่
- T14–T17, T18–T23, T25–T27, T29–T30 และ T33–T35 ตาม Evidence Record โดยเฉพาะ live resize, จำนวนแถว dataset, cross-filter/highlight และ click/right-click บน Area
- M code ต้อง compile จริงใน Power Query Advanced Editor
- ก่อนรอบถัดไปต้องตัดสินใจว่าจะรักษา Design Lock แบบ linear หรือขยาย Design Lock เพื่อรองรับ curved geometry ทั้งชุด; ภายใต้ Design Lock ปัจจุบันควรถอน `monotone` ออกก่อนครับ