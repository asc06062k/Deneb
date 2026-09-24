# Phase 2 review request รอบ 6 (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของงาน Phase 2 ขอบเขต **static + Workshop steps** — รอบ 5 ได้ `PASS` ([`qa/PHASE2_CODEX_VERDICT_R5.md`](../qa/PHASE2_CODEX_VERDICT_R5.md)) หลังจากนั้นผู้ใช้ตัดสินคำถามเปิด 3 ข้อ (ดู `review/PHASE2_WORKSHOP_STEPS.md` หัวข้อ "คำตัดสินผู้ใช้ต่อคำถามเปิด") ซึ่งทำให้ final spec เปลี่ยน จึงต้องรีวิวใหม่ M-11 ยังเป็น Known limitation ตามคำตัดสินผู้ใช้ ไม่ต้องรีวิวซ้ำ

## คำตัดสินผู้ใช้ (ไม่ต้องโต้แย้งเชิงนโยบาย ให้ตรวจว่าทำถูกต้อง)

1. แกน Y ทำตามต้นแบบ ±18% (`D:\DATA\Custom viz\dualLineVarianceChart\src\visual.ts:167-174`)
2. บทที่ 8 สอนเฉพาะการตั้งค่า Cross-filter ไม่ encode `__selected__`
3. คงเส้นโค้ง M-11

## การเปลี่ยนแปลง (ดู `git diff HEAD`)

- `specs/dual-line-variance-final.vl.json`: เพิ่ม top-level `params` 5 ตัว (`yRawMin`, `yRawMax`, `yPad`, `yDomainMin`, `yDomainMax` คำนวณจาก `data('dataset')`) และ `scale: {domain: [{expr: yDomainMin}, {expr: yDomainMax}], zero: false, nice: false}` บน `y` ของ `line_actual`
- `specs/dual-line-variance-static-test.vl.json`: เพิ่ม `params` เดียวกัน, layer เท่ากับ final spec (ไฟล์ถูก re-serialize เป็น JSON 2-space ทั้งไฟล์ ข้อมูล inline เหมือนเดิม)
- Generator: `noYDomain()` + Step ใหม่ **CH05-S05** (`params` ใส่เฉพาะเมื่อมี layer ใช้ `scale`) รวม 11 Step
- Test: ตรวจว่า `params`/`scale` มาคู่กันตั้งแต่ CH05-S05 และ Y domain ที่ render จริง = [0, 600] ก่อน CH05-S05, [340.4, 639.6] ตั้งแต่ CH05-S05 — ผล **338 passed, 0 failed** (`qa/evidence/phase2-workshop-steps/run-output.txt`)
- ทดสอบ edge case แยก (ไม่อยู่ใน suite): ข้อมูลว่าง → domain [0, 1]; ทุกค่าเท่ากับ 5 → [4.5, 5.5]
- `PROJECT_PLAN.md`: เพิ่มแกน Y ±18% ในกลุ่ม A, แก้ข้อความที่เคย Lock ให้ encode `__selected__` (หัวข้อ 3 ข้อ 6, หัวข้อ 4 Cross-filtering, บทที่ 8), บทที่ 5 เพิ่ม monotone + Y domain, หัวข้อ 9 บันทึกการยืนยัน M-11
- `README.md`, `review/PHASE2_WORKSHOP_STEPS.md`: บันทึกคำตัดสินและ Step ใหม่

## รันซ้ำ

```bash
VEGA_NODE_MODULES="C:/Users/MSI/AppData/Local/Temp/claude/D--DATA-Deneb-Course/e0eca914-7edf-4826-aab4-d1f1530c20da/scratchpad/node_modules" node qa/scripts/run-workshop-step-tests.mjs
```

## ขอให้ตรวจ

1. สูตร `params` ตรงกับ `visual.ts:167-174` จริง (รวม fallback `|max| × 0.1` แล้ว `1`, และ guard `domainMax <= domainMin`) และปลอดภัยในกรณี dataset ว่าง/มี Blank (Blank ถูก normalize เป็น 0 ใน Power Query แล้ว)
2. `data('dataset')` อ้างถึงข้อมูลถูกต้องทั้งใน Deneb (ที่ `data: {name: "dataset"}`) และตอนทดสอบ inline values — มีความเสี่ยงไหมที่ Deneb ตั้งชื่อ data source ต่างไป หรือ cross-filter/highlight ทำให้ `dataset` มีแถวน้อยลงแล้ว domain เปลี่ยน (ถ้ามี ให้ระบุเป็นสิ่งที่ต้องทดสอบบน Power BI จริง)
3. การใส่ `scale` ไว้แค่ `line_actual` มีผลกับทุก layer ที่ share scale y จริง (area/border/connector/label) ไม่มี warning ขัดแย้งของ scale
4. การแก้ `PROJECT_PLAN.md` เรื่อง `__selected__` ครบทุกจุดและไม่ขัดกับ Evidence template/Test matrix
5. ไม่มี regression ในส่วนที่ PASS แล้ว

ตอบในรูปแบบเดิม (Verdict สำหรับ static + Workshop steps เท่านั้น, Mandatory findings, Optional improvements, คำถามที่รอหลักฐานผู้ใช้) เป็นภาษาไทย
