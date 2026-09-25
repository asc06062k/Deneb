# Phase 3 — บทที่ 2 review request (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb บทที่ 1 `PASS` แล้ว (`review/chapters/CH01_CODEX_VERDICT_R2.md`) บทนี้คือ **บทที่ 2 เตรียม Power BI และ Deneb**: [`manuscript/chapter-02.md`](../../manuscript/chapter-02.md) เป็นบทแรกที่มี Step ปฏิบัติ (5 Step)

Source of truth: `PROJECT_PLAN.md` (บทที่ 2, "มาตรฐานต่อหนึ่ง Step" 12 หัวข้อ, มาตรฐานภาพ, Definition of Done ต่อบท), `data/DualLineVariance_Workshop_Data.csv`

ภาพ: `images/chapter-02/CH02-S*.png` รวม 18 ภาพ (ภาพ 2-1 ถึง 2-18) เป็นภาพหน้าจอจริงจาก Power BI Desktop 2.157.1354.0 + Deneb 2.0.0.0 ที่ผู้ใช้จับ 25 ก.ย. 2026 ปิดชื่อบัญชีมุมขวาบนแล้ว (ผู้เขียนเปิดตรวจบางภาพเท่านั้น ถ้าเห็นชื่อบัญชีในภาพใดให้ระบุเป็น Mandatory) ภาพที่แสดงข้อมูลผูกเฉพาะ `Category` และ `Actual` ของตาราง `DualLineVariance_Workshop_Data` (12 แถว) ภาพ 2-7 (Show as a table) ถ่ายหลังสร้าง spec ใน Step 4 caption ระบุไว้แล้ว

## ข้อสมมติที่ผู้เขียนยังไม่ได้ทดสอบบนเครื่องจริง — ขอให้ตรวจเป็นพิเศษว่า overclaim หรือไม่

1. ทางลัด `Ctrl+Enter` (Apply) และ `Ctrl+Shift+Enter` (Auto-apply) อ้างจาก deneb.guide/docs/visual-editor (บทระบุว่ายังไม่ทดสอบ)
2. ปุ่มไอคอนถุงบนการ์ด Deneb ใน AppSource คือปุ่ม Add (อนุมานจากข้อความในหน้าต่างเดียวกัน) และขั้นตอนหลังกด Add ไม่มีภาพ
3. ปุ่ม **Convert my spec to Vega** "แปลงเป็น Vega ถาวร" — อนุมานจากชื่อปุ่ม
4. การตั้ง `Actual` เป็น **Don't summarize** ในช่อง Values (อนุมานจากที่ภาพแสดง `Actual` แทน `Sum of Actual`) — บทยังไม่ได้บอกวิธีตั้งเป็นขั้นตอน
5. คำอธิบายหน้าที่ของแท็บ Data / Signals / Logs และ Config (บางส่วนมาจากภาพ บางส่วนมาจากเอกสาร)
6. คำอธิบาย template `Simple bar chart` ในแบบฝึกหัด Step 4 (ไม่มีภาพหน้าจับคู่ของ template นี้)
7. ตัวอย่าง JSON ใน Step 4 เป็นข้อความที่ตัดจากบรรทัด 1–11 ของ spec ที่เห็นในภาพ 2-11 ไม่ใช่ไฟล์เต็มของ template

## ขอให้ตรวจ

1. ความถูกต้องของข้อเท็จจริงและเทียบกับภาพ: ชื่อปุ่ม/แท็บ/เมนูตรงกับภาพหรือไม่ ตัวเลข (12 แถว, ค่า Actual/Reference, Vega-Lite 6.4.3, DENEB 2.0.0.0) ตรงกับภาพและ CSV หรือไม่ เลขภาพและคำอ้างอิง "ภาพ 2-x" ทุกจุดชี้ถูกภาพหรือไม่
2. มาตรฐาน Step 12 หัวข้อ: ครบทุก Step หรือไม่ (Step ที่ไม่มี JSON ระบุ "ไม่มี" เหมาะสมหรือไม่)
3. ความเหมาะสมของการใช้ template ในตัวของ Deneb ("Interactive bar chart") ใน Step 4 แทนไฟล์ spec ของเล่ม
4. ความเสี่ยง overclaim หรือคำสอนที่ผู้อ่านทำตามแล้วอาจติด (เช่น ขั้นตอน Don't summarize, ขั้นตอนติดตั้ง AppSource, การวาง Visual บนหน้า)
5. กฎภาพ: caption ระบุภาพจริงชัดเจน, naming `CHxx-Syy-*`, ภาพตรงกับข้อความ
6. ภาษาไทยอ่านง่าย ศัพท์เทคนิคเป็นอังกฤษสม่ำเสมอ

ตอบรูปแบบ: Verdict (PASS/REVISE/BLOCKED), Mandatory findings (ตาราง มี ID, ตำแหน่ง, ข้อค้นพบ, สิ่งที่ต้องแก้), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้ — ภาษาไทย
