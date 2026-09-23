# Deneb Dual-Line Variance Chart eBook — สถานะโครงการ

โครงการนี้แยกจาก `D:\DATA\Deneb\eBook` (Bullet Chart) ตามที่ผู้ใช้ยืนยันเมื่อ 23 กันยายน 2026 (Asia/Bangkok) ดูรายละเอียดขอบเขตและ Workflow ใน [PROJECT_PLAN.md](PROJECT_PLAN.md)

Workflow ของโครงการนี้: **Claude Code เขียน, Codex CLI รีวิว** (สลับบทบาทจากโครงการ Bullet Chart)

## สถานะ Quality Gate

**Phase 0: ผ่าน Quality Gate (`PASS`)** — Codex CLI ให้ผล `PASS` รอบที่ 7 เมื่อ 23 กันยายน 2026 หลังแก้ Mandatory finding รวม 11 ข้อ (M-01 ถึง M-11A) ดูรายละเอียดทุกรอบใน `qa/PHASE0_CODEX_VERDICT.md` ถึง `qa/PHASE0_CODEX_VERDICT_R7.md`

ประเด็นสำคัญที่ Lock ไว้จาก Phase 0 (ต้องใช้ต่อใน Phase 1 เป็นต้นไป)

- Cross-filter ใช้ `Expose cross-filtering values for dataset rows` (Simple mode) + ฟิลด์ `__selected__`
- Cross-highlight ต้องเปิด 2 ระดับ: `Expose cross-highlight values for measures` ของ Visual แล้วเปิด Supporting field (`Highlight value`/`Highlight status`/`Highlight comparator`) รายฟิลด์ต่อ measure ใน "Supporting Fields: dataset" — ทั้งหมดอยู่ใน Project setup pane เดียวกันคนละ section
- ฝั่ง Power BI ต้องตั้ง `Edit interactions` ของ Visual ต้นทางเป็น `Highlight` (แนะนำ Clustered bar/column chart) — **ห้ามใช้ Slicer ทดสอบ Highlight** เพราะ Slicer มีเฉพาะ `Filter`/`None`
- Context menu ใช้ `Show context menu on right-click` และ `Attempt to resolve data point-specific actions`
- Variance area ที่แบ่งสีตรงจุดตัด (crossing case) ยังเป็นคำถามเปิดที่ต้องพิสูจน์ใน Phase 1 — ยังไม่ยืนยันว่า Vega-Lite ทำได้แบบ pixel-accurate
- ทุกฟีเจอร์แบ่งเป็นกลุ่ม A (เทียบเท่าต้นแบบ มีหลักฐานจาก source) และกลุ่ม B (ส่วนขยายเฉพาะ Deneb เช่น cross-highlight ขาเข้า)
- ทุกผลทดสอบ Interaction บน Power BI จริงต้องมี Evidence record ครบตามแบบที่ Lock ไว้ มิฉะนั้นระบุ `NOT TESTED`

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

### Phase 1 — ยังไม่เริ่ม
รอเริ่ม Research และ Design Lock ตาม `PROJECT_PLAN.md` หัวข้อ 7
