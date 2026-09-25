# Phase 3 — บทที่ 4 review request (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb บทที่ 1–3 `PASS` แล้ว บทนี้คือ **บทที่ 4 ชุดข้อมูล Workshop**: [`manuscript/chapter-04.md`](../../manuscript/chapter-04.md) มี Step ปฏิบัติ 5 Step (ใช้มาตรฐาน 12 หัวข้อของ PROJECT_PLAN) และหัวข้ออ้างอิง 4.1, 4.6–4.8

Source of truth: `PROJECT_PLAN.md` (บทที่ 4, มาตรฐาน Step, กฎภาพ), `review/PHASE1_DESIGN_PLAN.md` (2.0, 2.1, 2.1.1, 2.2.1, 3), `specs/DualLine_PlotData_PowerQuery.pq`, `dax/workshop-measures.dax`, `data/*.csv`

ภาพ: `images/chapter-04/CH04-S*.png` 10 ภาพ (4-1 ถึง 4-10) ภาพหน้าจอจริง Power BI Desktop 2.157.1354.0 + Deneb 2.0.0.0 ที่ผู้ใช้จับ 25 ก.ย. 2026 ปิดชื่อบัญชีแล้วในภาพที่มีบัญชี (ถ้าเห็นชื่อบัญชีในภาพใดให้ระบุ Mandatory) ภาพ 4-9 ตัดฝั่งขวาของหน้าจอ (มีหน้าต่างอื่นค้างซ้าย) caption ระบุแล้ว

หลักฐานตัวเลข: `qa/scripts/run-ch04-claims-check.mjs` คำนวณซ้ำจาก CSV โดยไม่ใช้อัลกอริทึมของโครงการ ยืนยัน: 11 ช่วง = B 9 + C 2 + A 0, แถว Fill 40 (Boundary 22, Crossing 18), รวม 52, ตัวอย่าง ม.ค.-ก.พ. t=0.4 pos=1.4 val=404, แบบฝึกหัด ก.พ.-มี.ค. pos=2.5 (8 ผ่าน) ผล Power Query จริง 12 COLUMNS 52 ROWS ตรงกับภาพ 4-4

## ข้อสมมติ/ข้อจำกัดที่ผู้เขียนแจ้งในบท — ขอให้ตรวจว่า overclaim หรือไม่

1. Step 1 ข้อ 3 "กดลูกศรข้างปุ่ม Load แล้วเลือก Transform Data" ผู้เขียนไม่เห็นภาพเมนูนี้ (มีทางเลือกสำรอง Home > Transform data)
2. ตาราง 4.7 กรณีข้อมูล (ค่าว่าง→0, Category ซ้ำ, Business_Type ไม่ถูกต้อง, Settings ไม่ใช่ 1 แถว) ระบุ "ยังไม่ได้ทดสอบบน Power Query จริง" — ตรวจว่าบทสื่อสารชัดและไม่ overclaim
3. เหตุผลที่ `Actual`/`Reference` เป็น Sum (ให้ Deneb สร้าง `__highlight`) อ้างจาก Design Plan/Phase 2 — ตรวจกับ Design Plan
4. เหตุผล Relationship ใช้ `Filter_Key` และ Both อ้างจาก Design Plan 2.2.1 และหลักฐาน T18 — ตรวจ
5. ข้อความเรื่อง Privacy Levels (Step 2 ข้อ 10) ผู้เขียนไม่พบในการทดสอบ
6. ภาพ 4-6 เห็นปุ่ม ✕ ✓ ข้างแถบสูตร แต่ measure ปรากฏในช่อง Data แล้ว (caption ระบุตามที่เห็น)
7. ภาพ 4-8 ริบบิ้นเป็น Column tools ของ Segment_ID (caption ระบุว่าไม่เกี่ยวกับขั้นตอน)

## ขอให้ตรวจ

1. ความถูกต้องของข้อเท็จจริงเทียบภาพ/โค้ด M/DAX/Design Plan: ชื่อ query, ชื่อคอลัมน์, error code (`DualLine.DuplicateCategory` ฯลฯ), ตัวเลข 52/40/22/18, สามกรณี A/B/C, Filter_Key, Business_Type
2. มาตรฐาน Step 12 หัวข้อครบทุก Step; ลำดับขั้นตอนทำตามได้จริง
3. เลข "ภาพ 4-x" ทุกจุดอ้างถูก; naming `CH04-Syy-*` ตรงกับ Step (Step 1..5)
4. ความครบตาม PROJECT_PLAN บทที่ 4 (โครงสร้างตาราง, ที่มา field, Test scenarios, DAX measures พื้นฐานแยกจาก PlotData, measure `DualLine Row Count`, วิธีผูก field: Plot_*/Run_Sign/Sort_Order = Don't summarize, Actual/Reference = Sum)
5. Overclaim / คำสอนที่ผู้อ่านทำตามแล้วอาจติด; ภาษาไทยอ่านง่าย ศัพท์เทคนิคสม่ำเสมอ

ตอบรูปแบบเดิม: Verdict (PASS/REVISE/BLOCKED), Mandatory findings (ตาราง มี ID ตำแหน่ง ข้อค้นพบ สิ่งที่ต้องแก้), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้ — ภาษาไทย
