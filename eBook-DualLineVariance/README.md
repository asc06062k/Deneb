# Deneb Dual-Line Variance Chart eBook — สถานะโครงการ

โครงการนี้แยกจาก `D:\DATA\Deneb\eBook` (Bullet Chart) ตามที่ผู้ใช้ยืนยันเมื่อ 23 กันยายน 2026 (Asia/Bangkok) ดูรายละเอียดขอบเขตและ Workflow ใน [PROJECT_PLAN.md](PROJECT_PLAN.md)

Workflow ของโครงการนี้: **Claude Code เขียน, Codex CLI รีวิว** (สลับบทบาทจากโครงการ Bullet Chart)

## สถานะ Quality Gate

**Phase 0: ผ่าน Quality Gate (`PASS`)** — Codex CLI ให้ผล `PASS` ครั้งแรกรอบที่ 7 เมื่อ 23 กันยายน 2026 (แก้ Mandatory finding รวม 11 ข้อ M-01 ถึง M-11A) จากนั้นผู้ใช้ขอเพิ่ม Requirement ใหม่ 2 ข้อ (Responsive + field `Business_Type`) ส่งกลับให้ Codex รีวิว Addendum อีก 4 รอบ (รอบ 8–11) จนได้ `PASS` อีกครั้งที่รอบ 11 ดูรายละเอียดทุกรอบใน `qa/PHASE0_CODEX_VERDICT.md` ถึง `qa/PHASE0_CODEX_VERDICT_R11_ADDENDUM.md`

ประเด็นสำคัญที่ Lock ไว้จาก Phase 0 (ต้องใช้ต่อใน Phase 1 เป็นต้นไป)

- Cross-filter ใช้ `Expose cross-filtering values for dataset rows` (Simple mode) + ฟิลด์ `__selected__`
- Cross-highlight ต้องเปิด 2 ระดับ: `Expose cross-highlight values for measures` ของ Visual แล้วเปิด Supporting field (`Highlight value`/`Highlight status`/`Highlight comparator`) รายฟิลด์ต่อ measure ใน "Supporting Fields: dataset" — ทั้งหมดอยู่ใน Project setup pane เดียวกันคนละ section
- ฝั่ง Power BI ต้องตั้ง `Edit interactions` ของ Visual ต้นทางเป็น `Highlight` (แนะนำ Clustered bar/column chart) — **ห้ามใช้ Slicer ทดสอบ Highlight** เพราะ Slicer มีเฉพาะ `Filter`/`None`
- Context menu ใช้ `Show context menu on right-click` และ `Attempt to resolve data point-specific actions`
- Variance area ที่แบ่งสีตรงจุดตัด (crossing case) ยังเป็นคำถามเปิดที่ต้องพิสูจน์ใน Phase 1 — ยังไม่ยืนยันว่า Vega-Lite ทำได้แบบ pixel-accurate
- ทุกฟีเจอร์แบ่งเป็นกลุ่ม A (เทียบเท่าต้นแบบ มีหลักฐานจาก source) และกลุ่ม B (ส่วนขยายเฉพาะ Deneb เช่น cross-highlight ขาเข้า, `Business_Type`, Category axis label ไม่ทับซ้อน)
- **Responsive**: Data label ของ Actual/Reference ต้อง re-evaluate ทุกครั้งที่ resize และ "ลดการชน" เท่านั้น (Group A ไม่รับประกัน 100%) ส่วน **Category axis label ต้องไม่ทับซ้อนกันเลย** ภายในช่วงขนาดที่ Test matrix กำหนด (Group B คำสัญญาที่แข็งกว่าต้นแบบ ต้องพิสูจน์กลไกใน Phase 1 ก่อน)
- **Business_Type** (ใหม่): field ที่รับค่า `"Higher is Good"`/`"Lower is Good"` ต้องผูกเป็น **DAX Measure ค่าคงที่** (ไม่ใช่ Column) เพื่อไม่ให้กระทบ grain ของ dataset, fallback เป็น `"Higher is Good"` เมื่อไม่ผูก field, ไม่ใช่การเพิ่ม data role ใหม่ใน capabilities.json แบบ Custom Visual
- ทุกผลทดสอบ Interaction บน Power BI จริงต้องมี Evidence record ครบตามแบบที่ Lock ไว้ (Phase 1 ข้อ 5) มิฉะนั้นระบุ `NOT TESTED`

## ไฟล์และโครงสร้าง

สร้างโฟลเดอร์ตามแผนแล้ว: `manuscript`, `data`, `dax`, `specs`, `templates`, `images/chapter-01` ถึง `chapter-10`, `cover`, `review/chapters`, `qa`, และ `release`

Visual อ้างอิงคือ Custom Visual จริงที่ `D:\DATA\Custom viz\dualLineVarianceChart` — อ่านโดยตรงจาก `capabilities.json`, `interfaces.ts`, `visual.ts` เพื่อดึง Field contract และพฤติกรรมจริง ไม่ได้เดาจากชื่อไฟล์

## ข้อจำกัดสำคัญ

- Claude/Codex ไม่มีสิทธิ์เปิด Power BI Desktop หรือ Deneb Editor จริงบนเครื่องผู้ใช้ ภาพหน้าจอและผลทดสอบ Interaction (Cross-filter/Cross-highlight) ต้องได้รับการยืนยันจากผู้ใช้บนเครื่องจริงก่อนถือว่าผ่าน
- ก่อนหน้านี้ไม่มีการบันทึกภาพ UI จากการคาดเดา และจะรักษามาตรฐานนี้ต่อในโครงการนี้

## Phase log

### Phase 0 — 23 กันยายน 2026 — PASS
- สร้างโฟลเดอร์และ `PROJECT_PLAN.md`
- ส่งรีวิวให้ Codex CLI ผ่าน `review/PHASE0_CODEX_REVIEW_PROMPT.md` รวม 7 รอบ (REVISE 6 ครั้ง, PASS รอบที่ 7)
- ทุก Mandatory finding ตรวจสอบไขว้กับเอกสาร Deneb ทางการ (deneb.guide) และ Microsoft Learn ก่อนยอมรับหรือปฏิเสธ ไม่ใช้คำตัดสินของ Codex ตรงๆโดยไม่ตรวจสอบ
- ผลรีวิวทุกรอบ: `qa/PHASE0_CODEX_VERDICT.md` (รอบ 1), `..._R2.md` ถึง `..._R7.md`

### Phase 0 Addendum — 23 กันยายน 2026 — PASS
- ผู้ใช้ขอเพิ่ม 2 Requirement ก่อนเริ่ม Phase 1: (1) Responsive resize ไม่ให้ Category label ทับซ้อน (2) field ใหม่ `Business_Type` (Higher is Good / Lower is Good) ผูกกับข้อมูลแทน Format pane setting คงที่ของต้นแบบ
- ปรับ `PROJECT_PLAN.md` แล้วส่ง Codex รีวิวซ้ำ 4 รอบ (รอบ 8–11) แก้ Mandatory finding M-12 ถึง M-15 (แยกคำสัญญา Group A "ลดการชน" ของ Actual/Reference data label ออกจาก Group B "ไม่ทับซ้อน" ของ Category axis label, ล็อก `Business_Type` เป็น DAX Measure ค่าคงที่เพื่อไม่กระทบ grain, เพิ่ม prototype gate ใน Phase 1)
- ผลรีวิว: `qa/PHASE0_CODEX_VERDICT_R8_ADDENDUM.md` ถึง `..._R11_ADDENDUM.md` (`PASS` ที่รอบ 11)

### Phase 1 — ยังไม่เริ่ม
รอเริ่ม Research และ Design Lock ตาม `PROJECT_PLAN.md` หัวข้อ 7
