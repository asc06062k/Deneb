## Verdict: REVISE — เฉพาะส่วน static

M-01, M-02, M-03, M-04, M-06, M-07 และการแก้เส้นประของพื้นที่ Bad ถูกแก้ตรงประเด็นแล้ว แต่ M-05 ยังอ้างชื่อ supporting fields ไม่ตรง Source of truth จึงยังไม่ควร PASS ส่วน static

## Mandatory findings

| ID | ระดับ | ตำแหน่ง | Finding | สิ่งที่ต้องแก้ |
|---|---|---|---|---|
| M-09 | High | [dual-line-variance-final.vl.json:93](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:93), บรรทัด 116, 129, 147 และไฟล์ static-test ตำแหน่งเดียวกัน | M-05 ใช้ `Plot_Actual__highlightStatus` และ `Plot_Reference__highlightStatus` แต่ Source of truth ระบุให้เปิด Supporting Fields สำหรับ `Actual`/`Reference` และอ้าง `[Actual]__highlightStatus`/`[Reference]__highlightStatus` โดยตรง ([PROJECT_PLAN.md:85](D:/DATA/Deneb/eBook-DualLineVariance/PROJECT_PLAN.md:85)) หาก Deneb สร้างชื่อ field ตาม field ที่เปิด Supporting Field จริง เงื่อนไขปัจจุบันจะเป็น no-op แม้ Power BI ส่ง highlight มาแล้ว—การพิสูจน์ว่า “ไม่มี field แล้ว opacity=1” ยังไม่พิสูจน์กรณีมี highlight | เปลี่ยน expression ทั้งสอง spec ให้ใช้ `datum.Actual__highlightStatus` และ `datum.Reference__highlightStatus` หรือแสดงหลักฐานจาก Deneb dataset inspector ว่า UI สร้างชื่อ `Plot_Actual__highlightStatus` จริง พร้อมปรับ Source of truth ให้ตรงกัน จากนั้นทดสอบ T19 จริง |
| M-10 | Medium | [PHASE2_STATIC_TEST_LOG.md:47](D:/DATA/Deneb/eBook-DualLineVariance/qa/PHASE2_STATIC_TEST_LOG.md:47) | Log ระบุว่า static-test spec แก้ M-01–M-05 ครบแล้ว แต่ M-05 ยังมีข้อขัดแย้งเรื่องชื่อ field ตาม M-09 จึงเป็นคำอ้างเกินหลักฐาน | จนกว่า M-09 จะปิด ให้แก้เป็น “M-01–M-04 verified; M-05 pending Power BI field-name verification” หรือสถานะเทียบเท่าที่ไม่อ้างว่าปิดแล้ว |

## ผลตรวจประเด็นหลัก

- M-01: ผ่าน — final spec ใช้เฉพาะ `{"name":"dataset"}` ที่ [บรรทัด 7](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:7); inline values อยู่ใน static-test แยกต่างหาก
- M-02: ผ่านในขอบเขต static — `width`/`height: "container"`, `autosize.resize:true` และ transform thinning มีจริง แต่ live resize ยังคงต้องรอ T26 ตามที่ log ระบุ
- M-03: ผ่าน — `connector_rule` มี `tooltip:null` ที่ [บรรทัด 64](D:/DATA/Deneb/eBook-DualLineVariance/specs/dual-line-variance-final.vl.json:64)
- M-04: ผ่าน — calculate และ tooltip fields มีครบ รวม guard `Reference=0`
- M-05: ยังไม่ผ่าน ด้วยเหตุผลใน M-09
- M-06: ผ่านการ code review — `SettingsRowCount` และ `SettingsGuard` อยู่ก่อน `BusinessTypeRaw` และก่อนการ stamp จริงที่ [Power Query:46](D:/DATA/Deneb/eBook-DualLineVariance/specs/DualLine_PlotData_PowerQuery.pq:46) โครงสร้าง `if … then error Error.Record(…) else …` ถูกต้อง แต่ยังไม่ใช่หลักฐานว่า compile ใน Power Query แล้ว
- M-07: ผ่าน — มี record แยกสำหรับ T14–T17, T34, T35 และ T29-C/T33-C ครบ
- M-08: ดีขึ้นอย่างมีนัยสำคัญและแยกสถานะชัดเจน ยกเว้น overclaim เรื่อง M-05 ตาม M-10

เงื่อนไขของ `bad_area_border_actual` และ `bad_area_border_reference` เป็น complement ของเงื่อนไข Good ใน `variance_area` ถูกต้อง และ `detail: Segment_ID` ป้องกันเส้นเชื่อมข้าม segment ทั้งสอง spec ใช้ตรรกะเดียวกัน จึงแสดงเฉพาะ Bad segment ตาม contract ที่ `Business_Type` ถูก normalize แล้ว

## Optional improvements

- ใช้ row index/window rank สำหรับ thinning แทน `(Sort_Order - 1) % labelStep` เพื่อไม่ผูกกับสมมติฐานว่า `Sort_Order` เริ่มที่ 1 และต่อเนื่องเสมอ
- เก็บ DOM/SVG หรือข้อความ console หลังเพิ่ม border layerเป็น artifact ใหม่ เพราะ SVG ที่อ้างอยู่เป็นภาพก่อนแก้
- เพิ่ม parity test อัตโนมัติว่า final spec และ static-test spec เหมือนกันทุกส่วน ยกเว้น `data.values`
- เพิ่ม static assertion ตรวจชื่อ supporting fields ที่ใช้ใน spec เทียบกับชื่อที่ล็อกใน `PROJECT_PLAN.md`
- Test harness พยายามเขียน `workshop-plotdata.json` ทำให้ผม rerun ไม่จบในสภาพแวดล้อม read-only แม้คำนวณ summary ได้แล้ว ควรมีโหมด `--no-write` สำหรับ reviewer

## คำถาม/หลักฐานที่ต้องรอจากผู้ใช้

- Power Query query compile และ refresh สำเร็จ รวม Settings 0, 1 และมากกว่า 1 row
- Deneb dataset inspector แสดงชื่อ highlight fields จริงว่าเป็น `Actual__highlightStatus`/`Reference__highlightStatus` หรือชื่ออื่น
- T19 หลังแก้ชื่อ field: Highlight/Filter/None ให้ opacity ถูกต้อง
- T14–T17, T34, T35 และ T25/T26 บนการ resize จริง
- T18/T22 สำหรับ click และ right-click บน Area
- T23, T27, T29/T29-C, T30, T33/T33-C และการยืนยัน UI ของ Deneb 2.0.0.0 ตาม Evidence Template

เมื่อแก้ M-09/M-10 แล้ว ส่วน static มีแนวโน้มพร้อมส่งต่อให้ผู้ใช้ทดสอบ Power BI จริง แต่ยังไม่ใช่ Phase 2 PASS สมบูรณ์ครับ