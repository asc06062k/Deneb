# Phase 3 — บทที่ 1 review request (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb Phase 2 PASS แล้ว (`qa/PHASE2_CODEX_VERDICT_R19.md`) Phase 3 เขียนทีละบท บทนี้คือ **บทที่ 1 รู้จัก Deneb**: [`manuscript/chapter-01.md`](../../manuscript/chapter-01.md)

Source of truth: `PROJECT_PLAN.md` (หัวข้อ 6 บทที่ 1, มาตรฐานภาพ, หัวข้อ 9 ข้อจำกัด, หัวข้อ 10 Definition of Done ต่อบท), `review/PHASE1_DESIGN_PLAN.md` (2.1.1, 2.2.2, 2.2.3, 4.1), `specs/dual-line-variance-final.vl.json` (rev 7)

ภาพ: `images/chapter-01/CH01-S01-final-visual-powerbi.png` (crop จาก `qa/evidence/phase2-powerbi/T16-800x450.png` — ภาพจริงจาก Power BI แต่ถ่ายตอน spec rev 5 และความละเอียดต่ำ), `images/chapter-01/CH01-S02-visual-anatomy.png` (render headless ของ rev 7 + callout ที่วางตามพิกัด scenegraph)

ข้อเท็จจริงที่อ้างและแหล่งที่ใช้ตรวจ (24 ก.ย. 2026):
- Deneb: README GitHub, deneb.guide getting-started (AppSource certified, MIT, standalone version เพราะข้อจำกัดโหลดรูปจาก URL), changelog (2.0.0 = 2026-09-08, Vega 6.4.0, Vega-Lite 6.4.3, rewritten pipeline, continuous view), GitHub releases API (0.2.0 beta 2021-03-19, 1.0.0 2021-11-24, 1.1–1.9.1 = 2022-02-03 ถึง 2026-03-31, alpha/beta 2.0 ก.ค.–ส.ค. 2026, repo created 2021-02-25), Publisher จากหน้าต่าง About ของ Deneb บนเครื่องผู้ใช้
- Vega/Vega-Lite: vega.github.io/vega-lite (self-description, compile to Vega, UW IDL), vega.github.io/vega/about ("assembly language", Prefuse/Protovis)
- ตัวอย่าง JSON ในหัวข้อ 1.2 compile ผ่าน Vega-Lite 6.4.3 ไม่มี warning

## ขอให้ตรวจ

1. ความถูกต้องของข้อเท็จจริงและการอ้างอิง (ถ้าตรวจออนไลน์ไม่ได้ ให้ระบุว่าเป็น "ยังไม่ยืนยัน" ไม่ใช่ผิด)
2. เนื้อหาครบตาม PROJECT_PLAN บทที่ 1 (Deneb คืออะไร, ความสัมพันธ์กับ Vega/Vega-Lite, ประวัติย่อ, เทียบ Native/Custom, ภาพรวม Visual ปลายทาง)
3. ความสอดคล้องกับ Design Lock/หลักฐาน Phase 2 (ข้อจำกัด 4 ข้อ, ฟีเจอร์, บทที่อ้างถึง) ไม่ overclaim
4. กฎภาพประกอบ: caption ระบุภาพจริง/แผนผังชัดเจนและเจาะจง, naming `CHxx-Syy-*`, ภาพตรงกับ spec ปัจจุบันหรือไม่ (ภาพ 1-1 ถ่ายตอน rev 5)
5. มาตรฐาน Step: บทนี้ไม่มี Step ปฏิบัติ — เหมาะสมหรือไม่
6. ภาษาไทยอ่านง่าย ศัพท์เทคนิคเป็นอังกฤษสม่ำเสมอ

ตอบรูปแบบ: Verdict (PASS/REVISE/BLOCKED), Mandatory findings (ตาราง), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้ — ภาษาไทย
