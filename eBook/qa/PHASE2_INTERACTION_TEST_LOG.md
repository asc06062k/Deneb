# Phase 2 Interaction and Responsive Test Log

วันที่ 21 กันยายน 2026 | Evidence: ภาพที่ผู้ใช้ส่ง 4 ภาพ

หมายเหตุการวัด: ช่อง Power BI แสดง `Height` ก่อน `Width` แต่ Test Matrix นิยามขนาดเป็น `Width × Height`. ภาพชุดล่าสุดใช้ขนาดมาตรฐานถูกต้องแล้ว

## Interaction

| Test | ผล | หลักฐาน/ข้อสรุป |
| --- | --- | --- |
| T14 Filter จาก slicer/visual | PASS | ผู้ใช้ยืนยันว่าการ filter เปลี่ยนจำนวนแถวและค่าของ Deneb ตาม filter context |
| T15 คลิกแถว Deneb → visual อื่น | PASS | ผู้ใช้ยืนยันว่า Deneb cross-filter ไป visual อื่นได้ตาม `KPI_ID` |
| T16 Visual อื่น → Deneb cross-highlight | PASS | ภาพล่าสุดแสดง bar สีจางเป็นค่าเดิมและ bar สีเข้มเป็นค่า `Actual Value__highlight` จาก Table ที่เลือก; Project setup เปิด expose cross-highlight แล้ว |

การแก้ T16 ต้องทำสองส่วน: เปิด Deneb Project setup ให้ expose cross-highlight values for measures และเพิ่ม highlight layer ที่ใช้ field companion ของ Actual โดยเก็บ base Actual ไว้เป็นบริบท. ต้องทดสอบซ้ำหลัง field ปรากฏใน Data Pane; ห้ามเดาว่าชื่อ field ใช้ได้จนกว่าจะตรวจจริง

Evidence update: ภาพล่าสุดยืนยันว่าเปิด setting แล้ว และ Data Pane แสดง `Actual Value__highlight` จริง (ค่า `null` ในสถานะไม่มี active highlight). จึงเพิ่ม highlight layer ใน `Bullet_Chart_Prototype_Normalized.json`; layer จะกรองค่า null, ทำให้ base Actual จางลง และวาด highlighted Actual ซ้อนเมื่อ Power BI ส่งค่า highlight มา

## Responsive sizes

| Test | ขนาด | ผล | หลักฐาน/ข้อสรุป |
| --- | --- | --- | --- |
| T17 | Width=320, Height=240 | PENDING SCROLL | ขนาดถูกต้องแล้ว แต่ภาพแสดงเพียงบางแถว; ต้อง scroll และยืนยันว่าแถวสุดท้ายมี bar/marker/status ครบ |
| T17 | Width=640, Height=480 | PASS (visible) | ทุกแถวและ marker หลักอ่านได้ในภาพที่ส่ง; tooltip/scroll ยังต้องตรวจด้วยการคลิกจริง |
| T17 | Width=960, Height=600 | PASS (visible) | ทุกแถวและ marker หลักอ่านได้ในภาพที่ส่ง; tooltip/scroll ยังต้องตรวจด้วยการคลิกจริง |

เกณฑ์ T17 กำหนดให้ทุกขนาดในชุดทดสอบผ่าน ดังนั้น T17 รวมเป็น **PENDING** จนกว่าจะ scroll ที่ 320×240 ถึงแถวสุดท้ายและยืนยัน tooltip/scroll ที่ขนาดอื่น

## สถานะ Phase 2 Gate

Static render: ผ่านสำหรับ fixtures ที่เห็นในภาพ

T14/T15: ผ่าน

T16: ผ่าน

T17: รอหลักฐาน scroll/tooltip ที่ 320×240 และตรวจซ้ำที่ขนาดอื่น

T18/T19 และ performance: ยังไม่มีหลักฐาน
