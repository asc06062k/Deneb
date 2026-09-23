# Phase 2 review request รอบ 3 (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของงาน Phase 2 (Dataset และ Vega-Lite Prototype) ของโครงการ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb — นี่คือรอบที่ 3 หลังจากรอบที่ 2 ได้ Verdict `REVISE` พร้อม Mandatory findings M-09 (ชื่อ field ผิด) และ M-10 (QA log overclaim) ใน [`PHASE2_CODEX_VERDICT_R2.md`](../qa/PHASE2_CODEX_VERDICT_R2.md) — อ้างอิง `PROJECT_PLAN.md` และ `review/PHASE1_DESIGN_PLAN.md` เป็น Source of truth เช่นเดิม

## การแก้ไขในรอบนี้

1. **M-09**: เปลี่ยนชื่อ field ใน opacity `condition.test` ของ layer `line_actual`, `line_reference`, `point_reference`, `point_actual_hit_target` ในทั้ง `specs/dual-line-variance-final.vl.json` และ `specs/dual-line-variance-static-test.vl.json` จาก `Plot_Actual__highlightStatus`/`Plot_Reference__highlightStatus` เป็น `Actual__highlightStatus`/`Reference__highlightStatus` ให้ตรงกับ Supporting Field ที่ Lock ไว้จริงใน `PROJECT_PLAN.md` บรรทัด 85 (`[Actual]__highlight`/`[Actual]__highlightStatus`/`[Reference]__highlight`/`[Reference]__highlightStatus`)
2. **M-10**: แก้ `qa/PHASE2_STATIC_TEST_LOG.md` ให้ระบุสถานะตรงความจริง — "M-01 ถึง M-04 verified ที่ระดับ static/render; M-05 แก้ชื่อ field ตาม M-09 แล้วแต่ยังเป็น [POWERBI-NOT-TESTED] รอ Deneb dataset inspector จริงยืนยันชื่อ field ที่ Deneb สร้างขึ้นจริง (T19)" ไม่อ้างว่าปิดสมบูรณ์แล้ว
3. **การเปลี่ยนแปลงเพิ่มเติมนอกเหนือจาก M-09/M-10 (ตามคำขอผู้ใช้เรื่อง Style)**: เพิ่ม `"interpolate": "monotone"` บน mark ของ layer `line_actual` และ `line_reference` ในทั้งสอง spec ให้เส้นโค้งมนสวยงามขึ้น **โดยตั้งใจไม่แตะ** `variance_area`, `bad_area_border_actual`, `bad_area_border_reference`, `connector_rule` — สี่ layer นี้ยังคงเป็นเส้นตรง (`interpolate` default/linear) เพราะพื้นที่สี Good/Bad คำนวณจุดตัด (Crossing) แบบ pixel-accurate บนสมมติฐานเส้นตรงระหว่างจุดตาม Design Lock Phase 1 หัวข้อ 2.0 — `monotone` เป็นเส้นโค้งแบบ interpolating (ผ่านจุดข้อมูลจริงทุกจุดเป๊ะ ไม่ overshoot เหมือน `basis`) ยืนยันด้วยการ render จริงแล้วว่า path ของ `line_actual` ใช้ command `C` (cubic Bezier) จริง ขณะที่ `variance_area` ยังใช้ `L` (straight line) เหมือนเดิม ไม่มี compile error ใหม่เกิดขึ้น

## ขอให้ตรวจประเด็นต่อไปนี้เป็นหลัก

1. ตรวจว่าชื่อ field ที่แก้ตาม M-09 ถูกต้องครบทุกตำแหน่งในทั้งสอง spec (ไม่มี `Plot_Actual__highlightStatus`/`Plot_Reference__highlightStatus` หลงเหลือ)
2. ตรวจว่า `qa/PHASE2_STATIC_TEST_LOG.md` ที่แก้ตาม M-10 ไม่มีคำอ้างเกินหลักฐานหลงเหลือ
3. ตรวจว่าการเพิ่ม `interpolate: monotone` ไม่ได้ทำให้เกิดความขัดแย้งใหม่กับ Design Lock หรือ Test matrix ใดๆ (เช่น T-code ที่อ้างตำแหน่งเส้นตรงระหว่างจุด) และไม่ได้ถูกใส่ผิด layer (ต้องอยู่แค่ `line_actual`/`line_reference` เท่านั้น ไม่ใช่ layer ที่เกี่ยวกับ Area/Border/Connector)
4. ความเสี่ยงหรือ gap อื่นที่ควรแก้ก่อนพิจารณาว่า "ส่วน static ของ Phase 2" พร้อมส่งต่อให้ผู้ใช้ทดสอบจริงบน Power BI

## ข้อจำกัดที่ต้องรู้ก่อนรีวิว (เหมือนรอบก่อน)

- ส่วน static นี้ **ไม่ใช่ Phase 2 ที่ PASS สมบูรณ์** — Phase 2 ข้อ 5-7 ของ `PROJECT_PLAN.md` ยังต้องให้ผู้ใช้ทดสอบบน Power BI Desktop + Deneb จริงก่อน
- ห้าม PASS ส่วน static นี้ถ้ามี Mandatory finding ที่กระทบความถูกต้องของ M code หรือ Vega-Lite spec

ตอบกลับในรูปแบบเดิม: Verdict (PASS/REVISE/BLOCKED สำหรับส่วน static เท่านั้น), Mandatory findings (ตาราง), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้
