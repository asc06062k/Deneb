# Phase 3 — บทที่ 3 review request (สำหรับ Codex CLI)

คุณคือผู้รีวิวอิสระของ eBook สอนสร้าง Dual-Line Variance Chart ด้วย Deneb บทที่ 1 และ 2 `PASS` แล้ว บทนี้คือ **บทที่ 3 โครงสร้างภาษา Vega-Lite ที่ต้องรู้**: [`manuscript/chapter-03.md`](../../manuscript/chapter-03.md) เป็นบทอ้างอิงภาษา (ไม่มี Step ปฏิบัติใน Power BI จึงไม่ใช้มาตรฐาน 12 หัวข้อ ตัวอย่างสั้นรันได้จริง)

Source of truth: `PROJECT_PLAN.md` (บทที่ 3: `$schema`, `data`/`dataset`, `mark`, `encoding`, `field`/`type`, `scale`, `axis`, `layer`, `transform` (`calculate`, `filter`), `condition`, `params`(selection) — อธิบายทีละคอมโพเนนต์แบบเห็นภาพ พร้อมตัวอย่างสั้นที่รันได้จริง), เอกสาร Vega-Lite, `manuscript/chapter-02.md` (ภาพ 2-x ที่บทนี้อ้าง), `data/DualLineVariance_Workshop_Data.csv`

หลักฐานการทดสอบ: `qa/scripts/run-ch03-example-tests.mjs` อ่านบล็อก ```json ทั้ง 9 ชิ้นจากบท compile กับ Vega-Lite 6.4.3 / Vega 6.4.0 จริงและ render headless ด้วยข้อมูล Workshop ผล 65 ผ่าน 0 ไม่ผ่าน (รันซ้ำได้: `npm install --prefix <tmp> vega@6 vega-lite@6 sharp` แล้ว `VEGA_NODE_MODULES=<tmp>/node_modules node qa/scripts/run-ch03-example-tests.mjs`) ภาพ `images/chapter-03/CH03-S*.png` 9 ภาพสร้างจากสคริปต์เดียวกัน (ไม่ใช่ภาพหน้าจอ Power BI) caption ระบุชัดแล้ว

## ข้อจำกัด/ข้อสมมติที่ผู้เขียนแจ้งในบท — ขอให้ตรวจว่า overclaim หรือไม่

1. "วิธีลองตัวอย่างในบทนี้" (หัวข้อ 3.1) ผู้เขียน **ยังไม่ได้ทดสอบบน Deneb Editor จริง** ว่าผูก 4 field แล้ว dataset ออก 12 แถวและชื่อ field ตรงตามตัวอย่าง (ต้องผ่าน Rename for this visual ตามบทที่ 2)
2. ตัวอย่าง selection (`CH03-S09-param-selection`) ผู้เขียนตรวจเฉพาะสถานะเริ่มต้น (ทุกแท่ง opacity 1 เพราะ empty selection = all selected) ไม่ได้จำลองการชี้เมาส์ บทระบุแล้ว
3. ข้อความว่า spec ที่ Deneb สร้างในบทที่ 2 ไม่มี `$schema` อิงจากภาพ 2-12 (บรรทัดบนสุด) เท่านั้น
4. ข้อความว่า Deneb เติม `__row__`, `__selected__` และ `<ชื่อ>__highlight` อิงจากภาพ 2-12/2-13
5. ข้อความว่า selection ของ Vega-Lite ไม่ส่งผลไปยัง Visual อื่น (Cross-filter ใช้กลไก Deneb ในบท 8) — ขอให้ตรวจกับเอกสาร Deneb ว่าถูกต้องและไม่ overclaim
6. ตารางท้ายบท "ที่ไหนในเล่มนี้ใช้อะไร" อ้างจาก PROJECT_PLAN และ final spec — ขอให้ตรวจกับ `specs/dual-line-variance-final.vl.json` และ `specs/steps/` ว่าตรง

## ขอให้ตรวจ

1. ความถูกต้องของคำอธิบายภาษา Vega-Lite (`mark`, `type`, `sort` แบบ `{field, op}`, `scale.domain`, `axis`, `layer`, `transform`, `condition`, `params` ทั้งตัวแปรและ selection) เทียบเอกสารทางการ
2. ตัวอย่างและภาพตรงกับข้อความ (ตัวเลข เช่น 11 แท่ง, เขียว 7 ส้ม 5, เส้น target 500) และเลข "ภาพ 3-x" / "ภาพ 2-x" ทุกจุดอ้างถูก
3. ความครบตามรายการใน PROJECT_PLAN บทที่ 3 (มี `$schema` ไหม — บทเลือกอธิบายว่า Deneb spec ไม่มี ตรวจว่าสมเหตุสมผลกับข้อความ "อธิบายทุกคอมโพเนนต์" หรือควรมีหัวข้อ `$schema` สั้นๆ)
4. กฎภาพ: caption ระบุ "ไม่ใช่ภาพหน้าจอ Power BI" ชัด, naming `CHxx-Syy-*` (บทนี้ไม่มี Step จึงใช้เลขหัวข้อ 3.x แทน yy — เหมาะสมหรือไม่)
5. overclaim / คำสอนที่ผู้อ่านทำตามแล้วติด; ความสม่ำเสมอของศัพท์เทคนิค ภาษาไทยอ่านง่าย

ตอบรูปแบบเดิม: Verdict (PASS/REVISE/BLOCKED), Mandatory findings (ตาราง มี ID ตำแหน่ง ข้อค้นพบ สิ่งที่ต้องแก้), Optional improvements, คำถามที่ต้องรอหลักฐานจากผู้ใช้ — ภาษาไทย
