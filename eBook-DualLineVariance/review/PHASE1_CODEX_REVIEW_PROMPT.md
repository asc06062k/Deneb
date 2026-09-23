# Phase 1 review request (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของ `review/PHASE1_DESIGN_PLAN.md` (Design Plan ฉบับแรก) เทียบกับ `PROJECT_PLAN.md` และหลักฐานที่อ้างถึง

หลักฐานที่ใช้ประกอบการเขียน Design Plan นี้

- `qa/PHASE1_PROTOTYPE_TEST_LOG.md` — ผลทดสอบจริงใน Vega-Lite Editor (ไม่ใช่ Power BI) สำหรับ crossing-case variance area, Business_Type dynamic switching, และ Category axis label overlap
- `specs/phase1-proto-variance-crossing.vl.json` และ `specs/phase1-proto-responsive-labels.vl.json` — spec ที่ทดสอบจริง

ตรวจประเด็นต่อไปนี้เป็นหลัก

1. เทคนิค crossing-case (precompute ผ่าน Power Query + `detail` grouping) สมเหตุสมผลและตรงกับพฤติกรรม `segmentFill.ts` ของต้นแบบหรือไม่ ข้อจำกัดเรื่อง Template ไม่ plug-and-play ที่ระบุไว้เพียงพอหรือไม่
2. `Business_Type` เป็น DAX Measure ค่าคงที่ตามที่ Phase 0 Lock ไว้ครบถ้วนหรือไม่ มี gap อะไรที่ต้องพิสูจน์ต่อใน Phase 2 ที่ยังไม่ถูกระบุ
3. Responsive: แนวทาง `width: container` + `labelOverlap: greedy` และการ port อัลกอริทึม thinning จาก D3 เป็น Vega expression สมเหตุสมผลหรือไม่ Minimum viewport 280×180px มีเหตุผลรองรับเพียงพอหรือไม่ หรือควรกำหนดต่างไป
4. Field contract ฉบับเต็ม (หัวข้อ 5) ครบและสอดคล้องกับ PROJECT_PLAN.md หรือไม่ — สังเกตว่ามีการเพิ่ม field `KPI_ID` ใหม่ที่ไม่ได้อยู่ใน PROJECT_PLAN.md เดิม ตรวจว่าจำเป็นและสมเหตุสมผลหรือไม่
5. Style guide เรื่องสี (teal/amber แทน green/red) มีเหตุผลด้าน accessibility ที่น่าเชื่อหรือไม่ ตรวจ contrast ratio ตัวเลขที่อ้างหรือความสมเหตุสมผลของ WCAG AA claim
6. Test matrix (23 รายการ) ครอบคลุมกรณีที่ PROJECT_PLAN.md กำหนดไว้ครบหรือไม่ มี gap หรือไม่
7. Evidence record template ครบตามที่ Phase 0 Lock ไว้หรือไม่
8. Version lock (Power BI 2.157.1354.0, Deneb 2.0.0.0 — เดียวกับโครงการ Bullet Chart) และคำเตือนเรื่องต้องยืนยันภาพจริงก่อนใช้งานจริงเพียงพอหรือไม่

ตอบกลับในรูปแบบเดิม

1. Verdict: PASS, REVISE, หรือ BLOCKED
2. Mandatory findings (ตาราง: ID, ความรุนแรง, หัวข้อที่เกี่ยวข้อง, ปัญหา, เหตุผล/หลักฐาน, ข้อเสนอแก้ไข)
3. Optional improvements
4. คำถามที่ต้องรอหลักฐานจาก Phase 2

ให้ PASS เฉพาะเมื่อไม่มี Mandatory finding เหลืออยู่ ห้ามเดาพฤติกรรมของ Deneb/Power BI ถ้าไม่แน่ใจให้ระบุว่าต้องตรวจกับเครื่องจริงใน Phase 2
