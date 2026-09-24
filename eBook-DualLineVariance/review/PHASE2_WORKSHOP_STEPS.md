# Phase 2 ข้อ 4 — แตก Prototype เป็น Workshop Steps

เอกสารนี้แตก `specs/dual-line-variance-final.vl.json` ออกเป็น Step สะสม (cumulative) สำหรับบทที่ 5–8 ตาม `PROJECT_PLAN.md` หัวข้อ 7 Phase 2 ข้อ 4 — แต่ละ Step คือไฟล์ JSON เต็มที่ผู้อ่านวางใน Deneb ได้ทันที (มาตรฐาน Step ข้อ 5: "แสดงเฉพาะส่วนที่เปลี่ยนและลิงก์ไปยังไฟล์ JSON เต็มของ Step นั้น")

สถานะหลักฐาน: **[VEGA-RENDERED]** แบบ headless (Node.js + `vega-lite` 6.4.3 + `vega` 6 จริง ไม่ใช่ reference implementation) — **ยังไม่ได้วางใน Deneb จริง** [POWERBI-NOT-TESTED]

## หลักการ

- **สร้างอัตโนมัติจาก final spec** ด้วย [`qa/scripts/build-workshop-steps.mjs`](../qa/scripts/build-workshop-steps.mjs) — ห้ามแก้ไฟล์ใน `specs/steps/` ด้วยมือ ถ้า final spec เปลี่ยน ให้รันสคริปต์ใหม่ ทำให้ Step ไม่มีทาง drift ออกจาก final spec
- ทุก Step เป็น **subset ของ layer ใน final spec** เรียงลำดับ layer ตาม final spec เสมอ (Area อยู่ล่างสุด, Label อยู่บนสุด) — ผู้อ่านจึงต้อง "แทรก" layer ใหม่ไว้ด้านบนของ array ในบทที่ 6 ไม่ใช่ต่อท้าย ต้องอธิบายเหตุผลเรื่องลำดับการวาดในบทที่ 6
- Step ขั้นกลางใช้รูปแบบ "ตัดฟีเจอร์ที่ยังไม่สอนออก" จาก layer ของ final spec เท่านั้น (ตัด `opacity`, `interpolate`, `encoding.y.scale`+`params`, `tooltip`+`calculate`) ไม่มีโค้ดใหม่ที่ไม่อยู่ใน final spec — ตรวจแบบ structural subset ทุก property (ข้อ 2 ด้านล่าง) หลัง Codex R4 พบว่ารุ่นแรกของ generator เคยเพิ่ม `mark.tooltip = null` ที่ไม่มีใน final spec (M-12, แก้แล้ว)
- Step สุดท้าย (`CH08-S01`) เท่ากับ final spec ทุกตัวอักษร ยกเว้น `description` — ตรวจโดยอัตโนมัติ

## Step map

| Step | ไฟล์ | Layer ที่เพิ่ม/เปลี่ยน | บทที่สอน | หมายเหตุ |
| --- | --- | --- | --- | --- |
| CH05-S01 | [`CH05-S01-line-actual.vl.json`](../specs/steps/CH05-S01-line-actual.vl.json) | `line_actual` (เส้นตรง, filter `Row_Type == 'Original'`, แกนเดือนไทย `labelExpr`) | 5 | สอน `width/height: "container"` + `autosize` ตั้งแต่ Step แรก เพราะ Deneb ต้องใช้ |
| CH05-S02 | [`CH05-S02-line-reference.vl.json`](../specs/steps/CH05-S02-line-reference.vl.json) | + `line_reference` (เส้นประสีอำพัน), `resolve.scale` shared | 5 | จุดแนะนำ `layer` ครั้งแรก |
| CH05-S03 | [`CH05-S03-points.vl.json`](../specs/steps/CH05-S03-points.vl.json) | + `point_reference`, `point_actual_hit_target` (ยังไม่มี tooltip) | 5 | |
| CH05-S04 | [`CH05-S04-monotone.vl.json`](../specs/steps/CH05-S04-monotone.vl.json) | `line_actual`/`line_reference` เพิ่ม `interpolate: "monotone"` | 5 | **ต้องมีกล่อง Known limitation M-11** (เส้นโค้งกับพื้นที่สีเส้นตรงไม่ sync) ตาม `PROJECT_PLAN.md` หัวข้อ 9 |
| CH05-S05 | [`CH05-S05-y-domain.vl.json`](../specs/steps/CH05-S05-y-domain.vl.json) | เพิ่ม `params` 5 ตัว (`yRawMin`/`yRawMax`/`yPad`/`yDomainMin`/`yDomainMax` จาก `data('dataset')`) + `scale.domain` expr, `zero: false`, `nice: false` บน `line_actual` | 5 | แกน Y แบบต้นแบบ ±18% (`visual.ts:167-174`) ข้อมูล Workshop 380–600 → domain [340.4, 639.6]; ข้อมูลว่าง → [0, 1]; ค่าเท่ากันหมด → ±10% |
| CH06-S01 | [`CH06-S01-variance-area.vl.json`](../specs/steps/CH06-S01-variance-area.vl.json) | + `variance_area` (filter Boundary/Crossing, `detail: Segment_ID`, สีจาก `Business_Type` × `Run_Sign`) | 6 | |
| CH06-S02 | [`CH06-S02-bad-area-border.vl.json`](../specs/steps/CH06-S02-bad-area-border.vl.json) | + `bad_area_border_actual`, `bad_area_border_reference` | 6 | อธิบายว่าทำไมใช้ `line` แทน `strokeDash` บน `area` (Vega-Lite drop เงียบๆ) |
| CH06-S03 | [`CH06-S03-connector-rule.vl.json`](../specs/steps/CH06-S03-connector-rule.vl.json) | + `connector_rule` | 6 | |
| CH07-S01 | [`CH07-S01-tooltip.vl.json`](../specs/steps/CH07-S01-tooltip.vl.json) | `point_actual_hit_target` เพิ่ม `calculate` 3 ตัว + `tooltip` | 7 | |
| CH07-S02 | [`CH07-S02-data-labels.vl.json`](../specs/steps/CH07-S02-data-labels.vl.json) | + `label_actual`, `label_reference` (thinning จาก signal `width`) | 7 | Group A "ลดการชน" ไม่รับประกัน |
| CH08-S01 | [`CH08-S01-cross-highlight-opacity.vl.json`](../specs/steps/CH08-S01-cross-highlight-opacity.vl.json) | เพิ่ม `opacity` condition จาก `Actual__highlightStatus`/`Reference__highlightStatus` ใน 4 layer | 8 | **= final spec** ชื่อ field verified บน Deneb จริง (T19-01); รูปแบบจาง rev 5 (เส้นไม่จาง; จุด/connector/label เดือนอื่น 0.5 — Design Plan 2.2.3) — รอทดสอบบน Deneb; connector/label ของ CH06-S03/CH07-S02 ไม่มี opacity จนถึง CH08-S01 |

บทที่ไม่มี Step JSON จาก prototype นี้:

- **บทที่ 1–2**: ไม่มี spec (แนวคิด/ติดตั้ง)
- **บทที่ 3**: ใช้ตัวอย่างสั้นแยกของตัวเอง (สอนไวยากรณ์ Vega-Lite ทั่วไป) จะสร้างใน Phase 3 ไม่ใช่ส่วนของ prototype
- **บทที่ 4**: สอน Power Query (`specs/DualLine_PlotData_PowerQuery.pq`) ไม่ใช่ Vega-Lite
- **บทที่ 8 ส่วน Cross-filter**: final spec **ไม่ได้อ่าน `__selected__`** — Cross-filter ในโหมด Simple ทำงานจากการเปิด `Expose cross-filtering values for dataset rows` เท่านั้น ไม่มี JSON ที่ต้องแก้ ถ้าจะสอนการทำให้จุดที่ไม่ถูกเลือกจางลงด้วย `__selected__` ต้องเพิ่มเป็นฟีเจอร์ใหม่ใน final spec และส่ง Codex รีวิวก่อน (คำถามเปิดข้อ 2 ด้านล่าง)
- **บทที่ 9–10**: ใช้ final spec ตรงๆ (บทที่ 9 แยกเป็น Template, บทที่ 10 สร้างใหม่ตั้งแต่ต้น)

## ผลทดสอบ [VEGA-RENDERED headless]

คำสั่ง (vega/vega-lite ไม่ใช่ dependency ของโปรเจกต์ ติดตั้งแยกในโฟลเดอร์ชั่วคราว):

```bash
npm install --prefix <tmp> vega@6 vega-lite@6
VEGA_NODE_MODULES=<tmp>/node_modules node qa/scripts/run-workshop-step-tests.mjs
```

ผล: **388/388 ผ่าน** (รวม HL-* 50 ข้อ: 8 สถานการณ์ highlight บน final spec ตรวจจุด/connector/label/เส้น + regression 2 ข้อ) (ผลเต็มใน [`qa/evidence/phase2-workshop-steps/run-output.txt`](../qa/evidence/phase2-workshop-steps/run-output.txt)) — ต่อ Step ตรวจ:

1. `data` ผูกกับ `{"name": "dataset"}` และไม่มี `values` ค้าง (กันผู้อ่านวางข้อมูลทดสอบลง Deneb)
2. ลำดับ layer เป็น subsequence ของ final spec, เก็บ layer ของ Step ก่อนหน้าครบ (cumulative), ชุด layer ตรงกับแผนการสอนที่เขียนแยกจาก generator (`EXPECTED_LAYERS`), manifest ตรงกับไฟล์จริง, ทุก layer เป็น **structural subset** ของ layer ชื่อเดียวกันใน final spec (ทุก property ต้องมีใน final ด้วยค่าเดียวกัน array ต้องเป็น subsequence ตามลำดับ) และ top-level property อื่นเท่ากับ final spec — ยืนยันด้วย negative test แล้วว่าถ้าใส่ `mark.tooltip = null` กลับเข้าไป test จะ FAIL
3. Compile ด้วย `vega-lite` 6.4.3 ไม่มี warning
4. มีแกน X ("เดือน") และแกน Y ("ยอดขาย (พันบาท)") จริงหลัง compile (regression ของบั๊กด้านล่าง)
5. Render เป็น SVG ได้ และจำนวน mark ต่อ layer ตรงกับข้อมูล Workshop: `variance_area` 20 path, `bad_area_border_*` 10 path ต่อเส้น, `connector_rule`/`point_*` 12 จุด, เส้นละ 1 path
6. `interpolate: monotone` ปรากฏตั้งแต่ CH05-S04 เท่านั้น; `params` + `scale.domain` ปรากฏคู่กันตั้งแต่ CH05-S05 เท่านั้น และ Y domain ที่ render จริง = [0, 600] ก่อน CH05-S05, [340.4, 639.6] ตั้งแต่ CH05-S05
7. Step สุดท้ายเท่ากับ final spec

ภาพที่ render จริงของทุก Step: [`qa/evidence/phase2-workshop-steps/`](../qa/evidence/phase2-workshop-steps/) (PNG จาก SVG ที่ Vega สร้าง ขนาด 640×320 — **เป็นหลักฐาน QA ไม่ใช่ภาพประกอบหนังสือ** และไม่ใช่ภาพหน้าจอ Power BI)

## บั๊กที่พบระหว่างทำ Step — แกนหายทั้งหมดใน final spec (แก้แล้ว)

**อาการ**: final spec ที่ commit ใน Phase 2 (`050c0d2`) compile ด้วย `vega-lite` 6.4.3 แล้ว **ไม่มีแกน X/Y เลย** (`axes: []`) — ไม่มีชื่อเดือน ไม่มีตัวเลขแกน Y ไม่มี gridline

**สาเหตุ**: layer `variance_area`, `bad_area_border_actual`, `bad_area_border_reference` ตั้ง `"axis": null` บน `x`/`y` และอยู่ก่อน `line_actual` (ที่กำหนด `title`/`values`/`labelExpr`) ในลำดับ layer เมื่อ scale เป็น `shared` Vega-Lite merge axis ของทุก layer แล้ว `axis: null` ของ layer ก่อนหน้าทำให้แกนถูกปิดทั้งหมด พบได้เพราะ CH05-S01 ถึง CH05-S04 (ยังไม่มี Area) มีแกนปกติ แต่แกนหายทันทีที่ CH06-S01 เพิ่ม `variance_area`

**การแก้**: ลบ `"axis": null` ออกจาก 3 layer นั้นใน `specs/dual-line-variance-final.vl.json` และ `specs/dual-line-variance-static-test.vl.json` (ไม่จำเป็นต้องมีอยู่แล้ว เพราะ `line_actual` เป็นผู้กำหนด axis) — หลังแก้ compile ได้ axis 4 ตัว (grid x/y + แกน "เดือน"/"ยอดขาย (พันบาท)") และ layer ของทั้งสอง spec ยังเหมือนกันทุกตัวอักษร

**ผลต่อ QA log เดิม**: แถว "Axis label เดือนภาษาไทย" ใน `qa/PHASE2_STATIC_TEST_LOG.md` ที่เคยบันทึกว่า PASS ไม่สอดคล้องกับ spec ที่ commit ไว้ — แก้ไขหมายเหตุในไฟล์นั้นแล้ว

## คำตัดสินผู้ใช้ต่อคำถามเปิด (24 ก.ย. 2026)

ความเห็นของ Codex R4 อยู่ใน [`qa/PHASE2_CODEX_VERDICT_R4.md`](../qa/PHASE2_CODEX_VERDICT_R4.md) — ผู้ใช้ตัดสินดังนี้:

1. **Y domain → ทำตามต้นแบบ ±18%** (ต่างจากคำแนะนำ Codex ที่ให้บันทึกเป็นข้อแตกต่างก่อน) — เพิ่มใน final spec เป็น `params` + `scale.domain` ตรงตามสูตร `visual.ts:167-174` รวม fallback `|max| × 0.1`/`1` และ guard ข้อมูลว่าง เพิ่ม Step CH05-S05 และบันทึกใน `PROJECT_PLAN.md` หัวข้อ 4 กลุ่ม A — การตั้ง Y min/max เองแบบ Format pane ของต้นแบบอยู่นอกขอบเขต
2. **`__selected__` → สอนเฉพาะการตั้งค่า** ไม่ encode ใน spec — แก้ `PROJECT_PLAN.md` หัวข้อ 3, 4 และบทที่ 8 ที่เคย Lock ว่าต้อง encode opacity จาก `__selected__`
3. **M-11 → คงเส้นโค้งไว้** เป็น Known limitation เหมือนเดิม

ข้อสังเกต: เมื่อแกน Y ไม่เริ่มที่ 0 ความต่างระหว่างเส้นโค้งกับขอบพื้นที่สีเส้นตรง (M-11) มองเห็นชัดขึ้นกว่าเดิม (เช่นช่วง ก.พ.–มี.ค. ใน [`CH07-S02-data-labels.png`](../qa/evidence/phase2-workshop-steps/CH07-S02-data-labels.png))
