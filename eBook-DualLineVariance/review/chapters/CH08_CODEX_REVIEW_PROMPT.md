# Phase 3 — บทที่ 8 review request (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb บทที่ 1–7 `PASS` แล้ว บทนี้คือ **บทที่ 8 Cross-filtering และ Cross-highlighting**: [`manuscript/chapter-08.md`](../../manuscript/chapter-08.md) มี 5 Step (มาตรฐาน 12 หัวข้อ) spec ใหม่ไฟล์เดียว `specs/steps/CH08-S01-cross-highlight-opacity.vl.json` (= final spec) ใช้ใน Step 3 Step อื่นตั้งค่าใน Power BI/Deneb

Source of truth: `PROJECT_PLAN.md` (บทที่ 8, กฎภาพ), `review/PHASE1_DESIGN_PLAN.md` (หัวข้อ 2.2.x, 2.2.2 Area-click, 2.2.3 ค่า highlightStatus จริง), `qa/PHASE2_EVIDENCE_RECORD_TEMPLATE.md` (T18 ถึง T22, T30), `specs/steps/*`, `manuscript/chapter-04.md`

ภาพ `images/chapter-08/` 17 ภาพ ภาพหน้าจอจริง (Power BI 2.157.1354.0 + Deneb 2.0.0.0 ผู้ใช้จับ 26 ก.ย. 2026) ปิดชื่อบัญชีมุมขวาบนด้วยสี่เหลี่ยมสีเดียวกับแถบชื่อ (ถ้าเห็นชื่อบัญชีให้ระบุ Mandatory) ภาพ 8-3 และ 8-6 ยังเห็นช่อง Values เป็น `Sum of Actual` และ 8-6 มี `__selected__` = off (มี selection ค้าง) caption ระบุแล้วว่าจะถ่ายใหม่ ตรวจว่ายอมรับได้ชั่วคราว/ควรเป็น Mandatory

หลักฐาน: `qa/scripts/run-ch08-claims-check.mjs` (24 ผ่าน) รวมการ **รันนิพจน์ opacity จริง** กับแถวจำลองของ Deneb (neutral / เลือก ก.ค. / multi-select / off / ชื่อ `Sum of Actual__...` ผิด) ยืนยันพฤติกรรมที่บทเล่า

## เหตุการณ์สำคัญที่ต้องตรวจ (พบระหว่างทดสอบบทนี้)

1. **บั๊กต้นทาง**: ภาพ 8-12 ครั้งแรกไม่จางเลย สาเหตุ: บทที่ 4 Step 4 เดิมสั่งให้ไม่เปลี่ยนชื่อแถบ `Sum of Actual`/`Sum of Reference` ทำให้ Deneb ตั้งชื่อคอลัมน์ `Sum of Actual__highlight` แต่ spec อ้าง `Actual__highlight` (ยืนยันจากไฟล์ pbix: nativeQueryRef = `Sum of Actual`) แก้โดยสั่ง Rename เป็น `Actual`/`Reference` ใน **บทที่ 4** (Step 4 ข้อ 4, ตารางหัวข้อ Step 4, ผลลัพธ์, วิธีตรวจ, ปัญหาที่อาจพบ, เฉลยข้อ 4, จุดตรวจ) ผู้ใช้ทำตามแล้วภาพ 8-12 จางถูกต้อง ตรวจ diff ของบทที่ 4 ว่าสอดคล้อง ไม่ขัดกับบทที่ 2/3/5 และไม่มี overclaim (ข้อความ "Rename for this visual" เป็นชื่อเมนูของ Power BI ที่ผู้เขียนไม่ได้ตรวจบนเครื่องโดยตรง ผู้ใช้ทำได้ผลตามภาพ) ภาพ 4-7/4-8 ยังเป็นภาพก่อน Rename (caption ระบุว่าจะถ่ายใหม่)
2. **เปลี่ยน opacity พื้นที่สี Good/Bad เป็น 0.15 ทั้งเล่ม** (คำตัดสินผู้ใช้ 26 ก.ย. 2026 เดิม 0.35) แก้ final spec, static-test spec, template, generator รันใหม่ 11 Step (เปลี่ยนเฉพาะบรรทัด opacity 9 ไฟล์) ผ่าน `run-workshop-step-tests.mjs` 464/464, `run-phase2-static-tests.mjs` 50/50, axis overlap sim ไม่ทับ แก้บทที่ 6 (โค้ด คำอธิบาย แบบฝึกหัด) และเพิ่มกล่องหมายเหตุ "ภาพถ่ายก่อนเปลี่ยน opacity" ในบทที่ 6, 7, 8 ตรวจว่าครบและไม่ขัดกัน
3. ผล Area-click (ภาพ 8-5) และ Context menu สรุปจากหลักฐาน Phase 2 (ผู้ใช้ตัดสินให้ยอมรับพฤติกรรมเดือนต้นช่วง) ภาพ 8-15 ไม่เห็นไอคอน Edit interactions (บทยืนยันโหมด None จากผลของ Deneb) ตรวจ overclaim
4. ข้อความ `isDefined(null)` = จริง อ้างตามนิยาม Vega expression (`value !== undefined`) ตรวจกับเอกสาร Vega
5. แบบฝึกหัดทุก Step ยังไม่ได้ลองใน Deneb จริง (บทระบุ)

## ขอให้ตรวจ

1. ข้อเท็จจริงเทียบ spec/ภาพ/หลักฐาน Phase 2: ชื่อหมวดและสวิตช์ใน Project setup, ค่า status `on` ทุกแถวขณะ highlight, เงื่อนไข opacity ของจุด/ป้าย/Connector, เส้นและพื้นที่ไม่จาง, ผลของ Filter (ภาพ 8-14) และ None, Context menu
2. มาตรฐาน Step 12 หัวข้อ ขั้นตอนทำตามได้ ลำดับภาพและ caption ตรงกับภาพจริง (8-1 ถึง 8-17), เลขภาพต่อเนื่อง
3. กฎ PROJECT_PLAN บทที่ 8: ต้นทาง Highlight = Clustered column/bar chart ห้าม Slicer, แยกชัดว่า Cross-filter กับ Cross-highlight เป็นคนละกลไก, ตั้ง Edit interactions
4. ความสอดคล้องกับบทที่ 4 (หลังแก้), 6, 7
5. overclaim; ภาษาไทยอ่านง่าย

ตอบรูปแบบเดิม: Verdict (PASS/REVISE/BLOCKED), Mandatory findings (ตาราง), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้ — ภาษาไทย
