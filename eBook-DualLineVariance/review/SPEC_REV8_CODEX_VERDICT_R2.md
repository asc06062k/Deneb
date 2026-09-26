## Verdict: PASS

M-01 ปิดได้ตามแนวทาง (ข) อย่างยอมรับได้: เอกสารระบุชัดว่า highlight เดือนที่ Actual/Reference เป็น Blank **ไม่รองรับอย่างสมบูรณ์** เพราะ Deneb ส่งสถานะที่แยกจากแถวไม่ถูกเลือกไม่ได้ และไม่ได้กล่าวอ้างว่า spec แก้กรณีนี้แล้ว

## Mandatory findings

ไม่มี Mandatory finding ใหม่

## ผลตรวจ

- ข้อจำกัด M-01 บันทึกพร้อมพฤติกรรมและงานยืนยันบน Deneb จริงใน [PHASE1_DESIGN_PLAN.md](/D:/DATA/Deneb/eBook-DualLineVariance/review/PHASE1_DESIGN_PLAN.md:470)
- `EDGE-blankHighlight` จำลองสภาวะ `status="on"` และ `__highlight=null` อย่างถูกต้อง พร้อมยืนยันว่าจุด Actual จางครบ 12 จุดใน [run-workshop-step-tests.mjs](/D:/DATA/Deneb/eBook-DualLineVariance/qa/scripts/run-workshop-step-tests.mjs:409)
- `VERT-*` ตรวจ position, values, sign, segment index และ part แล้ว และ mutation ทั้ง 3 แบบถูกจับได้
- Top-level transforms ถูกตรวจแบบเท่ากับชุดที่กำหนด ไม่ใช่เพียง subset
- `EDGE-businessTypeInvalid` ยืนยันนโยบาย invalid configuration → Bad ทุกช่วง โดยไม่ fallback
- หลักฐานล่าสุดระบุ Vega 6.4.0 / Vega-Lite 6.4.3 และ `503 passed, 0 failed` ใน [run-output.txt](/D:/DATA/Deneb/eBook-DualLineVariance/qa/evidence/spec-rev8/run-output.txt:507)

ผมไม่สามารถรันซ้ำใน environment รอบตรวจนี้ได้ เนื่องจากไม่มีการตั้ง `VEGA_NODE_MODULES`; เป็นข้อจำกัดของ environment ไม่ใช่ test failure และหลักฐานที่บันทึกไว้มีเวอร์ชันกับผลครบถ้วน

## คำตัดสินสำหรับงานถัดไป

**ยอมรับให้เริ่มเขียนบทที่ 4–8 ใหม่บนสถาปัตยกรรม 4-field นี้ได้**

งานต่อไปนี้ยังคงเป็น gate ของบทที่ 9 และต้องไม่ถูกเขียนว่า “รองรับแล้ว” ก่อนมีหลักฐานจาก Deneb จริง:

1. Import และ remap template rev 8 บน Deneb 2.0.0.0
2. Highlight เดือนที่ Actual หรือ Reference เป็น Blank และบันทึกพฤติกรรมจริง
3. สื่อสารข้อจำกัดว่าเหตุการณ์ดังกล่าวอาจทำให้จุดของ measure นั้นจางทุกเดือน

ข้อสังเกตเสริมที่ไม่เป็น Mandatory: หัวข้อท้ายไฟล์ใช้เลข `0.6` ซ้ำกับหัวข้อประวัติเดิม ควรเปลี่ยนชื่อหรือเลขหัวข้อเมื่อจัดระเบียบต้นฉบับ แต่ไม่กีดขวางการเริ่มเขียนบทที่ 4–8