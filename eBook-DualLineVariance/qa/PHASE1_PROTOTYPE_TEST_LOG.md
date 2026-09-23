# Phase 1 — บันทึกผลทดสอบ Prototype (Vega-Lite ล้วนๆ)

ทดสอบเมื่อ 23 กันยายน 2026 ผ่าน Vega-Lite Editor (`https://vega.github.io/editor`) — Vega 6.4.0 / Vega-Lite 6.4.3 / Vega-Tooltip 1.1.0 ทดสอบใน Browser pane ของ Claude ไม่ใช่ Power BI/Deneb จริง จึงพิสูจน์ได้เฉพาะ **ความเป็นไปได้ของ Vega-Lite spec** ไม่ใช่ผลลัพธ์จริงบน Power BI ตามข้อจำกัดที่ระบุใน PROJECT_PLAN.md

## P1-T01 — Variance area แบ่งสีตรงจุดตัด (crossing case)

**Spec**: [`specs/phase1-proto-variance-crossing.vl.json`](../specs/phase1-proto-variance-crossing.vl.json)

**วิธี**: precompute จุดตัดเป็นแถวเพิ่ม (interpolation เชิงเส้นแบบเดียวกับ `segmentFill.ts` ของต้นแบบ) ใส่ field `run_id` ต่อช่วงสี แล้วใช้ area mark กับ `detail: run_id` เพื่อไม่ให้ Vega-Lite เชื่อมโพลิกอนข้าม run

**ข้อมูลทดสอบ**: 6 จุด (pos 0–5) ที่ Actual/Reference สลับเครื่องหมาย diff ทุกช่วง (5 จุดตัด) — กรณีที่ยากที่สุดที่เป็นไปได้ในขนาดข้อมูลเล็ก

**ผลลัพธ์**: **PASS** — พื้นที่สีเขียว/แดงแบ่งพอดีที่จุดตัดทั้ง 5 จุด ไม่มีช่องว่างหรือสีทับซ้อนกัน ตรงกับพฤติกรรมที่ต้นแบบทำด้วย `segmentFill.ts`

**ข้อจำกัดที่ต้องบันทึกในหนังสือ**: เทคนิคนี้ต้องมี **แถวจุดตัดที่คำนวณไว้ล่วงหน้าอยู่ใน dataset แล้ว** Vega-Lite เองไม่มี transform ที่สร้างแถวใหม่จาก interpolation ระหว่างแถวที่ติดกัน (ไม่มี lead/lag แบบสร้างแถวใหม่) ดังนั้น

- สำหรับชุดข้อมูล Workshop ที่ตายตัว: คำนวณจุดตัดล่วงหน้าตอนเตรียมข้อมูล (Power Query step) ได้ตรงไปตรงมา — **เลือกใช้แนวทางนี้**
- สำหรับ Template ที่ผู้อ่านจะนำไปใช้กับข้อมูลของตัวเอง (Feature "Template" ในหัวข้อ 4): ผู้อ่านต้องทำ Power Query step แบบเดียวกันกับข้อมูลใหม่ทุกครั้ง ไม่ใช่แค่แก้ field mapping — ต้องระบุเป็นข้อจำกัดของ Template ใน Design Plan และบทที่ 9/11 ห้ามสัญญาว่า Template "plug-and-play" กับ crossing case

**field ที่ต้องมีเพิ่มใน dataset จริง (ไปกำหนดใน Field contract)**: `Sort_Order` ต้องเป็นตัวเลข (ไม่ใช่แค่ลำดับ) ใช้เป็นแกน X แบบ quantitative โดยตรง (ไม่ใช่ nominal Category) ส่วน Category axis label ต้องมาจาก lookup/`labelExpr` แยกจาก field ที่ใช้ plot เส้น/พื้นที่

## P1-T02 — Business_Type สลับ Comparison Logic แบบ dynamic

**Spec**: เดียวกับ P1-T01 (มี `params.businessType` ผูกกับ dropdown `higher`/`lower`)

**ผลลัพธ์**: **PASS** — สลับ dropdown จาก `higher` เป็น `lower` แล้วสีพื้นที่ Variance และ Connector line กลับกันทันที ถูกต้องตามเงื่อนไข `test` expression พิสูจน์ว่าการอ่านทิศทางจาก field ที่ผูกกับข้อมูล (แทน mode คงที่จาก Format pane) ทำได้จริงใน Vega-Lite

**หมายเหตุ**: ใน Deneb จริง ค่านี้จะมาจาก field `Business_Type` ใน `dataset` (ไม่ใช่ UI dropdown) — เทียบเท่ากันทาง logic เพราะทั้งคู่ใช้ `test` expression อ่านค่าจาก signal/field เดียวกัน

## P1-T03 — Category axis label ไม่ทับซ้อนกันเมื่อ Category มาก/พื้นที่แคบ

**Spec**: [`specs/phase1-proto-responsive-labels.vl.json`](../specs/phase1-proto-responsive-labels.vl.json)

**ข้อมูลทดสอบ**: 24 categories สังเคราะห์ (Jan-24 ... Dec-25) ที่ width 350px

**ผลลัพธ์**: **PASS** — `axis.labelOverlap: "greedy"` ลด label ที่แสดงเหลือทุกประมาณ 3 ตัว (Jan-24, May-24, Aug-24, Nov-24, Feb-25, May-25, Aug-25, Nov-25) ไม่มีการทับซ้อนกันเลย

**ข้อจำกัดที่ยังไม่พิสูจน์ในรอบนี้**: การทดสอบนี้ตั้งค่า `width` เป็นตัวเลขคงที่ ไม่ได้ทดสอบผ่านการ resize จริงแบบ `"width": "container"` ร่วมกับ container resize event ของ Power BI/Deneb เพราะ Vega-Lite Editor ไม่จำลอง container resize แบบ Power BI ได้ — **ต้องพิสูจน์ซ้ำใน Power BI จริงที่ Phase 2 ตาม PROJECT_PLAN.md Phase 1 ข้อ 4(ข)** ก่อนยืนยัน `PASS` ในหนังสือ

## สรุปผลต่อ Phase 1 ข้อ 1 และข้อ 4

| ข้อใน PROJECT_PLAN.md | ผลจาก Vega-Lite-only prototype | สถานะ |
| --- | --- | --- |
| Phase 1 ข้อ 1 (crossing case) | พิสูจน์ได้ด้วยแนวทาง (ก) precompute — เลือกใช้แนวทางนี้เป็น Design Lock | ปิด (รอ Power BI จริงยืนยันใน Phase 2) |
| Phase 1 ข้อ 4(ก) Business_Type grain | ยังไม่พิสูจน์ที่นี่ (ต้องทำใน Power BI/Deneb จริง ไม่ใช่ Vega-Lite Editor) | ค้าง — ทำใน Phase 2 |
| Phase 1 ข้อ 4(ข) Category axis label responsive | Vega-Lite mechanism (`labelOverlap: greedy`) พิสูจน์แนวคิดแล้ว แต่ยังไม่พิสูจน์กับ container resize จริง | ค้าง — ทำใน Phase 2 |
| Phase 1 ข้อ 4(ค) Data label thinning ตอน resize | ยังไม่ทดสอบในรอบนี้ (เดิมอิงอัลกอริทึม `computeThinningStep` ของต้นแบบ ต้อง port เป็น Vega-Lite expression ใน Phase 2) | ค้าง — ทำใน Phase 2
