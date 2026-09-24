# Phase 2 review request รอบ 4 (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของงาน Phase 2 (Dataset และ Vega-Lite Prototype) ของโครงการ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb — รอบที่ 3 ได้ `REVISE` ด้วย M-11 ([`qa/PHASE2_CODEX_VERDICT_R3.md`](../qa/PHASE2_CODEX_VERDICT_R3.md)) ซึ่ง**ผู้ใช้ตัดสินใจเก็บเส้น monotone ไว้เป็น Known limitation โดยเจตนา** (ดู `qa/PHASE2_STATIC_TEST_LOG.md` ส่วน "คำตัดสินของผู้ใช้" และ `PROJECT_PLAN.md` หัวข้อ 9) — **ไม่ต้องรีวิว M-11 ซ้ำ** ให้คงสถานะเดิม (Accepted as known limitation, deferred by user) Source of truth: `PROJECT_PLAN.md`, `review/PHASE1_DESIGN_PLAN.md`

## งานในรอบนี้

1. **Phase 2 ข้อ 4 — แตก Prototype เป็น Workshop steps**: [`review/PHASE2_WORKSHOP_STEPS.md`](PHASE2_WORKSHOP_STEPS.md), generator [`qa/scripts/build-workshop-steps.mjs`](../qa/scripts/build-workshop-steps.mjs), ผลลัพธ์ `specs/steps/*.vl.json` + `specs/steps/steps-manifest.json`, test [`qa/scripts/run-workshop-step-tests.mjs`](../qa/scripts/run-workshop-step-tests.mjs), หลักฐาน `qa/evidence/phase2-workshop-steps/` (PNG + `run-output.txt`)
2. **บั๊กใหม่ใน final spec ที่ commit แล้ว**: layer `variance_area`/`bad_area_border_actual`/`bad_area_border_reference` มี `"axis": null` ทำให้ compile แล้วไม่มีแกนเลย — ลบออกทั้งใน `specs/dual-line-variance-final.vl.json` และ `specs/dual-line-variance-static-test.vl.json` (ดู `git diff HEAD -- specs/`) และแก้แถว Axis label ใน `qa/PHASE2_STATIC_TEST_LOG.md` ที่เคย overclaim

## วิธีรันทดสอบซ้ำ (read-only ได้ ไม่เขียนไฟล์ถ้าไม่ตั้ง `STEP_SVG_OUT`)

```bash
VEGA_NODE_MODULES="C:/Users/MSI/AppData/Local/Temp/claude/D--DATA-Deneb-Course/e0eca914-7edf-4826-aab4-d1f1530c20da/scratchpad/node_modules" node qa/scripts/run-workshop-step-tests.mjs
```

(`build-workshop-steps.mjs` เขียนไฟล์ จึงรันไม่ได้ใน read-only — ตรวจโดยอ่านโค้ดเทียบกับไฟล์ใน `specs/steps/` แทน)

## ขอให้ตรวจประเด็นต่อไปนี้เป็นหลัก

1. การลบ `axis: null` แก้ปัญหาแกนหายจริง ไม่สร้างแกนซ้ำ/ชื่อแกนผิด และ layer ของทั้งสอง spec ยังตรงกัน
2. Step specs เป็น subset ของ final spec จริง ไม่มีโค้ดใหม่นอก final spec, ลำดับการสอน (บท 5→6→7→8) สมเหตุสมผลกับ `PROJECT_PLAN.md` หัวข้อ 6 และ Step สุดท้ายเท่ากับ final spec
3. Test script ตรวจสิ่งที่อ้างไว้จริง (ไม่มี assertion ที่ผ่านเสมอโดยไม่ได้ตรวจอะไร) และจำนวน mark ที่คาดหวังคำนวณจากข้อมูลจริง
4. เอกสาร Step map ไม่ overclaim — แยก [VEGA-RENDERED headless] ออกจาก [POWERBI-NOT-TESTED] ชัดเจน
5. ความเห็นต่อคำถามเปิด 3 ข้อท้าย `PHASE2_WORKSHOP_STEPS.md` (Y domain ต่างจากต้นแบบ, `__selected__`, M-11 step)

## ข้อจำกัดที่ต้องรู้ก่อนรีวิว

- ส่วน static นี้ **ไม่ใช่ Phase 2 ที่ PASS สมบูรณ์** — Phase 2 ข้อ 5–7 ยังรอผู้ใช้ทดสอบบน Power BI Desktop + Deneb จริง
- M-11 เป็น Known limitation ตามคำตัดสินผู้ใช้ ไม่ใช่ Mandatory finding ที่ต้องแก้ในรอบนี้ ถ้าเห็นว่ามีผลกระทบใหม่จากงานรอบนี้ (เช่น Step CH05-S04) ให้ระบุแยกเป็นข้อใหม่

ตอบกลับในรูปแบบเดิม: Verdict (PASS/REVISE/BLOCKED สำหรับส่วน static + Workshop steps เท่านั้น), Mandatory findings (ตาราง), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้ — ตอบเป็นภาษาไทย
