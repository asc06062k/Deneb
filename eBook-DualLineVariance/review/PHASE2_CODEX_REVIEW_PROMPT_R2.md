# Phase 2 review request รอบ 2 (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของงาน Phase 2 (Dataset และ Vega-Lite Prototype) ของโครงการ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb — นี่คือรอบที่ 2 หลังจากรอบแรกได้ Verdict `REVISE` พร้อม Mandatory findings M-01 ถึง M-08 ใน [`PHASE2_CODEX_VERDICT.md`](../qa/PHASE2_CODEX_VERDICT.md) — อ้างอิง `PROJECT_PLAN.md` และ `review/PHASE1_DESIGN_PLAN.md` เป็น Source of truth เช่นเดิม

## สรุปการแก้ไขที่ทำในรอบนี้ (แก้ทุก Mandatory finding จากรอบแรก)

1. **M-01** (`data.name` binding): `specs/dual-line-variance-final.vl.json` ไม่มี inline `values` แล้ว ใช้ `{"data": {"name": "dataset"}}` — ตรวจ `specs/dual-line-variance-static-test.vl.json` แยกไว้สำหรับ static test เท่านั้น
2. **M-02** (responsive: `width`/`height: "container"` + label thinning): เพิ่ม `autosize.resize: true`, เพิ่ม transform chain (`calculate`/`joinaggregate`/`filter`) บน layer `label_actual`/`label_reference` ที่ port สูตร D3 thinning เดิมมาใช้ signal `width` — **ยืนยันแล้วว่า signal `width` เข้าถึงได้และคำนวณถูกตอน initial render (re-render จริงใน Vega Editor เห็น axis label ครบ 12 เดือนถูกต้องที่ viewport กว้าง) แต่ยังไม่สามารถยืนยัน re-evaluate แบบ live ตอน resize จริงในเครื่องมือทดสอบนี้ได้ (ข้อจำกัดของ Vega Editor test harness เอง) — คงเป็นคำถามเปิดที่ต้องพิสูจน์บน Power BI จริง T26 ตามที่ Lock ไว้ ไม่ได้เปลี่ยนสถานะนี้**
3. **M-03** (`connector_rule` tooltip ซ้อน): เพิ่ม `"tooltip": null` แล้ว
4. **M-04** (tooltip ไม่มี Variance): เพิ่ม `calculate` สามตัว (`Variance`, `VarianceLabel`, `VariancePercentLabel` พร้อม guard Reference=0) และ tooltip fields สองตัวใหม่บน `point_actual_hit_target` — **ยืนยันค่าจริงผ่าน `VEGA_DEBUG.view.data()` แล้ว**: ม.ค. (420,400) → Variance=20, VarianceLabel="+20", VariancePercentLabel="+5.0%" ตรงกับคำนวณมือ
5. **M-05** (ไม่มี opacity ตาม highlight): เพิ่ม `opacity` encoding พร้อม `condition.test` บน `line_actual`, `line_reference`, `point_reference`, `point_actual_hit_target` — no-op เป็น opacity 1 เมื่อไม่มี `__highlightStatus` field (ยืนยันจากการ re-render ว่าไม่ throw error และแสดงผลเต็ม opacity ปกติ)
6. **M-06** (Settings row-count guard): เพิ่ม guard `Table.RowCount(DualLineVariance_Settings) = 1` ใน `specs/DualLine_PlotData_PowerQuery.pq` ก่อนอ่าน `Business_Type_Source` — throw `error Error.Record("DualLine.SettingsRowCountInvalid", ...)` ถ้าไม่ตรง
7. **M-07** (Evidence template ไม่ครบ): เพิ่ม block แยกชัดเจนต่อ Test ID สำหรับ T14–T17, T34, T35 (แทนที่การอ้างรวมผ่าน T25/T26 เดิม) และเพิ่ม T29-C/T33-C สำหรับกรณี Case C (ไม่มีจุดตัด) ใน `qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md`
8. **M-08** (QA log overclaim): เขียน `qa/PHASE2_STATIC_TEST_LOG.md` ใหม่ทั้งหมด แยกสถานะ [JS-VERIFIED]/[VEGA-RENDERED]/[M-NOT-COMPILED]/[POWERBI-NOT-TESTED] ชัดเจนทุกรายการ, แก้คำอ้าง T28 เดิม (เคยทดสอบ helper function แยก ไม่ใช่ spec จริง — ตอนนี้ยืนยันด้วย `VEGA_DEBUG` กับ spec จริงแล้ว), เพิ่มหลักฐาน DOM ของ `"Lower is Good"` toggle จริง (สลับสีครบ 10/10), แก้คำอ้าง "template ครอบคลุม T14–T23" ให้ตรงกับสิ่งที่ template มีจริงหลังแก้ M-07

## บั๊กใหม่ที่พบระหว่างแก้ไข (ไม่ได้อยู่ใน M-01–M-08 เดิม แต่พบจากการ re-render จริง)

ระหว่างยืนยันการแก้ M-01–M-05 ด้วยการ render จริงใน Vega-Lite Editor (ไม่ใช่แค่ตรวจ JSON แบบ static) พบว่า **Vega-Lite drop `strokeDash` บน mark `area` เงียบๆ** พร้อม runtime warning `"strokeDash dropped as it is incompatible with area"` ซึ่งหมายความว่า Pattern เส้นขอบสำหรับพื้นที่ Bad ที่ `PHASE1_DESIGN_PLAN.md` หัวข้อ 6.1 ล็อกไว้เป็นตัวช่วยแยก Good/Bad แบบไม่พึ่งสี (สำหรับผู้มีภาวะตาบอดสี เพราะคู่สี teal-700/amber-700 มี contrast ต่อกันแค่ 1.09:1) **ไม่ทำงานจริงในโค้ดฉบับก่อนแก้**

**แก้ไข**: เพิ่ม layer ใหม่ 2 ชั้น `bad_area_border_actual`/`bad_area_border_reference` เป็น mark `line` (รองรับ `strokeDash` จริง) ทาบทับขอบบน/ขอบล่างของ segment ที่เป็น Bad เท่านั้น ทั้งใน `specs/dual-line-variance-final.vl.json` และ `specs/dual-line-variance-static-test.vl.json` พร้อมอัปเดต `review/PHASE1_DESIGN_PLAN.md` หัวข้อ 6.1 ให้ตรงกับ implementation จริง — **ยืนยันแล้วด้วยการ re-render**: `stroke-dasharray="3,2"` ปรากฏจริงบนทั้งสอง layer ใหม่ ไม่มี warning อีกต่อไป

## ขอให้ตรวจประเด็นต่อไปนี้เป็นหลัก

1. ตรวจว่าการแก้ M-01 ถึง M-08 ทั้งหมดข้างต้นตรงตาม Finding เดิมจริง ไม่มีจุดที่แก้ไม่ครบหรือแก้ผิดจุด
2. ตรวจ layer ใหม่ `bad_area_border_actual`/`bad_area_border_reference` ในทั้งสองไฟล์ spec — filter ตรงกับเงื่อนไข Bad ของ `variance_area` กลับด้วย `!(...)` ถูกต้องหรือไม่ (ต้องแสดงเฉพาะ Bad segment เท่านั้น ไม่ทับ Good segment)
3. ตรวจ `specs/DualLine_PlotData_PowerQuery.pq` ส่วน M-06 guard ใหม่ — syntax ถูกต้อง ตำแหน่งอยู่ก่อนใช้ `SettingsGuard` จริงหรือไม่
4. ตรวจ `qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md` และ `qa/PHASE2_STATIC_TEST_LOG.md` ฉบับใหม่ — ยังมีคำอ้างเกินหลักฐานหลงเหลืออยู่หรือไม่ (โดยเฉพาะบรรทัดที่มีสถานะ [POWERBI-NOT-TESTED] ต้องไม่ปนกับที่พิสูจน์แล้วจริง)
5. ความเสี่ยงหรือ gap อื่นที่ควรแก้ก่อนพิจารณาว่า "ส่วน static ของ Phase 2" พร้อมส่งต่อให้ผู้ใช้ทดสอบจริงบน Power BI

## ข้อจำกัดที่ต้องรู้ก่อนรีวิว (เหมือนรอบแรก)

- ส่วน static นี้ **ไม่ใช่ Phase 2 ที่ PASS สมบูรณ์** — Phase 2 ข้อ 5-7 ของ `PROJECT_PLAN.md` ยังต้องให้ผู้ใช้ทดสอบบน Power BI Desktop + Deneb จริงก่อน
- ห้าม PASS ส่วน static นี้ถ้ามี Mandatory finding ที่กระทบความถูกต้องของ M code หรือ Vega-Lite spec

ตอบกลับในรูปแบบเดิม: Verdict (PASS/REVISE/BLOCKED สำหรับส่วน static เท่านั้น), Mandatory findings (ตาราง), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้
