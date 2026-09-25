# Phase 3 — บทที่ 5 review request (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb บทที่ 1–4 `PASS` แล้ว บทนี้คือ **บทที่ 5 กราฟสองเส้นแรก (Actual vs Reference)**: [`manuscript/chapter-05.md`](../../manuscript/chapter-05.md) มี Step ปฏิบัติ 5 Step (มาตรฐาน 12 หัวข้อ) ใช้ไฟล์เต็มใน `specs/steps/CH05-S01..S05-*.vl.json` (สร้างจาก final spec ด้วย generator, ผ่านชุดทดสอบ Phase 2 แล้ว)

Source of truth: `PROJECT_PLAN.md` (บทที่ 5, มาตรฐาน Step, กฎภาพ, ข้อจำกัด M-11), `specs/steps/*`, `specs/dual-line-variance-final.vl.json`, `review/PHASE2_WORKSHOP_STEPS.md`, `manuscript/chapter-03.md` (ที่บทนี้อ้างถึง)

ภาพ: `images/chapter-05/CH05-S0*.png` 6 ภาพ (5-1 ถึง 5-6) ภาพหน้าจอ Deneb Editor จริง (Power BI 2.157.1354.0 + Deneb 2.0.0.0, ผู้ใช้จับ 25 ก.ย. 2026) ปิดชื่อบัญชีแล้ว (ถ้าเห็นชื่อบัญชีในภาพใดให้ระบุ Mandatory) ผูกข้อมูล `DualLine_PlotData` 52 แถว ภาพ 5-3 มี tooltip "Customize theme" ค้างมุมขวาบนของ Editor (caption ระบุแล้ว) ภาพ 5-2 Preview ถูก Debug pane บัง (caption ระบุ)

หลักฐาน: `qa/scripts/run-ch05-claims-check.mjs` (26 ผ่าน) ตรวจว่าทุกบล็อก JSON ในบท (9 บล็อก ทำเครื่องหมาย `<!-- excerpt: ... -->`) ตรงกับส่วนที่ตัดจากไฟล์ Step จริง, ลำดับ/จำนวน layer ต่อ Step, ตัวเลขแกน Y (380/600/pad 39.6/[340.4, 639.6]) คำนวณซ้ำจาก CSV, ภาพมีจริง เลขภาพต่อเนื่อง 5-1..5-6

## การตัดสินใจ/ข้อสมมติที่ผู้เขียนแจ้งในบท — ขอให้ตรวจ overclaim

1. **`$schema`**: ผู้ใช้ตัดสิน (25 ก.ย. 2026) ให้คงบรรทัด `$schema` ไว้ในไฟล์ Step และเขียนในบทว่าเส้นหยักสีเหลืองปกติให้ข้าม (เห็นจริงในภาพ 5-1 ถึง 5-6 บรรทัด 2) ผู้เขียนไม่ได้ตรวจข้อความเตือนตอนวางเมาส์ — ตรวจว่าถ้อยคำในกล่องต้นบทไม่ overclaim และสอดคล้องกับบทที่ 3 หัวข้อ 3.1
2. วิธีย่อ Debug pane (ลูกศร ⌄ / ลากเส้นแบ่ง) ผู้เขียนไม่ได้ยืนยันบนเครื่องจริง (บทระบุ)
3. คำอธิบาย `resolve.scale` shared (Step 2), ชื่อชั้น `point_actual_hit_target` (Step 3, ตามการออกแบบเล่ม), `monotone` ไม่ overshoot (Step 4) — ตรวจกับเอกสาร Vega-Lite/Design Plan
4. แบบฝึกหัดทุก Step เป็นการแก้ property ง่ายๆ ยังไม่ได้ลองใน Deneb จริง (ยกเว้นระบุ Step 4 ข้อ 11)
5. ภาพ "Back to report" ขนาด Visual 800×450 ยังไม่มี (ผู้ใช้จะส่งภายหลัง) บทนี้จึงยังไม่มีภาพในหน้ารายงาน — ตรวจว่ายอมรับได้หรือควรเป็น Mandatory

## ขอให้ตรวจ

1. ความถูกต้องของข้อเท็จจริงเทียบไฟล์ Step/ภาพ/Design Plan: ชื่อ layer/param, ค่าสี/ขนาด, สูตรแกน X (`xAxis*`, `labelExpr`) และแกน Y (`yPad` แบบ `||`), ตัวเลข 380/600/39.6/340.4/639.6 และเหตุผลที่ X ใช้ `Plot_Position`
2. มาตรฐาน Step 12 หัวข้อครบทุก Step; ขั้นตอนทำตามได้จริง; หัวข้อ 5.1 (วิธีวาง)
3. เลข "ภาพ 5-x" ทุกจุดอ้างถูก; naming `CH05-Syy-*` ตรงกับ Step
4. กล่อง Known limitation M-11 ถูกต้องตาม PROJECT_PLAN หัวข้อ 9 และบทที่ 1
5. overclaim / คำสอนที่ผู้อ่านทำตามแล้วอาจติด; ภาษาไทยอ่านง่าย ศัพท์เทคนิคสม่ำเสมอ

ตอบรูปแบบเดิม: Verdict (PASS/REVISE/BLOCKED), Mandatory findings (ตาราง มี ID ตำแหน่ง ข้อค้นพบ สิ่งที่ต้องแก้), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้ — ภาษาไทย
